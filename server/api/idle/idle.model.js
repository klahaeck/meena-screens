'use strict';

import mongoose from 'mongoose';
import config from '../../config/environment';
import {registerEvents} from './idle.events';
import fs from 'fs-extra';
import { client, bucketName } from '../../components/cloudstorage';

var IdleSchema = new mongoose.Schema({
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
  }
  // screen: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Screen'
  // }
}, {
  timestamps: true
});

// IdleSchema.pre('remove', function(next) {
//   Screen.update(
//     { idles : this._id}, 
//     { $pull: { idles: this._id } },
//     { multi: true })  //if reference exists in multiple documents 
//   .exec();
//   next();
// });

IdleSchema.post('remove', function(doc) {
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

registerEvents(IdleSchema);
export default mongoose.model('Idle', IdleSchema);
