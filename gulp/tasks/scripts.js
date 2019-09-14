let uglify = require('gulp-uglify'),
  rollup = require('gulp-better-rollup'),
  babel = require('rollup-plugin-babel'),
  resolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs'),

  scriptsPATH = {
    "input": "./dev/assets/js/",
    "ouput": "./build/assets/js/"
  };

module.exports = function () {
  $.gulp.task('js:dev', () => {
    return $.gulp.src([scriptsPATH.input + '*.js',
      '!' + scriptsPATH.input + 'libs.min.js'])
      .pipe(rollup({plugins: [babel(), resolve(), commonjs()]}, 'umd'))
      .pipe($.gulp.dest(scriptsPATH.ouput))
      .pipe($.browserSync.reload({
        stream: true
      }));
  });

  $.gulp.task('js:build', () => {
    return $.gulp.src([scriptsPATH.input + '*.js',
      '!' + scriptsPATH.input + 'libs.min.js'])
      .pipe(rollup({plugins: [babel(), resolve(), commonjs()]}, 'umd'))
      .pipe(uglify())
      .pipe($.gulp.dest(scriptsPATH.ouput))
  });

};
