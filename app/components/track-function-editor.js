import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads, not, and, or } from '@ember/object/computed';
import { task, waitForProperty } from 'ember-concurrency';
import exampleFunctions from '../utils/example-functions';
export default Component.extend({

  classNames: ['track-function-editor'],
  tagName:'',
  customFunction: reads('track.customFunction'), // the model that saves custom function as string
  function: reads('track.onStepFunction'), // the actual function that gets called on each step
  illegalTokens: reads('customFunction.illegalTokens'),
  // code in text editor
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

  init() {
    this._super(...arguments);
    this.set('exampleFunctions', exampleFunctions);
  },

  // set property to cusotmFunction model then save
  saveFunctionTask: task(function*(property, value) {
    // yield proxy to model record
    const customFunction = yield this.customFunction;
    customFunction.set(property, value);
    yield customFunction.save();
  }),

  applyFunction: task(function*() {
    // apply the editor content to functionPreCheck
    // which then gets checked in cloud function

    yield this.saveFunctionTask.perform('functionPreCheck', this.editorContent);
    // after save is called, functionPreCheck has a value
    // until the function checker sets it null and either sets
    // the function property, or returns illegal keywords
    
    yield waitForProperty(this, 'customFunction.functionPreCheck', null);

    // the cloud function check succeeded if function + editor are identical
    if (this.customFunction.get('function') === this.editorContent) {
      yield this.track.initializeSampler.perform();
    }
    /**
     * TODO: set a timeout condition for this method
     * if the cloud function fails to respond, it can still set
     * the track function locally for this user (also display an error message)
     */
  }),

  injectExample: task(function*(code) {
    if (this.editorContent) {
      if (!window.confirm('overwrite existing script?')) {
        return;
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
      // TODO: fix
      this.saveFunctionTask.perform('functionPreCheck', '');
      this.track.set('onStepFunction', null);
    }
  }
});
