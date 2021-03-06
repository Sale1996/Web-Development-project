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

import beans.Administrator;
import dao.AdministratorDAO;

@Path("/administrator")
public class AdministratorService {
	@Context
	ServletContext ctx;
	
	public AdministratorService(){
		
	}
	
	
	
	@PostConstruct
	public void init() throws IOException{
		if(ctx.getAttribute("administratorDAO")==null){
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("administratorDAO", new AdministratorDAO(contextPath));
		}
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Administrator> vratiAdministratore(){
		AdministratorDAO dao = (AdministratorDAO) ctx.getAttribute("administratorDAO");
		return dao.getAdministratori().values();
	}
}
