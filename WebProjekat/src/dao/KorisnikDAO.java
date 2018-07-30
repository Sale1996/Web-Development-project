package dao;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Context;

import beans.Administrator;
import beans.Dostavljac;
import beans.Korisnik;
import beans.Kupac;
import beans.Restoran;

public class KorisnikDAO {
	@Context
	ServletContext ctx;
	private HashMap<String,Kupac> kupci = new HashMap<String,Kupac>();	//kupci
	private HashMap<String,Administrator> administratori = new HashMap<String,Administrator>();	//admini
	private HashMap<String,Dostavljac> dostavljaci = new HashMap<String,Dostavljac>();	//dostavljaci
	private String contextPath;
	private KupacDAO kupacDao;
    private AdministratorDAO administratorDao;
    private DostavljacDAO dostavljacDao;
	
	public KorisnikDAO(String contextPath, KupacDAO kupacDao,AdministratorDAO administratorDao,DostavljacDAO dostavljacDao) {
		this.contextPath=contextPath;
		this.kupacDao = kupacDao;
		this.administratorDao = administratorDao;
		this.dostavljacDao=dostavljacDao;
		loadKorisnike();
	}
	
	public void loadKorisnike(){
		
		kupci = kupacDao.getKupci();
		administratori = administratorDao.getAdministratori();
		dostavljaci= dostavljacDao.getDostavljaci();
		
	}
	
	
	
	public Korisnik prijaviKorisnika(Korisnik korisnik,RestoranDAO restoranDAO){
		loadKorisnike();
		Korisnik korisnikVrati=null;
		if(kupci.size()>0){
			for(Kupac item : kupci.values()){
				if(item.getKorisnickoIme().equals(korisnik.getKorisnickoIme())){
					if(item.getLozinka().equals(korisnik.getLozinka())){
						korisnikVrati=item;
						break;
					}else{
						korisnikVrati=new Korisnik("","","","","","LozinkaNeValja","");		
						break;
					}
				}
			}
			if(korisnikVrati==null)
				//ako je prosao ceo for onda znaci da ga nije nasao, i onda cemo staviti da mu korisnickoIme ne valja
				korisnikVrati=new Korisnik("","","","","","NePostojiKorisnik","");		
	

			//u slucaju da je kupac moramo postaviti i omiljene restorane
			if(!korisnikVrati.getKontaktTelefon().equals("LozinkaNeValja") && !korisnikVrati.getKontaktTelefon().equals("NePostojiKorisnik")){
				//znaci ako postoji korisnik onda cemo tek da idemo kroz restorane
				Kupac kupacAcc = (Kupac) korisnikVrati;
				for(Restoran item : restoranDAO.getRestorani().values()){
					if(kupacAcc.getOmiljeniRestorani().contains(item)){
						item.setDaLiJeOmiljeni(true);
					}
				}
			
			}
		}
		
		/* *
		 * ako nije nasao korisnika medju kupcima, onda trazimo medju administratorima..
		 * */
		//posto ima 2 situacije kada cemo ispitivati listu admina i to moramo da proverimo prvo da li je nll
		//pa da li ne postoji korisnik ako ga nema u kupcima... i ovo je za sada najbolji nacin uraditi tako nesto
		Boolean proveriAdmina=false;
		if(korisnikVrati==null){
			proveriAdmina=true;			
		}else if(korisnikVrati.getKontaktTelefon().equals("NePostojiKorisnik")){
			proveriAdmina=true;
		}
		
		if(proveriAdmina){
			if(administratori.size()>0){
				for(Administrator item : administratori.values()){
					if(item.getKorisnickoIme().equals(korisnik.getKorisnickoIme())){
						if(item.getLozinka().equals(korisnik.getLozinka())){
							korisnikVrati=item;
							break;
						}else{
							korisnikVrati=new Korisnik("","","","","","LozinkaNeValja","");		
							break;
						}
					}
				}
			}
		}
		
		
		/* *
		 * Za administratora i dostavljaca radimo isto samo sto pitamo da li je 
		 * korisnikVrati ima nesto u polju telefona pa ako jeste onda moze dalje
		 * */
		return korisnikVrati;
		
	}
	
	/* *
	 * Poziva se prilikom izmene korisnika, ukoliko se desi greska u vidu
	 * istog emaila na stringu ce se to naznaciti i vratice se nazad, inace
	 * vraca prazan string
	 * */
	public String izmeniKorisnika(Korisnik kupac,HttpServletRequest request) throws IOException{
		String vrati="";
		HttpSession sesija = request.getSession();
		Korisnik ulogovanKupac= (Korisnik) sesija.getAttribute("korisnik");
		for(Korisnik item : kupci.values()){
			if(item.getEmailAdresa().equals(kupac.getEmailAdresa()) && !(ulogovanKupac.getEmailAdresa().equals(kupac.getEmailAdresa()))){
				vrati="ImaEmail";
				return vrati;
			}
		}
		ulogovanKupac.setEmailAdresa(kupac.getEmailAdresa());
		ulogovanKupac.setIme(kupac.getIme());
		ulogovanKupac.setPrezime(kupac.getPrezime());
		ulogovanKupac.setKontaktTelefon(kupac.getKontaktTelefon());
		if(!kupac.getLozinka().equals(""))
			ulogovanKupac.setLozinka(kupac.getLozinka());
		
		if(vrati.equals("")){
			kupacDao.saveKupac(); //ukoliko je uspesno izvrsena izmena, cuvamo kupca u txt fajl
		}
		
		return vrati;
		
	}

