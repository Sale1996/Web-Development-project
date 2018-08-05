$(document).ready(function() {

/* *
 * Funkcija koja se pokrece kada kliknemo na link 'nalog' u gornjem desnom uglu administratora
 * */
$(document).on("click","#OtvoriNalogAdministratora",function(e){
	e.preventDefault();
	$.ajax({
		url: 'rest/korisnik', //url
		type: "GET" ,
		success : function(admin) {
			$("#nalogAdministratora").show();
			
			$("#ImeIPrezimeAdmin").text(admin.ime+" "+admin.prezime);
			//sada cemo da popunimo tabelu informacijama o korisniku sa linkom izmeni
			let trIme= $('<tr><td><b>Ime:</b></td><td>'+ admin.ime +' </td></tr>');
			let trPrezime= $('<tr><td><b>Prezime:</b></td><td>'+ admin.prezime +' </td></tr>');
			let trUloga = $('<tr><td><b>Uloga:</b></td><td>'+ admin.uloga +' </td></tr>');
			let trTelefon= $('<tr><td><b>Kontakt telefon:</b></td><td>'+ admin.kontaktTelefon +' </td></tr>');
			let trEmail=$('<tr><td><b>Email:</b></td><td>'+ admin.emailAdresa +' </td></tr>');
			let trDatumRegistracije=$('<tr><td><b>Datum registracije:</b></td><td>'+ admin.dan +'.'+admin.mesec+ '.'+ admin.godina + '.</td></tr>');
			$("#podaciOAdminu tbody").append(trIme).append(trPrezime).append(trUloga).append(trTelefon).append(trEmail).append(trDatumRegistracije);				
		}
		
	});
	
});
	
/* *
 * Poziva se prilikom gasenja prozora naloga administratora
 * */
$(document).on("click","#izlazIzNalogaAdministratora",function(e){
	$("#nalogAdministratora").hide();
	$("#podaciOAdminu tbody tr").remove(); //brisemo sve redove tabele
	
});
	
/* *
 * Ukoliko kliknemo na link Artikli mi cemo izbaciti sve artikle u tabelu admina sa linkom za izmenu
 * kao pocetni link za pravljenje novog Artikla i link za izmeni i obrisi pored svakog
 * */
 $(document).on("click","#izlistajArtikleAdmin",function(e){
	 e.preventDefault();
	 
	 
	 $.ajax({
		 url:'rest/artikli',
		 type: "GET",
		 success: function(artikli){
			 izlistajArtikleAdmin(artikli);
		 }
	 });
 });
 /* *
  * Funkcija koja se poziva prilikom klika na link izmeni i poziva prozor izmene artikla
  * */
 $(document).on("click",".izmeniArtikal",function(e){
	  e.preventDefault();
	  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'GET',
		  success: function(artikal){
			  $("#izmenaArtikla").show();
			  $("#nazivArtiklaIzmena").val(artikal.naziv);
			  $("#nazivArtiklaPotvrda").val(artikal.naziv);
			  $("#restoranArtikla").val(artikal.restoran);
			  $("#opisArtiklaIzmena").val(artikal.opis);
			  $("#cenaArtiklaIzmena").val(artikal.jedinicnaCena);
			  $("#kolicinaArtiklaIzmena").val(artikal.kolicina);
			  $("#tipArtikalIzmena").val(artikal.tip);
		  }
	  });
	  
	  
 });
	 
	 
/* * 
 * Funkcija koja se aktivira prilikom potvrde izmene artikla 
 * 
 * */
