import Ember from 'ember';
import { get, set } from "@ember/object";
import { throttle } from "@ember/runloop";
import config from '../config/environment';

export default Ember.Component.extend({

  classNames: ['edit-track border'],

  filenames: config.audioFileNames,
  directory: config.audioDirectory,

  canSave: true,

  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'sampler');
  },

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
    },

    switchInterface(name) {
      set(this, 'visibleInterface', name);
      this.$().find('.interface-switches .btn').removeClass('active');
      this.$(`.interface-switches .${name}`).addClass('active');
    }
  }
});
