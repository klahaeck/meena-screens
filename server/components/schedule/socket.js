'use strict';

export let socket;

export function register(_socket) {
  // Bind model events to socket events
  socket = _socket;
}