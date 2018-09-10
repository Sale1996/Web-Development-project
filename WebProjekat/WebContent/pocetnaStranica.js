function addTop10ArtikalTr(artikli) {
	let brojPica=0;
	let brojJela=0;
	for (let artikal of artikli) {
		let tr = $('<tr class="'+artikal.naziv+artikal.restoran+'"></tr>');
		let tdNaziv = $('<td class="tableTOP10naziv">' + artikal.naziv + '</td>');
		let tdCena = $('<td>' + artikal.jedinicnaCena + ' din' + '</td>');
		let tdDugme = $('<td><button class="button ovoJeZaKupca kupiArtikal kupacUlogovan" ><a style="color:white;font-size:20" href="rest/kupac/naruciArtikal/'+ artikal.naziv + artikal.restoran+'">Kupi</a></button> </td>');
		//ukoliko je obrisan, mi ga ne pisemo
		if(artikal.obrisan==false){
			tr.append(tdNaziv).append(tdCena).append(tdDugme); // ovde samo dodajemo u kolone tabele vidis naziv pa cena pa link
			if(artikal.tip == "jelo"){
				if((brojJela%2)==0){
					$('#tabelaTop10Jela1 tbody').append(tr);
				}else{
					$('#tabelaTop10Jela2 tbody').append(tr);

				}
				brojJela++;
			}
			else if(artikal.tip=="pice"){
				if((brojPica%2)==0){
					$('#tabelaTop10Pica1 tbody').append(tr);

				}else{
					$('#tabelaTop10Pica2 tbody').append(tr);
				}
				brojPica++;
			}
		}
	}
	
}

/*
 * Funkcija koja nam izlistava prosledjene artikle na pocetnu stranicu
 * */
function addSviArtikli(artikli){
	
	/*
	 * sledeci for sluzi da ubacimo sve moguce artikle u listu
	 * */
	let broj=0; //ovaj broj nam govori dal smo popunili jedan red ili ne , ideja je da iammo po 2 artikla u jednom redu
	for(let artikal of artikli){
		let tr=$('<tr class="'+artikal.naziv+artikal.restoran+'" ></tr>');
		//ako je artikal obrisan, mi ga ne ispisujemo
		if(artikal.obrisan==false){
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
				
				
				let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + artikal.naziv + artikal.restoran +  '\')"><p '+bojaNaziva+' ><b>' + artikal.naziv
						+ '</b></p> <span class="popuptext" id="'+ artikal.naziv + artikal.restoran 
						+'"><b>Naziv:</b> '+ artikal.naziv +' </br><b>Cena:</b> '+ artikal.jedinicnaCena +' din</br><b>Opis:</b> '+ artikal.opis +' </br><b>Kolicina:</b> '+
						artikal.kolicina + ' ' + kolicinskaMera +' </br><b>Restoran:</b> '+ artikal.restoran +'</span> </div></td>');
				
				let tdCena = $('<td>' + artikal.jedinicnaCena + ' din' + '</td>');
				let tdDugme = $('<td><button class="button ovoJeZaKupca kupiArtikal kupacUlogovan" ><a style="color:white;font-size:20" href="rest/kupac/naruciArtikal/'+ artikal.naziv + artikal.restoran+'">Kupi</a></button> </td>');
				tr.append(tdNaziv).append(tdCena).append(tdDugme); // ovde samo dodajemo u kolone tabele vidis naziv pa cena pa link
				broj++;
		
		
				if(broj==1){
					$('#tabelaSviArtikli1 tbody').append(tr);
				}
				else if(broj==2){
					$('#tabelaSviArtikli2 tbody').append(tr);
				}
				else if(broj==3){
					$('#tabelaSviArtikli3 tbody').append(tr);
					broj=0;
				}
			}
	}
}


