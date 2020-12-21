import axios from "axios";

export default {
    actions: {
        async fetchSites(ctx) {
            const response = await axios.get('/api/sites')

            ctx.commit('updateSites', response.data.data)
        }
    },
    mutations: {
        updateSites(state, sites) {
            state.sites = sites
        }
    },
    state: {
        sites: []
    },
    getters: {
        getSites(state) {
            return state.sites
        }
    },
}