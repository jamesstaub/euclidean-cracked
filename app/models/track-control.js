import DS from 'ember-data';

export default DS.Model.extend({
  track: DS.belongsTo('track'),
  variableName: DS.attr('string'),
  interfaceName: DS.attr('string'),
  sequence: DS.attr('string'),
  
  // data: DS.attr('string'),
  min: DS.attr('number'),
  max: DS.attr('number'),

});
