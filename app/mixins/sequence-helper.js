import Mixin from '@ember/object/mixin';
import { get, set, computed } from "@ember/object";

function arraySequenceComputed(stringKey) {
  // reusable computed property template
  // to serialize stringified sequence array to/from store
  return {
    get() {
      return this.stringToArray(stringKey);
    },
    set(key, value) {
      this.setParamsAudioService(key, value);
      this.saveArrayAsString(stringKey, value);
      return value;
    }
  };
}

export default Mixin.create({

  gainStepArray: computed('track.gainStepSeq', arraySequenceComputed('gainStepSeq')),
  speedStepArray: computed('track.speedStepSeq', arraySequenceComputed('speedStepSeq')),
  loopEndStepArray: computed('track.loopEndStepSeq', arraySequenceComputed('loopEndStepSeq')),

  stringToArray(stringKey) {
    let trackData = get(this, `track.${stringKey}`);
    if (trackData){
      return get(this, `track.${stringKey}`)
      .split(',')
      .map((str)=> parseFloat(str));
    } else {
      return this.gainStepDefault;
    }
  },

  saveArrayAsString(stringKey, array){
    let track = this.track;
    let seqString = array.toString();
    track.set(stringKey, seqString);
    track.save();
  },

  setParamsAudioService(paramKey, stepArray) {
    let serviceTracks = get(this, 'audioService.tracks');
    let trackRef = serviceTracks.findBy('trackId', get(this, 'track.id'));

    set(trackRef, paramKey, stepArray);
  },

});
