import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { waitForProperty } from 'ember-concurrency';
export default Component.extend({
  store: service(),
  tagName:'',
  async init() {
    this._super(...arguments);
    await waitForProperty(this.track, 'trackControls');
    this.set('currentTrackControl', this.track.get('trackControls.firstObject'));
  },
  
  actions: {
    async newControl(type) {
      const trackControl = this.store.createRecord('track-control', { 
        track: this.track,
        interfaceName:`ui-${type}`,
      });
      await trackControl.save();
      this.track.get('trackControls').addObject(trackControl);
      await this.track.save();
    },
  }
});
