import Component from '@ember/component';
import { computed, get, set } from "@ember/object";
import { inject as service } from '@ember/service';
import { bool, not } from "@ember/object/computed";

export default Component.extend({
  audioService: service(),

  serviceTrackRef: computed('audioService.tracks.@each.trackId', {
    get() {
      return get(this, 'audioService').findOrCreateTrackRef(get(this, 'track.id'));
    }
  }),

  functionIsLoaded: bool('serviceTrackRef.customFunction'),

  actions: {
    submitCode(audioTrackSampler) {
      let scope = get(audioTrackSampler, 'customFunctionScope');

      let customFunctionString = get(this, 'customFunctionString');
      let serviceTrackRef = get(this, 'serviceTrackRef');

      if (customFunctionString) {
        this.track.set('function', customFunctionString);
        this.track.save().then(()=> {
          get(this, 'audioService').applyTrackFunction(serviceTrackRef, customFunctionString, scope);
          set(this, 'isDisabled', false);
        });
      }
    },

    disableCode() {
      set(get(this, 'serviceTrackRef'), 'customFunction', null);
      set(this, 'isDisabled', true);
    }
  }
});
