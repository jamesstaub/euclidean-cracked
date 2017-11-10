import Ember from 'ember';
import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';


const {
  get,
  debug
} = Ember;

export default Ember.Route.extend({

  model(param) {
    return this.store.query('post', {
      orderBy: 'slug',
      equalTo: param.slug
    });
  },

  actions: {
    delete(post) {
      post.deleteRecord();
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

    createTrack(post, filename, hits, steps, offset) {

      let track = this.store.createRecord('track', {
        filename, hits, steps, offset,
      });

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
      let uid = author.get('uid');
      user = getOrCreateUser(uid,
        get(this, 'session.currentUser.uid'),
        get(this, 'session.currentUser.profileImageURL'),
        this.store);

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

    }
  }
});
