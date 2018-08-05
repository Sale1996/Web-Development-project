package beans;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;

import sun.util.calendar.LocalGregorianCalendar.Date;

public class Porudzbina {
   private String statusPorudzbine;
   private String napomena;
   private int id;
   
   private HashMap<String,Integer> mapaARTIKALbrojPorudzbina= new HashMap<String,Integer>();
   private ArrayList<Artikal> artikli = new ArrayList<Artikal>();
   private Kupac kupacKojiNarucuje;
   private Dostavljac dostavljac;
   private int ukupnaCena;
   private Boolean obrisana;
   private int dan;
   private int mesec;
   private int godina;
   
   
   public Porudzbina(){
	   this.ukupnaCena=0;
	   this.obrisana=false;
	   LocalDateTime datumRegistracije = LocalDateTime.now();;
	   godina= datumRegistracije.getYear();
	   mesec =  datumRegistracije.getMonthValue();
	   dan = datumRegistracije.getDayOfMonth();
   }

	public Porudzbina(String statusPorudzbine, Kupac kupacKojiNarucuje) {
		this.statusPorudzbine = statusPorudzbine;
		this.kupacKojiNarucuje = kupacKojiNarucuje;
		this.ukupnaCena=0;
		this.obrisana=false;
		LocalDateTime datumRegistracije = LocalDateTime.now();;
		godina= datumRegistracije.getYear();
		mesec =  datumRegistracije.getMonthValue();
		dan = datumRegistracije.getDayOfMonth();
	}
	
	
	public void addArtikal(Artikal artikal){
		String artikal1 = artikal.getNaziv()+artikal.getRestoran();
		if(mapaARTIKALbrojPorudzbina.containsKey(artikal1)){
			Integer broj=mapaARTIKALbrojPorudzbina.get(artikal1);
			mapaARTIKALbrojPorudzbina.put(artikal1, broj+1);
		}
		else{
			mapaARTIKALbrojPorudzbina.put(artikal1, 1);
		}
		//ovde cuvamo konkretne objekte artikala zbog informacija
		//ne zelimo duplikate pa smo uveli ovu zastitu
		if(!artikli.contains(artikal))
			artikli.add(artikal);
	}
	
	//GETERI I SETERI



	public String getStatusPorudzbine() {
		return statusPorudzbine;
	}

	public void setStatusPorudzbine(String statusPorudzbine) {
		this.statusPorudzbine = statusPorudzbine;
	}

	public String getNapomena() {
		return napomena;
	}

	public void setNapomena(String napomena) {
		this.napomena = napomena;
	}

	public HashMap<String, Integer> getMapaARTIKALbrojPorudzbina() {
		return mapaARTIKALbrojPorudzbina;
	}

	public void setMapaARTIKALbrojPorudzbina(HashMap<String, Integer> mapaARTIKALbrojPorudzbina) {
		this.mapaARTIKALbrojPorudzbina = mapaARTIKALbrojPorudzbina;
	}

	public Kupac getKupacKojiNarucuje() {
		return kupacKojiNarucuje;
	}

	public void setKupacKojiNarucuje(Kupac kupacKojiNarucuje) {
		this.kupacKojiNarucuje = kupacKojiNarucuje;
	}

	public Dostavljac getDostavljac() {
		return dostavljac;
	}

	public void setDostavljac(Dostavljac dostavljac) {
		this.dostavljac = dostavljac;
	}

	public ArrayList<Artikal> getArtikli() {
		return artikli;
	}

	public void setArtikli(ArrayList<Artikal> artikli) {
		this.artikli = artikli;
	}

	public int getUkupnaCena() {
		return ukupnaCena;
	}

	public void setUkupnaCena(int ukupnaCena) {
		this.ukupnaCena = ukupnaCena;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Boolean getObrisana() {
		return obrisana;
	}

	public void setObrisana(Boolean obrisana) {
		this.obrisana = obrisana;
	}

	public int getDan() {
		return dan;
	}

	public void setDan(int dan) {
		this.dan = dan;
	}

	public int getMesec() {
		return mesec;
	}

	public void setMesec(int mesec) {
		this.mesec = mesec;
	}

	public int getGodina() {
		return godina;
	}

	public void setGodina(int godina) {
		this.godina = godina;
	}
	//stavlja trenutno vreme
	public void postaviVreme() {
		// TODO Auto-generated method stub
		LocalDateTime datumRegistracije = LocalDateTime.now();;
		godina= datumRegistracije.getYear();
		mesec =  datumRegistracije.getMonthValue();
	    dan = datumRegistracije.getDayOfMonth();
	}
	
   
   
   
   
}