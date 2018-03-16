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
  constructor($http, $scope, socket, $uibModal, Screen) {
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.Screen = Screen;
    this.screens = [];
    this.active = false;

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
        delete $scope.screen.__v;
        $scope.submit = function() {
          if (action === 'add') {
            Screen.save($scope.screen, () => {
              $uibModalInstance.close();
            });
          } else {
            Screen.update({id:$scope.screen._id}, $scope.screen, () => {
              $uibModalInstance.close($scope.screen);
            });
          }
        };
      }],
      size: 'lg'
    });
    modalInstance.result.then(screen => {
      // console.log(screen);
      this.updateScreen(screen);
    }, function() {});
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

  updateScreen(screen) {
    const screenIndex = this.screens.findIndex(screen => screen._id == screen._id);
    this.screens[screenIndex] = screen;
  }

  toggleActive(screen) {
    delete screen.__v;
    screen.active = !screen.active;
    this.Screen.update({id:screen._id}, screen, response => {
      screen = response;
      // this.updateScreen(response);
    });
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
          this.socketHandler(screen);
        });
        this.socket.socket.on('screen:remove', screen => {
          this.socketHandler(screen);
        });
      });
  }

  socketHandler(screen) {
    if (screen._id === this.screen._id) {
      this.screen = screen;
      this.$timeout(() => {
        this.setImages();
        this.$scope.$broadcast('NEW_IMAGE');
      }, 500);
    }
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
  .directive('colorOverlay', function($animate) {
    return {
      restrict: 'C',
      scope: {},
      link: function(scope, element, attrs) {
        scope.$on('NEW_IMAGE', function() {
          $animate.addClass(element, 'flash').then(function () {
            $animate.removeClass(element, 'flash');
          });
        });
      }
    };
  })
  // .animation('.layer', layer)
  .name;