function ispisiRestorane(restorani){
	
	let broj=0; 
	
	for (let restoran of restorani){
		let tr=$('<tr class="'+restoran.naziv+'" ></tr>');
		//ako je restoran obrisan, nemoj ga pisati (a to je ako je on na polju obrisan == true
		if(restoran.obrisan==false){
		
			/*
			 * Prvo cemo da proverimo da li je taj restoran u listi omiljenih restorana ulogovanog korisnika
			 * ako jeste onda cemo mu namestiti klasu koja odgovara obojenom srcu
			 * ako nije onda cemo ostaviti prazno srce
			 * */
			var omiljeni='class="heart fa fa-heart-o ovoJeZaKupca kupacUlogovan omiljeniRestoranSrce"';
			if(restoran.daLiJeOmiljeni==true){
				omiljeni='class="heart fa fa-heart kupacUlogovan omiljeniRestoranSrce"';
			}
		
			
			tr=$('<tr class="'+restoran.naziv+'"></tr>');
			
			let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + restoran.naziv +  '\')"><p style=\"color: #765FAB; font-size: 40px;\" ><b>' + restoran.naziv
					+ '</b></p> <span class="popuptext" id="' + restoran.naziv 
					+'"><b>Naziv:</b> '+ restoran.naziv +' </br><b>Adresa:</b> '+ restoran.adresa +' </br><b>Kategorija:</b> '+ restoran.kategorija +'</span>'+
					' </div><div><a href="rest/kupac/dodajRestoran/'+ restoran.naziv+'" '+omiljeni+'></a></div>' +
					
					'</br> <button class="button" id="dugmePretragaArtikalaPoRestoranu"><a href="rest/artikli/izlistajArtikle/' +restoran.naziv + '"><p style="color: white">Pogledaj artikle!</p></a></button></td> ');
			
			//let tdDugme = $('<td> </td>');
			tr.append(tdNaziv); // ovde samo dodajemo u kolone tabele vidis naziv pa cena pa link
			broj++;
	
	
			if(broj==1){
				$('#tabelaSviRestorani2 tbody').append(tr);
			}
			else if(broj==2){
				$('#tabelaSviRestorani2 tbody').append(tr);
			}
			else if(broj==3){
				$('#tabelaSviRestorani3 tbody').append(tr);
				broj=0;
			}
			
		
		}	
	}
}


