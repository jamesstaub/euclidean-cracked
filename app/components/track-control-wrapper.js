import Component from '@ember/component';
import { or } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  dataLength: or('sequence.length', 'trackControl.data.length'),
  uiSize: computed('trackControl.interfaceName', {
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
      console.log(value);
    },

    async delete() {
      const track = await this.trackControl.get('track');
      await this.trackControl.destroyRecord();
      track.save();
    }
  }
});
