import Vue from 'vue'
import Vuex from 'vuex'
import UserStore from "./modules/UserStore";

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {},
    mutations: {},
    state: {

    },
    getters: {},
    modules: {
        UserStore
    }
})