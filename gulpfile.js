const gulp = require('gulp'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify-es').default,
    del = require('del'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    fileinclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin'),
    gcmq = require('gulp-group-css-media-queries');

gulp.task('fonts', function () {
    return gulp.src('src/font/*')
    .pipe(gulp.dest('./build/font'))
})

gulp.task('images', function () {
    return gulp.src('src/img/*')
    .pipe(gulp.dest('./build/img'))
})

gulp.task('fileinclude', function () {
    return gulp.src('index.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
})

gulp.task('styles', function () {
    return gulp.src('src/css/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(gcmq())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
})

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream())
})

gulp.task('clean', function () {
    return del(['build/*'])
})

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    })
    gulp.watch('./src/css/**/*.less', gulp.parallel('styles'))
    gulp.watch('./src/js/**/*.js', gulp.parallel('scripts'))
    gulp.watch('./*.html', gulp.parallel('fileinclude')).on('change', browserSync.reload)
})

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'scripts', 'fileinclude', 'fonts', 'images')))
gulp.task('dev', gulp.series('build', 'watch'))