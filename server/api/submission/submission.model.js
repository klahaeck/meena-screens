'use strict';

import mongoose from 'mongoose';
import config from '../../config/environment';
import {registerEvents} from './submission.events';
import Screen from '../screen/screen.model';
import fs from 'fs-extra';
import { client, bucketName } from '../../components/cloudstorage';

const MAX_SUBMISSIONS = 4;

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
  timestamps: true,
  usePushEach: true
});

function saveScreen(screen, submissionId) {
  if(screen.submissions.length >= MAX_SUBMISSIONS) {
    screen.submissions.shift();
  }
  screen.submissions.push(submissionId);
  return screen.save();
}

SubmissionSchema.pre('save', function(next) {
  let self = this;

  Screen.findOne({ active: true, submissions: [] })
    .then(function(screen) {
      if(screen) {
        self.screen = screen._id;
        next();
      } else {
        Screen.count().exec(function (err, count) {
          if(err) console.warn(err);
          var random = Math.floor(Math.random() * count);

          Screen.findOne().skip(random)
            .then(function(randomScreen) {
              self.screen = randomScreen._id;
              next();
            })
            .catch(function(err) {
              console.warn(err);
            });
        });
      }
    })
    .catch(function(err) {
      console.warn(err);
    });
});

SubmissionSchema.post('save', function(doc) {
  Screen.findOne(doc.screen)
    .then(function(screen) {
      if(screen) {
        saveScreen(screen, doc._id);
        // Screen.update({ _id: screen._id }, { $push: { submissions: self._id } }).then(next);
      }
    })
    .catch(function(err) {
      console.warn(err);
    });
});

SubmissionSchema.pre('remove', function(next) {
  // fires the screen socket event for screens
  Screen.find({ submissions: this._id}).then(screens => {
    screens.forEach(screen => {
      const index = screen.submissions.indexOf(this._id);
      if (index !== -1) {
        screen.submissions.splice(index, 1);
      }
      screen.save();
    });
  });

  // Screen.update(
  //   { submissions : this._id}, 
  //   { $pull: { submissions: this._id } },
  //   { multi: true })  //if reference exists in multiple documents 
  // .exec();
  
  next();
});

SubmissionSchema.post('remove', function(doc) {
  if(config.env === 'production') {
    client.removeFile(bucketName, `${doc.file.path}/${doc.file.name}`, function(err) {
      if(err) console.warn(err);
    });
    for (var key in doc.file.versions) {
      if (doc.file.versions.hasOwnProperty(key)) {
        const value = doc.file.versions[key];
        client.removeFile(bucketName, `${doc.file.path}/${value}`, function(err) {
          if(err) console.warn(err);
        });
      }
    }
  } else {
    fs.remove(`${config.root}/client/${doc.file.path}`);
  }
});

registerEvents(SubmissionSchema);
export default mongoose.model('Submission', SubmissionSchema);
