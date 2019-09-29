import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import cleanURI from 'euclidean-cracked/utils/clean';
import { debug } from "@ember/debug";
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';

export default Controller.extend({
  session: service(),
  store: service(),

  saveTrackTask: task(function* (track) {
    try {
      yield track.save();
    } catch (e) {
      debug(`error saving track (project task):  ${e}`);
      track.rollbackAttributes();
    }
  }),

  activeTrack: computed('model.tracks.[]', {
    get() {
      return this.model.get('tracks').firstObject;
    }
  }),

  // create param multisliders 
  async createDefaultTrackControls(track) {
    const gainCtrl = this.store.createRecord('track-control', {
      interfaceName: 'ui-multislider',
      nodeSelector: track.get('gainOnStepSelector'),
      nodeAttr: 'gain',
      nodeName: 'gain',
      min: 0,
      max: 1
    });

    track.trackControls.pushObject(gainCtrl);
    await gainCtrl.save();
  },

  actions: {
    save(project) {
      let slug = cleanURI(project.get('title'));

      project.set('slug', slug);
      project.save().then(project => {
        this.transitionToRoute('user.creator.project', project.slug);
      });
    },

    // when a user clicks a track in the list,
    //  set footer controls to that track
    selectActiveTrack(track) {
      // instance of track model
      this.set('activeTrack', track);
    },

    async deleteTrack(track) {
      // TODO: delete onstepFunction with cloud Function
      // since readOnly validation prevents deletion
      // onstepFunction.destroyRecord();
      const projectTracks = await this.model.get('tracks');
      projectTracks.removeObject(track);
      await this.model.save();
      track.destroyRecord();
    },

    // TODO implement cloud function to delete tracks on project delete
    async delete(project) {
      await project.destroyRecord();
      this.transitionToRoute('user');
    },

    async createTrack(project) {
      let onstepFunction = this.store.createRecord('customFunction', {
        projectCreatorUid: project.get('creator.uid'),
      });
      let initFunction = this.store.createRecord('customFunction', {
        projectCreatorUid: project.get('creator.uid'),
      });

      await onstepFunction.save();

      // TODO: instead of setting defaults here, just use
      // defaults on the model
      // or better yet, uses a post-create cloud function to setup default tracks, track custom controls
      let track = this.store.createRecord('track', {
        projectCreatorUid: project.get('creator.uid'),
        publicEditable: project.publicEditable,
        onstepFunction: onstepFunction,
        initFunction: initFunction
      });

    //  shouldnt need to do this but prevents firebase errors
      track.set('onstepFunction', onstepFunction);
      track.set('initFunction', onstepFunction);

      project.get('tracks').addObject(track);

      this.createDefaultTrackControls(track);
      return track
        .save()
        .then(() => {
          debug('track saved succesfully');
          return project.save();
        })
        .catch(error => {
          debug(`track:  ${error}`);
          track.rollbackAttributes();
        })
        .then(() => {
          debug('project saved successfuly');
        });
    },
  }
});
