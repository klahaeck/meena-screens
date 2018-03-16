'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('submissions', {
      url: '/images',
      template: '<submissions></submissions>',
      authenticate: 'admin'
    });
}
