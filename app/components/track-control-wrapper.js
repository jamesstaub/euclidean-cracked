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

  saveTask: task(function*(){
    yield this.trackControl.save();
    yield timeout(100);
  }).keepLatest(),

  setNodeParam(params, nodeAttrParams) {
    this.trackControl.setProperties({
      nodeAttr: nodeAttrParams.name,
      ...params,
      min: nodeAttrParams.min,
      max: nodeAttrParams.max,
      defaultVal: nodeAttrParams.defaultVal,
      controlData: this.trackControl.get('controlDataArray')
        .map(() => nodeAttrParams.defaultVal)
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
    
    // min, max, defaultVal
    updateNumberParam() {
      let { min, max, defaultVal } = this.trackControl;
      if (min > max) {
        max = min;
      }
      this.trackControl.setProperties({min, max, defaultVal});
      this.saveTask.perform();
    },
   
    setDefault() {
      this.trackControl.setDefaultValue();
      this.saveTask.perform();
    },

    async delete() {
      const track = await this.trackControl.get('track');
      await this.trackControl.destroyRecord();
      track.save();
    }
  }
});
