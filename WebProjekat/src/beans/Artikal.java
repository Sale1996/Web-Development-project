package beans;


public class Artikal {
   private String naziv;
   private int jedinicnaCena;
   private String opis;
   private int kolicina;
   private String tip;
   private String restoran;
   private int brojArtikala; //koristice se samo prilikom porudzbine
   private String stariNaziv;  
   private Boolean obrisan;
   private int kolikoSamPutaKupljen; //cuva informaciju koliko je puta narucen artikal
   
   
   
   
   
	public Artikal(String naziv, int jedinicnaCena, String opis, int kolicina, String tip, String restoran) {
		super();
		this.naziv = naziv;
		this.jedinicnaCena = jedinicnaCena;
		this.opis = opis;
		this.kolicina = kolicina;
		this.tip = tip;
		this.restoran= restoran;
		this.obrisan=false;
		this.kolikoSamPutaKupljen=0;
	}

    public Artikal(){
    	this.obrisan=false;
    	this.kolikoSamPutaKupljen=0;
    }




	public String getNaziv() {
		return naziv;
	}






	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}






	public int getJedinicnaCena() {
		return jedinicnaCena;
	}






	public void setJedinicnaCena(int jedinicnaCena) {
		this.jedinicnaCena = jedinicnaCena;
	}






	public String getOpis() {
		return opis;
	}






	public void setOpis(String opis) {
		this.opis = opis;
	}






	public int getKolicina() {
		return kolicina;
	}






	public void setKolicina(int kolicina) {
		this.kolicina = kolicina;
	}






	public String getRestoran() {
		return restoran;
	}






	public void setRestoran(String restoran) {
		this.restoran = restoran;
	}






	public String getTip() {
		return tip;
	}






	public void setTip(String tip) {
		this.tip = tip;
	}

	public int getBrojArtikala() {
		return brojArtikala;
	}

	public void setBrojArtikala(int brojArtikala) {
		this.brojArtikala = brojArtikala;
	}

	public String getStariNaziv() {
		return stariNaziv;
	}

	public void setStariNaziv(String stariNaziv) {
		this.stariNaziv = stariNaziv;
	}

	public Boolean getObrisan() {
		return obrisan;
	}

	public void setObrisan(Boolean obrisan) {
		this.obrisan = obrisan;
	}

	public int getKolikoSamPutaKupljen() {
		return kolikoSamPutaKupljen;
	}

	public void setKolikoSamPutaKupljen(int kolikoSamPutaKupljen) {
		this.kolikoSamPutaKupljen = kolikoSamPutaKupljen;
	}
	
	

}