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
    props: ['css']
}
</script>
