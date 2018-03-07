'use strict';

describe('Component: ScreensComponent', function() {
  // load the controller's module
  beforeEach(module('screensApp.screens'));

  var ScreensComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ScreensComponent = $componentController('screens', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
