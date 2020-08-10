import { api_call } from "../../utils/api";
import Vue from "vue";

const state = { tags: [] };

const getters = {
  get_tags: (state) => state.tags,
  get_tag: (state) => (id) => state.tags.find((tag) => tag._id === id),
};

const actions = {
  LOAD_TAGS: ({ commit }) => {
    let params = {
      url: "/api/get_tags",
    };
    api_call(params)
      .then((resp) => {
        resp.data.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (b.name > a.name) return -1;
          return 0;
        });
        resp.data.map((tag) => (tag._id = tag._id.$oid));
        commit("LOAD_TAGS", resp.data);
      })
      .catch((err) => {
        Vue.notify({
          title: "Error",
          text: err.data.error_message,
          type: "error",
        });
      });
  },

  CREATE_TAG: ({ commit, dispatch }, tag) => {
    api_call({ url: "/api/create_tag", tag: tag })
      .then((resp) => {
        Vue.notify({
          type: "success",
          title: `<b>tags</b>`,
          text: resp.data.success_message,
        });
      })
      .then((resp) => {
        dispatch("LOAD_TAGS");
      })
      .catch((err) => {
        Vue.notify({
          title: "Error",
          text: err.data.error_message,
          type: "error",
        });
      });
  },

  DELETE_TAG: ({ commit, dispatch }, tag_id) => {
    api_call({ url: "/api/delete_tag", tag_id: tag_id })
      .then((resp) => {
        Vue.notify({
          type: "success",
          title: `<b>tags</b>`,
          text: resp.data.success_message,
        });
      })
      .then((resp) => {
        commit("REMOVE_TAG_FROM_RESOURCES", { tag_id: tag_id });
      })
      .then((resp) => {
        dispatch("LOAD_TAGS");
      })
      .catch((err) => {
        Vue.notify({
          title: "Error",
          text: err,
          type: "error",
        });
      });
  },
};

const mutations = {
  LOAD_TAGS: (state, tags) => {
    state.tags = tags;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
