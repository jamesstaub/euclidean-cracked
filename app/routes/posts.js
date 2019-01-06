import { inject as service } from '@ember/service';

import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

import { get, set } from "@ember/object";
import { debug } from "@ember/debug";
import Route from "@ember/routing/route";

export default Route.extend({
  session: service(),

  model(param) {
    return this.store.query('post', {
      orderBy: 'slug',
      equalTo: param.slug
    });
  },

  afterModel(model) {
    this.addPostActiveUser(model);
  },

  setupController(controller, model) {
    this._super(controller, model);
  },

  addPostActiveUser(model) {
    let post = model.get('firstObject');
    set(this, 'post', post);

    let user = getOrCreateUser(
      get(this, 'session.currentUser'),
      this.store
    );

    user.then((user) => {
      set(user, 'online', true);

      post.get('activeUsers').pushObject(user);

      user.save().then((user)=>{
        set(this, 'session.currentUserModel', user);
        post.save();
      });
    });
  },

  removeUser() {
    let post = this.post;
    let user = get(this, 'session.currentUserModel');
    get(post, 'activeUsers').then((activeUsers)=>{
      activeUsers.removeObject(user);
      post.save()
      .then(()=>{
        user.save();
      });
    });
  },

  actions: {
    async delete(post) {
      let tracks = await post.tracks.toArray();
      for (const track of tracks) {
        const customFunction = await track.customFunction;
        // TODO: delete customFunction with cloud Function
        // since validation prevents deletion
        // await customFunction.destroyRecord();
        await track.destroyRecord();
      }
      await post.destroyRecord();
      this.transitionTo('new');
    },

    save(post) {
      let slug = cleanURI(post.get('title'));

      post.set('slug', slug);
      post.save()
      .then((post)=> {
        this.transitionTo('posts', get(post, 'slug'));
      });
    },

    async createTrack(post) {

      let customFunction = this.store.createRecord('customFunction', {
        postCreatorUid: get(post, 'creator.uid'),
      });

      await customFunction.save();

      // TODO: instead of setting defaults here, just use
      // defaults on the model
      let track = this.store.createRecord('track', {
        postCreatorUid: get(post, 'creator.uid'),
        publicEditable: get(post, 'publicEditable'),
        customFunction: customFunction
      });

      track.set('customFunction', customFunction);

      post.get('tracks').addObject(track);

      return track.save()
        .then(()=>{
          debug('track saved succesfully');
          return post.save();
        })
        .catch((error) => {
          debug(`track:  ${error}`);
          track.rollbackAttributes();
        })
        .then(() => {
          debug('post saved successfuly');
        });
    },

    createComment(author, body, post) {
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
        post.get('comments').addObject(comment);

        return comment.save().then(() => {
            debug('comment saved succesfully');
            return post.save();
          })
          .catch((error) => {
            debug(`comment:  ${error}`);
            comment.rollbackAttributes();
          })
          .then(() => {
            debug('post saved successfuly');
            return userData.save();
          })
          .catch((error) => {
            debug(`post:  ${error}`);
            post.rollbackAttributes();
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
