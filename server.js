var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 80;

var jf = require('jsonfile'),
    requestjson = require('request-json'),
    connect = require('connect'),
    colors = require('colors'),
    serveStatic = require('serve-static'),
    socket = require('socket.io'),
    util = require('util');

var Steamapi_FILEcache = require('./resources/steamapi.json'); // zum Server Start laden
var Steamapi_FILE = './resources/steamapi.json' // als Variable für später
var apiDown_FILE = './resources/down.json' // Alles doof ohne API

//server starten

var server = connect().
  use(serveStatic(__dirname+'/client')).
  listen(port, ipaddress);
var io = socket.listen(server);

// Config
var steamapikey = 'ABC123ABC123ABC123ABC123ABC123' // http://steamcommunity.com/dev/apikey
var clientjson = requestjson.createClient('http://api.steampowered.com/');

// Meine API Get funktion um die API Json Datei zu laden
function readApi () {
    console.log('     readApi()') // Debug anfang der Funktion

    clientjson.get('ICSGOServers_730/GetGameServersStatus/v001/?key='+steamapikey, function(err, res, body) { //hole mir die Aktuellen Daten aus der Steam API
	console.log('err '+err) //  Error: connect ETIMEDOUT
      if(body !== undefined) { // Steam API Down?
      console.log('  API Daten gefunden'.yellow);
            jf.readFile(Steamapi_FILE, "utf8", function(err, data) { // Lade die aktuelle Lokale Json Datei quasi das Backup

                if (data.app.timestamp == body.result.app.timestamp) { // falls der Zeitstempel gleich ist dann sind die gezogenen Daten alt
                    console.log('Alte Daten! '.green +data.app.timestamp+' | '+body.result.app.timestamp)
                  //console.log(Date()+' waitsec')
                  waitsec(2000) // Fange versuche es in 2 Sekunden nochmal
                } else {
                    console.log('Neue Daten! '.red +'alt: ' +data.app.timestamp+' | neu: '+body.result.app.timestamp)
                  io.sockets.emit('Steamapi', body.result); // pusht die neuen Daten auf die Webseite und verteilt sie an alle Clients
                  //console.log(Date()+' waitsec')
                  waitsec(45000) // wartet 45sek
                  saveDB(body.result) // speichern als JSON
                }

            });

        } else {
          console.log('  API Daten nicht gefunden'.red);
          jf.readFile(apiDown_FILE, "utf8", function(err, data) { // Lade die aktuelle Lokale Json Datei quasi das Backup
            io.sockets.emit('Steamapi', data) // Alles doof json ???
          });
          waitsec(5000) // wartet 5sek
        }
  });
}

  function saveDB (callback) {
    console.log('     saveDB() '+Date())
      process.nextTick(function() {
        // Daten speichen damit neue Besucher direkt den letzten Stand haben und zum späteren Vergleich
        jf.writeFileSync(Steamapi_FILE, callback)
      });
  }

  function waitsec(time) {
      setTimeout(function() {
      //setInterval(function() {
        console.log('wait '+time/1000+ 'sek! '.red + Date())
        readApi()
      },time
    )
  }

//Socket.io mit dem Server kommunizieren
io.sockets.on('connection', function(socket) {
  //  console.log('client connected! '+JSON.stringify(Steamapi_FILEcache));
    console.log('client connected!');

    jf.readFile(Steamapi_FILE, "utf8", function(err, data) {
      socket.emit('Steamapi', data);
    //  socket.emit('jstime', time);
    });
    socket.on('uptime', function() { // wird aufgerufen wenn auf /#/stats auf Uptime geklickt wird
        socket.emit('uptime', process.uptime()); // in Sekunden
        console.log(process.uptime())
    });
	
	socket.on('memoryUsage', function() { // wird aufgerufen wenn auf /#/stats auf memoryUsage geklickt wird
        socket.emit('memoryUsage', util.inspect(process.memoryUsage())); // in JSON
    });
});

readApi() // irgendwo muss man ja anfangen
console.log('Server started and listen to http://'+ipaddress+':'+port);
