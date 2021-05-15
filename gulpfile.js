/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

"use strict";

const gulp = require("gulp");
const fs = require("fs");
const rmdir = require("rmdir");

const tempDir = ".temp";
const distDir = "dist";
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