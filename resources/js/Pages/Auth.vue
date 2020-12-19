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
    methods: {
        submit: function () {
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