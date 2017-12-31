
[work in progress demo](https://euclidean-cracked.firebaseapp.com)

# euclidean-cracked
This project is in development.

After building a  [prototype](https://cracked-doodles.firebaseapp.com/doodles/sequencer) euclidean rhythm sequencer, the aim of this rebuild is to deal with application concerns such as authentication, and data modeling as a foundation, then to reimplement the web audio components.

## to do list
### user concurrency features

* sidebar chat window
* flash of color on a given track when another user has made a change.
  - centralize all track.save() calls to call a single route-action so, then trigger visual feedback any track data is saved

* option to quantize all changes until beginning of next loop (to reduce disruption of the beat)
  - currently, the loop restarts any time a parameter is changed, with many active users, this could be disruptive to the beat

### audio processing features
* implement a code editor for writing custom cracked audio scripts.

  - a global level script editor will allow for other scripting outside of the sequencer events

* add a track field `custom class` (for cracked audio nodes), so users can write macro controls
  - eg. multiple tracks with class `bass-drum` can be selected in the code editor like so:  `__('.bass-drum').connect('reverb');`


### rhythm composition
* implement "bars",  a system for extending a given track's rhythm beyond a single euclidean pattern
  - ability to set the number of loops for a given bar, before advancing to the next
  - eg. `[1, 0, 1, 0], [1, 1, 0, 0](x2), [1, 0, 1]`

* ability to duplicate a track, to make iteration easier


### data authorization (in progress)
users create sequence posts and can edit meta data like the name, description and audio parameters

if the user authenticates anonymously, their posts could be subject to any other user editing them

users authenticated with email can control editing access, and invite other users to edit

#### permission scenarios
* a user can create a post
  - user can choose to show/hide post in public list
  - if user is anonymous: the post is public, and anyone with link can edit
  - if authenticated: use can choose to allow public editing

* a user can edit modify other user's posts
  - if the post is publicVisible && publicEditable, changes made will be saved, regardless of the user.
  - if the post is not publicEditable, but someone other than the creator tries to edit it, allow the changes to be made. For this to work, will need to add a modified_but_not_saved flag, which prevents firebase from re-syncing data once a non-authorized user starts editing locally.
    - alternative solution would be do create a duplicate post with, so the new user can save their changes.

not sure why this doesn't work on the `$track` rule
`".write": "auth.uid == newData.child('postCreatorUid').val() || newData.child('publicEditable').val() == true"`

## Cracked, Nexus and ember
This app uses the web audio library [cracked](https://github.com/billorcutt/i_dropped_my_phone_the_screen_cracked) for audio along with NexusUI for interface objects.

A few notes on conventions I've established for using these in ember components.

### Cracked
- ember components prefixed with `audio-` deal with the cracked audio library.
- the audio-service handles global state of audio nodes, to allow initialization, destruction of audio nodes and bindings throughout the app.

#### track automation (aka parameter sequences)
-  stringified arrays saved on the track model, and loaded into the serviceTrackRef on initialization and track update. this allows the track to update various parameters on each step of the sequence.
  - the sequence helper mixin generalizes some functions + computed properties for getting/setting parameter sequences between the track model, interface components and the global service

### NexusUI
- ember components prefixed with `ui-` are [nexus ui](nexus-js.github.io/ui/) objects.
- all ui components inherit the nexus-ui-mixin, which generalizes some functionality for initialization and onChange events.

- the `.hbs` template must contain an element such as `<span id="{{nexusId}}"></span>` for the nexus object to select.


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
