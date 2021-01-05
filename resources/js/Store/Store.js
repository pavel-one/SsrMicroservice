import Vue from 'vue'
import Vuex from 'vuex'
import UserStore from "./modules/UserStore";
import SiteStore from "./modules/SiteStore";

Vue.use(Vuex)

export default new Vuex.Store({
    actions: {},
    mutations: {
        setError(state, msg) {
            state.AppError = msg
        }
    },
    state: {
        AppError: undefined
    },
    getters: {
        AppError(state) {
            return state.AppError
        }
    },
    modules: {
        UserStore,
        SiteStore
    }
})