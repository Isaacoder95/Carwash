/*
 *
 *Developed By ICN
 *
 *
*/

/* PROCESOS GENERICOS */
	function cambiar_menu(pagina){
		//$.mobile.changePage( "#"+pagina +'.html', { transition: "none", changeHash: false }); 
		if(pagina ==='servicios_activos')    {
			getServices();
		}  

		document.querySelector('#myNavigator').pushPage(pagina+'.html', {data: {title: pagina}});
		
	}

	function editSelects(event) {
		document.getElementById('choose-sel').removeAttribute('modifier');
		if (event.target.value == 'material' || event.target.value == 'underbar') {
		document.getElementById('choose-sel').setAttribute('modifier', event.target.value);
		}
		
	}

	function addOption(event) {
		const option = document.createElement('option');
		var text = document.getElementById('optionLabel').value;
		option.innerText = text;
		text = '';
		document.getElementById('dynamic-sel').appendChild(option);
	}

	function getCurrentDate(){
		var fecha =  new Date();
		var year = fecha.getFullYear();
		var mes = fecha.getMonth();
		var dia = fecha.getDate();
		var hora = fecha.getHours();
		var minutos = fecha.getMinutes();
		var segundos = fecha.getSeconds();
		var mes_actual = mes+1;
	
		if(mes_actual<10){mes_actual='0'+mes_actual}
		if(dia<10){dia='0'+dia}
		if(hora<10){hora='0'+hora}
		if(minutos<10){minutos='0'+minutos}
		if(segundos<10){segundos='0'+segundos}
	
		var fecha = (year+"-"+mes_actual+"-"+dia+" "+hora+"-"+minutos+"-"+segundos);
		var fecha_hora = fecha.toString();
	
		return fecha_hora;
	}

/* TERMINAN PROCESOS GENERICOS */

/* PROCESOS LOGIN */

	function login(){

	    //email = $("#rep_correo").val();
		//pass = $("#rep_pass").val();

		email = "isaac@tch.mx";
		pass = "1234";
	    
	    if (email == "" || pass=="") {
	    	ons.notification.alert("Completa los campos");
	    	}else{
	    	  
	        if(email=='isaac@tch.mx' && pass =='1234' ){
	            //db.transaction(insertDB, errorCB);
	            navigator.vibrate(50);
				cambiar_menu('carrusel');
	        }else{
	        	ons.notification.alert("Error en la autenticación");
	        }

		}
		
	}

	function cerrarSesion(){
		cleanData();
		location.reload();
	}

	/* TERMINA PROCESOS LOGIN */

	/*BUSSNESS LOGIC */  

	function saveService(){
		var id_user = "1";
		var date = getCurrentDate();
		var tipo_servicio = $("#choose-sel").val();
		var nota_adicional = $("#note").val();

		myDB.transaction(function (transaction) {
			var executeQuery = "INSERT INTO USER_SERVICE (id_user,latitud,longitud,fecha,tipo_servicio,nota_adicional ) VALUES (?,?,?,?,?,?)";
			transaction.executeSql(executeQuery, [id_user,getData("lat"),getData("lng"),date,tipo_servicio,nota_adicional]
			, function(tx, result) {                
				re = JSON.stringify(result);
				navigator.vibrate(50);
				cambiar_menu('servicios_activos')
			},
			function(error){
			  	er = JSON.stringify(error);
				console.error('Error occurred');
			});
		});
		
	}

	function getServices(){
		//$("#dinamicCards").html("");
		myDB.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM USER_SERVICE', [], function (tx, results) {
			  var len = results.rows.length;
			  if (len>=1) {
				var services = "";
				for (i = 0; i < len; i++){
					services += '<ons-card><label>'+ results.rows.item(i).nota_adicional + ", " + results.rows.item(i).tipo_servicio + ", " + results.rows.item(i).fecha +'</label><br><center><img src="img/pinza.png" style="width:25%; height:25%"><br></center><center><ons-button onclick="deleteServices('+results.rows.item(i).id+')">Eliminar</ons-button></center></ons-card>\
					</ons-card>';
				}
				$("#dinamicCards").html(services);
			  }
			}, null);
		});
	}

	function getNumberOfServices(){
		var len = 0;
		myDB.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM USER_SERVICE', [], function (tx, results) {
			   len = results.rows.length;
			}, null);
		});

		return len;
	}

	function deleteServices(idService){
		myDB.transaction(function(transaction) {
			var executeQuery = "DELETE FROM USER_SERVICE WHERE id=?";
			transaction.executeSql(executeQuery, [idService],
			function(tx, result) {
				console.log('Table deleted successfully.');
				getServices();
				numServices = getNumberOfServices();
				if(numServices	== 0){
					$("#dinamicCards").html("");
				}
			},
			function(error){
			  er = JSON.stringify(error);
			  console.error('Error occurred while droping the table.'+er);
			}
		  );
	  });  
	}

	function perfil(){
		cambiar_menu('perfil');
		setTimeout(function(){
		  var tdsinfo = '<ons-card>\
			  <div class="title center"><center>Isaac Cerna</div>\
			  <div class="content"><br>\
			  <center><img id="img_rep" width="40%" height="40%" src="img/perfil.png" style="border-radius:10px;"></center><br><br><br>\
			  <label>E-mail: <b> isaac.cerna@mail.com </b></center></label><br><br>\
			  <br><button class="button--cta" style=" width:100%;" onclick="cerrarSesion();"><i class="fa fa-check" aria-hidden="true"></i> Cerrar Sesión</button></center>\
			  </div>\
			</ons-card>';
	  
		  $("#perfilInfo").html(tdsinfo);
		},200);
		/* webservice =  web+"profile.php?jsoncallback=?";
		console.log(id_repartidor);
		$.getJSON(webservice,{id_repartidor:id_repartidor})
		.done(function(datos){
		  if(datos.validacion){
			
		  }else{
			alert(datos.mensaje);
		  }
		});  
		*/
	}
	