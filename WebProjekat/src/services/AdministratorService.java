package services;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

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
}
