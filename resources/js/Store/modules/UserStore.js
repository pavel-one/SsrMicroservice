import axios from "axios";

export default {
    actions: {
        async fetchUser(ctx) {
            const response = await axios.get('/api/user')
            const user = response.data.data
            localStorage.setItem('user', JSON.stringify(user))

            ctx.commit('updateUser', user)
        }
    },
    mutations: {
        setGlobalError(state, msg) {
            console.log('GLOBAL ERROR', msg)
        },
        updateUser(state, user) {
            user = JSON.parse(localStorage.getItem('user'))
            console.log("UPDATED USER", user)
            state.user = user
        }
    },
    state: {
        user: localStorage.getItem('user')
    },
    getters: {
        getUser(state) {
            return state.user
        }
    },
}