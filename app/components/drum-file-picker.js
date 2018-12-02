import Component from '@ember/component';
import { set  } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, waitForProperty} from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);
    set(this, 'directories', []);
    set(this, 'currentPath', '');
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let path = '';
    if (this.track && this.track.filename) {
      console.log('init dirs from track');
      this.initDirectoryFromTrack(this.track.filename);
    } else {
      console.log('update dirs');
      this.updateDirectories(path);
    }
  },

  async fetchDirectory(path) {
    const url = `http://localhost:8080${path}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.content;
  },

  parseResponse(content) {
    const { dirs, audio } = content;
    // prefer type as audio if contains both
    content.type = audio.length ? 'audio' : 'dir';
    content.choices = audio.length ? audio : dirs;
    return content;
  },

  async initDirectoryFromTrack(filename) {
    let path = filename.split('/')
    path.pop();
    let response = await this.fetchDirectory(path.join('/'));
    if (response.ancestor_tree) {
      let directories = response.ancestor_tree.map((dir) => {
        return this.parseResponse(dir.content);
      });
      set(this, 'directories', directories);
    } 
  },

  async updateDirectories(pathToFetch) {
    set(this, 'currentPath', pathToFetch);
    let response = await this.fetchDirectory(pathToFetch);

      let directory = this.parseResponse(response);
      // clear any child directories when clicking back higher up the tree
      const pathDepth = directory.path
        .split('/')
        .filter(s => s.length).length;
      while (this.directories.length > pathDepth) {
        this.directories.pop();
      }

      this.directories.pushObject(directory);

  },


  // async updateDirectoriesFromFilename(filename) {
  //   const pathDepth = filename.split('/').filter(s => s.length).length;
  //   // todo rerwite as task
  //   while (pathDepth > this.directories.length) {
  //     let pathToFetch = this.directories.length ? this.directories.lastObject.path : '';
  //     console.log('dir', pathToFetch);
  //     let directory = await this.fetchDirectory(pathToFetch);
  //     this.directories.pushObject(directory);
  //   }
    
  // },

  actions: {
    onSelect(directory, choice) {
      let newPath = `${directory.path}${choice}`;
      let type = directory.type;
      if (type === 'dir') {
        newPath = `${newPath}/`;
        set(this, 'currentPath', newPath);
        this.updateDirectories(newPath);
      } else if (type === 'audio') {
        this.track.set('filename', newPath);
        this.saveTrack.perform(this.track);
      }
    },
  },

  _getParentPath(path) {
    // split path into array, filter empty str from trailing slash
    path = path.split('/').filter(lvl => lvl != '');
    // pop last item to move up a level
    path.pop();
    // re-add trailing slash
    path = path.join('/');
    return path.length ? `${path}/` : '';
  }
});
