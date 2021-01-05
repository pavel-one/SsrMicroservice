import Vue from 'vue'
import VueMeta from 'vue-meta'
import Buefy from "buefy";
import 'buefy/dist/buefy.min.css'
import VueRouter from 'vue-router'

import App from './Components/Templates/App'

import pagesRoutes from '../routes/pages'
import Store from './Store/Store'
import http from './Services/http'

async function initApp() {
    Vue.use(VueRouter)
    Vue.use(Buefy, {
        defaultIconPack: 'fas'
    })
    Vue.use(VueMeta, {
        refreshOnceOnNavigation: true
    })
    Vue.use(http, {
        limit: 2000
    })

    const router = new VueRouter({
        routes: pagesRoutes,
        mode: 'history',
        history: true,
        saveScrollPosition: true
    })

    router.beforeEach(async (to, from, next) => {
        await Store.dispatch('fetchUser')
        const user = Store.getters.getUser

        if (to.matched.some(record => record.meta.requiresAuth) && !user._id) {
            Store.commit('setError', 'Необходима авторизация')
            next({name: 'auth'})
        }

        if (to.matched.some(record => record.meta.exceptAuth) && user._id) {
            Store.commit('setError', 'Вы уже авторизованы')
            next({name: 'dashboard'})
        }

        next()
    })

    new Vue({
        render: h => h(App),
        el: '#app',
        store: Store,
        router
    })

}

initApp()