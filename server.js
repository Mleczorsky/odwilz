const express = require('express')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { accessSpreadsheet } = require('./spreadsheetsmenager')

let useGoogleApi = false;
const reactions = Array(7).fill({
  hearts:0,
  likes:0,
  wows:0,
  bocians:0
});
const indexes = Array(7).fill(1);
let performerId = 0;
app.use('/css', express.static('css'))
app.use('/photos', express.static('photos'))
app.use('/reactions', express.static('reactions'))

app.get('/panel', (req, res) => {
  console.log('[LOADED] control panel')
  res.sendFile(__dirname + '/panel.html');
});

app.get('/', (req, res) => {
  console.log("[LOADED] speakers display")
  res.sendFile(__dirname + '/client.html');
});
app.get('/clock', (req, res) => {
  console.log("[LOADED] speakers display")
  res.sendFile(__dirname + '/clock.html')
})
app.get('/reactions', (req, res) => {
  console.log('[LOADED] reactions')
  res.sendFile(__dirname + '/reactions.html');
});

app.get('/currentperformer', (req, res) => {
  console.log('[LOADED] current performer display')
  res.sendFile(__dirname + '/currentPerformer.html');
});
app.get('/nextperformer', (req, res) => {
  console.log('[LOADED] current performer display')
  res.sendFile(__dirname + '/nextPerformer.html');
});
io.on('connection', (socket) => {
    socket.on('addSpeaker', (data) => {
      console.log('[SOCKET] '+'add ' + data.name);
      io.emit('addSpeaker', data);
    });
    socket.on('removeSpeaker', (data) => {
      console.log('[SOCKET] '+'remove ' + data.name);
      io.emit('removeSpeaker', data);
    });
    socket.on('performer', (data) => {
      performerId = data.index-1;
      console.log('[SOCKET] '+'performer ' + data.performer);
      io.emit('performer', data);
    });
    socket.on('apiCommunication', (data) => {
      useGoogleApi = data;
      // console.log( `apiCommunication: ${data}`);
      io.emit('setReactions', reactions[performerId] )
    })
});

setInterval( () => {
  if ( useGoogleApi ) {
    accessSpreadsheet( indexes[performerId], performerId ).then( ({data, row}) => {
      reactions[performerId].likes += data.likes;
      reactions[performerId].hearts += data.hearts;
      reactions[performerId].wows += data.wows;
      reactions[performerId].bocians += data.bocians;

      indexes[performerId] = row;
      console.log( `performerId: ${performerId}`)
      console.log( reactions[performerId] )
      io.emit('setReactions', reactions[performerId] )
    })
  }
}, 2000);

http.listen(3000, () => {
  console.log('listening on *:3000');
});