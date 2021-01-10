<template>
    <Layout>
        <template v-slot:hero>
            <div style="display: flex; flex-direction: row;">
                <div class="left box" style="max-width: 500px; margin-right: 20px">
                    <img style="width: 100%; display: block; margin: auto" :src="'/user_screenshots/'+site.photo" alt="">
                </div>
                <div class="right">
                    <h1 class="title">{{ site.name }}</h1>
                    <h2 class="subtitle">
                        <a :href="site.base_url" target="_blank">{{ site.base_url }}</a>
                    </h2>
                    Всего страниц: <span class="has-background-primary-light">0</span> <br>
                    Всего ошибок: <span class="has-background-danger-light">0</span> <br>
                    {{ site.load_date }} <br>
                    {{ site.loadParser }}
                </div>
            </div>
        </template>

        <div class="columns">
            <div class="column">
                <h1 class="title">Успешные страницы</h1>
                <h2 class="subtitle">Страницы которые были успешно спарсены</h2>
                <page-list-item @updateAll="updateAll" ref="successPageList"></page-list-item>
            </div>
            <div class="column">
                <h1 class="title">Ошибки</h1>
                <h2 class="subtitle">Страницы которые при парсинге выпали в ошибку</h2>
                <page-list-item @updateAll="updateAll" :error="true" ref="errorPageList"></page-list-item>
            </div>
        </div>
    </Layout>
</template>

<script>
import Layout from "../Components/Templates/Layout";
import PageListItem from "../Components/Chunks/Site/page-list-item"

export default {
    components: {Layout, PageListItem},
    metaInfo() {
        return {
            title: 'Информация о сайте: ' + this.site.name,
        }
    },
    computed: {
        site() {
            return this.$store.getters.getSite
        },
    },
    methods: {
        updateAll: function () {
            for (let keyComponent in this.$refs) {
                this.$refs[keyComponent].fetch()
            }
        }
    }
}
</script>

<style scoped>

</style>