<template>
    <div>
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
            this.$buefy.notification.open({
                message: val,
                type: 'is-warning'
            })
        }
    },
    mounted() {
        if (this.appError) {
            this.$buefy.notification.open({
                message: this.appError,
                type: 'is-warning'
            })
        }
    }
}
</script>
