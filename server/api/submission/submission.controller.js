/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/submissions              ->  index
 * POST    /api/submissions              ->  create
 * GET     /api/submissions/:id          ->  show
 * PUT     /api/submissions/:id          ->  upsert
 * PATCH   /api/submissions/:id          ->  patch
 * DELETE  /api/submissions/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Submission from './submission.model';
import { process } from '../../components/image-processing';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          return res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Submissions
export function index(req, res) {
  return Submission.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Submission from the DB
export function show(req, res) {
  return Submission.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Submission in the DB
export function create(req, res) {
  process(req.files.file)
    .then(submission => Submission.create(submission))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Submission in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Submission.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Submission in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Submission.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Submission from the DB
export function destroy(req, res) {
  return Submission.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
