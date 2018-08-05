$(document).ready(function() {
	
	/*
	 * Sluzi kada kliknemo na srce za omiljeni restoran da se ono pocrveni full
	 * I nakon toga da ga dodamo korisniku u omiljene restorane
	 * i u polje omiljeni u restoranu stavicemo true
	 * */
	$(document).on("click",".omiljeniRestoranSrce",function(e) {
		  e.preventDefault();
		  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
		  let url= $(kliknutiElement).attr('href');
		  $.ajax({
				url : url,
				type: 'GET',
				success: function(vratio){
					 if(vratio=="ok"){
						 $(kliknutiElement).toggleClass("fa-heart fa-heart-o");
					 }
				}
		  });
		  
	});
	
	/* *
	 * Funkcija koja vrsi kupovinu jednog artikla tj dodaje artikal
	 * u objekat u sesisji pod nazivom Porudzbina
	 * i kao rezultat boji precucu korpa cisto da damo do znanja da nesto
	 * ima u njoj
	 * */
	$(document).on("click",".kupiArtikal",function(e){
		e.preventDefault();
		var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
		let url= $(kliknutiElement).attr('href');

		$.ajax({
			url : url,
			type: 'GET',
			success: function(vratio){
				
				$("#kupcevaKorpa").text("*Korpa");
				$("#kupcevaKorpa").css("color","yellow");
			}
		});

	});
	
	
	/* *
	 * Funkcija koja se pokrece nakon klika na korisnicku korpu, otvara je 
	 * prikazuje sve trenutno ubacene artikle u njoj.. 
	 * */
	$(document).on("click","#kupcevaKorpa",function(e){
		e.preventDefault();
		$.ajax({
			url : 'rest/kupac/otvoriKorpu',
			type: 'GET',
			success: function(porudzbina){
				for(let artikal of porudzbina.artikli){
					let tr = $('<tr></tr>');
					let tdObrisi = $('<td><a class="obrisiArtikalPorudzbina" href="/WebProjekat/rest/kupac/ukloniArtikalPorudzbina/'+artikal.naziv+ artikal.restoran+'">x</a></td>');
					let tdNaziv= $('<td>'+artikal.naziv+'</td>');
					let tdKolicina = $('<td>'+ artikal.brojArtikala+'</td>');
					let tdCena = $('<td>'+artikal.jedinicnaCena+'</td>');
					tr.append(tdObrisi).append(tdNaziv).append(tdKolicina).append(tdCena);
					$("#podaciOUnutrasnjostiKorpe tbody").append(tr);
					
					$("#dugmePoruciArtikle").removeAttr('disabled'); //ako ima artikala onda ce ukloniti disable sa dugmeta
				}
				
				let tr1=$('<tr></tr>');
				let tdKraj=$('<td><b>Ukupna cena:</b></td><td></td><td></td><td><b id="ukupnaCenaKorpa">'+porudzbina.ukupnaCena+'</b></td>')
				tr1.append(tdKraj);
				$("#podaciOUnutrasnjostiKorpe tbody").append(tr1);
				
				$("#korisnickaKorpa").show();
				
			}
		});
		
	});
	
	
	/* *
	 * funkcija koja se aktivira prilikom izbacivanja artikla iz poruzbine
	 * */
	$(document).on("click",".obrisiArtikalPorudzbina", function(e){
		  e.preventDefault();
		  var kliknutiElement= e.target; //ovo nam vraca element koji je kliknut		  
		  let url= $(kliknutiElement).attr('href');
		  $.ajax({
				url : url,
				type: 'GET',
				success: function(novaCena){
					$(kliknutiElement).parent().parent().remove(); //brise dati artikal iz korpe , tj taj red
					$('#ukupnaCenaKorpa').text(novaCena); //postavljamo novu ukupnuCenu
					if(novaCena=="0"){
						$("#dugmePoruciArtikle").prop("disabled", true); //nadam se da radi da iskljuci dugme kada je bez artikala korpa
						$("#kupcevaKorpa").text("Korpa");
						$("#kupcevaKorpa").css("color","white");
					}
				}
			});
	});
	
	
	/* *
	 * Funkcija koja se poziva nakon klika na izlaz iz prozora prikaza korpe
	 * korisnika
	 * */
	$(document).on("click","#izlazIzKorisnickeKorpe",function(e){
		$("#korisnickaKorpa").hide();
		$("#podaciOUnutrasnjostiKorpe tbody tr").remove();

	
	});
	/* *
	 * Funkcija koja se aktivira prilikom finalnog PORUCIVANJA artikala iz korpe 
	 * */
	$('#formaPoruciPorudzbinu').submit(function(event){
		event.preventDefault();
		let napomena = $('#inputNapomenaPorudzbine').val();
		let nagradniBodovi = $('#inputNagradniBodovi').val();
		if(nagradniBodovi<0){
			alert("Nagradni bodovi ne mogu biti negativni!");
			return;
		}
		
		$.ajax({
	        url: 'rest/kupac/naruci',
	        type: "POST" ,
			data: JSON.stringify({napomena: napomena,id:nagradniBodovi,ukupnaCena:'',obrisana:'',statusPorudzbine:''}),
			contentType: 'application/json',
	        success: function (result) {
	        	if(result=="PrevisePoena"){
	        		alert("Nemate toliki broj nagradnih poena!");
	        		return;
	        	}
	        	$("#korisnickaKorpa").hide();
	    		$("#podaciOUnutrasnjostiKorpe tbody tr").remove();
	    		$("#inputNapomenaPorudzbine").val("");
	    		$("#kupcevaKorpa").text("Korpa");
				$("#kupcevaKorpa").css("color","white");
	    		
	        }
	    });
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
				let trDatumRegistracije=$('<tr><td><b>Datum registracije:</b></td><td>'+ kupac.dan +'.'+kupac.mesec+ '.'+ kupac.godina + '. </td></tr>');
				let trNagradniPoeniKorisnika= $('<tr><td><b>Nagradni bodovi:</b></td><td>'+kupac.nagradniBodovi+'</td></tr>')
				$("#podaciOKorisniku tbody").append(trIme).append(trPrezime).append(trUloga).append(trTelefon).append(trEmail).append(trDatumRegistracije).append(trNagradniPoeniKorisnika);
				
				//sada ide ispis omiljenih restorana u prozor naloga
				for(let restoran of kupac.omiljeniRestorani){
					if(restoran.obrisan==false){
						let tr= $('<tr></tr>');
						let tdNaziv = $('<td><b>' + restoran.naziv+'</b> </td>');
						let tdAdresa = $('<td style="font-size:17">'+ restoran.adresa+ '</td>');
						tr.append(tdNaziv).append(tdAdresa);
						$('#TabelaomiljeniRestoraniKorisnika tbody').append(tr);
					}
				}
				
				$.ajax({
					url: 'rest/porudzbina',
					type: "GET",
					success: function(porudzbine){
						let broj=1;
						for(let porudzbina of porudzbine){
							if(porudzbina.obrisana==false){
								if(porudzbina.kupacKojiNarucuje.korisnickoIme == kupac.korisnickoIme){
									let tr=$('<tr></tr>');
									let tdPorudzbina='<td><b style="font-size:16">Porudzbina '+ broj +'</b></br>Artikli:</br>';
									for(let artikal of porudzbina.artikli){
										tdPorudzbina = tdPorudzbina + artikal.naziv + " (" + artikal.restoran + " ) </br>";
									}
									//ovde fali jos vreme porudzbine ne znmo kako sta 
									tdPorudzbina=tdPorudzbina + "</br>Datum porudzbine:"+ porudzbina.dan +"."+porudzbina.mesec+ "."+ porudzbina.godina + ".</td>";
									tdTd=$(tdPorudzbina);
									tr.append(tdTd);
									$("#TabelaZadnjePoruzbineKorisnika").append(tr);
									broj=broj+1;
								}
							}
						}
					}
				});
				
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
		$("#TabelaomiljeniRestoraniKorisnika tbody tr").remove();
		$("#TabelaZadnjePoruzbineKorisnika tbody tr").remove();
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
					/*
					 * Posto gasimo i ovaj prozor onda moramo da ovo obrisemo*/
					$("#nalogKorisnika").hide();
					$("#podaciOKorisniku tbody tr").remove(); //brisemo sve redove tabele
					//jer pri svakom otvaranju prozora mi to punimo, pa da nemamo kopije jednih ispod drugih
					$("#TabelaomiljeniRestoraniKorisnika tbody tr").remove();
					$("#TabelaZadnjePoruzbineKorisnika tbody tr").remove();
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
	
	
	/* *
	 * Funkcija koja se poziva prilikom izlogovanja korisnika sa svog naloga
	 * vraca html kod u defaultnu vrednost i gasi sessiju
	 * */
	
	$(document).on("click","#izlogujKupca",function(e){
		e.preventDefault();
		$.ajax({
			url: 'rest/kupac/izloguj',
			type:"GET",
			success: function(status) {
				if(status=="ok"){
					$("[class*='kupacUlogovan']").addClass("kupacNijeUlogovan"); //vracamo elementima ovu klasu koja ih skriva zapravo
					$('#navigacijaPreciceNeregistrovaniKorisnik').show();

				}
			}
		});
			
	});
	
	
	
});