import Component from '@ember/component';
import { set } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

export default Component.extend({
  classNames: ['edit-track border'],
  uiStepSize: 40, // todo
  gainSliderSize: [20, 100],

  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'rhythm');
  },

  saveTrack: task(function*(track) {
    yield track.save();
  }).keepLatest(),

  actions: {
    updateFilepath(track, filepath) {
      track.set('filepath', filepath.value);
      this.saveTrack.perform(track);
    },

    updateSequenceParam(track, parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      track.set(parameter, value);
      this.saveTrack.perform(track);
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
    },
  }
});
