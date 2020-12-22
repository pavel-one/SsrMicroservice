<template>
    <Layout>
        <template v-slot:hero>
            <h1 class="title has-text-centered">Управление сайтами</h1>
            <h2 class="subtitle has-text-centered">Добро пожаловать, {{ user.name || user.email }}</h2>
        </template>
        <div class="site-list-container">
            <div v-for="site in sites" @click="remove(site._id)" class="card site-item">
                <div class="card-image">
                    <b-loading :is-full-page="false" v-model="!site.photo"></b-loading>
                    <figure class="image is-4by3">
                        <img :src="site.photo ? '/user_screenshots/'+site.photo : 'https://bulma.io/images/placeholders/1280x960.png'" alt="Placeholder image">
                    </figure>
                </div>
                <div class="card-content">
                    <b-loading :is-full-page="false" v-model="!site.title"></b-loading>
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">{{ site.name }}</p>
                            <p class="subtitle is-6">{{ site.title }}</p>
                        </div>
                    </div>

                    <div class="content">
                        {{ site.description }}
                        <hr>
                        <time class="has-text-centered" style="display: block">{{site.created_at | moment("DD.MM.YYYY") }}</time>
                    </div>
                </div>
            </div>
            <div class="card site-item add-button" @click="modal_active = !modal_active">
                <b-icon
                    pack="fas"
                    icon="plus"
                    size="is-large"
                    type="is-primary">
                </b-icon>
            </div>
        </div>
        <b-modal
            v-model="modal_active"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-modal>
            <template #default="props">
                <add-site-form @close="modal_active = false"></add-site-form>
            </template>
        </b-modal>
        <a href="#" @click.prevent="logout">Выйти</a>
    </Layout>
</template>

<script>
import Layout from '../Components/Templates/Layout'
import AddSiteForm from '../Components/Chunks/forms/add-site'

export default {
    components: {AddSiteForm, Layout},
    props: ['title'],
    metaInfo() {
        return {
            title: this.title,
        }
    },
    data() {
        return {
            modal_active: false
        }
    },
    computed: {
        user() {
            return this.$store.getters.getUser
        },
        sites() {
            return this.$store.getters.getSites
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
    }
    ,
    mounted() {
        this.$store.dispatch('fetchSites')
        //TODO: Сделать чтобы проверяло только нужные айтемы
        setInterval(() => {
            this.$store.dispatch('fetchSites')
        }, 1000)
    }
}
</script>

<style scoped lang="scss">
.site-list-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
}

.site-item {
    width: 300px;
    margin: 10px;
    cursor: pointer;
}

.add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 400px;
    font-size: 2em;
    transition: .25s;

    &:hover {
        box-shadow: .25em .25em .5em -0.125em rgba(10, 10, 10, .1), 0 0 0 1px rgba(10, 10, 10, .02);
    }
}
</style>