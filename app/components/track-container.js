import Component from '@ember/component';

export default Component.extend({
  classNames: ['track-container', 'pa4', 'flex','pointer'],
  classNameBindings: ['isActive:bg-light-silver'],

  didInsertElement() {
    this._super(...arguments);
    // activate the first track on load
    if (this.idx === 0) {
      this.selectActiveTrack(this.track, this.sampler);
      console.log(this.track, this.sampler);
    }
  },
  click(e) {
    const isDeleteClick = e.target.className.indexOf('delete-track-btn') > -1
    if (isDeleteClick) {
      // dont set active if deleting
      return false;
    }
    this.selectActiveTrack(this.track, this.sampler);
  },
  actions: {
    async deleteTrack(track) {
      this.onDeleteTrack(track);
    },
    setSamplerOnContainer(sampler) {
      this.set('sampler', sampler);
    }
  }
});
