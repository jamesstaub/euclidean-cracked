import Ember from 'ember';
import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

const {
  get,
} = Ember;

export default Ember.Route.extend({

  actions: {
    async save(title, publicEditable, publicVisible) {
      let user = null;
      let slug = cleanURI(title);
      let date = new Date();
      let post = this.store.createRecord('post', {
        title, publicEditable, publicVisible, slug, date
      });

      // TODO: get auth type here
      // allow custom username for anonymous or google auth
      user = await getOrCreateUser(
        get(this, 'session.currentUser'),
        this.store
      );

      await user.get('posts').addObject(post);
      post = await post.save();
      await user.save();
      return this.transitionTo('posts', get(post, 'slug'));

    }
  }
});
