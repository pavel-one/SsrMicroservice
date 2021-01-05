import Auth from '../js/Pages/Auth'
import Dashboard from '../js/Pages/Dashboard'
import Site from '../js/Pages/Site'

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
        props: {
            title: 'Страница сайта'
        }
    }
]