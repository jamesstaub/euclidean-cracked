import Component from '@ember/component';
import { computed } from '@ember/object';

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
            },
          ]
        },
        {
          nodeName: 'lowpass',
          nodeSelector: this.track.lowpassSelector,
          attrs: [
            {
              name: 'frequency',
              min: 0,
              max: 1,
            },
            {
              name: 'q',
              min: 0,
              max: 1,
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
            },
          ],
        },
      ]);
  },
  // TODO:  any way to dynamically render the nodes, attrs and selectors for 
  // track? 
  // think about this with a node config UI in mind
  menuListConfig: computed('menuType', {
    get() {
      switch (this.menuType) {
        case 'name':
          return this.defaultNodeOptions.map((node)=> {
            return { 
              label: node.nodeName, 
              action: 'setTargetNodeName', 
              actionArg: node,
            };
          });
        case 'attr':
          return this.defaultNodeOptions
            .findBy('nodeName', this.trackControl.nodeName)
            .attrs
            .map((attr) => {
            return {
              label: attr.name,
              action: 'setTargetNodeAttr', 
              actionArg: attr,
            };
          });
      }
    }
  }),

  actions: {
    onChangeValue(value) {
      this.trackControl.set('controlData', value.join(','));
      this.trackControl.save();
    },

    updateParam(isValid) {
      if (isValid) {
        this.trackControl.save();
      }
    },

    openNodeMenu(type) {
      this.set('menuType', type)
      this.set('menuOpen', true);
    },

    setTargetNodeName(item) {
      const { nodeName, nodeSelector } = item;
      this.trackControl.setProperties({ nodeName, nodeSelector });
      this.set('menuOpen', false);
    },
    setTargetNodeAttr(item) {
      this.trackControl.set('nodeAttr', item.name);
      this.set('menuOpen', false);
    },

    async delete() {
      const track = await this.trackControl.get('track');
      await this.trackControl.destroyRecord();
      track.save();
    }
  }
});
