
const conf = require('../../serverSettings.json');
const express = require('express');

var cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const app_dir = path.dirname(require.main.filename);

// Mnanages DDBB connection
const db = require('../dal/db_mysql');
const dal = require('../dal/dal');
db.connect();

// TSQL and broker interfaces
const TSQL = require('../resources/interfaces/TSQL/TSQL');
const bInterface = require('../resources/interfaces/broker_interface');
bInterface.init();


// PUBLIC

const load_login = (req, res) => {
    console.log(`----------------------- load_login ${req.socket.remoteAddress} --------------------------`);
    let file = conf.login_html;
    let filePath = path.join(app_dir, conf.www_path, file);
    res.sendFile(filePath);
}

const load_main = async (req, res) => {
    console.log(` ----------------------- load_main ${req.socket.remoteAddress} --------------------------`);

    // Get session cookies
    let user_logged = req.cookies[conf.tkride_user];
    let ip_logged = req.cookies[conf.tkride_ip];
    let ip = req.socket.remoteAddress.split(':').slice(-1)[0];
    let timestamp_logged = req.cookies[conf.tkride_login_timestamp] || '';
    let logged = false;
    if((ip_logged == ip) && (timestamp_logged.length > 0)) {
        logged = await dal.check_user_logged(user_logged, ip_logged, timestamp_logged);
    }

    if(logged == false) {
        res.redirect('/login');
        return;
    }
    let file = conf.main_html;
    let filePath = path.join(app_dir, conf.www_path, file);
    res.sendFile(filePath);
}

const process_query = (req, res) => {
    console.log(`----------------------- process_query ${req.socket.remoteAddress} --------------------------`);
    console.log('PROCESSING....');
    var query = req.body.query;
    var request = TSQL.parse(query)
    bInterface.process(request)
    .then(data => res.send(data))
    .catch(err => JSON.stringify(`ERROR:${err}`));
}

const process_ddbb = async (req, res) => {
    console.log(`----------------------- process_ddbb ${req.socket.remoteAddress} --------------------------`);
    console.log('PROCESSING....');
    let ip = req.socket.remoteAddress.split(':').slice(-1);
    let query = req.body.query;
    let user = req.body.user;
    let login_timestamp = req.body.login_timestamp || '';
    let params = req.body.params;
    let is_logged = await dal.check_user_logged(user, ip, login_timestamp);
    if(is_logged) {
        dal.process_query({ action: query, params: params })
        .then( data => res.send(JSON.stringify(data)) )
        .catch( error => res.send(JSON.stringify(error)) );
    }
    else {
        res.clearCookie(conf.tkride_user);
        res.clearCookie(conf.tkride_ip);
        res.clearCookie(conf.tkride_login_timestamp);
        res.clearCookie(conf.tkride_remember);
        // res.send(JSON.stringify(''));
        res.status(403).send('login');
        // res.redirect(conf.root_path);
    }
}

const login_user = (req, res) => {
    console.log(`----------------------- authenticate ${req.socket.remoteAddress} --------------------------`);
    var query = '';

    req.on('data', data => query += data);
    req.on('end', () => {
        var auth = new URLSearchParams(query);
        // console.log(auth);
        let user = auth.get(conf.login_user);
        let pass = auth.get(conf.login_password);
        let login_timestamp = new Date().toLocaleString().replace(',', '');
        let ip = req.socket.remoteAddress.split(':').slice(-1)[0];
        let remember = (auth.get(conf.login_remember) == null) ? conf.remember_off : conf.remember_on;

        dal.login_user(user, pass, ip, login_timestamp)
        .then( logged => {
            console.log(`User ${user} logged: ${logged} at ip: ${ip}.`);
            res.cookie(conf.tkride_remember, remember);
            if(logged) {
                console.log("REDIRECT.");
                // Write cookies
                res.cookie(conf.tkride_user, user);
                res.cookie(conf.tkride_ip, ip);
                res.cookie(conf.tkride_login_timestamp, login_timestamp);
                req.body.user = user;
                // load_main(req, res);
            }
            else {
                console.log(`Login error for ${user} (${new Date().toLocaleString()})`);
                // Write cookies
                // res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write(' Error de login');
            }
            res.redirect(conf.root_path);
        });
    })
}

module.exports = { /*check_permissions,*/ load_login, load_main, process_query, login_user, process_ddbb }

