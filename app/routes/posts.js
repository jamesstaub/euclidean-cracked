import Ember from 'ember';
import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

const {
  get,
  set,
  debug,
  Route,
  inject: { service },
} = Ember;

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

  exit() {
    this.removeUser();
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
      set(this, 'user', user);
      user.save().then(()=>{
        user.ref().child('online').onDisconnect().set(false);
        post.save();
      });
    });
  },

  removeUser() {
    let post = get(this, 'post');
    let user = get(this, 'user');
    get(post, 'activeUsers').then((activeUsers)=>{
      activeUsers.removeObject(user);
      post.save()
      .then(()=>{
        user.save();
      })
    });
  },

  actions: {
    delete(post) {
      post.deleteRecord();

      this.get('store').query('track', {
        filter: {
          post: post.id
        }
      })
      .then((tracks)=>{
        tracks.forEach((track)=>{
          track.destroyRecord();
        });
      })

      post.save();
      this.transitionTo('index');
    },
    save(post) {
      let slug = cleanURI(post.get('title'));

      post.set('slug', slug);
      post.save()
      .then((post)=> {
        this.transitionTo('posts', get(post, 'slug'));
      });
    },

    createTrack(post) {
      // TODO: instead of setting defaults here, just use
      // defaults on the model
      let track = this.store.createRecord('track');

      post.get('tracks').addObject(track)

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
        })
    },

    createComment(author, body, post) {
      let user = null;
      let comment = this.store.createRecord('comment', {
        body: body
      });

      //TODO verify use of user_id vs session uid
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
  }
});
