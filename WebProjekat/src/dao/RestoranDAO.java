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
import beans.Restoran;

public class RestoranDAO {
	private HashMap<String, Restoran> restorani = new HashMap<String,Restoran>();
	private String contextPath;
	
	public RestoranDAO() {
		// TODO Auto-generated constructor stub
	}
	
	public RestoranDAO(String contextPath) {
		this.contextPath=contextPath;
		loadRestorane(contextPath);
		
		
	}
	
	public ArrayList<Restoran> pronadjiRestorane(String tip){
		ArrayList<Restoran> odgovarajuciRestorani= new ArrayList<Restoran>();
		for(Restoran item : restorani.values()){
			if(item.getKategorija().contains(tip))
				odgovarajuciRestorani.add(item);
		}
		return odgovarajuciRestorani;
		
	}
	
	
	/***
	 * Ucitava restorane iz tekstualne datoteke restorani.txt kao JSON objekat i onda njega pretvara u listu kupaca!
	 * */
	private void loadRestorane(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 restorani = mapper.readValue(new File(contextPath + "/database/restorani.txt"), new TypeReference<Map<String, Restoran>>() {});
			} catch (IOException e) {
				restorani = new HashMap<String,Restoran>();
			}
		System.out.println("broj restorana je " + restorani.size()+".");

	}
	
	/* *
	 * Listu restorana pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void saveRestoran() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, restorani);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/restorani.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista restorana." + restorani.size());
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

	public HashMap<String, Restoran> getRestorani() {
		return restorani;
	}

	public void setRestorani(HashMap<String, Restoran> restorani) {
		this.restorani = restorani;
	}

	/* *
	 * prvo stavljamo svim restoranima boolean vrednsot
	 * "omiljeni" na false , te brisemo sesiju
	 * */
	public String izlogujKupca(HttpServletRequest request) {
		for(Restoran item : restorani.values()){
			if(item.getDaLiJeOmiljeni())
				item.setDaLiJeOmiljeni(false);
		}
		//brisemo sesiju
		HttpSession sesija = request.getSession();
		sesija.invalidate();
		return "ok";
	}

	public Restoran getRestoran(String restoran) {
		for(Restoran item : restorani.values()){
			if(item.getNaziv().equals(restoran))
				return item;
		}
		return null;
	}

	public String izmeniRestoran(Restoran restoran) throws IOException {
		String vrati ="";
		//ukoliko smo menjali naziv, moramo da proverimo da li 
		//restoran vec postoji tu 
		if(!restoran.getNaziv().equals(restoran.getStariNaziv())){
			for(Restoran item : restorani.values()){
				if(item.getNaziv().equals(restoran.getNaziv())){
					vrati="imaNaziv";
					return vrati;
				}
			}
		}
		//nalazimo restoran koji ce se menjati
		Restoran restoranZaIzmenu = null;
		for(Restoran item : restorani.values()){
			if(item.getNaziv().equals(restoran.getStariNaziv())){
				restoranZaIzmenu = item;
				break;
			}
		}
		
		//sada vrsimo izmenu podataka
		
		restoranZaIzmenu.setNaziv(restoran.getNaziv());
		restoranZaIzmenu.setAdresa(restoran.getAdresa());
		restoranZaIzmenu.setKategorija(restoran.getKategorija());
		
		if(vrati.equals("")){
			saveRestoran();
		}
		
		return vrati;
	}

	/*
	 * Funkcija koja dodaje novi restoran!
	 * */
	public String dodajRestoran(Restoran restoran) throws IOException {
		String vrati="";
		for(Restoran item : restorani.values()){
			if(item.getNaziv().equals(restoran.getNaziv())){
				vrati="imaNaziv";
				return vrati;
			}
		}
		if(vrati==""){
			restorani.put(restoran.getNaziv(), restoran);
			saveRestoran();
		}
		
		return vrati;
	}

	public String izbrisiRestoran(String restoran, ArtikalDAO artikalDAO) throws IOException {
		//prvo brisemo restoran
		for(Restoran item : restorani.values()){
			if(item.getNaziv().equals(restoran)){
				item.setObrisan(true);
				saveRestoran();
			}
		}
		
		//sada brisemo svaki artikal iz tog restorana
		for(Artikal item : artikalDAO.getArtikli().values()){
			if(item.getRestoran().equals(restoran)){
				item.setObrisan(true);
			}
		}
		artikalDAO.saveArtikle();
		return "ok";
	}
	
	
}
