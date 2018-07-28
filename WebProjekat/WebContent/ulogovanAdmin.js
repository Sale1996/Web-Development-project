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
		 $('#adminTabela tbody tr').remove();
		 
		 $.ajax({
			 url:'rest/artikli',
			 type: "GET",
			 success: function(artikli){
				 let tr=$('<tr></tr>');
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
						let tdObrisi=$('<td><a style="color:red" href="/WebProjekat/rest/artikli/'+artikal.naziv+artikal.restoran+'">Obrisi</a></td>');
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
						 //ukoliko je neki red menija bio selektovan, moramo da obrisemo tu selekciju
						 $("[class*='selektovanaTabelaAdmin']").removeClass('selektovanaTabelaAdmin');

						
					}
					//ukoliko vec ima email u povratnom stringu ce se naglasiti
					if(string.includes("Naziv")){
						$('#errorNazivArtiklaIzmena').text('Artikal sa datim imenom u istom restoranu vec postoji!');
						$('#errorNazivArtiklaIzmena').show().delay(9000).fadeOut();
					}
				}
			});
			
		});
	
	 function iskociPopUP(ime) {
			var popup = document.getElementById(ime);
		    popup.classList.toggle("show");
		}
	
});