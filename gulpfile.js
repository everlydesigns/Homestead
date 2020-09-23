/*==========================================================================*/
/* Import Modules
/*==========================================================================*/
const { src, dest, task, watch, parallel } = require('gulp')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-csso')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const livereload = require('gulp-livereload')
const image = require('gulp-image')


/* SASS + Autoprefixer + Minifier
/*--------------------------------------------------------------------------*/
function sassPrefixMin() {
	return src('scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false }))
		//.pipe(dest(file => file.base)) // optional*
		.pipe(minifyCSS())
		//.pipe(rename({suffix: '.min' })) // optional*
		.pipe(dest('./dist/css'))
		.pipe(livereload({ start: true }))
}

/* JS + Babel + Uglify
/*--------------------------------------------------------------------------*/
function jsBabelMin() {
	return src('js/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(terser())
		.pipe(dest('./dist/js'))
}

/* Optimize graphics
/*--------------------------------------------------------------------------*/
function imgOptimize() {
	return src('img/*')
		.pipe(image())
		.pipe(dest('./dist/img'))
}

/*==========================================================================*/
/* Watch Files
/*==========================================================================*/
function watchFiles() {
	// watch all scss files
	watch('scss/**/*.scss', sassPrefixMin)

	// watch all js files
	watch('js/**/*.js', jsBabelMin)

	// watch all img files
	watch('img/*', imgOptimize)
}

/*==========================================================================*/
/* Tasks
/*==========================================================================*/
task('default', parallel(sassPrefixMin, jsBabelMin, imgOptimize, watchFiles))

/* SASS Task
/*--------------------------------------------------------------------------*/
task('sass', sassPrefixMin)

/* JS Task
/*--------------------------------------------------------------------------*/
task('js', jsBabelMin)

/* IMG Task
/*--------------------------------------------------------------------------*/
task('img', imgOptimize)
