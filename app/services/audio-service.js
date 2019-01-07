import Service from '@ember/service';
import { set } from "@ember/object";

export default Service.extend({
  tracks: [],

  findOrCreateTrackRef(trackId) {
    let trackRef = this.tracks.findBy('trackId', trackId);
    if (!trackRef) {
      trackRef = { trackId: trackId };
      this.tracks.push(trackRef);
    }
    return trackRef;
  },

  bindTrackSamplers() {
    this.tracks.forEach(track => {
      __(track.selector).unbind('step');

      __(track.selector).bind(
        'step', // on every crack sequencer step
        track.callback, // call this function (bound to component scope)
        track.sequence // passing in array value at position
      );
    });
  },

  startLoop() {
    this.bindTrackSamplers();
    __.loop('start');
  },

  stopLoop() {
    // disable the looping of individual samples
    this.tracks.forEach(track => {
      __(track.selector).attr({ loop: false });
    });
    // disable the "loop" aka global sequencer
    __.loop('stop');
  },

  setInterval(interval) {
    __.loop(interval);
  },

  resetLoop(interval) {
    __.loop('stop');
    __.loop('reset');
    this.bindTrackSamplers();
    __.loop(interval);
    __.loop('start');
  },

  applyTrackFunction(serviceTrackRef, functionString, scope) {
    try {
      let onStep = new Function('index', 'data', 'array', functionString).bind(
        scope
      );

      set(serviceTrackRef, 'customFunction', onStep);
    } catch (e) {
      alert('problem with function', e);
    }
  }
});
