'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  constructor($state, Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isCollapsed = true;
    // this.menu = [
    //   { title: 'Images', state: 'submissions' },
    //   { title: 'Screens', state: 'screens' }
    // ];
    this.$state = $state;
  }

  showNavbar() {
    if(this.isLoggedIn() && this.$state.current.name !== 'screens-detail') {
      return true;
    } else {
      return this.$state.current.name !== 'screens-detail' && this.$state.current.name !== 'main';
    }
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
