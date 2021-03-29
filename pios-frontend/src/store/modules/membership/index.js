import { isBefore } from "date-fns";
import { AUTH_ROLE } from "../../../constants/enumerations";
import {
  calculateExpiresAtDate
} from "../../../helpers/index";
import store from "../../index";

export default {
  state: {
    memberships: []
  },
  mutations: {
    setMemberships(state, payload) {
      state.memberships = payload;
    }
  },
  actions: {
    setMemberships({ commit }, payload) {
      commit("setMemberships", payload);
    }
  },
  getters: {
    memberships: state => state.memberships,
    validMembership: state => {
      if (store.getters.user.role == AUTH_ROLE.ROLE_ADMIN) {
        return true;
      } else {
        if (state.memberships && state.memberships.length != 0) {
          return isBefore(
            new Date(),
            new Date(
              calculateExpiresAtDate(
                state.memberships[0].purchasedAt,
                state.memberships[0].duration
              )
            )
          );
        }
        return false;
      }
    }
  },
}