$(document).ready(function() { 
	$.ajax({
		url: 'rest/artikli', //url
		type: "GET" ,
		success : function(artikli) {
			/*
			 * ovo je bio test za top10 artikala iz picai jela , ovo koristi listu svih artikala tako da ce se u buducnosti
			 * izmeniti da koristi samo listu top10 artikala
			 * */
			
			//OVDE NAPRAVI AJAX POZIV KOJI CE NAM VRATITI TOP 10 PICA 
			//I TOP 10 ARTIKALA, ZNACI 20 ARTIKALA VRACA!!!!
			$.ajax({
				url: 'rest/artikli/dajMiTop10', //url
				type: "GET" ,
				success : function(artikli) {
					addTop10ArtikalTr(artikli);
					$("[class*='ovoJeZaKupca']").addClass("kupacNijeUlogovan"); //pojavljuju se u slucaju logovanja korisnika


				}
			});
			
			
			
			$("#dugmeKojeBriseListuRestorana").hide(); //pojavljuje se u posebnim slucajevima
			$("#dugmePonistavanjaFilteraArtikala").hide(); //pojavljuje se u posebnim slucajevima
			
			addSviArtikli(artikli);
			$("[class*='ovoJeZaKupca']").addClass("kupacNijeUlogovan"); //pojavljuju se u slucaju logovanja korisnika
			$("#pretragaRestoranaPocetna").hide();
			
			
			//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
			$("#pretragaArtiklaAdministrator").hide();
			//a takodje i restorana
			$("#pretragaRestoranaAdmin").hide();
			
			
			
			
			//SADA GLEDAMO STA JE KORISNIK ULOGOVAN I AKO JESTE ONDA GLEDAMO STA JE ON U ULOZI I TO ISPISUJEMO
			//
			$.ajax({
				url: 'rest/korisnik', //url
				type: "GET" ,
				success : function(korisnik) {
					if(korisnik!=null){
					   ispisiHTMLpoKorisniku(korisnik);
					}
				}
			});
			
		}
		});
	

	
	/*
	 * event koji reaguje na click na dugme PRETRAGA i koji nam otvara zadatku pretragu, odnosno zatvara ako je vec otvorena
	 * */
	
	$(document).on("click","button#dugmeTogglePretraga",function(e){
		
		 if ($('#formaPretragaArtikala').css('display') == 'none' ) {
			 $('#formaPretragaArtikala').show(800);
		 }else
			 {
			 $('#formaPretragaArtikala').hide(800);
			 }
	});
	
	
	/***
	 * Event koji reaguje na dugme Ponisti i kao rezultat vraca pocetno stanje priakza svih artikala
	 * */
	$(document).on("click","button#dugmePonistavanjaFilteraArtikala",function(e){
		$.ajax({
			url: 'rest/artikli', //url
			type: "GET" ,
			success : function(artikli) {
				/*Samo uklonimo dugme i ispisemo sve artikle
				 * */
				
				$("#tabelaSviArtikli1  tr").remove();
				$("#tabelaSviArtikli2  tr").remove();
				$("#tabelaSviArtikli3  tr").remove();
				$("#dugmePonistavanjaFilteraArtikala").hide();
				addSviArtikli(artikli);
				
			}
			});
	});
	
	
	/*
	 * Bindovano na klik dugmeta koji brise spisak restorana neke kategorije i vraca default prikaz svih artikala i dugmeta pretrage
	 * */
	$(document).on("click","#dugmeKojeBriseListuRestorana",function(e){
		$.ajax({
			url: 'rest/artikli', //url
			type: "GET" ,
			success : function(artikli) {
				$("#pretragaRestoranaPocetna").hide();
				
				$("#dugmeKojeBriseListuRestorana").hide();
				//sada trebamo da obrisemo red u tabeli
				$("#tabelaSviRestorani1  tr").remove();
				$("#tabelaSviRestorani2  tr").remove();
				$("#tabelaSviRestorani3  tr").remove();
				
				//prikazujemo dugme za pretragu i ispisujemo opet proizvode
				$("#dugmeTogglePretraga").show();
				$("#dugmePonistavanjaFilteraArtikala").hide();
				addSviArtikli(artikli);
			}
		});

	});
	
	/***
	 * Event koji reaguje na klik na kategoriju restorana, rezultat ovoga je prikaz linkova restorana na pocetnom prozoru!
	 * */
	$(document).on("click","#listaKategorijaRestorana a",function(e){
		e.preventDefault();
		let url= $(this).attr('href'); //kupimo link i uzimamo njegov href;
		$.ajax({
			url : url,
			type: 'GET',
			success: function(restorani){
				$("#pretragaRestoranaPocetna").show();
				//sada trebamo da obrisemo red u tabeli
				$("#tabelaSviRestorani1  tr").remove();
				$("#tabelaSviRestorani2  tr").remove();
				$("#tabelaSviRestorani3  tr").remove();
				/*
				 * Radi preglednosti obrisali smo sve artikle i oni ce se kasnije dodati ako prekinemo rezim prikaza restorana 
				 * ili klikom na neki restoran
				 * */
				$("#tabelaSviArtikli1  tr").remove();
				$("#tabelaSviArtikli2  tr").remove();
				$("#tabelaSviArtikli3  tr").remove();
				$("#dugmeTogglePretraga").hide();
				$("#dugmeKojeBriseListuRestorana").show();
				$("#dugmePonistavanjaFilteraArtikala").hide();
				$('#formaPretragaArtikala').hide();


				ispisiRestorane(restorani);
				if($("#navigacijaPreciceNeregistrovaniKorisnik").hasClass("kupacNijeUlogovan")){
					 $("[class*='kupacNijeUlogovan']").removeClass('kupacNijeUlogovan');
				}else{
				  
				}
			}
		})
	});
	
	/*
	 * Event koji je bindovan na dugme "Pogledaj artikle!" jednog resorana iz liste restorana koji su prikazani nakon klika na 
	 * kategoriju restorana
	 * */
	$(document).on("click","button#dugmePretragaArtikalaPoRestoranu a",function(e){
		e.preventDefault();
		let url= $(this).attr('href'); //kupimo link i uzimamo njegov href;
		$.ajax({
			url : url,
			type: 'GET',
			success: function(artikli){
				$("#dugmeTogglePretraga").show();
				$("#dugmeKojeBriseListuRestorana").hide();
				$("#dugmePonistavanjaFilteraArtikala").show();
				//sada trebamo da obrisemo red u tabeli
				$("#tabelaSviRestorani1  tr").remove();
				$("#tabelaSviRestorani2  tr").remove();
				$("#tabelaSviRestorani3  tr").remove();
				addSviArtikli(artikli);

				
			}
		});
	});
	
	/*
	 * Regauje na uloguj se link i iskace nam prozor za login
	 * */
	$(document).on("click","#popUpLoginForm",function(e){
		e.preventDefault();
		$("#modal-wrapper").show();
	});
	
	/*
	 * Reaguje na registruj se link i iskace nam prozor za registrovanje
	 * */
	$(document).on("click","#popUpRegisterForm",function(e){
		e.preventDefault();
		$("#modal-wrapper2").show();
	});
	
	
	/*
	 * Ovaj event reaguje na trazenje artikala znaci dace one artikle prema pretragi
	 * */
	$('form#formaPretragaArtikala').submit(function(event){
		event.preventDefault();
		let naziv = $('input[name="name"]').val();
		let cenaMin = $('input[name="priceLowest"]').val();
		let cenaMax = $('input[name="priceHighest"]').val();
		let kategorija =$('select[name="tipPretraga"]').val();
		let restoran = $('input[name="restoranPretraga"]').val();
		
		if(cenaMin<0 || cenaMax<0){
			$('#errorPretragaArtikla').text('Cena ne sme biti negativna!');
			$('#errorPretragaArtikla').show().delay(2000).fadeOut();
			return;
		}
		$("#errorPretragaArtikla").hide();
		$.ajax({
		    url: '/WebProjekat/rest/artikli',
		    type: "POST" ,
			data: JSON.stringify({naziv:naziv,jedinicnaCena:cenaMin,opis:'',kolicina:cenaMax,tip:kategorija,restoran:restoran }),
			contentType: 'application/json',
			success: function(artikli){
				//ovde cemo da ubacimo u onu sadrzinu te elemente
				$("#dugmePonistavanjaFilteraArtikala").show();
				$("#tabelaSviArtikli1  tr").remove();
				$("#tabelaSviArtikli2  tr").remove();
				$("#tabelaSviArtikli3  tr").remove();
				addSviArtikli(artikli);

			}
		});
		
		
		
	});
	
	
	/*
	 * Pokrece se nakon sto korisnik potvrdi svoje logovanej
	 * */
	$('#formaPrijavljivanjeKorisnika').submit(function(event){
		event.preventDefault();
		var username=$('#korisnickoImeInputLogovanje').val();
		var password=$('#passwordInputLogovanje').val();
		
		$.ajax({
			url: 'rest/korisnik', //url
			type: "POST" ,
			data: JSON.stringify({korisnickoIme:username,lozinka:password,ime:'',prezime:'',uloga:'',kontaktTelefon:'',emailAdresa:''}),
			contentType: 'application/json',
			success : function(korisnik) {
				if(korisnik.kontaktTelefon.includes("LozinkaNeValja")){
					$('#errorLozinkaLogovanje').text('Lozinka neispravna!');
					$('#errorLozinkaLogovanje').show().delay(9000).fadeOut();
				}
				if(korisnik.kontaktTelefon.includes("NePostojiKorisnik")){
					$('#errorKorisnickoImeLogovanje').text('Ne postoji nalog sa ovim korisnickim imenom!');
					$('#errorKorisnickoImeLogovanje').show().delay(9000).fadeOut();				
				}
				
				//ispisuje HTML na osnovu korisnika!
				ispisiHTMLpoKorisniku(korisnik);
				
			}
		});
		
	});
	
	
	
	/*
	 * Funkcija koja nam sluzi da vrsimo pretragu po restoranima
	 * i vraca nam listu restorana koja odgovara toj pretrazi!
	 * */
	$('#formaPretragaRestoranaPocetnaStrana').submit(function(event){
		event.preventDefault();
		var naziv = $('#nazivRestoranaPretragaPocetna').val();
		var ulica= $('#ulicaRestoranaPretragaPocetna').val();
		var kategorija = $("#tipPretragaRestoran").val();
		
		
		$.ajax({
			url: 'rest/restorani/pretraga', //url
			type: "POST" ,
			data: JSON.stringify({naziv:naziv,adresa:ulica,kategorija:kategorija}),
			contentType: 'application/json',
			success : function(restorani) {

				$("#pretragaRestoranaPocetna").show();
				//sada trebamo da obrisemo red u tabeli
				$("#tabelaSviRestorani1  tr").remove();
				$("#tabelaSviRestorani2  tr").remove();
				$("#tabelaSviRestorani3  tr").remove();
				/*
				 * Radi preglednosti obrisali smo sve artikle i oni ce se kasnije dodati ako prekinemo rezim prikaza restorana 
				 * ili klikom na neki restoran
				 * */
				$("#tabelaSviArtikli1  tr").remove();
				$("#tabelaSviArtikli2  tr").remove();
				$("#tabelaSviArtikli3  tr").remove();
				$("#dugmeTogglePretraga").hide();
				$("#dugmeKojeBriseListuRestorana").show();
				$("#dugmePonistavanjaFilteraArtikala").hide();
				$('#formaPretragaArtikala').hide();


				ispisiRestorane(restorani);
				if($("#navigacijaPreciceNeregistrovaniKorisnik").hasClass("kupacNijeUlogovan")){
				//	 $("[class*='kupacNijeUlogovan']").removeClass('kupacNijeUlogovan');
				}
						
			}
		});
	});	
	
	
	
	
	
	
	
	
	
	
	
function ispisiHTMLpoKorisniku(korisnik){
	if(korisnik.uloga=="kupac"){
		/*
		 * Ako se ulogovao kupac znaci da cemo morati da izpremestamo izgled 
		 * pocetnog prozora od pocetne stranice na onu koja dolikuje ulogovanom
		 * kupcu
		 * */
		//prvo sakrivamo precice za registrovanje i logovanje
		$('#navigacijaPreciceNeregistrovaniKorisnik').hide();
		//otkrivamo precice odjave,naloga i korpe
		//$('#navigacijaPreciceNeregistrovaniKorisnik').removeClass('kupacNijeUlogovan');
		//otkrivamo svu dugmad "Kupi" tako sto skidamo klasu..
		//otkrivamo funkcionalnost dodavanja restorana kao omiljenog
		$("[class*='kupacNijeUlogovan']").removeClass('kupacNijeUlogovan');
		
		//zatvaramo prozor logovanja i brisemo njegova polja
		$('#modal-wrapper').hide();
		$('#korisnickoImeInputLogovanje').val("");
		$('#passwordInputLogovanje').val("");
		
	}else if(korisnik.uloga=="admin"){
		/* *
		 * Sakrivamo navigacioneprecice neregistrovanog korisnika
		 * Sakrivamo spisak svih artikala, i funkcionalnost sortiranja artikala prema restoranu
		 * Prikazujemo menu bar sa naslovima spiskova koji iskacu administratoru
		 * */
		//prvo sakrivamo precice za registrovanje i logovanje
		$('#navigacijaPreciceNeregistrovaniKorisnik').hide();
		//otkrivamo sve sto je vezano za administratora!
		$("[class*='administratorNijeUlogovan']").addClass('administratorUlogovan');
		$("[class*='administratorNijeUlogovan']").removeClass('administratorNijeUlogovan');
		
		//sve div-ove koje smo obelezili sa ovom klasom sakrivamo ga
		$("[class*='sakriOdAdministratora']").hide();
		
		//SAKRIVAMO FORMU ZA TRAZENJE ARTIKLA KOJOM UPRAVLJA ADMINISTRATOR
		$("#pretragaArtiklaAdministrator").hide();
		//a takodje i restorana
		$("#pretragaRestoranaAdmin").hide();
		
		
		//zatvaramo prozor logovanja i brisemo njegova polja
		$('#modal-wrapper').hide();
		$('#korisnickoImeInputLogovanje').val("");
		$('#passwordInputLogovanje').val("");

	}else if(korisnik.uloga=="dostavljac"){
		$('#navigacijaPreciceNeregistrovaniKorisnik').hide();
		
		$("[class*='dostavljacNijeUlogovan']").addClass('dostavljacUlogovan');
		$("[class*='dostavljacNijeUlogovan']").removeClass('dostavljacNijeUlogovan');
		
		//sve div-ove koje smo obelezili sa ovom klasom sakrivamo ga
		//administrator i dostavlajc iste stvari ne trebaju da vide
		$("[class*='sakriOdAdministratora']").hide();
		
		//zatvaramo prozor logovanja i brisemo njegova polja
		$('#modal-wrapper').hide();
		$('#korisnickoImeInputLogovanje').val("");
		$('#passwordInputLogovanje').val("");
		
		//sada popunjavamo vrednosti za dostavljaca
		if(korisnik.vozilo!=null){
			$("#voziloDostavlajca").text(korisnik.vozilo.registarskaOznaka+' ( '+korisnik.vozilo.marka +' '+korisnik.vozilo.model+')');

		}
		
		$.ajax({
			url : 'rest/porudzbina',
			type: 'GET',
			success: function(porudzbine){
				 let tr=$('<tr></tr>');
				 
				 var brojac=0;//cisto da bi smo pisali "Porudzbina1"
				 for(let porudzbina of porudzbine){
					    if(porudzbina.obrisana==false){
						    tr=$('<tr class="porudzbina'+porudzbina.id+'"></tr>');
						    var dostavljac="";
						    if(porudzbina.dostavljac!=null){
						    	dostavljac=porudzbina.dostavljac.korisnickoIme;
						    }
						    let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + brojac+  '\')"><p  style=\"color: #765FAB; font-size: 20px;\" ><b id="izlistajPorudzbineAdminGlavnaLista'+brojac+'"> Porudzbina ' +(brojac+1)
									+ '</br>'+ porudzbina.ukupnaCena +' din</b></p> <span class="popuptext" id="' + brojac
									+'"><b>Status porudzbine:</b> <i id="spanPorudzbinaStatusPorudzbine'+brojac+'">'+ porudzbina.statusPorudzbine +'</i> </br><b>Napomena:</b> '+ porudzbina.napomena +' </br><b>Cena:</b> <i id="spanPorudzbinaUkupnaCena'+brojac+'">'+ porudzbina.ukupnaCena + '</i> din</br><b>Kupac:</b> <i id="spanPorudzbinaKupac'+brojac+'">'+ porudzbina.kupacKojiNarucuje.korisnickoIme +
									'</i> </br><b>Dostavljac:'+dostavljac+'</b> </br></span>'+
									' </div>');	
						    let tdIzmeni= null;
						    if(porudzbina.statusPorudzbine=="poruceno"){
								tdIzmeni = $('<td id="LinkIzmenaStatusaPorudzbine'+porudzbina.id+'" ><a class="statusPorudzbine" href="/WebProjekat/rest/porudzbina/menjajStatus/'+brojac+'uToku">Promeni u toku</a></td>');
						    }
						    else if(porudzbina.statusPorudzbine=="u toku"){
								tdIzmeni = $('<td id="LinkIzmenaStatusaPorudzbine'+porudzbina.id+'"><a class="statusPorudzbine" href="/WebProjekat/rest/porudzbina/menjajStatus/'+brojac+'dostavljeno">Promeni u dostavljeno</a></td>');
						    	
						    }else{
						    	tdIzmeni = $('<td></td>');
						    }
						    
						    let tdStatus = $('<td id="promeniStatusPorudzbine'+porudzbina.id+'">'+porudzbina.statusPorudzbine+'</td>');

							tr.append(tdNaziv).append(tdStatus);
							if(porudzbina.dostavljac==null && porudzbina.statusPorudzbine=="poruceno"){
								let tdPreuzmi = $('<td id="LinkPreuzmiPorudzbinu'+porudzbina.id+'"><a class="preuzmiPorudzbinu" href="/WebProjekat/rest/dostavljaci/preuzmiPorudzbinu/'+brojac+'">Preuzmi porudzbinu</a></td>');
								tr.append(tdPreuzmi);
								$('#nedodeljenePorudzbineTabela tbody').append(tr);
							}
							else if(porudzbina.dostavljac.korisnickoIme==korisnik.korisnickoIme){
								
							    tr.append(tdIzmeni);
								$('#porudzbineDodeljeneMeniTabela tbody').append(tr);
							}
							
							brojac=brojac+1;
					    }
				 }
				
			 
				
	
			}
		});
	}
}
	
	
	
	
		
});




function iskociPopUP(ime) {
	var popup = document.getElementById(ime);
    popup.classList.toggle("show");
}

