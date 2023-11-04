'use strict';

import gulp from 'gulp';
import ts from 'gulp-typescript';
import newer from 'gulp-newer';
import zip from 'gulp-zip';
import shell from 'gulp-shell';

const uid = 'nc@tyukh.github.io';
const sources = './src';
const build = './build';
const pack = `${uid}.zip`;

const paths = {
  src: [
    `${sources}/{{metadata.json,stylesheet.css},ui/**/*,schemas/*.xml,libs/decimal.js/{decimal.js,*.md}}`,
  ],
  dst: `${build}/${uid}`,
  tsProject: './src/tsconfig.json',
};

const tsProject = ts.createProject(paths.tsProject);

gulp.task('transpile', () => {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(paths.dst));
});

gulp.task('copy', () => {
  return gulp.src(paths.src).pipe(newer(paths.dst)).pipe(gulp.dest(paths.dst));
});

gulp.task('zip', () => {
  return gulp.src(`${paths.dst}/**/*`).pipe(zip(pack)).pipe(gulp.dest(build));
});

gulp.task('install', shell.task(`gnome-extensions install ${build}/${pack} --force`));

gulp.task('build', gulp.series(gulp.parallel('copy', 'transpile'), 'zip'));

gulp.task('deploy', gulp.series('build', 'install'));
