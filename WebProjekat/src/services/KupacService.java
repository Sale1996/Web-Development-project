package services;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Kupac;
import dao.KupacDAO;

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
	
	
	@POST
	@Path("/")
	@Produces(MediaType.TEXT_PLAIN)
	public String dodajKupca(Kupac kupac) throws IOException{
		KupacDAO dao = (KupacDAO) ctx.getAttribute("kupacDAO");
		
		return dao.dodajNovogKorisnika(kupac);
	} 
	
	
	
	
}
