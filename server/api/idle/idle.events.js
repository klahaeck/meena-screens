/**
 * Idle model events
 */

'use strict';

import {EventEmitter} from 'events';
var IdleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
IdleEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Idle) {
  for(var e in events) {
    let event = events[e];
    Idle.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    IdleEvents.emit(`${event}:${doc._id}`, doc);
    IdleEvents.emit(event, doc);
  };
}

export {registerEvents};
export default IdleEvents;
