import Component from '@ember/component';

export default Component.extend({
  classNames: ['track-container', 'pa4', 'flex','pointer'],
  classNameBindings: ['isActive:bg-light-silver'],
  click(e) {
    const isDeleteClick = e.target.className.indexOf('delete-track-btn') > -1
    if (isDeleteClick) {
      // dont set active if deleting
      return false;
    }
    this.selectActiveTrack(this.track);
  },
  actions: {
    async deleteTrack(track) {
      this.onDeleteTrack(track);
    }
  }
});
