const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('jss_1',()=>{
    return gulp.src([
        'src/opencorejs/lang.js',
        'src/opencorejs/tips_zh-CN.js',
        'src/opencorejs/plist_parser.js',
        'src/opencorejs/comm.js',
        'src/opencorejs/initGirdtable.js',
        'src/opencorejs/index.js',
        'src/opencorejs/generatePlist.js'
        ])
        .pipe(concat('opencore.js'))    //合并成为opencore.min.js文件
        .pipe(gulp.dest('src/build'))   //输出到src/build目录下
        .pipe(uglify())   //压缩js文件
        .pipe(gulp.dest('src/build'));   //输出到src/build目录下
});

gulp.task('jss_2',()=>{
    return gulp.src([        
        'src/commjs/vue.min.js',
        'src/commjs/jquery.min.js', 
        'src/commjs/grid.base.min.js',
        'src/commjs/grid.grouping.min.js',
        'src/commjs/grid.jqueryui.min.js',
        'src/commjs/grid.locale-en.min.js',
        'src/commjs/bootstrap.min.js',
        'src/commjs/ace.min.js',
        'src/commjs/ace-elements.min.js',       
        'src/commjs/FileSaver.min.js',
        'src/commjs/jquery.format.min.js',
        'src/commjs/clipboard.min.js',
        'src/commjs/jquery.minimalTips.min.js',
        'src/commjs/toastr.min.js',
        'src/build/opencore.js'
        ]).pipe(concat('opencore.min.js'))    //合并成为opencore.min.js文件
        .pipe(gulp.dest('assets/js'));    //输出到assets/js目录下
});


gulp.task('series_jss',gulp.series('jss_1','jss_2'));
gulp.task('default',gulp.parallel('series_jss'));

gulp.task('watch',function(){
    gulp.watch('src/opencorejs/**/*.js',gulp.series('jss_1','jss_2'));
})
