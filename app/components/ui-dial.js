import Component from '@ember/component';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { computed } from '@ember/object';

export default Component.extend(NexusMixin, {
  classNames: ['ui-dial'],
  tagName: 'span',

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
  },

  ElementName: 'Dial',

  ElementOptions: computed('max', 'step', 'value', {
    get() {
      return {
        'size': this.size || [50,50],
        'interaction': 'vertical', // "radial", "vertical", or "horizontal"
        'mode': 'relative', // "absolute" or "relative"
        'min': 0,
        'max': this.max || 1,
        'step': this.step || 0,
        'value': this.value
      };
    }
  })
});
