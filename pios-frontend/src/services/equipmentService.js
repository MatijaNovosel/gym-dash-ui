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
};