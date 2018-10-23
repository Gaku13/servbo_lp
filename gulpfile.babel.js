/* babel gulp */
import gulp from 'gulp';
import concat from 'gulp-concat';
import es from 'event-stream';
import sass from 'gulp-sass';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import babel from 'gulp-babel';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import streamqueue from 'streamqueue';
import gutil from 'gulp-util';
import slim from 'gulp-slim';
import cssmin from 'gulp-cssmin';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browserSync from 'browser-sync';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
const $ = require('gulp-load-plugins')();
import handleErrors from './handleErrors.babel.js';
var path = require('path');

let isProd = gutil.env.type === 'prod';
let sources = {
  sass: 'src/css/**/*.sass',
  css: 'src/css/**/*.css',
  html: 'src/**/*.slim',
  js: 'src/js/lib/*.js',
  es6: 'src/js/**/*.babel.js',
  svg: 'src/img/svg/*.svg'
  // cannot use with jsx!!!!!!!!!!
  //jsx: 'src/js/**/*.jsx'
};
let targets = {
  css: 'www/css',
  html: 'www/',
  js: 'www/js',
  svg: 'www/img/svg'
};
let swallowError = function (error) {
  this.emit('end');
};
gulp.task('svg', () => {
  gulp.src(sources.svg)
    .pipe($.svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.cheerio({
      run($, file) {
        $('svg').addClass('hide');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(targets.svg));
});
/*
gulp.task('svg2png', () => {
  gulp.src(sources.svg)
    .pipe($.svg2png(3))
    .pipe($.rename({ prefix: 'all.svg.' }))
    .pipe($.imagemin())
    .pipe(gulp.dest(targets.svg));
});*/
gulp.task('js', () => {
  let stream;
  stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src([
    //'src/js/lib/jquery.js',
    'src/js/lib/plugins.js'
  ]));
  stream.queue(gulp.src(sources.es6)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(babel())
  );
  return stream.done().on('error', swallowError).pipe(concat('all.js')).pipe(isProd ? uglify() : gutil.noop()).pipe(gulp.dest(targets.js));

});
gulp.task('build-slim', () => {
  return gulp.src(sources.html).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(slim({ pretty: true })).pipe(gulp.dest(targets.html));
});
gulp.task('css', () => {
  let stream;
  stream = streamqueue({ objectMode: true });
  stream.queue(gulp.src([
    'src/css/lib/normalize.css'
  ]));
  stream.queue(gulp.src(sources.sass).pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })).pipe(sass({
    style: 'expanded',
    includePaths: ['src/css'],
    indentedSyntax: true
  })));
  return stream.done().on('error', swallowError).pipe(autoprefixer()).pipe(concat('all.css')).pipe(isProd ? uglify() : gutil.noop()).pipe(gulp.dest(targets.css));
});
gulp.task('server', () => {
  return browserSync.init(null, {
    open: true,
    server: { baseDir: targets.html },
    reloadDelay: 2000,
    watchOptions: { debounceDelay: 1000 }
  });
});
gulp.task('watch', () => {
  gulp.watch(sources.es6, ['js']);
  gulp.watch(sources.sass, ['css']);
  gulp.watch(sources.svg, ['svg']);
  //gulp.watch(sources.svg, ['svg2png']);
  gulp.watch(sources.html, ['build-slim']);
  return gulp.watch('www/**/**', file => {
    if (file.type === 'changed') {
      return browserSync.reload(file.path);
    }
  });
});
gulp.task('build', [
  'js',
  'css',
  'svg',
  //'svg2png',
  'build-slim'
]);
gulp.task('default', [
  'watch',
  'server'
]);
