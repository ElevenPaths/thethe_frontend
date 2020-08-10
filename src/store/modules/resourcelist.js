import Vue from "vue";
import Vuex from "vuex";

import { api_call } from "../../utils/api";

Vue.use(Vuex);

const state = {
  resources: [],
  timeline: [],
  running: [],
  loading_resources: false,
};

const actions = {
  add_resource_to_timeline: function({ commit }, resource) {
    commit("add_resource_to_timeline", resource);
  },

  reset_timeline: function({ commit }) {
    commit("reset_timeline");
  },

  ADD_TAG_TO_RESOURCE: function({ commit }, { resource_id, tag_id }) {
    let url = "/api/add_tag";
    api_call({
      url: url,
      resource_id: resource_id,
      tag_id: tag_id,
    })
      .then((resp) => {
        commit("ADD_TAG_TO_RESOURCE", { resource_id, tag_id });
      })
      .catch((err) => {
        Vue.notify({
          type: "error",
          title: `<b>Tags ERROR</b>`,
          text: err,
        });
      });
  },

  REMOVE_TAG_FROM_RESOURCE: function({ commit }, { resource_id, tag_id }) {
    let url = "/api/remove_tag";

    api_call({
      url: url,
      resource_id: resource_id,
      tag_id: tag_id,
    })
      .then((resp) => {
        commit("REMOVE_TAG_FROM_RESOURCE", { resource_id, tag_id });
      })
      .catch((err) => {
        Vue.notify({
          type: "error",
          title: `<b>Tags ERROR</b>`,
          text: err,
        });
      });
  },

  lazy_get_full_resource: async function({ commit, getters }, resource_id) {
    let url = "/api/get_full_resource";
    let resource = getters.get_resource(resource_id);

    if (resource && resource.full) {
      return;
    }

    commit("loading_resources", true);

    await api_call({ url: url, resource_id: resource_id })
      .then((resp) => {
        commit("update_resource", resp.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        commit("loading_resources", false);
      });
  },

  lazy_plugin_results: async function({ commit }, params) {
    let url = "/api/get_lazy_plugin_results";

    commit("loading_resources", true);

    Vue.notify({
      type: "info",
      title: `<b>${params.plugin_name}</b>`,
      text: `Loading history waypoint`,
    });

    await api_call({ url: url, params })
      .then((resp) => {
        commit("update_resource", resp.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        commit("loading_resources", false);
      });
  },

  get_resources: async function({ commit, getters }) {
    let url = "/api/get_resources";
    let project_id = getters.get_opened_project._id;

    commit("loading_resources", true);

    Vue.notify({
      type: "info",
      title: `<b>Loading resources</b>`,
      text: `<b>Getting resources from server`,
    });

    await api_call({ url: url, project_id: project_id })
      .then((resp) => {
        commit("set_resources", resp.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        commit("loading_resources", false);
      });
  },

  add_new_resource: async function({ commit }, payload) {
    let url = "/api/create_resource";
    await api_call({
      url: url,
      resource_name: payload.resource_name,
      resource_type: payload.resource_type,
    })
      .then((resp) => {
        commit("set_resources", resp.data);
      })
      .catch((err) => console.log(err));
  },

  remove_resource: async function({ commit }, payload) {
    let url = "/api/unlink_resource";
    await api_call({
      url: url,
      resource_id: payload.resource_id,
    })
      .then((_) => {
        commit("unlink_resource", payload.resource_id);
      })
      .catch((err) => console.log(err));
  },

  update: async function({ commit }) {
    let url = "/api/ping";

    await api_call({ url: url })
      .then((resp) => {
        if (resp.data.length > 0) {
          resp.data.forEach((update) => {
            commit("add_update", update);
          });
        }
      })
      .catch((err) => console.log(err));
  },

  reset_resource_lists: function({ commit }) {
    commit("reset_resource_lists");
  },

  update_resource: function({ commit }, payload) {
    commit("update_resource", payload);
  },

  loading({ commit }, payload) {
    commit("loading", payload);
  },
};

const mutations = {
  add_resource_to_timeline: function(commit, resource) {
    let found_resource = state.timeline.filter(
      (elem) => elem._id === resource._id
    );

    if (found_resource.length === 0) {
      state.timeline.push(resource);
    }
  },

  reset_timeline: function(commit) {
    state.timeline = [];
  },

  ADD_TAG_TO_RESOURCE: function(commit, { resource_id, tag_id }) {
    let resource = state.resources.find((elem) => elem._id === resource_id);
    // Detect if tag is already there (user has click on same tag)
    if (!resource.tags.find((tag) => tag === tag_id)) {
      resource.tags.push(tag_id);
    }
  },

  REMOVE_TAG_FROM_RESOURCE: function(commit, { resource_id, tag_id }) {
    let resource = state.resources.find((elem) => elem._id === resource_id);
    resource.tags = resource.tags.filter((tag) => tag !== tag_id);
  },

  REMOVE_TAG_FROM_RESOURCES: function(commit, { tag_id }) {
    state.resources.map((resource) => {
      if ("tags" in resource) {
        resource.tags = resource.tags.filter((tag) => tag !== tag_id);
      }
    });
  },

  loading_resources: function(commit, is_loading) {
    state.loading_resources = is_loading;
  },

  set_resources: function(commit, resources) {
    resources.forEach((resource) => {
      if (state.resources.some((el) => el._id === resource._id)) {
        return;
      } else {
        state.resources.push(resource);
      }
    });
  },

  update_resource: function(commit, resource) {
    let resource_target = state.resources.find((el) => el._id === resource._id);
    resource_target.plugins = resource.plugins;
    resource_target.full = true;
  },

  reset_resource_lists: function() {
    state.resources = [];
    state.timeline = [];
  },

  unlink_resource: function(commit, resource_id) {
    state.resources = state.resources.filter((el) => el._id !== resource_id);
  },

  add_update: async function(commit, update) {
    let url = "/api/get_resource";
    let resource_id = update.resource_id;

    await api_call({
      url: url,
      resource_id: resource_id,
    }).then((resp) => {
      let resp_as_json = null;

      try {
        resp_as_json = JSON.parse(resp.data);
      } catch (error) {
        resp_as_json = resp.data;
      }

      let resource = state.resources.find((el) => el._id === resource_id);
      resource.plugins = resp_as_json.plugins;
      resource.tags = resp_as_json.tags;

      // Remove resources running
      let resourcesRunning = state.running.find((el) => el._id === resource_id);
      const index = state.running.indexOf(resourcesRunning);
      if (index > -1) {
        state.running.splice(index, 1);
        Vue.notify({
          type: update.status,
          title: `<b>${resourcesRunning.canonicalName}</b>`,
          text: `<b>${resourcesRunning.plugin}</b> ${update.message}`,
        });
      }
    });
  },

  loading: function(state, payload) {
    let resource = state.resources.find((el) => el._id === payload._id);
    let plugin = resource.plugins.find((el) => el.name === payload.plugin);
    if (plugin) {
      plugin.results = "loading";
    } else {
      resource.plugins.push({
        name: payload.plugin,
        results: "loading",
      });
    }

    let runningPayload = payload;
    runningPayload.canonicalName = resource.canonical_name;
    state.running.push(runningPayload);
  },
};

const getters = {
  get_resources: (state) => (resource_type) => {
    return state.resources.filter(
      (elem) => elem.resource_type === resource_type
    );
  },

  runningTasks: (state) => {
    return state.resources.filter((plugins) =>
      plugins.plugins.some((results) => results.results === "loading")
    );
  },

  is_loading: (state) => {
    return state.loading_resources;
  },

  get_resource: (state) => (id) => {
    return state.resources.find((elem) => elem._id === id);
  },

  get_resource_type: (state) => (id) => {
    let resource = state.resources.filter((elem) => elem._id === id);
    if (resource.length > 0) {
      return resource[0].resource_type;
    } else {
      return null;
    }
  },

  get_timeline: (state) => {
    return state.timeline;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
