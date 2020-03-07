var encontro = 0;

let $Lugar = $('#lugar')
let $Lugar_empty = $('#lugar-empty')

$('#btn_Busqueda').on('click', (function(event) 
  {

    if($Lugar.val() == '') {
      $Lugar_empty.removeClass('hidden')
    } 
    else {

      window.location = './diary.html'
    }

	json_to_send = {
	    "Lugar": ($Lugar.val()
  	}

  	//alert($name);

  	json_to_send = JSON.stringify(json_to_send);

  	$.ajax({
	    // url: 'http://localhost:3000/users',
	    url: 'https://miniwebserverrx.herokuapp.com/users',
	    headers: {
	        'Content-Type':'application/json'
	    },
	    method: 'POST',
	    dataType: 'json',
	    data: json_to_send,
	    success: function(data){
	      alert("Successfully created");
	      console.log('success: ' + data);
	      window.location = 'index.html'
	    },
	    error: function(error_msg) {
	      alert((error_msg['responseText']));
	    }
  	})


  }))

	



 










