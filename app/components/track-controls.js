import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  tagName:'',
  
  didReceiveAttrs() {
    this._super(...arguments);
    if (this.track.get('trackControls')) {
      this.set('currentTrackControl', this.track.get('trackControls.firstObject'));
    }
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
