

const db = require('./db_mysql');
const conf = require('../../serverSettings.json');

exports.process_query = (query) => {
    return new Promise((resolve, reject) => {
        try {
            let action = query.action;
            let params;
            // Try to parse as JSON string
            try { params = JSON.parse(query.params); }
            catch(err) { params = query.params; }
            // Params must be array
            if((params instanceof Array) == false) { params = [params]; }
            // Process action
            if(actions[action]) {
                actions[action](...params)
                .then( r => resolve(r))
                .catch( err => reject(err));
            }
        }
        catch(error) {
            reject(error);
        }
    });
}

exports.load_session = async (user) => {
    return new Promise((resolve, reject) => {
        try {
            db.query({ query: `CALL LOAD_SESSION(?);`, values: [user] })
            .then( res => resolve(res))
        }
        catch(error) {
            reject(error);
        }
    });
}

exports.check_user_logged = async (user, ip) => {
    let res = 0;
    try {
        res = await db.query({ query: `SELECT CHECK_USER_LOGGED(?, ?);`, values: [user, ip] });
        res = Object.values(res[0]);
        res = parseInt(res)
    }
    catch(error) {
        console.error(error);
        res = 0;
    }
    return res;
}

exports.authenticate_user = async (user, pass, ip) => {
    try {
        let res = await db.query({ query: `SELECT LOG_USER(?, ?, ?)`, values: [user, pass, ip] });
        console.log('auth:', res);
        res = Object.values(res[0]);
        res = parseInt(res);
        return res;
    }
    catch(error) {
        throw error;
    }
}

exports.save_pattern = async (params) => {
    try {
        let user = params.user;
        let name = params.ID;
        let values = JSON.stringify(params);
        let res = await db.query({ query: `SELECT SAVE_PATTERN(?, ?, ?)`, values: [user, name, values] });
        console.log('Pattern saved: ', res);
        res = Object.values(res[0])[0];
        res = parseInt(res);
        return res;
    }
    catch(error) {
        throw error;
    }
}

exports.load_user_patterns = async (params) => {
    try {
        let user = params;
        let res = await db.query({ query: `CALL LOAD_USER_PATTERNS(?)`, values: [user] });
        console.log('Load user patterns: ', res);
        return res;
    }
    catch(error) {
        throw error;
    }
}

exports.delete_pattern = async (params) => {
    try {
        let user = params.user;
        let name = params.name;
        let res = await db.query({ query: `SELECT DELETE_PATTERN(?, ?)`, values: [user, name] });
        res = Object.values(res[0])[0];
        console.log('Load user patterns: ', res);
        return res;
    }
    catch(error) {
        throw error;
    }
}

const actions = {
    "load_session": this.load_session,
    "check_user_logged": this.check_user_logged,
    "authenticate_user": this.authenticate_user,
    "save_pattern": this.save_pattern,
    "load_user_patterns": this.load_user_patterns,
    "delete_pattern": this.delete_pattern,
}