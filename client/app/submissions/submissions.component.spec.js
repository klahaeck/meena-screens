'use strict';

describe('Component: SubmissionsComponent', function() {
  // load the controller's module
  beforeEach(module('screensApp.submissions'));

  var SubmissionsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    SubmissionsComponent = $componentController('submissions', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
