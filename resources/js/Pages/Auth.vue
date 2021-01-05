<template>
    <layout :css="container_style">
        <template v-slot:hero>
            <h1 class="title has-text-centered">Необходима аутентификация</h1>
            <h2 class="subtitle has-text-centered">Войдите или зарегистрируйтесь</h2>
        </template>
        <div class="auth-page">
            <form @submit.prevent="submit">
                <b-field label="Email">
                    <b-input type="email" maxlength="30" v-model="form.email"></b-input>
                </b-field>
                <b-field label="Пароль">
                    <b-input type="password" v-model="form.password" password-reveal></b-input>
                </b-field>
                <b-button :style="{margin: 'auto', display: 'block'}" native-type="submit" type="is-primary is-light"
                          class="has-text-centered">
                    Войти или
                    Зарегистрироваться
                </b-button>
            </form>
        </div>
    </layout>
</template>

<script>
import layout from './../Components/Templates/Layout'
import Store from "../Store/Store";

export default {
    props: ['title'],
    components: {
        layout
    },
    metaInfo() {
        return {
            title: this.title,
        }
    },
    computed: {
        user() {
            return this.$store.getters.getUser
        }
    },
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            container_style: {
                margin: 'auto',
                maxWidth: '450px !important'
            }
        }
    },
    methods: {
        submit: async function () {
            let response;

            try {
                response = await this.$http.post('/api/auth', this.form)
            } catch (e) {
                this.$buefy.dialog.confirm({
                    message: e.response.data.msg,
                    onConfirm: this.register
                })

                return;
            }

            this.$buefy.notification.open({
                message: response.data.msg,
                type: response.data.success ? 'is-success' : 'is-danger'
            })

            if (response.data.success) {
                await this.$router.push({name: 'dashboard'})
            }
        },
        register: async function () {
            const response = await this.$http.post('/api/register', this.form)

            this.$buefy.notification.open({
                message: response.data.msg,
                type: response.data.success ? 'is-success' : 'is-danger'
            })
            if (response.data.success) {
                await this.$router.push({name: 'dashboard'})
            }
        }
    }
}
</script>
