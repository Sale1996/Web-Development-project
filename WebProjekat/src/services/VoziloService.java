package services;

import java.io.IOException;
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

import beans.Vozilo;
import dao.VoziloDAO;

@Path("/vozila")
public class VoziloService {

	@Context
	ServletContext ctx;
	
	public VoziloService(){}
	
	@PostConstruct
	public void init(){
		if(ctx.getAttribute("voziloDAO")==null){
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("voziloDAO", new VoziloDAO(contextPath));
		}
	}
	
	//vraca sva vozila
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Vozilo> vratiSvaVozila(){
		VoziloDAO dao=(VoziloDAO) ctx.getAttribute("voziloDAO");
		return dao.vratiSvaVozila();
	}
	//menja vozilo
	@POST
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String dodajNovoVozilo(Vozilo vozilo) throws IOException{
		VoziloDAO dao= (VoziloDAO) ctx.getAttribute("voziloDAO");
		return dao.dodajNovoVozilo(vozilo);
	}
	
	//vraca vozilo od registarske table
	@GET
	@Path("/{vozilo}")
	@Produces(MediaType.APPLICATION_JSON)
	public Vozilo vratiOdredjenoVozilo(@PathParam("vozilo") String vozilo){
		VoziloDAO dao = (VoziloDAO) ctx.getAttribute("voziloDAO");
		return dao.vratiVozilo(vozilo);
	}
	
	//izmena vozila koji je prosledjen
	@PUT
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String izmeniVozilo(Vozilo vozilo) throws IOException{
		VoziloDAO dao = (VoziloDAO) ctx.getAttribute("voziloDAO");
		
		return dao.izmeniVozilo(vozilo);
	}
	
	//brisanje vozila
	@DELETE
	@Path("/{vozilo}")
	@Produces(MediaType.TEXT_PLAIN)
	public String obrisiVozilo(@PathParam("vozilo") String vozilo) throws IOException{
		VoziloDAO dao = (VoziloDAO) ctx.getAttribute("voziloDAO");
		
		return dao.obrisiVozilo(vozilo);
	}
	
	
}
