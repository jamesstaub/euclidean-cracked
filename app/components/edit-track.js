import Component from '@ember/component';
import { get, set } from '@ember/object';
import config from '../config/environment';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['edit-track border'],

  filenames: config.audioFileNames,
  // FIXME: rethink filenames

  canSave: true,
  uiStepSize: 40, // todo

  gainSliderSize: [20, 100],

  sampleFolder: computed('config.audioDirectory', {
    get() {
      fetch(config.SAMPLE_DIRECTORY).then(directory => {
        debugger;
      });
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'rhythm');
  },

  actions: {
    updateFilename(track, filename) {
      track.set('filename', filename.value);
      track.save();
    },

    updateSequenceParam(track, parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      track.set(parameter, value);

      if (get(this, 'canSave')) {
        let onSave = track.save();
        onSave.then(() => {
          set(this, 'canSave', true);
        });
        set(this, 'canSave', false);
      }
    },

    setTrackSequence(track, sequence) {
      set(this, 'sequence', sequence);
    },

    deleteTrack(track) {
      track.destroyRecord();
    },

    switchInterface(name) {
      set(this, 'visibleInterface', name);
      this.$()
        .find('.interface-switches .btn')
        .removeClass('active');
      this.$(`.interface-switches .${name}`).addClass('active');
    }
  }
});