	//vraca korisnika po korisnickom imenu
	public Korisnik pronadjiMiKorisnika(String korisnickoIme) {
		loadKorisnike();
		Korisnik korisnik=null;
		if(kupci.containsKey(korisnickoIme))
			korisnik = kupci.get(korisnickoIme);
		else if(administratori.containsKey(korisnickoIme))
			korisnik = administratori.get(korisnickoIme);
		
		return korisnik;
	}

	/*
	 * Menja ulogu korisnika
	 * */
	public String promeniUlogu(Korisnik korisnik) throws IOException {
		Korisnik korisnikZaMenjanjeUloge=null;
		
		//prvo trazimo korisnika
		if(kupci.containsKey(korisnik.getKorisnickoIme())){
			korisnikZaMenjanjeUloge = kupci.get(korisnik.getKorisnickoIme());
		}
		if(administratori.containsKey(korisnik.getKorisnickoIme())){
			korisnikZaMenjanjeUloge = administratori.get(korisnik.getKorisnickoIme());
		}
		if(dostavljaci.containsKey(korisnik.getKorisnickoIme())){
			korisnikZaMenjanjeUloge = dostavljaci.get(korisnik.getKorisnickoIme());
		}
		
		//ukoliko nismo promenili ulogu samo izlazimo iz funkcije
		if(korisnikZaMenjanjeUloge.getUloga().equals(korisnik.getUloga()))
			return "ok";
		else{
			//ukoliko jesmo onda moramo da menjamo ulogu
			//ukoliko je uloga kupac
			if(korisnik.getUloga().equals("kupac")){
				Kupac noviKupac = new Kupac();
				noviKupac.setDatumRegistracije(korisnikZaMenjanjeUloge.getDatumRegistracije());
				noviKupac.setEmailAdresa(korisnikZaMenjanjeUloge.getEmailAdresa());
				noviKupac.setIme(korisnikZaMenjanjeUloge.getIme());
				noviKupac.setKontaktTelefon(korisnikZaMenjanjeUloge.getKontaktTelefon());
				noviKupac.setKorisnickoIme(korisnikZaMenjanjeUloge.getKorisnickoIme());
				noviKupac.setLozinka(korisnikZaMenjanjeUloge.getLozinka());
				noviKupac.setPrezime(korisnikZaMenjanjeUloge.getPrezime());
				noviKupac.setUloga(korisnik.getUloga());
				kupacDao.getKupci().put(noviKupac.getKorisnickoIme(), noviKupac);
				if(korisnikZaMenjanjeUloge instanceof Dostavljac){
					dostavljacDao.getDostavljaci().remove(korisnikZaMenjanjeUloge.getKorisnickoIme());
				}
				else{
					administratorDao.getAdministratori().remove(korisnikZaMenjanjeUloge.getKorisnickoIme());
				}
				
			}
			else if(korisnik.getUloga().equals("dostavljac")){
				Dostavljac noviDostavljac = new Dostavljac();
				noviDostavljac.setDatumRegistracije(korisnikZaMenjanjeUloge.getDatumRegistracije());
				noviDostavljac.setEmailAdresa(korisnikZaMenjanjeUloge.getEmailAdresa());
				noviDostavljac.setIme(korisnikZaMenjanjeUloge.getIme());
				noviDostavljac.setKontaktTelefon(korisnikZaMenjanjeUloge.getKontaktTelefon());
				noviDostavljac.setKorisnickoIme(korisnikZaMenjanjeUloge.getKorisnickoIme());
				noviDostavljac.setLozinka(korisnikZaMenjanjeUloge.getLozinka());
				noviDostavljac.setPrezime(korisnikZaMenjanjeUloge.getPrezime());
				noviDostavljac.setUloga(korisnik.getUloga());
				dostavljacDao.getDostavljaci().put(noviDostavljac.getKorisnickoIme(), noviDostavljac);
				if(korisnikZaMenjanjeUloge instanceof Kupac){
					kupacDao.getKupci().remove(korisnikZaMenjanjeUloge.getKorisnickoIme());
				}
				else{
					administratorDao.getAdministratori().remove(korisnikZaMenjanjeUloge.getKorisnickoIme());
				}
				
			}else{
				Administrator noviAdministrator = new Administrator();
				noviAdministrator.setDatumRegistracije(korisnikZaMenjanjeUloge.getDatumRegistracije());
				noviAdministrator.setEmailAdresa(korisnikZaMenjanjeUloge.getEmailAdresa());
				noviAdministrator.setIme(korisnikZaMenjanjeUloge.getIme());
				noviAdministrator.setKontaktTelefon(korisnikZaMenjanjeUloge.getKontaktTelefon());
				noviAdministrator.setKorisnickoIme(korisnikZaMenjanjeUloge.getKorisnickoIme());
				noviAdministrator.setLozinka(korisnikZaMenjanjeUloge.getLozinka());
				noviAdministrator.setPrezime(korisnikZaMenjanjeUloge.getPrezime());
				noviAdministrator.setUloga(korisnik.getUloga());
				administratorDao.getAdministratori().put(noviAdministrator.getKorisnickoIme(), noviAdministrator);
				if(korisnikZaMenjanjeUloge instanceof Kupac){
					kupacDao.getKupci().remove(korisnikZaMenjanjeUloge.getKorisnickoIme());
				}
				else{
					dostavljacDao.getDostavljaci().remove(korisnikZaMenjanjeUloge.getKorisnickoIme());
				}
			}
		}
		
		kupacDao.saveKupac();
		administratorDao.saveAdmin();
		dostavljacDao.saveDostavljac();
		
		return "ok";
	}
}
