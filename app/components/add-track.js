import Ember from 'ember';
import { get } from "@ember/object";

export default Ember.Component.extend({
  actions: {
    createTrack(filename, hits, steps, offset) {
      let post = this.get('post');
      // mock default vals
      hits, steps, offset = 3;
      get(this, 'onCreateTrack')(post, filename, hits, steps, offset)

      this.setProperties({
        filename, hits, steps, offset, post
      });
    }
  }
});
