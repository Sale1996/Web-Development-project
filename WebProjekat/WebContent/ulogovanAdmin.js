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
			let trDatumRegistracije=$('<tr><td><b>Datum registracije:</b></td><td>'+ admin.datum +' </td></tr>');
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
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajArtikleAdmin").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	 
	 $.ajax({
		 url:'rest/artikli',
		 type: "GET",
		 success: function(artikli){
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
	 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
	 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');
	 //i stavljamo je na nas trenutni red
	 $("#izlistajRestoraneAdmin").addClass('selektovanaTabelaAdmin');
	 //brisemo sve stavke koje su se pre nalazile u toj tabli
	 $('#adminTabela thead tr').remove();
	 $('#adminTabela tbody tr').remove();
	 
	 $.ajax({
		 url:'rest/restorani',
		 type: "GET",
		 success: function(restorani){
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
	
 function iskociPopUP(ime) {
		var popup = document.getElementById(ime);
	    popup.classList.toggle("show");
	}
	
});