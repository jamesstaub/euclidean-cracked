import DS from 'ember-data';
import config from '../config/environment';

export default DS.Model.extend({

  post: DS.belongsTo('post'),

  // convenience for firebase .write rules
  postCreatorId: DS.attr('string'),

  publicEditable: DS.attr('boolean', {
    defaultValue() { return false }
  }),
  publicVisible: DS.attr('boolean', {
    defaultValue() { return true }
  }),

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

});
