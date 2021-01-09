<template>
    <div>
        <b-table
            @page-change="currentPage => this.page = currentPage"
            @sort="onSort"
            :data="pagesSite"
            paginated
            backend-pagination
            backend-sorting
            :total="total"
            :per-page="limit"
            :loading="load"
            :hoverable="true"
            :default-sort-direction="sortDir"
            :default-sort="sortField"
        >
            <b-table-column v-if="!error" field="screen" label="Скриншот" v-slot="props">
                <img @click.prevent="openImage('/page_screen/'+props.row.screen)" class="image-modal"
                     :src="'/page_screen/'+props.row.screen" alt="">
            </b-table-column>
            <b-table-column v-if="!error" field="title" label="Заголовок" sortable v-slot="props">
                {{ props.row.title }}
            </b-table-column>
            <b-table-column field="url" label="URL" v-slot="props">
                <a target="_blank" :href="props.row.url">{{ props.row.url }}</a>
            </b-table-column>
            <b-table-column v-if="error" field="errorMessage" label="Ошибка" v-slot="props">
                {{ props.row.errorMessage }}
            </b-table-column>
            <b-table-column field="lastDate" label="Обновлено" sortable v-slot="props">
                {{ dateFormat(props.row.lastDate) }}
            </b-table-column>
            <b-table-column v-slot="props">
                <div class="buttons" style="flex-wrap: nowrap">
                    <b-tooltip label="Запустить обновление страницы" size="is-small">
                        <b-button size="is-small is-primary is-light" icon-left="sync"></b-button>
                    </b-tooltip>
                    <b-tooltip label="Удалить страницу" size="is-small">
                        <b-button size="is-small is-danger is-light" icon-left="trash"></b-button>
                    </b-tooltip>
                </div>
            </b-table-column>
        </b-table>
    </div>
</template>

<script>
import Moment from 'moment'

export default {
    props: {
        error: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            pagesSite: [],
            page: 1,
            limit: 20,
            total: 0,
            load: true,
            sortField: 'lastDate',
            sortDir: 'desc'
        }
    },
    methods: {
        fetch: async function () {
            this.load = true

            const response = await this.$http.get('/api/site/' + this.$route.params.id + '/pages/', {
                params: {
                    page: this.page,
                    limit: this.limit,
                    error: this.error ? 1 : 0,
                    sortField: this.sortField,
                    sortDir: this.sortDir
                }
            })

            this.pagesSite = response.data.data.pages
            this.total = response.data.data.paginate.total
            this.load = false
        },
        openImage: function (image) {
            const h = this.$createElement
            const vnode = h('p', {class: "image"}, [
                h('img', {attrs: {src: image}})
            ])
            this.$buefy.modal.open({
                content: [vnode]
            })
        },
        onSort: function (field, dir) {
            this.sortField = field
            this.sortDir = dir
            this.fetch()
        },
        dateFormat: function (date) {
            return new Moment(date).locale('ru').fromNow()
        }
    },
    watch: {
        page: function () {
            this.fetch()
        },
    },
    mounted() {
        this.fetch()
    }
}
</script>

<style lang="scss" scoped>
.image-modal {
    cursor: pointer;
    transition: .25s;

    &:hover {
        box-shadow: 0 1px 5px rgba(0, 0, 0, .15);
    }
}
</style>