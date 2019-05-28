import E from 'euclidean-cracked/utils/euclidean';

import { computed } from '@ember/object';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import TrackSamplerInstance from './track-sampler-instance';

export default TrackSamplerInstance.extend({
  project: belongsTo('project'),
  trackControls: hasMany('track-control'),

  // belongs on project model but used here as
  // convenience for firebase .write rules
  projectCreatorUid: attr('string'),

  // written only by same property on project
  // again, convenience for firebase auth rules
  publicEditable: attr('boolean'),

  isLooping: attr('boolean'),

  filepath: attr('string', {
    // TODO request file server api
    // labelled categories for random kick, snare, hat etc
    defaultValue() {
      const files = [
        '/Ace Tone Rhythm Ace/KICK1.mp3',
        '/Ace Tone Rhythm Ace/SNARE1.mp3',
        '/Ace Tone Rhythm Ace/HHCL.mp3',
        '/Ace Tone Rhythm Ace/HHOP.mp3',
      ];
      const idx = __.random(0, files.length);
      return files[idx];
    }
  }),

  filename: computed('filepath', {
    get() {
      if (this.filepath) {
        let filename = this.filepath.replace(/^.*[\\\/]/, '');
        filename = filename.split('.');
        filename.pop();
        return filename;
      }
    }
  }),

  customFunction: belongsTo('customFunction'),

  hits: attr('number', {
    defaultValue() {
      return __.random(1,4);
    }
  }),

  steps: attr('number', {
    defaultValue() {
      return 8;
    }
  }),

  offset: attr('number', {
    defaultValue() {
      return 0;
    }
  }),

  sequence: computed('hits', 'steps', 'offset', {
    get() {
      const hasHits = typeof this.hits !== 'undefined';
      const hasSteps = typeof this.steps !== 'undefined';
      if (hasHits && hasSteps) {
        return E(this.hits, this.steps, this.offset);
      }
    }
  }),

  /* 
    this could move to a track UI subclass
    params to fit multislider to same width as sequence
  */ 
  multisliderSize: computed('sequence.length', {
    get() {
      let uiStepSize = 40;
      let width = (uiStepSize * .85) * this.sequence.length;
      let height = 120;
      return [width, height];
    }
  }),

  gain: attr('number', {
    defaultValue() {
      return 0.5;
    }
  }),

  // TODO serialize/normalize to string for firebase
  // gainStepSeq: attr('firestore.array'),

});
