var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var eslint = require('gulp-eslint');

gulp.task('examples-test1-bower', function() {
	gulp.src('./examples/test1/src/index.html')
		.pipe(wiredep())
		.pipe(gulp.dest('./examples/test1/target'));
});

gulp.task('examples-test1-copy', function() {
	gulp.src('./examples/test1/src/*.js')
		.pipe(gulp.dest('./examples/test1/target'))
});

gulp.task('examples-test1-lint', function() {
	gulp.src('./examples/test1/src/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
})

gulp.task('lint', function() {
	gulp.src('./src/*.js')
		.pipe(eslint())
		.pipe(eslint.format());
})

gulp.task('examples-test1', ['examples-test1-bower', 'examples-test1-copy', 'examples-test1-lint', 'lint']);