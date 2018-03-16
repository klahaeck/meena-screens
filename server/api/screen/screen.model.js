'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './screen.events';
import Submission from '../submission/submission.model';

var ScreenSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: {
    type: Boolean,
    default: true
  },
  flashColor: {
    type: String,
    default: '#FFFFFF'
  },
  submissions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Submission'
  }]
}, {
  timestamps: true,
  usePushEach: true
});

ScreenSchema.pre('remove', function(next) {
  let self = this;
  Submission.update({ screen: self._id }, { screen: null }, { multi: true }).then(() => {
    next();
    return null;
  });
});

registerEvents(ScreenSchema);
export default mongoose.model('Screen', ScreenSchema);
