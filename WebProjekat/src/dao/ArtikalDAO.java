package dao;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikal;
import beans.Restoran;

public class ArtikalDAO {
	private HashMap<String, Artikal> artikli = new HashMap<String,Artikal>();
	private String contextPath;
	
	public ArtikalDAO(String contextPath) {
		this.contextPath = contextPath;
		loadArtikle(contextPath);
		
	}

	
	/***
	 * Ucitava artikle iz tekstualne datoteke artikli.txt kao JSON objekat i onda njega pretvara u listu kupaca!
	 * */
	private void loadArtikle(String contextPath){
		ObjectMapper mapper = new ObjectMapper();
		 try {
			 artikli = mapper.readValue(new File(contextPath + "/database/artikli.txt"), new TypeReference<Map<String, Artikal>>() {});
			} catch (IOException e) {
				artikli = new HashMap<String,Artikal>();
			}
		System.out.println("broj artikala je " + artikli.size()+".");

	}
	
	/* *
	 * Listu artikala pretvara u JSON objekat i njega serijalizuje u txt fajl
	 * */
	public void saveArtikle() throws IOException{

	    ByteArrayOutputStream out = new ByteArrayOutputStream();
	    ObjectMapper mapper = new ObjectMapper();

	    try {
			mapper.writeValue(out, artikli);
		} catch (IOException e) {
			e.printStackTrace();
		}

	    FileOutputStream fos = null;
	    try {	    
	        fos = new FileOutputStream(contextPath + "/database/artikli.txt"); 
	        out.writeTo(fos);
	        System.out.println("Sacuvana lista artikala." + artikli.size());
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


	public HashMap<String, Artikal> getArtikli() {
		return artikli;
	}


	public void setArtikli(HashMap<String, Artikal> artikli) {
		this.artikli = artikli;
	}

  /* *
   * Funkcija koja nam vraca artikal koji odgovara ovom prosledejnom stringu
   * */
	public Artikal pronadjiArtikal(String artikal) {
		for(Artikal item : artikli.values()){
			if(artikal.contains(item.getNaziv())){
				if(artikal.contains(item.getRestoran())){
					return item;
				}
			}
		}
		return null;
	}


	public String izmeniArtikal(Artikal artikal) throws IOException {
		String vrati="";
		/* *
		 * 
		 * */
		//ako smo promenili naziv artikla moramo da prodjemo kroz artikle
		//jednog restorana i proveriti da li ima nekog vec sa tim imenom
		if(!artikal.getNaziv().equals(artikal.getStariNaziv())){
			for(Artikal item : artikli.values()){
				if(artikal.getRestoran().equals(item.getRestoran())){
					if(artikal.getNaziv().equals(item.getNaziv())){
						vrati = "ImaNaziv";
						return vrati;
					}
				}
			}
		}
		//ako nema greske, idemo da nadjemo taj artikal...
		Artikal artikalZaIzmenu = null;
		for(Artikal item : artikli.values()){
			if(item.getRestoran().equals(artikal.getRestoran())){
				if(item.getNaziv().equals(artikal.getStariNaziv())){
					artikalZaIzmenu=item;
					break;
				}
			}
		}
		
		//sada kada smo nasli artikal sada ga menjamo
		artikalZaIzmenu.setJedinicnaCena(artikal.getJedinicnaCena());
		artikalZaIzmenu.setKolicina(artikal.getKolicina());
		artikalZaIzmenu.setNaziv(artikal.getNaziv());
		artikalZaIzmenu.setOpis(artikal.getOpis());
		artikalZaIzmenu.setTip(artikal.getTip());
		
		if(vrati.equals("")){
			//sada cuvamo artikle
			saveArtikle();
		}
		
		return vrati;
	}


	public String dodajArtikal(Artikal artikal) throws IOException {
		String vrati="";
		//prvo cemo da procerimo da li ima artikal
		for(Artikal item : artikli.values()){
			if(artikal.getRestoran().equals(item.getRestoran())){
				if(artikal.getNaziv().equals(item.getNaziv())){
					vrati="ImaNaziv";
					return vrati;
				}
			}
		}
		//ukoliko nema samo ga ubacimo u mapu!
		if(vrati==""){
			artikli.put(artikal.getNaziv()+artikal.getRestoran(), artikal);
			saveArtikle();
		}
		
		return "";
	}


	public String obrisiArtikal(String artikal) throws IOException {
		for(Artikal item : artikli.values()){
			if(artikal.contains(item.getRestoran())){
				if(artikal.contains(item.getNaziv())){
					item.setObrisan(true);
					saveArtikle();
				}
			}
		}
		return "ok";
	}
}
