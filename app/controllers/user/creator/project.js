import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import cleanURI from 'euclidean-cracked/utils/clean';
import { debug } from "@ember/debug";
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import exampleInitFunctions from '../../../utils/example-init-functions';

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
  
  createTrack: task(function* (project) {
    // every track must have 2 customFunction methods. 
    // ideally these would get created in a cloud function on track create, not in the client
    let onstepFunction = this.store.createRecord('customFunction', {
      projectCreatorUid: project.get('creator.uid'),
    });

    let initFunction = this.store.createRecord('customFunction', {
      projectCreatorUid: project.get('creator.uid'),
      editorContent: exampleInitFunctions[0].examples[0].code,
      functionPreCheck: exampleInitFunctions[0].examples[0].code
    });

    yield initFunction.save();
    yield onstepFunction.save();

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
    track.set('initFunction', initFunction);

    project.get('tracks').addObject(track);

    yield track.save();
    yield project.save();
    return track;
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
  }
});
