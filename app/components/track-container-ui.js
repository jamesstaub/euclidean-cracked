import Component from '@ember/component';

export default Component.extend({
  tagName: 'li',
  classNames: ['track-container flex justify-between items-center w-100 pa3 bb b--gray'],
  classNameBindings: ['isActive:bg-dark-blue:bg-dark-gray'],
  
  willDestroyElement() {
    this._super(...arguments);
    this.track.removeAllNodes();
  },

  click(e) {
    // FIXME replace this with stopPropagation solution
    if (e.target.className
      && e.target.className.indexOf
      && e.target.className.indexOf('delete-track-btn') > -1) {
      // dont set active if deleting
      return false;
    }
    this.selectActiveTrack(this.track);
  },

  actions: {
    async deleteTrack(track) {
      this.onDeleteTrack(track);
    },
  }
});
