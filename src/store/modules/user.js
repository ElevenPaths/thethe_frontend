import { api_call } from "../../utils/api";
import Vue from "vue";

const state = { status: "", profile: {} };

const getters = {
  getProfile: (state) => state.profile,
  isProfileLoaded: (state) => !!state.profile.name,
};

const actions = {
  USER_REQUEST: ({ commit, dispatch }) => {
    commit("USER_REQUEST");
    api_call({ url: "user/me" })
      .then((resp) => {
        commit("USER_SUCCESS", resp);
      })
      .catch((resp) => {
        commit("USER_ERROR");
        // if resp is unauthorized, logout, to
        dispatch("AUTH_LOGOUT");
      });
  },
};

const mutations = {
  USER_REQUEST: (state) => {
    state.status = "loading";
  },
  USER_SUCCESS: (state, resp) => {
    state.status = "success";
    Vue.set(state, "profile", resp);
  },
  USER_ERROR: (state) => {
    state.status = "error";
  },
  AUTH_LOGOUT: (state) => {
    state.profile = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
