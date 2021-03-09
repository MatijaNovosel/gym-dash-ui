import axios from "axios";

export default {
  async login(usernameOrEmail, password) {
    return await axios.post("auth/login", {
      usernameOrEmail,
      password
    });
  }
};