package services;

import java.io.IOException;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.Dostavljac;
import dao.DostavljacDAO;

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
	
}
