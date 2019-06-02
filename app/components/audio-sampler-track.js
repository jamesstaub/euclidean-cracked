import Component from '@ember/component';
import { computed } from '@ember/object';
/* This component updates the cracked audio nodes as track model properties are passed in through the template */
export default Component.extend({
  // replace this with didChangeAttrs
  didReceiveAttrs() {
    this._super(...arguments);
    this.track.initializeSampler.perform();
  },

  /* cracked node attribute setters */
  // track gain slider
  gain: computed({
    set(key, val) {
      __(this.gainSelector).attr({ gain: val });
      return val;
    }
  }),

});
