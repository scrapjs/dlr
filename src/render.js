const h = require('virtual-dom/h')
const evt = require('./evt')

module.exports = render

function render (state) {
  return h('#main', [
    h('input.form-control', {
      type:'text',
      placeholder:'paste soundcloud link',
      oninput: evt.input
    }),
    h('p', `dl: ${state.trackurl}`)
  ])
}