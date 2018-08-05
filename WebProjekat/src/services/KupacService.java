package services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Kupac;
import beans.Porudzbina;
import beans.Vozilo;
import dao.ArtikalDAO;
import dao.KupacDAO;
import dao.PorudzbinaDAO;
import dao.RestoranDAO;

@Path("/kupac")

public class KupacService {

	@Context
	ServletContext ctx;
	
	public KupacService(){}
	
	@PostConstruct
	public void init(){
		if(ctx.getAttribute("kupacDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("kupacDAO", new KupacDAO(contextPath));
		}
	}
	
	/*
	 * 
	 * Poziva se prilikom registracije korisnika (kupca) i kao povratnu vrednost vraca string koji sluzi da nas obavesti ako ima 
	 * vec registrovanog korisnika sa datim korisnickim imenom ili emailom.
	 * */
	@POST
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String dodajKupca(Kupac kupac) throws IOException{
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		
		return dao.dodajNovogKorisnika(kupac);
	} 
	
	
	/*
	 * Funkcija koja ili dodaje ili brise restoran iz liste
	 * omiljenih restorana jednog ulogovanog kupca
	 * */
	@GET
	@Path("/dodajRestoran/{restoran}")
	@Produces(MediaType.TEXT_PLAIN)
	public String omiljeniRestoran(@PathParam("restoran") String restoran, @Context HttpServletRequest request) throws IOException{
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		RestoranDAO restoranDao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		return dao.omiljeniRestoran(restoran,restoranDao, request);
	}
	
	/* *
	 * Funckija koja reaguje na dugme kupi pored artikla i kao rezultat artikal dodaje u listu artikala u poruzbdini
	 * koja se nalazi u sesisji
	 * */
	@GET
	@Path("/naruciArtikal/{artikal}")
	@Produces(MediaType.TEXT_PLAIN)
	public String poruciArtikal(@PathParam("artikal") String artikal, @Context HttpServletRequest request){
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		ArtikalDAO artikalDao= (ArtikalDAO) ctx.getAttribute("artikalDAO");
		
		return dao.poruciArtikal(artikal,request,artikalDao);
	}
	
	/* *
	 * Funkcija koja vraca nazad trenutnu porudzbinu u toku koja ce se
	 * ispisati na prozoru korpe
	 * */
	@GET
	@Path("/otvoriKorpu/")
	@Produces(MediaType.APPLICATION_JSON)
	public Porudzbina vratitrenutnuPorudzbinu(@Context HttpServletRequest request){
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		
		return dao.vratiTrenutnuPorudzbinu(request);
	}
	
	/* *
	 * Funkcija koja reaguje na klik dugmeda poruci u proozru korpe
	 * */
	@POST
	@Path("/naruci/")
	@Produces(MediaType.TEXT_PLAIN)
	public String finalnoPoruciArtikle(@Context HttpServletRequest request, Porudzbina napomena) throws IOException{
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		PorudzbinaDAO daoPorudzbina = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		ArtikalDAO daoArtikal = (ArtikalDAO) ctx.getAttribute("artikalDAO");//ovo koristimo posto cemo u artikle dodati info da je porucen, pa da mozemo da ga sacuvamo
		
		return dao.poruciSveArtikle(request,daoPorudzbina,napomena , daoArtikal);
	}
	
	/* *
	 * Funkciaj koja se aktivira prilikom klika "x" na neki artikal u korpi,
	 * odnosno ukoliko hocemo da ga izbacimo iz korpe.
	 * */
	@GET
	@Path("/ukloniArtikalPorudzbina/{artikal}")
	@Produces(MediaType.TEXT_PLAIN)
	public String ukloniArtikalIzKorpe(@PathParam("artikal") String artikal, @Context HttpServletRequest request){
	    KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
	    
	    return dao.ukloniArtikalIzKorpe(artikal,request);
	}
	
	/* *
	 * Funkcija koja se poziva prilikom izlogovanja korisnika sa svog naloga
	 * i gasi sessiju i iz svih restorana brise da su omiljeni
	 * */
	@GET
	@Path("/izloguj/")
	@Produces(MediaType.TEXT_PLAIN)
	public String izlogujKorisnika(@Context HttpServletRequest request){
		if(ctx.getAttribute("restoranDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("restoranDAO", new RestoranDAO(contextPath));
		}
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");

		return dao.izlogujKupca(request);
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Kupac> vratiKupce(){
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		return dao.getKupci().values();
	}
}
