package dao;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Kupac;
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
	
	
	
	
	
	/*
	private void loadRestorani(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "/restorani.txt");
			System.out.println(file.getCanonicalPath());
			in = new BufferedReader(new FileReader(file));
			String line, id = "", naziv = "", adresa = "", kategorija="";
			StringTokenizer st;
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				while (st.hasMoreTokens()) {
					id = st.nextToken().trim();
					naziv = st.nextToken().trim();
					adresa = st.nextToken().trim();
					kategorija = st.nextToken().trim();
				}
				restorani.put(id, new Restoran(naziv,adresa,kategorija));
				saveRestoran();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
		
	}*/
	
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
	
	
}
