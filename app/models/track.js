import DS from 'ember-data';
import config from '../config/environment';

export default DS.Model.extend({

  post: DS.belongsTo('post'),

  // belongs on post model but used here as
  // convenience for firebase .write rules
  postCreatorUid: DS.attr('string'),

  // written only by same property on post
  // again, convenience for firebase auth rules
  publicEditable: DS.attr('boolean'),

  filename: DS.attr('string', {
    defaultValue() { return config.audioFileNames[0] }
  }),

  hits: DS.attr('number', {
    defaultValue() { return 3 }
  }),

  steps: DS.attr('number', {
    defaultValue() { return 8 }
  }),

  offset: DS.attr('number', {
    defaultValue() { return 0 }
  }),

  gain: DS.attr('number', {
    defaultValue() { return .5 }
  }),

  gainStepSeq: DS.attr('string'),
  speedStepSeq: DS.attr('string'),

});
