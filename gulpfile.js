/*
 * @Author: JoneLin
 * @Date:   2016-05-08 09:32:50
 * @Last Modified by:   JoneLin
 * @Last Modified time: 2016-05-11 17:44:24
 */

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var ts = require('gulp-typescript');
var tsProject = ts.createProject("tsconfig.json", {});
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const uglify = require('gulp-uglify');
const pump = require('pump');

var srcPath = {
    src: 'www/src/**/*.ts',
    dest: 'www/jsbuild'
};

// 静态服务器
gulp.task('serve', ['ts'], function () {
    browserSync.init({
        server: {
            baseDir: './www'
        }
    });

    gulp.watch(srcPath.src, function () {
        runSequence('ts', 'reload');
    });
});

gulp.task('reload', function () {
    return reload();
});

gulp.task('ts', function () {

    return gulp.src(srcPath.src)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(srcPath.dest));
});

gulp.task('imagemin', function () {

    imagemin(['www/res/*.{png,jpg}'], 'www/res/img_output', {
        plugins: [
            mozjpeg({
                targa: true
            }),
            pngquant({
                quality: '65-80'
            })
        ]
    });
});

gulp.task('compress', function(cb) {
    pump([
        gulp.src('www/jsbuild/jsBuild.js'),
        uglify(),
        gulp.dest('www/jsbuild/js_output')
    ],
    cb);
});