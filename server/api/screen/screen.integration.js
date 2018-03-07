'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newScreen;

describe('Screen API:', function() {
  describe('GET /api/screens', function() {
    var screens;

    beforeEach(function(done) {
      request(app)
        .get('/api/screens')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          screens = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(screens).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/screens', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/screens')
        .send({
          name: 'New Screen',
          info: 'This is the brand new screen!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newScreen = res.body;
          done();
        });
    });

    it('should respond with the newly created screen', function() {
      expect(newScreen.name).to.equal('New Screen');
      expect(newScreen.info).to.equal('This is the brand new screen!!!');
    });
  });

  describe('GET /api/screens/:id', function() {
    var screen;

    beforeEach(function(done) {
      request(app)
        .get(`/api/screens/${newScreen._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          screen = res.body;
          done();
        });
    });

    afterEach(function() {
      screen = {};
    });

    it('should respond with the requested screen', function() {
      expect(screen.name).to.equal('New Screen');
      expect(screen.info).to.equal('This is the brand new screen!!!');
    });
  });

  describe('PUT /api/screens/:id', function() {
    var updatedScreen;

    beforeEach(function(done) {
      request(app)
        .put(`/api/screens/${newScreen._id}`)
        .send({
          name: 'Updated Screen',
          info: 'This is the updated screen!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedScreen = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedScreen = {};
    });

    it('should respond with the updated screen', function() {
      expect(updatedScreen.name).to.equal('Updated Screen');
      expect(updatedScreen.info).to.equal('This is the updated screen!!!');
    });

    it('should respond with the updated screen on a subsequent GET', function(done) {
      request(app)
        .get(`/api/screens/${newScreen._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let screen = res.body;

          expect(screen.name).to.equal('Updated Screen');
          expect(screen.info).to.equal('This is the updated screen!!!');

          done();
        });
    });
  });

  describe('PATCH /api/screens/:id', function() {
    var patchedScreen;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/screens/${newScreen._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Screen' },
          { op: 'replace', path: '/info', value: 'This is the patched screen!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedScreen = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedScreen = {};
    });

    it('should respond with the patched screen', function() {
      expect(patchedScreen.name).to.equal('Patched Screen');
      expect(patchedScreen.info).to.equal('This is the patched screen!!!');
    });
  });

  describe('DELETE /api/screens/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/screens/${newScreen._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when screen does not exist', function(done) {
      request(app)
        .delete(`/api/screens/${newScreen._id}`)
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
