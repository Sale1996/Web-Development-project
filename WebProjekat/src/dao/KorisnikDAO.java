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
	
	public KorisnikDAO(String contextPath, KupacDAO kupacDao,AdministratorDAO administratorDao) {
		this.contextPath=contextPath;
		this.kupacDao = kupacDao;
		this.administratorDao = administratorDao;
		loadKorisnike();
	}
	
	public void loadKorisnike(){
		
		kupci = kupacDao.getKupci();
		administratori = administratorDao.getAdministratori();
		//isto za dostavljace
		
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
}
