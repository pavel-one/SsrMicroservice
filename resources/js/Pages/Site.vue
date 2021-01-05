<template>
    <Layout>
        Route Params Id {{ $route.params.id }} <br>
        Store: {{ site }}
    </Layout>
</template>

<script>
import Layout from "../Components/Templates/Layout";

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
}
</script>

<style scoped>

</style>