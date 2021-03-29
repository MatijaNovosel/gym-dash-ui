import axios from "axios";

export default {
  async createMembership({ amount, duration, purchaseType, purchasedAt }) {
    return await axios.post("/membership", {
      amount,
      duration,
      purchaseType,
      purchasedAt
    });
  },
  async deleteMembershipById(id) {
    return await axios.delete(`/membership/${id}`);
  },
  async getAllMembershipsOfUser(userId) {
    return await axios.get(`/membership/user/${userId}`);
  }
};