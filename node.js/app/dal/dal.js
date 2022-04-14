

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

exports.save_session = async (session) => {
    return new Promise((resolve, reject) => {
        try {
            let user = session.user;
            let resources = session.resources;
            let sessions = session.sessions;
            db.query({ query: `CALL SAVE_SESSION(?, ?, ?);`, values: [user, resources, sessions] })
            .then( res => resolve(res))
        }
        catch(error) {
            reject(error);
        }
    });
}

exports.check_user_logged = async (user, ip, timestamp) => {
    let res = -1;
    try {
        res = await db.query({ query: `SELECT CHECK_USER_LOGGED(?, ?, ?);`, values: [user, ip, timestamp] });
        res = Object.values(res[0]);
        res = parseInt(res)
        res = res > -1;
    }
    catch(error) {
        console.error(error);
    }
    return res;
}

exports.login_user = async (user, pass, ip, timestamp) => {
    let res = -1;
    try {
        res = await db.query({ query: `SELECT LOGIN_USER(?, ?, ?, ?)`, values: [user, pass, ip, timestamp] });
        // console.log('auth:', res);
        res = Object.values(res[0]);
        res = parseInt(res);
        res = res > -1;
    }
    catch(error) {
        throw error;
    }
    return res;
}

exports.save_pattern = async (params) => {
    try {
        let user = params.user;
        let name = params.ID;
        let values = JSON.stringify(params);
        let res = await db.query({ query: `SELECT SAVE_PATTERN(?, ?, ?)`, values: [user, name, values] });
        // console.log('Pattern saved: ', res);
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
        // console.log('Load user patterns: ', res);
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
        // console.log('Delete patterns: ', res);
        return res;
    }
    catch(error) {
        throw error;
    }
}

const actions = {
    "load_session": this.load_session,
    "save_session": this.save_session,
    "check_user_logged": this.check_user_logged,
    "authenticate_user": this.login_user,
    "save_pattern": this.save_pattern,
    "load_user_patterns": this.load_user_patterns,
    "delete_pattern": this.delete_pattern,
}