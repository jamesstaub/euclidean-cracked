import Model from 'ember-data/model';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

/* 
  Module  to be extended by the track model 
  containing methods and properties to manage the state 
  of the Cracked audio sampler. 

  models/track.js contains properties that get saved to firebase
*/

/** computed macro for node classes and IDs */
const nodeName = function (dependency, suffix) {
  return computed(dependency, {
    get() {
      if (this.get(dependency)) {
        const node = `${this.get(dependency)}-${suffix}`;
        return node;
      }
    }
  });
}

/** 
 * @param {String} type: [id, class] 
 * @param {String} dependency: track property to computed
*/
const selectorFor = (type, dependency) => {
  return computed(dependency, {
    get() {
      if (this.get(dependency)) {
        const types = { id: '#', class: '.'};
        return `${types[type]}${this.get(dependency)}`;
      }
    }
  });
}

export default Model.extend({
  init() {
    this._super(...arguments);
    this.set('stepIndex', 0);
  },
  /* class to add to all nodes on this track */
  trackNodeClass: nodeName('id', 'node'),

  /** cracked webaudio node ids */
  samplerId: nodeName('id', 'sampler'),
  /* unique ID for track gain node */
  gainId: nodeName('samplerId', 'gain'),
  
  gainOnstepId: nodeName('samplerId', 'gain-onstep'),
  
  /** ID selector for track sampler node */
  samplerSelector: selectorFor('id','samplerId'),

  /** ID selector for track sampler node */
  gainSelector: selectorFor('id', 'gainId'),
  
  gainOnStepSelector: selectorFor('id', 'gainOnstepId'),
  
  /* Class selector for every node bound to this track */
  trackNodeSelector: selectorFor('class', 'trackNodeClass'),

  path: computed('directory', 'filepath', {
    get() {
      return `https://s3.amazonaws.com/drumserver${this.filepath}`;
    }
  }),

  stepsUntilStart: computed('sequence.length', 'stepIndex', {
    get() {
      if (this.sequence) {
        return this.sequence.length - this.stepIndex;
      }
    }
  }),

  initializeSampler: task(function* () {
    yield waitForProperty(
      this,
      'sequence',
      s => typeof s !== 'undefined'
    );

    yield waitForProperty(this, 'samplerId');

    yield waitForProperty(this, 'filepath');

    // wait until beginning of sequence to apply changes
    // prevents lots of concurrent disruptions
    yield waitForProperty(this, 'stepIndex', 0);

    if (this.sequence.length) {
      console.log('remove and build');
      this.removeAllNodes();
      this.buildNodes();
    }
  }).keepLatest(),

  // TODO: cracked: how to set new filepath without rebuilding node?
  buildNodes() {
    __()
      .sampler({
        id: this.samplerId,
        path: this.path,
        class: this.trackNodeClass
      })
      .lowpass({
        id: this.lowpassId,
        frequency: 10000,
        q: 0,
        class: this.trackNodeClass
      })
      .gain({
        id: this.gainId,
        class: this.trackNodeClass,
        gain: this.gain
      })
      .gain({
        id: `${this.gainOnStepSelector}`,
        class: this.trackNodeClass
      })
      .connect(this.get('project.outputNodeSelector'));
  },

  removeAllNodes() {
    __(this.samplerSelector).unbind('step');

    // NOTE: any cracked node created in this component must be selected
    // for tear down here, otherwise lingering nodes will break
    // ability to select by ID
    let selectors = [this.trackNodeSelector];

    selectors.forEach(selector => {
      __(selector).remove();
    });
  },

  // callback functions to be called on each step of sequencer
  // eslint-disable-next-line complexity
  onStepCallback(index, data, array) {
    this.set('stepIndex', index);

    if (data) {
      __(this).stop();
      __(this).start();

      __(this).attr({ loop: this.isLooping });
    } else {
      __(this).stop();
      // if (!get(this, 'isLegato')) {
      // __(this).attr({loop:false});
      // }
    }

    // TODO: run all custom control logic  here
    if (this.onStepFunction) {
      this.onStepFunction(index, data, array);
    }
  },

  bindTrackSampler() {
    // let selector = `#${this.samplerId}`;
    let callback = this.onStepCallback.bind(this);

    this.verifyCustomFunction();

    __(this.samplerSelector).unbind('step');

    __(this.samplerSelector).bind(
      'step', // on every crack sequencer step
      callback, // call this function (bound to component scope)
      this.sequence // passing in array value at position
    );
  },

  verifyCustomFunction() {
    // customFunction.function can only be written by a cloud function
    // that filters out dangerous tokens
    let customFunction = this.get('customFunction.function');
    let isSafe = !this.customFunction.illegalTokens;
    if (isSafe && customFunction) {
      this.applyCustomFunction(this.get('customFunction'));
    }
  },

  /* 
    Takes a function definition (string) from the customFunction model
    evaluates it as a Function, and binds it to the track as a method named onStepFunction
   */
  applyCustomFunction(customFunction) {
    try {
      let onStepFunction = new Function('index', 'data', 'array', customFunction.get('function')).bind(
        customFunction.get('scope')
      );
      this.set('onStepFunction', onStepFunction);
    } catch (e) {
      alert('problem with function', e);
    }
  },
})