'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './idle.events';

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
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen'
  }
}, {
  timestamps: true
});

registerEvents(IdleSchema);
export default mongoose.model('Idle', IdleSchema);
