package beans;

import java.util.ArrayList;

import dao.RestoranDAO;

public class Kupac extends Korisnik {
   private ArrayList<Restoran> omiljeniRestorani = new ArrayList<Restoran>();
   private int nagradniBodovi;
   
   public Kupac(){   
	   nagradniBodovi=0;
   }
   
   /* *
    * Metoda ispituje da li vec postoji dati restoran u listi
    * ako postoij onda ce ga obrisati iz liste , ako ne postoji onda ce
    * ga dodati u listu
    * */
   public void dodajIliObrisiOmiljeniRestoran(Restoran restoran, RestoranDAO restoranDao){
	   if(omiljeniRestorani.size()==0){
		   omiljeniRestorani.add(restoran);
		   restoran.setDaLiJeOmiljeni(true);
	   }
	   else{
		   //sada trebamo da prodjemo kroz listu i da vidimo jel ga ima vec
		   Boolean imaRestoran=false;
		   for(Restoran item : omiljeniRestorani){
			   if(item.getNaziv().equals(restoran.getNaziv())){
				   imaRestoran=true;
				   break;
			   }
		   }
		   if(imaRestoran){
			   //idemo kroz listu i brisemo restoran sa tim nazivom
			   for(Restoran item : omiljeniRestorani){
				   if(item.getNaziv().equals(restoran.getNaziv())){
					   omiljeniRestorani.remove(item);
					   item.setDaLiJeOmiljeni(false);
					   for(Restoran item2 : restoranDao.getRestorani().values()){
						   if(restoran.getNaziv().equals(item2.getNaziv())){
							   item2.setDaLiJeOmiljeni(false);
							   break;
						   }
					   }
					   
					   break;
				   }
			   }
		   }
		   else{
			   omiljeniRestorani.add(restoran);
			   restoran.setDaLiJeOmiljeni(true);
		   }
	   }
	 
   }

public ArrayList<Restoran> getOmiljeniRestorani() {
	return omiljeniRestorani;
}

public void setOmiljeniRestorani(ArrayList<Restoran> omiljeniRestorani) {
	this.omiljeniRestorani = omiljeniRestorani;
}

public int getNagradniBodovi() {
	return nagradniBodovi;
}

public void setNagradniBodovi(int nagradniBodovi) {
	this.nagradniBodovi = nagradniBodovi;
}


}