import Component from '@ember/component';

export default Component.extend({
  classNames: ['track-container', 'pa4', 'flex','pointer'],
  classNameBindings: ['isActive:bg-light-silver'],
  click() {
    this.selectActiveTrack(this.track);
  },
  actions: {
    async deleteTrack(track) {
      const customFunction = await track.customFunction;
      // TODO: delete customFunction with cloud Function
      // since readOnly validation prevents deletion
      // customFunction.destroyRecord();
      track.destroyRecord();
    }
  }
});
