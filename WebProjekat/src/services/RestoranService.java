package services;

import java.util.ArrayList;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Artikal;
import beans.Restoran;
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
}
