package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikal;
import beans.Porudzbina;

public class PorudzbinaDAO {
	private ArrayList<Porudzbina> porudzbine = new ArrayList<>();
	private String contextPath;
	
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
	        System.out.println("Sacuvana lista artikala." + porudzbine.size());
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
	
	public void dodajPorudzbinu(Porudzbina porudzbina){
		porudzbine.add(porudzbina);
	}

	public ArrayList<Porudzbina> getPorudzbine() {
		return porudzbine;
	}

	public void setPorudzbine(ArrayList<Porudzbina> porudzbine) {
		this.porudzbine = porudzbine;
	}
}
