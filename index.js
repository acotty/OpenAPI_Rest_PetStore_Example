'use strict';

process.env.NODE_ENV = 'local';
//process.env.NODE_ENV = 'production';

const app = require('./dist/src');
app.generateInstance();
