package services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Dostavljac;
import beans.Porudzbina;
import beans.Vozilo;
import dao.DostavljacDAO;
import dao.PorudzbinaDAO;
import dao.VoziloDAO;

@Path("/dostavljaci")
public class DostavljacService {
	@Context
	ServletContext ctx;
	
	public DostavljacService(){}
	
	@PostConstruct
	public void init() throws IOException{
		if(ctx.getAttribute("dostavljacDAO")==null){
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("dostavljacDAO", new DostavljacDAO(contextPath));
		}
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Dostavljac> vratiDostavljace(){
		DostavljacDAO dao = (DostavljacDAO) ctx.getAttribute("dostavljacDAO");
		return dao.getDostavljaci().values();
	}
	
	@GET
	@Path("/postaviVozilo/{registarskaOznaka}")
	@Produces(MediaType.APPLICATION_JSON)
	public Vozilo postaviVoziloDostavljaca(@PathParam("registarskaOznaka") String registarskaOznaka, @Context HttpServletRequest request) throws IOException{
		DostavljacDAO dao = (DostavljacDAO) ctx.getAttribute("dostavljacDAO");
		VoziloDAO voziloDao = (VoziloDAO) ctx.getAttribute("voziloDAO");
		
		return dao.postaviVoziloDostavljaca(registarskaOznaka,voziloDao,request);
	}
	
	/*
	 * Dostavlajc preuzima porudzbinu
	 * */
	@GET
	@Path("/preuzmiPorudzbinu/{idPorudzbine}")
	@Produces(MediaType.APPLICATION_JSON)
	public Porudzbina preuzmiPorudzbinu(@PathParam("idPorudzbine") String idPorudzbine, @Context HttpServletRequest request) throws IOException{
		PorudzbinaDAO porudzbinaDao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		DostavljacDAO dao = (DostavljacDAO) ctx.getAttribute("dostavljacDAO");
		
		return dao.preuzmiPorudzbinu(idPorudzbine, request, porudzbinaDao);
	}
}
