
const conf = require('../../serverSettings.json');
const express = require('express');

var cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const app_dir = path.dirname(require.main.filename);

// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, conf.public_path, conf.templates_path))

const TSQL = require('../resources/interfaces/TSQL/TSQL');
const bInterface = require('../resources/interfaces/broker_interface');
bInterface.init();

// var authenticated = false;
var authenticated = true;

const check_permissions = (req, res, next) => {
    console.log("----------------------- check_permissions --------------------------");
console.log(authenticated);
    let file = conf.login_html;
    // Get session cookies
    console.log("COOKIES READ: ", req.cookies);
    console.log("PERMISSION READ: ", req.cookies[conf.cookie_permision]);
    let grant = (req.cookies[conf.cookie_permision] == conf.permission_grant);
    // res.clearCookie(conf.cookie_permision)
    // res.clearCookie(conf.cookie_remember)

    if(grant || authenticated) {
        authenticated = true;
        // file = conf.main_html;
        let remember = (req.cookies[conf.cookie_remember] == conf.remember_on);
        console.log("REMEMBER READ: ", req.cookies[conf.cookie_remember]);
        if(remember == conf.remember_off) {
            res.clearCookie(conf.cookie_permision)
            res.clearCookie(conf.cookie_remember)
        }
        res.redirect('/main');
    }
    else {
        res.redirect('/login');
    }
}

const load_login = (req, res) => {
    console.log("----------------------- load_login --------------------------");
console.log(authenticated);

    let file = conf.login_html;
    let filePath = path.join(app_dir, conf.www_path, file);
    res.sendFile(filePath);
}

const load_main = (req, res) => {
    console.log("----------------------- load_main --------------------------");
console.log(authenticated);

    if(!authenticated) {
        res.redirect(conf.root_path);
        return;
    }
    let file = conf.main_html;
    let filePath = path.join(app_dir, conf.www_path, file);
    res.sendFile(filePath);
}

const process_query = (req, res) => {
    console.log("----------------------- process_query --------------------------");
console.log();


    if(authenticated) {
        console.log('PROCESSING....');
        var query = req.body.query;
        var request = TSQL.parse(query)
        bInterface.process(request)
        .then(data => res.send(data))
        .catch(err => JSON.stringify('ERROR PERRA'));

        // res.send('OK PERRA');
    }
}

const authenticate = (req, res) => {
    console.log("----------------------- authenticate --------------------------");
console.log(authenticated);

    var query = '';

    req.on('data', data => query += data);
    req.on('end', () => {
        var auth = new URLSearchParams(query);
        console.log(auth);
        console.log(auth.get(conf.login_user));
        console.log(auth.get(conf.login_password));
        console.log(auth.get(conf.login_remember));
        let remember = (auth.get(conf.login_remember) == null) ? conf.remember_off : conf.remember_on;
        console.log("REMEMBER WRITE:", remember);
    
        if(auth.get(conf.login_user) && auth.get(conf.login_password)) {
            // Write cookies
            res.cookie(conf.cookie_permision, conf.permission_grant);
            res.cookie(conf.cookie_remember, remember);
            console.log("REDIRECT.");
            res.redirect(conf.root_path);
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(' Error de login');
            res.end();
        }
    })
}

module.exports = { check_permissions, load_login, load_main, process_query, authenticate }

