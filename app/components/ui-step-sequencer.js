import Ember from 'ember';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, set, computed } from "@ember/object";

const { service } = Ember.inject;

export default Ember.Component.extend(NexusMixin, {
  classNames: ['ui-step-sequencer'],
  audioService: service(),

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


  stepIndex: computed({
    set(key, index) {
      // on every cracked sequencer step received,
      // update nexusui stepper value to step-1, then call
      // next() method to update UI
      if (typeof index != 'undefined') {
        let sequencer = get(this, 'NexusElement');

        if (typeof sequencer.stepper.value === 'number') {

          let step = (index % sequencer.stepper.max) - 2;

          if (!index) {
            step = sequencer.stepper.max - 2;
          }
          sequencer.stepper.value = step;
        }
        sequencer.next();
      }
      return index;
    },
  }),

  didUpdateAttrs() {
    this._super(...arguments);

    let refreshOnUpdate =
      get(this, 'sequence') !== get(this, '_sequence');

    if(refreshOnUpdate) {
      this._nexusInit();
      if (get(this, 'sequence')) {
        let sequencer = get(this, 'NexusElement');
          sequencer.matrix.set.row(0, get(this, 'sequence'));
      }
    }
    set(this, '_sequence', get(this, 'sequence'));
  },

  afterInitNexus(NexusElement) {
    NexusElement.colorize("mediumLight","#d9534f");
  }

});
