package beans;

import java.util.ArrayList;

public class Restoran {
   private String naziv;
   private String adresa;
   private String kategorija;
   private Boolean daLiJeOmiljeni;
   
   //private ArrayList<Artikal> jela;
  // private ArrayList<Artikal> pica;
   
   
	public Restoran(String naziv, String adresa, String kategorija) {
		super();
		this.naziv = naziv;
		this.adresa = adresa;
		this.kategorija = kategorija;
		//this.jela = new ArrayList<Artikal>();
		//this.pica = new ArrayList<Artikal>();
	}

	public Restoran(){}

	public String getNaziv() {
		return naziv;
	}


	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}


	public String getAdresa() {
		return adresa;
	}


	public void setAdresa(String adresa) {
		this.adresa = adresa;
	}


	public String getKategorija() {
		return kategorija;
	}


	public void setKategorija(String kategorija) {
		this.kategorija = kategorija;
	}

	public Boolean getDaLiJeOmiljeni() {
		return daLiJeOmiljeni;
	}

	public void setDaLiJeOmiljeni(Boolean daLiJeOmiljeni) {
		this.daLiJeOmiljeni = daLiJeOmiljeni;
	}

/*
	public ArrayList<Artikal> getJela() {
		return jela;
	}


	public void setJela(ArrayList<Artikal> jela) {
		this.jela = jela;
	}


	public ArrayList<Artikal> getPica() {
		return pica;
	}


	public void setPica(ArrayList<Artikal> pica) {
		this.pica = pica;
	}
	*/
	
   
   
   
}
