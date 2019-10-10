import Component from '@ember/component';
import { get } from '@ember/object';
import { computed } from '@ember/object';

export default Component.extend({
  intervalSliderSize: [120, 20],

  classNames: ['audio-project-sequencer'],
  dacGain: .9,

  bpm: computed({
    get() {
      return (60000 / this.project.interval);
    },
    set(key, val) {
      const interval = 60000 / val;
      this.project.set('interval', interval);
      __.loop(interval);
      this.project.save();
      
      return val;
    }
  }),
  
  didInsertElement() {
    this.initSignalChain();
    document.body.addEventListener('keyup', this.onSpace.bind(this), true);
  },

  willDestroyElement() {
    document.body.removeEventListener('keyup', this.onSpace.bind(this), true);
    __.loop("stop");
    this.disconnectAll();
  },

  // TODO prevent scrolling
  // and properly removeEventListener
  onSpace(e) {
    if (e.keyCode == "Space") {
      const action = this.isPlaying ? 'stop' : 'start';
      this.send(action);
      e.preventDefault(); // dont go scrollin
      return false;
    }
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
        release: .1,
        id: 'master-compressor',
        class: `project-${get(this, 'project.id')}`,
      })
      .dac(this.dacGain);
  },

  actions: {
    async start() {
      this.initSignalChain();
      await this.project.initializeTrackSamplers();
      __.play();
      __.loop('start');
      
      // + 1 hack to fix unknown playback problem
      __.loop(this.project.interval + 1);
      this.project.set('isPlaying', true);
    },

    stop() {
      this.project.eachTrackAsync((track)=>{
        // disable the looping of individual samples
        __(track.samplerSelector).attr({ loop: false });
      });

      // disable the "loop" aka global sequencer
      this.project.set('isPlaying', false);
      __.loop('stop');
    },

    reset() {
      __.loop('reset');
      this.project.set('isPlaying', false);
      this.project.initializeTrackSamplers();
    },
  },

});
