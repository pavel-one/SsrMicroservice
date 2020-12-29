const mix = require('laravel-mix');
const LiveReloadPlugin = require('webpack-livereload-plugin');

mix.webpackConfig({
    plugins: [
        new LiveReloadPlugin()
    ]
});

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/scss/app.scss', 'public/css');