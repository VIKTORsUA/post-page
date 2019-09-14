let plumber = require('gulp-plumber'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  csso = require('gulp-csso'),
  csscomb = require('gulp-csscomb'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  browserslist = ['last 3 versions', 'ie 11'],
  stylesPATH = {
    "input": "./dev/assets/styles/",
    "ouput": "./build/assets/css/"
  };

module.exports = function () {
  $.gulp.task('styles:dev', () => {
    return $.gulp.src(stylesPATH.input + 'styles.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(scss())
      .pipe(autoprefixer({
        overrideBrowserslist: browserslist
      }))
      .pipe(sourcemaps.write())
      .pipe(rename('styles.min.css'))
      .pipe($.gulp.dest(stylesPATH.ouput))
      .on('end', $.browserSync.reload);
  });

  $.gulp.task('styles:build', () => {
    return $.gulp.src(stylesPATH.input + 'styles.scss')
      .pipe(scss())
      .pipe(autoprefixer({
        overrideBrowserslist: browserslist
      }))
      .pipe(csscomb())
      .pipe($.gulp.dest(stylesPATH.ouput))
  });

  $.gulp.task('styles:build-min', () => {
    return $.gulp.src(stylesPATH.input + 'styles.scss')
      .pipe(scss())
      .pipe(autoprefixer({
        overrideBrowserslist: browserslist
      }))
      .pipe(csscomb())
      .pipe(csso())
      .pipe(rename('styles.min.css'))
      .pipe($.gulp.dest(stylesPATH.ouput))
  });
};
