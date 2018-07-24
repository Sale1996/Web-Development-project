package services;

import java.util.ArrayList;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Porudzbina;
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
}
