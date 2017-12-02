# euclidean-cracked
This project is in development.

After building a  [prototype](https://cracked-doodles.firebaseapp.com/doodles/sequencer) euclidean rhythm sequencer, the aim of this rebuild is to deal with application concerns such as authentication, and data modeling as a foundation, then to reimplement the web audio components.

## to do list
### user concurrency features
* show current users on a given beat post
* sidebar chat window
* flash of color on a given track when another user has made a change.
* option to quantize all changes until beginning of next loop (to reduce disruption of the beat)

### audio processing features
* implement a code editor for writing custom cracked audio scripts.
  - on each track, the editor's scope will be a function that is called on each step of the sequencer, and will have access to the sequence array.

  - a global level script editor will allow for other scripting outside of the sequencer events


-  create a listview of all sequences created by users with an interface to create a super-sequence, sequencing multiple sequences together at different durations


### data authorization (to do)
users create sequence posts and can edit meta data like the name, description and audio parameters

if the user authenticates anonymously, their posts could be subject to any other user editing them \

users authenticated with email can control editing access, and invite other users to edit


## Cracked, Nexus and ember
This app uses the web audio library [cracked](https://github.com/billorcutt/i_dropped_my_phone_the_screen_cracked) for audio along with NexusUI for interface objects.

A few notes on conventions I've established for using these in ember components.

### Cracked
- TODO: initialization of Cracked audio nodes could be handled in a service (global singleton in ember).

When cracked objects are initialized in ember components, they are liable to create memory leaks, as ember components rerender whenever properties change.



### NexusUI
All components prefixed with `ui-` are nexus objects.

The `.hbs` template must contain an element such as `<span id="{{nexusId}}"></span>` for the nexus object to select.

The component must also have properties `ElementName` and `ElementOptions` for configuration, which is handled in the nexus-ui-mixin. This mixin is also where initialization and destruction of the Nexus object is handled.





## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd euclidean-cracked`
* `npm install`

## Running / Development

* `ember serve`
[http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.
