import Component from '@ember/component';
import { computed, get, set } from "@ember/object";
import { inject as service } from '@ember/service';
import { reads, not } from "@ember/object/computed";
import { task, waitForProperty } from 'ember-concurrency';
import exampleFunctions from '../utils/example-functions';
export default Component.extend({
  audioService: service(),
  classNames: ['track-function-editor'],


  // stringified code that gets run in audio service on submit
  function: reads('customFunction.function'),
  // code in text editor
  editorContent: reads('customFunction.editorContent'),
  editorClean: reads('functionIsLoaded'),

  functionIsLoaded: computed('function', 'editorContent', {
    get() {
      return this.function === this.editorContent;
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
      // customFunction is a proxy but for some reason
      // await and waitForProperty dont resolve
      this.customFunction.then((customFunction) => {
        customFunction.set('editorContent', content);
        // customFunction.set('isSafe', true);
        customFunction.save();
      });
    },

    submitCode(audioTrackSampler) {
      const scope = audioTrackSampler.customFunctionScope;
      const serviceTrackRef = this.serviceTrackRef;

      if (this.editorContent) {
        this.customFunction.set('function', this.editorContent);
        this.customFunction.save();

        get(this, 'audioService').applyTrackFunction(
          serviceTrackRef,
          this.editorContent,
          scope
        );
      }
    },

    discardChanges() {
      this.customFunction.set('editorContent', this.customFunction.function);
      this.customFunction.save();
    },

    disableFunction() {
      this.customFunction.set('function', 'null');
      this.customFunction.save();
      set(this.serviceTrackRef, 'customFunction', 'null');
    },

    injectExample(name) {
      // exampleFunctions;?
    }
  }
});
