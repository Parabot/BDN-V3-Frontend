var gulp = require('gulp'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

var paths = {
    src: {
        css: ['./assets/css/*.css', '!./assets/css/*.min.css'],
        fonts: './assets/fonts/*.{eot,svg,ttf,woff,woff2}',
        images: ['./assets/images/*.{png,jpg,jpeg,gif,svg}', './assets/svg/*.{png,jpg,jpeg,gif,svg}'],
        js: [
            './assets/js/jquery-ui.js',
            './assets/js/jquery.fancybox.js',
            './assets/js/bootstrap.js',
            './assets/js/owl.carousel.js',
            './assets/js/jquery.revolution.js',
            './assets/js/site.js'
        ]
    },
    dist: {
        css: './build/css',
        fonts: './build/fonts',
        images: './build/images',
        js: './build/js'
    }
};

gulp.task('styles', function () {
    return gulp.src(paths.src.css)
        .pipe(minifyCSS())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(paths.dist.css))
});

gulp.task('images', function () {

    return gulp.src(paths.src.images)
        .pipe(plugins.cache(plugins.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(plugins.size({title: 'Images:'}))
        .pipe(gulp.dest(paths.dist.images));

});

gulp.task('fonts', function () {

    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dist.fonts));

});

gulp.task('scripts', function () {

    return gulp.src(paths.src.js)
        .pipe(sourcemaps.init())
        .pipe(plugins.include())
        .pipe(plugins.uglify({preserveComments: 'some'}))
        .pipe(plugins.size({title: 'Javascripts: '}))
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.js));

});