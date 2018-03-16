'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('screens', {
      url: '/screens',
      template: '<screens></screens>'
      // authenticate: 'admin'
    })
    .state('screens-detail', {
      url: '/screens/:id',
      template: '<screen></screen>'
      // resolve: {
      //   screen: function($http, $stateParams) {
      //     return $http.get(`/api/screens/${$stateParams.id}`);
      //   }
      // }
    });
}
