import Auth from '../js/Pages/Auth'
import Dashboard from '../js/Pages/Dashboard'

export default [
    {
        path: '/',
        name: 'index',
        component: Auth
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
    }
]