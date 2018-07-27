package beans;

import java.time.LocalDateTime;

public class Administrator extends Korisnik {
	
	public Administrator(){
		
	}
	public Administrator(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, String kontaktTelefon,
			String emailAdresa) {
				super();
				this.korisnickoIme = korisnickoIme;
				this.lozinka = lozinka;
				this.ime = ime;
				this.prezime = prezime;
				this.uloga = uloga;
				this.kontaktTelefon = kontaktTelefon;
				this.emailAdresa = emailAdresa;
				this.datumRegistracije = LocalDateTime.now();
				
	}
	
}
