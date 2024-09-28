const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
    .vue()  // Sử dụng vue-loader
    .sass('resources/sass/app.scss', 'public/css');
