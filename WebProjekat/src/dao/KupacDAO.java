package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikal;
import beans.Kupac;
import beans.Porudzbina;
import beans.Restoran;


public class KupacDAO {
	private HashMap<String,Kupac> kupci = new HashMap<String,Kupac>();	//kupci
	private String contextPath;
	
	public KupacDAO(String contextPath) {
		this.contextPath=contextPath;
		System.out.println("contextPath: " + contextPath);

		loadKupce(contextPath);
	}
	
	/***
	 * Ucitava kupce iz tekstualne datoteke kupci.txt kao JSON objekat i onda njega pretvara u listu kupaca!
	 * */
	private void loadKupce(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
	        	kupci = mapper.readValue(new File(contextPath + "/database/kupci.txt"), new TypeReference<Map<String, Kupac>>() {});
			} catch (IOException e) {
				kupci = new HashMap<String,Kupac>();
			}
		System.out.println("broj kupaca je " + kupci.size()+".");

	}
	
	/* *
	 * Listu kupaca pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void saveKupac() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, kupci);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/kupci.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista kupaca." + kupci.size());
	    } catch(IOException ioe) {
	        // Handle exception here
	        ioe.printStackTrace();
	    } finally {
	        try {
	        	if (fos!=null)
	        		fos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	    }
	
	}
	
	/**
	 * Metoda proverava da li je unos u formi validan, pa ako jeste
	 * dodaje kupca u listu kupaca i cuva je 
	 * inace vraca string greske koji govori sta je sve greska
	 * */
	public String dodajNovogKorisnika(Kupac kupac) throws IOException {
		String vrati="";
		if(kupci.size()>0){
			for(Kupac item : kupci.values()){
				if(item.getKorisnickoIme().equals(kupac.getKorisnickoIme()))
					vrati+="ImaIme";
				if(item.getEmailAdresa().equals(kupac.getEmailAdresa()))
					vrati+="ImaEmail";
			}
		}
		
		if(vrati.isEmpty()){
			kupci.put(kupac.getKorisnickoIme(), kupac);
			saveKupac();
		}
		
		return vrati;
	}
	
	/* *
	 * Funkcija koja dodaje dati restoran u listu omiljenih restorana
	 * ulogovanog kupca ili u slucaju ako je vec omiljen, onda ga brise 
	 * */
	public String omiljeniRestoran(String restoran,RestoranDAO restoranDao, HttpServletRequest request)throws IOException{
		HashMap<String, Restoran> restorani = restoranDao.getRestorani();
		Restoran noviOmiljeniRestoran= null;
		for(Restoran item : restorani.values()){
			if(item.getNaziv().equals(restoran)){
				noviOmiljeniRestoran = item;
				break;
			}
		}
		
		HttpSession session = request.getSession();
		Kupac ulogovanKorisnik= (Kupac) session.getAttribute("korisnik");
		ulogovanKorisnik.dodajIliObrisiOmiljeniRestoran(noviOmiljeniRestoran);
		saveKupac();
		
		return "OK";
		
	}
	

	public HashMap<String, Kupac> getKupci() {
		return kupci;
	}

	public void setKupci(HashMap<String, Kupac> kupci) {
		this.kupci = kupci;
	}

	/* *
	 * Metoda koja ce uzeti poruzbinu iz sesije i dodati joj artikal za porudzbinu..
	 * */
	public String poruciArtikal(String artikal, HttpServletRequest request,ArtikalDAO artikalDao) {
		HttpSession session = request.getSession();
		/*
		 * Preuzimamo porudzbinu iz sessije, ako je nema onda uzimamo i pravimo novu..
		 * Ubacujemo kupca koji pravi porudzbinu
		 * */
		Porudzbina porudzbina = (Porudzbina) session.getAttribute("porudzbina");
		Kupac kupac = (Kupac) session.getAttribute("korisnik");
		if(porudzbina==null){
			porudzbina=new Porudzbina("poruceno",kupac);
			session.setAttribute("porudzbina", porudzbina);
		}
		//sada uzimamo svu listu artikala i gledamo koji artikal odgovara prosledjenom
		HashMap<String, Artikal> artikli = artikalDao.getArtikli();
		Artikal artikalZaPoruciti=null;
		
		//posto je string artikal iz unikatne kombinacije imena artikal i imena restorana
		//mi proveravamo ako on sadrzi oba od jednog artikla znaci da smo ga nasli
		for(Artikal item : artikli.values()){
			if(artikal.contains(item.getNaziv())){
				if(artikal.contains(item.getRestoran())){
					artikalZaPoruciti=item;
					break;
				}
			}
		}
		
		porudzbina.addArtikal(artikalZaPoruciti);
		
		
		return "Prolo dodavanje";
	}

	/* *
	 * Metod koji vraca trenutnu porudzbinu iz sesije sa izracunatiom 
	 * ukupnom cenom
	 * */
	public Porudzbina vratiTrenutnuPorudzbinu(HttpServletRequest request) {
		HttpSession sesija = request.getSession();
		Porudzbina porudzbina = (Porudzbina) sesija.getAttribute("porudzbina");
		if(porudzbina!=null){
			//sada idemo kroz listu svih artikala porudzbine i sabiramo cene
			ArrayList<Artikal> artikli = porudzbina.getArtikli();
			int ukupnaCenaPorudzbine =0 ;
			for(Artikal item : artikli){
				int brojKopija = porudzbina.getMapaARTIKALbrojPorudzbina().get(item.getNaziv()+item.getRestoran());
				item.setBrojArtikala(brojKopija); //ubacili smo u artikal koliko puta se on ponavlja cisto da bi smo lakse odradili tamo prilikom priakza porudzbine
				ukupnaCenaPorudzbine+= brojKopija * item.getJedinicnaCena();
			}
			
			porudzbina.setUkupnaCena(ukupnaCenaPorudzbine);
		}
		
		
		return porudzbina;
	}
	
	 
	
}
