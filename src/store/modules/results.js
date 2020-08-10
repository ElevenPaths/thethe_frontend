import Vue from "vue";
import Vuex from "vuex";

// Import whatever you need from api
// import { whatever } from "../../api";

Vue.use(Vuex);

const state = {
  results: [],
  ready: false,
  scan: null,
};

const getters = {
  get: (state) => (name) =>
    state.results.find((r) => r.name === name) || { result: null },
  ready: (state) => state.ready,
  scanned: (state) => state.scan,
};

const actions = {
  push: ({ commit }, result) => {
    commit("push", result);
  },
  clear: ({ commit }) => {
    commit("clear");
  },
  setOn: ({ commit }, plugin) => {
    commit("setOn", plugin);
  },
  setOff: ({ commit }) => {
    commit("setOff");
  },
};

const mutations = {
  push: (state, result) => {
    let elem = state.results.find((e) => e.name === result.name);
    if (elem) {
      elem.result = result.result;
    } else {
      state.results.push(result);
    }
  },
  clear: (state) => (state.results = []),
  setOn: (state, plugin) => {
    state.scan = plugin;
    state.ready = true;
  },
  setOff: (state) => {
    state.ready = false;
    state.scan = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
