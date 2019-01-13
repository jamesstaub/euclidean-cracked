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
    // document.body.addEventListener('keyup', this.onSpace.bind(this), true);
  },

  willDestroyElement() {
    // document.body.removeEventListener('keyup', this.onSpace.bind(this), true);
    __.loop("stop");
    this.disconnectAll();
  },

  // TODO prevent scrolling
  // and properly removeEventListener
  // onSpace(e) {
  //   if (e.keyCode == 32) {
  //     const action = this.isPlaying ? 'stop' : 'start';
  //     this.send('loopAction', action);
  //     e.preventDefault(); // dont go scrollin
  //     return false;
  //   }
  // },

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
        release: .1,
        id: 'master-compressor',
        class: `post-${get(this, 'post.id')}`,
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
          audio.startLoop();
          // terrible hack
          audio.setInterval(interval + 1);
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
