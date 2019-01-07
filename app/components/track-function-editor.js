import Component from '@ember/component';
import { computed, get, set} from "@ember/object";
import { inject as service } from '@ember/service';
import { reads, not, and, or } from "@ember/object/computed";
import { task, waitForProperty } from 'ember-concurrency';
import exampleFunctions from '../utils/example-functions';
export default Component.extend({
  audioService: service(),
  classNames: ['track-function-editor'],

  // stringified code that gets run in audio service on submit
  function: reads('customFunction.function'),
  // code in text editor
  illegalTokens: reads('customFunction.illegalTokens'),
  editorContent: reads('customFunction.editorContent'),
  canSubmit: and('editorContent.length'),
  cantSubmit: or('!canSubmit', 'functionIsLoaded'),
  functionIsLoaded: computed('function', 'editorContent', {
    get() {
      const f = this.function;
      const e = this.editorContent;
      return f && f.length && f === e;
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
      this.customFunction.then(customFunction => {
        customFunction.set('editorContent', content);
        customFunction.save();
      });
    },

    submitCode(audioTrackSampler) {
      const scope = audioTrackSampler.customFunctionScope;
      const serviceTrackRef = this.serviceTrackRef;

      this.customFunction.then(customFunction => {
        // apply the editor content to functionPreCheck
        // which then gets checked in cloud function
        // if safe, the property `function` will then get applied
        customFunction.set('functionPreCheck', this.editorContent);
        customFunction.save();
        this.audioService.applyTrackFunction(
          serviceTrackRef,
          this.editorContent,
          scope
        );
      });
    },

    discardChanges() {
      this.customFunction.then(customFunction => {
        customFunction.set('editorContent', this.function);
        customFunction.save();
      });
    },

    disableFunction() {
      this.customFunction.then(customFunction => {
        customFunction.set('function', '');
        customFunction.save();
      });
      set(this.serviceTrackRef, 'customFunction', null);
    },

    injectExample(name) {
      // exampleFunctions;?
    }
  }
});
