# EUCLIP Drum Console
![](./public/assets/icons/logo-250-min.svg)
[euclip.app](euclip.app)

## a hackable, collaborative web audio drum machine.
Use the UI or write your own web audio code. 

## Powered by Cracked web audio library.
[idroppedmyphonethescreencracked](https://idroppedmyphonethescreencracked.tumblr.com/)
Web Audio javascript library by Bill Orcutt.
- Create audio nodes (like samplers, sinewaves, filters) and chain them together in complex ways. 
- jQuery-like selector syntax `__("#drum-sampler").attr({speed: .5})`

## Euclidean Rhythms
An algorithm for equally spacing a given number of beats in a given number of spaces. Different inputs to this formula can create a vast number of interesting rhythms. 

## Live Coding
The goal of this app is to be powerfully customizable for people comfortable with javascript, while being fun and intuitive for those who are not. Code snippits are available to plug in and tinker with, without understanding how exactly they work.  

### 2 scripts per track: Setup and On-Step
Each drum track has 2 code editors:
  - **Setup** script is where you define the track's signal chain and initial parameters. 
    (eg. `__().sampler().gain().compressor().reverb().connect('#output'))`)
  - **OnStep** script gets called on every beat. Here you can write musical logic to make the loops more interesting. 
    - play every 3rd beat at a different volume
    - change the pitch of each beat to a note in a scale
    - connect to a reverb node on the first beat. 

- There are lots of purely live coding music apps like Tidal Cycles or Sonic Pi. 
- Euclip's UI attempts to update to your custom code.

## Seeking testers and contributors!
Euclip is very much work in progress and has lots of bugs, and there are lots of features that would make it better. If you're interested in giving some feedback or making a contribution please get in touch!


james.staub@gmail.com

@mmuddywires on twitter