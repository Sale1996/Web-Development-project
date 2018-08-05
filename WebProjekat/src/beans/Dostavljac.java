package beans;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class Dostavljac extends Korisnik {
	private Vozilo vozilo;
	
	public Dostavljac(){
		
	}
   
	public Dostavljac(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, String kontaktTelefon,
			String emailAdresa) {
				super(korisnickoIme,lozinka,ime,prezime,uloga,kontaktTelefon,emailAdresa);
			
				
	}

	public Vozilo getVozilo() {
		return vozilo;
	}

	public void setVozilo(Vozilo vozilo) {
		this.vozilo = vozilo;
	}
}