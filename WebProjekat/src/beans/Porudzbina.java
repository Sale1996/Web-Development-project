package beans;

import java.util.HashMap;

import sun.util.calendar.LocalGregorianCalendar.Date;

public class Porudzbina {
   private Date datumIVremePorudzbine;
   private String statusPorudzbine;
   private String napomena;
   
   private HashMap<Artikal,Integer> mapaARTIKALbrojPorudzbina;
   private Kupac kupacKojiNarucuje;
   private Dostavljac dostavljac;
   
}