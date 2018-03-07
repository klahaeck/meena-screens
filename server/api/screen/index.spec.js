'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var screenCtrlStub = {
  index: 'screenCtrl.index',
  show: 'screenCtrl.show',
  create: 'screenCtrl.create',
  upsert: 'screenCtrl.upsert',
  patch: 'screenCtrl.patch',
  destroy: 'screenCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var screenIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './screen.controller': screenCtrlStub
});

describe('Screen API Router:', function() {
  it('should return an express router instance', function() {
    expect(screenIndex).to.equal(routerStub);
  });

  describe('GET /api/screens', function() {
    it('should route to screen.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'screenCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/screens/:id', function() {
    it('should route to screen.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'screenCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/screens', function() {
    it('should route to screen.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'screenCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/screens/:id', function() {
    it('should route to screen.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'screenCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/screens/:id', function() {
    it('should route to screen.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'screenCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/screens/:id', function() {
    it('should route to screen.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'screenCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
