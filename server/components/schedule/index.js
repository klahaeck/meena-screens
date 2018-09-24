import schedule from 'node-schedule';
// import { socket } from './socket';
import Submission, { saveScreen } from '../../api/submission/submission.model';
import Screen from '../../api/screen/screen.model';

const sechduleInterval = 8; //seconds
const idleTime = 30; //seconds
let timeouts = [];
const maxTimeouts = 8;

function removeTimeout(timeout) {
  const index = timeouts.indexOf(timeout);
  timeouts.splice(index, 1);
}

export function start(cb) {
  schedule.scheduleJob(`*/${sechduleInterval} * * * * *`, function() {
    const dateNow = new Date();
    const dateSecondsAgo = new Date(dateNow.getTime() - idleTime*1000);

    Submission.findOne({ idle:false, createdAt: {$gt: dateSecondsAgo} }).exec()
      .then(function(submission) {
        // console.log(submission);
        if(!submission) {
          if(timeouts.length < maxTimeouts) {
            const timeoutTime = Math.floor(Math.random() * (29000 - 10000) + 10000);
            const newTimeout = setTimeout(function() {
              removeTimeout(this);
              // console.log(`show idle image with timeout: ${timeoutTime}`);
              // console.log('show idle image');

              // GET RANDOM IDLE IMAGE
              Submission.count({ active:true, idle:true }).exec(function (err, count) {
                if(err) console.warn(err);
                var random = Math.floor(Math.random() * count);
      
                Submission.findOne({ active:true, idle:true }).skip(random)
                  .then(function(randomIdleImage) {
                    if(randomIdleImage) {
                      // GET RANDOM SCREEN
                      return Screen.count({active:true}).exec(function (err, count) {
                        if(err) console.warn(err);
                        var random = Math.floor(Math.random() * count);
              
                        return Screen.findOne({active:true}).skip(random)
                          .then(function(randomScreen) {
                            saveScreen(randomScreen, randomIdleImage._id);
                            return null;
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
            }, timeoutTime);
            timeouts.push(newTimeout);
          }
        } else {
          for (var timeout of timeouts) {
            clearTimeout(timeout);
          }
          timeouts = [];
          // console.log(`recent submission at: ${submission.createdAt}`);
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