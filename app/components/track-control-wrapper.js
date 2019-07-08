import Component from '@ember/component';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  uiSize: computed('track.multisliderSize','trackControl.interfaceName', {
    get() {
      switch (this.trackControl.interfaceName) {
        case 'ui-slider': 
          return [20, 120];
        case 'ui-multislider':
          return this.track.multisliderSize;
      }
    }
  }),

  init() {
    this._super(...arguments);
    this.set('defaultNodeOptions', 
      [
        {
          nodeName: 'gain',
          nodeSelector: this.track.gainSelector,
          attrs: [
            {
              name: 'gain',
              min: 0,
              max: 1,
              default: 1,
            },
          ]
        },
        {
          nodeName: 'lowpass',
          nodeSelector: this.track.lowpassSelector,
          attrs: [
            {
              name: 'frequency',
              min: 20,
              max: 20000,
              default: 5000,
            },
            {
              name: 'q',
              min: 0,
              max: 20,
              default: 0,
            },
          ]
        },
        {
          nodeName: 'sampler',
          nodeSelector: this.track.samplerSelector,
          attrs: [
            {
              name: 'speed',
              min: 0,
              max: 2,
              default: 1,
            },
          ],
        },
      ]);
  },

  // TODO:  any way to dynamically render the nodes, attrs and selectors for 
  // track? 
  // think about this with a node config UI in mind

  nodeAttrOptions: computed('trackControl.nodeName', 'nodeNameOptions.@each.value', {
    get() {
      if (this.trackControl.nodeName) {
        const nodeAttr = this.defaultNodeOptions
          .findBy('nodeName', this.trackControl.nodeName)
          .attrs
          .map((attr) => {
            return {
              value: attr.name,
            };
          });
        return nodeAttr;
      }
    }
  }),

  saveTask: task(function*(){
    this.trackControl.save();
    yield timeout(300);
  }).keepLatest(),

  setNodeParam(params, nodeAttrParams) {
    this.trackControl.setProperties({
      nodeAttr: nodeAttrParams.name,
      ...params,
      min: nodeAttrParams.min,
      max: nodeAttrParams.max,
      default: nodeAttrParams.default,
      controlData: this.trackControl.get('controlDataArray')
        .map(() => nodeAttrParams.default)
        .join(',')
    });

    this.saveTask.perform();
  },

  actions: {
    // param array
    onChangeValue(value) {
      this.trackControl.set('controlData', value.join(','));
      this.saveTask.perform();
    },
    
    // min, max, default
    updateNumberParam() {
      let {min, max} = this.trackControl;
      if (min > max) {
        max = min;
      }
      this.trackControl.set('max', max);
      this.saveTask.perform();
    },

    setTargetNodeName(value) {
      const [nodeName, nodeSelector] = value.split('@@');
      const nodeAttrParams = this.defaultNodeOptions.findBy('nodeName', nodeName).attrs.firstObject;
      this.setNodeParam({nodeName, nodeSelector}, nodeAttrParams);
    },
   
    setTargetNodeAttr(nodeAttr) {
      const nodeAttrParams = this.defaultNodeOptions.findBy('nodeName', this.trackControl.nodeName).attrs.firstObject;
      this.setNodeParam({ nodeAttr }, nodeAttrParams);
    },

    setDefault() {
      const controlData = this.trackControl.get('controlDataArray')
        .map(() => this.trackControl.get('default'))
        .join(',');
      this.trackControl.set('controlData', controlData);
      this.saveTask.perform();
    },

    async delete() {
      const track = await this.trackControl.get('track');
      await this.trackControl.destroyRecord();
      track.save();
    }
  }
});
