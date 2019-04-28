import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { debug } from '@ember/debug';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  audioService: service(),

  init() {
    this._super(...arguments);
    this.set('gainSliderSize', [20, 100]);
    this.set('uiStepSize', 40);
    this.set('visibleInterface', 'rhythm');
  },

  saveTrack: task(function* (track) {
    try {
      yield track.save();
    } catch (e) {
      debug(`error saving track:  ${e}`);
      track.rollbackAttributes();
    }
  }).keepLatest(),

  actions: {
    updateFilepath(track, filepath) {
      track.set('filepath', filepath.value);
      this.saveTrack.perform(track);
    },

    updateSequenceParam(track, parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      try {
        track.set(parameter, value);
      } catch (e) {
        debug('error saving track', e)
      }
      this.saveTrack.perform(track);
    },
  }
});
