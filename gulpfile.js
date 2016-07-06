var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('minify', function () {
    gulp.src('asseets/js/app.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});