/**
 * Screen model events
 */

'use strict';

import Screen from './screen.model';
import {EventEmitter} from 'events';
var ScreenEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ScreenEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Screen) {
  for(var e in events) {
    let event = events[e];
    Screen.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    doc.populate({
      path: 'submissions',
      select: 'name file'
    }, function(err, doc) {
      ScreenEvents.emit(`${event}:${doc._id}`, doc);
      ScreenEvents.emit(event, doc);
    });
  };
}

export {registerEvents};
export default ScreenEvents;
