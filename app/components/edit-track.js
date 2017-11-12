import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['edit-track'],
  filenames: ['test.wav', 'drums.wav'],
  actions: {
    updateFilename(track, filename) {
      track.set('filename', filename.value);
      track.save();
    },

    updateSequence(track, parameter, value) {
      track.set(parameter, value);
      track.save();
    },

    deleteTrack(track) {
      track.destroyRecord();
    }
  }
});
