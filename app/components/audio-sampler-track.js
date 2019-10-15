import Component from '@ember/component';
import DidChangeAttrs from 'ember-did-change-attrs';
import { computed } from '@ember/object';
/* This component updates the cracked audio nodes as track model properties are passed in through the template */
export default Component.extend(DidChangeAttrs, {
  tagName: '',
  // only re-initialize if necessary
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  didChangeAttrsConfig: {
    attrs: ['filepath', 'sequence'],
  },

  didInsertElement() {
    this._super(...arguments);
    this.track.initializeSampler.perform();
  },

  didChangeAttrs(changes) {
    this._super(...arguments);
    if (changes) {
      if (changes.sequence && Object.keys(changes).length === 1) {
        this.track.bindTrackSampler();
      } else {
        this.track.initializeSampler.perform();
      }
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
