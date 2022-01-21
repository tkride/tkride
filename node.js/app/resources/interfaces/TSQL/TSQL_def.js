

const ACTIONS = [
    "GET_TICKERS",
    "LOAD_HISTORIC",
    "SELECT",
    "GET_REL_MAX",
    "GET_MOVEMENTS",
    "GET_RETRACEMENTS",
];

const PARAMS = [
    "ID",
    "SYMBOL",
    "BROKER",
    "TICKER",
    "INTERVAL",
    "FROM",
    "START",
    "END",
    "LEVEL",

    "SEARCH_IN",
    "VALUES",
    "SENSE",
    "ITERATE",
    "ONLY_MAX",
    "STOP_SOURCE",
    "STOP_AT",
];

const ALL = ACTIONS.concat(PARAMS);

const DEFS = {
    "ACTION": "ACTION",
    "PARAMS": "PARAMS"
}

const get = (cmd) => {
    let res;
    let idx = ALL.indexOf(cmd);
    if(idx > -1) {
        res = ALL[idx].toLowerCase();
    }
    else {
        res = cmd;
    }
    return res;
}

module.exports = { get, ACTIONS, PARAMS, DEFS, ALL }