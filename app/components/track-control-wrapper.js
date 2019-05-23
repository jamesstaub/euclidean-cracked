import Component from '@ember/component';
import { or } from '@ember/object/computed';
export default Component.extend({
  tagName: '',
  dataLength: or('sequence.length', 'trackControl.data.length'),

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
