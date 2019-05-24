import Component from '@ember/component';
import { or } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  dataLength: or('sequence.length', 'trackControl.data.length'),
  size: computed('trackControl.interfaceName', {
    get() {
      switch (this.trackControl.interfaceName) {
        case 'ui-slider': 
          return [20, 120];
        case 'ui-multislider':
          return []
      
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
