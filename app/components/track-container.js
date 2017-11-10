import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteTrack(track) {
      track.destroyRecord();
    }
  }
});
