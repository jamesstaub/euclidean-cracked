import Component from '@ember/component';
import { set,  } from "@ember/object";
import { reads, bool } from '@ember/object/computed';

export default Component.extend({
  init() {
    this._super(...arguments);
    set(this, 'currentPath', '');
  },

  didInsertElement() {
    this.updateSelectOptions('');
  },

  img: reads('results.img'),
  type: reads('results.type'),
  choices: reads('results.choices'),

  showBackButton: bool('currentPath.length'),

  async fetchDirectory(path) {
    const url = `http://localhost:8080/${path}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.content;
  },

  async updateSelectOptions(path, requestParentDir=false){
      set(this, 'currentPath', path);
      const content = await this.fetchDirectory(path);
      const { dirs, audio, img } = content;
      const type = audio.length ? "audio" : "dir";
      const choices = audio.length ? audio : dirs;
 
      if(dirs.length === 1) {
        
        if(requestParentDir) {
          path = this._getParentPath(path);
        } else {
          path = `${this.currentPath}/${dirs[0]}`;
        }

        this.updateSelectOptions(path);
      }

      const results = {
        img: img,
        type: type,
        choices: choices
      };
      

      set(this, 'results', results);
      return results;
  },

  actions: {
    onSelect(choice) {
      let newPath = `${this.currentPath}${choice}`;
      if (this.type === 'dir') {
        newPath = `${newPath}/`;
        set(this, 'currentPath', newPath);
        this.updateSelectOptions(newPath);
      } else if (this.type === 'audio'){
        this.track.set('filename', newPath)
        this.track.save();
      }
    },

    back() {
      let newPath = this._getParentPath(this.currentPath)
      this.updateSelectOptions(newPath, true);
    }
  },

  _getParentPath(path) {
    // split path into array, filter empty str from trailing slash
    path = path.split('/').filter((lvl)=> lvl != '');
    // pop last item to move up a level
    path.pop();
    // re-add trailing slash
    path = path.join('/');
    return path.length ? `${path}/` : '';
  }
});
