

const ACTIONS = [
    "GET_TICKERS",
    "LOAD_HISTORIC",
    "SELECT",
    "GET_REL_MAX",
    "GET_MOVEMENTS",
    "GET_RETRACEMENTS",
];

const COMMANDS = [
    "GET_BROKERS"
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

const ALL = ACTIONS.concat(PARAMS).concat(COMMANDS);

const DEFS = {
    "ACTION": "ACTION",
    "PARAMS": "PARAMS",
    "COMMAND": "COMMAND"
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

const isCmd = (cmd) => {
    return (COMMANDS.indexOf(cmd) != -1);
}

module.exports = { get, isCmd, ACTIONS, PARAMS, DEFS, ALL }