
// IMPORTS

const conf = require('../../serverSettings.json');
const mysql = require('mysql');

// PROPERTIES

var conn = mysql.createConnection({
    host: conf.db_host,
    port: conf.db_port,
    user: conf.db_user,
    password: conf.db_pass,
    // database: conf.db_ddbb,
    // socketPath: conf.db_socketPath,
});

// PUBLIC

const query = async (params) => {
    try {
        return new Promise((resolve, reject) => {
            if(params && params.query) {
                let sql = params.query;
                let values = params.values;
                
                if(values) {
                    values.forEach( v => v = mysql.escape(v));
                }
                conn.query(sql, values, (err, res) => {
                    if(err) {
                        console.error('DDBB query error:', err);
                        reject(err);
                    }
                    resolve(res);
                });
            }
            else {
                console.log(conf.db_msg_empty_query_error);
                reject(conf.db_msg_empty_query_error);
            }
        });
    }
    catch(error) {
        console.log('db_mysql::query exeption:', error);
        reject(error);
    }
}

exports.query = query;

// PRIVATE

const init_ddbb = async () => {
    try {
        // Check if DDBB exists
        console.log(`Checking main DDBB ${conf.db_db_name} exists...`);
        let res = await query({ query: conf.db_query_get_database_like, values: [conf.db_db_name] });
        // console.log('init_ddbb results:%j', res);
        if(Object.values(res[0]).includes(conf.db_db_name.toLowerCase()) == false) {
            // Create DDBB
            conn.query({ query: conf.db_query_create_db + conf.db_db_name});
            console.log(`DDBB ${conf.db_db_name} created.`);
        }
        
        res = await query({ query: conf.db_query_use_db + conf.db_db_name });
        console.log(`Connected to ${conf.db_database}.`);

        // Check all main tables are created
        console.log(`Getting tables from:${conf.db_db_name}...`);
        res = await query({ query: conf.db_query_get_tables});
        let tables_ddbb = [...res.map( r => Object.values(r)[0] )];
        // console.log('Tables:%j', tables_ddbb);
        let tables = JSON.parse(conf.db_tables);
        // console.log(tables);
        tables.forEach( t => {
            if(tables_ddbb.includes(t) == false) {
                console.log(`ERROR: table ${t} does not exist id DDBB.`);
            }
        });
    }
    catch(error) {
        console.error(`db_mysql::init_ddbb: error: ${error}`);
    }
}

exports.connect = () => {
    return new Promise((resolve, reject) => {
        conn.connect( (err) => {
            if(err) {
                console.log(conf.db_msg_connection_error, err);
                reject(err);
            }
            else {
                console.log(conf.db_msg_connection_success);
                // Check if DDBB exists and create it from scratch
                init_ddbb().then( r => resolve(true));
            }
        });
    });
}

exports.close = function close() { conn.end(); }

