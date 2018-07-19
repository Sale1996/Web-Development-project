package services;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Korisnik;
import dao.KorisnikDAO;
import dao.KupacDAO;

@Path("/korisnik")
public class KorisnikService {
	@Context
	ServletContext ctx;
	
	
	public KorisnikService(){}

	@PostConstruct
	public void init(){
		
		if(ctx.getAttribute("korisnikDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("korisnikDAO", new KorisnikDAO(contextPath,(KupacDAO) ctx.getAttribute("kupacDAO")));
		}
		
	}
	
	
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik prijaviKorisnika(@Context HttpServletRequest request, Korisnik korisnik) throws IOException{
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		Korisnik ulogovanKorisnik= dao.prijaviKorisnika(korisnik);
		
		if(!ulogovanKorisnik.getKorisnickoIme().equals("")){
			HttpSession session = request.getSession();
			session.setAttribute("korisnik", ulogovanKorisnik);
		}
		
		return ulogovanKorisnik;
	}
	
	
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik dajMiKorisnika(@Context HttpServletRequest request){
		HttpSession session = request.getSession();
		Korisnik korisnik =(Korisnik) session.getAttribute("korisnik");
		return korisnik;
	}
	
	/*
	 * Koristi se za izmenu korisnika 
	 * */
	@PUT
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String izmeniKorisnika(@Context HttpServletRequest request, Korisnik korisnik)throws IOException{
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		return dao.izmeniKorisnika(korisnik,request);
		
	}
}
