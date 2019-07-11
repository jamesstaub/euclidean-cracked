import Component from '@ember/component';
import { set  } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from '../config/environment';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  init() {
    this._super(...arguments);
    set(this, 'directories', []);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    let path = '';
    if (this.track && this.track.filepath) {
      this.initDirectoryFromTrack.perform(this.track.filepath);
    } else {
      this.updateDirectories.perform(path);
    }
  },

  fetchDirectory: task(function*(path) {
    const url = `${ENV.DRUMSERVER_HOST}${path}`;
    const response = yield fetch(url);
    const json = yield response.json();
    return json;
  }).evented(),

  parseResponse(content) {
    const { dirs, audio } = content;
    // prefer type as audio if contains both
    content.type = audio.length ? 'audio' : 'dir';
    content.choices = audio.length ? audio : dirs;

    // choices will be either audio or dirs
    //  no need to retain these
    delete content.audio;
    delete content.dirs;

    return content;
  },

  initDirectoryFromTrack: task(function *(filepath) {
    let path = filepath.split('/');
    path.pop();
    let response = yield this.fetchDirectory.perform(path.join('/'));
    if (response.ancestor_tree) {
      let directories = response.ancestor_tree.map(dir => {
        return this.parseResponse(dir);
      });
      set(this, 'directories', directories);
    }
  }),

  updateDirectories: task(function*(pathToFetch) {
    let response = yield this.fetchDirectory.perform(pathToFetch);
    let directory = this.parseResponse(response);
    // clear any child directories when clicking back higher up the tree
    const pathDepth = directory.path.split('/').filter(s => s.length).length;
    while (this.directories.length > pathDepth) {
      this.directories.pop();
    }
    this.directories.pushObject(directory);
  }).keepLatest(),

  actions: {
    onSelect(directory, choice) {
      set(directory, 'currentSelection', choice);
      let newPath = `${directory.path}${choice}`;
      let type = directory.type;
      if (type === 'dir') {
        newPath = `${newPath}/`;
        this.updateDirectories.perform(newPath);
      } else if (type === 'audio') {
        this.track.set('filepath', newPath);
        this.saveTrackTask.perform(this.track);
      }
    }
  }
});
