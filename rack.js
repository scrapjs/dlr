const createWriteStream = require('fs').createWriteStream
const writeFileSync = require('fs').writeFileSync
const readFileSync = require('fs').readFileSync
const unlink = require('fs').unlink
const clientID = 'fDoItMDbsbZz8dY16ZzARCZmzgHBPotA'
const ID3Writer = require('browser-id3-writer')
const suuid = require('suuid')
const req = require('request')
const get = require('get-uri')

module.exports = track

function track ( link, fn ) {
  var str = `https://api.soundcloud.com/resolve.json?url=${link}&client_id=${clientID}`
  req(str, (e,r,b)=> {
    if (!e) try {
      var soundcloudapi = JSON.parse(b)
    } catch ($) { fn($) }
    if (soundcloudapi){
      var metas = {
        tmp: `/tmp/${suuid()}`,
        artist:soundcloudapi.user.permalink,
        title:soundcloudapi.title,
        img:soundcloudapi.artwork_url.replace(/large/i, 't500x500')
      }
      req(`${soundcloudapi.stream_url}s?client_id=${clientID}`, ( err, r, json )=> {
        if (!err) try {
          var mp3 = JSON.parse(json).http_mp3_128_url
        } catch($){ console.log('err', $); }
        if (metas.img) {
          get(metas.img, function (er, rs) {
            if (err) throw err
            rs.pipe(createWriteStream(`${metas.tmp}.jpg`))
          })
        }
        if (mp3) {
          get(mp3, function (er, rs) {
            if (err) throw err
            rs
              .on('end', ()=> setTimeout(writeTags, 300) )
              .pipe(createWriteStream(`${metas.tmp}.mp3`))
          })
        }
      })
      function writeTags(){
        var artbuf = readFileSync(`${metas.tmp}.jpg`)
        var writer = new ID3Writer(readFileSync(`${metas.tmp}.mp3`))
        writer.setFrame('TPE2', metas.artist)
          .setFrame('TIT2', metas.title)
          .setFrame('APIC', artbuf)
        writer.addTag()
        writeFileSync( `${metas.tmp}2.mp3`, new Buffer(writer.arrayBuffer) )
        unlink(`${metas.tmp}.jpg`); unlink(`${metas.tmp}.mp3`)
        require('child_process').execSync(`open ${metas.tmp}2.mp3`)
        fn(`${metas.tmp}2.mp3`)
      }
    }
  })
}
