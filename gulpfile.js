/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

"use strict";

const gulp = require("gulp");
const fs = require("fs");
const rm = require("rimraf");

gulp.task('clean', () => {
  const tempDirArray = [
    ".temp",
    './coverage',
    './.nyc_output',
    "dist",
    "tests/.temp"
  ];

  for (let i = 0; i < tempDirArray.length; i += 1) {
    const tempDir = tempDirArray[i];
    try {
      fs.stat(tempDir, (fsError) => {
        if (fsError) {
          if (fsError.code !== 'ENOENT') {
            console.error(`ERROR: rmdifs.stat(${tempDir}) erorr: ${fsError}`);
          }
        } else {
          rm(tempDir, (err) => {
            if (err) {
              console.error(`ERROR: Failed to rimraf dirs : ${tempDir}`);
            }
          });
        }
      });
    } catch(err) {
      console.error(`Clean '${tempDir}' error: '${err}'`);
    }
  }

  return Promise.resolve(); // Directory does not exist, but do not stop GULP
});
