'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newSubmission;

describe('Submission API:', function() {
  describe('GET /api/submissions', function() {
    var submissions;

    beforeEach(function(done) {
      request(app)
        .get('/api/submissions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          submissions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(submissions).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/submissions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/submissions')
        .send({
          name: 'New Submission',
          info: 'This is the brand new submission!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSubmission = res.body;
          done();
        });
    });

    it('should respond with the newly created submission', function() {
      expect(newSubmission.name).to.equal('New Submission');
      expect(newSubmission.info).to.equal('This is the brand new submission!!!');
    });
  });

  describe('GET /api/submissions/:id', function() {
    var submission;

    beforeEach(function(done) {
      request(app)
        .get(`/api/submissions/${newSubmission._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          submission = res.body;
          done();
        });
    });

    afterEach(function() {
      submission = {};
    });

    it('should respond with the requested submission', function() {
      expect(submission.name).to.equal('New Submission');
      expect(submission.info).to.equal('This is the brand new submission!!!');
    });
  });

  describe('PUT /api/submissions/:id', function() {
    var updatedSubmission;

    beforeEach(function(done) {
      request(app)
        .put(`/api/submissions/${newSubmission._id}`)
        .send({
          name: 'Updated Submission',
          info: 'This is the updated submission!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSubmission = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSubmission = {};
    });

    it('should respond with the updated submission', function() {
      expect(updatedSubmission.name).to.equal('Updated Submission');
      expect(updatedSubmission.info).to.equal('This is the updated submission!!!');
    });

    it('should respond with the updated submission on a subsequent GET', function(done) {
      request(app)
        .get(`/api/submissions/${newSubmission._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let submission = res.body;

          expect(submission.name).to.equal('Updated Submission');
          expect(submission.info).to.equal('This is the updated submission!!!');

          done();
        });
    });
  });

  describe('PATCH /api/submissions/:id', function() {
    var patchedSubmission;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/submissions/${newSubmission._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Submission' },
          { op: 'replace', path: '/info', value: 'This is the patched submission!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSubmission = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSubmission = {};
    });

    it('should respond with the patched submission', function() {
      expect(patchedSubmission.name).to.equal('Patched Submission');
      expect(patchedSubmission.info).to.equal('This is the patched submission!!!');
    });
  });

  describe('DELETE /api/submissions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/submissions/${newSubmission._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when submission does not exist', function(done) {
      request(app)
        .delete(`/api/submissions/${newSubmission._id}`)
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
