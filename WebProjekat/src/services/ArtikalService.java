package services;

import java.io.Console;
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
import beans.Artikal;
import dao.ArtikalDAO;
import dao.PorudzbinaDAO;

@Path("/artikli")
public class ArtikalService {

	@Context
	ServletContext ctx;
	
	public ArtikalService(){
		
	}
	
	@PostConstruct
	/*
	 * Metoda koja ce generisati liste artikala iz memorije ukoliko je nema
	 * */
	public void init(){
		if(ctx.getAttribute("artikalDAO")==null){
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("artikalDAO", new ArtikalDAO(contextPath));
		}
		if(ctx.getAttribute("porudzbinaDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("porudzbinaDAO", new PorudzbinaDAO(contextPath));
		}
	}
	
	/*
	 * Vraca sve atrikle koje imamo u fajlu
	 * */
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Artikal> getArtikal(){
		ArtikalDAO dao = (ArtikalDAO) ctx.getAttribute("artikalDAO");

		return dao.findAll();
	}
	
	@GET
	@Path("/izlistajArtikle/{restoran}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Artikal> traziArtikalPoRestoranu(@PathParam("restoran") String restoran){
		ArtikalDAO dao = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		
		return dao.pronadjiPoRestoranu(restoran);
	}
	
	@GET
	@Path("/dajArtikal/{artikal}")
	@Produces(MediaType.APPLICATION_JSON)
	public Artikal pronadjiArtikal(@PathParam("artikal") String artikal){
		ArtikalDAO dao = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		
		return dao.pronadjiArtikal(artikal);
	}
	
	/*
	 * Vraca listu artikala koji odgovaraju pretrazi
	 * */
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Artikal> traziArtikal(Artikal artikal){
		ArtikalDAO dao = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		
		return dao.pretraga(artikal);
	}
	
	/* *
	 * Vrsi izmenu prosledjenog artikla i vraca string koji je potvrda toga
	 * ili govori gresku, ukoliko je ima
	 * */
	@PUT
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String izmeniArtikal(Artikal artikal) throws IOException{
		ArtikalDAO dao = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		return dao.izmeniArtikal(artikal);
	}
	
	/* *
	 * dodaje novi artikal medju artikle 
	 * */
	@POST
	@Path("/kreirajNovi/")
	@Produces(MediaType.TEXT_PLAIN)
	public String dodajArtikal(Artikal artikal) throws IOException{
		ArtikalDAO dao = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		return dao.dodajArtikal(artikal);
	}
}
