$(document).ready(function() {
	
	/*
	 * Sluzi kada kliknemo na srce za omiljeni restoran da se ono pocrveni full
	 * */
	$(document).on("click","#srceOmiljeniRestoran",function(e) {
		  $("#srceOmiljeniRestoran").toggleClass("fa-heart fa-heart-o");
	});
	
	
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
	
});