import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { bool, not } from '@ember/object/computed';
import examples from 'euclidean-cracked/utils/example-functions';

export default Component.extend({
  classNames: ['track-function-editor'],

  audioService: service(),

  serviceTrackRef: computed('audioService.tracks.@each.trackId', {
    get() {
      return get(this, 'audioService').findOrCreateTrackRef(
        get(this, 'track.id')
      );
    }
  }),

  functionIsLoaded: bool('serviceTrackRef.customFunction'),

  function: computed('track.function', {
    get() {
      return get(this, 'track.function') || '';
    }
  }),

  // when the track's function property is different than
  // the function runnign on the audio service
  hasUnloadedCode: computed('editorContent', 'loadedFunctionString', {
    get() {
      let editorContent = get(this, 'editorContent');
      let loadedFunction = get(this, 'loadedFunctionString');
      return loadedFunction != editorContent;
    }
  }),

  editorClean: not('hasUnloadedCode'),

  init() {
    this._super(...arguments);
    // set(this, 'hasUnloadedCode', false);
  },

  actions: {
    onUpdateEditor(content) {
      set(this, 'editorContent', content);
      this.track.set('function', content);
      this.track.save();
    },

    submitCode(audioTrackSampler) {
      let scope = get(audioTrackSampler, 'customFunctionScope');

      let editorContent = get(this, 'editorContent');
      let serviceTrackRef = get(this, 'serviceTrackRef');

      if (editorContent) {
        get(this, 'audioService').applyTrackFunction(
          serviceTrackRef,
          editorContent,
          scope
        );
        set(this, 'loadedFunctionString', editorContent);
      }
    },

    discardChanges() {
      // revert the saved data to the function that is currently loaded
      let loadedFunction = get(this, 'loadedFunctionString');
      this.track.set('function', loadedFunction);
      this.track.save().then(() => {
        set(this, 'hasUnloadedCode', false);
      });
    },

    disableFunction() {
      set(get(this, 'serviceTrackRef'), 'customFunction', null);
      set(this, 'hasUnloadedCode', true);
    },

    injectExample(name) {
      // inject a code example selected from dropdown
      let selectedExample = examples(name);
      let existingContent = this.editorContent || '';
      let combined = existingContent.concat(selectedExample);
      set(this, 'editorContent', combined);
      this.track.set('function', combined);
    }
  }
});
