//The search button
let $Lugar = $('#lugar')
//the error label, for not putting anything
let $Lugar_empty = $('#lugar-empty')
//The 10 closest earthquakes to the position
var markers = new Array
//The 10 worst earthquakes in the last 12 months
var wmarkers = new Array
//The longitud and latitude of the original searched place
//It's ment to center the map
var Long = 0
var Lati = 0

//The ajax function to react to the button being clicked
$('#btn_Busqueda').on('click', (function(event) 
  {
  	//validation that the user inputed a place
  	if($Lugar.val() == '')
  	{
  		//If there is no place the warning label becomes visible
  		$Lugar_empty.removeClass('hidden')
  	}
  	else
  	{
  		//if there is a place, the warning label either becomes hidden or stays hidden
  		$Lugar_empty.addClass('hidden')
  		
  	}

	// INICIO BACK END //
	//in the last version i was going to send the name of the place to the backend via Ajax and heroku
	json_to_send = {
		"Lugar": $Lugar.val()
	}

	//Stringify the jason message
	json_to_send = JSON.stringify(json_to_send)

	//The send function of ajax	
	$.ajax({
		//The local url
		// url: 'http://localhost:3000/login',
		//The heroku url
		url: 'https://lab6-a01281564.herokuapp.com/',
	    headers: {
	        'Content-Type':'application/json'
	    },
	    method: 'POST',
	    dataType: 'json',
	    data: json_to_send,
	    success: function(data){
	      //If the message worked we call the function of the map
	      Mapear(data.Lugar, data.markers)
    	},
    	error: function(error_msg) {
    		//If the message failed
      		console.log('Error')
    	}
  	})


  }))

//Here is the code to spawn the map, it's based off the one available at the Google Maps API
const Mapear = function (Lugar, markers){
	var map, infoWindow;
      console.log(Lugar)
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          //The starting location of the map, in here lat and lng would have been the ones of the place searched for
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });

        //This are the markers, if i had the markers array, then this would run in a loop from 0 to 10
        var marker = new google.maps.Marker({
          position: {lat: 14.606, lng: -93.662},
          map: map,
          title: 'Hello World!'
        });
        //The info window to display, magnitde and id
        var infowindow = new google.maps.InfoWindow({
          content: 'HOLA'
        });
        //The function to detect if a marker is touched
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      
        infoWindow = new google.maps.InfoWindow;
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

}



 










