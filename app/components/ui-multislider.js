import Ember from 'ember';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, computed } from "@ember/object";

export default Ember.Component.extend(NexusMixin, {
  classNames: ['ui-multislider'],

  tagName: ['span'],

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
  },

  ElementName: 'Multislider',

  defaultValues: computed({
    get() {
      let len = 16; //max possible steps in sequence

      return Array.from(new Array(len),(val, idx)=> {
        let jitter = idx % 2 ? .05 : 0;
        return 0.7 + jitter;
      });
    }
  }),

  ElementOptions: computed('max', 'step', 'value', 'size',{
    get() {
      let values = get(this, 'values') || get(this, 'defaultValues');
      values = values.slice(0, get(this, 'numberOfSliders'));
      return {
        'size': get(this, 'size') || [400, 100],
        'min': get(this, 'min') || 0,
        'max': get(this, 'max') || 1,
        'numberOfSliders': get(this, 'numberOfSliders') || 4,
        'step': get(this, 'step') || 0,
        'values': values,
      }
    }
  }),

});
