const rack = require('./rack')
const songname = process.argv[2];

if (songname)
  rack(songname, function(da){ console.log(da) });