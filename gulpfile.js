'use strict';

var gulp = require('gulp'),
    // debug = require('gulp-debug'),
    // inject = require('gulp-inject'),
    ts = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var exec = require('child_process').exec;
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var electron = require('electron-connect').server.create();
var merge = require('merge2');

var tsProjectApp = ts.createProject('src/app/tsconfig.json', {
    typescript: require('typescript')
});
var tsProjectTests = ts.createProject('src/tests/tsconfig.json',{
	typescript: require('typescript')
});
var tsProjectTestse2e = ts.createProject('src/tests-e2e/tsconfig.json',{
	typescript: require('typescript')
});

var paths = {
    sass: {
        app: {
            src: 'src/app/**/*.scss',
            dest: 'dist/app'
        }
    },
    ts: {
        app: {
            src: 'src/app/**/!(*.d).ts',
            dest: 'dist/app'
        },
        tests: {
            // src: 'src/tests/**/*.ts',
            dest: 'dist/tests'
        },
        testse2e: {
            src: 'src/tests-e2e/**/!(*.d).ts',
            dest: 'dist/tests-e2e'
        }
    },

    html: {
        app: {
            src: 'src/app/**/*.html',
            dest: 'dist/app'
        }
    },

    src: {
        app: {
            tds:                 'src/app/typings/main/**/*.d.ts'
        },
        tests: {
            js: 'src/tests/**/*.ts',
            tds: 'src/tests/**/*.d.ts'
        },
        testse2e: {
            tds: 'src/tests-e2e/typings/**/*.d.ts'
        }
    }
}

var allTsFiles = [paths.ts.app.src, paths.src.tests.js, paths.ts.testse2e.src, '!**/*.d.ts'];

gulp.task('sass', function () {
    gulp.src(paths.sass.app.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.sass.app.dest));
});

gulp.task('ts-lint', function () {
    return gulp.src(allTsFiles)
        .pipe(tslint())
        .pipe(tslint.report('verbose', {
            emitError: false
        }));
});

gulp.task('build.js', function () {
    let tsFiles = [paths.src.app.tds, paths.ts.app.src, 'src/app-dts/**/*.d.ts'];

    let tsResult = gulp.src(tsFiles)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectApp));

   return tsResult.js
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.ts.app.dest));

    // return merge([
    //     tsResult.dts.pipe(gulp.dest('src/app-dts')),
    //     js
    // ]);
});

gulp.task('ts-tests', function () {
    let tsFiles = [paths.src.tests.tds, paths.src.tests.js];

    let tsResult = gulp.src(tsFiles)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectTests));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.ts.tests.dest));
});

gulp.task('ts-tests-e2e', function () {
    let tsFiles = [paths.src.testse2e.tds, paths.ts.testse2e.src];

    let tsResult = gulp.src(tsFiles)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProjectTestse2e));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.ts.testse2e.dest));
});

gulp.task('clean', ['clean:sass', 'clean:ts', 'clean:html']);

gulp.task('clean:sass', () => {
    del(path.join(paths.sass.app.dest, '**/*.css'));
});

gulp.task('clean:html', () => {
    del(path.join(paths.html.app.dest, '**/*.html'));
});

gulp.task('clean:ts', () => {
    del(path.join(paths.ts.app.dest, '**/*.js'));
});

gulp.task('build', ['build:sass', 'build:ts', 'build:html']);

gulp.task('build:sass', ['sass']);

gulp.task('build:ts', function (done) {
    runSequence(
        'ts-lint',
        'build.js',
        ['ts-tests', 'ts-tests-e2e'],
        done
    );
});

gulp.task('build:html', function () {
    return gulp.src(paths.html.app.src)
        .pipe(minifyHtml({ empty: true }))
        .pipe(templateCache({
            standalone: true,
            root: 'app'
        }))
        .pipe(gulp.dest(paths.html.app.dest));

    // return gulp.src(paths.html.app.src)
    //     .pipe(gulp.dest(paths.html.app.dest));
});

gulp.task('rebuild', function (done) {
    runSequence(
        'clean',
        'build',
        done);
});

gulp.task('watch:ts', () => {
    gulp.watch(allTsFiles, ['build:ts']);
});

gulp.task('watch:sass', () => {
    gulp.watch(paths.sass.app.src, ['build:sass']);
});

gulp.task('watch:html', () => {
    gulp.watch(paths.html.app.src, ['build:html']);
});

// gulp.task('watch', ['watch:sass', 'watch:ts', 'watch:html']);

gulp.task('watch', (done) => {
    runSequence(
        'clean',
        'build',
        [
            'watch:sass',
            'watch:html',
            'watch:ts'
        ],
        done);
});

gulp.task('start', function (done) {
    // Start browser process
    // electron.start();

    // // Add an argument
    // electron.start('Hoge!');

    // // Add list of arguments
    // electron.start(['Hoge', 'foo']);

    // Callback
    electron.start('--debug=5858', done);
});

gulp.task('serve', (done) => {
    runSequence(
        'rebuild',
        'start',
        'watch',
        done);
});

gulp.task('default', ['serve']);