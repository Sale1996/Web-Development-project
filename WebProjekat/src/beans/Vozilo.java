package beans;


public class Vozilo {
   private String marka;
   private String model;
   private String tip;
   private String registarskaOznaka;
   private int godinaProizvodnje;
   private Boolean daLiJeUUpotrebi;
   private String napomena;
   private Boolean obrisan;
   private String staraRegistarskaOznaka;
   
   public Vozilo(){
		this.daLiJeUUpotrebi=false;
		this.obrisan=false;
   }

public Vozilo(String marka, String model, String tip, String registarskaOznaka, int godinaProizvodnje,
		String napomena) {
	super();
	this.marka = marka;
	this.model = model;
	this.tip = tip;
	this.registarskaOznaka = registarskaOznaka;
	this.godinaProizvodnje = godinaProizvodnje;
	this.napomena = napomena;
	this.daLiJeUUpotrebi=false;
	this.obrisan=false;
}

public String getMarka() {
	return marka;
}

public void setMarka(String marka) {
	this.marka = marka;
}

public String getModel() {
	return model;
}

public void setModel(String model) {
	this.model = model;
}

public String getTip() {
	return tip;
}

public void setTip(String tip) {
	this.tip = tip;
}

public String getRegistarskaOznaka() {
	return registarskaOznaka;
}

public void setRegistarskaOznaka(String registarskaOznaka) {
	this.registarskaOznaka = registarskaOznaka;
}

public int getGodinaProizvodnje() {
	return godinaProizvodnje;
}

public void setGodinaProizvodnje(int godinaProizvodnje) {
	this.godinaProizvodnje = godinaProizvodnje;
}

public Boolean getDaLiJeUUpotrebi() {
	return daLiJeUUpotrebi;
}

public void setDaLiJeUUpotrebi(Boolean daLiJeUUpotrebi) {
	this.daLiJeUUpotrebi = daLiJeUUpotrebi;
}

public String getNapomena() {
	return napomena;
}

public void setNapomena(String napomena) {
	this.napomena = napomena;
}

public Boolean getObrisan() {
	return obrisan;
}

public void setObrisan(Boolean obrisan) {
	this.obrisan = obrisan;
}

public String getStaraRegistarskaOznaka() {
	return staraRegistarskaOznaka;
}

public void setStaraRegistarskaOznaka(String staraRegistarskaOznaka) {
	this.staraRegistarskaOznaka = staraRegistarskaOznaka;
}
   
   

}