// for at kunne kommunikere med vores backend-API for CatText-ressourcen, skal vi oprette en service til at håndtere alle HTTP-anmodninger.

//importere Axios-instansen fra src/http-common.js
//http er en Axios-instans konfigureret i http-common.js
//Det angiver basen (baseURL) og standard-headere, som alle API-kald i denne service vil bruge
//Dette gør det muligt kun at specificere endpointet (/cattexts) i stedet for hele URL'en (http://localhost:8080/api/cattexts) i alle metoder
import http from "../http-common"; 

class CatTextDataService { //Klassen indeholder metoder til at udføre CRUD-operationer (Create, Read, Update, Delete) på CatText-ressourcen
  getAll() { //Henter alle CatText-ressourcer fra backend-serveren
    return http.get("/cattexts");
  }

  get(id) { //Henter en specifik CatText-ressource baseret på dens id
    return http.get(`/cattexts/${id}`); 
  }

  create(data) { //sender en POST-anmodning til /cattexts-endpointet, med data, for at oprette en ny CatText-ressource
    return http.post("/cattexts", data);
  }

  update(id, data) { //sender en PUT-anmodning til /cattexts/:id-endpointet, med data, for at opdatere en eksisterende CatText-ressource
    return http.put(`/cattexts/${id}`, data);
  }

  delete(id) { //sender en DELETE-anmodning til /cattexts/:id-endpointet for at slette en eksisterende CatText-ressource
    return http.delete(`/cattexts/${id}`);
  }

  deleteAll() { //sender en DELETE-anmodning til /cattexts-endpointet for at slette alle CatText-ressourcer (den bruger vi ikke i vores app)
    return http.delete(`/cattexts`);
  }

  findByImageId(image_id) { //Henter alle CatText-ressourcer, der er tilknyttet en bestemt Image-ressource, baseret på dens image
    return http.get(`/cattexts?image_id=${image_id}`);
  }
}

export default new CatTextDataService();