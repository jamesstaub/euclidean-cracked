import Ember from 'ember';
import { get } from "@ember/object";

export default Ember.Component.extend({
  actions: {
    createTrack(filename, hits, steps, offset) {
      let post = get(this, 'post');
      // mock default vals
      filename = 'test.wav';
      hits = 3;
      steps = 8
      offset = 0;
      get(this, 'onCreateTrack')(post, filename, hits, steps, offset)

      this.setProperties({
        filename, hits, steps, offset, post
      });
    }
  }
});
