'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './submissions.routes';

export class SubmissionsController {
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
    this.submissions = [];

    this.assetPrefix = Util.getAssetPrefix();

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('submissions');
    });
  }

  $onInit() {
    this.$http.get('/api/submissions')
      .then(response => {
        this.submissions = response.data;
        this.socket.syncUpdates('submission', this.submissions);
      });
  }

  upload(file) {
    this.submitted = true;
    this.Upload.upload({
      url: '/api/submissions',
      data: { file }
    })
    .then(() => {
      this.msg = {
        class: 'success',
        text: 'Your photo has been uploaded!'
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

  deleteSubmission(submission) {
    if(this.$window.confirm('Are you sure?')) {
      this.$http.delete(`/api/submissions/${submission._id}`);
    }
  }

  showImage(submission, version) {
    var modalInstance = this.$uibModal.open({
      template: require('../../components/modal-image/modal-image.html'),
      controller: ['$scope', 'imagePath', function($scope, imagePath) {
        $scope.imagePath = imagePath;
      }],
      size: 'lg',
      resolve: {
        imagePath() {
          // console.log(`${submission.file.path}/${submission.file.versions[version]}`);
          return `${submission.file.path}/${submission.file.versions[version]}`;
        }
      }
    });

    modalInstance.result.then(function() {
    }, function() {});
  }
}

export default angular.module('screensApp.submissions', [uiRouter])
  .config(routes)
  .component('submissions', {
    template: require('./submissions.html'),
    controller: SubmissionsController
  })
  .name;
