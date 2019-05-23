import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import cleanURI from 'euclidean-cracked/utils/clean';
import { debug } from "@ember/debug";
import { task } from 'ember-concurrency';

export default Controller.extend({
  session: service(),
  store: service(),

  saveTrackTask: task(function* (track) {
    try {
      yield track.save();
    } catch (e) {
      debug(`error saving track:  ${e}`);
      track.rollbackAttributes();
    }
  }),

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
    selectActiveTrack(track, sampler) {
      // instance of track model
      this.set('activeTrack', track);
      // instance of audio-track-sampler component for this track
      this.set('activeSampler', sampler);
    },

    async deleteTrack(track) {
      this.setDefaultActiveTrack();
      const customFunction = await track.get('customFunction');
      // TODO: delete customFunction with cloud Function
      // since readOnly validation prevents deletion
      // customFunction.destroyRecord();
      this.model.get('tracks').removeObject(track);
      track.destroyRecord();
    },

    async delete(project) {
      let tracks = await project.get('tracks');
      if (tracks.length) {
        tracks = tracks.toArray();
        for (const track of tracks) {
          await track.destroyRecord();
        }
        await project.destroyRecord();
        this.transitionToRoute('user');
      }
    },

    async createTrack(project) {
      let customFunction = this.store.createRecord('customFunction', {
        projectCreatorUid: project.get('creator.uid')
      });

      await customFunction.save();

      // TODO: instead of setting defaults here, just use
      // defaults on the model
      let track = this.store.createRecord('track', {
        projectCreatorUid: project.get('creator.uid'),
        publicEditable: project.publicEditable,
        customFunction: customFunction
      });

      track.set('customFunction', customFunction);

      project.get('tracks').addObject(track);

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
