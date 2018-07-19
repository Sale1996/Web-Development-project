$(document).ready(function() {
	
	/*
	 * Sluzi kada kliknemo na srce za omiljeni restoran da se ono pocrveni full
	 * */
	$(document).on("click","#srceOmiljeniRestoran",function(e) {
		  $("#srceOmiljeniRestoran").toggleClass("fa-heart fa-heart-o");
	});
	
	/* * *
	 * Funkcija koja se pokrece prilikom potvrde registrovanja novog korisnika
	 * */
	$('#formaRegistvoranjaKorisnika').submit(function(event){
		event.preventDefault();
		let greska=0;
		let korisnickoIme = $('#korisnickoImeInputRegistracija').val();
		let lozinka = $('#lozinka1Registracija').val();
		let lozinka2 = $('#lozinka2Registracija').val();
		let ime = $('#imeRegistracija').val();
		let prezime = $('#prezimeRegistracija').val();
		let telefon = $('#telefonRegistracija').val();
		let email = $('#emailRegistracija').val();
		
		if(korisnickoIme == ""){
			$('#errorKorisnickoIme').text('Korisnicko ime ne sme biti prazno!');
			$('#errorKorisnickoIme').show().delay(9000).fadeOut();
			greska=1;
		}
		if(lozinka!=lozinka2){
			$('#errorLozinka').text('Polja lozinki se ne poklapaju!');
			$('#errorLozinka').show().delay(9000).fadeOut();
			greska=1;
		}
		if(lozinka==""){
			$('#errorLozinka').text('Polje lozinke se mora popuniti!');
			$('#errorLozinka').show().delay(9000).fadeOut();
			greska=1;
		}
		if(ime==""){
			$('#errorIme').text('Polje ime se mora popuniti!');
			$('#errorIme').show().delay(9000).fadeOut();
			greska=1;
		}
		if(prezime==""){
			$('#errorPrezime').text('Polje prezime se mora popuniti!');
			$('#errorPrezime').show().delay(9000).fadeOut();
			greska=1;
		}
		
		if(telefon==""){
			$('#errorTelefon').text('Polje telefon je obavezno!');
			$('#errorTelefon').show().delay(9000).fadeOut();
			greska=1;
		}
		if(email==""){
			$('#errorEmail').text('Polje email je obavezno!');
			$('#errorEmail').show().delay(9000).fadeOut();
			greska=1;
		}
		
		if(greska==1)
			return;
		
		$.ajax({
			url: 'rest/kupac', //url
			type: "POST" ,
			data: JSON.stringify({korisnickoIme:korisnickoIme,lozinka:lozinka,ime:ime,prezime:prezime,uloga:"kupac",kontaktTelefon:telefon,emailAdresa:email }),
			contentType: 'application/json',
			success : function(string) {
				if(string==""){
					$('#modal-wrapper2').hide();
					$('#korisnickoImeInputRegistracija').val("");
					$('#lozinka1Registracija').val("");
					$('#lozinka2Registracija').val("");
					$('#imeRegistracija').val("");
					$('#prezimeRegistracija').val("");
					$('#telefonRegistracija').val("");
					$('#emailRegistracija').val("");
					alert("Registracija uspesno izvrsena!");
					
				}
				if(string.includes("Ime")){
					$('#errorKorisnickoIme').text('Korisnicko ime vec postoji!');
					$('#errorKorisnickoIme').show().delay(9000).fadeOut();
				}
				if(string.includes("Email")){
					$('#errorEmail').text('Nalog sa datim Emailom vec postoji!');
					$('#errorEmail').show().delay(9000).fadeOut();
				}
			}
		});
		
		
	});
	
	/* *
	 * Funkcija koja se pokrece kada kliknemo na link 'nalog' u gornjem desnom uglu
	 * */
	$(document).on("click","#OtvoriNalogKorisnika",function(e){
		e.preventDefault();
		$.ajax({
			url: 'rest/korisnik', //url
			type: "GET" ,
			success : function(kupac) {
				$("#nalogKorisnika").show();
				
				$("#ImeIPrezime").text(kupac.ime+" "+kupac.prezime);
				//sada cemo da popunimo tabelu informacijama o korisniku sa linkom izmeni
				let trIme= $('<tr><td><b>Ime:</b></td><td>'+ kupac.ime +' </td></tr>');
				let trPrezime= $('<tr><td><b>Prezime:</b></td><td>'+ kupac.prezime +' </td></tr>');
				let trUloga = $('<tr><td><b>Uloga:</b></td><td>'+ kupac.uloga +' </td></tr>');
				let trTelefon= $('<tr><td><b>Kontakt telefon:</b></td><td>'+ kupac.kontaktTelefon +' </td></tr>');
				let trEmail=$('<tr><td><b>Email:</b></td><td>'+ kupac.emailAdresa +' </td></tr>');
				let trDatumRegistracije=$('<tr><td><b>Datum registracije:</b></td><td>'+ kupac.datum +' </td></tr>');
				$("#podaciOKorisniku tbody").append(trIme).append(trPrezime).append(trUloga).append(trTelefon).append(trEmail).append(trDatumRegistracije);
				
			}
			
		});
		
	});
	
	/* * 
	 * Funkcija koja se poziva kada korisnik klikne na link 'izmeni profil'
	 * */
	$(document).on("click","#izmeniKorisnikaLink",function(e){
		e.preventDefault();
		$.ajax({
			url: 'rest/korisnik',
			type:"GET",
			success: function(korisnik) {
				$("#izmenaProfilaKorisnika").show();
				$('#imeIzmena').val(korisnik.ime);
				$('#prezimeIzmena').val(korisnik.prezime);
				$('#telefonIzmena').val(korisnik.kontaktTelefon);
				$('#emailIzmena').val(korisnik.emailAdresa);
				
			}
		});
	});
	
	/* *
	 * Poziva se prilikom gasenja prozora naloga korisnika
	 * */
	$(document).on("click","#izlazIzNalogaKupca",function(e){
		$("#nalogKorisnika").hide();
		$("#podaciOKorisniku tbody tr").remove(); //brisemo sve redove tabele
		//jer pri svakom otvaranju prozora mi to punimo, pa da nemamo kopije jednih ispod drugih
		
	});
	
	/* * 
	 * Funkcija koja se aktivira prilikom potvrde izmene korisnikovog 
	 * naloga
	 * */
	$('#formaIzmeneProfilaKorisnika').submit(function(event){
		event.preventDefault();
		let greska=0; //u slucaju da ima greske ovo polje dobija vrednost 1
		let lozinka = $('#lozinkaIzmena').val();
		let lozinka2 = $('#lozinka2Izmena').val();
		let ime = $('#imeIzmena').val();
		let prezime = $('#prezimeIzmena').val();
		let telefon = $('#telefonIzmena').val();
		let email = $('#emailIzmena').val();
		
		
		if(lozinka!=lozinka2){
			$('#errorLozinkaIzmena').text('Polja lozinki se ne poklapaju!');
			$('#errorLozinkaIzmena').show().delay(9000).fadeOut();
			greska=1;
		}
		if(ime==""){
			$('#errorImeIzmena').text('Polje ime ne sme biti prazno prilikom izmene!');
			$('#errorImeIzmena').show().delay(9000).fadeOut();
			greska=1;
		}
		if(prezime==""){
			$('#errorPrezimeIzmena').text('Polje prezime ne sme biti prazno prilikom izmene!');
			$('#errorPrezimeIzmena').show().delay(9000).fadeOut();
			greska=1;
		}
		
		if(telefon==""){
			$('#errorTelefonIzmena').text('Polje telefon ne sme biti prazno prilikom izmene!');
			$('#errorTelefonIzmena').show().delay(9000).fadeOut();
			greska=1;
		}
		if(email==""){
			$('#errorEmailIzmena').text('Polje email ne sme biti prazno prilikom izmene!');
			$('#errorEmailIzmena').show().delay(9000).fadeOut();
			greska=1;
		}
		
		if(greska==1)
			return;
		
		$.ajax({
			url: 'rest/korisnik', //url
			type: "PUT" ,
			data: JSON.stringify({korisnickoIme:'',lozinka:lozinka,ime:ime,prezime:prezime,uloga:"",kontaktTelefon:telefon,emailAdresa:email }),
			contentType: 'application/json',
			success : function(string) {
				if(string==""){
					$('#izmenaProfilaKorisnika').hide();
					$('#nalogKorisnika').hide();
					$('#lozinkaIzmena').val("");
					$('#lozinka2Izmena').val("");
					alert("Izmena uspesno izvrsena!");
					
				}
				//ukoliko vec ima email u povratnom stringu ce se naglasiti
				if(string.includes("Email")){
					$('#errorEmail').text('Nalog sa datim Emailom vec postoji!');
					$('#errorEmail').show().delay(9000).fadeOut();
				}
			}
		});
		
	});
	
	
	
});