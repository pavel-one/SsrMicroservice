import Auth from '../js/Pages/Auth'
import Dashboard from '../js/Pages/Dashboard'
import Site from '../js/Pages/Site'
import Store from "../js/Store/Store";

export default [
    {
        path: '/',
        name: 'index',
        component: Auth,
        props: {
            title: 'Авторизация'
        },
        meta: {
            exceptAuth: true
        },
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth,
        meta: {
            exceptAuth: true
        },
        props: {
            title: 'Авторизация'
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true
        },
        props: {
            title: 'Личный кабинет'
        }
    },
    {
        path: '/dashboard/site/:id',
        name: 'site',
        component: Site,
        meta: {
            requiresAuth: true
        },
        beforeEnter: async (to, from, next) => {
            await Store.dispatch('fetchSite', {
                id: to.params.id
            }).catch(err => {
                next({
                    name: 'dashboard',
                    params: {
                        err: err.message
                    }
                })
            })

            next()
        }
    }
]