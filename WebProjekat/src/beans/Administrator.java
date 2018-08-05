package beans;

import java.time.LocalDateTime;

public class Administrator extends Korisnik {
	
	public Administrator(){
		
	}
	public Administrator(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, String kontaktTelefon,
			String emailAdresa) {
		
			super(korisnickoIme,lozinka,ime,prezime,uloga,kontaktTelefon,emailAdresa);

				
	}
	
}
