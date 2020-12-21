<template>
    <form @submit.prevent="submit">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Добавить сайт</p>
                <button
                    type="button"
                    class="delete"
                    @click="$emit('close')"/>
            </header>
            <section class="modal-card-body">
                <p style="width: 400px; margin-bottom: 10px" class="has-text-centered">Вы собираетесь добавить сайт для
                    индексации, прошу заметить, индексирование сайта сложная и ресурсоемкая
                    операция, потребуется время</p>
                <b-field label="Название">
                    <b-input
                        v-model="form.name"
                        placeholder="Мой SPA сайт"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Адрес сайта">
                    <b-input
                        type="url"
                        v-model="form.url"
                        placeholder="https://google.com"
                        required>
                    </b-input>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$emit('close')">Закрыть</button>
                <button class="button is-primary">Добавить</button>
            </footer>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: '',
                url: ''
            }
        }
    },
    methods: {
        submit: function () {
            this.$http.put('/sites', this.form)
                .then(response => {
                    this.$buefy.notification.open({
                        message: response.data.msg,
                        type: response.data.success ? 'is-success' : 'is-danger'
                    })
                    if (response.data.success) {
                        this.$emit('close')
                        this.form.name = ''
                        this.form.url = ''
                        this.$store.dispatch('fetchSites')
                    }
                })
        }
    }
}
</script>

<style scoped>

</style>