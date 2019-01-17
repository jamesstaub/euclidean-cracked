import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('posts', { path: '/:slug' });
  this.route('new');
});

export default Router;

/*
 * 
 * /index
 *   check if user has a recent project in  localstorage 
 *   or transition to a new project with generated name
 *      - on change project name, transition
 * 
 *  rename /post resource to project
 * 
 *  
 * 
 */