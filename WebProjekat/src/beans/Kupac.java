package beans;

import java.util.ArrayList;

public class Kupac extends Korisnik {
   private ArrayList<Restoran> omiljeniRestorani = new ArrayList<Restoran>();
   private ArrayList<Porudzbina> porudzbine =  new ArrayList<Porudzbina>();
   
   public Kupac(){   
   }
   
   /* *
    * Metoda ispituje da li vec postoji dati restoran u listi
    * ako postoij onda ce ga obrisati iz liste , ako ne postoji onda ce
    * ga dodati u listu
    * */
   public void dodajIliObrisiOmiljeniRestoran(Restoran restoran){
	   if(omiljeniRestorani.size()==0){
		   omiljeniRestorani.add(restoran);
		   restoran.setDaLiJeOmiljeni(true);
	   }
	   else{
		   if(omiljeniRestorani.contains(restoran)){
			   omiljeniRestorani.remove(restoran);
			   restoran.setDaLiJeOmiljeni(false);
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

public ArrayList<Porudzbina> getPorudzbine() {
	return porudzbine;
}

public void setPorudzbine(ArrayList<Porudzbina> porudzbine) {
	this.porudzbine = porudzbine;
}
}