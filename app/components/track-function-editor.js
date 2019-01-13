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

  init() {
    this._super(...arguments);
    this.set('exampleFunctions', exampleFunctions);
  },

  // set property to cusotmFunction model then save
  saveFunctionTask: task(function * (property, value) {
    //yield proxy to model record
    const customFunction = yield this.customFunction;
    customFunction.set(property, value);
    yield customFunction.save();
  }),

  applyFunction: task(function * (){
    // apply the editor content to functionPreCheck
    // which then gets checked in cloud function
    yield this.saveFunctionTask.perform('functionPreCheck', this.editorContent);
    // after save is called, functionPreCheck has a value
    // until the function checker sets it null and either sets 
    // the function property, or returns illegal keywords
    yield waitForProperty(this, 'customFunction.functionPreCheck', null);
    //the cloud function check succeeded if function + editor are identical
    if (this.function === this.editorContent) {
      yield this.sampler.initializeSampler.perform();
    }
  }),

  injectExample: task(function * (code) {
    if (this.editorContent) {
      if (!window.confirm('overwrite existing script?')) {
        return
      }
    }
    yield this.saveFunctionTask.perform('editorContent', code);
    yield this.applyFunction.perform();
  }),

  // TODO
  // add track save task and invoke that everywhere
  actions: {
    submitCode() {
      this.applyFunction.perform();
    },

    onUpdateEditor(content) {
      this.saveFunctionTask.perform('editorContent', content);
    },

    discardChanges() {
      this.saveFunctionTask.perform('editorContent', this.function);
    },

    disableFunction() {
      this.saveFunctionTask.perform('functionPreCheck', '');
      set(this.serviceTrackRef, 'customFunction', null);
    },
  }
});
