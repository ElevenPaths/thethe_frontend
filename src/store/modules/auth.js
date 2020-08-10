/* eslint-disable promise/param-names */

import { api_call } from "../../utils/api";
import * as jwt_decode from "jwt-decode";

const state = {
  token: localStorage.getItem("user-token") || "",
  status: "",
  hasLoadedOnce: false,
  username: "",
};

const getters = {
  is_authenticated: (state) => !!state.token,
  auth_status: (state) => state.status,
  username: (state) => state.username,
  me: (state) => {
    try {
      return jwt_decode(state.token);
    } catch (exception) {
      return false;
    }
  },
};

const actions = {
  AUTH_REQUEST: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit("AUTH_REQUEST");
      api_call({ url: "/api/auth", data: user })
        .then((resp) => {
          localStorage.setItem("user-token", resp.data.token);
          // Here set the header of your ajax library to the token value.
          // example with axios
          // axios.defaults.headers.common['Authorization'] = resp.token
          commit("AUTH_SUCCESS", resp);
          resolve(resp);
        })
        .catch((err) => {
          commit("AUTH_ERROR", err);
          localStorage.removeItem("user-token");
          reject(err);
        });
    });
  },
  AUTH_LOGOUT: ({ commit, dispatch }) => {
    return new Promise((resolve, reject) => {
      commit("AUTH_LOGOUT");
      localStorage.removeItem("user-token");
      resolve();
    });
  },
};

const mutations = {
  AUTH_REQUEST: (state) => {
    state.status = "loading";
  },
  AUTH_SUCCESS: (state, resp) => {
    state.status = "success";
    state.token = resp.data.token;
    state.hasLoadedOnce = true;
    state.username = resp.data.username;
  },
  AUTH_ERROR: (state) => {
    state.status = "error";
    state.hasLoadedOnce = true;
  },
  AUTH_LOGOUT: (state) => {
    state.token = "";
    state.username = "";
    localStorage.clear();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
