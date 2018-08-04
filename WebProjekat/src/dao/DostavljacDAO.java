package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Dostavljac;
import beans.Porudzbina;
import beans.Vozilo;

public class DostavljacDAO {
	private HashMap<String,Dostavljac> dostavljaci = new HashMap<String,Dostavljac>();
	private String contextPath;
	
	public DostavljacDAO(String contextPath){
		this.contextPath=contextPath;
		System.out.println("contextPath:"+ contextPath);
		
		loadAdministratori(contextPath);
	}
	
	/* *
	 * Ucitava dostavljace iz tekstualne datoteke dostavljaci.txt
	 * */
	private void loadAdministratori(String contextPath) {
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 dostavljaci = mapper.readValue(new File(contextPath + "/database/dostavljaci.txt"), new TypeReference<Map<String, Dostavljac>>() {});
			} catch (IOException e) {
				dostavljaci = new HashMap<String,Dostavljac>();
			}
		System.out.println("broj dostavljaca je " + dostavljaci.size()+".");		
	}
	
	
	/* *
	 * Listu administratora pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void saveDostavljac() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, dostavljaci);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/dostavljaci.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista dostavljaca." + dostavljaci.size());
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

	public HashMap<String, Dostavljac> getDostavljaci() {
		return dostavljaci;
	}

	public void setDostavljaci(HashMap<String, Dostavljac> dostavljaci) {
		this.dostavljaci = dostavljaci;
	}

	/*
	 * Promena vozila dostavljacu!
	 * */
	public Vozilo postaviVoziloDostavljaca(String registarskaOznaka, VoziloDAO voziloDao, HttpServletRequest request) throws IOException {
		HttpSession sesija = request.getSession();
		Dostavljac dostavljac = (Dostavljac) sesija.getAttribute("korisnik");
		//postavljamo novo vozilo
		Vozilo vozilo=null;
		if(dostavljac.getVozilo()==null){
			 vozilo = voziloDao.getVozila().get(registarskaOznaka);
			vozilo.setDaLiJeUUpotrebi(true);
			dostavljac.setVozilo(vozilo);
		}else{
			 vozilo = voziloDao.getVozila().get(registarskaOznaka);
			vozilo.setDaLiJeUUpotrebi(true);
			//oslobadjamo predhodno vozilo
			dostavljac.getVozilo().setDaLiJeUUpotrebi(false);
			dostavljac.setVozilo(vozilo);
		}
		saveDostavljac();
		
		return vozilo;
	}

	public Porudzbina preuzmiPorudzbinu(String idPorudzbine, HttpServletRequest request, PorudzbinaDAO porudzbinaDao) throws IOException {
		HttpSession session = request.getSession();
		Dostavljac dostavljac = (Dostavljac) session.getAttribute("korisnik");
		
		Porudzbina porudzbinaZaPreuzeti = porudzbinaDao.getPorudzbine().get(Integer.parseInt(idPorudzbine));
		
		porudzbinaZaPreuzeti.setDostavljac(dostavljac);
		
		porudzbinaDao.savePorudzbine();
		saveDostavljac();
		
		
		return porudzbinaZaPreuzeti;
	}

}
