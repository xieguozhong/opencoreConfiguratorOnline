const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');

gulp.task('css_concat',()=>{
    return gulp.src([
        'src/assets/css/bootstrap.min.css',
        'src/assets/css/font-awesome.min.css',
        'src/assets/css/jquery-ui.min.css',
        'src/assets/css/ui.jqgrid.min.css',
        'src/assets/css/ace.min.css',
        'src/assets/css/ace-skins.min.css',
        'src/assets/css/ace-rtl.min.css',
        'src/assets/css/jquery.minimalTips.css',
        'src/assets/css/toastr.min.css'
        ])
        .pipe(concat('opencore.min.css'))    //合并成为opencore.min.js文件
        .pipe(gulp.dest('docs/assets/css'));   //输出到build目录下
        //.pipe(uglify())   //压缩js文件
        //.pipe(gulp.dest('build'));   //输出到build目录下
});

gulp.task('jss_1',()=>{
    return gulp.src([
        'src/assets/opencorejs/lang.js',
        'src/assets/opencorejs/tips_zh-CN.js',
        'src/assets/opencorejs/plist_parser.js',
        'src/assets/opencorejs/comm.js',
        'src/assets/opencorejs/initGirdtable.js',
        'src/assets/opencorejs/index.js',
        'src/assets/opencorejs/generatePlist.js'
        ])
        .pipe(concat('opencore.js'))    //合并成为opencore.min.js文件
        .pipe(gulp.dest('build'))   //输出到build目录下
        .pipe(uglify())   //压缩js文件
        .pipe(gulp.dest('build'));   //输出到build目录下
});

gulp.task('jss_2',()=>{
    return gulp.src([        
        'src/assets/commjs/vue.min.js',
        'src/assets/commjs/jquery.min.js',		
        'src/assets/commjs/jquery-ui.custom.min.js',
        'src/assets/commjs/grid.base.min.js',
        'src/assets/commjs/grid.common.js',
        'src/assets/commjs/grid.grouping.min.js',
        'src/assets/commjs/grid.inlinedit.js',
        'src/assets/commjs/grid.jqueryui.min.js',
        'src/assets/commjs/grid.locale-en.min.js',
        'src/assets/commjs/bootstrap.min.js',
        'src/assets/commjs/ace.min.js',
        'src/assets/commjs/ace-elements.min.js',		
        'src/assets/commjs/FileSaver.min.js',
        'src/assets/commjs/jquery.format.min.js',
        'src/assets/commjs/clipboard.min.js',
        'src/assets/commjs/jquery.minimalTips.min.js',
        'src/assets/commjs/toastr.min.js',
        'src/assets/commjs/jszip.min.js',

        'build/opencore.js'
        ]).pipe(concat('opencore.min.js'))    //合并成为opencore.min.js文件
        .pipe(gulp.dest('docs/assets/js'))
        .pipe(gulp.dest('utools/assets/js'));    //输出到utools/assets/js目录下
});

gulp.task('index_html_replace', function() {
    return gulp.src('src/index.html')
      .pipe(htmlreplace({
        //   'css': 'https://cdn.jsdelivr.net/gh/xieguozhong/opencoreConfiguratorOnline@main/docs/assets/css/opencore.min.css',
        //   'jss': 'https://cdn.jsdelivr.net/gh/xieguozhong/opencoreConfiguratorOnline@main/docs/assets/js/opencore.min.js'
        'css': 'assets/css/opencore.min.css',
        'jss': 'assets/js/opencore.min.js'
      }))
      .pipe(gulp.dest('docs'))
      .pipe(gulp.dest('utools'));
  });


gulp.task('series_jss',gulp.series('jss_1','jss_2'));
gulp.task('default',gulp.parallel('series_jss','index_html_replace','css_concat'));

gulp.task('watch',function(){
    gulp.watch('src/assets/opencorejs/**/*.js',gulp.series('jss_1','jss_2'));
    gulp.watch('src/index.html',gulp.parallel('index_html_replace'));
})
