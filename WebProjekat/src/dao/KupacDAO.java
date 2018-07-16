package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Kupac;


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
	
}
