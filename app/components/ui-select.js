import Component from '@ember/component';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, computed } from "@ember/object";

export default Component.extend(NexusMixin, {
  classNames: ['ui-select'],
  tagName: 'span',

  didInsertElement() {
    this._super(...arguments);
    this._nexusInit();
  },

  ElementName: 'Select',

  ElementOptions: computed('value', 'filenames', {
    get() {
      return {
        'size': [150,30],
        'options': get(this, 'choices')
      }
    }
  }),

});
