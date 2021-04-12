import axios from "axios";

export default {
  async getAllReservations() {
    return await axios.get("/reservation");
  },
  async createReservation({ description, from, to }) {
    return await axios.post("/reservation", {
      description,
      from,
      to
    });
  },
  async deleteReservation(id) {
    return await axios.delete(`/reservation/${id}`);
  }
};