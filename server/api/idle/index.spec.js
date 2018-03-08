'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var idleCtrlStub = {
  index: 'idleCtrl.index',
  show: 'idleCtrl.show',
  create: 'idleCtrl.create',
  upsert: 'idleCtrl.upsert',
  patch: 'idleCtrl.patch',
  destroy: 'idleCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var idleIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './idle.controller': idleCtrlStub
});

describe('Idle API Router:', function() {
  it('should return an express router instance', function() {
    expect(idleIndex).to.equal(routerStub);
  });

  describe('GET /api/idles', function() {
    it('should route to idle.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'idleCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/idles/:id', function() {
    it('should route to idle.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'idleCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/idles', function() {
    it('should route to idle.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'idleCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/idles/:id', function() {
    it('should route to idle.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'idleCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/idles/:id', function() {
    it('should route to idle.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'idleCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/idles/:id', function() {
    it('should route to idle.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'idleCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
