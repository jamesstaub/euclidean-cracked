import Service from '@ember/service';

/**
 * This service is a global singleton for web audio node parameters and state.
 * the tracks array is managed by the components rendered on the current project
 * 
 * The service's tracks array could be refactored into ember data models + methods, independent of the current track route
 * which is the source of truth for web audio parameters (ie ), and the service 
 * could be a top-level controller. 
 *
 * 
 */
export default Service.extend({

  startLoop(project) {
    project.bindTrackSamplers();
    __.loop('start');
  },

  stopLoop() {
    // disable the looping of individual samples
    this.tracks.forEach(track => {
      __(track.samplerSelector).attr({ loop: false });
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

});
