'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './idles.routes';

export class IdlesComponent {
  /*@ngInject*/
  constructor($window, $http, $timeout, $scope, socket, $uibModal, Upload, Util) {
    this.$window = $window;
    this.$http = $http;
    this.$timeout = $timeout;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.Upload = Upload;
    this.Util = Util;
    this.submitted = false;
    this.progressPercentage = 0;
    this.idles = [];

    this.assetPrefix = Util.getAssetPrefix();

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('idles');
    });
  }

  $onInit() {
    this.$http.get('/api/idles')
      .then(response => {
        this.idles = response.data;
        this.socket.syncUpdates('idle', this.idles);
      });
  }

  upload(file) {
    this.submitted = true;
    this.Upload.upload({
      url: '/api/idles',
      data: { file }
    })
    .then(() => {
      this.msg = {
        class: 'success',
        text: 'Your idle image has been uploaded!'
      };
      this.$timeout(() => {
        this.submitted = false;
        this.msg = null;
      }, 3000);
      // console.log(`Success ${resp.config.data.file.name} uploaded. Response: ${resp.data}`);
    }, resp => {
      console.warn(`Error status: ${resp.status}`);
      this.submitted = false;
      this.msg = {
        class: 'danger',
        text: resp.status
      };
    }, evt => {
      this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
      // console.log(`progress: ${progressPercentage}% ${evt.config.data.file.name}`);
    })
    .catch(resp => {
      this.submitted = false;
      this.msg = {
        class: 'danger',
        text: resp.status
      };
    });
  }

  deleteIdle(idle) {
    if(this.$window.confirm('Are you sure?')) {
      this.$http.delete(`/api/idles/${idle._id}`);
    }
  }

  showImage(idle, version) {
    var modalInstance = this.$uibModal.open({
      template: require('../../components/modal-image/modal-image.html'),
      controller: ['$scope', 'imagePath', function($scope, imagePath) {
        $scope.imagePath = imagePath;
      }],
      size: 'lg',
      resolve: {
        imagePath() {
          // console.log(`${submission.file.path}/${submission.file.versions[version]}`);
          return `${idle.file.path}/${idle.file.versions[version]}`;
        }
      }
    });

    modalInstance.result.then(function() {
    }, function() {});
  }
}

export default angular.module('screensApp.idles', [uiRouter])
  .config(routes)
  .component('idles', {
    template: require('./idles.html'),
    controller: IdlesComponent
  })
  .name;
