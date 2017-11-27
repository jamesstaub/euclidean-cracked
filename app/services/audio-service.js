import Ember from 'ember';
import { get } from "@ember/object";

export default Ember.Service.extend({
  tracks: [],
  bindTrackSamplers() {
    get(this, 'tracks').forEach((track) => {
      __(track.selector).unbind("step");

      __(track.selector)
        .bind("step", //on every crack sequencer step
          track.callback, //call this function (bound to component scope)
          track.sequence //passing in array value at position
        );
    });
  },

  startLoop(interval) {
    this.bindTrackSamplers();
    __.loop(interval);
    __.loop('start');
  },

  resetLoop(interval){
    __.loop('stop');
    __.loop('reset');
    this.bindTrackSamplers();
    __.loop(interval);
    __.loop('start');
  }
});
