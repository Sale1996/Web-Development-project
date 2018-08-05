package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Restoran;
import dao.ArtikalDAO;
import dao.RestoranDAO;

@Path("/restorani")
public class RestoranService {

	@Context
	ServletContext ctx;
	
	public RestoranService(){}
	
	@PostConstruct
	/*
	 * Metoda koja ce generisati liste artikala iz memorije ukoliko je nema
	 * */
	public void init(){
		if(ctx.getAttribute("restoranDAO")==null){
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("restoranDAO", new RestoranDAO(contextPath));
		}
	}
	
	
	/*
	 * Vraca sve restorane koji odgovaraju prosledjenom tipu
	 * */
	@GET
	@Path("/{tip}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Restoran> izlistajRestorane(@PathParam("tip") String tip){
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		
		return dao.pronadjiRestorane(tip);
	}
	
	/* *
	 * vraca sve restorane
	 * */
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Restoran> vratiSveRestorane(){
		RestoranDAO dao =(RestoranDAO) ctx.getAttribute("restoranDAO");
		return  dao.getRestorani().values();
	}
	
	/*
	 * Vraca trazeni restoran
	 * */
	@GET
	@Path("/jedanRestoran/{restoran}")
	@Produces(MediaType.APPLICATION_JSON)
	public Restoran vratiRestoran(@PathParam("restoran") String restoran){
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		return dao.getRestoran(restoran);
	}
	
	/*
	 * Vrsi izmenu restorana
	 * */
	@PUT
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String izmeniRestoran(Restoran restoran) throws IOException{
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		return dao.izmeniRestoran(restoran);
	}
	
	/*
	 * Unos novog restorana
	 * */
	@POST
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String dodajRestoran(Restoran restoran) throws IOException{
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		return dao.dodajRestoran(restoran);
		
	}
	
	/*
	 * Brisanje restorana i njegovih artikala
	 * */
	@DELETE
	@Path("/{restoran}")
	@Produces(MediaType.TEXT_PLAIN)
	public String izbrisiRestoran(@PathParam("restoran") String restoran) throws IOException{
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		ArtikalDAO artikalDAO = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		return dao.izbrisiRestoran(restoran,artikalDAO);
	}
	
	
	/*
	 * Vraca restorane u zavisnosti od pretrage sta smo utrefili
	 * */
	@POST
	@Path("/pretraga")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Restoran> pretragaRestorana(Restoran uslovRestoran){
		RestoranDAO dao = (RestoranDAO) ctx.getAttribute("restoranDAO");
		
		return dao.pretragaRestorane(uslovRestoran);
	}
	
}
