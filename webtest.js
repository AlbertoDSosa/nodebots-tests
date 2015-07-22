var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    five = require('johnny-five'),
    gamepad = require('gamepad');
 
app.listen(8080);
gamepad.init();


// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
setInterval(gamepad.detectDevices, 500);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
 
    res.writeHead(200);
    res.end(data);
  });
}
 
board = new five.Board();
 
board.on("ready", function() {
  led_green = new five.Led(13);
  led_blue = new five.Led(12);
  led_red   = new five.Led(8);

  gamepad.on('down', function (id, num) {
    if (num === 0) {
      led_blue.toggle();
    } else if (num === 2) {
      led_red.toggle();
    } else if(num === 3) {
      led_green.toggle();
    }

    console.log(num);
  });

  io.sockets.on('connection', function (socket) {
    console.log(socket.id);
    socket.on('click_green', function () {
      led_green.toggle();
    });

    socket.on('click_blue', function () {
      led_blue.toggle();
    });

    socket.on('click_red', function () {
      led_red.toggle();
    });
    
  });
});