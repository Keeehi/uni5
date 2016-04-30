var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');
var minifyHTML = require('gulp-minify-html');
var clean = require('gulp-clean');
var concat = require('gulp-concat');




/********************************
 *
 *
 *    COMMANDS
 *
 *
 ******************************** */


/**
 *  Default build
 * */

gulp.task('default', function (callback) {
    return runSequence('clean', ['styles', 'scripts', 'images', 'pages', 'fonts'], callback);
});

/**
 * Clean build folder
 * */
gulp.task('clean', function() {
    return gulp.src('build')
        .pipe(clean());
});

/**
 * Build styles
 * */
gulp.task('styles', function() {
    return gulp.src('src/sass/**/*.scss')
        .pipe(gulpIf(!isProduction(), sourcemaps.init()))
        .pipe(sass({ style: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer('last 5 version'))
        .pipe(gulpIf(!isProduction(), sourcemaps.write()))
        .pipe(gulpIf(isProduction(), cleanCSS()))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
});

/**
 * Build scripts
 * */
gulp.task('scripts', function() {
    return gulp.src([
        'node_modules/smooth-scroll/dist/js/smooth-scroll.js',
        'src/js/**/*.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulpIf(isProduction(), uglify()))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
});

/**
 * Build images
 * */
gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        // .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('build/img'))
        .pipe(connect.reload());
});

/**
 * Build pages
 * */
gulp.task('pages', function() {
    return gulp.src('src/pages/**/*')
        .pipe(gulpIf(isProduction(), minifyHTML()))
        .pipe(gulp.dest('build'))
        .pipe(connect.reload());
});

/**
 * Build fonts
 * */
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
        .pipe(connect.reload());
});

/**
 * Watch changes and runs tasks.
 */
gulp.task('watch', function () {
    gulp.watch(['src/sass/**/*'], ['styles-clean', 'styles']);
    gulp.watch(['src/js/**/*'], ['scripts-clean', 'scripts']);
    gulp.watch(['src/img/**/*'], ['images-clean', 'images']);
    gulp.watch(['src/pages/**/*'], ['pages-clean', 'pages']);
    gulp.watch(['src/fonts/**/*'], ['fonts-clean', 'fonts']);
});

/**
 * Starts server.
 */
gulp.task('server', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });

    return runSequence('watch');
});




/********************************
 *
 *
 *    SUBTASKS
 *
 *
 ******************************** */
gulp.task('styles-clean', function() {
    return gulp.src('build/css/**/*', {read: false})
        .pipe(clean());
});

gulp.task('scripts-clean', function() {
    return gulp.src('build/js/**/*', {read: false})
        .pipe(clean());
});

gulp.task('images-clean', function() {
    return gulp.src('build/img/**/*', {read: false})
        .pipe(clean());
});

gulp.task('pages-clean', function() {
    return gulp.src('build/*.*', {read: false})
        .pipe(clean());
});

gulp.task('fonts-clean', function() {
    return gulp.src('build/fonts/**/*', {read: false})
        .pipe(clean());
});



/********************************
 *
 *
 *    INNER FUNCTIONS
 *
 *
 ******************************** */

function isProduction() {
    if (process.env.hasOwnProperty('CI_BUILD_NAME')) {
        return false;//process.env.CI_BUILD_NAME == 'production';
    } else {
        return false;
    }
}