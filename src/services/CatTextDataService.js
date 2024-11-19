// for at kunne kommunikere med vores backend-API for CatText-ressourcen, skal vi oprette en service til at håndtere alle HTTP-anmodninger.

import http from "../http-common";

class CatTextDataService {
  getAll() {
    return http.get("/cattexts");
  }

  get(id) {
    return http.get(`/cattexts/${id}`);
  }

  create(data) {
    return http.post("/cattexts", data);
  }

  update(id, data) {
    return http.put(`/cattexts/${id}`, data);
  }

  delete(id) {
    return http.delete(`/cattexts/${id}`);
  }

  deleteAll() {
    return http.delete(`/cattexts`);
  }

  findByImageId(image_id) {
    return http.get(`/cattexts?image_id=${image_id}`);
  }
}

export default new CatTextDataService();