import Component from '@ember/component';
import { set } from '@ember/object';
import config from '../config/environment';

export default Component.extend({
  // FIXME: rethink filenames
  directory: config.audioDirectory,

  didReceiveAttrs() {
    this._super(...arguments);
  },

  actions: {
    setCurrentPost(post) {
      set(this, 'currentPost', post);
    }
  }
});
