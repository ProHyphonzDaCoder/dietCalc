const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const webpack = require('webpack');
const path = require('path');
const WebpackDevServer = require('webpack-dev-server');

gulp.task('copy', function () {
  gulp.src('./docs/index.html')
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
  return sass('./docs/**/*.scss', {
      loadPath: ['bower_components', 'node_modules'],
    })
    .on('error', function (err) {
      console.log(err.message);
    })
    .pipe(gulp.dest('./build'));
});

gulp.task('server', ['copy', 'sass'], function (callback) {
  const myConfig = require('./webpack.config.js');

  const webpackCompiler = webpack(myConfig, function (err, stats) {});

  new WebpackDevServer(webpackCompiler, {
    contentBase: path.join(__dirname, "build"),
    hot: true
  }).listen(8000, 'localhost', function (err, result) {

  });
});

gulp.task('watch', function () {
  gulp.watch(['./docs/**/*{scss,sass}'], ['sass']);
  gulp.watch(['./docs/index.html'], ['copy']);
});
