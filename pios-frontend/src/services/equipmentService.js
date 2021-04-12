import axios from "axios";

export default {
  async getAllTypes() {
    return await axios.get("/equipment/type");
  },
  async createEquipmentType(name) {
    return await axios.post("/equipment/type", {
      name
    });
  },
  async createEquipment({ name, typeId }) {
    return await axios.post("/equipment", {
      name,
      typeId
    });
  },
  async assignToCurrentUser(equipmentId) {
    return await axios.post(`/equipment/assign/${equipmentId}`);
  },
  async unassignFromUser(equipmentId) {
    return await axios.delete(`/equipment/unassign/${equipmentId}`);
  },
  async getEquipment(name, showOnlyUserEquipment, type) {
    return await axios.get("/equipment", {
      params: {
        name,
        showOnlyUserEquipment,
        type
      }
    });
  }
};