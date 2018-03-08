'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('idles', {
      url: '/idles',
      template: '<idles></idles>',
      authenticate: 'admin'
    });
}
