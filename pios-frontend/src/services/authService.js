import axios from "axios";

export default {
  async login(usernameOrEmail, password) {
    return await axios.post("auth/login", {
      usernameOrEmail,
      password
    });
  },
  async register(usernameOrEmail, password) {
    return await axios.post("auth/register", {
      usernameOrEmail,
      password
    });
  }
};