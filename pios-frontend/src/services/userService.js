import axios from "axios";

export default {
  async updatePreference(darkMode, locale) {
    return await axios.put("/user/preferences", {
      darkMode,
      locale
    });
  }
};