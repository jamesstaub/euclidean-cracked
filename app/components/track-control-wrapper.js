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

    async delete() {
      const track = await this.trackControl.get('track');
      await this.trackControl.destroyRecord();
      track.save();
    }
  }
});
