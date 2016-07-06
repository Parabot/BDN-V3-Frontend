var gulp = require('gulp'),
    bower = require('gulp-bower'),
    browserSync = require( 'browser-sync' ).create(),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

var config = {
    urls: {
        production: 'http://beta.bdn.parabot.org/',
        development: 'http://beta.bdn.parabot.org:88/'
    }
};

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

gulp.task( 'reload', function() {

    return gulp.src( paths.dist.css, { read: false } )
        .pipe( notify( {
            title: config.name,
            message: 'Compilation completed, reloading...',
            sound: false
        } ) );

} );

gulp.task( 'serve', [ 'styles', 'scripts', 'fonts', 'images' ], function() {

    browserSync.init( {
        notify: false,
        port: 3000,
        proxy: config.urls.development
    } );

    gulp.watch( [ paths.src.css ], [ 'styles', 'reload', browserSync.reload ] );
    gulp.watch( [ paths.src.js ], [ 'scripts', 'reload', browserSync.reload ] );
    gulp.watch( [ paths.src.fonts ], [ 'fonts', 'reload', browserSync.reload ] );
    gulp.watch( [ paths.src.images ], [ 'images', 'reload', browserSync.reload ] );

} );

gulp.task('assets', ['scripts', 'styles', 'fonts', 'images']);