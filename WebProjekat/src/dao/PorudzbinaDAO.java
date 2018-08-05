package dao;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Artikal;
import beans.Dostavljac;
import beans.Korisnik;
import beans.Kupac;
import beans.Porudzbina;

public class PorudzbinaDAO {
	private ArrayList<Porudzbina> porudzbine = new ArrayList<>();
	private String contextPath;
	private int trenutniBrojPoruzbine=0;
	
	public PorudzbinaDAO(String contextPath){
		this.contextPath=contextPath;
		loadPorudzbine(contextPath);
		trenutniBrojPoruzbine=porudzbine.size();
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
	        System.out.println("Sacuvana lista porudzbina." + porudzbine.size());
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
	
	public void dodajPorudzbinu(Porudzbina porudzbina, ArtikalDAO artikalDao) throws IOException{
		//trenutni broj poruzbine koristimo kako bi lakse znali da nadjemo
		//porudzbinu u odredjenim situacijama
		porudzbina.setId(trenutniBrojPoruzbine);
		porudzbine.add(porudzbina);
		trenutniBrojPoruzbine++;
		//sada ovde trebamo da azuriramo svaki artikal da zna da je kupljen jos jednom !
		int brojKupovineArtikla;
		for(Artikal item : porudzbina.getArtikli()){
			//znaci u mapi vidimo koliko je komada u jednoj porudzbini kupljen ovaj artikal i odna to dodajemo 
			//na nas artikal u atribut "kolikoSamPutaKupljen"
			brojKupovineArtikla = porudzbina.getMapaARTIKALbrojPorudzbina().get(item.getNaziv()+item.getRestoran());
			item.setKolikoSamPutaKupljen(item.getKolikoSamPutaKupljen()+brojKupovineArtikla);
		}
		//sada trebamo sacuvati sve te artikle  i porudzbine
		artikalDao.saveArtikle(); 
		savePorudzbine();

	}

	public ArrayList<Porudzbina> getPorudzbine() {
		return porudzbine;
	}

	public void setPorudzbine(ArrayList<Porudzbina> porudzbine) {
		this.porudzbine = porudzbine;
	}

	/*
	 * -prvo nalazimo porudzbinu po id-u koji je prosledjen u linku
	 * -zadim iz te porudzbine uzimamo kolicinu narucenog artikla
	 * -u zavisnosti da li je oduzimanje/dodavanje mi smanjujemo/povecavamo taj broj
	 * -postavljamo novu vrednst tog broja u onu mapu
	 * 
	 * */
	public String promeniBrojArtikalaPoruzbine(String artikal, String manjeVise) throws IOException {
		String idPorudzbine = artikal.substring(0,1);
		int idPorudzbeInt = Integer.parseInt(idPorudzbine);
		Porudzbina porudzbinaZaMenjati = porudzbine.get(idPorudzbeInt);
		String idArtikla = artikal.substring(1);
		
		int broj=porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().get(idArtikla);
		if(manjeVise.equals("smanji")){
			broj--;
		}else{
			broj++;
		}
		porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().put(idArtikla, broj);
		
		//sada treba u tom artiklu samo to nametnuti, kako bi mogli da ispisemo
		//jer broj artikala koristimo za ispis
		for(Artikal item : porudzbinaZaMenjati.getArtikli()){
			if(artikal.contains(item.getNaziv())){
				if(artikal.contains(item.getRestoran())){
					item.setBrojArtikala(broj);
					//namestamo novu ukupnu cenu, nista vise
					if(manjeVise.equals("smanji"))
						porudzbinaZaMenjati.setUkupnaCena(porudzbinaZaMenjati.getUkupnaCena()-item.getJedinicnaCena());
					else
						porudzbinaZaMenjati.setUkupnaCena(porudzbinaZaMenjati.getUkupnaCena()+item.getJedinicnaCena());
						
				}
			}
		}
		
		savePorudzbine();
		return artikal;
	}

	//vraca porudzbinu po rednom broju
	//i svim artiklima osvezava kolicinu
	//prema porudzbini koja se trazi
	public Porudzbina vratiPorudzbinu(int redniBrojj) {
		// TODO Auto-generated method stub
		Porudzbina zaVratiti =porudzbine.get(redniBrojj);
		for(Artikal item : zaVratiti.getArtikli()){
			item.setBrojArtikala(zaVratiti.getMapaARTIKALbrojPorudzbina().get(item.getNaziv()+item.getRestoran()));
		}
		
		return zaVratiti;
	}

	/*
	 * Uklanja artikal iz porudzbine i smanjuje ukupnu cenu naspram artikla
	 * */
	public String ukloniArtikalIzPorudzbine(String dodatak) throws IOException {
		String idPorudzbine = dodatak.substring(0, 1);
		int idPorudzbineInt = Integer.parseInt(idPorudzbine);
		
		Porudzbina porudzbinaZaMenjati= porudzbine.get(idPorudzbineInt);
		
		for(Artikal item : porudzbinaZaMenjati.getArtikli()){
			if(dodatak.contains(item.getNaziv())){
				if(dodatak.contains(item.getRestoran())){
					//namestamo ukupnu cenu
					int ukupnaCenaArtikla= item.getJedinicnaCena()*porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().get(item.getNaziv()+item.getRestoran());
					porudzbinaZaMenjati.setUkupnaCena(porudzbinaZaMenjati.getUkupnaCena()-ukupnaCenaArtikla);
					//izbacujemo artikal iz liste i mape
					porudzbinaZaMenjati.getMapaARTIKALbrojPorudzbina().remove(item.getNaziv()+item.getRestoran());
					porudzbinaZaMenjati.getArtikli().remove(item);
					break;
				}
			}
		}
		
		savePorudzbine();

		return idPorudzbine;
	}
/*
 * Promena kupca jedne porudzbine
 * */
	public Porudzbina promeniKupcaPorudzbine(String porudzbinaID, Korisnik kupacKorisnickoIme,KupacDAO dao) throws IOException {
		//prvo nalazimo kupca
		Kupac noviKupac=null;
		for(Kupac item : dao.getKupci().values()){
			if(item.getKorisnickoIme().equals(kupacKorisnickoIme.getKorisnickoIme()))
				noviKupac=item;
		}
		Porudzbina porudzbinaZaMenjati=porudzbine.get(Integer.parseInt(porudzbinaID));
		porudzbinaZaMenjati.setKupacKojiNarucuje(noviKupac);
		savePorudzbine();
		
		return porudzbinaZaMenjati;
	}

	public Porudzbina promeniKupcaPorudzbine(String porudzbinaID, Korisnik dostavljacKorisnickoIme,
			DostavljacDAO daoDostavljac) throws IOException {

		//prvo nalazimo kupca
		Dostavljac noviDostavljac=null;
		for(Dostavljac item : daoDostavljac.getDostavljaci().values()){
			if(item.getKorisnickoIme().equals(dostavljacKorisnickoIme.getKorisnickoIme()))
				noviDostavljac=item;
		}
		Porudzbina porudzbinaZaMenjati=porudzbine.get(Integer.parseInt(porudzbinaID));
		porudzbinaZaMenjati.setDostavljac(noviDostavljac);
		savePorudzbine();
		
		return porudzbinaZaMenjati;
	
	}

	//dodavanje artikala u porudzbinu iz sesije
	public Artikal dodajArtikalUPorudzbinuAdmin(String artikalID, ArtikalDAO artikalDao,  HttpServletRequest request) throws IOException {
		HttpSession session = request.getSession();
		if(session==null){
			//ako nema sesije, pravi je
			session=request.getSession(true);
		}
		Porudzbina porudzbinaKreiranje = (Porudzbina) session.getAttribute("trenutnaPorudzbina");
		if(porudzbinaKreiranje==null){
			porudzbinaKreiranje = new Porudzbina();
			session.setAttribute("trenutnaPorudzbina", porudzbinaKreiranje);
		}
		
		//nakon sto smo uzeli porudzbinu 
		//sada trazimo artikal koji dodajemo u tu porudzbinu
		for(Artikal item : artikalDao.getArtikli().values()){
			if(artikalID.contains(item.getNaziv())){
				if(artikalID.contains(item.getRestoran())){
					//sada ubacujemo u porudzbinu
					/*
					 * Ukoliko porudzbina sastoji artikal onda samo u mapi
					 * povecavamo broj artikala za 1
					 * ,inace dodajemo u listu i stavljamo u mapu sa brojem
					 * artikala ==1
					 * 
					 * 
					 * ++ povecavamo ukupnu cenu porudzbine za cenu artikla
					 * */
					if(porudzbinaKreiranje.getArtikli().contains(item)){
						int brojArtikla = porudzbinaKreiranje.getMapaARTIKALbrojPorudzbina().get(artikalID);
						porudzbinaKreiranje.getMapaARTIKALbrojPorudzbina().put(artikalID, ++brojArtikla);
						porudzbinaKreiranje.setUkupnaCena(porudzbinaKreiranje.getUkupnaCena()+item.getJedinicnaCena());
						savePorudzbine();
						return item;

					}else{
						porudzbinaKreiranje.getArtikli().add(item);
						porudzbinaKreiranje.getMapaARTIKALbrojPorudzbina().put(artikalID, 1);
						porudzbinaKreiranje.setUkupnaCena(porudzbinaKreiranje.getUkupnaCena()+item.getJedinicnaCena());

						savePorudzbine();
						return item;


					}
					
				}
			}
		}
		
		return null;
		
	}

	public String izbrisiArtikalIzPorudzbineAdmin(String artikalID, HttpServletRequest request) {
		HttpSession sesija = request.getSession();
		Porudzbina porudzbina = (Porudzbina) sesija.getAttribute("trenutnaPorudzbina");
		//prvo cemo videti da li imamo vise od jednog artikla u toj porudzbini
		//i smanjujemo ukupn cenu porudzbine

		int brojArtikla = porudzbina.getMapaARTIKALbrojPorudzbina().get(artikalID);
		if(brojArtikla>1){
			porudzbina.getMapaARTIKALbrojPorudzbina().put(artikalID, --brojArtikla);	
			for(Artikal item : porudzbina.getArtikli()){
				if(artikalID.contains(item.getNaziv())){
					if(artikalID.contains(item.getRestoran())){
						porudzbina.setUkupnaCena(porudzbina.getUkupnaCena()-item.getJedinicnaCena());
						break;
					}
				}
			}
		
		}else{
			//ako je jedan jedini onda ga trebamo izbaciti iz liste
			//artikala i mape
			porudzbina.getMapaARTIKALbrojPorudzbina().remove(artikalID);
			for(Artikal item : porudzbina.getArtikli()){
				if(artikalID.contains(item.getNaziv())){
					if(artikalID.contains(item.getRestoran())){
						porudzbina.getArtikli().remove(item);
						porudzbina.setUkupnaCena(porudzbina.getUkupnaCena()-item.getJedinicnaCena());
						break;
					}
				}
			}
		}
		
		
		return "ok";
	}

	/*
	 * Porucuje narudzbinu koju je napravio licno admin
	 * Korisnik nam sluzi samo kao pomoc pri prenosu podataka o porudzbini, 
	 * da ne moramo praviti poseban objekat samo za to
	 * */
	public String finalnaPorudzbinaAdmin(HttpServletRequest request, Korisnik informacije, KupacDAO kupacDao, DostavljacDAO dostavljacDao, ArtikalDAO artikalDao) throws IOException {
		String kupacID = informacije.getKorisnickoIme();
		String dostavljacID = informacije.getLozinka();
		String napomena = informacije.getIme();
		//sada trazimo konketnog kupca i konkretnog dostavljaca
		Kupac kupacKojiNarucuje = null;
		Dostavljac dostavljacKojiNarucuje = null;
		for(Kupac item : kupacDao.getKupci().values()){
			if(item.getKorisnickoIme().equals(kupacID)){
				kupacKojiNarucuje=item;
				break;
			}
		}
		
		for(Dostavljac item: dostavljacDao.getDostavljaci().values()){
			if(item.getKorisnickoIme().equals(dostavljacID)){
				dostavljacKojiNarucuje=item;
				break;
			}
		}
		//nalazimo trenutnu porudzbinu i dodajemo joj finalne podatke
		HttpSession session = request.getSession();
		Porudzbina porudzbinaZaNaruciti= (Porudzbina) session.getAttribute("trenutnaPorudzbina");
		//ukoliko nema artikla onda ovo vrati i napomeni korisnika
		if(porudzbinaZaNaruciti.getArtikli().size()==0)
			return "nemaArtikle";
		
		
		//ovde cemo sada prema nagradnim bodovima da namestimo ukupnu cenu porudzbine!
		int nagradniBodovi = Integer.parseInt(informacije.getPrezime());
		if(kupacKojiNarucuje.getNagradniBodovi()<nagradniBodovi){
			return "kupacNemaBodova";
		}
		
		int procenatUkupneCene= porudzbinaZaNaruciti.getUkupnaCena()/100;
		int popust = 3*nagradniBodovi*procenatUkupneCene;
		//sada smanjujemo ukupn cenu
		porudzbinaZaNaruciti.setUkupnaCena(porudzbinaZaNaruciti.getUkupnaCena()-popust);
		//i smanjujemo nagradne bodove kupcu
		kupacKojiNarucuje.setNagradniBodovi(kupacKojiNarucuje.getNagradniBodovi()-nagradniBodovi);
		
		
		porudzbinaZaNaruciti.setKupacKojiNarucuje(kupacKojiNarucuje);
		porudzbinaZaNaruciti.setDostavljac(dostavljacKojiNarucuje);
		porudzbinaZaNaruciti.setNapomena(napomena);
		porudzbinaZaNaruciti.setStatusPorudzbine("poruceno");
		//unistavamo sessiju
		session.invalidate();
		
		dodajPorudzbinu(porudzbinaZaNaruciti,artikalDao);
		savePorudzbine();
		kupacDao.saveKupac();
		
		
		
		
		
		return "ok";
	}

	//brise porudzbinu po ID-u
	public String obrisiPorudzbinuAdmin(String porudzbinaID) throws IOException {
		//logicki naravno brisemo
		Porudzbina porudzbinaZaObrisati = porudzbine.get(Integer.parseInt(porudzbinaID));
		porudzbinaZaObrisati.setObrisana(true);
		savePorudzbine();
		return "ok";
	}

	/*
	 * Funkcija koja menja status porudzbine
	 * */
	public Porudzbina promeniStatus(String idIStatus, KupacDAO kupacDao) throws IOException {
		String idPorudzbine = idIStatus.substring(0,1);
		String status=idIStatus.substring(1);
		
		Porudzbina porudzbina= porudzbine.get(Integer.parseInt(idPorudzbine));
		if(status.contains("Toku")){
			porudzbina.setStatusPorudzbine("u toku");
		}
		else if(status.equals("dostavljeno")){
			porudzbina.setStatusPorudzbine("dostavljeno");
			/*
			 * Ovde gledamo da li je porudzbina premasia sumu od 500 din, ako jeste
			 * onda cemo dodati jedan angradni bod kupcu (naravno ukoliko nema vec 10!)
			 * */
			if(porudzbina.getUkupnaCena()>500){
				int trenutniNagradniBodoviKupca = porudzbina.getKupacKojiNarucuje().getNagradniBodovi();
				if(trenutniNagradniBodoviKupca<10){
					porudzbina.getKupacKojiNarucuje().setNagradniBodovi(++trenutniNagradniBodoviKupca);
					kupacDao.saveKupac();
				}
			}
			
		}else if(status.equals("otkazano")){
			porudzbina.setStatusPorudzbine("otkazano");
		}
		savePorudzbine();
		return porudzbina;
	}
}
