import axios from "axios";

export default {
  async updatePreference(darkMode, locale) {
    return await axios.put("/user/preferences", {
      darkMode,
      locale
    });
  },
  async getAllUsers() {
    return await axios.get("/user");
  },
  async changePassword(newPassword) {
    return await axios.put("/user/change-password", {
      newPassword
    });
  }
};