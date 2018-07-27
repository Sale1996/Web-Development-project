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
						
						let tdIzmeni = $('<td><a href="/rest/artikli/'+artikal.naziv+artikal.restoran+'">Izmeni</a></td>');
						let tdObrisi=$('<td><a href="/rest/artikli/'+artikal.naziv+artikal.restoran+'">Obrisi</a></td>');
						tr.append(tdNaziv).append(tdIzmeni).append(tdObrisi);
						$('#adminTabela tbody').append(tr);
				 }
			 }
		 });
	 });
	
	 function iskociPopUP(ime) {
			var popup = document.getElementById(ime);
		    popup.classList.toggle("show");
		}
	
});