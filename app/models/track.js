import DS from 'ember-data';
import { computed } from '@ember/object';
import E from 'euclidean-cracked/utils/euclidean';

export default DS.Model.extend({
  project: DS.belongsTo('project'),
  trackControls: DS.hasMany('track-control'),

  // belongs on project model but used here as
  // convenience for firebase .write rules
  projectCreatorUid: DS.attr('string'),

  // written only by same property on project
  // again, convenience for firebase auth rules
  publicEditable: DS.attr('boolean'),

  isLooping: DS.attr('boolean'),

  filepath: DS.attr('string', {
    // TODO request file server api
    // labelled categories for random kick, snare, hat etc
    defaultValue() {
      return "/Ace Tone Rhythm Ace/KICK1.mp3";
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

  customFunction: DS.belongsTo('customFunction'),

  hits: DS.attr('number', {
    defaultValue() {
      return 3;
    }
  }),

  steps: DS.attr('number', {
    defaultValue() {
      return 8;
    }
  }),

  offset: DS.attr('number', {
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

  gain: DS.attr('number', {
    defaultValue() {
      return 0.5;
    }
  }),

  gainStepSeq: DS.attr('string'),
  speedStepSeq: DS.attr('string'),
  loopStepArray: DS.attr('string')
});
