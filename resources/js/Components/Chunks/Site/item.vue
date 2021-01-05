<template>
    <router-link :to="{name: 'site', params: {id: site._id}}" class="card site-item">
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
                    {{ created_time }}
                    <br>
                    <a @click.prevent="goSite" :href="site.base_url" target="_blank">{{site.base_url}}</a>
                    <br>
                    <br>
                    <div>
                        <b-button type="is-primary is-light" size="is-small" :disabled="site.loadParser">
                            <b-icon style="margin-right: 5px" icon="fas fa-sync"
                                :custom-class="site.loadParser ? 'fa-spin' : ''">
                            </b-icon>
                            {{site.loadParser ? 'Индексируется' : 'Индексировать'}}
                        </b-button>
                        <b-button type="is-danger is-light" size="is-small" @click.prevent="remove(site._id)">
                            <b-icon style="margin-right: 5px" icon="fas fa-trash"></b-icon>
                            Удалить
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
import Moment from 'moment'

export default {
    props: {
        site: {
            type: Object,
            required: true
        }
    },
    computed: {
        created_time() {
            return new Moment(this.site.created_at).locale('ru').fromNow()
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
        goSite() {
            window.open(this.site.base_url, '_blank')
        }
    }
}
</script>

<style lang="scss" scoped>
.site-item {
    width: 300px;
    margin: 10px;
    //cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: .25s;
    &:hover {
        box-shadow: .25em .25em .5em -0.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
    }
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