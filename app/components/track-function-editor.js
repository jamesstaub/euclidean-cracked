import Component from '@ember/component';
import { computed, get, set } from "@ember/object";
import { inject as service } from '@ember/service';

export default Component.extend({
  audioService: service(),

  serviceTrackRef: computed('audioService.tracks.@each.trackId', {
    get() {
      // let serviceTracks = get(this, 'audioService.tracks');
      return get(this, 'audioService').findOrCreateTrackRef(get(this, 'track.id'));
      // let trackRef = serviceTracks.findBy('trackId', get(this, 'track.id'));
      // return trackRef;
    }
  }),

  actions: {
    submitCode(audioTrackSampler) {
      let scope = {
        sampler: `#${get(audioTrackSampler, 'samplerId')}`,
        gain: `#${get(audioTrackSampler, 'gainId')}-onstep`,
      }

      let customFunctionString = get(this, 'customFunctionString');
      // let serviceTrackRef = get(this, 'audioService').findOrCreateTrackRef(get(this, 'track.id'));
      let serviceTrackRef = get(this, 'serviceTrackRef');
      this.track.set('function', customFunctionString);
      this.track.save().then(()=> {
        get(this, 'audioService').applyTrackFunction(serviceTrackRef, customFunctionString, scope);
        set(this, 'isDisabled', false);
      });

    },

    disableCode() {
      set(get(this, 'serviceTrackRef'), 'customFunction', null);
      set(this, 'isDisabled', true);
    }
  }
});
