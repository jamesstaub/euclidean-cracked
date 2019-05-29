import Component from '@ember/component';
import NexusMixin from 'euclidean-cracked/mixins/nexus-ui';
import { get, set, computed, observer } from '@ember/object';
import { waitForProperty } from 'ember-concurrency';

export default Component.extend(NexusMixin, {
  classNames: ['ui-step-sequencer'],

  ElementName: 'Sequencer',

  ElementOptions: computed('width', 'length', 'value', {
    get() {
      // TODO: generalize ui element sizes to a global config
      // (or nexus mixin)
      return {
        size: [this.width, 30],
        mode: 'toggle',
        rows: 1,
        columns: this.length
      };
    }
  }),

  length: computed('sequence.length', {
    get() {
      return get(this, 'sequence.length');
    }
  }),

  width: computed('length', {
    get() {
      return this.length * 34.1;
    }
  }),

  onStepChange: observer('stepIndex', function() {
    let sequencer = this.NexusElement;
    if (sequencer) {
      if (sequencer && typeof sequencer.stepper.value === 'number') {
        let step = (this.stepIndex % sequencer.stepper.max) - 2;

        if (!this.stepIndex) {
          step = sequencer.stepper.max - 2;
        }
        sequencer.stepper.value = step;
      }
      sequencer.next();
    }
  }),

  init() {
    this._super(...arguments);
    this.renderWhenReady();
  },

  async renderWhenReady() {
    await waitForProperty(this, 'sequence');
    this.updateAndCacheSequence();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.updateAndCacheSequence();
  },

  updateAndCacheSequence() {
    let refreshOnUpdate = this.sequence !== this._sequence;
    if (refreshOnUpdate) {
      this._nexusInit();
      if (this.sequence) {
        let sequencer = this.NexusElement;
        sequencer.matrix.set.row(0, this.sequence);
      }
    }
    set(this, '_sequence', this.sequence);
  },

  afterInitNexus(NexusElement) {
    NexusElement.colorize('accent', '#52ebff');
    NexusElement.colorize('fill', '#ffffff');
    NexusElement.colorize('mediumLight', '#d9534f');
  },
});
