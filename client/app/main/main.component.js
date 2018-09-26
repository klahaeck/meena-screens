import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  /*@ngInject*/
  constructor($http, $timeout, Upload, Util) {
    this.$http = $http;
    this.$timeout = $timeout;
    this.Upload = Upload;
    this.submitted = false;
    this.progressPercentage = 0;
    // this.socket = socket;

    this.assetPrefix = Util.getAssetPrefix();

    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('submissions');
    // });
    // this.upload = this.upload.bind(this);
  }

  upload(file) {
    if (file) {
      this.submitted = true;
      this.Upload.upload({
        url: '/api/submissions',
        data: { file }
      })
      .then(resp => {
        this.$timeout(() => {
          this.backgroundImage = `${resp.data.file.path}/${resp.data.file.versions.lines}`;
        }, 2000);
        // this.msg = {
        //   class: 'success',
        //   text: 'Your photo has been uploaded!'
        // };
        this.submitted = false;
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
}

export default angular.module('screensApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
