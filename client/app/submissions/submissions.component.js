'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './submissions.routes';

export class SubmissionsController {
  /*@ngInject*/
  constructor($http, $scope, socket, $uibModal) {
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.submissions = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('submissions');
    });
  }

  $onInit() {
    this.$http.get('/api/submissions')
      .then(response => {
        console.log(response.data);
        this.submissions = response.data;
        this.socket.syncUpdates('submission', this.submissions);
      });
  }

  deleteSubmission(submission) {
    this.$http.delete(`/api/submissions/${submission._id}`);
  }

  showImage(submission, version) {
    var modalInstance = this.$uibModal.open({
      template: require('./modal-image.html'),
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
