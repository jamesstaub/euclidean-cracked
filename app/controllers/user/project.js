import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import cleanURI from 'euclidean-cracked/utils/clean';
import { debug } from "@ember/debug";

export default Controller.extend({
  session: service(),
  store: service(),

  actions: {
    save(project) {
      let slug = cleanURI(project.get('title'));

      project.set('slug', slug);
      project.save().then(project => {
        this.transitionTo('user.project', project.slug);
      });
    },

    async createTrack(project) {
      let customFunction = this.store.createRecord('customFunction', {
        projectCreatorUid: project.get('creator.uid'),
      });

      await customFunction.save();

      // TODO: instead of setting defaults here, just use
      // defaults on the model
      let track = this.store.createRecord('track', {
        projectCreatorUid: project.get('creator.uid'),
        publicEditable: project.get('publicEditable'),
        customFunction: customFunction,
      });

      track.set('customFunction', customFunction);

      project.get('tracks').addObject(track);

      return track.save()
        .then(() => {
          debug('track saved succesfully');
          return project.save();
        })
        .catch((error) => {
          debug(`track:  ${error}`);
          track.rollbackAttributes();
        })
        .then(() => {
          debug('project saved successfuly');
        });
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
    }
  }
});
