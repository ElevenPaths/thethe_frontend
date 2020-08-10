const axios = require("axios").create();

if (process.env.NODE_ENV === "development") {
  console.log("Starting development mode...");
  axios.defaults.baseURL = "http://localhost:8000";
} else {
}

import router from "../router";
import store from "../store";

// This snippet is for global-cached axios header for token
/* const token = localStorage.getItem("user-token");
if (token) {
  axios.defaults.headers.common.Authorization = token;
} */

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          store.dispatch("AUTH_LOGOUT");
          if (
            router.history.current.fullPath === "/login" ||
            router.history.current.fullPath === "/init"
          ) {
            return Promise.reject(error.response);
          } else {
            router.push("/login").catch((err) => {
              console.log(err);
            });
          }

        case 400:
          return Promise.reject(error.response);
      }
    }

    // Deal with server offline
    if (!error.status) {
      //TODO: Should return a Promise with a message to let know user server is down.
      store.dispatch("RESET_PROJECT");
      console.log("Server appears to be down");
      router.push("/wait");
    }

    return Promise.reject(error.response);
  }
);

const api_call = ({ url, ...args }) => {
  const token = localStorage.getItem("user-token");
  const headers = {};
  if (token) {
    headers.Authorization = token;
  }
  return axios.post(url, args, { headers: headers });
};

export { api_call };
