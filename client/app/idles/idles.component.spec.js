'use strict';

describe('Component: IdlesComponent', function() {
  // load the controller's module
  beforeEach(module('screensApp.idles'));

  var IdlesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    IdlesComponent = $componentController('idles', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
