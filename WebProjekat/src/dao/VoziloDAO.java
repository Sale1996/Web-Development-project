package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Dostavljac;
import beans.Vozilo;

public class VoziloDAO {
	private HashMap<String,Vozilo> vozila = new HashMap<String,Vozilo>();
	private String contextPath;
	
	public VoziloDAO() {
		
	}
	
	public VoziloDAO(String contextPath){
		this.contextPath = contextPath;
		loadVozila(contextPath);
	}
	
	/***
	 * Ucitava vozila iz tekstualne datoteke vozila.txt kao JSON objekat i onda njega pretvara u listu kupaca!
	 * */
	private void loadVozila(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 vozila = mapper.readValue(new File(contextPath + "/database/vozila.txt"), new TypeReference<Map<String, Vozilo>>() {});
			} catch (IOException e) {
				vozila = new HashMap<String,Vozilo>();
			}
		System.out.println("broj vozila je " + vozila.size()+".");

	}
	
	/* *
	 * Listu restorana pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void saveVozilo() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, vozila);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/vozila.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista vozila." + vozila.size());
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

	public HashMap<String, Vozilo> getVozila() {
		return vozila;
	}

	public void setVozila(HashMap<String, Vozilo> vozila) {
		this.vozila = vozila;
	}

	//vraca sva vozila
	public Collection<Vozilo> vratiSvaVozila() {
		
		return vozila.values();
	}

	/*
	 * dodaje vozilo
	 * */
	public String dodajNovoVozilo(Vozilo vozilo) throws IOException {
		String vrati="";
		if(vozila.size()!=0){
			for(Vozilo item : vozila.values()){
				if(vozilo.getRegistarskaOznaka().equals(item.getRegistarskaOznaka())){
					vrati="imaRegistarska";
					return vrati;
				}
			}
			
		}
		
		if(vrati==""){
			vozila.put(vozilo.getRegistarskaOznaka(), vozilo);
			saveVozilo();
		}
		return vrati;
	}

	//vraca vozilo po prosledjenoj registarskoj oznaci u stringu vozilo
	public Vozilo vratiVozilo(String vozilo) {
		
		for(Vozilo item : vozila.values()){
			if(item.getRegistarskaOznaka().equals(vozilo)){
				return item;
			}
		}
		
		return null;
	}

	//menja vozilo
	public String izmeniVozilo(Vozilo vozilo) throws IOException {
		String vrati ="";
		
		//prvo proveravamo ako smo promenuli registarsku oznaku
		//da li ima vec te oznake jer to mora biti jedinstveno
		if(!vozilo.getStaraRegistarskaOznaka().equals(vozilo.getRegistarskaOznaka())){
			for(Vozilo item : vozila.values()){
				if(item.getRegistarskaOznaka().equals(vozilo.getRegistarskaOznaka())){
					vrati="imaRegistracija";
					return vrati;
				}
			}
		}
		
		//ako smo prosli dovde znaci da je sve uredu bilo gore
		//i mozemo da nadjemo vozilo koje odgovara registarskog tabli(staroj)
		//i da izmenimo podatke i da sacuvamo!
		Vozilo voziloZaIzmenu = null;
		for(Vozilo item : vozila.values()){
			if(item.getRegistarskaOznaka().equals(vozilo.getStaraRegistarskaOznaka())){
				voziloZaIzmenu=item;
				break;
			}
		}
		
		voziloZaIzmenu.setGodinaProizvodnje(vozilo.getGodinaProizvodnje());
		voziloZaIzmenu.setMarka(vozilo.getMarka());
		voziloZaIzmenu.setModel(vozilo.getModel());
		voziloZaIzmenu.setNapomena(vozilo.getNapomena());
		voziloZaIzmenu.setRegistarskaOznaka(vozilo.getRegistarskaOznaka());
		voziloZaIzmenu.setTip(vozilo.getTip());
		
		//ovo sto smo uradili jeste da smo updejtali kljuc u mapi
		//u slucaju da smo promenili registarsku oznaku vozila
		vozila.put(voziloZaIzmenu.getRegistarskaOznaka(), vozila.remove(vozilo.getStaraRegistarskaOznaka()));
		
		saveVozilo();
		
		
		return vrati;
	}
//brisanje vozila
	public String obrisiVozilo(String vozilo, DostavljacDAO dostavljacDao) throws IOException {
		//trazimo vozilo
		Vozilo voziloZaBrisati=null;
		for(Vozilo item : vozila.values()){
			if(item.getRegistarskaOznaka().equals(vozilo)){
				item.setObrisan(true);
				saveVozilo();
				voziloZaBrisati=item;
				break;
			}
		}
		
		//brisemo vozilo od dostavljaca, ukoliko je zauzeto!
		if(voziloZaBrisati.getDaLiJeUUpotrebi()){
			for(Dostavljac item : dostavljacDao.getDostavljaci().values()){
				if(item.getVozilo().getRegistarskaOznaka().equals(voziloZaBrisati.getRegistarskaOznaka())){
					item.setVozilo(null);
					break;
				}
			}
		}
		return "ok";
	}
	
	
	
}
