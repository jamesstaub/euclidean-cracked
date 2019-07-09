import Component from '@ember/component';
import DidChangeAttrs from 'ember-did-change-attrs';
import { computed } from '@ember/object';
/* This component updates the cracked audio nodes as track model properties are passed in through the template */
export default Component.extend(DidChangeAttrs, {
  // only re-initialize if necessary
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  didChangeAttrsConfig: {
    attrs: ['filepath', 'sequence'],
  },

  didChangeAttrs(changes) {
    this._super(...arguments);
    if (changes) {
      this.track.initializeSampler.perform(true);
    }
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
