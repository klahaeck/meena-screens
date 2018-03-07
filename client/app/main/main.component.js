import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/
  constructor($http, $scope, Upload) {
    this.$http = $http;
    this.Upload = Upload;
    this.submitted = false;
    this.progressPercentage = 0;
    // this.socket = socket;

    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('submissions');
    // });
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
      // console.log(`Success ${resp.config.data.file.name} uploaded. Response: ${resp.data}`);
    }, resp => {
      console.log(`Error status: ${resp.status}`);
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
}

export default angular.module('screensApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
