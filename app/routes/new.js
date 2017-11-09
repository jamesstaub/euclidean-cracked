import Ember from 'ember';
import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

const {
  get,
  set
} = Ember;

export default Ember.Route.extend({
  actions: {
    save(title, body) {
      let user = null;
      let slug = cleanURI(title);
      let uid = get(this, 'session.uid');
      let date = new Date();
      let post = this.store.createRecord('post', {
        title: title,
        body: body,
        author: 'test',
        slug: slug,
        date: date
      });

      // TODO: get auth type here
      // allow custom username for anonymous or google auth
      // TODO make sure display name is saving correctly
      user = getOrCreateUser(uid, get(this, 'session.currentUser.displayName'),
        get(this, 'session.currentUser.profileImageURL'),
        this.store);

      user.then((userData) => {
        userData.get('posts').addObject(post);
        post.save().then(() => {
          return userData.save();
        });

      });

      set(this, 'title', '');
      set(this, 'body', '');
      this.transitionTo('index');
    }
  }
});