$('#formaIzmeneArtikla').submit(function(event){
	event.preventDefault();
	let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
	let naziv = $('#nazivArtiklaIzmena').val();
	let stariNaziv = $("#nazivArtiklaPotvrda").val();
	let restoran = $("#restoranArtikla").val();
	let opis = $('#opisArtiklaIzmena').val();
	let cena = $('#cenaArtiklaIzmena').val();
	let kolicina = $('#kolicinaArtiklaIzmena').val();
	let tip = $('#tipArtikalIzmena').val();
	
	
	
	if(naziv==""){
		$('#errorNazivArtiklaIzmena').text('Polje naziv ne sme biti prazno prilikom izmene!');
		$('#errorNazivArtiklaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	if(opis==""){
		$('#errorOpisArtiklaIzmena').text('Polje opis ne sme biti prazno prilikom izmene!');
		$('#errorOpisArtiklaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(cena<0){
		$('#errorCenaArtiklaIzmena').text('Polje cena ne sme biti manje od nule!');
		$('#errorCenaArtiklaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	if(kolicina<0){
		$('#errorKolicinaArtikla').text('Polje kolicina ne sme biti manje od nule!');
		$('#errorKolicinaArtikla').show().delay(9000).fadeOut();
		greska=1;
	}
	if(tip==""){
		$('#errorTipArtikla').text('Polje tip ne sme biti prazno prilikom izmene!');
		$('#errorTipArtikla').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(greska==1)
		return;
	
	$.ajax({
		url: 'rest/artikli', //url
		type: "PUT" ,
		data: JSON.stringify({naziv:naziv,jedinicnaCena:cena,opis:opis,kolicina:kolicina,tip:tip,restoran:restoran,brojArtikala:"",stariNaziv:stariNaziv }),
		contentType: 'application/json',
		success : function(string) {
			if(string==""){
				//OSTALO JE OVDE DA URADIS
				$("#izmenaArtikla").hide();
				//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
				//da klikne kako bi se izmene refreshovale
				$("#adminTabela tbody tr").remove();
				$("#adminTabela thead tr").remove();

				 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
				 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

				
			}
			//ukoliko vec ima naziv u povratnom stringu ce se naglasiti
			if(string.includes("Naziv")){
				$('#errorNazivArtiklaIzmena').text('Artikal sa datim imenom u istom restoranu vec postoji!');
				$('#errorNazivArtiklaIzmena').show().delay(9000).fadeOut();
			}
		}
	});
	
});
		
/* *
 * Klikom na dodaj novi artikal otvaramo prozor za dodavanje artikla
 * */
 $(document).on("click","#dodajNoviArtikalLink",function(e){
	 e.preventDefault();
	 $.ajax({
		 url: '/WebProjekat/rest/restorani',
		 type: "GET",
		 success: function(restorani){
			 for(let restoran of restorani){
				 let optionRestoran = $('<option value="'+restoran.naziv+'">'+restoran.naziv+'</option>');
				 $("#restoranArtiklaKreiranje").append(optionRestoran);
			 }
			 $("#noviArtikal").show();

		 }
		 
	 });
	 
 });

	 
/* * 
 * Funkcija koja se aktivira prilikom potvrde kreiranja artikla 
 * 
 * */
$('#formaDodavanjaArtikla').submit(function(event){
	event.preventDefault();
	let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
	let naziv = $('#nazivArtiklaKreiranje').val();
	let restoran = $("#restoranArtiklaKreiranje").val();
	let opis = $('#opisArtiklaKreiranje').val();
	let cena = $('#cenaArtiklaKreiranje').val();
	let kolicina = $('#kolicinaArtiklaKreiranje').val();
	let tip = $('#tipArtikalKreiranje').val();
	
	
	
	if(naziv==""){
		$('#errorNazivArtiklaKreiranje').text('Polje naziv ne sme biti prazno!');
		$('#errorNazivArtiklaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(opis==""){
		$('#errorOpisArtiklaKreiranje').text('Polje opis ne sme biti prazno!');
		$('#errorOpisArtiklaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(cena<0){
		$('#errorCenaArtiklaKreiranje').text('Polje cena ne sme biti manje od nule!');
		$('#errorCenaArtiklaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(kolicina<0){
		$('#errorKolicinaArtiklaKreiranje').text('Polje kolicina ne sme biti manje od nule!');
		$('#errorKolicinaArtiklaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(tip==""){
		$('#errorTipArtiklaKreiranje').text('Polje tip ne sme biti prazno!');
		$('#errorTipArtiklaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(greska==1)
		return;
	
	$.ajax({
		url: 'rest/artikli/kreirajNovi', //url
		type: "POST" ,
		data: JSON.stringify({naziv:naziv,jedinicnaCena:cena,opis:opis,kolicina:kolicina,tip:tip,restoran:restoran,brojArtikala:"",stariNaziv:"" }),
		contentType: 'application/json',
		success : function(string) {
			if(string==""){
				//OSTALO JE OVDE DA URADIS
				$("#noviArtikal").hide();
				//sada brisemo sve iz forme sto smo pre uneli
				$('#nazivArtiklaKreiranje').val("");
				$('#opisArtiklaKreiranje').val("");
				$('#cenaArtiklaKreiranje').val("");
				$('#kolicinaArtiklaKreiranje').val("");
				$('#tipArtikalKreiranje').val("");
				
				//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
				//da klikne kako bi se izmene refreshovale
				$("#adminTabela tbody tr").remove();
				$("#adminTabela thead tr").remove();

				//ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
				$("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

				
			}
			//ukoliko vec ima naziv u povratnom stringu ce se naglasiti
			if(string.includes("Naziv")){
				$('#errorNazivArtiklaKreiranje').text('Artikal sa datim imenom u istom restoranu vec postoji!');
				$('#errorNazivArtiklaKreiranje').show().delay(9000).fadeOut();
			}
		}
	});
	
});
		
 /* *
*			KLIK NA LOGICKO BRISANJE ARTIKLA
*		  * */
 $(document).on("click",".izbrisiArtikal",function(e){
	  e.preventDefault();
	  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'DELETE',
		  success: function(poruka){
			  if(poruka=="ok"){
				alert("Uspesno obrisan artikal!");  
				  }
			  }
		  });
  
	 });		
	
 
 
	/*
	 * AKTIVIRA SE NA SUBMIT FORMU PRETRAGE ARTIKLA OD STRANE ADMINISTRATORA
	 * */
	$('#formaPretragaArtikalaAdmin').submit(function(event){
		event.preventDefault();
		let naziv = $('#inputNazivPretragaArtikla').val();
		let cenaMin = $('#inputCenaMinPretragaArtikla').val();
		let cenaMax = $('#inputCenaMaxPretragaArtikla').val();
		let kategorija =$('#tipPretragaAdmin').val();
		let restoran = $('#idRestoranPretragaAdmin').val();
		
		if(cenaMin<0 || cenaMax<0){
			$('#errorPretragaArtiklaAdmin').text('Cena ne sme biti negativna!');
			$('#errorPretragaArtiklaAdmin').show().delay(2000).fadeOut();
			return;
		}
		$("#errorPretragaArtiklaAdmin").hide();
		$.ajax({
		    url: '/WebProjekat/rest/artikli',
		    type: "POST" ,
			data: JSON.stringify({naziv:naziv,jedinicnaCena:cenaMin,opis:'',kolicina:cenaMax,tip:kategorija,restoran:restoran }),
			contentType: 'application/json',
			success: function(artikli){
				
				izlistajArtikleAdmin(artikli); //izlistavamo sve artikle iz filtera
				
				let dugmeZaPonistavanje = $('<td><button class="button"  id="dugmePonistavanjaFilteraArtikalaAdmin" style="background-color : #5F8DAB">Ponisti filter</button></td>');
				let tr = $('<tr></tr>');
				tr.append(dugmeZaPonistavanje);
				$("#adminTabela thead").append(tr);
				
				
			}
		});
		
		
		
	});

	$(document).on("click","#dugmePonistavanjaFilteraArtikalaAdmin",function(e){
		e.preventDefault();
		 $.ajax({
			 url:'rest/artikli',
			 type: "GET",
			 success: function(artikli){
				 izlistajArtikleAdmin(artikli);
			 }
		 });
	});
		 
	/* AKCIJE VEZANE ZA RESTORANE 
	 * */
			/* AKCIJE VEZANE ZA RESTORANE 
			 * */
			/* AKCIJE VEZANE ZA RESTORANE 
			 * */
			/* AKCIJE VEZANE ZA RESTORANE 
			 * */
			/* AKCIJE VEZANE ZA RESTORANE 
			 * */
			/* AKCIJE VEZANE ZA RESTORANE 
			 * */
		 
 /*
  * Fucnkija koja lista sve restorane nakon klika iz menija
  * restorani i njega podebljava
  * */
 $(document).on("click","#izlistajRestoraneAdmin",function(e){
	 e.preventDefault();
	 
	 
	 $.ajax({
		 url:'rest/restorani',
		 type: "GET",
		 success: function(restorani){
			 izlistajRestoraneAdmin(restorani);
		 }
	 });
 });
 
 /*
  * Aktivira se na submit formu pretrage restorana
  * */
 $('#formaPretragaRestoranaAdmin').submit(function(event){
		event.preventDefault();
		var naziv = $('#nazivRestoranaAdmin').val();
		var ulica= $('#ulicaRestoranaAdmin').val();
		var kategorija = $("#tipPretragaRestoranAdmin").val();
		
		
		$.ajax({
			url: 'rest/restorani/pretraga', //url
			type: "POST" ,
			data: JSON.stringify({naziv:naziv,adresa:ulica,kategorija:kategorija}),
			contentType: 'application/json',
			success : function(restorani) {
				izlistajRestoraneAdmin(restorani);
				
				let dugmeZaPonistavanje = $('<td><button class="button"  id="dugmePonistavanjaFilteraRestoranaAdmin" style="background-color : #5F8DAB">Ponisti filter</button></td>');
				let tr = $('<tr></tr>');
				tr.append(dugmeZaPonistavanje);
				$("#adminTabela thead").append(tr);
			}
		});
 });
 
 /*
  * Ponistavanje filtera restorana u admin rezimu
  * 
  * */
 $(document).on("click","#dugmePonistavanjaFilteraRestoranaAdmin",function(e){
	 e.preventDefault();
	 
	 
	 $.ajax({
		 url:'rest/restorani',
		 type: "GET",
		 success: function(restorani){
			 izlistajRestoraneAdmin(restorani);
		 }
	 });
 });
	
 
 /*
  * FUNKCIJA KOJA OTVARA PROZOR IZMENE RESTORANA
  * */
 $(document).on("click",".izmeniRestoran",function(e){
	  e.preventDefault();
	  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'GET',
		  success: function(restoran){
			  $("#izmenaRestorana").show();
			  $("#nazivRestoranaIzmena").val(restoran.naziv);
			  $("#nazivRestoranaPotvrda").val(restoran.naziv);
			  $("#adresaRestoranaIzmena").val(restoran.adresa);
			  $("#kategorijaRestoranaIzmena").val(restoran.kategorija);
			 
		  }
	  });
	  
	  
 });
		 
	 
 /*
  * Funkcija koja vrsi konkretnu izmenu restorana
  * i aktivira se na klik submit forme izmene iz pop up prozora
  * */
 $('#formaIzmeneRestorana').submit(function(event){
	event.preventDefault();
	let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
	let naziv = $('#nazivRestoranaIzmena').val();
	let stariNaziv = $("#nazivRestoranaPotvrda").val();
	let adresa = $("#adresaRestoranaIzmena").val();
	let kategorija = $('#kategorijaRestoranaIzmena').val();
	
	
	
	
	if(naziv==""){
		$('#errorNazivRestoranaIzmena').text('Polje naziv ne sme biti prazno prilikom izmene!');
		$('#errorNazivRestoranaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	if(adresa==""){
		$('#errorAdresaRestoranaIzmena').text('Polje adrese ne sme biti prazno prilikom izmene!');
		$('#errorAdresaRestoranaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	if(kategorija==""){
		$('#errorKategorijaRestorana').text('Polje kategorije ne sme biti prazno prilikom izmene!');
		$('#errorKategorijaRestorana').show().delay(9000).fadeOut();
		greska=1;
	}
	
	
	
	if(greska==1)
		return;
	
	$.ajax({
		url: 'rest/restorani', //url
		type: "PUT" ,
		data: JSON.stringify({naziv:naziv,adresa:adresa,kategorija:kategorija,stariNaziv:stariNaziv}),
		contentType: 'application/json',
		success : function(string) {
			if(string==""){
				$("#izmenaRestorana").hide();
				//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
				//da klikne kako bi se izmene refreshovale
				$("#adminTabela tbody tr").remove();
				$("#adminTabela thead tr").remove();

				 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
				 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

				
			}
			//ukoliko vec ima naziv u povratnom stringu ce se naglasiti
			if(string.includes("Naziv")){
				$('#errorNazivRestoranaIzmena').text('Restoran sa datim imenom vec postoji!');
				$('#errorNazivRestoranaIzmena').show().delay(9000).fadeOut();
			}
		}
	});
	
});
	
 /*
  * Klikom na novi restoran, otvaramo pop up sa formom za dodavanje
  * novog restorana
  * */
 $(document).on("click","#dodajNoviRestoran",function(e){
	 e.preventDefault();
	 $("#noviRestoran").show();
 
	 });		 

	 
$('#formaDodavanjaRestorana').submit(function(event){
	event.preventDefault();
	let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
	let naziv = $('#nazivRestoranaKreiranje').val();
	let stariNaziv = $("#nazivRestoranaPotvrdaKreiranje").val();
	let adresa = $("#adresaRestoranaKreiranje").val();
	let kategorija = $('#kategorijaRestoranaKreiranje').val();
	
	
	
	
	if(naziv==""){
		$('#errorNazivRestoranaKreiranje').text('Polje naziv ne sme biti prazno!');
		$('#errorNazivRestoranaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(adresa==""){
		$('#errorAdresaRestoranaKreiranje').text('Polje adrese ne sme biti prazno!');
		$('#errorAdresaRestoranaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(kategorija==""){
		$('#errorKategorijaRestoranaKreiranje').text('Polje kategorije ne sme biti prazno!');
		$('#errorKategorijaRestoranaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	
	
	if(greska==1)
		return;
	
	$.ajax({
		url: 'rest/restorani', //url
		type: "POST" ,
		data: JSON.stringify({naziv:naziv,adresa:adresa,kategorija:kategorija,stariNaziv:stariNaziv}),
		contentType: 'application/json',
		success : function(string) {
			if(string==""){
				//OSTALO JE OVDE DA URADIS
				$("#noviRestoran").hide();
				//sada brisemo sve iz forme sto smo pre uneli
				$('#nazivRestoranaKreiranje').val("");
				$('#adresaRestoranaKreiranje').val("");
				$('#kategorijaRestoranaKreiranje').val("");
				
				
				//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
				//da klikne kako bi se izmene refreshovale
				$("#adminTabela tbody tr").remove();
				$("#adminTabela thead tr").remove();

				//ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
				$("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

				
			}
			//ukoliko vec ima naziv u povratnom stringu ce se naglasiti
			if(string.includes("Naziv")){
				$('#errorNazivRestoranaKreiranje').text('Restoran sa datim imenom vec postoji!');
				$('#errorNazivRestoranaKreiranje').show().delay(9000).fadeOut();
			}
		}
	});
	
});

 /* *
*			KLIK NA LOGICKO BRISANJE RESTORANA
*		  * */
 $(document).on("click",".izbrisiRestoran",function(e){
	  e.preventDefault();
	  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'DELETE',
		  success: function(poruka){
			  if(poruka=="ok"){
				alert("Uspesno obrisan restoran!");  
				  }
			  }
		  });
  
	 });	
		 
		 
/*
 * VOZILO VOZILO VOZILO VOZILO VOZILO
 * */
			/*
			 * VOZILO VOZILO VOZILO VOZILO VOZILO
			 * */
			/*
			 * VOZILO VOZILO VOZILO VOZILO VOZILO
			 * */
			/*
			 * VOZILO VOZILO VOZILO VOZILO VOZILO
			 * */
			/*
			 * VOZILO VOZILO VOZILO VOZILO VOZILO
			 * */
			/*
			 * VOZILO VOZILO VOZILO VOZILO VOZILO
			 * */
		 
		 

 /*
  * Fucnkija koja lista sve restorane nakon klika iz menija
  * restorani i njega podebljava
  * */
 $(document).on("click","#izlistajVozilaAdmin",function(e){
	 e.preventDefault();
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajVozilaAdmin").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	 
	//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//a takodje i restorana
		$("#pretragaRestoranaAdmin").hide();
	 
	 $.ajax({
		 url:'rest/vozila',
		 type: "GET",
		 success: function(vozila){
			 let tr=$('<tr></tr>');
			 
			 //ovde ubacujemo link za dodavanje novog artikla na vrh tabele
			 let trHead = $('<tr></tr>');
			 let tdHead= $('<td><a id="dodajNovoVozilo" style="color: #50AE94" href="#">Dodaj novo vozilo</a></td>');
			 trHead.append(tdHead);
			 $("#adminTabela thead").append(trHead);
			 
			
			 for(let vozilo of vozila){
				    tr=$('<tr></tr>');
				    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + vozilo.registarskaOznaka+  '\')"><p style=\"color: #765FAB; font-size: 20px;\" ><b>' +vozilo.marka+ ' ' + vozilo.model
							+ '</b></p> <span class="popuptext" id="' + vozilo.registarskaOznaka
							+'"><b>Marka:</b> '+ vozilo.marka +' </br><b>Model:</b> '+ vozilo.model +' </br><b>Tip:</b> '+ vozilo.tip + ' </br><b>Registarska oznaka:</b> '+ vozilo.registarskaOznaka +
							' </br><b>Godina proizvodnje:</b> '+ vozilo.godinaProizvodnje + '</br><b>Napomena:</b> '+ vozilo.napomena +'</span>'+
							' </div>');		
					let tdIzmeni = $('<td><a class="izmeniVozilo" href="/WebProjekat/rest/vozila/'+vozilo.registarskaOznaka+'">Izmeni</a></td>');
					let tdObrisi=$('<td><a class="izbrisiVozilo" style="color:red" href="/WebProjekat/rest/vozila/'+vozilo.registarskaOznaka+'">Obrisi</a></td>');
					tr.append(tdNaziv).append(tdIzmeni).append(tdObrisi);
					$('#adminTabela tbody').append(tr);
			 }
			
		 }
	 });
 });
 /*
  * Klikom na novo vozilo, otvaramo pop up sa formom za dodavanje
  * novog vozila
  * */
 $(document).on("click","#dodajNovoVozilo",function(e){
	 e.preventDefault();
	 $("#novoVozilo").show();
 
 });	


$('#formaDodavanjaVozila').submit(function(event){
	event.preventDefault();
	let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
	let marka = $('#markaVozilaKreiranje').val();
	let model = $("#modelVozilaKreiranje").val();
	let tip = $("#tipVozilaKreiranje").val();
	let godinaProizvodnje = $('#godinaProizvodnjeVoziloKreiranje').val();
	let registarskaOznaka = $('#registarskaOznakaVozilaKreiranje').val();
	let napomena = $('#napomenaVozilaKreiranje').val();
	
	
	
	
	if(marka==""){
		$('#errormarkaVozilaKreiranje').text('Polje marka ne sme biti prazno!');
		$('#errormarkaVozilaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(model==""){
		$('#modelVozilaKreiranje').text('Polje model ne sme biti prazno!');
		$('#modelVozilaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	if(tip==""){
		$('#errortipVozilaKreiranje').text('Polje tip ne sme biti prazno!');
		$('#errortipVozilaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(godinaProizvodnje==""){
		$('#errorgodinaProizvodnjeVoziloKreiranje').text('Polje godina proizvodnje ne sme biti prazno!');
		$('#errorgodinaProizvodnjeVoziloKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(godinaProizvodnje<0){
		$('#errorgodinaProizvodnjeVoziloKreiranje').text('Polje godina proizvodnje ne sme biti manje od nule!');
		$('#errorgodinaProizvodnjeVoziloKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(registarskaOznaka==""){
		$('#errorRegistarskaOznakaVozilaKreiranje').text('Polje registarska oznaka ne sme biti prazno!');
		$('#errorRegistarskaOznakaVozilaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(napomena==""){
		$('#errornapomenaVozilaKreiranje').text('Polje napomena ne sme biti prazno!');
		$('#errornapomenaVozilaKreiranje').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(greska==1)
		return;
	
	$.ajax({
		url: 'rest/vozila', //url
		type: "POST" ,
		data: JSON.stringify({marka:marka,model:model,tip:tip,registarskaOznaka:registarskaOznaka,godinaProizvodnje:godinaProizvodnje,napomena:napomena}),
		contentType: 'application/json',
		success : function(string) {
			if(string==""){
				//OSTALO JE OVDE DA URADIS
				$("#novoVozilo").hide();
				//sada brisemo sve iz forme sto smo pre uneli
				$('#markaVozilaKreiranje').val("");
				$("#modelVozilaKreiranje").val("");
				$("#tipVozilaKreiranje").val("");
				$('#godinaProizvodnjeVoziloKreiranje').val("");
				$('#registarskaOznakaVozilaKreiranje').val("");
				$('#napomenaVozilaKreiranje').val("");
				
				
				//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
				//da klikne kako bi se izmene refreshovale
				$("#adminTabela tbody tr").remove();
				$("#adminTabela thead tr").remove();

				//ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
				$("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

				
			}
			//ukoliko vec ima naziv u povratnom stringu ce se naglasiti
			if(string.includes("Registarska")){
				$('#errorRegistarskaOznakaVozilaKreiranje').text('Vozilo sa datom registarskom oznakom vec postoji!');
				$('#errorRegistarskaOznakaVozilaKreiranje').show().delay(9000).fadeOut();
			}
		}
	});
	
});

/*
 * FUNKCIJA KOJA OTVARA PROZOR IZMENE VOZILA
 * */
$(document).on("click",".izmeniVozilo",function(e){
	  e.preventDefault();
	  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'GET',
		  success: function(vozilo){
			  $("#izmenaVozila").show();
			  $("#markaVozilaIzmena").val(vozilo.marka);
			  $("#modelVozilaIzmena").val(vozilo.model);
			  $("#tipVozilaIzmena").val(vozilo.tip);
			  $("#registarskaOznakaVozilaIzmena").val(vozilo.registarskaOznaka);
			  $("#registarskaOznakaVozilaStara").val(vozilo.registarskaOznaka);
			  $("#godinaProizvodnjeVoziloIzmena").val(vozilo.godinaProizvodnje);
			  $("#napomenaVozilaIzmena").val(vozilo.napomena); 
		  }
	  });
	  
	  
});


/*
 * Funkcija koja vrsi konkretnu izmenu VOZILA
 * i aktivira se na klik submit forme izmene iz pop up prozora
 * */
$('#formaIzmenaVozila').submit(function(event){
	event.preventDefault();
	let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
	let marka = $('#markaVozilaIzmena').val();
	let model = $("#modelVozilaIzmena").val();
	let tip = $("#tipVozilaIzmena").val();
	let godinaProizvodnje = $('#godinaProizvodnjeVoziloIzmena').val();
	let registarskaOznaka = $('#registarskaOznakaVozilaIzmena').val();
	let staraRegistarskaOznaka = $('#registarskaOznakaVozilaStara').val();
	let napomena = $('#napomenaVozilaIzmena').val();
	
	
	
	
	if(marka==""){
		$('#errormarkaVozilaIzmena').text('Polje marka ne sme biti prazno!');
		$('#errormarkaVozilaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	if(model==""){
		$('#errormodelVozilaIzmena').text('Polje model ne sme biti prazno!');
		$('#errormodelVozilaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	if(tip==""){
		$('#errortipVozilaIzmena').text('Polje tip ne sme biti prazno!');
		$('#errortipVozilaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(godinaProizvodnje==""){
		$('#errorgodinaProizvodnjeVoziloIzmena').text('Polje godina proizvodnje ne sme biti prazno!');
		$('#errorgodinaProizvodnjeVoziloIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(godinaProizvodnje<0){
		$('#errorgodinaProizvodnjeVoziloIzmena').text('Polje godina proizvodnje ne sme biti manje od nule!');
		$('#errorgodinaProizvodnjeVoziloIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(registarskaOznaka==""){
		$('#errorRegistarskaOznakaIzmena').text('Polje registarska oznaka ne sme biti prazno!');
		$('#errorRegistarskaOznakaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(napomena==""){
		$('#errornapomenaVozilaIzmena').text('Polje napomena ne sme biti prazno!');
		$('#errornapomenaVozilaIzmena').show().delay(9000).fadeOut();
		greska=1;
	}
	
	if(greska==1)
		return;
	
	
	$.ajax({
		url: 'rest/vozila', //url
		type: "PUT" ,
		data: JSON.stringify({marka:marka,model:model,tip:tip,registarskaOznaka:registarskaOznaka,godinaProizvodnje:godinaProizvodnje,napomena:napomena,staraRegistarskaOznaka:staraRegistarskaOznaka}),
		contentType: 'application/json',
		success : function(string) {
			if(string==""){
				$("#izmenaVozila").hide();
				//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
				//da klikne kako bi se izmene refreshovale
				$("#adminTabela tbody tr").remove();
				$("#adminTabela thead tr").remove();

				 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
				 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

				
			}
			//ukoliko vec ima naziv u povratnom stringu ce se naglasiti
			if(string.includes("Registarska")){
				$('#errorRegistarskaOznakaIzmena').text('Vozilo sa datom registarskom tablicom vec postoji!');
				$('#errorRegistarskaOznakaIzmena').show().delay(9000).fadeOut();
			}
		}
	});
	
});

/* *
*			KLIK NA LOGICKO BRISANJE VOZILA
*		  * */
 $(document).on("click",".izbrisiVozilo",function(e){
	  e.preventDefault();
	  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'DELETE',
		  success: function(poruka){
			  if(poruka=="ok"){
				alert("Uspesno obrisano vozilo!");  
				  }
			  }
		  });
  
});	
	/* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /* VEZANO ZA KUPCA */
 /*
  * Fucnkija koja lista sve restorane nakon klika iz menija
  * restorani i njega podebljava
  * */
 $(document).on("click","#izlistajKupceAdmin",function(e){
	 e.preventDefault();
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajKupceAdmin").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	 
	//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//a takodje i restorana
		$("#pretragaRestoranaAdmin").hide();
	 
	 $.ajax({
		 url:'rest/kupac',
		 type: "GET",
		 success: function(kupci){
			 let tr=$('<tr></tr>');
			 
			 let trHead = $('<tr></tr>');
			 $("#adminTabela thead").append(trHead);
			 
			
			 for(let kupac of kupci){
				    tr=$('<tr></tr>');
				    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + kupac.korisnickoIme+  '\')"><p style=\"color: #765FAB; font-size: 20px;\" ><b>' +kupac.korisnickoIme
							+ '</b></p> <span class="popuptext" id="' + kupac.korisnickoIme
							+'"><b>Ime:</b> '+ kupac.ime +' </br><b>Prezime:</b> '+ kupac.prezime +' </br><b>Uloga:</b> '+ kupac.uloga + ' </br><b>Kontakt telefon:</b> '+ kupac.kontaktTelefon +
							' </br><b>email adresa:</b> '+ kupac.emailAdresa + '</br><b>Datum registracije:</b>'+ kupac.dan +'.'+kupac.mesec+ '.'+ kupac.godina + '.</span>'+
							' </div>');		
					let tdIzmeni = $('<td><a class="izmeniUloguKorisnika" href="/WebProjekat/rest/korisnik/dajMiKorisnika/'+kupac.korisnickoIme+'">Izmeni ulogu</a></td>');
					tr.append(tdNaziv).append(tdIzmeni);
					$('#adminTabela tbody').append(tr);
			 }
			
		 }
	 });
 });
 
 $(document).on("click",".izmeniUloguKorisnika",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'GET',
		  success: function(korisnik){
			  $("#izmenaUlogeKorisnika").show();
			  $("#ulogaKorisnika").val(korisnik.uloga);
			  $("#korisnickoImeKorisnikaZaUlogu").val(korisnik.korisnickoIme);
			 
		  }
	  });
	 
 });
 
 
 $('#formaIzmenaUlogeKorisnika').submit(function(event){
		event.preventDefault();
		let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
		let korisnickoIme = $('#korisnickoImeKorisnikaZaUlogu').val();
		let uloga = $('#ulogaKorisnika').val();
	
		if(uloga==""){
			$('#errorIzmenaUlogeKorisnika').text('Polje uloga ne sme biti prazno!');
			$('#errorIzmenaUlogeKorisnika').show().delay(9000).fadeOut();
			greska=1;
		}
		
		if(greska==1)
			return;
		
		
		$.ajax({
			url: 'rest/korisnik/promeniUlogu', //url
			type: "PUT" ,
			data: JSON.stringify({korisnickoIme:korisnickoIme,uloga:uloga}),
			contentType: 'application/json',
			success : function(povratnaVrednost) {
					$("#izmenaUlogeKorisnika").hide();
					//brisemo sve iz tabele i deselektujemo kolonu, kako bi korisnik opet morao
					//da klikne kako bi se izmene refreshovale
					$("#adminTabela tbody tr").remove();
					$("#adminTabela thead tr").remove();

					 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
					$("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

					
				
				
			}
		});
		
	});
 
 /*
  * PRIKAZ SPISKA ADMINISTRATORA I DOSTAVLAJCA
  * 
  * */
 /*
  * PRIKAZ SPISKA ADMINISTRATORA I DOSTAVLAJCA
  * 
  * */
 /*
  * PRIKAZ SPISKA ADMINISTRATORA I DOSTAVLAJCA
  * 
  * */
 /*
  * PRIKAZ SPISKA ADMINISTRATORA I DOSTAVLAJCA
  * 
  * */
 
 /*
  * IZLISTAJ DOSTAVLAJCE
  * */
 $(document).on("click","#izlistajDostavljaceAdmin",function(e){
	 e.preventDefault();
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajDostavljaceAdmin").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//a takodje i restorana
		$("#pretragaRestoranaAdmin").hide();
	 
	 $.ajax({
		 url:'rest/dostavljaci',
		 type: "GET",
		 success: function(dostavljaci){
			 let tr=$('<tr></tr>');
			 
			 let trHead = $('<tr></tr>');
			 
			 $("#adminTabela thead").append(trHead);
			 
			
			 for(let dostavljac of dostavljaci){
				    tr=$('<tr></tr>');
				    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + dostavljac.korisnickoIme+  '\')"><p style=\"color: #765FAB; font-size: 20px;\" ><b>' +dostavljac.korisnickoIme
							+ '</b></p> <span class="popuptext" id="' + dostavljac.korisnickoIme
							+'"><b>Ime:</b> '+ dostavljac.ime +' </br><b>Prezime:</b> '+ dostavljac.prezime +' </br><b>Uloga:</b> '+ dostavljac.uloga + ' </br><b>Kontakt telefon:</b> '+ dostavljac.kontaktTelefon +
							' </br><b>email adresa:</b> '+ dostavljac.emailAdresa + '</br><b>Datum registracije:</b>'+ dostavljac.dan +'.'+dostavljac.mesec+ '.'+ dostavljac.godina + '.</span>'+
							' </div>');		
					let tdIzmeni = $('<td><a class="izmeniUloguKorisnika" href="/WebProjekat/rest/korisnik/dajMiKorisnika/'+dostavljac.korisnickoIme+'">Izmeni ulogu</a></td>');
					tr.append(tdNaziv).append(tdIzmeni);
					$('#adminTabela tbody').append(tr);
			 }
			
		 }
	 });
 });
 
 /*
  * IZLISTAJ ADMINISTRATORE
  * */
 $(document).on("click","#izlistajAdmineAdmin",function(e){
	 e.preventDefault();
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajAdmineAdmin").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	 
	//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//a takodje i restorana
		$("#pretragaRestoranaAdmin").hide();
	 
	 $.ajax({
		 url:'rest/administrator',
		 type: "GET",
		 success: function(admini){
			 let tr=$('<tr></tr>');
			 
			 let trHead = $('<tr></tr>');
			 
			 $("#adminTabela thead").append(trHead);
			 
			
			 for(let admin of admini){
				    tr=$('<tr></tr>');
				    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + admin.korisnickoIme+  '\')"><p style=\"color: #765FAB; font-size: 20px;\" ><b>' +admin.korisnickoIme
							+ '</b></p> <span class="popuptext" id="' + admin.korisnickoIme
							+'"><b>Ime:</b> '+ admin.ime +' </br><b>Prezime:</b> '+ admin.prezime +' </br><b>Uloga:</b> '+ admin.uloga + ' </br><b>Kontakt telefon:</b> '+ admin.kontaktTelefon +
							' </br><b>email adresa:</b> '+ admin.emailAdresa + '</br><b>Datum registracije:</b>'+ admin.dan +'.'+admin.mesec+ '.'+ admin.godina + '.</span>'+
							' </div>');		
					let tdIzmeni = $('<td><a class="izmeniUloguKorisnika" href="/WebProjekat/rest/korisnik/dajMiKorisnika/'+admin.korisnickoIme+'">Izmeni ulogu</a></td>');
					tr.append(tdNaziv).append(tdIzmeni);
					$('#adminTabela tbody').append(tr);
			 }
			
		 }
	 });
 });
 
 /*
  * PORUDZBINE PORUDZBINE PORUDZBINE
  * */
 /*
  * PORUDZBINE PORUDZBINE PORUDZBINE
  * */
 /*
  * PORUDZBINE PORUDZBINE PORUDZBINE
  * */
 /*
  * PORUDZBINE PORUDZBINE PORUDZBINE
  * */
 /*
  * PORUDZBINE PORUDZBINE PORUDZBINE
  * */
 
 /* IZLISTAJ PORUDZBINE*/
 
 $(document).on("click","#izlistajPorudzbine",function(e){
	 e.preventDefault();
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajPorudzbine").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	 
	//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//a takodje i restorana
		$("#pretragaRestoranaAdmin").hide();
	 
	 $.ajax({
		 url:'rest/porudzbina',
		 type: "GET",
		 success: function(porudzbine){
			 let tr=$('<tr></tr>');
			 
			 let trHead = $('<tr></tr>');
			 let tdHead= $('<td><a id="dodajNovuPorudzbinu" style="color: #50AE94" href="#">Dodaj novu porudzbinu</a></td>');
			 trHead.append(tdHead);
			 $("#adminTabela thead").append(trHead);
			 
			 var brojac=0;//cisto da bi smo pisali "Porudzbina1"
			 for(let porudzbina of porudzbine){
				    tr=$('<tr></tr>');
				    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + brojac+  '\')"><p  style=\"color: #765FAB; font-size: 20px;\" ><b id="izlistajPorudzbineAdminGlavnaLista'+brojac+'"> Porudzbina ' +(brojac+1)
							+ '</br>'+ porudzbina.ukupnaCena +' din</b></p> <span class="popuptext" id="' + brojac
							+'"><b>Status porudzbine:</b> <i id="spanPorudzbinaStatusPorudzbine'+brojac+'">'+ porudzbina.statusPorudzbine +'</i> </br><b>Napomena:</b> '+ porudzbina.napomena +' </br><b>Cena:</b> <i id="spanPorudzbinaUkupnaCena'+brojac+'">'+ porudzbina.ukupnaCena + '</i> din</br><b>Kupac:</b> <i id="spanPorudzbinaKupac'+brojac+'">'+ porudzbina.kupacKojiNarucuje.korisnickoIme +
							'</i> </br><b>Dostavljac:</b> </br><b>Datum porudzbine:</b>'+ porudzbina.dan +'.'+porudzbina.mesec+ '.'+ porudzbina.godina + '.</span>'+
							' </div>');		
				    /*+ porudzbina.dostavljac.korisnickoIme + */
					let tdIzmeni = $('<td><a class="izmeniPorudzbinu" href="/WebProjekat/rest/porudzbina/'+brojac+'">Izmeni porudzbinu</a></td>');
					let tdObrisi=$('<td><a class="izbrisiPorudzbinu" style="color:red" href="/WebProjekat/rest/porudzbina/'+brojac+'">Obrisi</a></td>');

					tr.append(tdNaziv).append(tdIzmeni).append(tdObrisi);
					$('#adminTabela tbody').append(tr);
					brojac=brojac+1;
			 }
			
		 }
	 });
 });
 
 
 /*
  * PRIKAZI PROZOR IZMENE PORUDZBINE
  * */
 $(document).on("click",".izmeniPorudzbinu",function(e){

	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	  let url= $(kliknutiElement).attr('href');
	  $.ajax({
		  url : url,
		  type: 'GET',
		  success: function(porudzbina){

				for(let artikal of porudzbina.artikli){
					let artikalID = artikal.naziv+artikal.restoran;
					artikalID = artikalID.replace(' ','');
					
					let tr = $('<tr></tr>');
					let tdObrisi = $('<td><a class="obrisiArtikalPorudzbinaAdmin" href="/WebProjekat/rest/porudzbina/ukloniArtikalPorudzbina/'+porudzbina.id+artikal.naziv+ artikal.restoran+'">x</a></td>');
					let tdNaziv= $('<td>'+artikal.naziv+'</td>');
					let tdSmanjiBroj = $('<td><a class="smanjiBrojArtikalaUPorudzbiniAdmin"  href="/WebProjekat/rest/porudzbina/smanjiBrojArtikala/'+porudzbina.id+artikal.naziv+ artikal.restoran+'">-</a></td>');
					let tdKolicina = $('<td id="brojArtikalaPorudzbina'+ porudzbina.id+artikalID +'">'+ artikal.brojArtikala+'</td>');
					let tdPovecajBroj = $('<td><a class="povecajBrojArtikalaUPorudzbiniAdmin"  href="/WebProjekat/rest/porudzbina/povecajBrojArtikala/'+porudzbina.id+artikal.naziv+ artikal.restoran+'">+</a></td>');
					let tdCena = $('<td>'+artikal.jedinicnaCena+'</td>');
					tr.append(tdObrisi).append(tdNaziv).append(tdSmanjiBroj).append(tdKolicina).append(tdPovecajBroj).append(tdCena);
					$("#podaciOPorudzbini tbody").append(tr);
					
				}
				//ukupna cena
				let tr1=$('<tr></tr>');
				let tdKraj=$('<td ><b>Ukupna cena:</b></td><td></td><td></td><td></td><td></td><td><b id="ukupnaCenaPorudzbineAdmin'+porudzbina.id+'">'+porudzbina.ukupnaCena+'</b></td>')
				tr1.append(tdKraj);
				
				//izmena kupca
				let trKupac = $('<tr></tr>');
				let tdKupac = $('<td><b>Kupac:</b></td><td id="nalogKupcaPorudzbine'+porudzbina.id+'"> '+porudzbina.kupacKojiNarucuje.korisnickoIme+'</td>');
				let tdIzmeniKupac = $('<td></td><td></td><td><a class="izmeniKupcaPorudzbineAdmin" href="/WebProjekat/rest/porudzbina/izmeniKupcaPorudzbine/'+porudzbina.id+'">Izmeni kupca</a></td>');
				trKupac.append(tdKupac).append(tdIzmeniKupac);
				
				//izmena dostavljaca
				let trDostavljac = $('<tr></tr>');
				let dostavljac="";
				//ukoliko ima dostavljaca, ispisi ga
				if(porudzbina.dostavljac!=null)
					dostavljac=porudzbina.dostavljac.korisnickoIme;
				let tdDostavljac = $('<td><b>Dostavljac:</b></td><td id="nalogDostavljacaPorudzbine'+porudzbina.id+'">'+dostavljac+' </td>');
				let tdIzmeniDostavljac = $('<td></td><td></td><td><a class="izmeniDostavljacaPorudzbineAdmin" href="/WebProjekat/rest/porudzbina/izmeniDostavljacaPorudzbine/'+porudzbina.id+'">Izmeni dostavljaca</a></td>');
				trDostavljac.append(tdDostavljac).append(tdIzmeniDostavljac);
				
				$("#podaciOPorudzbini tbody").append(tr1).append(trKupac).append(trDostavljac);
				
				$("#izmenaPorudzbineAdmin").show();
				
				//OVDE STAVLJAMO ID U POLJE IZMENE STATUSA PORUDZBINE
				//STO CEMO KIRSTITI PRI IZMENI STATUSA
				$("#statusPorudzbineLink").val(porudzbina.id);
			 
		  }
	  });
	 
  
 });
 /*
  * prilikom gasenja prozora izmene porudzbine mi mormao da ocistimo tabelu
  * */
 $(document).on("click","#izgasiIzmenuPorudzbine",function(e){
	 e.preventDefault();
	 $("#podaciOPorudzbini tbody tr").remove();
	 $("#izmenaPorudzbineAdmin").hide();
 });
 
 /*
  * Funkcija koja se poziva u slucaju da mi hocemo da smanjimo broj artikala
  * */
 $(document).on("click",".smanjiBrojArtikalaUPorudzbiniAdmin",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href');
	 let idPorudzbine = url.charAt(48);
	 let idArtikla = url.substring(49,url.length);
	 idArtikla = idArtikla.replace(' ','');
	 var link='#brojArtikalaPorudzbina'+ idPorudzbine + idArtikla;
	 var vrednostTrenutna = $(link).text();
	 if(vrednostTrenutna==1){
		 alert("Ne mozes vise smanjivati kolicinu!");
		 return;
		 
	 }
	 
	 $.ajax({
			url: url, //url
			type: "GET" ,
			success : function(idPorudzbine) {
				var idPorudzbine1 = idPorudzbine.replace(' ','');
				var link='#brojArtikalaPorudzbina'+ idPorudzbine1;
				var Vrednost = $(link).text();
				Vrednost = Vrednost - 1;
				$('#brojArtikalaPorudzbina'+ idPorudzbine1+'').text(Vrednost);
				//treba nam porudzbina
				var linkZaPreuzimanjePorudzbine='rest/porudzbina/'+ idPorudzbine[0];
				$.ajax({
					url: linkZaPreuzimanjePorudzbine,
					type: "GET",
					success: function(porudzbina){
						$('#ukupnaCenaPorudzbineAdmin'+idPorudzbine[0]).text(porudzbina.ukupnaCena);
						$('#izlistajPorudzbineAdminGlavnaLista'+idPorudzbine[0]).html('<b>Porudzbina ' +(idPorudzbine[0]+1)
								+ '</br>'+ porudzbina.ukupnaCena +' din</b>');
					}
				});
				
			}
	 }); 
	 
 });
 
 
 
 /*
  * Funkcija koja se poziva u slucaju da mi hocemo da smanjimo broj artikala
  * */
 $(document).on("click",".povecajBrojArtikalaUPorudzbiniAdmin",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href'); 
	 $.ajax({
			url: url, //url
			type: "GET" ,
			success : function(idPorudzbine) {
				var idPorudzbine1 = idPorudzbine.replace(' ','');
				var link='#brojArtikalaPorudzbina'+ idPorudzbine1;
				
				var Vrednost = $(link).text();
				Vrednost++;
				$('#brojArtikalaPorudzbina'+ idPorudzbine1+'').text(Vrednost);
				//treba nam porudzbina
				var linkZaPreuzimanjePorudzbine='rest/porudzbina/'+ idPorudzbine[0];
				$.ajax({
					url: linkZaPreuzimanjePorudzbine,
					type: "GET",
					success: function(porudzbina){
						$('#ukupnaCenaPorudzbineAdmin'+idPorudzbine[0]).text(porudzbina.ukupnaCena);
						$('#izlistajPorudzbineAdminGlavnaLista'+idPorudzbine[0]).html('<b>Porudzbina ' +(idPorudzbine[0]+1)
								+ '</br>'+ porudzbina.ukupnaCena +' din</b>');
					}
				});
				
			}
	 }); 
	 
 });
 
 /*
  * Brise artikal iz porudzbine od strane administratora prilikom izmene artikla!
  * */
 $(document).on("click",".obrisiArtikalPorudzbinaAdmin",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href'); 
	 $.ajax({
			url: url, //url
			type: "DELETE" ,
			success : function(idPorudzbine) {
				//treba nam porudzbina
				var linkZaPreuzimanjePorudzbine='rest/porudzbina/'+ idPorudzbine;
				$.ajax({
					url: linkZaPreuzimanjePorudzbine,
					type: "GET",
					success: function(porudzbina){
						$(kliknutiElement).parent().parent().remove();
						$('#ukupnaCenaPorudzbineAdmin'+idPorudzbine).text(porudzbina.ukupnaCena);
						$('#izlistajPorudzbineAdminGlavnaLista'+idPorudzbine).html('<b>Porudzbina ' +(idPorudzbine+1)
								+ '</br>'+ porudzbina.ukupnaCena +' din</b>');
						$('#spanPorudzbinaUkupnaCena'+idPorudzbine).html(porudzbina.ukupnaCena);
					}
				});
				
			}
	 }); 
 });
 
 /*
  * Menja kupca porudzbine
  * */
 $(document).on("click",".izmeniKupcaPorudzbineAdmin",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href'); 
	
	 $.ajax({
			url: 'rest/kupac', //url
			type: "GET" ,
			success : function(kupci) {
				if(kupci.length>0){
					for(let kupac of kupci){
						let option = $('<option value="'+kupac.korisnickoIme+'">'+kupac.korisnickoIme+'</option>');
						$('#kupacPorudzbineIzmena').append(option);
					}
				}
				$('#kupacPorudzbineLink').val(url);
				$('#promeniKupcaPorudzbine').show();
			}
	 }); 
	 
 });
 /*
  * Funkcija koja se aktivira prilikom promene kupca neke porudzbine
  * */
 $('#promeniKupcaPorudzbine2').submit(function(event){
	 event.preventDefault();
	 var url = $('#kupacPorudzbineLink').val();
	 var kupacKorisnickoIme = $('#kupacPorudzbineIzmena').val();
	 //"/WebProjekat/rest/porudzbina/izmeniKupcaPorudzbine/'+porudzbina.id+'"
	 $.ajax({
		    url: url, //url
			type: "PUT" ,
			data: JSON.stringify({korisnickoIme : kupacKorisnickoIme,lozinka:'',ime:'',prezime:'',uloga:'',kontaktTelefon:'',emailAdresa:''}),
			contentType: 'application/json',
			success : function(porudzbina) {
				//brisemo sve iz liste kupaca sa prozora forme gde je kliknuto
				$('#kupacPorudzbineIzmena option').remove();
				$('#promeniKupcaPorudzbine').hide();
				$('#nalogKupcaPorudzbine'+porudzbina.id).text(porudzbina.kupacKojiNarucuje.korisnickoIme);
				
				
			}
	 }); 
	  
 });

 
 
 
 
 /*
  * Menja DOSTAVLJACA porudzbine
  * */
 $(document).on("click",".izmeniDostavljacaPorudzbineAdmin",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href'); 
	
	 $.ajax({
			url: 'rest/dostavljaci', //url
			type: "GET" ,
			success : function(dostavljaci) {
				if(dostavljaci.length>0){
					for(let dostavljac of dostavljaci){
						let option = $('<option value="'+dostavljac.korisnickoIme+'">'+dostavljac.korisnickoIme+'</option>');
						$('#dostavljacPorudzbineIzmena').append(option);
					}
				}
				$('#dostavljacPorudzbineLink').val(url);
				$('#promeniDostavljacaPorudzbine').show();
			}
	 }); 
	 
 });
 
 
 /*
  * Funkcija koja se aktivira prilikom promene DOSTAVLJACA neke porudzbine
  * */
 $('#promeniDostavljacaPorudzbine2').submit(function(event){
	 event.preventDefault();
	 var url = $('#dostavljacPorudzbineLink').val();
	 var dostavljacKorisnickoIme = $('#dostavljacPorudzbineIzmena').val();
	 //"/WebProjekat/rest/porudzbina/izmeniKupcaPorudzbine/'+porudzbina.id+'"
	 $.ajax({
		    url: url, //url
			type: "PUT" ,
			data: JSON.stringify({korisnickoIme : dostavljacKorisnickoIme,lozinka:'',ime:'',prezime:'',uloga:'',kontaktTelefon:'',emailAdresa:''}),
			contentType: 'application/json',
			success : function(porudzbina) {
				//brisemo sve iz liste kupaca sa prozora forme gde je kliknuto
				$('#dostavljacPorudzbineIzmena option').remove();
				$('#promeniDostavljacaPorudzbine').hide();
				//za dostavljaca
				$('#nalogDostavljacaPorudzbine'+porudzbina.id).text(porudzbina.dostavljac.korisnickoIme);
				
				
			}
	 }); 
	  
 });
 
 
 /*
  * Funckija koja se aktivira na klik za dodavanje nove porudzbine i to 
  * rezultuje otvaranjem prozora za novu porudzbinu
  * */
 $(document).on("click","#dodajNovuPorudzbinu",function(e){
	 e.preventDefault();
	 //listamo sve artikle koji mogu da se dodaju u porudzbinu
	 $.ajax({
			url: 'rest/artikli', //url
			type: "GET" ,
			success : function(artikli) {
				if(artikli.length>0){
					for(let artikal of artikli){
						let option = $('<option value="'+artikal.naziv+artikal.restoran+'">'+artikal.naziv+'( '+ artikal.restoran+' )</option>');
						$('#artikalPorudzbineNovaPorudzbina').append(option);
					}
				}
			}
	 });
	 
	 //trebaju nam kupci prvo da izlistamo u select formu
	 $.ajax({
			url: 'rest/kupac', //url
			type: "GET" ,
			success : function(kupci) {
				if(kupci.length>0){
					for(let kupac of kupci){
						let option = $('<option value="'+kupac.korisnickoIme+'">'+kupac.korisnickoIme+'</option>');
						$('#kupacPorudzbineNovaPorudzbina').append(option);
					}
				}
			}
	 }); 
	 
	 //trebaju nam dostavljaci da izlistamo u select formu
	 $.ajax({
			url: 'rest/dostavljaci', //url
			type: "GET" ,
			success : function(dostavljaci) {
				if(dostavljaci.length>0){
					for(let dostavljac of dostavljaci){
						let option = $('<option value="'+dostavljac.korisnickoIme+'">'+dostavljac.korisnickoIme+'</option>');
						$('#dostavljacPorudzbineNovaPorudzbina').append(option);
					}
				}
				
			}
	 }); 
	 
	 
	 $('#dodajNovuPorudzbinuAdmin').show();
 });
 
 
 /*
  * Funkcija koja se aktivira prilikom klika na link dodaj Artikal 
  * pored selection forme aritkala i ako nema artikala vraca nas nazad
  * , dok ako ima dodaje je u tabelu asvih artikala porudzbine
  * */
$(document).on("click","#dodavanjeArtiklaPorudzbiniAdmin",function(e){
	e.preventDefault();
	var artikal = $("#artikalPorudzbineNovaPorudzbina").val();
	if(artikal==""){
		alert("Polje za artikal je prazno!");
		return;
	}
	
	$.ajax({
		url: 'rest/porudzbina/dodajArtikalUPorudzbinuAdmin/'+artikal, //url
		type: "GET" ,
		success : function(artikal) {
			//sada cemo ubaciti ovaj artikal u tabelu
			let artikalID = artikal.naziv+artikal.restoran;
			artikalID = artikalID.replace(' ','');
			
			let tr = $('<tr></tr>');
			let tdObrisi = $('<td><a class="obrisiArtikalPorudzbinaKreiranjeAdmin" href="/WebProjekat/rest/porudzbina/ukloniArtikalPorudzbinaKreiranjeAdmin/'+artikal.naziv+ artikal.restoran+'">x</a></td>');
			let tdNaziv= $('<td>'+artikal.naziv+'</td>');
			let tdKolicina = $('<td ></td>');
			let tdCena = $('<td>'+artikal.jedinicnaCena+'</td>');
			tr.append(tdObrisi).append(tdNaziv).append(tdKolicina).append(tdCena);
			$("#podaciOPorudzbiniNovaPorudzbina tbody").append(tr);
		}
 }); 
	
	
});

/*
 * Brise artikal iz poruzbine koju trenutno kreira admin
 * */
$(document).on("click",".obrisiArtikalPorudzbinaKreiranjeAdmin",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href'); 
	
	 $.ajax({
			url: url, //url
			type: "GET" ,
			success : function(povratnaVrednost) {
				$(kliknutiElement).parent().parent().remove();

			}
	 }); 
	 

	
});
 

/*
 * Funkcija koja se aktivira prilikom narucivanja porudzbine koja je
 * formirana od strane administratora
 * 
 * */
$('#dodajNovuPorudzbinuAdmin2').submit(function(event){
	event.preventDefault();
	var napomena = $('#napomenaNovePorudzbineAdmin').val();
	var kupacID = $('#kupacPorudzbineNovaPorudzbina').val();
	var dostavljacID = $('#dostavljacPorudzbineNovaPorudzbina').val();
	
	if(kupacID==""){
		alert("Moras postaviti kupca porudzbine!");
		return;
	}
	
	//saljemo podatke
	 $.ajax({
		    url: 'rest/porudzbina/napraviPorudzbinuAdmin', //url
			type: "PUT" ,
			data: JSON.stringify({korisnickoIme : kupacID,lozinka:dostavljacID,ime:napomena,prezime:'',uloga:'',kontaktTelefon:'',emailAdresa:''}),
			contentType: 'application/json',
			success : function(string) {
				if(string=="nemaArtikle"){
					alert("Nemas artikle!");
					return;
				}else{
					$('#dodajNovuPorudzbinuAdmin').hide();
					$('#podaciOPorudzbiniNovaPorudzbina tbody tr').remove();
					$('#artikalPorudzbineNovaPorudzbina option').remove();
					$('#kupacPorudzbineNovaPorudzbina option').remove();
					$('#dostavljacPorudzbineNovaPorudzbina option').remove();
				}
			}
	 }); 
	
});

//kada ugasimo prozor nove porudzbine u admin rezimu samo da obrise liste korisnika i dostavljaca
$(document).on("click","#izgasiProzorNovePorudzbineAdmin",function(e){
	$('#dodajNovuPorudzbinuAdmin').hide();
	$('#kupacPorudzbineNovaPorudzbina option').remove();
	$('#artikalPorudzbineNovaPorudzbina option').remove();
	$('#dostavljacPorudzbineNovaPorudzbina option').remove();

});

//brise porudzbinu od strane administratora
$(document).on("click",".izbrisiPorudzbinu",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href'); 
	 $.ajax({
			url: url, //url
			type: "DELETE" ,
			success : function(povratnaVrednost) {
				alert("Porudzbina uspesno obrisana!");
				$(kliknutiElement).parent().parent().remove();

			}
	 }); 
	 
	 
});

//LOGOUT ADMINA
$(document).on("click","#izlogujAdministratora",function(e){
	e.preventDefault();
	
	//sada otkrivamo ono sto treba neregistrovani korisnik da vidi
	//a sakrivamo ono sto je admin video
	$('#navigacijaPreciceNeregistrovaniKorisnik').show();
	$("[class*='administratorUlogovan']").addClass('administratorNijeUlogovan');
	$("[class*='sakriOdAdministratora']").show();
	$("#adminTabela tbody tr").remove(); //brisemo sve iz spiska od admina
    $("#adminTabela thead tr").remove();
    
  //SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
	$("#pretragaArtiklaAdministrator").hide();
	//a takodje i restorana
	$("#pretragaRestoranaAdmin").hide();
});


/*
 * MENJANJE STATUSA PORUDZBINE ADMIN
 * */
$(document).on("click","#izmeniStatusPorudzbineAdmin",function(e){
	e.preventDefault();
	$("#promeniStatusPorudzbine").show();
	//statusPorudzbineLink ima link porudzbine tako da ne moramo da brinemo za kasnije
});

/*
 * Konkretno menjanje statusa, gore je bilo samo otvaranje prozora
 * */
$('#promeniStatusPorudzbine2').submit(function(event){
	event.preventDefault();
	var indexPorudzbine = $("#statusPorudzbineLink").val();
	var statusPorudzbine=$("#statusPorudzbineIzmena").val();
	
	$.ajax({
		url: 'rest/porudzbina/menjajStatus/'+indexPorudzbine+statusPorudzbine, //url
		type: "GET" ,
		success : function(povratnaVrednost) {
			$("#promeniStatusPorudzbine").hide();
			

		}
	});
});


 
 function iskociPopUP(ime) {
		var popup = document.getElementById(ime);
	    popup.classList.toggle("show");
	}
 
 function izlistajArtikleAdmin(artikli){

		//ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
		 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
		 //i stavljamo je na nas trenutni red
		 $("#izlistajArtikleAdmin").addClass('selektovanaTabelaAdmin');
		 //brisemo sve stavke koje su se pre nalazile u toj tabli
		 $('#adminTabela thead tr').remove();
		 $('#adminTabela tbody tr').remove();
		 
		 //otkrivamo formu trazenja artikala!
		 $('#pretragaArtiklaAdministrator').show();
	     //sakrivamo formu za restorane, u slucaju da je bilo otvoreno
		 $("#pretragaRestoranaAdmin").hide();
		
		 let tr=$('<tr></tr>');
		 
		 //ovde ubacujemo link za dodavanje novog artikla na vrh tabele
		 let trHead = $('<tr></tr>');
		 let tdHead= $('<td><a id="dodajNoviArtikalLink" style="color: #50AE94" href="/WebProjekat/rest/artikli/dodajNovi/">Dodaj novi Artikal</a></td>');
		 
		 trHead.append(tdHead);
		 $("#adminTabela thead").append(trHead);
		 
		 
		 for(let artikal of artikli){
			    tr=$('<tr></tr>');

			/*
			 * prvo cemo vrsiti proveru da li je artikal pice ili hrana, kako bi mogli da namestimo adekvatnu kolicinsku meru
			 * i boju teksta u prikazu
			 * */
			    let kolicinskaMera;
				let bojaNaziva;
				if(artikal.tip == "jelo"){
					kolicinskaMera= "gr";
					bojaNaziva="style=\"color: #A05623; font-size: 20px;\"";
					
					
				}else{
					kolicinskaMera="ml";
					bojaNaziva="style=\"color: #2376A0; font-size: 20px;\"";
				}
				let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + artikal.naziv + artikal.restoran +  '2\')"><p '+bojaNaziva+' ><b>' + artikal.naziv
						+ '</b></p> <span class="popuptext" id="'+ artikal.naziv + artikal.restoran
						+'2"><b>Naziv:</b> '+ artikal.naziv +' </br><b>Cena:</b> '+ artikal.jedinicnaCena +' din</br><b>Opis:</b> '+ artikal.opis +' </br><b>Kolicina:</b> '+
						artikal.kolicina + ' ' + kolicinskaMera +' </br><b>Restoran:</b> '+ artikal.restoran +'</span> </div></td>');
				
				let tdIzmeni = $('<td><a class="izmeniArtikal" href="/WebProjekat/rest/artikli/dajArtikal/'+artikal.naziv+artikal.restoran+'">Izmeni</a></td>');
				let tdObrisi=$('<td><a class="izbrisiArtikal" style="color:red" href="/WebProjekat/rest/artikli/'+artikal.naziv+artikal.restoran+'">Obrisi</a></td>');
				tr.append(tdNaziv).append(tdIzmeni).append(tdObrisi);
				$('#adminTabela tbody').append(tr);
		 }
	 
 }
 
 function izlistajRestoraneAdmin(restorani){

		//ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
		 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
		 //i stavljamo je na nas trenutni red
		 $("#izlistajRestoraneAdmin").addClass('selektovanaTabelaAdmin');
		 //brisemo sve stavke koje su se pre nalazile u toj tabli
		 $('#adminTabela thead tr').remove();
		 $('#adminTabela tbody tr').remove();
		 
		//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//otkrivamo formu za trazenje restorana
		$("#pretragaRestoranaAdmin").show();
		 
		 let tr=$('<tr></tr>');
		 
		 //ovde ubacujemo link za dodavanje novog artikla na vrh tabele
		 let trHead = $('<tr></tr>');
		 let tdHead= $('<td><a id="dodajNoviRestoran" style="color: #50AE94" href="#">Dodaj novi restoran</a></td>');
		 trHead.append(tdHead);
		 $("#adminTabela thead").append(trHead);
		 
		 
		 for(let restoran of restorani){
			    tr=$('<tr></tr>');
			    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + restoran.naziv +  '\')"><p style=\"color: #765FAB; font-size: 20px;\" ><b>' + restoran.naziv
						+ '</b></p> <span class="popuptext" id="' + restoran.naziv 
						+'"><b>Naziv:</b> '+ restoran.naziv +' </br><b>Adresa:</b> '+ restoran.adresa +' </br><b>Kategorija:</b> '+ restoran.kategorija +'</span>'+
						' </div>');		
				let tdIzmeni = $('<td><a class="izmeniRestoran" href="/WebProjekat/rest/restorani/jedanRestoran/'+restoran.naziv+'">Izmeni</a></td>');
				let tdObrisi=$('<td><a class="izbrisiRestoran" style="color:red" href="/WebProjekat/rest/restorani/'+restoran.naziv+'">Obrisi</a></td>');
				tr.append(tdNaziv).append(tdIzmeni).append(tdObrisi);
				$('#adminTabela tbody').append(tr);
		 }
	 
 }
	
});