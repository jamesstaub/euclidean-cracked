import DS from 'ember-data';
import { computed } from '@ember/object';
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
  controlData: DS.attr('string', {
    defaultValue() {
      return Array.from(new Array(16), () => {
        return 0.5;
      }).join(',');
    }
  }),

  controlDataArray: computed('controlData', {
    get() {
      return this.controlData ? this.controlData.split(',').map((val) => Math.max(Math.min(+val, this.max), this.min)) : [];
    }
  }),

  nodeName: DS.attr('string'),
  nodeSelector: DS.attr('string'),
  nodeAttr: DS.attr('string'),
  
  min: DS.attr('number', {
    defaultValue() {
      return 0;
    }
  }),
  max: DS.attr('number', {
    defaultValue() {
      return 1;
    }
  }),

});
