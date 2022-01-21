
// IMPORTS

const conf = require('./serverSettings.json');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// METHODS

function init(router) {

  function onRequest(req, res) {
    try {
      var q = url.parse(req.url, true).query;
      console.log(JSON.stringify(q));
      
      var path = url.parse(req.url).pathname;
      console.log(conf.request_msg + path);

      if (path === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
      }

      console.log(JSON.stringify(req.method));
      if(req.method == 'POST') {
        let payload = '';
        req.on('data', (data) => {
          payload += data;
        });

        req.on('end', () => {
          console.log('payload end:', payload);
          router.route(path, req, res, payload);
        });
      }
      else if(req.method == 'GET') {
        router.route(path, req, res);
      }
    }
    catch(error) {
      console.error(error);
    }
  }

  http.createServer(onRequest).listen(conf.port);
}

console.log(conf.init_msg);

exports.init = init;

  
  

  