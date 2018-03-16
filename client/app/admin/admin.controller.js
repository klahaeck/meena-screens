'use strict';

export default class AdminController {
  /*@ngInject*/
  constructor($window, User, $http, socket, $uibModal) {
    this.$window = $window;
    this.$http = $http;
    this.socket = socket;
    this.$uibModal = $uibModal;
    this.users = [];
    User.query(users => {
      this.users = users;
      this.socket.syncUpdates('user', this.users);
    });
  }

  addUser() {
    console.log('rtest');
    this.openModal('add', {
      name: '',
      email: '',
      role: 'user'
    });
  }

  openModal(action, user) {
    var modalInstance = this.$uibModal.open({
      template: require('./modal-user.html'),
      controller: ['$uibModalInstance', '$scope', 'User', function($uibModalInstance, $scope, User) {
        $scope.user = _.clone(user);
        delete $scope.user.__v;
        $scope.submit = function() {
          if (action === 'add') {
            User.save($scope.user, newuser => {
              $uibModalInstance.close(newuser);
            });
          } else {
            User.update({id:$scope.user._id}, $scope.user, () => {
              $uibModalInstance.close($scope.user);
            });
          }
        };
      }],
      size: 'lg'
    });
    modalInstance.result.then(_user => {
      // console.log(screen);
      // this.updateScreen(screen);
      console.log(_user);
    }, function() {});
  }

  delete(user) {
    if(this.$window.confirm('Are you sure?')) {
      this.$http.delete(`/api/users/${user._id}`).then(response => {
        console.log(response);
        this.users.splice(this.users.indexOf(user), 1);
      }); 
    }   
  }
}
