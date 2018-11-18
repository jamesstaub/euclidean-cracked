import Component from '@ember/component';
import { set, computed } from "@ember/object";
import { log } from 'handlebars';


export default Component.extend({
  init() {
    this._super(...arguments);
    set(this, "currentPath", "/");
  },

  didInsertElement() {},

  async fetchDirectory(path) {
    const url = `http://localhost:8080/${path}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.content;
  },

  selectConfig: computed("currentPath", {
    async get() {
      const content = await this.fetchDirectory(this.currentPath);
      const { dirs, audio, img } = content;
      const choices = audio.length ? audio : dirs;
      const type = audio.length ? 'audio' : 'dir';
      return {
        img,
        type,
        choices,
      }
    }
  }),

  actions: {
    onSelect(choice, type) {
      console.log('choice', choice);
      console.log("type", type);
      
      const newPath = `${this.path}${choice}`;
      if (type === 'dir') {
        set(this, "currentPath", newPath);
        console.log("dir path", choice);
      } else {
        set(this, "file", newPath);
        console.log('filepath', newPath);
      }

    }
  }
});
