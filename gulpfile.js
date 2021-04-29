/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

"use strict";

const eslint = require("@zebrajaeger/gulp-eslint");
const esdoc = require("gulp-esdoc");
const gulp = require("gulp");
const ts = require("gulp-typescript");
// const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject("tsconfig.json");
const fs = require("fs");
const rmdir = require("rmdir");

const serverSrcrDir  =  "./src";
const tempDir = ".temp";
const distDir = "dist";
const distServerSrcDir  =  distDir + "/src";
const distTestDir = distDir + "/test";
const coverageDir = "./coverage";
const nycOutputDir = "./.nyc_output";

gulp.task("clean", () => {
  try {
    fs.stat(tempDir, (fsError) => {
      if (!fsError) {
        rmdir(tempDir, (err, dirs) => {
          if (err) {
            console.log(`Failed to rmdir dirs : ${tempDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      }
    });
  } catch(err) {
    console.log(`Clean '${tempDir}' error: '${err}'`);
  }

  try {
    fs.stat(distDir, (fsError) => {
      if (!fsError) {
        rmdir(distDir, (err, dirs) =>{
          if (err) {
            console.log(`Failed to rmdir dirs : ${distDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      }
    });
  } catch(err) {
    console.log(`Clean '${distDir}' error: '${err}'`);
    return Promise.reject(new Error(`Clean '${distDir}' error: '${err}'`));
  }

  try {
    fs.stat(distTestDir, (fsError) => {
      if (!fsError) {
        rmdir(distTestDir, (err, dirs) =>{
          if (err) {
            console.log(`Failed to rmdir dirs : ${distTestDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      }
    });
  } catch(err) {
    console.log(`Clean '${distTestDir}' error: '${err}'`);
    return Promise.reject(new Error(`Clean '${distTestDir}' error: '${err}'`));
  }

  try {
    fs.stat(coverageDir, (fsError) => {
      if (!fsError) {
        rmdir(coverageDir, (err, dirs) => {
          if (err) {
            console.log(`Failed to rmdir dirs : ${coverageDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      }
    });
  } catch(err) {
    console.log(`Clean '${coverageDir}' error: '${err}'`);
    return Promise.reject(new Error(`Clean '${coverageDir}' error: '${err}'`));
  }

  try {
    fs.stat(nycOutputDir, (fsError) => {
      if (!fsError) {
        rmdir(nycOutputDir, (err, dirs) => {
          if (err) {
            console.log(`Failed to rmdir dirs : ${nycOutputDir}`);
          } else {
            console.log(`rmdir dirs : ${dirs}`);
          }
        });
      }
    });
  } catch(err) {
    console.log(`Clean '${nycOutputDir}' error: '${err}'`);
    return Promise.reject(new Error(`Clean '${nycOutputDir}' error: '${err}'`));
  }
  return Promise.resolve("Clean completed");
});

gulp.task("tsc", gulp.series("clean", () => {
    return tsProject.src()
        //.pipe(sourcemaps.init())
        .pipe(tsProject())
        //.pipe(sourcemaps.write('.', {includeContent: true, sourceRoot: '.'})) // Removed to get TS code coverage output working <WIP>
        .pipe(gulp.dest(distServerSrcDir));
}));

gulp.task("tscompile", () => {
  console.log(`tsProject.src() : ${tsProject.src()}`);
  console.log(`CldistServerSrcDirean  : ${distServerSrcDir}`);

  return tsProject.src()
    //.pipe(sourcemaps.init())
    .pipe(tsProject())
    //.js
    //.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: ''}))
    .pipe(gulp.dest(distServerSrcDir));
});

gulp.task("copyOtherFiles", () => {
    return gulp.src([`${serverSrcrDir}/**/*.*`, `${serverSrcrDir}/**/*.ts`])
        .pipe(gulp.dest(distServerSrcDir));
});

gulp.task("docs", () => {
    return gulp.src("./src/")
    .pipe(esdoc({
      destination: "./dist/documentation",
      unexportIdentifier: true,
      undocumentIdentifier: true,
      test: {
        type: "mocha",
        source: "./test",
      }
    }));
});

gulp.task("lint", () => {
  return gulp.src([`${serverSrcrDir}/**/*.ts`, "./test/**/*.ts"])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task("default", gulp.series("tsc", "lint", "docs", "copyOtherFiles"));
