import DS from 'ember-data';

export default DS.Model.extend({

  post: DS.belongsTo('post'),
  filename: DS.attr('string'),

  hits: DS.attr('number'),
  steps: DS.attr('number'),
  offset: DS.attr('number'),

  sequence: DS.attr('string'),

});
