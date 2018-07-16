function addTop10ArtikalTr(artikal) {
	
	let tr = $('<tr></tr>');
	let tdNaziv = $('<td class="tableTOP10naziv">' + artikal.naziv + '</td>');
	let tdCena = $('<td>' + artikal.jedinicnaCena + ' din' + '</td>');
	let tdDugme = $('<td><button class="button kupacNijeUlogovan" >Kupi</button> </td>')
	
	tr.append(tdNaziv).append(tdCena).append(tdDugme); // ovde samo dodajemo u kolone tabele vidis naziv pa cena pa link
	if(artikal.tip == "jelo"){
		$('#tabelaTop10Jela tbody').append(tr);
	}
	else if(artikal.tip=="pice"){
		$('#tabelaTop10Pica tbody').append(tr);
	}
}

/*
 * Funkcija koja nam izlistava prosledjene artikle na pocetnu stranicu
 * */
function addSviArtikli(artikli){
	let tr=$('<tr ></tr>');
	/*
	 * sledeci for sluzi da ubacimo sve moguce artikle u listu
	 * */
	let broj=0; //ovaj broj nam govori dal smo popunili jedan red ili ne , ideja je da iammo po 2 artikla u jednom redu
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
		
		
		let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + artikal.naziv + artikal.restoran +  '\')"><p '+bojaNaziva+' ><b>' + artikal.naziv
				+ '</b></p> <span class="popuptext" id="'+ artikal.naziv + artikal.restoran 
				+'"><b>Naziv:</b> '+ artikal.naziv +' </br><b>Cena:</b> '+ artikal.jedinicnaCena +' din</br><b>Opis:</b> '+ artikal.opis +' </br><b>Kolicina:</b> '+
				artikal.kolicina + ' ' + kolicinskaMera +' </br><b>Restoran:</b> '+ artikal.restoran +'</span> </div></td>');
		
		let tdCena = $('<td>' + artikal.jedinicnaCena + ' din' + '</td>');
		let tdDugme = $('<td><button class="button kupacNijeUlogovan">Kupi</button> </td>');
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


function ispisiRestorane(restorani){
	let tr=$('<tr ></tr>');
	let broj=0; 
	
	for (let restoran of restorani){
		tr=$('<tr></tr>');
		
		let tdNaziv = $('<td> <div class="popup" onclick="iskociPopUP(\'' + restoran.naziv +  '\')"><p style=\"color: #765FAB; font-size: 40px;\" ><b>' + restoran.naziv
				+ '</b></p> <span class="popuptext" id="' + restoran.naziv 
				+'"><b>Naziv:</b> '+ restoran.naziv +' </br><b>Adresa:</b> '+ restoran.adresa +' </br><b>Kategorija:</b> '+ restoran.kategorija +'</span>'+
				' </div><div><i id="srceOmiljeniRestoran" class="heart fa fa-heart-o kupacNijeUlogovan"></i></div>' +
				
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


$(document).ready(function() { 
	$.ajax({
		url: 'rest/artikli', //url
		type: "GET" ,
		success : function(artikli) {
			/*
			 * ovo je bio test za top10 artikala iz picai jela , ovo koristi listu svih artikala tako da ce se u buducnosti
			 * izmeniti da koristi samo listu top10 artikala
			 * */
			for (let artikal of artikli) {
				addTop10ArtikalTr(artikal);
			}
			$("#dugmeKojeBriseListuRestorana").hide();
			$("#dugmePonistavanjaFilteraArtikala").hide();
			addSviArtikli(artikli);
			
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
		})
	});
	
	$(document).on("click","#popUpLoginForm",function(e){
		e.preventDefault();
		$("#modal-wrapper").show();
	});
	
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
	
	
		
});


function iskociPopUP(ime) {
	var popup = document.getElementById(ime);
    popup.classList.toggle("show");
}

