$(document).ready(function() {
	
/*
 * Ukoliko smo kliknuli na link dodaj/izmeni novo vozilo
 * iskace nam prozor sa izborom
 * jednog od slobodnih vozila
 * */	
	
$(document).on("click","#izmeniDodajVoziloDostavlajc",function(e){
	e.preventDefault();
	$.ajax({
		url: 'rest/vozila',
		type:"GET",
		success: function(vozila) {
			for(let vozilo of vozila){
				if(vozilo.daLiJeUUpotrebi==false){
					let option= $('<option value="'+vozilo.registarskaOznaka+'">'+vozilo.registarskaOznaka+' ( '+vozilo.marka +' '+vozilo.model+') </option>');
					$("#slobodnaVozila").append(option);
				}
			}
			
			$("#dodajPromeniVoziloDostavljacu").show();
		}
		
	});
});


/*
 * Funkcija koja ce da dodeli izabrano vozilo dostavljacu!
 * */
$('#dodajPromeniVoziloDostavljacu2').submit(function(event){
	 event.preventDefault();
	 var voziloRegistarskaOznaka = $('#slobodnaVozila').val();
	 $.ajax({
		    url: 'rest/dostavljaci/postaviVozilo/'+voziloRegistarskaOznaka, //url
			type: "GET" ,
			success : function(vozilo) {

				//gasimo prozor 
				//ispisujemo vozilo na pocetnu stranicu
				$("#dodajPromeniVoziloDostavljacu").hide();
				$("#voziloDostavlajca").text(vozilo.registarskaOznaka+' ( '+vozilo.marka +' '+vozilo.model+')');
				
				
			}
	 }); 
	  
});

/*
 * Funckija koja se aktivira ukoliko hocemo da promenimo
 * porudzbinu u stanje "U toku"
 * */
$(document).on("click",".statusPorudzbine",function(e){
	 e.preventDefault();
	 var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	 let url= $(kliknutiElement).attr('href');
	 $.ajax({
		 url: url,
		 type: "GET" ,
		 success : function(porudzbina) {
		 //ref="/WebProjekat/rest/porudzbina/uTokuPorudzbina/'+brojac+'">Promeni u toku</a></td>');
			if(porudzbina.statusPorudzbine=="u toku"){
			 $("#LinkIzmenaStatusaPorudzbine"+porudzbina.id).html('<a class="statusPorudzbine" href="/WebProjekat/rest/porudzbina/menjajStatus/'+porudzbina.id+'dostavljeno">Promeni u dostavljeno</a>');	
			 $("#promeniStatusPorudzbine"+porudzbina.id).html(porudzbina.statusPorudzbine);
			 
			}else if(porudzbina.statusPorudzbine=="dostavljeno"){
			 $("#LinkIzmenaStatusaPorudzbine"+porudzbina.id).html('');	
			 $("#otkaziPorudzbinuLink"+porudzbina.id).html('');	

			 $("#promeniStatusPorudzbine"+porudzbina.id).html(porudzbina.statusPorudzbine);
			 
				 	
			}else if(porudzbina.statusPorudzbine=="otkazano"){
			 $("#LinkIzmenaStatusaPorudzbine"+porudzbina.id).html('');	
			 $("#otkaziPorudzbinuLink"+porudzbina.id).html('');	

			 $("#promeniStatusPorudzbine"+porudzbina.id).html(porudzbina.statusPorudzbine);
						
			}
		 }
	 });
	 
});

/*
 * Funkcija koja se aktivira prilikom klika na link PREUZMI PORUDZBINU
 * */
$(document).on("click",".preuzmiPorudzbinu",function(e){
	e.preventDefault();
	var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
	let url= $(kliknutiElement).attr('href');
	$.ajax({
		 url: url,
		 type: "GET" ,
		 success : function(porudzbina) {
			 	if(porudzbina!=null){
					$(kliknutiElement).parent().parent().remove();
				    tr=$('<tr></tr>');
				    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + porudzbina.id+  '\')"><p  style=\"color: #765FAB; font-size: 20px;\" ><b id="izlistajPorudzbineAdminGlavnaLista'+porudzbina.id+'"> Porudzbina ' +(porudzbina.id+1)
							+ '</br>'+ porudzbina.ukupnaCena +' din</b></p> <span class="popuptext" id="' + porudzbina.id
							+'"><b>Status porudzbine:</b> <i id="spanPorudzbinaStatusPorudzbine'+porudzbina.id+'">'+ porudzbina.statusPorudzbine +'</i> </br><b>Napomena:</b> '+ porudzbina.napomena +' </br><b>Cena:</b> <i id="spanPorudzbinaUkupnaCena'+porudzbina.id+'">'+ porudzbina.ukupnaCena + '</i> din</br><b>Kupac:</b> <i id="spanPorudzbinaKupac'+porudzbina.id+'">'+ porudzbina.kupacKojiNarucuje.korisnickoIme +
							'</i> </br><b>Dostavljac:'+porudzbina.dostavljac.korisnickoIme+'</b> </br></span>'+
							' </div>');	
				    let tdIzmeni = $('<td id="LinkIzmenaStatusaPorudzbine'+porudzbina.id+'" ><a class="statusPorudzbine" href="/WebProjekat/rest/porudzbina/menjajStatus/'+porudzbina.id+'uToku">Promeni u toku</a></td>');
				    let tdStatus = $('<td id="promeniStatusPorudzbine'+porudzbina.id+'">'+porudzbina.statusPorudzbine+'</td>');
				    let	tdOtkazi=$('<td id="otkaziPorudzbinuLink'+porudzbina.id+'"><a class="statusPorudzbine" style="color:red" href="/WebProjekat/rest/porudzbina/menjajStatus/'+porudzbina.id+'otkazano">Otkazi porudzbinu</a></td>');
	
				    tr.append(tdNaziv).append(tdStatus).append(tdIzmeni).append(tdOtkazi);
					$('#porudzbineDodeljeneMeniTabela tbody').append(tr);
			 	}
			 	else{
			 		alert("Imate porudzbinu u toku, prvo resite to pre nego sto uzmete za sebe novu porudzbinu!");
			 		return;
			 	}
		 }
	 });
	
});


/* *
 * Funkcija koja se pokrece kada kliknemo na link 'nalog' u gornjem desnom uglu dostavljaca
 * Koristimo div administratora, zbog toga idu nazivi polja po adminu!
 * */
$(document).on("click","#OtvoriNalogDostavljaca",function(e){
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
			let trDatumRegistracije=$('<tr><td><b>Datum registracije:</b></td><td>'+ admin.dan +'.'+admin.mesec+ '.'+ admin.godina + '. </td></tr>');
			$("#podaciOAdminu tbody").append(trIme).append(trPrezime).append(trUloga).append(trTelefon).append(trEmail).append(trDatumRegistracije);				
		}
		
	});
	
});
	
/* *
 * Poziva se prilikom gasenja prozora naloga dostavljaca
 * */
$(document).on("click","#izlazIzNalogaAdministratora",function(e){
	$("#nalogAdministratora").hide();
	$("#podaciOAdminu tbody tr").remove(); //brisemo sve redove tabele
	
});


/*
 * Izlogovanej administratora
 * */
$(document).on("click","#izlogujDostavljaca",function(e){
	e.preventDefault();
	
	//sada otkrivamo ono sto treba neregistrovani korisnik da vidi
	//a sakrivamo ono sto je admin video
	$('#navigacijaPreciceNeregistrovaniKorisnik').show();
	$("[class*='dostavljacUlogovan']").addClass('dostavljacNijeUlogovan');
	$("[class*='sakriOdAdministratora']").show();
	$("#porudzbineDodeljeneMeniTabela tbody tr").remove(); //brisemo sve iz spiska od admina
    $("#nedodeljenePorudzbineTabela thead tr").remove();
    $("#voziloDostavlajca").text("");
});

	
});