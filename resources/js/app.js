import Vue from 'vue'
import Buefy from "buefy";
import 'buefy/dist/buefy.min.css'
import VueRouter from 'vue-router'

import App from './Components/Templates/App'

import pagesRoutes from '../routes/pages'
import Store from './Store/Store'
import http from './Services/http'
import router from './Services/router'

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

    new Vue({
        render: h => h(App),
        el: '#app',
        data() {
            return Store.states
        },
        methods: Store.methods,
        async created() {
            // this.syncState();
            // console.log(await this.$getUser())
        },
        router
    })

    console.log('init')
}

initApp()