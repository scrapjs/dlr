//npm rebuild --runtime=electron --target=1.4.12 --disturl=https://atom.io/download/atom-shell --abi=51
//electron-packager /Users/bent/reqshark/soundcloud dlr --platform=darwin --arch=x64 --build-version=1.4.12 --abi=51

const createWriteStream = require('fs').createWriteStream
const readFileSync      = require('fs').readFileSync
const writeFile         = require('fs').writeFile
const browserify        = require('browserify')
const join              = require('path').join
const watch             = require('fs').watch
const stat              = require('fs').stat
const stylus            = require('stylus')
const utf8              = {encoding:'utf8'}

switch (process.argv[2]) {
  case '-watch':
  case 'watch':
  case '-w':
    watch(join(__dirname, 'src'), utf8, fileChange)
    watch(join(__dirname, 'css'), utf8, fileChange)
}

var ws = createWriteStream(join(__dirname, 'dot.js')), size


/**
 * `fileChange()`
 * try to watch `vdomsite/src` for changes and call `build()` to rebuild js
 * also try to watch `vdomsite/css` for changes and call `styl()` to rebuild css
 */

function fileChange (eh, file) {
  switch (file) {
    case 'dot.js'     : return
    case 'style.css'  : return
    case 'main.styl'  : return styl()
  }
  vdom(file)
}


/**
 * `vdom ( filename )`
 * build virtual-dom javascript (from entry point src/main.js)
 * a global `b`, from which `bundle()` is called, generates new readables
 */

var b = browserify().add(join(__dirname, 'src/main.js'))
function vdom (f) {
  var readable = b.bundle()

  stat(join(__dirname, 'dot.js'), (err, stats)=> size = stats.size)

  // i was curious to bench the stream
  // readable's `s` property is start time checked `.on('end')`
  readable.s = Date.now()
  
  readable
    .on('end', perf )
    .pipe(createWriteStream(join(__dirname, 'dot.js')))
    .f = f
}
function perf () {
  str = this.f ? `saved ${this.f}, rebuilt` : 'built'
  console.log(`${str} dot.js in ${Date.now() - this.s}ms`)
  if (!size)
    console.log(`now open index.html in a browser:\n
      $ open ${join(__dirname, 'index.html')}\n`)
}


/**
 * builds css from the stylus in css/main.styl
 */

function styl() {
  stylus( readFileSync( join(__dirname, 'css/main.styl'), 'utf8' ) )
    .include( join(__dirname, 'css') )
    .render( (err, css) => 
      writeFile( join(__dirname, 'css/style.css'), css ) ) // .render()
  console.log('generating new style.css')
}

vdom()
styl()

