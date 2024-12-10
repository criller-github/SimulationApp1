import http from "../http-common";

class ShopItemDataService {
    getAll(category) {
        return http.get("/shopitems" + (category ? `?category=${category}` : ''));
    }

  get(id) {
    return http.get(`/shopitems/${id}`);
  }

  create(data) {
    return http.post("/shopitems", data);
  }

  update(id, data) {
    return http.put(`/shopitems/${id}`, data);
  }

  delete(id) {
    return http.delete(`/shopitems/${id}`);
  }
}

export default new ShopItemDataService();
