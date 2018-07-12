package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.StringTokenizer;

import beans.Restoran;

public class RestoranDAO {
	private HashMap<String, Restoran> restorani = new HashMap<String,Restoran>();
	
	public RestoranDAO() {
		// TODO Auto-generated constructor stub
	}
	
	public RestoranDAO(String contextPath) {
		loadRestorani(contextPath);
		
	}
	
	public ArrayList<Restoran> pronadjiRestorane(String tip){
		ArrayList<Restoran> odgovarajuciRestorani= new ArrayList<Restoran>();
		for(Restoran item : restorani.values()){
			if(item.getKategorija().contains(tip))
				odgovarajuciRestorani.add(item);
		}
		return odgovarajuciRestorani;
		
	}
	
	
	
	
	
	
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
		
	}
}
