import Mixin from '@ember/object/mixin';
import { get, set, computed } from "@ember/object";

/**
 * TODO:
 * these methods / computed properties should be moved to the 
 * track model so they can be accessed by the audio service (and downstream components) directly
 * from the track record
 */



export default Mixin.create({

  // gainStepArray: computed('track.gainStepSeq', arraySequenceComputed('gainStepSeq')),
  // speedStepArray: computed('track.speedStepSeq', arraySequenceComputed('speedStepSeq')),
  // loopEndStepArray: computed('track.loopEndStepSeq', arraySequenceComputed('loopEndStepSeq')),


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
