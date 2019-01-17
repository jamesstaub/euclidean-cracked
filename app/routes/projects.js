import { inject as service } from '@ember/service';

import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

import { get, set } from "@ember/object";
import { debug } from "@ember/debug";
import Route from "@ember/routing/route";

export default Route.extend({
  session: service(),

  model(param) {
    return this.store.query('project', {
      orderBy: 'slug',
      equalTo: param.slug
    });
  },

  afterModel(model) {
    this.addProjectActiveUser(model);
  },

  setupController(controller, model) {
    this._super(controller, model);
  },

  addProjectActiveUser(model) {
    let project = model.get('firstObject');
    set(this, 'project', project);

    let user = getOrCreateUser(
      get(this, 'session.currentUser'),
      this.store
    );

    user.then((user) => {
      set(user, 'online', true);

      project.get('activeUsers').pushObject(user);

      user.save().then((user)=>{
        set(this, 'session.currentUserModel', user);
        project.save();
      });
    });
  },

  removeUser() {
    let project = this.project;
    let user = get(this, 'session.currentUserModel');
    get(project, 'activeUsers').then((activeUsers)=>{
      activeUsers.removeObject(user);
      project.save()
      .then(()=>{
        user.save();
      });
    });
  },

  actions: {
    async delete(project) {
      let tracks = await project.tracks.toArray();
      for (const track of tracks) {
        await track.destroyRecord();
      }
      await project.destroyRecord();
      this.transitionTo('new');
    },

    save(project) {
      let slug = cleanURI(project.get('title'));

      project.set('slug', slug);
      project.save()
      .then((project)=> {
        this.transitionTo('projects', get(project, 'slug'));
      });
    },

    async createTrack(project) {
      let customFunction = this.store.createRecord('customFunction', {
        projectCreatorUid: get(project, 'creator.uid'),
      });

      await customFunction.save();

      // TODO: instead of setting defaults here, just use
      // defaults on the model
      let track = this.store.createRecord('track', {
        projectCreatorUid: get(project, 'creator.uid'),
        publicEditable: get(project, 'publicEditable'),
        customFunction: customFunction,
      });

      track.set('customFunction', customFunction);

      project.get('tracks').addObject(track);

      return track.save()
        .then(()=>{
          debug('track saved succesfully');
          return project.save();
        })
        .catch((error) => {
          debug(`track:  ${error}`);
          track.rollbackAttributes();
        })
        .then(() => {
          debug('project saved successfuly');
        });
    },

    createComment(author, body, project) {
      let user = null;
      let comment = this.store.createRecord('comment', {
        body: body
      });

      // TODO verify use of user_id vs session uid
      user = getOrCreateUser(
        get(author, 'uid'),
        this.store
      );

      user.then((userData) => {
        userData.get('comments').addObject(comment);
        project.get('comments').addObject(comment);

        return comment.save().then(() => {
            debug('comment saved succesfully');
            return project.save();
          })
          .catch((error) => {
            debug(`comment:  ${error}`);
            comment.rollbackAttributes();
          })
          .then(() => {
            debug('project saved successfuly');
            return userData.save();
          })
          .catch((error) => {
            debug(`project:  ${error}`);
            project.rollbackAttributes();
          })
          .then(() => {
            debug('user saved successfuly');
          })
          .catch((error) => {
            debug(`user:  ${error}`);
            user.rollbackAttributes();
          });
      });
    },
    willTransition() {
      this.removeUser();
    }
  }
});
