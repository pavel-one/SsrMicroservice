
export default {
    states: {
        // user: this.serverUser
    },
    methods: {
        syncState: function () {
            this.getStates().then(res => {
                this.states = res.data.data
            })
        },
        getStates: function () {
            return this.$http.get('/api/props')
        }
    },
}