import Model from 'ember-data/model';
import { computed } from '@ember/object';
import { task, waitForProperty, timeout } from 'ember-concurrency';

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
  /* separate gain node for on step (vs the track's volume slider) */
  gainOnStepId: nodeName('samplerId', 'gain-onstep'),
  
  lowpassId: nodeName('samplerId', 'lowpass'),
  
  /** ID selector for track sampler node */
  samplerSelector: selectorFor('id','samplerId'),

  /** ID selector for track sampler node */
  gainSelector: selectorFor('id', 'gainId'),
  
  gainOnStepSelector: selectorFor('id', 'gainOnStepId'),
  
  lowpassSelector: selectorFor('id', 'lowpassId'),
  
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

  customFunctionScope: computed('samplerSelector,gainOnStepSelector,lowpassSelector', {
    get() {
      // variables available for user defined track functions
      return {
        sampler: `${this.get('samplerSelector')}`,
        gain: `${this.get('gainOnStepSelector')}`,
        lowpass: `${this.get('lowpassSelector')}`
      };
    }
  }),

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
        id: `${this.gainOnStepId}`,
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
      // __(this).stop();
      // if (!get(this, 'isLegato')) {
      // __(this).attr({loop:false});
      // }
    }

    this.applyTrackControls(index);

    if (this.onstepFunctionRef) {
      this.onstepFunctionRef(index, data, array);
    }
  },

  // eslint-disable-next-line complexity
  initializeSampler: task(function* (awaitStart) {
    timeout(300);
    yield waitForProperty(
      this,
      'sequence',
      s => typeof s !== 'undefined'
    );

    if (awaitStart) {
      yield waitForProperty(this, 'stepIndex', 0);
    }

    yield waitForProperty(this, 'samplerId');
    yield waitForProperty(this, 'filepath');
    yield waitForProperty(this, 'initFunction.content');
    yield waitForProperty(this, 'initFunction.content');
    yield waitForProperty(this, 'onstepFunction.content');
    
    // wait until beginning of sequence to apply changes
    // prevents lots of concurrent disruptions

    if (this.sequence.length) {
      __.loop('stop');
      this.removeAllNodes();
      this.buildNodes();
      this.bindTrackSampler();

      // Call user written init function 
      if (this.initFunctionRef) {
        this.initFunctionRef();
      }

      if (this.get('project.isPlaying')) {
        timeout(300);
        __.loop('start');
      }
    }
  }).keepLatest(),

  bindTrackSampler() {
    // let selector = `#${this.samplerId}`;
    let onStepCallback = this.onStepCallback.bind(this);
    this.applyInitFunction();
    this.applyOnstepFunction();

    __(this.samplerSelector).unbind('step');

    __(this.samplerSelector).bind(
      'step', // on every crack sequencer step
      onStepCallback, // call this function (bound to component scope)
      this.sequence // passing in array value at position
    );
  },

  applyTrackControls(index) {
    this.get('trackControls').forEach((control)=> {
      let { nodeSelector, nodeAttr, controlDataArray } = control.getProperties(
        'nodeName', 'nodeSelector', 'nodeAttr', 'controlDataArray'
      );
      const attrs = {};
      if (nodeSelector, nodeAttr && controlDataArray.length) {
        attrs[nodeAttr] = controlDataArray[index];
        __(nodeSelector).attr(attrs);
      }
    });
  },

  async applyInitFunction() {
    const functionDefinition = await this.get('initFunction.function');
    try {
      let onstepFunctionRef = new Function(
        'index',
        'data',
        'array',
        functionDefinition
      )
        .bind(this.customFunctionScope);
      this.set('initFunctionRef', onstepFunctionRef);
    } catch (e) {
      alert('problem with function', e);
    }
  },
  /* 
    Takes a modelName (initFunction or onstepFunction
    evaluates it as a Function, and binds it to the track as a method named 
    initFunctionRef or onstepFunctionRef
   */
  async applyOnstepFunction(modelName) {
    const functionDefinition = await this.get(`${modelName}.function`);
    try {
      let functionRef = new Function(
        'index', 
        'data', 
        'array', 
        functionDefinition
      )
      .bind(this.customFunctionScope);
      this.set(`${modelName}Ref`, functionRef);
    } catch (e) {
      alert('problem with function', e);
    }
  },
})