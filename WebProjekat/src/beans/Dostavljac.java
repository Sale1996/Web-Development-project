package beans;

import java.time.LocalDateTime;
import java.util.ArrayList;

public class Dostavljac extends Korisnik {
	private Vozilo vozilo;
	private ArrayList<Porudzbina> porudzbineDodeljeneMeni = new ArrayList<Porudzbina>();
	
	public Dostavljac(){
		
	}
   
	public Dostavljac(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, String kontaktTelefon,
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