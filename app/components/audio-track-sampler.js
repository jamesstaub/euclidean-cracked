import SequenceHelper from 'euclidean-cracked/mixins/sequence-helper';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, waitForProperty } from 'ember-concurrency';
import { get, set, computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend(SequenceHelper, {
  audioService: service(),

  classNames: ['audio-track-sampler'],

  customFunctionScope: computed('samplerId', 'gainId', 'lowpassId', {
    get() {
      // variables available for user defined track functions
      return {
        sampler: `#${get(this, 'samplerId')}`,
        gain: `#${get(this, 'gainId')}-onstep`,
        lowpass: `#${get(this, 'lowpassId')}`
      };
    }
  }),

  trackId: alias('track.id'),

  samplerId: computed('trackId', {
    get() {
      return `sampler-${get(this, 'trackId')}`;
    }
  }),

  gainId: computed('samplerId', {
    get() {
      return `${get(this, 'samplerId')}-gain`;
    }
  }),

  lowpassId: computed('samplerId', {
    get() {
      return `${get(this, 'samplerId')}-lowpass`;
    }
  }),

  path: computed('directory', 'filename', {
    get() {
      // TODO: how to set new filename without rebuilding node?
      return `${get(this, 'directory')}${get(this, 'filename')}`;
    }
  }),

  gain: computed({
    set(key, val) {
      __(`#${get(this, 'gainId')}`).attr({ gain: val });
      return val;
    }
  }),

  gainOnStep: computed({
    set(key, val) {
      __(`#${get(this, 'gainId')}-onstep`).attr({ gain: val });
      return val;
    }
  }),

  speedOnStep: computed({
    set(key, val) {
      __(`#${get(this, 'samplerId')}`).attr({ speed: val });
      return val;
    }
  }),

  loopEndOnStep: computed({
    set(key, val) {
      // __(`#${get(this, 'samplerId')}`).attr({loop:true});
      __(`#${get(this, 'samplerId')}`).attr({ start: 0, end: val });
      return val;
    }
  }),

  stepsUntilStart: computed('sequence.length', 'stepIndex', {
    get() {
      if (this.sequence) {
        return this.sequence.length - this.stepIndex;
      }
    }
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
      get(this, 'sequence') !== get(this, '_sequence') ||
      get(this, 'filename') !== get(this, '_filename');

    if (refreshOnUpdate) {
      get(this, 'initializeSampler').perform();
    }
    set(this, '_sequence', get(this, 'sequence'));
    set(this, '_filename', get(this, 'filename'));
  },

  willDestroy() {
    this.removeAllNodes();
  },

  initializeSampler: task(function*() {
    let sequence = yield waitForProperty(
      this,
      'sequence',
      s => typeof s !== 'undefined'
    );

    yield waitForProperty(this, 'filename', f => typeof f !== 'undefined');

    if (typeof this.stepIndex === 'undefined') {
      set(this, 'stepIndex', 0);
    }
    yield waitForProperty(this, 'stepIndex', 0);

    if (sequence.length) {
      this.removeAllNodes();
      this.buildNode();
      this.setSequenceParams();
      this.setSamplerData();
      get(this, 'audioService').bindTrackSamplers();
    }
  }).drop(),

  removeAllNodes() {
    __(`#${get(this, 'samplerId')}`).unbind('step');

    // NOTE: any cracked node created in this component must be selected
    // for tear down here, otherwise lingering nodes will break
    // ability to select by ID
    // let selectors = [
    //   `#${get(this, 'samplerId')}`,
    //   `#${get(this, 'gainId')}`,
    //   `#${get(this, 'lowpassId')}`,
    //   `#${get(this, 'gainId')}-onstep`
    // ];
    let selectors = [`.${get(this, 'trackId')}-node`];
    selectors.forEach(selector => {
      __(selector).remove();
    });

    set(this, 'hasBuiltNode', false);

    // remove reference from service
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
        class: `${get(this, 'trackId')}-node`
      })
      .lowpass({
        id: get(this, 'lowpassId'),
        frequency: 10000,
        q: 0,
        class: `${get(this, 'trackId')}-node`
      })
      .gain({
        id: get(this, 'gainId'),
        class: `${get(this, 'trackId')}-node`,
        gain: get(this, 'gain')
      })
      .gain({
        id: `${get(this, 'gainId')}-onstep`,
        class: `${get(this, 'trackId')}-node`
      })
      .connect(get(this, 'outputNodeSelector'));
  },

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data, array) {
    set(this, 'stepIndex', index);
    let serviceTracks = get(this, 'audioService.tracks');
    // TODO: refactor this so findBy is not called on every step
    // also: find a clearer way of distinguishing between track model and service track reference
    let trackRef = serviceTracks.findBy('trackId', get(this, 'trackId'));

    if (data) {
      __(this).stop();
      __(this).start();

      __(this).attr({ loop: get(this, 'isLooping') });

      if (trackRef.gainStepArray) {
        set(this, 'gainOnStep', trackRef.gainStepArray[index]);
      }

      if (trackRef.speedStepArray) {
        set(this, 'speedOnStep', trackRef.speedStepArray[index]);
      }

      if (trackRef.loopEndStepArray) {
        set(this, 'loopEndOnStep', trackRef.loopEndStepArray[index]);
      }
    } else {
      __(this).stop();
      // if (!get(this, 'isLegato')) {
      // __(this).attr({loop:false});
      // }
    }

    if (trackRef.customFunction) {
      trackRef.customFunction(index, data, array);
    }
  },

  setSequenceParams() {
    // apply sequence data from track model to global service track reference
    let trackId = get(this, 'trackId');
    let serviceTrackRef = get(this, 'audioService').findOrCreateTrackRef(
      trackId
    );

    let sequenceArrayKeys = [
      'gainStepArray',
      'speedStepArray',
      'loopEndStepArray'
    ];

    sequenceArrayKeys.forEach(key => {
      set(serviceTrackRef, key, get(this, key));
    });

    return serviceTrackRef;
  },

  setSamplerData() {
    let trackId = get(this, 'trackId');

    let serviceTrackRef = get(this, 'audioService').findOrCreateTrackRef(
      trackId
    );

    let selector = `#${get(this, 'samplerId')}`;
    let callback = get(this, 'onStepCallback').bind(this);
    let sequence = get(this, 'sequence');

    let customFunction = get(this, 'track.function');

    if (customFunction) {
      let scope = get(this, 'customFunctionScope');
      get(this, 'audioService').applyTrackFunction(
        serviceTrackRef,
        customFunction,
        scope
      );
    }

    // set sampler selector, onStep callback and rhythm sequence
    set(serviceTrackRef, 'selector', selector);
    set(serviceTrackRef, 'callback', callback);
    set(serviceTrackRef, 'sequence', sequence);
  }
});
