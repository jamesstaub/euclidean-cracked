import Ember from 'ember';
import { get, set, computed } from "@ember/object";
const { service } = Ember.inject;

export default Ember.Component.extend({
  classNames: ['step-param-sliders'],
  audioService: service(),

  gainStepDefault: Array.from(new Array(16), ()=> .5),
  // speedStepSeq: Array.from(new Array(16), ()=> .5).toString(),

  gainStepArray: computed('track.gainStepSeq', {
    get() {
      return this.stringToArray('gainStepSeq');
    },
    set(key, value) {
      this.setParamsAudioService(key, value);
      this.saveArrayAsString('gainStepSeq', value);
      return value;
    }
  }),

  speedStepArray: computed('track.speedStepSeq', {
    get() {
      return this.stringToArray('speedStepSeq');
    },
    set(key, value) {
      this.setParamsAudioService(key, value);
      this.saveArrayAsString('speedStepSeq', value);
      return value;
    }
  }),

  loopEndStepArray: computed('track.loopEndStepSeq', {
    get() {
      return this.stringToArray('loopEndStepSeq');
    },
    set(key, value) {
      this.setParamsAudioService(key, value);
      this.saveArrayAsString('loopEndStepSeq', value);
      return value;
    }
  }),

  multisliderSize: computed('sequence', {
    get() {
      let width = (get(this, 'uiStepSize')* .85) * get(this, 'sequence.length');
      let height = 100;
      return [width, height];
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'gain');
  },

  stringToArray(stringKey) {
    let trackData = get(this, `track.${stringKey}`);
    if (trackData){
      return get(this, `track.${stringKey}`)
      .split(',')
      .map((str)=> parseFloat(str))
    } else {
      return get(this, 'gainStepDefault');
    }
  },

  saveArrayAsString(stringKey, array){
    let track = get(this, 'track');
    let seqString = array.toString();
    track.set(stringKey, seqString);
    track.save();
  },

  setParamsAudioService(paramKey, stepArray) {
    let serviceTracks = get(this, 'audioService.tracks');
    let trackRef = serviceTracks.findBy('trackId', get(this, 'track.id'));

    set(trackRef, paramKey, stepArray);
  },

  actions: {
    updateParam(param, value) {
      let array = get(this, param).toArray();
      array[value.index] = value.value;
      set(this, param, array);
    },

    switchInterface(name) {
      set(this, 'visibleInterface', name);
      this.$().find('.interface-switches .btn').removeClass('active');
      this.$(`.interface-switches .${name}`).addClass('active');
    },
  }

});
