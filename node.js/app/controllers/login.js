
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

var authenticated = false;
// var authenticated = true;


// PUBLIC

const check_permissions = (req, res, next) => {
    console.log(`----------------------- check_permissions ${req.socket.remoteAddress} --------------------------`);

    // Get session cookies
    let grant = (req.cookies[conf.cookie_permision] == conf.permission_grant);

    if(grant || authenticated) {
        authenticated = true;
        let remember = (req.cookies[conf.cookie_remember] == conf.remember_on);
        if(remember == conf.remember_off) {
            res.clearCookie(conf.cookie_permision);
            res.clearCookie(conf.cookie_remember);
        }
        res.redirect('/main');
    }
    else {
        res.clearCookie(conf.cookie_user)
        res.redirect('/login');
    }
}

const load_login = (req, res) => {
    console.log(`----------------------- load_login ${req.socket.remoteAddress} --------------------------`);
    let file = conf.login_html;
    let filePath = path.join(app_dir, conf.www_path, file);
    res.sendFile(filePath);
}

const load_main = (req, res) => {
    console.log(` ----------------------- load_main ${req.socket.remoteAddress} --------------------------`);
    if(!authenticated) {
        res.redirect(conf.root_path);
        return;
    }
    let file = conf.main_html;
    let filePath = path.join(app_dir, conf.www_path, file);
    if(req.cookies[conf.cookie_user]) {
        res.cookie(conf.cookie_user, req.cookies[conf.cookie_user]);
    }
    res.sendFile(filePath);
}

const process_query = (req, res) => {
    console.log(`----------------------- process_query ${req.socket.remoteAddress} --------------------------`);
    if(authenticated) {
        console.log('PROCESSING....');
        var query = req.body.query;
        var request = TSQL.parse(query)
        bInterface.process(request)
        .then(data => res.send(data))
        .catch(err => JSON.stringify('ERROR PERRA'));
    }
}

const process_ddbb = async (req, res) => {
    console.log(`----------------------- process_ddbb ${req.socket.remoteAddress} --------------------------`);
    // if(authenticated) {
        console.log('PROCESSING....');
        let ip = req.socket.remoteAddress.split(':').slice(-1);
        let query = req.body.query;
        let user = req.body.user;
        let params = req.body.params;
        let is_logged = await dal.check_user_logged(user, ip);
        if(is_logged) {
            dal.process_query({ action: query, params: params })
            .then( data => res.send(JSON.stringify(data)) )
            .catch( error => res.send(JSON.stringify(error)) );
        }
    // }
}


const authenticate = (req, res) => {
    console.log(`----------------------- authenticate ${req.socket.remoteAddress} --------------------------`);
    var query = '';

    req.on('data', data => query += data);
    req.on('end', () => {
        var auth = new URLSearchParams(query);
        console.log(auth);
        let user = auth.get(conf.login_user);
        let pass = auth.get(conf.login_password);
        let ip = req.socket.remoteAddress.split(':').slice(-1);
        let remember = (auth.get(conf.login_remember) == null) ? conf.remember_off : conf.remember_on;

        dal.authenticate_user(user, pass, ip)
        .then( logged => {
            console.log('User logged:', logged);
            res.cookie(conf.cookie_remember, remember);
            if(logged) {
                console.log("REDIRECT.");
                // Write cookies
                res.cookie(conf.cookie_permision, conf.permission_grant);
                res.cookie(conf.cookie_user, user);
                req.body.user = user;
                load_main(req, res);
                // res.redirect(conf.root_path);
            }
            else {
                console.log(`Login error for ${user} (${new Date().toLocaleString()})`);
                // Write cookies
                res.cookie(conf.cookie_permision, conf.permission_denied);
                // res.writeHead(200, { 'Content-Type': 'text/html' });
                // res.write(' Error de login');
                res.redirect(conf.root_path);
                // res.end();
            }
        });
    })
}

module.exports = { check_permissions, load_login, load_main, process_query, authenticate, process_ddbb }

