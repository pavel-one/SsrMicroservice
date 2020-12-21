<template>
    <Layout>
        <a href="#" @click.prevent="logout">Выйти</a>
    </Layout>
</template>

<script>
import Layout from "../Components/Templates/Layout";

export default {
    components: {Layout},
    props: ['title'],
    metaInfo() {
        return {
            title: this.title,
        }
    },
    methods: {
        logout: function () {
            this.$http.post('/logout').then(response => {
                this.$buefy.notification.open({
                    message: response.data.msg,
                    type: response.data.success ? 'is-success' : 'is-danger'
                })

                if (response.data.success) {
                    this.$store.dispatch('fetchUser')
                        .then(res => {
                            this.$router.push({name: 'auth'})
                        })
                }
            })
        }
    },
}
</script>

<style scoped>

</style>