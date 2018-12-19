import DS from 'ember-data';
import { computed } from '@ember/object';
export default DS.Model.extend({
  post: DS.belongsTo('post'),

  // belongs on post model but used here as
  // convenience for firebase .write rules
  postCreatorUid: DS.attr('string'),

  // written only by same property on post
  // again, convenience for firebase auth rules
  publicEditable: DS.attr('boolean'),

  isLooping: DS.attr('boolean'),

  filepath: DS.attr('string', {
    // TODO request file server api
    // labelled categories for random kick, snare, hat etc
    // defaultValue() {
    // }
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

  gain: DS.attr('number', {
    defaultValue() {
      return 0.5;
    }
  }),

  gainStepSeq: DS.attr('string'),
  speedStepSeq: DS.attr('string'),
  loopStepArray: DS.attr('string'),

  function: DS.attr('string', {
    defaultValue() {
      return '';
    }
  }),
  functionEditorContent: DS.attr('string', {
    defaultValue() {
      return '';
    }
  })
});
