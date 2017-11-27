import Ember from 'ember';
import { get, set } from "@ember/object";
import { throttle } from "@ember/runloop";
import config from '../config/environment';

export default Ember.Component.extend({

  classNames: ['edit-track'],
  canSave: true,

  filenames: config.audioFileNames,
  directory: config.audioDirectory,

  actions: {
    updateFilename(track, filename) {
      track.set('filename', filename.value);
      throttle(track, 'save', 600);
    },

    updateSequenceParam(track, parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      track.set(parameter, value);

      if (get(this, 'canSave')) {
        let onSave = track.save();
        onSave.then(()=>{
          set(this, 'canSave', true);
        });
        set(this, 'canSave', false);
      }
    },

    setTrackSequence(track, sequence){
      set(this, 'sequence', sequence);
    },

    deleteTrack(track) {
      track.destroyRecord();
    }
  }
});
