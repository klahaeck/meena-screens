'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './screens.routes';
import _ from 'lodash';
// import { layer } from './screens.animations';
// import {
//   init as initCanvas,
//   addImage,
//   destroy as destroyCanvas
// } from './screens.canvas';

export class ScreensController {
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal) {
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.screens = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('screens');
    });
  }

  $onInit() {
    this.$http.get('/api/screens')
      .then(response => {
        this.screens = response.data;
        this.socket.syncUpdates('screen', this.screens);
      });
  }

  openModal(action, screen) {
    var modalInstance = this.$uibModal.open({
      template: require('./modal-new-screen.html'),
      controller: ['$uibModalInstance', '$scope', 'Screen', function($uibModalInstance, $scope, Screen) {
        $scope.screen = _.clone(screen);
        console.log($scope.screen);
        delete $scope.screen.__v;
        console.log($scope.screen);
        $scope.submit = function() {
          if (action === 'add') {
            Screen.save($scope.screen, () => {
              $uibModalInstance.close();
            });
          } else {
            Screen.update({id:$scope.screen._id}, $scope.screen, () => {
              $uibModalInstance.close();
            });
          }
        };
      }],
      size: 'lg'
    });
    modalInstance.result.then(function() {}, function() {});
  }

  addScreen() {
    this.openModal('add', {
      name: '',
      active: true
    });
  }

  editScreen(screen) {
    this.openModal('edit', screen);
  }

  deleteScreen(screen) {
    if (confirm('Are you sure you want to delete this?')) {
      this.$http.delete(`/api/screens/${screen._id}`);
    }
  }
}

export class ScreensDetailController {
  /*@ngInject*/
  constructor($http, $stateParams, $scope, $timeout, socket) {
    this.$http = $http;
    this.socket = socket;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$scope = $scope;

    this.maxImages = 3;

    $scope.$on('$destroy', function() {
      socket.socket.removeAllListeners('screen:save');
    });
  }

  $onInit() {
    this.$http.get(`/api/screens/${this.$stateParams.id}`)
      .then(response => {
        this.screen = response.data;

        this.setImages();

        this.socket.socket.on('screen:save', screen => {
          if (screen._id === this.screen._id) {
            this.screen = screen;
            this.$timeout(() => {
              this.setImages();
            }, 1000);
          }
        });
      });
  }

  setImages() {
    const reversed = this.screen.submissions.slice().reverse();
    this.$scope.images = this.screen.submissions.map(function(submission) {
      const index = reversed.indexOf(submission);
      return {path:`${submission.file.path}/${submission.file.versions.lines}`, index};
    });
  }

  getIndexClass(image) {
    const reversedImages = this.$scope.images.reverse();
    const index = reversedImages.findIndex(image);
    return `layer-image-${index}`;
  }
}

export default angular.module('screensApp.screens', [uiRouter])
  .config(routes)
  .service('Screen', function ($resource) {
    return $resource('/api/screens/:id', {id:'@_id'}, {
      'update': { method:'PUT' }
    });
  })
  .component('screens', {
    template: require('./screens.html'),
    controller: ScreensController
  })
  .component('screen', {
    template: require('./screens-detail.html'),
    controller: ScreensDetailController
  })
  // .animation('.layer', layer)
  .name;
