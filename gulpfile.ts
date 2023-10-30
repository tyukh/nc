'use strict';

import gulp from 'gulp';
import ts from 'gulp-typescript';
// import sourcemaps from 'gulp-sourcemaps';
import newer from 'gulp-newer';

const paths = {
  libs: [
    './src/libs/**/*',
    '!./src/libs/decimal.js/doc/**',
    '!./src/libs/decimal.js/test/**',
    '!./src/libs/decimal.js/.*',
    '!./src/libs/decimal.js/*.ts',
    '!./src/libs/decimal.js/*.mjs',
    '!./src/libs/decimal.js/*.json',
    '!./src/libs/decimal.js/CHANGELOG.md',
  ],
  files: [
    './src/**/*',
    '!./src/libs{,/**/*}',
    '!./src/modules{,/**/*}',
    '!./src/schemas{,/**/*}',
    '!./src/*.ts',
    '!./src/tsconfig.json',
  ],
  schemas: ['./src/schemas/**/*.xml'],
  build: './build/nc@tyukh.github.io',
  tsProject: './src/tsconfig.json',
};

const tsProject = ts.createProject(paths.tsProject);

gulp.task('compile-ts', function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(paths.build));
});

gulp.task('copy-libs', function () {
  return gulp
    .src(paths.libs)
    .pipe(newer(`${paths.build}/libs`))
    .pipe(gulp.dest(`${paths.build}/libs`));
});

gulp.task('copy-files', function () {
  return gulp.src(paths.files).pipe(newer(paths.build)).pipe(gulp.dest(paths.build));
});
