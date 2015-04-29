angular
.module('App', ['lumx', 'Services'])
  //create an app router for url management and redirect
.config(function($locationProvider, $routeProvider) {

$locationProvider.html5Mode({
    html5Mode: true,
    requireBase: false
});
$routeProvider.when('/', {
    templateUrl: 'partials/frontpage.min.html',
    controller: 'frontpage'
})
.when('/stats', {
    templateUrl: 'partials/stats.min.html',
    controller: 'frontpage'
})
.when('/raw', {
    templateUrl: 'partials/raw.min.html',
    controller: 'frontpage'
})
.otherwise({redirectTo: '/'});
})
.controller('frontpage', function($http, $scope, Socket, $location, LxNotificationService) {

  $scope.loading = true;
  $scope.GotoLink = function (url) {
     window.open(url,'_system'); // Um den Valve Link zu öffnen
   }

  Socket.on('Steamapi', function(Steamapi) {
    console.log('Socket.on: Steamapi')
      $scope.loading = false; // Den Ladebalken ausblenden da nun Daten vorhanden sind

      Steamapi.matchmaking.scheduler !== 'APIDown' ? LxNotificationService.info('updated data.') : LxNotificationService.error('no data') // Kline Info oder Error Notification ob es einen neuen Datensatz gibt

      $scope.Steamapiraw = JSON.stringify(Steamapi, undefined, 2)

      var statusemo = {
        APIDown: 'server-off',
        idle: 'emoticon-neutral',
        normal: 'emoticon-happy',
        delayed: 'emoticon-neutral',
        red: 'emoticon-devil',
        surge: 'emoticon-devil',
        critical: 'emoticon-devil'
      };

      var statuscolor = {
        APIDown: 'black',
        offline: 'black',
        idle: 'grey',
        normal: 'green',
        delayed: 'yellow',
        red: 'red',
        surge: 'red',
        critical: 'red'
      };

      //Load:
      var load = {
        APIDown: 'server-off',
        idle: 'server',
        low: 'server',
        medium: 'server',
        high: 'server',
        full: 'server',
        offline: 'server-off'
      };

      var loadcolor = {
        APIDown: 'black',
		offline: 'black',
        idle: 'green',
        low: 'green',
        medium: 'orange',
        high: 'red',
        full: 'red'
      };

      //$scope.services = JSON.stringify(Steamapi.services, undefined, 2);
      $scope.SessionsLogon = Steamapi.services.SessionsLogon
        $scope.SessionsLogonemo = statusemo[Steamapi.services.SessionsLogon]
        $scope.SessionsLogoncolor = statuscolor[Steamapi.services.SessionsLogon]

      $scope.SteamCommunity = Steamapi.services.SteamCommunity
        $scope.SteamCommunityemo = statusemo[Steamapi.services.SteamCommunity]
        $scope.SteamCommunitycolor = statuscolor[Steamapi.services.SteamCommunity]

      $scope.IEconItems = Steamapi.services.IEconItems
        $scope.IEconItemsemo = statusemo[Steamapi.services.IEconItems]
        $scope.IEconItemscolor = statuscolor[Steamapi.services.IEconItems]

      $scope.Leaderboards = Steamapi.services.Leaderboards
        $scope.Leaderboardsemo = statusemo[Steamapi.services.Leaderboards]
        $scope.Leaderboardscolor = statuscolor[Steamapi.services.Leaderboards]


      //$scope.matchmaking = JSON.stringify(Steamapi.matchmaking, undefined, 2);
      $scope.scheduler = Steamapi.matchmaking.scheduler
        $scope.schedulercolor = statuscolor[Steamapi.matchmaking.scheduler]
        $scope.scheduleremo = (Steamapi.matchmaking.scheduler !== 'APIDown' ? statusemo.normal : statusemo.APIDown)
      $scope.online_servers = Steamapi.matchmaking.online_servers
        $scope.online_serverscolor = (Steamapi.matchmaking.online_servers !== 0 ? loadcolor.low : loadcolor.APIDown)
        $scope.online_serversemo = (Steamapi.matchmaking.online_servers !== 0 ? statusemo.normal : statusemo.APIDown)

      $scope.online_players = Steamapi.matchmaking.online_players
        $scope.online_playerscolor = (Steamapi.matchmaking.online_players !== 0 ? loadcolor.low : loadcolor.APIDown)
        $scope.online_playersemo = (Steamapi.matchmaking.online_players !== 0 ? statusemo.normal : statusemo.APIDown)

      $scope.searching_players = Steamapi.matchmaking.searching_players
        $scope.searching_playerscolor = (Steamapi.matchmaking.searching_players !== 0 ? loadcolor.low : loadcolor.APIDown)
        $scope.searching_playersemo = (Steamapi.matchmaking.searching_players !== 0 ? statusemo.normal : statusemo.APIDown)

      $scope.search_seconds_avg = Steamapi.matchmaking.search_seconds_avg
      
      if (Steamapi.matchmaking.search_seconds_avg == 0) { // 0
        $scope.search_seconds_avgcolor = loadcolor.APIDown
        $scope.search_seconds_avgemo = statusemo.APIDown
      } else if (Steamapi.matchmaking.search_seconds_avg <= 50) { // 1-50
        $scope.search_seconds_avgcolor = loadcolor.low
        $scope.search_seconds_avgemo = statusemo.normal
      } else if (Steamapi.matchmaking.search_seconds_avg <= 65) { // 51-65
        $scope.search_seconds_avgcolor = loadcolor.medium
        $scope.search_seconds_avgemo = statusemo.delayed
      } else { 													// 66+
        $scope.search_seconds_avgcolor = loadcolor.high
        $scope.search_seconds_avgemo = statusemo.red
      }

      //$scope.data = JSON.stringify(Steamapi.datacenters, undefined, 2);
      $scope.datacentersEUWestcapacity = Steamapi.datacenters["EU West"].capacity
        $scope.datacentersEUWestload = Steamapi.datacenters["EU West"].load
        $scope.datacentersEUWestloademo = load[Steamapi.datacenters["EU West"].capacity]
        $scope.datacentersEUWestloadcolor = loadcolor[Steamapi.datacenters["EU West"].load]

      $scope.datacentersEUEastcapacity = Steamapi.datacenters["EU East"].capacity
        $scope.datacentersEUEastload = Steamapi.datacenters["EU East"].load
        $scope.datacentersEUEastloademo = load[Steamapi.datacenters["EU East"].capacity]
        $scope.datacentersEUEastloadcolor = loadcolor[Steamapi.datacenters["EU East"].load]

      $scope.datacentersUSSouthwestcapacity = Steamapi.datacenters["US Southwest"].capacity
       $scope.datacentersUSSouthwestload = Steamapi.datacenters["US Southwest"].load
       $scope.datacentersUSSouthwestloademo = load[Steamapi.datacenters["US Southwest"].capacity]
       $scope.datacentersUSSouthwestloadcolor = loadcolor[Steamapi.datacenters["US Southwest"].load]

      $scope.datacentersIndiacapacity = Steamapi.datacenters.India.capacity
        $scope.datacentersIndiaload = Steamapi.datacenters.India.load
        $scope.datacentersIndialoademo = load[Steamapi.datacenters.India.capacity]
        $scope.datacentersIndialoadcolor = loadcolor[Steamapi.datacenters.India.load]

      $scope.datacentersEUNorthcapacity = Steamapi.datacenters["EU North"].capacity
        $scope.datacentersEUNorthload = Steamapi.datacenters["EU North"].load
        $scope.datacentersEUNorthloademo = load[Steamapi.datacenters["EU North"].capacity]
        $scope.datacentersEUNorthloadcolor = loadcolor[Steamapi.datacenters["EU North"].load]

      $scope.datacentersEmiratescapacity = Steamapi.datacenters.Emirates.capacity
        $scope.datacentersEmiratesload = Steamapi.datacenters.Emirates.load
        $scope.datacentersEmiratesloademo = load[Steamapi.datacenters.Emirates.capacity]
        $scope.datacentersEmiratesloadcolor = loadcolor[Steamapi.datacenters.Emirates.load]

      $scope.datacentersUSNorthwestcapacity = Steamapi.datacenters["US Northwest"].capacity
        $scope.datacentersUSNorthwestload = Steamapi.datacenters["US Northwest"].load
        $scope.datacentersUSNorthwestloademo = load[Steamapi.datacenters["US Northwest"].capacity]
        $scope.datacentersUSNorthwestloadcolor = loadcolor[Steamapi.datacenters["US Northwest"].load]

      $scope.datacentersSouthAfricacapacity = Steamapi.datacenters["South Africa"].capacity
        $scope.datacentersSouthAfricaload = Steamapi.datacenters["South Africa"].load
        $scope.datacentersSouthAfricaloademo = load[Steamapi.datacenters["South Africa"].capacity]
        $scope.datacentersSouthAfricaloadcolor = loadcolor[Steamapi.datacenters["South Africa"].load]

      $scope.datacentersBrazilcapacity = Steamapi.datacenters.Brazil.capacity
        $scope.datacentersBrazilload = Steamapi.datacenters.Brazil.load
        $scope.datacentersBrazilloademo = load[Steamapi.datacenters.Brazil.capacity]
        $scope.datacentersBrazilloadcolor = loadcolor[Steamapi.datacenters.Brazil.load]

      $scope.datacentersUSNortheastcapacity = Steamapi.datacenters["US Northeast"].capacity
        $scope.datacentersUSNortheastload = Steamapi.datacenters["US Northeast"].load
        $scope.datacentersUSNortheastloademo = load[Steamapi.datacenters["US Northeast"].capacity]
        $scope.datacentersUSNortheastloadcolor = loadcolor[Steamapi.datacenters["US Northeast"].load]

      $scope.datacentersSingaporecapacity = Steamapi.datacenters.Singapore.capacity
        $scope.datacentersSingaporeload = Steamapi.datacenters.Singapore.load
        $scope.datacentersSingaporeloademo = load[Steamapi.datacenters.Singapore.capacity]
        $scope.datacentersSingaporeloadcolor = loadcolor[Steamapi.datacenters.Singapore.load]

      $scope.datacentersAustraliacapacity = Steamapi.datacenters.Australia.capacity
        $scope.datacentersAustraliaload = Steamapi.datacenters.Australia.load
        $scope.datacentersAustralialoademo = load[Steamapi.datacenters.Australia.capacity]
        $scope.datacentersAustralialoadcolor = loadcolor[Steamapi.datacenters.Australia.load]

      $scope.time = Steamapi.app.time;
      $scope.version =  Steamapi.app.version;
  });

  Socket.on('uptime', function(uptime) { // wird von der Server.js aufgerufen
       uptime = new Date(new Date().getTime() - uptime * 1000)
       $scope.uptime = uptime.toLocaleString()
  });
 
  Socket.on('memoryUsage', function(memoryUsage) { // wird von der Server.js aufgerufen
    memoryUsage = memoryUsage.replace(/{/g, ' ')
    $scope.memoryUsage = memoryUsage.replace(/}/g, ' ')
  });

  $scope.getUptime = function() {
      Socket.emit('uptime')
  };
  
    $scope.getMemoryUsage = function() {
      Socket.emit('memoryUsage')
  };
  	  
  $scope.alert = function()
  {
      LxNotificationService.alert('Donation?', 'Thanks! Really! but no donation necessary, all provided services are for free.', 'OK', function(a) {
            console.log(a);
      });
  };
});
