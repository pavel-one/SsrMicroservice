import Vue from 'vue'
import Buefy from "buefy";
import 'buefy/dist/buefy.min.css'
import VueRouter from 'vue-router'

import App from './Components/Templates/App'

import pagesRoutes from '../routes/pages'
import Store from './Store/Store'
import http from './Services/http'

async function initApp() {
    Vue.use(VueRouter)
    Vue.use(Buefy)
    Vue.use(http, {
        limit: 2000
    })

    const router = new VueRouter({
        routes: pagesRoutes,
        mode: 'history',
        history: true,
        saveScrollPosition: true
    })

    // router.beforeEach((to, from, next) => {
    //     const user = JSON.parse(localStorage.getItem('user'))
    //
    //     console.log('one')
    //     if (to.matched.some(record => record.meta.exceptAuth) && user.id !== null) {
    //         Store.commit("setGlobalError", "Вы уже авторизованы")
    //         next({name: 'dashboard'})
    //     } else {
    //         next()
    //     }
    // })

    router.beforeEach((to, from, next) => {
        const user = JSON.parse(localStorage.getItem('user'))

        console.log('two')
        if (to.matched.some(record => record.meta.requiresAuth) && user.id === null) {
            Store.commit("setGlobalError", "Необходима авторизация")
            next({name: 'auth'})
        } else {
            next()
        }
    })

    new Vue({
        render: h => h(App),
        el: '#app',
        store: Store,
        methods: Store.methods,
        mounted() {
            this.$store.dispatch('fetchUser')
        },
        router
    })

    console.log('init')
}

initApp()