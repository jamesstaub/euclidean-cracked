import { inject as service } from '@ember/service';

import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

import { get, set } from '@ember/object';
import { debug } from '@ember/debug';
import Route from '@ember/routing/route';

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

  // FIXME exit() is a private method.
  // for some reason willTransition() does not fire
  exit() {
    this.removeUser();
  },

  addPostActiveUser(model) {
    let post = model.get('firstObject');
    set(this, 'post', post);

    let user = getOrCreateUser(get(this, 'session.currentUser'), this.store);

    user.then(user => {
      set(user, 'online', true);

      post.get('activeUsers').pushObject(user);

      user.save().then(user => {
        set(this, 'session.currentUserModel', user);
        post.save();
      });
    });
  },

  removeUser() {
    let post = get(this, 'post');
    let user = get(this, 'session.currentUserModel');
    get(post, 'activeUsers').then(activeUsers => {
      activeUsers.removeObject(user);
      post.save().then(() => {
        user.save();
      });
    });
  },

  actions: {
    delete(post) {
      let tracks = get(post, 'tracks');

      post.destroyRecord().then(() => {
        // TODO: how to actually delete all associated tracks?
        // install cascade-delete?
        tracks.forEach(t => t.unloadRecord());
      });
    },

    save(post) {
      let slug = cleanURI(post.get('title'));

      post.set('slug', slug);
      post.save().then(post => {
        this.transitionTo('posts', get(post, 'slug'));
      });
    },

    createTrack(post) {
      // TODO: instead of setting defaults here, just use
      // defaults on the model
      let track = this.store.createRecord('track', {
        postCreatorUid: get(post, 'creator.uid'),
        publicEditable: get(post, 'publicEditable')
      });

      post.get('tracks').addObject(track);

      return track
        .save()
        .then(() => {
          debug('track saved succesfully');
          return post.save();
        })
        .catch(error => {
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
      user = getOrCreateUser(get(author, 'uid'), this.store);

      user.then(userData => {
        userData.get('comments').addObject(comment);
        post.get('comments').addObject(comment);

        return comment
          .save()
          .then(() => {
            debug('comment saved succesfully');
            return post.save();
          })
          .catch(error => {
            debug(`comment:  ${error}`);
            comment.rollbackAttributes();
          })
          .then(() => {
            debug('post saved successfuly');
            return userData.save();
          })
          .catch(error => {
            debug(`post:  ${error}`);
            post.rollbackAttributes();
          })
          .then(() => {
            debug('user saved successfuly');
          })
          .catch(error => {
            debug(`user:  ${error}`);
            user.rollbackAttributes();
          });
      });
    }
  }
});
