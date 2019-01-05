import Component from '@ember/component';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { computed } from '@ember/object';

export default Component.extend(NexusMixin, {
  classNames: ['ui-slider'],

  tagName: 'span',

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
  },

  ElementName: 'Slider',

  ElementOptions: computed('max', 'step', 'value', 'size', {
    get() {
      return {
        'size': this.size || [20, 70],
        'mode': 'relative', // "absolute" or "relative"
        'min': 0,
        'max': this.max || 1,
        'step': this.step || 0,
        'value': this.value
      };
    }
  })
});
