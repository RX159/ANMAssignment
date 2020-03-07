
let $Lugar = $('#lugar')
let $Lugar_empty = $('#lugar-empty')
var markers = new Array
var wmarkers = new Array
var Long = 0
var Lati = 0

$('#btn_Busqueda').on('click', (function(event) 
  {

  	if($Lugar.val() == '')
  	{
  		$Lugar_empty.removeClass('hidden')
  	}
  	else
  	{
  		$Lugar_empty.addClass('hidden')
  		searchEarthQuakes($Lugar.val())
  	}


  }))

//GoogleAPIKEY = 'AIzaSyAqfVfnIq48fSqyiSuNUbc2txi0a7IVbzY'
//Sacar la ciudad
//http://api.geonames.org/search?name_equals=Monterrey&east,west,north,south&maxRows=1&username=RX159

//Ok, el primer problema de todos es que me van a dar una ciudad o una location, de ahi tengo que sacar
//Lat y longitud, y de esos un bound box para el area.

//Todo eso lo hare con reverse GeoCoding, dentro del mismo link que me pasaron
//Usuario es RX159
//&east,west,north,south&inclBbox

const geocode = function(ciudad,callback)
{
	$.ajax({
	    url: "http://api.geonames.org/search?name_equals="+ciudad+"&maxRows=10&username=RX159",
	    headers: {
	        'Content-Type':'application/json',
	        'Access-Control-Allow-Origin': 'RX159'
	    },
	    method: 'POST',
	    dataType: 'json',
	    success: function(response)
	    {
	      if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				//console.log(response.body.geonames[0].countryCode)
				if(ciudad == response.body.geonames[0].toponymName)
				{
					//console.log(response.body)
					const data = response.body.geonames[0]
					Long = data.lng
					Lati = data.lat
					const Code = data.countryCode
					//console.log(Lon,Lat)
					callback(Code,ciudad)

				}
				else
				{
					console.log("Error, Ciudad/Lugar mal escrita /o no especificado")
				}
				
			}
	    },
	    error: function(error_msg) 
	    {
	      console.log('Error, checar internet');
	    }
  	})
}

//http://api.geonames.org/findNearbyPlaceName?lat=25.6750698&lng=-100.3184662&east,west,north,south&username=
//http://api.geonames.org/earthquakesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&username=rx159

const geocode2 = function (Code,Ciudad,callback)
{
	$.ajax({
		    url: 'http://api.geonames.org/countryInfo?country='+Code+'&username=RX159',
		    headers: {
		        'Content-Type':'application/json'
		    },
		    method: 'GET',
		    dataType: 'json',
		    success: function(response)
		    {
		      if(response.body == undefined)
				{
					console.log('Error, se mando mal el request ')
				}
				else
				{
					//console.log(response.body)
					const North = response.body.geonames[0].north
					const South = response.body.geonames[0].south
					const East = response.body.geonames[0].east
					const West = response.body.geonames[0].west


					callback(North,South,East,West,Ciudad)
				}
		    },
		    error: function(error_msg) 
		    {
		      console.log('Error, checar internet');
		    }
	  	})
}

const geocode3 = function(North, South, East, West, ciudad, callback)
{

	$.ajax({
		url: 'http://api.geonames.org/earthquakesJSON?north='+North+'0&south='+South+'&east='+East+'&west='+West+'&date=2019-03-06&username=rx159',
		headers: {
		    'Content-Type':'application/json'
		},
		method: 'GET',
		dataType: 'json',
		success: function(response)
		{
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				//console.log(response.body.earthquakes)
				//console.log('----------')
				for (var i = 0; i<response.body.earthquakes.length ; i++)
				{
					//console.log(response.body.earthquakes[i])
					markers[i] = response.body.earthquakes[i]
					//console.log(markers[i])
				}

				//console.log(markers)
				callback(markers)
					
			}
		},
		error: function(error_msg) 
		{
		    console.log('Error, checar internet');
		}
	})
}

const World = function()
{

	const url = 'http://api.geonames.org/earthquakesJSON?north=900&south=-90&east=180&west=-180&date<=2018-03-06&username=rx159'

	//console.log(url)
	request({url, json: true}, function(error, response) 
	{ 
		if(error)
		{
			console.log('Error, checar internet')
		}
		else
		{
			console.log(response.body)
			/*
			if(response.body == undefined)
			{
				console.log('Error, No llego bien el request')
			}
			else
			{
				console.log(response.body.earthquakes)
				//console.log('----------')
				for (var i = 0; i<response.body.earthquakes.length ; i++)
				{
					//console.log(response.body.earthquakes[i])
					markers[i] = response.body.earthquakes[i]
					//console.log(markers[i])
				}

				//console.log(markers)
				//callback(markers)
				
			}
			*/
			

			
		}
		
	})

}

const searchEarthQuakes = function(Lugar) {
	
	geocode(Lugar, function(Code,Ciudad) 
	{
		geocode2(Code,Ciudad, function(North, South, East, West, ciudad)
		{
			geocode3(North, South, East, West, ciudad, function(markers)
			{
				World(function(wmarkers)
				{
					console.log(wmarkers)
					console.log(markers)
   
				})
				
				//res.send(markers)
			})
		})

	})
}

const Mapear = function (Lugar, markers, wmarkers){
	var map, infoWindow;
      console.log(Lugar)
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });

        var marker = new google.maps.Marker({
          position: {lat: 14.606, lng: -93.662},
          map: map,
          title: 'Hello World!'
        });
        var infowindow = new google.maps.InfoWindow({
          content: 'HOLA'
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      
        infoWindow = new google.maps.InfoWindow;

        /*
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
        */
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

}



 










