// the index variable represents the current step being played
// the array variable is the entire sequence of true or false values
// here we multiply that value by 200 so frequency is ramps up over the span of the sequence

if (data) {
  var inMin = 0;
  var inMax = array.length;
  var outMin = 200;
  var outMax = 2000;
  var type = 'logarithmic';

  // the cracked library's __.scale method will scale the index (0-16)
  // to the audible frequency range for the lowpass filter
  var f = __.scale(index, inMin, inMax, outMin, outMax, type);
  __(this.lowpass).attr({ frequency: f, q: 30 });
}

/**

**/
if (data) {
  if (index < 4) {
    // for steps 0 - 3 of the sequence
    // randomly change the speed of playback
    // 1 is normal speed, 2 is double speed, .5 is half speed etc
    var rand = __.random(1, 20) / 10;
    __(this.sampler).attr({ speed: rand });
  }
}

/**

***/

// randomly change lowpass filter cutoff frequency on every step

if (data) {
  var f = __.random(1000, 4000);
  __(this.lowpass).attr({ frequency: f, q: 30 });
}
