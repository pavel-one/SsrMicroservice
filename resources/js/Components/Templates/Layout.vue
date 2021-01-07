<template>
    <div>
        <div class="container">
            <b-navbar>
                <template slot="brand">
                    <b-navbar-item tag="router-link" :to="{ name: 'index' }">
                        <div class="logo">
                            <div class="top">SSR</div>
                            <div class="bottom">Microservice</div>
                        </div>
                    </b-navbar-item>
                </template>
                <template slot="start">
                    <!--
                    <b-navbar-item tag="router-link" :to="{ name: 'index' }">
                        Главная
                    </b-navbar-item>
                    <b-navbar-dropdown label="Документация">
                        <b-navbar-item tag="router-link" :to="{ name: 'index' }">
                            Установка
                        </b-navbar-item>
                        <b-navbar-item tag="router-link" :to="{ name: 'index' }">
                            Продакшн
                        </b-navbar-item>
                    </b-navbar-dropdown>
                    -->
                </template>

                <template slot="end">
                    <b-navbar-item tag="div">
                        <div class="buttons" v-if="!$store.getters.getUser._id">
                            <router-link class="button is-primary is-light"
                                         :to="{name: 'auth'}">
                                Войти
                            </router-link>
                        </div>
                        <div class="buttons" v-if="$store.getters.getUser._id">
                            <router-link class="button is-primary is-light"
                                         :to="{name: 'index'}">
                                Мой профиль
                            </router-link>
                            <a @click.prevent="logout" class="button is-danger is-light" href="#">
                                Выйти
                            </a>
                        </div>
                    </b-navbar-item>
                </template>
            </b-navbar>
        </div>
        <section class="hero">
            <div class="hero-body">
                <div class="container">
                    <slot name="hero"></slot>
                </div>
            </div>
        </section>
        <div :style="css" class="container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ['css'],
    computed: {
        appError() {
            return this.$store.getters.AppError
        }
    },
    watch: {
        appError: function (val, old) {
            if (val) {
                this.$buefy.notification.open({
                    message: val,
                    type: 'is-warning'
                })
            }
        }
    },
    methods: {
        logout: async function () {
            const response = await this.$http.post('/logout')

            this.$buefy.notification.open({
                message: response.data.msg,
                type: response.data.success ? 'is-success' : 'is-danger'
            })

            if (response.data.success) {
                await this.$router.push({name: 'auth'})
            }
        }
    },
    mounted() {
        if (this.appError) {
            this.$buefy.notification.open({
                message: this.appError,
                type: 'is-warning'
            })
            this.$store.commit('setError', null)
        }
    }
}
</script>
