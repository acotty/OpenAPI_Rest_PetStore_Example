"use strict";

const gulp = require('gulp');
const rmdir = require("rmdir");
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');
const tslint = require("gulp-tslint");
const fs = require('fs');

const serverSrcrDir  =  "./src";
const distDir = "dist";
const distServerSrcDir  =  distDir + "/src";
const distTestDir = distDir + "/test";
const coverageDir = './coverage';
const nycOutputDir = './.nyc_output';

gulp.task("tslint", () =>
    gulp.src([`${serverSrcrDir}/**/*.ts`, "./test/**/*.ts"])
    .pipe(tslint({
        formatter: "prose",
    }))
    .pipe(tslint.report())
);

gulp.task('clean', function() {
  try {
    fs.stat(distDir, function(err, stats)  {
      if (!err) {
        rmdir(distDir, function(err, dirs) {
          if (err) {
            console.log(`Failed to rmdir dirs : ${distDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      } else {
        if (stats !== undefined) {
          console.log(`Error stats for ${distDir} : ${stats}`);
        }
      }
    });
  } catch(err) {
    console.log(`Clean '${distDir}' error: '${err}'`);
    return Promise.reject(`Clean '${distDir}' error: '${err}'`);
  }
    
  try {
    fs.stat(distTestDir, function(err, stats)  {
      if (!err) {
        rmdir(distTestDir, function(err, dirs) {
          if (err) {
            console.log(`Failed to rmdir dirs : ${distTestDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      } else {
        if (stats !== undefined) {
          console.log(`Error stats for ${distTestDir} : ${stats}`);
        }
      }
    });
  } catch(err) {
    console.log(`Clean '${distTestDir}' error: '${err}'`);
    return Promise.reject(`Clean '${distTestDir}' error: '${err}'`);
  }

  try {
    fs.stat(coverageDir, function(err, stats) {
      if (!err) {
        rmdir(coverageDir, function(err, dirs) {
          if (err) {
            console.log(`Failed to rmdir dirs : ${coverageDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      } else {
        if (stats !== undefined) {
          console.log(`Error stats for ${coverageDir} : ${stats}`);
        }
      }
    });
  } catch(err) {
    console.log(`Clean '${coverageDir}' error: '${err}'`);
    return Promise.reject(`Clean '${coverageDir}' error: '${err}'`);
  }
    
  try {
    fs.stat(nycOutputDir, function(err, stats)  {
      if (!err) {
        rmdir(nycOutputDir, function(err, dirs) {
          if (err) {
            console.log(`Failed to rmdir dirs : ${nycOutputDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      } else {
        if (stats !== undefined) {
          console.log(`Error stats for ${nycOutputDir} : ${stats}`);
        }
      }
    });
  } catch(err) {
      console.log(`Clean '${nycOutputDir}'  error: ${err}`);
      return Promise.reject(`Clean '${nycOutputDir}' error: '${err}'`);
    }
  return Promise.resolve('Clean completed');
});


gulp.task('tsc', gulp.series('clean', function() {
    return tsProject.src()
        //.pipe(sourcemaps.init())
        .pipe(tsProject())
        //.pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '.'})) // Removed to get TS code coverage output working <WIP>
        .pipe(gulp.dest(distServerSrcDir));
}));

gulp.task('tscompile', function() {
  console.log(`tsProject.src() : ${tsProject.src()}`);
  console.log(`CldistServerSrcDirean  : ${distServerSrcDir}`);

  return tsProject.src()
    //.pipe(sourcemaps.init())
    .pipe(tsProject())
    //.js
    //.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: ''})) 
    .pipe(gulp.dest(distServerSrcDir));
});

gulp.task('copyOtherFiles', function() {
    return gulp.src([`${serverSrcrDir}/**/*.*`, `${serverSrcrDir}/**/*.ts`])
        .pipe(gulp.dest(distServerSrcDir));
});

// TSLint is temporarily removed from the run sequence after tsc
gulp.task('default', 
  gulp.series('tsc', 'tslint', 'copyOtherFiles')
);