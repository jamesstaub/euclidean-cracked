import DS from 'ember-data';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
/*
  Implementation notes on custom track controls:
  
  interfaceName: slider, multislider, toggle, xy control

  variable name: reference to an object that holds the current state of the interface, 
    available in the track function editor's scope
  
  the add-control menu will have options to add custom controls or pre-baked controls (ie filters, chromatic pitch)

*/
export default DS.Model.extend({
  track: DS.belongsTo('track'),
  interfaceName: DS.attr('string'),
  controlData: DS.attr('string', {
    defaultValue() {
      return Array.from(new Array(16), () => {
        return 0.5;
      }).join(',');
    }
  }),

  controlDataArray: computed('controlData.[]', {
    get() {
      return this.controlData ? this.controlData.split(',').map((val) => Math.max(Math.min(+val, this.max), this.min)) : [];
    }
  }),

  setDefaultValue() {
    const controlData = this.get('controlDataArray')
      .map(() => this.get('defaultVal') || 0)
      .join(',');
    this.set('controlData', controlData);
  },

  nodeSelector: DS.attr('string'),

  nodeName: DS.attr('string'),

  nodeAttr: DS.attr('string'),

  uniqueNameAttr: computed('nodeName', 'nodeAttr', {
    get() {
      return `${this.nodeName}-${this.nodeAttr}`;
    }
  }),
  
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

  defaultVal: DS.attr('number', {
    defaultValue() {
      return 1;
    }
  }),

  sequence: alias('track.sequence'),

});
