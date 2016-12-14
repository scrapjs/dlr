const state = require('./state')
const evt = module.exports = new (require('events').EventEmitter)()

evt.input = input

function input (e) {
  state.trackurl = e.currentTarget.value
  e.target.value = ''
  if (state.trackurl && state.trackurl.charAt(0) === 'h') {
    evt.emit('update', state)
    pub.send(state.trackurl)
  }
}

pub.connect('tcp://127.0.0.1:5005')
sub.connect('tcp://127.0.0.1:5006')

sub.on('data', function(data){
  state.trackurl = 'done...'
  evt.emit('update', state)
})