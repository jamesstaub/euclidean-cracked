import Ember from 'ember';
import { throttle } from "@ember/runloop";

const { service } = Ember.inject;

const {
  get,
} = Ember;

export default Ember.Component.extend({
  audioService: service(),

  intervalSliderSize: [120, 20],

  classNames: ['audio-post-sequencer'],
  dacGain: .9,

  didInsertElement() {
    this.initSignalChain();

    __().play();

  },

  willDestroyElement() {
    __.loop("stop");
    this.disconnectAll();
  },

  disconnectAll() {
    // remove all existing cracked audio nodes
    __("*").unbind("step");
    __("*").remove();
  },

  initSignalChain() {
    this.disconnectAll()
    // create a compressor -> DAC node for other nodes to connect to
    __()
    .compressor({
      release:.1,
      id: 'master-compressor',
      class:`post-${get(this, 'post.id')}`,
    })
    .dac(get(this, 'dacGain'));
  },

  actions: {

    setLoopInterval(post, interval) {
      __.loop(interval);
      __.loop('start');
      throttle(post, 'save', 300);
    },

    loopAction(action) {
      let audio = get(this, 'audioService');
      let interval = get(this, 'post.interval');

      switch (action) {
        case 'start':
          this.toggleProperty('isPlaying');
          audio.startLoop(interval);
          break;
        case 'reset':
          audio.resetLoop(interval);
          break
        case 'stop':
          this.toggleProperty('isPlaying');
          __.loop(action);
          break
      }

    }
  },

});
