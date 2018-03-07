'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, localStorageServiceProvider) {
  'ngInject';

  localStorageServiceProvider.setPrefix('screens');

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);
}
