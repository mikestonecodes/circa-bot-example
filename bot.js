// Settings ( find  your user token by browsing to  /botapi page )
var token = ''
var auto_open_tab_mac = false
var gameID = 0
var joinAs = 'black'
var colors = {
  EMPTY: 0,
  WHITE: 1,
  BLACK: 2
}
var yourcolor = (joinAs === 'black') ? 2 : 1

var turn = yourcolor
var gameState = 'place'
var socketIOClient = require('socket.io-client')
var sailsIOClient = require('sails.io.js')
var io = sailsIOClient(socketIOClient)
var sliding = {}
io.sails.url = 'http://45.55.2.124'
io.sails.headers = {
  'Authorization': 'Bearer ' + token
}

var moveQueue = []
 // A Queue is required so you get a response back from the server before adding another move
var timer = 0
begin(function (allmoves) {})

function yourturn () {
  console.log('it is your turn!')
  moveQueue = [play({
    ring: 2,
    hour: 4
  }), play({
    ring: 3,
    hour: 4
  }, {
    ring: 2,
    hour: 4
  })]
  startQueue()
}

function recieveUpdate (snapshot) {
  // these updates also inculde your moves
  if (snapshot.verb === 'addedTo' && snapshot.attribute === 'moves') {
    // When a new move is added
    getLatestMove()
  }
  if (snapshot.verb === 'updated' && snapshot.data.action === 'moveError') {
    console.log('Error with move', snapshot.data)
  }
  if (snapshot.verb === 'updated' && snapshot.data.action === 'chatMessageSubmited') {
    console.log('chatmg', snapshot.data)
  }
  if (snapshot.verb === 'updated' && snapshot.data.action === 'timer') {
    if (snapshot.data.timer === 10) console.log('10 seconds left!')
    timer = snapshot.data.timer
  }
  if (snapshot.verb === 'updated' && snapshot.data.action === 'userJoined') {
    console.log(snapshot.data.joinedUser.username + ' joined!', snapshot.data)
    yourturn()
  }
  if (snapshot.verb === 'updated' && snapshot.data.action === 'ending') {
    console.log('game is now ending', snapshot.data)
  }

  if (snapshot.verb === 'updated' && snapshot.data.action === 'updateTerritories') {
    //this is for when game is ending and each play is decieding what terrorities are thiers
    console.log('A User requested change to Territories')
  }

  if (snapshot.verb === 'updated' && snapshot.data.action === 'acceptScore') {
    //this is for when game is ending and each play is decieding what terrorities are thiers
    console.log('A User accepted Score and Territories')
  }
}

function begin (cb) {
  io.socket.get('/auth/bearer/authorize', function (loggedInData) {
    io.socket.post('/game/create', function serverResponded (game) {
      gameID = game.id

      if (auto_open_tab_mac) {
        var childProc = require('child_process');
        childProc.exec('open -a "Google Chrome" ' + io.sails.url + '/game/' + gameID + '/join/white');
      } else {
        console.log('visit ' + io.sails.url + '/game/' + gameID + '/join/white' + ' to join')
      }

      io.socket.on('game', recieveUpdate.bind(this))

      //gets all the moves so Far
      io.socket.get('/game/' + gameID + '/moves', function (allmoves) {
        cb(allmoves)
      })
    })
  })
}

function pass (cb) {
  console.log("passed")
  var data = {
    game: gameID,
    place: 'pass',
    color: turn,
    gameState: gameState
  }
  if (gameState === 'sliding') {
    // from field currently required if sliding
    data['from'] = 'pass'
  }
  updateGameState()
  return data
  // io.socket.post("/move",data,cb);
}

function startQueue () {
  nextMove(moveQueue[0])
}

function nextMove (data) {
  io.socket.post('/move', data)
}

function updateGameState () {
  if (gameState === 'place') {
    gameState = 'sliding'
  } else {
    sliding = null
    gameState = 'place'
  }
}

function AcceptScore () {
  io.socket.post('/game/' + gameID + '/acceptScore/')
}

function locationToNotation (location) {
  return String.fromCharCode(64 + location.ring) + location.hour
}

function notationToLocation (notation) {
  return {
    ring: notation.charCodeAt(0) - 64,
    hour: parseInt(notation.substring(1))
  }
}

function play (to, from) {
  console.log(to)
  var data = {
    game: gameID,
    place: locationToNotation(to),
    color: turn,
    gameState: gameState
  }
  if (gameState === 'sliding') {
    if (from) sliding = from
    data['from'] = locationToNotation(sliding)
  }
  updateGameState()
  return data
}

function AcceptScore () {
  io.socket.post('/game/' + gameID + '/acceptScore/');
}

function getLatestMove () {
  io.socket.get('/game/' + gameID + '/moves?sort=createdAt%20DESC&limit=1', function (moves) {
    var lastmove = moves[0]
    var nextmoveQueue = moveQueue[0]
    if (nextmoveQueue) {
      if (nextmoveQueue.place === lastmove.place &&
          nextmoveQueue.color === lastmove.color &&
          nextmoveQueue.from === lastmove.from
        ) {
        var next = moveQueue.shift()
        if (moveQueue.length > 0) {
          nextMove(moveQueue[0])
        }
      }
    }
    if (moves[0].color !== yourcolor && moves[0].from != null) {
      yourturn()
    }
    console.log('latest Move', moves[0])
  })
}
