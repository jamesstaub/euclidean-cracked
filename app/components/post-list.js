import Component from '@ember/component';
import { set } from '@ember/object';

export default Component.extend({

  didReceiveAttrs() {
    this._super(...arguments);
  },

  actions: {
    setCurrentPost(post) {
      set(this, 'currentPost', post);
    }
  }
});
