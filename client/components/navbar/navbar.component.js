'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isCollapsed = true;
    this.menu = [
      // { title: 'Upload', state: 'main' },
      { title: 'Submissions', state: 'submissions' },
      { title: 'Screens', state: 'screens' }
    ];
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
