import Ember from 'ember';
import Component from '@ember/component';
import SequenceHelper from 'euclidean-cracked/mixins/sequence-helper';
import { get, set, computed } from '@ember/object';
import { alias } from '@ember/object/computed';

const { service } = Ember.inject;

export default Component.extend(SequenceHelper, {
  classNames: ['step-param-sliders'],
  audioService: service(),

  gainStepDefault: Array.from(new Array(16), () => 0.5),
  // speedStepSeq: Array.from(new Array(16), ()=> .5).toString(),

  gainStepSeq: alias('track.gainStepSeq'),

  multisliderSize: computed('sequence', {
    get() {
      let width = get(this, 'uiStepSize') * 0.85 * get(this, 'sequence.length');
      let height = 100;
      return [width, height];
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'gain');
  },

  actions: {
    updateParam(param, value) {
      let array = get(this, param).toArray();
      array[value.index] = value.value;
      set(this, param, array);
    },

    toggleIsLooping(evt) {
      this.track.set('isLooping', evt.target.checked);
      this.track.save();
    },

    switchInterface(name) {
      set(this, 'visibleInterface', name);
      this.$()
        .find('.interface-switches .btn')
        .removeClass('active');
      this.$(`.interface-switches .${name}`).addClass('active');
    }
  }
});
