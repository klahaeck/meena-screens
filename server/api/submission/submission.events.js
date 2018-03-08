/**
 * Submission model events
 */

'use strict';

import {EventEmitter} from 'events';
var SubmissionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SubmissionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Submission) {
  for(var e in events) {
    let event = events[e];
    Submission.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    SubmissionEvents.emit(`${event}:${doc._id}`, doc);
    SubmissionEvents.emit(event, doc);
  };
}

export {registerEvents};
export default SubmissionEvents;
