import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';
import { debug } from '@ember/debug';

export default Component.extend({
  classNames: ['edit-track border'],
  uiStepSize: 40, // todo
  gainSliderSize: [20, 100],

  didInsertElement() {
    this._super(...arguments);
    this.send('switchInterface', 'filePicker');
  },

  saveTrack: task(function*(track) {
    try {
      yield track.save();
    } catch (e) {
      debug(`error saving track:  ${e}`);
      track.rollbackAttributes();
    }
  }).keepLatest(),

  actions: {
    updateFilepath(track, filepath) {
      track.set('filepath', filepath.value);
      this.saveTrack.perform(track);
    },

    updateSequenceParam(track, parameter, value) {
      // NOTE: try using store.push to instantly update the UI
      // if server roundtrip causes UI problems
      try {
        track.set(parameter, value);
      } catch(e) {
        debug('error saving track', e)
      }
      this.saveTrack.perform(track);
    },

    async deleteTrack(track) {
      const customFunction = await track.customFunction;
      // TODO: delete customFunction with cloud Function
      // since readOnly validation prevents deletion
      // customFunction.destroyRecord();
      track.destroyRecord();
    },

    switchInterface(name) {
      set(this, 'visibleInterface', name);
    }
  }
});
