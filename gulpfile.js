const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');

var scriptsharekeyfile = 'gunjstrustsharekeyv2.js';

function js() {
    let bsourcemaps = false;
    return src(scriptsharekeyfile, { sourcemaps: bsourcemaps })
        //.pipe(sourcemaps.init())
        //.pipe(terser())
        //.pipe(sourcemaps.write('./'))
        .pipe(concat('gunjstrustsharekey.js'))
        .pipe(dest('build/', { sourcemaps: bsourcemaps}))
}

function jsmin() {
    let bsourcemaps = true;
    return src(scriptsharekeyfile, { sourcemaps: bsourcemaps })
        //.pipe(sourcemaps.init())
        .pipe(terser())
        //.pipe(sourcemaps.write('./'))
        .pipe(concat('gunjstrustsharekey.min.js'))
        .pipe(dest('build/', { sourcemaps: bsourcemaps }))
}
exports.js = js;
exports.jsmin = jsmin;

exports.default = parallel(js, jsmin);