import Component from '@ember/component';
import SequenceHelper from  'euclidean-cracked/mixins/sequence-helper';
import { get, set } from "@ember/object";
import { alias } from "@ember/object/computed";

export default Component.extend(SequenceHelper,{
  tagName: '',

  gainStepDefault: Array.from(new Array(16), () => 0.5),
  // speedStepSeq: Array.from(new Array(16), ()=> .5).toString(),

  gainStepSeq: alias('track.gainStepSeq'),

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
    }
  }
});
