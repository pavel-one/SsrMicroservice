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
    mounted() {
        if (this.$store.getters.AppError) {
            this.$buefy.notification.open({
                message: this.$store.getters.AppError,
                type: 'is-warning'
            })
        }
    }
}
</script>
