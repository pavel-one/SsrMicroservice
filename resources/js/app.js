import Vue from 'vue'
import Buefy from "buefy";
import 'buefy/dist/buefy.min.css'
import VueRouter from 'vue-router'

import App from './Components/Templates/App'

import pagesRoutes from '../routes/pages'
import Store from './store/Store'
import axios from 'axios'

Vue.use(VueRouter)
Vue.use(Buefy)

Vue.prototype.$http = axios

//Функция тротлинга
Vue.prototype.$wait = function (callback, limit) {
    let wait = false;

    return function () {
        if (!wait) {
            callback.call();
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}
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
        return Store.state
    },
    methods: Store.methods,
    router
})

console.log('init')