
// IMPORTS

const conf = require('../../serverSettings.json');
const mysql = require('mysql');
const DB_URI = 'mongodb://localhost:27017/tkride';

// PROPERTIES

var conn = mysql.createConnection({
    // host: conf.db_host,
    // port: conf.db_port,
    socketPath: conf.db_socketPath,
    user: conf.db_user,
    password: conf.db_pass,
    database: conf.db_ddbb,
});

// PUBLIC

exports.connect = () => {
    conn.connect( (err) => {
        if(err) {
            console.log(conf.db_msg_connection_error, err);
            // throw err;
        }
        else console.log(conf.db_msg_connection_success);
    });
}

exports.close = function close() { conn.end(); }

