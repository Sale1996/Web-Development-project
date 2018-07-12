package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.StringTokenizer;

import beans.Artikal;

public class ArtikalDAO {
	private HashMap<String, Artikal> artikli = new HashMap<String,Artikal>();;

	public ArtikalDAO(String contextPath) {
		loadArtikli(contextPath);
		
	}
	
	private void loadArtikli(String contextPath) {
		BufferedReader in = null;
		try {
			File file = new File(contextPath + "/artikli.txt");
			System.out.println(file.getCanonicalPath());
			in = new BufferedReader(new FileReader(file));
			String line, id = "", naziv = "", jedinicnaCena = "", opis="", kolicina="", tip="",restoran="";
			StringTokenizer st;
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals("") || line.indexOf('#') == 0)
					continue;
				st = new StringTokenizer(line, ";");
				
				id = st.nextToken().trim();
				naziv = st.nextToken().trim();
				jedinicnaCena = st.nextToken().trim();
				opis = st.nextToken().trim();
				kolicina = st.nextToken().trim();
				tip = st.nextToken().trim();
				restoran = st.nextToken().trim();
				
				
				artikli.put(id, new Artikal(naziv,Integer.parseInt(jedinicnaCena),opis, Integer.parseInt(kolicina),tip,restoran));
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
	
	public ArrayList<Artikal> pronadjiPoRestoranu(String restoran){
		ArrayList<Artikal> artikliRestorana = new ArrayList<Artikal>();
		for(Artikal item : artikli.values()){
			if(item.getRestoran().equals(restoran))
				artikliRestorana.add(item);
		}
		return artikliRestorana;
	}
	
	/***
	 * Vraæa sve artikle.
	 * @return
	 */
	public Collection<Artikal> findAll() {
		return artikli.values();
	}
	
	/****
	 * Vrsi pretragu na osnovu artikla koji mu je prosledjen
	 * te vraca listu artikala koji mu odgovaraju
	 * */
	public ArrayList<Artikal> pretraga(Artikal artikal){
		ArrayList<Artikal> artikli1 = new ArrayList<Artikal>();
		for(Artikal item : artikli.values()){
			//provera imena
			if(!artikal.getNaziv().isEmpty())
				if(!artikal.getNaziv().equals(item.getNaziv()))
					continue;
			if(artikal.getJedinicnaCena()>0)
				if(artikal.getJedinicnaCena()>item.getJedinicnaCena())
					continue;
			//NAPOMENA: KOLICINA JE KORISCENA ZA MAX CENU PROIZVODA
			if(artikal.getKolicina()>0)
				if(artikal.getKolicina()<item.getJedinicnaCena())
					continue;
			if(!artikal.getTip().isEmpty())
				if(!artikal.getTip().equals(item.getTip()))
					continue;
			if(!artikal.getRestoran().isEmpty())
				if(!artikal.getRestoran().equals(item.getRestoran()))
					continue;
			
			artikli1.add(item);
		}
		return artikli1;
	}
}
