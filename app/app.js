import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

Array.prototype.rotate = (function () {
  // save references to array functions to make lookup faster
  var push = Array.prototype.push,
    splice = Array.prototype.splice;

  return function (count) {
    var len = this.length >>> 0; // convert to uint
    count = count >> 0; // convert to int

    // convert count to value in range [0, len)
    count = ((count % len) + len) % len;

    // use splice.call() instead of this.splice() to make function generic
    push.apply(this, splice.call(this, 0, count));
    return this;
  };
})();


loadInitializers(App, config.modulePrefix);

export default App;
