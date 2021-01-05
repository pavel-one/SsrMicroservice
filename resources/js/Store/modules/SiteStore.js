import axios from "axios";

export default {
    actions: {
        async fetchSites(ctx) {
            const response = await axios.get('/api/sites')

            ctx.commit('updateSites', response.data.data)
        },

        async fetchSite(ctx, params) {
            const response = await axios.get('/api/site/' + params.id)

            if (!response.data.success) {
                throw new Error(response.data.msg)
            }

            ctx.commit('setSite', response.data.data)
        }
    },
    mutations: {
        updateSites(state, sites) {
            state.sites = sites
        },
        setSite(state, data) {
            state.site = data
        }
    },
    state: {
        sites: [],
        site: {}
    },
    getters: {
        getSites(state) {
            return state.sites
        },
        getSite(state) {
            return state.site
        }
    },
}