import { createStore } from 'vuex'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
import { NULL } from 'sass'

// usado para login
axios.defaults.withCredentials = true
// axios.defaults.baseURL = "http://localhost:8000"
export default createStore({
  state: {
    user: null,
    presupuestacionID: null,
    proveedorID: null,
  },
  
  mutations: {
    SET_USER(state, user){
      console.log("user");
      console.log(user);
      state.user = user
    }
  },
  
  actions: {
    async login({ dispatch },credentials){
      console.log("credentials");
      // console.log(credentials);

      await axios.get("/sanctum/csrf-cookie");
      console.log("respuesta cookie");
      const respuesta = await axios.post("/login", credentials);
      console.log("respuesta");
      // console.log(respuesta.errors.message);

      return dispatch("getUser");
    },

    getUser({ commit }){
      console.log("getUser");
      const res = axios.get("/user")
        .then(res => {
          console.log("res");
          console.log(res);

          commit("SET_USER", res.data)
        })
        .catch(() => {
          console.log("res");
          console.log(res);

          commit("SET_USER", null)
        })
      

    },
  },
  
  modules: {

  }
})

