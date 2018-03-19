'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './submissions.routes';

export class SubmissionsController {
  /*@ngInject*/
  constructor($window, $http, $timeout, $scope, socket, $uibModal, Submission, Upload, Util) {
    this.$window = $window;
    this.$http = $http;
    this.$timeout = $timeout;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.Submission = Submission;
    this.Upload = Upload;
    this.submitted = false;
    this.progressPercentage = 0;
    this.submissions = [];
    this.alerts = [];

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

  getSubmissions() {
    return this.submissions.filter(submission => !submission.idle);
  }

  getIdleImages() {
    return this.submissions.filter(submission => submission.idle);
  }

  upload(file, idle) {
    this.submitted = true;
    this.Upload.upload({
      url: '/api/submissions',
      data: { file, idle }
    })
    .then(() => {
      this.alerts.push({type: 'success', msg: 'Your photo has been uploaded!'});
      this.submitted = false;
    }, resp => {
      console.warn(`Error status: ${resp.status}`);
      this.alerts.push({type: 'danger', msg: resp.status});
      this.submitted = false;
    }, evt => {
      this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
    })
    .catch(resp => {
      this.alerts.push({type: 'danger', msg: resp.status});
      this.submitted = false;
    });
  }

  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  updateSubmission(submission) {
    const submissionIndex = this.submissions.findIndex(submission => submission._id == submission._id);
    this.submissions[submissionIndex] = submission;
  }

  toggleActive(submission) {
    Reflect.deleteProperty(submission, '__v');
    submission.active = !submission.active;
    this.Submission.update({id:submission._id}, submission, response => {
      submission = response;
    });
  }

  deleteSubmission(submission) {
    if(this.$window.confirm('Are you sure?')) {
      this.$http.delete(`/api/submissions/${submission._id}`);
    }
  }

  showImage(submission, version) {
    const assetPrefix = this.assetPrefix;
    var modalInstance = this.$uibModal.open({
      template: require('../../components/modal-image/modal-image.html'),
      controller: ['$scope', 'imagePath', function($scope, imagePath) {
        $scope.imagePath = imagePath;
      }],
      size: 'lg',
      resolve: {
        imagePath() {
          return `${assetPrefix}${submission.file.path}/${submission.file.versions[version]}`;
        }
      }
    });

    modalInstance.result.then(function() {
    }, function() {});
  }
}

export default angular.module('screensApp.submissions', [uiRouter])
  .config(routes)
  .service('Submission', function ($resource) {
    return $resource('/api/submissions/:id', {id:'@_id'}, {
      'update': { method:'PUT' }
    });
  })
  .component('submissions', {
    template: require('./submissions.html'),
    controller: SubmissionsController
  })
  .name;
