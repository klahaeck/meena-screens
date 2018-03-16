/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Screen from '../api/screen/screen.model';
import Submission from '../api/submission/submission.model';
import User from '../api/user/user.model';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    Screen.find({}).remove()
      .then(() => {
        let screen = Screen.create({
          name: 'red'
        }, {
          name: 'green'
        }, {
          name: 'blue'
        });
        return screen;
      })
      .then(() => console.log('finished populating screens'))
      .catch(err => console.log('error populating screens', err));
    
    Submission.find({}).remove()
      .exec();
      // .then(() => console.log('finished populating things'))
      // .catch(err => console.log('error populating things', err));

    User.find({}).remove()
      .then(() => {
        User.create({
          provider: 'local',
          role: 'admin',
          name: 'Kla',
          email: 'kla.haeck@gmail.com',
          password: 'admin'
        })
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err));
      });
  }
}
