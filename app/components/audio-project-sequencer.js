import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  audioService: service(),

  intervalSliderSize: [120, 20],

  classNames: ['audio-project-sequencer'],
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
        class: `project-${get(this, 'project.id')}`,
      })
      .dac(this.dacGain);
  },

  actions: {
    start() {
      this.project.bindTrackSamplers();
      __.loop('start');
      const interval = get(this, 'project.interval');
      this.send('setLoopInterval', interval + 1);
      this.set('isPlaying', true);
    },

    stop() {
      // disable the looping of individual samples
      this.project.get('tracks').forEach(track => {
        __(track.samplerSelector).attr({ loop: false });
      });
      // disable the "loop" aka global sequencer
      __.loop('stop');
      this.set('isPlaying', false);
    },

    setLoopInterval() {
      const interval = get(this, 'project.interval');
      __.loop(interval);
      this.project.save();
    },

    reset(project, interval) {
      __.loop('stop');
      __.loop('reset');
      project.bindTrackSamplers();
      __.loop(interval);
      __.loop('start');
    },
  },

});
