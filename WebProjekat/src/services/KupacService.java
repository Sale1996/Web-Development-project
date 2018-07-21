package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Korisnik;
import beans.Kupac;
import beans.Restoran;
import dao.KupacDAO;
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
	public String omiljeniRestoran(@PathParam("restoran") String restoran, @Context HttpServletRequest request){
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		RestoranDAO restoranDao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		return dao.omiljeniRestoran(restoran,restoranDao, request);
	}
	
}
