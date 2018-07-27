package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Administrator;

public class AdministratorDAO {
	private HashMap<String,Administrator> administratori = new HashMap<String,Administrator>();
	private String contextPath;
	
	public AdministratorDAO(String contextPath) throws IOException{
		this.contextPath=contextPath;
		System.out.println("contextPath:"+ contextPath);
		Administrator administratorMarko = new Administrator("Admin","admin","Marko","Markovic","admin","066123456","mmarkovic@gmail.com");
		administratori.put(administratorMarko.getKorisnickoIme(), administratorMarko);
		saveAdmin();
	//	loadAdministratori(contextPath);
	}
	/* *
	 * Ucitava administratore iz tekstualne datoteke administarotir.txt
	 * */
	private void loadAdministratori(String contextPath) {
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 administratori = mapper.readValue(new File(contextPath + "/database/administratori.txt"), new TypeReference<Map<String, Administrator>>() {});
			} catch (IOException e) {
				administratori = new HashMap<String,Administrator>();
			}
		System.out.println("broj administratora je " + administratori.size()+".");		
	}
	
	/* *
	 * Listu administratora pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void saveAdmin() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, administratori);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/administratori.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista administratora." + administratori.size());
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
	 * dodaje administartora u listu administratora i cuva je 
	 * inace vraca string greske koji govori sta je sve greska
	 * */
	public String dodajNovogKorisnika(Administrator admin) throws IOException {
		String vrati="";
		if(administratori.size()>0){
			for(Administrator item : administratori.values()){
				if(item.getKorisnickoIme().equals(admin.getKorisnickoIme()))
					vrati+="ImaIme";
				if(item.getEmailAdresa().equals(admin.getEmailAdresa()))
					vrati+="ImaEmail";
			}
		}
		
		if(vrati.isEmpty()){
			administratori.put(admin.getKorisnickoIme(), admin);
			saveAdmin();
		}
		
		return vrati;
	}
	public HashMap<String, Administrator> getAdministratori() {
		return administratori;
	}
	public void setAdministratori(HashMap<String, Administrator> administratori) {
		this.administratori = administratori;
	}

}
