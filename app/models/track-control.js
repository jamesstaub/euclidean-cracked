import DS from 'ember-data';
/*
  Implementation notes on custom track controls:
  
  interfaceName: slider, multislider, toggle, xy control

  variable name: reference to an object that holds the current state of the interface, 
    available in the track function editor's scope
  
  the add-control menu will have options to add custom controls or pre-baked controls (ie filters, chromatic pitch)

*/
export default DS.Model.extend({
  track: DS.belongsTo('track'),
  variableName: DS.attr('string'),
  interfaceName: DS.attr('string'),
  controlData: DS.attr(), // this throws a firebase error but otherwise works
  
  nodeName: DS.attr('string'),
  nodeSelector: DS.attr('string'),
  nodeAttr: DS.attr('string'),
  
  min: DS.attr('number'),
  max: DS.attr('number'),

});
