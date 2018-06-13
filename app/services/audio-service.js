import Service from '@ember/service';
import { get, set } from '@ember/object';

export default Service.extend({
  tracks: [],

  findOrCreateTrackRef(trackId) {
    let trackRef = get(this, 'tracks').findBy('trackId', trackId);
    if (!trackRef) {
      trackRef = { trackId: trackId };
      get(this, 'tracks').push(trackRef);
    }
    return trackRef;
  },

  bindTrackSamplers() {
    get(this, 'tracks').forEach(track => {
      __(track.selector).unbind('step');

      __(track.selector).bind(
        'step', // on every crack sequencer step
        track.callback, // call this function (bound to component scope)
        track.sequence // passing in array value at position
      );
    });
  },

  onLoopStep(trackCallback) {
    trackCallback();
    get(this, 'onLoopStepCallback')();
  },

  startLoop(interval) {
    this.bindTrackSamplers();
    __.loop(interval);
    __.loop('start');
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
      // TODO validation
      // warning about __.play()
    } catch (e) {
      alert('problem with function', e);
    }
  }
});
