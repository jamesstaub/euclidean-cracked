import Component from '@ember/component';
export default Component.extend({
  tagName: '',

  init() {
    this._super(...arguments);
    this.set('gainSliderSize', [20, 120]);
    this.set('visibleInterface', 'rhythm');
  },

  actions: {
    updateSequenceParam(parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      this.track.set(parameter, value);
      this.saveTrackTask.perform(this.track);
    },
  }
});
