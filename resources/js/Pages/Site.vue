<template>
    <Layout>
        Route Params Id {{ $route.params.id }} <br>
        Store: {{ site }}
    </Layout>
</template>

<script>
import Layout from "../Components/Templates/Layout";
import Store from "../Store/Store";

export default {
    components: {Layout},
    metaInfo() {
        return {
            title: 'Информация о сайте: ' + this.site.name,
        }
    },
    computed: {
        site() {
            return this.$store.getters.getSite
        }
    },
    // mounted() {
    //     this.$store.dispatch('fetchSite', {
    //         id: this.$route.params.id
    //     })
    // }
}
</script>

<style scoped>

</style>