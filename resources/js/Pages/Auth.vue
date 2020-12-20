<template>
    <layout>
        <template v-slot:hero>
            <h1 class="title">Необходима аутентификация</h1>
            <h2 class="subtitle">Войдите или зарегистрируйтесь</h2>
        </template>
        <div class="auth-page">
            <form @submit.prevent="submit">
                <b-field label="Email">
                    <b-input type="email" maxlength="30" v-model="form.email"></b-input>
                </b-field>
                <b-field label="Пароль">
                    <b-input type="password" v-model="form.password" password-reveal></b-input>
                </b-field>
                <b-button native-type="submit" type="is-primary is-light" class="has-text-centered">
                    Войти или
                    Зарегистрироваться
                </b-button>
            </form>
        </div>
    </layout>
</template>

<script>
import layout from './../Components/Templates/Layout'
import axios from "axios";

export default {
    components: {
        layout
    },
    props: {},
    data() {
        return {
            form: {
                email: '',
                password: ''
            }
        }
    },
    async beforeRouteEnter(to, from, next) {
        const user = await axios.get('/api/props')

        if (user.data.data.user.id) {
            next({name: 'dashboard'})
        }

        next()
    },
    methods: {
        submit: function () {
            this.$http.post('/api/auth', this.form)
                .then(response => {
                    this.$buefy.notification.open({
                        message: response.data.msg,
                        type: response.data.success ? 'is-success' : 'is-danger'
                    })
                })
                .catch(error => {
                    console.log()
                    this.$buefy.dialog.confirm({
                        message: error.response.data.msg,
                        onConfirm: this.register
                    })
                })
        },
        register: function () {
            this.$http.post('/api/register', this.form)
                .then(response => {
                    this.$buefy.notification.open({
                        message: response.data.msg,
                        type: response.data.success ? 'is-success' : 'is-danger'
                    })
                })
        }
    }
}
</script>

<style lang="scss">
.hero-body {
    margin: auto;
    text-align: center;
}

.button {
    margin: auto;
    display: block;
}

.container {
    margin: auto;
    max-width: 450px !important;
}
</style>