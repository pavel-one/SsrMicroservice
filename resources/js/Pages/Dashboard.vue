<template>
    <div>
        Dashboard page
    </div>
</template>

<script>
import axios from "axios";

export default {
    async beforeRouteEnter(to, from, next) {
        // const response = await axios.get('/api/props')
        //
        // if (!response.data.data.user.id) {
        //     next({name: 'auth'})
        // }

        next()
    }
}
</script>