'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './submission.events';
import Screen from '../screen/screen.model';

var SubmissionSchema = new mongoose.Schema({
  name: String,
  active: {
    type: Boolean,
    default: true
  },
  flagged: {
    type: Boolean,
    default: false
  },
  file: {
    type: mongoose.Schema.Types.Mixed
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen'
  }
}, {
  timestamps: true
});

SubmissionSchema.pre('save', function(next) {
  let self = this;

  Screen.findOne({ active: true, submissions: [] })
    .then(function(screen) {
      if(screen) {
        self.screen = screen._id;
        Screen.update({ _id: screen._id }, { $push: { submissions: self._id } }).then(next);
        return null;
      } else {
        Screen.count().exec(function (err, count) {
          if(err) console.log(err);
          var random = Math.floor(Math.random() * count);

          Screen.findOne().skip(random)
            .then(function(randomScreen) {
              self.screen = randomScreen._id;
              Screen.update({ _id: randomScreen._id }, { $push: { submissions: self._id } }).then(next);
            })
            .catch(function(err) {
              console.log(err);
            });
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
});

registerEvents(SubmissionSchema);
export default mongoose.model('Submission', SubmissionSchema);
