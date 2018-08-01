package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikal;
import beans.Korisnik;
import beans.Kupac;
import beans.Porudzbina;

public class PorudzbinaDAO {
	private ArrayList<Porudzbina> porudzbine = new ArrayList<>();
	private String contextPath;
	private int trenutniBrojPoruzbine=0;
	
	public PorudzbinaDAO(String contextPath){
		this.contextPath=contextPath;
		loadPorudzbine(contextPath);
	}
	
	/***
	 * Ucitava porudzbine iz tekstualne datoteke porudzbine.txt kao JSON objekat i onda njega pretvara u listu kupaca!
	 * */
	private void loadPorudzbine(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 porudzbine = mapper.readValue(new File(contextPath + "/database/porudzbine.txt"), new TypeReference<ArrayList<Porudzbina>>() {});
			} catch (IOException e) {
				porudzbine = new ArrayList<Porudzbina>();
			}
		System.out.println("broj porudzbina je " + porudzbine.size()+".");

	}
	
	/* *
	 * Listu porudzbina pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void savePorudzbine() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, porudzbine);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/porudzbine.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista porudzbina." + porudzbine.size());
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
	
	public void dodajPorudzbinu(Porudzbina porudzbina) throws IOException{
		//trenutni broj poruzbine koristimo kako bi lakse znali da nadjemo
		//porudzbinu u odredjenim situacijama
		porudzbina.setId(trenutniBrojPoruzbine);
		porudzbine.add(porudzbina);
		trenutniBrojPoruzbine++;
		savePorudzbine();

	}

	public ArrayList<Porudzbina> getPorudzbine() {
		return porudzbine;
	}

	public void setPorudzbine(ArrayList<Porudzbina> porudzbine) {
		this.porudzbine = porudzbine;
	}

	/*
	 * -prvo nalazimo porudzbinu po id-u koji je prosledjen u linku
	 * -zadim iz te porudzbine uzimamo kolicinu narucenog artikla
	 * -u zavisnosti da li je oduzimanje/dodavanje mi smanjujemo/povecavamo taj broj
	 * -postavljamo novu vrednst tog broja u onu mapu
	 * 
	 * */
	public String promeniBrojArtikalaPoruzbine(String artikal, String manjeVise) throws IOException {
		String idPorudzbine = artikal.substring(0,1);
		int idPorudzbeInt = Integer.parseInt(idPorudzbine);
		Porudzbina porudzbinaZaMenjati = porudzbine.get(idPorudzbeInt);
		String idArtikla = artikal.substring(1);
		
		int broj=porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().get(idArtikla);
		if(manjeVise.equals("smanji")){
			broj--;
		}else{
			broj++;
		}
		porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().put(idArtikla, broj);
		
		//sada treba u tom artiklu samo to nametnuti, kako bi mogli da ispisemo
		//jer broj artikala koristimo za ispis
		for(Artikal item : porudzbinaZaMenjati.getArtikli()){
			if(artikal.contains(item.getNaziv())){
				if(artikal.contains(item.getRestoran())){
					item.setBrojArtikala(broj);
					//namestamo novu ukupnu cenu, nista vise
					if(manjeVise.equals("smanji"))
						porudzbinaZaMenjati.setUkupnaCena(porudzbinaZaMenjati.getUkupnaCena()-item.getJedinicnaCena());
					else
						porudzbinaZaMenjati.setUkupnaCena(porudzbinaZaMenjati.getUkupnaCena()+item.getJedinicnaCena());
						
				}
			}
		}
		
		savePorudzbine();
		return artikal;
	}

	//vraca porudzbinu po rednom broju
	//i svim artiklima osvezava kolicinu
	//prema porudzbini koja se trazi
	public Porudzbina vratiPorudzbinu(int redniBrojj) {
		// TODO Auto-generated method stub
		Porudzbina zaVratiti =porudzbine.get(redniBrojj);
		for(Artikal item : zaVratiti.getArtikli()){
			item.setBrojArtikala(zaVratiti.getMapaARTIKALbrojPorudzbina().get(item.getNaziv()+item.getRestoran()));
		}
		
		return zaVratiti;
	}

	/*
	 * Uklanja artikal iz porudzbine i smanjuje ukupnu cenu naspram artikla
	 * */
	public String ukloniArtikalIzPorudzbine(String dodatak) throws IOException {
		String idPorudzbine = dodatak.substring(0, 1);
		int idPorudzbineInt = Integer.parseInt(idPorudzbine);
		
		Porudzbina porudzbinaZaMenjati= porudzbine.get(idPorudzbineInt);
		
		for(Artikal item : porudzbinaZaMenjati.getArtikli()){
			if(dodatak.contains(item.getNaziv())){
				if(dodatak.contains(item.getRestoran())){
					//namestamo ukupnu cenu
					int ukupnaCenaArtikla= item.getJedinicnaCena()*porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().get(item.getNaziv()+item.getRestoran());
					porudzbinaZaMenjati.setUkupnaCena(porudzbinaZaMenjati.getUkupnaCena()-ukupnaCenaArtikla);
					//izbacujemo artikal iz liste i mape
					porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().remove(item.getNaziv()+item.getRestoran());
					porudzbinaZaMenjati.getArtikli().remove(item);
					break;
				}
			}
		}
		
		savePorudzbine();

		return idPorudzbine;
	}
/*
 * Promena kupca jedne porudzbine
 * */
	public Porudzbina promeniKupcaPorudzbine(String porudzbinaID, Korisnik kupacKorisnickoIme,KupacDAO dao) throws IOException {
		//prvo nalazimo kupca
		Kupac noviKupac=null;
		for(Kupac item : dao.getKupci().values()){
			if(item.getKorisnickoIme().equals(kupacKorisnickoIme.getKorisnickoIme()))
				noviKupac=item;
		}
		Porudzbina porudzbinaZaMenjati=porudzbine.get(Integer.parseInt(porudzbinaID));
		porudzbinaZaMenjati.setKupacKojiNarucuje(noviKupac);
		savePorudzbine();
		
		return porudzbinaZaMenjati;
	}
}
