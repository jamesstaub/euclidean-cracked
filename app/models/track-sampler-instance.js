/* eslint-disable complexity */
import Model from 'ember-data/model';
import { computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';
import crackedNodeUtil from '../utils/cracked-nodes';

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
  
  /* class to add to all nodes on this track 
    this suffix -controlleris used to select audio nodes
    to dynamically create multislider controls for
  */
  nodeWithControllerClass: nodeName('id', 'controller'),

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
  
  
  /* Class selector for every node bound to this track */
  trackNodeSelector: selectorFor('class', 'nodeWithControllerClass'),

  path: computed('directory', 'filepath', {
    get() {
      const filepath = this.filepath.replace(' ', '%20');
      return `https://storage.googleapis.com/euclidean-cracked.appspot.com/Drum Machines mp3${filepath}`;
    }
  }),

  // stepsUntilStart: computed('sequence.length', 'stepIndex', {
  //   get() {
  //     if (this.sequence) {
  //       return this.sequence.length - this.stepIndex;
  //     }
  //   }
  // }),

  // 
  customFunctionScope: computed(
    'samplerSelector',
    'gainValue',
    'path',
    'nodeWithControllerClass', {
    get() {
      // variables available for user defined track functions

      return {
        path: this.path,
        sampler: this.samplerSelector,
        samplerId: this.samplerId,
        className: this.nodeWithControllerClass,
        gainId: this.gainId,
        gainValue: this.gain,
      };
    }
  }),

  // TODO: cracked: how to set new filepath without rebuilding node?

    // create multisliders for each web audio node defined in the init function
    async createTrackControls() {
      // TODO delete orphaned records as user add/removes audio nodes
      // let newTrackControlIds = new Set(newTrackControls.map((ctrl)=> ctrl.uniqueNameAttr));
      // let loadedTrackControlIds = new Set(this.trackControls.map((ctrl)=> ctrl.uniqueNameAttr));
      // // get diff of newly updated records and those already loaded on track
      // const diff = [...newTrackControlIds].filter(x => !loadedTrackControlIds.has(x));
      // TODO when to save (destroy) the deleted record, and do i need to also save the track?

      // this.trackControls.forEach((trackControl) => {
      //   trackControl.deleteRecord();
      // });
      const nodes = crackedNodeUtil.selectNodes(this.trackNodeSelector);
      // get array of options to create new track-control model instances
      // by querying existing cracked nodes
      const controlDefaults = nodes
        .map((node) => crackedNodeUtil.attrsForNode(node))
        .map((attrs) => crackedNodeUtil.defaultForAttr(...attrs));
      
      // iterate over the array of configs for mapped from the selected nodes with the control class.
      const newTrackControls = controlDefaults.flat().map((options)=>{
        options = { interfaceName: 'ui-multislider', ...options };
        
        let trackControl = this.trackControls.findBy('uniqueNameAttr', `${options.nodeName}-${options.nodeAttr}`);
        console.log(trackControl, `${options.nodeName}-${options.nodeAttr}`); 
        if (trackControl) {
          // if this node/attr pair exists, update it
          trackControl.setProperties(options);
        } else {
          trackControl = this.store.createRecord('track-control', options);
          trackControl.setDefaultValue();
        }
        console.log('got set', trackControl.nodeUUID);
        this.trackControls.pushObject(trackControl);
        return trackControl;
      });

 
      const saveArray = await Promise.all(newTrackControls.map((record) => record.save()));
      return saveArray;
    },

  // callback functions to be called on each step of sequencer
  // eslint-disable-next-line complexity
  onStepCallback(index, data, array) {
    this.set('stepIndex', index);

    if (data) {
      __(this.samplerSelector).stop();
      __(this.samplerSelector).start();

      __(this.samplerSelector).attr({ loop: this.isLooping });
    } else {
      __(this.samplerSelector).stop();
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
    yield waitForProperty(
      this,
      'sequence',
      s => typeof s !== 'undefined'
    );

    yield waitForProperty(this, 'samplerId');
    yield waitForProperty(this, 'filepath');
    yield waitForProperty(this.initFunction, 'isFulfilled');
    yield waitForProperty(this.onstepFunction, 'isFulfilled');
    yield waitForProperty(this.trackControls, 'isFulfilled');
    console.log('done waiting');
    if (this.sequence.length) {
      yield this.setupInitFunctionAndControls();

      yield this.bindTrackSampler();

      if (this.get('project.isPlaying')) {
        // wait until beginning of sequence to apply changes
        // prevents lots of concurrent disruptions
        if (awaitStart) {
          yield waitForProperty(this, 'stepIndex', 0);
        }
        __.loop('start');
      }
    } else {
      throw "There is no sequence";
    }
  }).keepLatest(),

  async setupInitFunctionAndControls() {
    this.bindCustomFunctionDefinition.perform('initFunction');
    if (this.initFunctionRef) {
      // Call initFunction
      this.initFunctionRef();
      // this should only happen when custominitfunction is run
      await this.createTrackControls();
    }
  },

  bindTrackSampler() {
    // let selector = `#${this.samplerId}`;
    let onStepCallback = this.onStepCallback.bind(this);
    
    this.bindCustomFunctionDefinition.perform('onstepFunction');

    __(this.samplerSelector).unbind('step');
  
    __(this.samplerSelector).bind(
      'step', // on every crack sequencer step
      onStepCallback, // call this function (bound to component scope)
      this.sequence // passing in array value at position
    );
  },

  /**
   * todo: to cleanup
   * lookup the difference in cracked nodes that exist before and 
   * after this init function is called. store them and attempt to
   * clear them every time this track is re-initialized
    // return object of all web audio nodes (uuid as keys)
    // const nodeStoreBeforeInit = __._getNodeStore();    
    // const before = Object.keys(nodeStoreBeforeInit);


    // const nodeStoreAfterInit = __._getNodeStore();
    // const after = Object.keys(nodeStoreAfterInit);
   */


  applyTrackControls(index) {
    // iterate over each track conrol and update the cracked audio note attributes
    // by selector or uuid
    this.get('trackControls').forEach((control)=> {
      let { nodeSelector,  nodeUUID, nodeAttr, controlDataArray } = control.getProperties(
        'nodeName', 'nodeSelector', 'nodeUUID', 'nodeAttr', 'controlDataArray'
      );
      const attrs = {};
      nodeSelector || nodeUUID;
      if (nodeAttr && controlDataArray.length) {
        attrs[nodeAttr] = controlDataArray[index];
        if (nodeSelector) {
          __(nodeSelector).attr(attrs);
        } else {
          __._getNode(nodeUUID).attr(attrs);
        }
      }
    });
  },

  /* 
    Takes a modelName (initFunction or onstepFunction
    evaluates it as a Function, and binds it to the track as a method named 
    initFunctionRef or onstepFunctionRef
   */
  bindCustomFunctionDefinition: task(function*(modelName) {
    const customFunctionModel =  this.get(`${modelName}`);
    yield waitForProperty(customFunctionModel, 'function');
    const functionDefinition = customFunctionModel.get('function');
    if (functionDefinition) {
      let functionRef;
      try {
        if (modelName === 'initFunction') {
          functionRef = new Function(functionDefinition).bind(this.customFunctionScope);
        }
        if (modelName === 'onstepFunction') {
          functionRef = new Function(
            'index', 
            'data', 
            'array', 
            functionDefinition
          )
          .bind(this.customFunctionScope);
        }
        this.set(`${modelName}Ref`, functionRef);
      } catch (e) {
        alert('problem with function', e);
      }
    }
  }),
  removeAllNodes() {
    // TOOD
  }
})