import Auth from '../js/Pages/Auth'
import Dashboard from '../js/Pages/Dashboard'

export default [
    {
        path: '/',
        name: 'index',
        component: Auth,
        props: {
            title: 'Авторизация'
        }

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
    }
]