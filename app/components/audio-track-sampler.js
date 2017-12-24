import Ember from 'ember';
import SequenceHelper from  'euclidean-cracked/mixins/sequence-helper';
import { get, set, computed } from "@ember/object";
import { alias } from "@ember/object/computed";

const { service } = Ember.inject;

export default Ember.Component.extend(SequenceHelper, {
  audioService: service(),
  classNames: ['audio-track-sampler'],
  classNameBindings: [
    'trackReady' // only used to force computed get() to run
  ],

  trackId: alias('track.id'),
  filename: alias('track.filename'),

  samplerId: computed('trackId', {
    get() {
      return `sampler-${get(this, 'trackId')}`;
    },
  }),

  gainId: computed('samplerId', {
    get() {
      return `${get(this, 'samplerId')}-gain`;
    },
  }),

  path: computed('directory', 'filename', {
    get() {
      // TODO: how to set new filename without rebuilding node?
      return `${get(this, 'directory')}${get(this, 'filename')}`;
    },
  }),

  gain: computed('track.gain', {
    get() {
      return get(this, 'track.gain');
    },
    set(key, val) {
      __(`#${get(this, 'gainId')}`).attr({gain: val});
      return val;
    }
  }),

  gainOnStep: computed({
    set(key, val) {
      __(`#${get(this, 'gainId')}-onstep`).attr({gain: val});
      return val;
    }
  }),

  speedOnStep: computed({
    set(key, val) {
      __(`#${get(this, 'samplerId')}`).attr({speed: val});
      return val;
    }
  }),

  loopEndOnStep: computed({
    set(key, val) {
      // __(`#${get(this, 'samplerId')}`).attr({loop:true});
      __(`#${get(this, 'samplerId')}`).attr({loop:true, start:0, end: val});
      return val;
    }
  }),

  trackReady: computed('sequence', 'filename',{
    get() {

      let requirements = [
        get(this, 'sequence'),
        get(this, 'filename'),
      ];

      let isReady = requirements.every((property)=>{
        return typeof property != 'undefined';
      });

      if (isReady && !get(this, 'hasBuiltNode')){
        this.initializeSampler();
      }

    },

  }),

  init() {
    this._super(...arguments);
    // set(this, 'isLooping', false);/
  },

  didReceiveAttrs() {
    this._super(...arguments);
    // cache and compare properties that require
    // a refresh of sampler nodes on update
    // ie [sequence, filename, ...
    let refreshOnUpdate =
      get(this, 'sequence') !== get(this, '_sequence')
      || get(this, 'filename') !== get(this, '_filename')

    if (refreshOnUpdate) {
      this.initializeSampler();
    }
    set(this, '_sequence', get(this, 'sequence'));
    set(this, '_filename', get(this, 'filename'));
  },


  willDestroy() {
    this.removeAllNodes();
  },

  removeAllNodes() {
    __(`#${get(this, 'samplerId')}`).unbind("step");

    // NOTE: any cracked node created in this component must be selected
    // for tear down here, otherwise lingering nodes will break
    // ability to select by ID
    let selectors = [
      `#${get(this, 'samplerId')}`,
      `#${get(this, 'gainId')}`,
      `#${get(this, 'gainId')}-onstep`
    ];

    selectors.forEach((selector)=>{
      __(selector).remove();
    });

    set(this, 'hasBuiltNode', false);

    //remove reference from service
    let serviceTracks = get(this, 'audioService.tracks');
    let ref = serviceTracks.findBy('trackId', get(this, 'trackId'));
    serviceTracks.removeObject(ref);
  },

  buildNode() {
    set(this, 'hasBuiltNode', true);
    __()
    .sampler({
      id: get(this, 'samplerId'),
      path: get(this, 'path'),
    })
    .gain({
      id: get(this, 'gainId'),
    })
    .gain({
      id: `${get(this, 'gainId')}-onstep`,
    })
    .connect(get(this, 'outputNodeSelector'));
  },

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data){
    set(this, 'stepIndex', index);
    if (data) {
      // __(this).stop();
      __(this).start();

      let serviceTracks = get(this, 'audioService.tracks');
      let trackRef = serviceTracks.findBy('trackId', get(this, 'trackId'));

      if (trackRef.gainStepArray) {
        set(this, 'gainOnStep', trackRef.gainStepArray[index])
      }

      if (trackRef.speedStepArray) {
        set(this, 'speedOnStep', trackRef.speedStepArray[index])
      }

      if (trackRef.loopEndStepArray) {
        __(this).attr({loop:true});
        set(this, 'loopEndOnStep', trackRef.loopEndStepArray[index])
      }
    // if(get(this, 'isLooping')){
    //     let loopEnd = get(this, 'samplerStepParams')['loopEnd'][index];
    //     __(this).attr({loop:true, start: 0, end: loopEnd});
    //   }
    } else {
      __(this).stop();
      // if (!get(this, 'isLegato')) {
      __(this).attr({loop:false});
      // }
    }
  },

  initializeTrackData() {
    let trackId = get(this, 'trackId');
    let serviceTrackRef = get(this, 'audioService.tracks').findBy('trackId', trackId);

    if (!serviceTrackRef) {
      serviceTrackRef = {trackId: trackId}
      serviceTrackRef = this.applySequenceData(serviceTrackRef);
      get(this, 'audioService.tracks').push(serviceTrackRef);
    } else {
      this.applySequenceData(serviceTrackRef);
    }
  },

  applySequenceData(serviceTrackRef){
    // serialize and apply stringified parameter sequences
    // to global service track reference
    let sequenceArrayKeys = [
      'gainStepArray',
      'speedStepArray',
      'loopEndStepArray',
    ];

    sequenceArrayKeys.forEach((key)=>{
      set(serviceTrackRef, key, get(this, key));
    });

    return serviceTrackRef;
  },

  setGlobalTrackData() {
    let trackId = get(this, 'trackId');

    //access global data for this track on audio service
    let serviceTrackRef = get(this, 'audioService.tracks').findBy('trackId', trackId);

    let selector  =`#${get(this,'samplerId')}`;
    let callback = get(this, 'onStepCallback').bind(this);
    let sequence = get(this,'sequence');

    // set sampler selector, onStep call back and rhythm sequence
    set(serviceTrackRef, 'selector', selector);
    set(serviceTrackRef, 'callback', callback);
    set(serviceTrackRef, 'sequence', sequence);
  },

  initializeSampler() {
    if (get(this, 'sequence')) {
      this.removeAllNodes();
      this.buildNode();
      this.initializeTrackData();
      this.setGlobalTrackData();
      get(this, 'audioService').bindTrackSamplers();
    }
  },

});
