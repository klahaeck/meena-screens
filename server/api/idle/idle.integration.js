'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newIdle;

describe('Idle API:', function() {
  describe('GET /api/idles', function() {
    var idles;

    beforeEach(function(done) {
      request(app)
        .get('/api/idles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          idles = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(idles).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/idles', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/idles')
        .send({
          name: 'New Idle',
          info: 'This is the brand new idle!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newIdle = res.body;
          done();
        });
    });

    it('should respond with the newly created idle', function() {
      expect(newIdle.name).to.equal('New Idle');
      expect(newIdle.info).to.equal('This is the brand new idle!!!');
    });
  });

  describe('GET /api/idles/:id', function() {
    var idle;

    beforeEach(function(done) {
      request(app)
        .get(`/api/idles/${newIdle._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          idle = res.body;
          done();
        });
    });

    afterEach(function() {
      idle = {};
    });

    it('should respond with the requested idle', function() {
      expect(idle.name).to.equal('New Idle');
      expect(idle.info).to.equal('This is the brand new idle!!!');
    });
  });

  describe('PUT /api/idles/:id', function() {
    var updatedIdle;

    beforeEach(function(done) {
      request(app)
        .put(`/api/idles/${newIdle._id}`)
        .send({
          name: 'Updated Idle',
          info: 'This is the updated idle!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedIdle = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedIdle = {};
    });

    it('should respond with the updated idle', function() {
      expect(updatedIdle.name).to.equal('Updated Idle');
      expect(updatedIdle.info).to.equal('This is the updated idle!!!');
    });

    it('should respond with the updated idle on a subsequent GET', function(done) {
      request(app)
        .get(`/api/idles/${newIdle._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let idle = res.body;

          expect(idle.name).to.equal('Updated Idle');
          expect(idle.info).to.equal('This is the updated idle!!!');

          done();
        });
    });
  });

  describe('PATCH /api/idles/:id', function() {
    var patchedIdle;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/idles/${newIdle._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Idle' },
          { op: 'replace', path: '/info', value: 'This is the patched idle!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedIdle = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedIdle = {};
    });

    it('should respond with the patched idle', function() {
      expect(patchedIdle.name).to.equal('Patched Idle');
      expect(patchedIdle.info).to.equal('This is the patched idle!!!');
    });
  });

  describe('DELETE /api/idles/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/idles/${newIdle._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when idle does not exist', function(done) {
      request(app)
        .delete(`/api/idles/${newIdle._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
