import schedule from 'node-schedule';
import Submission from '../../api/submission/submission.model';

const sechduleInterval = 5; //seconds
const idleTime = 30; //seconds
let timeouts = [];
const maxTimeouts = 5;

function removeTimeout(timeout) {
  const index = timeouts.indexOf(timeout);
  timeouts.splice(index, 1);
}

export function start(cb) {
  schedule.scheduleJob(`*/${sechduleInterval} * * * * *`, function() {
    // console.log('schedule running');
    const dateNow = new Date();
    const dateSecondsAgo = new Date(dateNow.getTime() - idleTime*1000);

    Submission.findOne({createdAt: {$gt: dateSecondsAgo}}).exec()
      .then(function(submission) {
        // console.log(submission);
        if(!submission) {
          if(timeouts.length < maxTimeouts) {
            const timeoutTime = Math.floor(Math.random() * (25000 - 5000) + 5000);
            const newTimeout = setTimeout(function() {
              removeTimeout(this);
              // console.log(`show idle image with timeout: ${timeoutTime}`);
              console.log('show idle image');
            }, timeoutTime);
            timeouts.push(newTimeout);
          }
        } else {
          for (var timeout of timeouts) {
            clearTimeout(timeout);
          }
          timeouts = [];
          console.log(`recent submission at: ${submission.createdAt}`);
        }
        // console.log('timeouts:', timeouts.length);
      })
      .catch(function(err) {
        console.warn(err);
      });
  });

  if(typeof cb === 'function') {
    return cb(null);
  }
}