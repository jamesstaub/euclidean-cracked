import Component from '@ember/component';
import { debug } from '@ember/debug';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  audioService: service(),

  init() {
    this._super(...arguments);
    this.set('gainSliderSize', [20, 120]);
    this.set('uiStepSize', 40);
    this.set('visibleInterface', 'rhythm');
  },

  actions: {
    updateSequenceParam(track, parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      try {
        track.set(parameter, value);
      } catch (e) {
        debug('error saving track', e)
      }
      this.saveTrackTask.perform(track);
    },
  }
});
