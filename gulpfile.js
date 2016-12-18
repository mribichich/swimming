'use strict';

let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let del = require('del');
let path = require('path');
let sass = require('gulp-sass');
let runSequence = require('run-sequence');
let sourcemaps = require('gulp-sourcemaps');
let ngTemplates = require('gulp-ng-templates');
let htmlmin = require('gulp-htmlmin');
let watch = require('gulp-watch');
let ts = require('gulp-typescript');
let tslint = require('gulp-tslint');
let ngAnnotate = require('gulp-ng-annotate');
let argv = require('yargs').argv;
let gulpif = require('gulp-if');
let jspmAssets = require('gulp-jspm-assets').jspmAssets;
let jspm = require('jspm');
let electron = require('electron-connect').server.create();
let useref = require('gulp-useref');
let removeCode = require('gulp-remove-code');
let CONFIG = require('./gulp.config');

var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});

var tsTests2e2Project = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});



gulp.task('clean', (done) => {
    del('dist/**')
        .then(del('.tmp/**'))
        .then(() => done());
});

gulp.task('build', (done) => {
    runSequence('build.css', 'build.icons', 'build.html', 'build.partials', 'build.js', (done));
});

gulp.task('rebuild', (done) => {
    runSequence('clean', 'build', (done));
});

gulp.task('build.icons', () => {
    jspmAssets('@material-design-icons/svg-sprite', '*.svg')
        .pipe(gulp.dest(CONFIG.dest.icons.app))
});

gulp.task('build.css', (done) => {
    if (argv.production) {
        runSequence('build.css.compile', done) // , 'build.css.bundle'
    } else {
        runSequence('build.css.compile', done)
    }
});

gulp.task('build.css.compile', () => {
    let dest = CONFIG.dest.css.app;

    // if (argv.production) {
    //     dest = CONFIG.tmp.client.path;
    // }

    return gulp.src(CONFIG.src.css.app)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        //.pipe(cleanCSS())
        //.pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest))
});

gulp.task('build.html', () => {
    let dest = CONFIG.dest.html.app;

    // if (argv.production) {
    //     dest = CONFIG.tmp.client.path;
    // }

    return gulp.src(CONFIG.src.html.app)
        .pipe(gulpif(!argv.production, removeCode({
            development: false,
            production: true
        })))
        .pipe(gulpif(argv.production, useref()))
        .pipe(gulpif(argv.production, removeCode({
            development: true,
            production: false
        })))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(dest))
});

gulp.task('build.partials', () => {
    let dest = CONFIG.dest.partials.app;

    // if (argv.production) {
    //     dest = CONFIG.tmp.client.path;
    // }

    return gulp.src(CONFIG.src.partials.app)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(ngTemplates({
            filename: 'app-templates.js',
            module: 'app.templates',
            path: function(path, base) {
                return path.replace(base, 'app/');
            }
        }))
        .pipe(gulp.dest(dest))
});


gulp.task('ts-lint', function() {
    return gulp.src(allTsFiles)
        .pipe(tslint())
        .pipe(tslint.report('verbose', {
            emitError: false
        }));
});

gulp.task('build.js', (done) => {
    if (argv.production) {
        runSequence('build.js.compile', 'build.js.bundle', done)
    } else {
        runSequence('build.js.compile', 'build.js.tests2e2', done)
    }
});

gulp.task('build.js.compile', () => {
    let src = [...CONFIG.src.js.appTds];
    let dest = CONFIG.dest.js.app;

    if (argv.production) {
        src.push(CONFIG.src.js.appWithoutSpec);
        // dest = CONFIG.tmp.client.path;
    } else {
        src.push(CONFIG.src.js.app);
    }

    var tsResult = gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(gulpif(argv.production === undefined, sourcemaps.write('.')))
        // .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(dest));
});

gulp.task('build.js.bundle', (done) => {
    runSequence('build.js.bundle.deps', 'build.js.bundle.main', () => {
        del(['dist/app/**', '!dist/app', '!dist/app/icons/**'])
            .then(() => done());
    })
});

gulp.task('build.js.bundle.deps', (done) => {
    var builder = new jspm.Builder(null, './jspm.config.js');

    builder.bundle(`app/index - [${CONFIG.dest.js.app}/**/*] - [${CONFIG.dest.js.app}/**/*.css!]`, `dist/deps.bundle.js`, {
            minify: true
        })
        .then(function() {
            console.log('Build complete');
        })
        .catch(function(err) {
            console.log(err)
            throw err;
        })
        .finally(() => done());
});

gulp.task('build.js.bundle.main', (done) => {
    var builder = new jspm.Builder(null, './jspm.config.js');

    builder.bundle(`app/index - dist/deps.bundle.js`, `dist/main.bundle.js`, {
            minify: true
        })
        .then(function() {
            console.log('Build complete');
        })
        .catch(function(err) {
            console.log(err)
            throw err;
        })
        .finally(() => done());
});

gulp.task('build.js.tests2e2', function() {
    let tsResult = gulp.src([CONFIG.src.js.tests2e2, CONFIG.src.js.tests2e2Tds])
        .pipe(sourcemaps.init())
        .pipe(tsTests2e2Project());

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(CONFIG.dest.js.tests2e2));
});

gulp.task('watch', (done) => {
    runSequence(
        'clean',
        'build',
        'watch.css',
        'watch.html',
        'watch.partials',
        'watch.js',
        done)
});

gulp.task('watch.css', () => {
    watch(CONFIG.src.css.app, batch(function(events, done) {
        runSequence(
            'build.css',
            // 'livereload', 
            done);
    }));
});

gulp.task('watch.html', () => {
    watch(CONFIG.src.html.app, batch(function(events, done) {
        runSequence('build.html', 'reload', done);
    }));
});

gulp.task('watch.partials', () => {
    watch(CONFIG.src.partials.app, batch(function(events, done) {
        runSequence('build.partials', 'reload', done);
    }));
});

gulp.task('watch.js', () => {
    watch([CONFIG.src.js.app, CONFIG.src.js.tests2e2], batch(function(events, done) {
        runSequence('build.js', 'reload', done);
    }, function(err) {
        console.error(err)
    }));
});

gulp.task('electron.start', () => {
    electron.start();

    gulp.watch('main.js', electron.restart);

    gulp.watch(['index.js'], electron.reload);
})

gulp.task('serve', (done) => {
    process.env.NODE_ENV = 'development';

    runSequence('watch', 'electron.start', done);
})

gulp.task('reload', () => {
    electron.reload();
})