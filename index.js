'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */

process.env.NODE_ENV = 'local';
//process.env.NODE_ENV = 'production';
process.env.debug = '*';

const UseCookie=1;

const app = require('./dist/src');

// Import the express lirbary
const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const hogan = require('hogan-xpress');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

app.generateInstance()
.then((app) => {

  app.use(express.static(__dirname + '/public'));

  // Needed for showing main index page
  app.set('view engine', 'html');
  app.set('views', require('path').join(__dirname, '/public'));
  app.engine('html', hogan);

  var memoryStore = new session.MemoryStore();

  app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
    name: 'session'
  }));

  const KeyClockConfig = {
    'realm': 'realm_PetStore',
    'realmUrl': 'http://localhost:8080',
    'auth-server-url': 'http://localhost:8080/auth/',
    'ssl-required': 'none',
    'clientId': 'PetStore_CLIENT',
    'resource': 'PetStore_CLIENT',
    'verify-token-audience': false,         // Changed was true
    'credentials': {
      'secret': 'aca30a3d-c83c-428f-b45e-eb33e1de8b4a'
    },
    'public-client': false,
    'use-resource-role-mappings': true,     // test with false
    'confidential-port': 0,
    'policy-enforcer': {},
    'bearer-only' : false,                  // Need to set to fasle to enable login screen
    'enable-basic-auth' : true,             // NEW set to true , default false
    'token-store': true                     // NEW set to true , default false
  };

  var keycloak = new Keycloak(
    {
      cookies: true
    },
    KeyClockConfig
  );

  app.use(keycloak.middleware({
    logout: '/logout',
    admin: '/admin',
    protected: '/protected/resource'
  }));


  app.get('/loginviaprotect',  keycloak.protect(), function (req, res) {
    var token;
    if (UseCookie===1) {
      token = req.cookies['keycloak-token'];
    } else {
      token =  req.session['keycloak-token'];
    }

    var resultToken = {};

    const jToken = JSON.parse(token);
    Object.entries(jToken).forEach((entry) => {
      const [key, value] = entry;
      var decoded = jwt.decode(value, { header: true });
      // FAILs!!!! var decoded = jwt.verify(value, KeyClockConfig.credentials.secret, { header: true });
      if (decoded === null) {
        decoded = value;
      } else {
        decoded = JSON.stringify(decoded);
      }

      //console.log(`${key}: ${decoded}`);
      resultToken[key] = decoded;
    });

    // console.log(`POSTMAN access_token: ${jToken.access_token}`);
    // console.log(`POSTMAN header Authorization: 'Basic ${Buffer.from(KeyClockConfig.clientId + ':' + KeyClockConfig.credentials.secret).toString('base64')}`);

    try {
      var grantData = JSON.parse( token );
      keycloak.storeGrant(grantData, req, res);
      resultToken['XXX-storeGrant-Passed'] = JSON.stringify(grantData, null, 4);
    }
    catch(error) {
      resultToken['XXX-storeGrant'] = `FAILED - ${error.message}`;
    }
    finally {
      keycloak.getGrant(req, res)
      .then(grantData => {
        var jgrantData = JSON.stringify( grantData, null, 4);
        resultToken['XXX-getGrant-Passed'] = jgrantData;
        // console.log(`getGrant B : ${jgrantData}`);
      })
      .catch(error => {
        resultToken['XXX-getGrant'] = `FAILED - ${error.message}`;
      })
      .finally(() => {
        res.render('index', {
          result: JSON.stringify(resultToken, null, 4),
          event: `Showing req.cookies['keycloak-token'] cookie data`
        });
      });
    }
  });
  app.get('/loginviacode', function (request, response) {
    let host = request.hostname;
    let headerHost = request.headers.host.split(':');
    let port = headerHost[1] || '';
    let protocol = request.protocol;
    let hasQuery = ~(request.originalUrl || request.url).indexOf('?');

    let redirectUrl = protocol + '://' + host + (port === '' ? '' : ':' + port) + (request.originalUrl || request.url) + (hasQuery ? '&' : '?') + 'auth_callback=1';

    if (request.session) {
      request.session.auth_redirect_uri = redirectUrl;
    }

    let uuid = uuidv4();
    let loginURL = keycloak.loginUrl(uuid, redirectUrl);
    response.redirect(loginURL);
  });

//  app.get('/protected/resource', keycloak.enforcer(['res:read', 'res:write'], {resource_server_id: 'nodejs-apiserver'}), function (req, res) {
//  app.get('/protected/resource', keycloak.enforcer(['read_role'], {response_mode: 'token'}), function (req, res) {
//  app.get('/protected/resource', keycloak.enforcer(['petstore_read_res']), function (req, res) {
  app.get('/protected/resource', keycloak.enforcer(['res_read']), function (req, res) {
      var token;
    if (UseCookie===1) {
      token = req.cookies['keycloak-token'];
    } else {
      token =  req.session['keycloak-token'];
    }

    var resultToken = {};

    const jToken = JSON.parse(token);
    Object.entries(jToken).forEach((entry) => {
      const [key, value] = entry;
      var decoded = jwt.decode(value, { header: true });
      // FAILs!!!! var decoded = jwt.verify(value, KeyClockConfig.credentials.secret, { header: true });
      if (decoded === null) {
        decoded = value;
      }

      console.log(`${key}: ${decoded}`);
      resultToken[key] = decoded;
    });

    res.render('index', {
      result: JSON.stringify(resultToken, null, 4),
      event: `Showing req.cookies['keycloak-token'] cookie data`
    });

  });

  app.get('/', function (req, res) {
    res.render('index');
  });

  // Return a 404
  app.use((req, res) => {
    res.status(404).json({message: `Request end point not found`});
  });

});
