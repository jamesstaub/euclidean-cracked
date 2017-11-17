import Ember from 'ember';
import { get, set } from "@ember/object";
import { throttle } from "@ember/runloop";

export default Ember.Component.extend({

  classNames: ['edit-track'],
  filenames: ['test.wav', 'drums.wav'],
  actions: {
    updateFilename(track, filename) {
      track.set('filename', filename.value);
      throttle(track, 'save', 300);
    },

    updateSequenceParam(track, parameter, value) {
      // TODO: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      track.set(parameter, value);
      track.save();
    },

    setTrackSequence(track, sequence){
      set(this, 'sequence', sequence);
    },

    deleteTrack(track) {
      track.destroyRecord();
    }
  }
});
