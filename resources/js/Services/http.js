import axios from "axios";

export default {
    install(Vue, config) {
        const defaultConfig = {
            limit: 1000
        }

        if (!config) {
            config = defaultConfig
        }

        Vue.prototype.$http = axios
        //Тротлинг http запросов
        Vue.prototype.$wait = (callback) => {
            let wait = false;

            return function () {
                if (!wait) {
                    callback.call();
                    wait = true;
                    setTimeout(function () {
                        wait = false;
                    }, config.limit);
                }
            }
        }
    }
}