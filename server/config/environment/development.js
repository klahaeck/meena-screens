'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  
  mongo: {
    uri: 'mongodb://localhost/screens-dev'
    // uri: 'mongodb://meena_screens:icg9Dt2wn@ds257848.mlab.com:57848/meena_screens'
  },

  // Seed database on startup
  seedDB: true

};
