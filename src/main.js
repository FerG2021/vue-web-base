import { createApp } from 'vue'
// Elment plus
import ElementPlus from 'element-plus'
import ElMessage from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/es'

import App from './App.vue'

// importamos las rutas
import router from './router/index.js'

// vuex
import { createStore } from 'vuex'

// importo los componentes de forma global
import Modal from './components/modal/index.vue'
import ModalSinCerrar from './components/modal_sin_cerrar/index.vue'
import Boton from './components/boton/index.vue'
import MacaSelectBox from './components/select_box/index.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

// usado para login
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// axios.defaults.headers.common = {
//   'X-Requested-With': 'XMLHttpRequest',
//   'X-CSRF-TOKEN': window.csrf_token
//   // 'X-CSRF-TOKEN': ('meta[name="csrf-token"]').attr('content')
// };

console.log(import.meta.env.VITE_API_URL);


const variableGlobal = {
  data() {
    return {
      // base_url: 'http://localhost:8000/api'
    }
  },
}

// Create a new store instance.
const store = createStore({
  state: { 
    user: null,
    auth: false,
  },
  mutations: { 
    SET_USER(state, user){
      state.user = user
      state.auth = Boolean(user)
    }
  },
  actions:{
    async login({ dispatch }, credentials ){
      await axios.get("/sanctum/csrf-cookie");
      await axios.post("/login", credentials);
      return dispatch("getUser");
    },

    async logout({ dispatch }){
      await axios.post("/logout");
      return dispatch("getUser");
    },

    getUser({ commit }){
      axios.get("/api/user")
        .then(res => {
          commit('SET_USER', res.data)
        })
        .catch(() => {
          commit('SET_USER', null)
        })
    },
  },
  modules:{}
})

store.dispatch('getUser');

createApp(App)
  .use(router)
  .use(ElementPlus, {locale})
  .use(ElMessage)
  .use(VueAxios, axios)
  .mixin(variableGlobal)
  .use(store)
  .component('Modal', Modal)
  .component('ModalSinCerrar', ModalSinCerrar)
  .component('Boton', Boton)
  .component('MacaSelectBox', MacaSelectBox)
  .mount('#app')
