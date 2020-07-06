var map;
var marker3,marker,ventana,marker2;
var casa, local, lugar1, lugar2;
var mi_latitud=41.46138536937553;
var mi_longitud=2.2381693112477112;
var latitud_central=41.460578328019885;
var longitud_central=2.2386038303375244;

//var web = "https://www.farmazon.mx/v2_webservices_repartidor/";
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        trigger_autologin();	
        sqliteBd();
        getPosition();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
    
};

function sqliteBd(){
    myDB = window.sqlitePlugin.openDatabase({name: "Carwash_db.db", location: 'default'});
    console.log(myDB);
    cordova.plugins.backgroundMode.enable();
    cordova.plugins.backgroundMode.setDefaults({ silent: true });
    myDB.transaction(function(transaction) {
      transaction.executeSql('CREATE TABLE IF NOT EXISTS USER_SERVICE (id integer primary key, id_user INT(5), latitud VARCHAR(80), longitud VARCHAR(80),fecha DATETIME, tipo_servicio VARCHAR (80) , nota_adicional VARCHAR(80) )', [],
      function(tx, result) {
        console.log("Table created successfully");
      },
      function(error) {
        console.log("Error occurred while creating the table.");
      });
    });
}

function getPosition() {
    var options = {
       enableHighAccuracy: true,
       maximumAge: 3600000
    }
    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
 
    function onSuccess(position) {
       
          var mapOptions = {
            center:new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: true
         };
         map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
         //map.setZoom(14); // Si quiero cambiar despues el nivel de zoom
         //map.setCenter(local.getPosition());: // Si quiero cambiar después el centro del mapa
         var myLatLng;
         var marker;

         saveData("lat",position.coords.latitude)
         saveData("lng",position.coords.longitude)

         myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude}
         marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!',
            draggable: true
         });

         var input = document.getElementById('address');

         var searchBox = new google.maps.places.SearchBox(input); // <- like this
     
         map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
     
         // Bias the SearchBox results towards current map's viewport.
         map.addListener('bounds_changed', function() {
           searchBox.setBounds(map.getBounds());
           var bounds =  map.getBounds();
           var ne = bounds.getNorthEast();
           var sw = bounds.getSouthWest();

         });

    };
 
    function onError(error) {
       alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
 }

 
function trigger_autologin(){
    
   //  if(getData("user")!=null){   
       // $("#rep_correo").val(getData("user"));
       // $("#rep_pass").val(getData("pass"));
        login();
    // }
}

document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'page1') {
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Page 2'}});
    };
  } else if (page.id === 'page2') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});