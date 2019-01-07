import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  audioService: service(),

  intervalSliderSize: [120, 20],

  classNames: ['audio-post-sequencer'],
  dacGain: .9,

  didInsertElement() {
    this.initSignalChain();
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
    this.disconnectAll();
    // create a compressor -> DAC node for other nodes to connect to
    __()
    .compressor({
      release:.1,
      id: 'master-compressor',
      class:`post-${get(this, 'post.id')}`,
    })
    .dac(this.dacGain);
  },

  actions: {
    setLoopInterval(post, interval) {
      this.audioService.setInterval(interval);
      post.save();
    },

    loopAction(action) {
      const audio = this.audioService;
      const interval = get(this, 'post.interval');

      switch (action) {
        case 'start':
          audio.setInterval(interval);
          audio.startLoop();
          this.toggleProperty('isPlaying');
          break;
        case 'reset':
          audio.resetLoop(interval);
          break;
        case 'stop':
          audio.stopLoop();
          this.toggleProperty('isPlaying');
          break;
      }
    }
  },

});
