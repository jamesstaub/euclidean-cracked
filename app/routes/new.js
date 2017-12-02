import Ember from 'ember';
import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

const {
  get,
} = Ember;

export default Ember.Route.extend({

  actions: {
    async save(title, body) {
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
      user = await getOrCreateUser(
        uid,
        get(this, 'session.currentUser.displayName'),
        get(this, 'session.currentUser.profileImageURL'),
        this.store
      );

      await user.get('posts').addObject(post);
      post = await post.save();
      await user.save();
      return this.transitionTo('posts', get(post, 'slug'));

    }
  }
});
