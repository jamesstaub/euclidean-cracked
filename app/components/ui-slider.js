import Ember from 'ember';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, computed } from "@ember/object";

export default Ember.Component.extend(NexusMixin, {
  classNames: ['ui-slider'],

  tagName: ['span'],

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
  },

  ElementName: 'Slider',

  ElementOptions: computed('max', 'step', 'value', {
    get() {
      return {
        'size': get(this, 'size') || [20, 68],
        'mode': 'relative', // "absolute" or "relative"
        'min': 0,
        'max': get(this, 'max') || 1,
        'step': get(this, 'step') || 0,
        'value': get(this, 'value')
      }
    }
  }),

});
