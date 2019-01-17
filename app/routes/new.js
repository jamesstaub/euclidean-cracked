import Route from '@ember/routing/route';
import cleanURI from '../utils/clean';
import getOrCreateUser from '../utils/get-or-create-user';

import { get } from '@ember/object';

export default Route.extend({
  actions: {
    async save(title, publicEditable, publicVisible) {
      let user = null;
      let slug = cleanURI(title);
      let date = new Date();
      let project = this.store.createRecord('project', {
        title,
        publicEditable,
        publicVisible,
        slug,
        date
      });

      // TODO: get auth type here
      // allow custom username for anonymous or google auth
      user = await getOrCreateUser(
        get(this, 'session.currentUser'),
        this.store
      );

      await user.get('projects').addObject(project);
      project = await project.save();
      await user.save();
      return this.transitionTo('projects', get(project, 'slug'));
    }
  }
});
