/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/idles              ->  index
 * POST    /api/idles              ->  create
 * GET     /api/idles/:id          ->  show
 * PUT     /api/idles/:id          ->  upsert
 * PATCH   /api/idles/:id          ->  patch
 * DELETE  /api/idles/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Idle from './idle.model';
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

// Gets a list of Idles
export function index(req, res) {
  return Idle.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Idle from the DB
export function show(req, res) {
  return Idle.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Idle in the DB
export function create(req, res) {
  return process(req.files.file)
    .then(idle => Idle.create(idle))
    .then(respondWithResult(res, 201))
    .catch(handleError(res));

  // return Idle.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
}

// Upserts the given Idle in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Idle.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Idle in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Idle.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Idle from the DB
export function destroy(req, res) {
  return Idle.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
