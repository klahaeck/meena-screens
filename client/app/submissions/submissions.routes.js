'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('submissions', {
      url: '/submissions',
      template: '<submissions></submissions>',
      authenticate: 'admin'
    });
}
