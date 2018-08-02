package services;

import java.io.IOException;
import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Artikal;
import beans.Korisnik;
import beans.Porudzbina;
import dao.ArtikalDAO;
import dao.DostavljacDAO;
import dao.KupacDAO;
import dao.PorudzbinaDAO;

@Path("/porudzbina")
public class PorudzbinaService {
	@Context
	ServletContext ctx;
	
	public PorudzbinaService() {
	}
	
	@PostConstruct
	public void init(){
		if(ctx.getAttribute("porudzbinaDAO")==null){
			String contextPath=ctx.getRealPath("");
			ctx.setAttribute("porudzbinaDAO", new PorudzbinaDAO(contextPath));
		}
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Porudzbina> getAllPorudzbine(){
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		return dao.getPorudzbine();
	}
	/*
	 * Vraca porudzbinu po poslatom rednom broju porudzbine!
	 * */
	@GET
	@Path("/{redniBroj}")
	@Produces(MediaType.APPLICATION_JSON)
	public Porudzbina getPorudzbina(@PathParam("redniBroj") String redniBroj){
		PorudzbinaDAO dao =(PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		int redniBrojj= Integer.parseInt(redniBroj);
		return dao.vratiPorudzbinu(redniBrojj);
	}
	
	/*
	 * admin smanjuje broj artikala u jednoj porudzbini pri izmeni
	 * */
	@GET
	@Path("/smanjiBrojArtikala/{artikal}")
	@Produces(MediaType.TEXT_PLAIN)
	public String smanjiBrojArtikalaPorudzbineAdmin(@PathParam("artikal") String artikal) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		
		return dao.promeniBrojArtikalaPoruzbine(artikal,"smanji");
		
	}
	/*
	 * admin povecava broj artikala u jednoj porudzbini pri izmeni 
	 * */
	@GET
	@Path("/povecajBrojArtikala/{artikal}")
	@Produces(MediaType.TEXT_PLAIN)
	public String povecajBrojArtikalaPorudzbineAdmin(@PathParam("artikal") String artikal) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		
		return dao.promeniBrojArtikalaPoruzbine(artikal,"povecaj");
		
	}
	
	/*
	 * Brisanje artikla iz porudzbine
	 * */
	@DELETE
	@Path("/ukloniArtikalPorudzbina/{dodatak}")
	@Produces(MediaType.TEXT_PLAIN)
	public String ukloniArtikalIzPorudzbine(@PathParam("dodatak") String dodatak) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		
		return dao.ukloniArtikalIzPorudzbine(dodatak);
	}
	
	
	/*
	 * Menjanje kupca jedne porudzbine
	 * */
	@PUT
	@Path("/izmeniKupcaPorudzbine/{porudzbinaID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Porudzbina promeniKupcaPorudzbine(@PathParam("porudzbinaID") String porudzbinaID, Korisnik kupacKorisnickoIme) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		KupacDAO daoKupac = (KupacDAO) ctx.getAttribute("kupacDAO");
		
		return dao.promeniKupcaPorudzbine(porudzbinaID,kupacKorisnickoIme,daoKupac);
	}
	/*
	 * Menjanje dostavljaca jedne porudzbin
	 * */
	@PUT
	@Path("/izmeniDostavljacaPorudzbine/{porudzbinaID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Porudzbina promeniDostavljacaPorudzbine(@PathParam("porudzbinaID") String porudzbinaID, Korisnik dostavljacKorisnickoIme) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		DostavljacDAO daoDostavljac = (DostavljacDAO) ctx.getAttribute("dostavljacDAO");
		
		return dao.promeniKupcaPorudzbine(porudzbinaID,dostavljacKorisnickoIme,daoDostavljac);
	}
	
	/*
	 * Dodavanje artikla u porudzbinu u sesiji koju kreira admin
	 * */
	@GET
	@Path("/dodajArtikalUPorudzbinuAdmin/{artikalID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Artikal dodajArtikalUPorudzbinuAdmin(@PathParam("artikalID") String artikalID, @Context HttpServletRequest request) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		ArtikalDAO artikalDao = (ArtikalDAO) ctx.getAttribute("artikalDAO");
		return dao.dodajArtikalUPorudzbinuAdmin(artikalID,artikalDao, request);
		
	}
	
	
	/*
	 * Uklanja jednu stavku artikla iz porudzbine koju admin kreira
	 * */
	@GET
	@Path("/ukloniArtikalPorudzbinaKreiranjeAdmin/{artikalID}")
	@Produces(MediaType.TEXT_PLAIN)
	public String izbrisiArtikalIzPorudzbineAdmin(@PathParam("artikalID") String artikalID, @Context HttpServletRequest request){
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		
		return dao.izbrisiArtikalIzPorudzbineAdmin(artikalID,request);
	}
	
	
	/*
	 * Porucuje narudzbinu koju je napravio licno admin
	 * Korisnik nam sluzi samo kao pomoc pri prenosu podataka o porudzbini, 
	 * da ne moramo praviti poseban objekat samo za to
	 * */
	@PUT
	@Path("/napraviPorudzbinuAdmin")
	@Produces(MediaType.TEXT_PLAIN)
	public String finalnaPorudzbinaAdmin(@Context HttpServletRequest request, Korisnik informacije) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		KupacDAO kupacDao = (KupacDAO) ctx.getAttribute("kupacDAO");
		DostavljacDAO dostavljacDao = (DostavljacDAO) ctx.getAttribute("dostavljacDAO");
		
		return dao.finalnaPorudzbinaAdmin(request,informacije, kupacDao, dostavljacDao);
	}
	
	
	@DELETE
	@Path("/{porudzbinaID}")
	@Produces(MediaType.TEXT_PLAIN)
	public String obrisiPorudzbinuAdmin(@PathParam("porudzbinaID") String porudzbinaID) throws IOException{
		PorudzbinaDAO dao = (PorudzbinaDAO) ctx.getAttribute("porudzbinaDAO");
		
		return dao.obrisiPorudzbinuAdmin(porudzbinaID);
	}
}