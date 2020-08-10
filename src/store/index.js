import Vue from "vue";
import Vuex from "vuex";

import resourcelist from "./modules/resourcelist";
import auth from "./modules/auth";
import user from "./modules/user";
import project from "./modules/project";
import tags from "./modules/tags";
import results from "./modules/results";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    resourcelist,
    auth,
    user,
    project,
    tags,
    results,
  },
});
