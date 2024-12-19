//denne kode blev inkluderet for at konfigurere og centralisere API-anmodninger i app'en ved hjælp af Axios-biblioteket

import axios from "axios"; 

export default axios.create({ //Opretter en ny Axios-instans 
  baseURL: "https://backendsimulatorapp.onrender.com", //Indstiller den grundlæggende URL for API'en: http://localhost:8080/api. Hver HTTP-anmodning (GET, POST, PUT osv.) sendt fra denne instans tilføjer automatisk denne base-URL
  headers: { //Angiver standardoverskrifter, som hver HTTP-anmodning skal inkludere
    "Content-type": "application/json", //Indstiller indholdstypen til JSON, da vi sender JSON-anmodninger til API'en
  },
});