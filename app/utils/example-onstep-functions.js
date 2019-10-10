const tutorial = [
  {
    name: 'sequencer variables',
    code: `
/*
  This script gets called as a callback function on 
  every beat of the current track. 

  The following step sequencer variables are available to your script
    data  :  the value (0 or 1) of the current step
    index :  the position of the current step
    array :  the contents of the step sequencer as an array

    1 press play, 
    2 open your debug console 
    3 click Euclidean rhythm and notice how these values update
      on every step of the sequener
*/

console.log('data', data);
console.log('index', index);
console.log('array', array);
`
  },
  {
    name: 'audio node signal chain',
    code: `
/*

Each track consists of a chain of audio nodes
[sampler]->[lowpass]->[gain]

The following selectors can be used to select and modify
the audio nodes.

See the cracked overview to understand selecting and modifying nodes
https://github.com/billorcutt/i_dropped_my_phone_the_screen_cracked/blob/master/OVERVIEW.md#selecting

Audio node selectors
  this.sampler : the node ID for this sampler
  this.lowpass : the node ID for the track's lowpass filter
  this.gain : the node ID for the gain node this sampler is connected to

  nodes can be selected with a jquery-like syntax:
  __(this.sampler).attr({someAttribute: someValue});

  see the cracked documentation for more info on these audio nodes
  http://billorcutt.github.io/i_dropped_my_phone_the_screen_cracked/
*/


// play the sample at half speed
__(this.sampler).attr({speed: .5});

// modify the lowpass filter frequency and Q
// on every step
var f = (index * 100) + 100;
var q = (index * 10) % 30;
__(this.lowpass).attr({frequency: f, q: q});

`
  }
];

const filters = [
  {
    name: 'filter sweep',
    code: `
/*
  Use the cracked library's __.scale() to convert the current step index
  into a frequency value for the lowpass filter
*/
// only run if there is a beat on this step of the sequencer
if (data) {
  var inMin = 0;
  var inMax = array.length;
  var outMin = 200;
  var outMax = 2000;
  var type = 'logarithmic';

  var f = __.scale(index, inMin, inMax, outMin, outMax, type);
  __(this.lowpass).attr({ frequency: f, q: 30 });
}
`
  },
];

const sampler = [
  {
    name: 'pitch: chromatic scale',
    code: `
/*
  This script will multiply the sample playback speed by intervalic ratios to tune a sample
  to the notes of a chromatic scale. Try a cowbell or other pitched drum for best effect.

  In the euclidean rhythm menu, set both the hits and steps
  to 12.
*/

var semitoneRatios = [1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 3/2, 8/5, 5/3, 16/9, 15/8, 2/1];
var speed = semitoneRatios[index];
__(this.sampler).attr({speed: speed});

/*

  The variable "index" is the current step in the sequence.
  
  1:1   unison
  16:15 minor seconrd
  9:8   major second
  6:5   minor third
  5:4   major third
  4:3   fourth
  3:2   fifth
  8:5   minor sixth
  5:3   major sixth
  5:3   minor seventh
  16:9  major seventh
  15:8  octave
*/
`
  },
  {
    name: 'reverse',
    code: `
var isReverse = index % 2; // isReverse is true on every other step. 
__(this.sampler).attr({reverse: isReverse});
`
  },

];

export default [
  {
    sectionName: 'tutorial',
    examples: tutorial
  },

  {
    sectionName: 'sampler',
    examples: sampler
  },
  {
    sectionName: 'filters',
    examples: filters
  }
];
