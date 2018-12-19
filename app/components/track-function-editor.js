import Component from '@ember/component';
import { computed, get, set } from "@ember/object";
import { inject as service } from '@ember/service';
import { reads, not } from "@ember/object/computed";
import exampleFunctions from '../utils/example-functions';

export default Component.extend({
  audioService: service(),
  classNames: ['track-function-editor'],

  // code that gets run in audio service on submit
  function: reads('track.function'),
  // code in text editor
  functionEditorContent: reads('track.functionEditorContent'),
  editorClean: reads('functionIsLoaded'),

  functionIsLoaded: computed('function', 'functionEditorContent', {
    get() {
      return this.function === this.functionEditorContent;
    }
  }),

  showDiscardBtn: not('hasUnloadedCode'),

  serviceTrackRef: computed('audioService.tracks.@each.trackId', {
    get() {
      return get(this, 'audioService').findOrCreateTrackRef(
        get(this, 'track.id')
      );
    }
  }),

  // TODO
  // add track save task and invoke that everywhere
  actions: {
    onUpdateEditor(content) {
      this.track.set('functionEditorContent', content);
      this.track.save();
    },

    submitCode(audioTrackSampler) {
      const scope = audioTrackSampler.customFunctionScope;
      const serviceTrackRef = this.serviceTrackRef;

      if (this.functionEditorContent) {
        this.track.set('function', this.functionEditorContent);
        this.track.save();

        get(this, 'audioService').applyTrackFunction(
          serviceTrackRef,
          this.functionEditorContent,
          scope
        );
      }
    },

    discardChanges() {
      this.track.set('functionEditorContent', this.track.function);
      this.track.save();
    },

    disableFunction() {
      this.track.set('function', 'null');
      this.track.save();
      set(this.serviceTrackRef, 'customFunction', 'null');
    },

    injectExample(name) {
      // exampleFunctions;?
    }
  }
});
