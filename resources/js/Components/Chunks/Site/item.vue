<template>
    <div @click="remove(site._id)" class="card site-item">
        <div class="card-image">
            <b-loading :is-full-page="false" v-model="!site.photo"></b-loading>
            <figure class="image">
                <img :src="site.photo ? '/user_screenshots/'+site.photo : '/no-photo.png'" >
            </figure>
        </div>
        <div class="card-content">
            <b-loading :is-full-page="false" v-model="!site.title"></b-loading>
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{ site.name }}</p>
                    <p class="subtitle is-6">{{ site.title || 'Грузим заголовок' }}</p>
                </div>
            </div>

            <div class="content">
                <div class="description">
                    {{ site.description }}
                </div>
                <div class="bottom has-text-centered">
                    <hr>
                    {{site.created_at | moment("DD.MM.YYYY HH:mm:ss") }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        site: {
            type: Object,
            required: true
        }
    },
    methods: {
        remove: function (id) {
            this.$http.delete('/sites/' + id).then(response => {
                this.$buefy.notification.open({
                    message: response.data.msg,
                    type: response.data.success ? 'is-success' : 'is-danger'
                })

                this.$store.dispatch('fetchSites')
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.site-item {
    width: 300px;
    margin: 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}
.card-image {
    max-height: 187px;
    img {
        width: 100%;
        height: auto;
    }
}
.card-content {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content {
        display: flex;
        flex-direction: column;
    }
}
</style>