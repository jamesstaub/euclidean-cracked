import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('new');
  this.route('projects', { path: '/:slug' });
  this.route('user', { path: '/:uid' },  function() {
    this.route('project', { path: '/:slug' });
  });
});

export default Router;