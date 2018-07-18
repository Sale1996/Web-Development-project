package dao;

import java.util.HashMap;

import javax.servlet.ServletContext;
import javax.ws.rs.core.Context;

import beans.Administrator;
import beans.Dostavljac;
import beans.Korisnik;
import beans.Kupac;

public class KorisnikDAO {
	@Context
	ServletContext ctx;
	private HashMap<String,Kupac> kupci = new HashMap<String,Kupac>();	//kupci
	private HashMap<String,Administrator> administratori = new HashMap<String,Administrator>();	//admini
	private HashMap<String,Dostavljac> dostavljaci = new HashMap<String,Dostavljac>();	//dostavljaci
	private String contextPath;
	private KupacDAO kupacDao;

	public KorisnikDAO(String contextPath, KupacDAO kupacDao) {
		this.contextPath=contextPath;
		this.kupacDao = kupacDao;
		loadKorisnike();
	}
	
	public void loadKorisnike(){
		
		kupci = kupacDao.getKupci();
		//isto za admine
		//isto za dostavljace
		
	}
	
	
	
	public Korisnik prijaviKorisnika(Korisnik korisnik){
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
	

		}
		/* *
		 * Za administratora i dostavljaca radimo isto samo sto pitamo da li je 
		 * korisnikVrati ima nesto u polju telefona pa ako jeste onda moze dalje
		 * */
		return korisnikVrati;
		
	}
}
