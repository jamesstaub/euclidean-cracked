import Route from '@ember/routing/route';
import cleanURI from '../../utils/clean';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel() {
    const randomSlug =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    
    this.createProject(randomSlug, true, true);
  },

  async createProject(title, publicEditable, publicVisible) {
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
    user = this.session.get('currentUserModel');

    await user.get('projects').addObject(project);
    project = await project.save();
    await user.save();
    return this.transitionTo('user.creator.project', user, get(project, 'slug'));
  }

});
