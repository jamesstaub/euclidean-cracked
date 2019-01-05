import Component from '@ember/component';
import { next } from '@ember/runloop';

export default Component.extend({
 
  didInsertElement() {
    this._super(...arguments);
    if (this.filepath) {
      const pathDirs = this.filepath.split('/').filter((dir)=> dir);
      const selected = pathDirs[this.idx];
      this.set('selected', selected);
    }
    
    next(()=> {
      let selector = this.$('.selected').get();
      if (selector.length) {
        selector[0].scrollIntoView();
      }
    })

  },
  actions: {
    onSelect(dir, choice,) {
      this.set('selected', choice);
      this.onSelect(dir, choice);
    }
  }
});
