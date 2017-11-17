import Ember from 'ember';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, set, computed } from "@ember/object";

export default Ember.Component.extend(NexusMixin, {
  classNames: ['ui-step-sequencer'],

  ElementName: 'Sequencer',

  ElementOptions: computed('width', 'length', 'value', {
    get() {
      // TODO: generalize ui element sizes to a global config
      // (or nexus mixin)

      return {
        'size': [get(this, 'width'), 30],
        'mode': 'toggle',
        'rows': 1,
        'columns': get(this, 'length'),
      }
    }
  }),

  length: computed('sequence.length', {
    get() {
      return get(this, 'sequence.length');
    }
  }),

  width: computed('length', {
    get() {
      return get(this, 'length') * 34.1;
    }
  }),

  init() {
    this._super(...arguments);
    // depending on the nexusui object in use,
    // tell the nexus mixin which hook to use to initialize
    set(this, 'initNexusOnHook', 'didUpdateAttrs');
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this._nexusInit();

    if (get(this, 'sequence')) {

      let sequencer = get(this, 'NexusElement');

      sequencer.matrix.set.row(0, get(this, 'sequence'));

      sequencer.on('change',(v)=> {
        set(this, 'value', v);
      });

    }
  },

});
