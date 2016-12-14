/**
 * main.js
 * entry point to app, where virtual dom is appended to document.body
 */

const state     = require('./state')
const loop      = require('./loop')

window.state    = state // for debugging state

document.body.appendChild( loop.target )

// update the main-loop
require('./evt').on( 'update', loop.update )
