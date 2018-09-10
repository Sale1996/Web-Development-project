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
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Korisnik;
import dao.AdministratorDAO;
import dao.DostavljacDAO;
import dao.KorisnikDAO;
import dao.KupacDAO;
import dao.RestoranDAO;

@Path("/korisnik")
public class KorisnikService {
	@Context
	ServletContext ctx;
	
	
	public KorisnikService(){}

	@PostConstruct
	public void init() throws IOException{
		if(ctx.getAttribute("kupacDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("kupacDAO", new KupacDAO(contextPath));
		}
		if(ctx.getAttribute("administratorDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("administratorDAO", new AdministratorDAO(contextPath));
		}	
		if(ctx.getAttribute("dostavljacDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("dostavljacDAO", new DostavljacDAO(contextPath));
		}	
		
		if(ctx.getAttribute("korisnikDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("korisnikDAO", new KorisnikDAO(contextPath,(KupacDAO) ctx.getAttribute("kupacDAO"),(AdministratorDAO) ctx.getAttribute("administratorDAO"),(DostavljacDAO) ctx.getAttribute("dostavljacDAO")));
		}
		
	}
	
	
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik prijaviKorisnika(@Context HttpServletRequest request, Korisnik korisnik) throws IOException{
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		if(ctx.getAttribute("restoranDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("restoranDAO", new RestoranDAO(contextPath));
		}
		RestoranDAO restoranDao = (RestoranDAO) ctx.getAttribute("restoranDAO");

		
		Korisnik ulogovanKorisnik= dao.prijaviKorisnika(korisnik,restoranDao);
	
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
	
	@GET
	@Path("/dajMiKorisnika/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik pronadjiMiKorisnika(@PathParam("korisnickoIme") String korisnik){
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		return dao.pronadjiMiKorisnika(korisnik);
		
	}
	
	@PUT
	@Path("/promeniUlogu/")
	@Produces(MediaType.TEXT_PLAIN)
	public String promeniUloguKorisnika(Korisnik korisnik) throws IOException{
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		return dao.promeniUlogu(korisnik);
		
	}
	
	@GET
	@Path("/izloguj/")
	@Produces(MediaType.TEXT_PLAIN)
	public String izlogujKorisnika(@Context HttpServletRequest request){
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnikDAO");
		
		return dao.izlogujKorisnika(request);
	}
}
