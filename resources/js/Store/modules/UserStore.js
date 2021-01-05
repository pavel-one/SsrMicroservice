import axios from "axios";

export default {
    actions: {
        async fetchUser(ctx) {
            const response = await axios.get('/api/user')
            const user = response.data.data

            ctx.commit('updateUser', user)
        }
    },
    mutations: {
        updateUser(state, user) {
            console.log('UPDATE USER: ', user)

            state.user = user
        }
    },
    state: {
        user: undefined
    },
    getters: {
        getUser(state) {
            return state.user
        }
    },
}