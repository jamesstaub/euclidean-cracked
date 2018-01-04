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

  function: computed('track.function', {
    get() {
      return get(this, 'track.function') || '';
    }
  }),

  //when the track's function property is different than
  // the function runnign on the audio service
  hasUnloadedCode: computed('function', 'loadedFunctionString',{
    get() {
      let editorFunction = get(this, 'function');
      let loadedFunction = get(this, 'loadedFunctionString');
      return loadedFunction != editorFunction;
    },
    set(key, value) {
      return value;
    }
  }),

  showDiscardBtn: not('hasUnloadedCode'),

  actions: {

    onUpdateEditor(content) {
      set(this, 'trackFunctionString', content);
      this.track.set('function', content);
      this.track.save();
    },

    submitCode(audioTrackSampler) {
      let scope = get(audioTrackSampler, 'customFunctionScope');

      let trackFunctionString = get(this, 'trackFunctionString');
      let serviceTrackRef = get(this, 'serviceTrackRef');

      if (trackFunctionString) {
        get(this, 'audioService').applyTrackFunction(serviceTrackRef, trackFunctionString, scope);
        set(this, 'loadedFunctionString', trackFunctionString)
        set(this, 'isDisabled', false);
      }
    },

    discardChanges() {
      // revert the saved data to the function that is currently loaded
      let loadedFunction = get(this, 'loadedFunctionString');
      this.track.set('function', loadedFunction);
      this.track.save().then(()=>{
        set(this, 'hasUnloadedCode', false);
      });
    },

    disableFunction() {
      set(get(this, 'serviceTrackRef'), 'customFunction', null);
      set(this, 'isDisabled', true);
    }
  }
});
