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
  
});
