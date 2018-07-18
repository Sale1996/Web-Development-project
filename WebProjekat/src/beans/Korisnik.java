package beans;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;


public class Korisnik {
   protected String korisnickoIme;
   protected String lozinka;
   protected String lozinka2;
   protected String ime;
   protected String prezime;
   protected String uloga;
   protected String kontaktTelefon;
   protected String emailAdresa;
   protected LocalDateTime datumRegistracije;
 //  protected Date datum;
   
   public Korisnik(){
		this.datumRegistracije = LocalDateTime.now();
	//	Instant instant= datumRegistracije.toInstant(null);
		//datum = Date.from(instant);
		

   }
   
   
   
	public Korisnik(String korisnickoIme, String lozinka, String ime, String prezime, String uloga, String kontaktTelefon,
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
			//Instant instant= datumRegistracije.toInstant(null);
			//datum = Date.from(instant);
			
}



	public String getKorisnickoIme() {
		return korisnickoIme;
		
	}
	public void setKorisnickoIme(String korisnickoIme) {
		this.korisnickoIme = korisnickoIme;
	}
	public String getLozinka() {
		return lozinka;
	}
	public void setLozinka(String lozinka) {
		this.lozinka = lozinka;
	}
	public String getIme() {
		return ime;
	}
	public void setIme(String ime) {
		this.ime = ime;
	}
	public String getPrezime() {
		return prezime;
	}
	public void setPrezime(String prezime) {
		this.prezime = prezime;
	}
	public String getUloga() {
		return uloga;
	}
	public void setUloga(String uloga) {
		this.uloga = uloga;
	}
	public String getKontaktTelefon() {
		return kontaktTelefon;
	}
	public void setKontaktTelefon(String kontaktTelefon) {
		this.kontaktTelefon = kontaktTelefon;
	}
	public String getEmailAdresa() {
		return emailAdresa;
	}
	public void setEmailAdresa(String emailAdresa) {
		this.emailAdresa = emailAdresa;
	}
	public LocalDateTime getDatumRegistracije() {
		return datumRegistracije;
	}
	public void setDatumRegistracije(LocalDateTime datumRegistracije) {
		this.datumRegistracije = datumRegistracije;
	}



	public String getLozinka2() {
		return lozinka2;
	}



	public void setLozinka2(String lozinka2) {
		this.lozinka2 = lozinka2;
	}


/*
	public Date getDatum() {
		return datum;
	}



	public void setDatum(Date datum) {
		this.datum = datum;
	}
   */

}
