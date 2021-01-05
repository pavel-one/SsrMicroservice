<template>
    <Layout>
        Пользователь {{ $route.params.id }}
    </Layout>
</template>

<script>
import Layout from "../Components/Templates/Layout";

export default {
    components: {Layout},
}
</script>

<style scoped>

</style>