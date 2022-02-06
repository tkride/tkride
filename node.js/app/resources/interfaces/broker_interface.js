
// IMPORTS

const conf = require('../../../serverSettings.json');
const TSQL = require('./TSQL/TSQL_def');
const fs = require('fs');
const path = require('path');

// PROPERTIES

brokers = {};
cb_map = {};

// PRIVATE METHODS

const remove_extension = (file) => {
    return file.split('.').shift();
}

// PUBLIC METHODS

const init = () => {
    try {
        let b_path = path.join(__dirname, conf.interface_brokers_path);
        fs.readdirSync(b_path).filter(file_name => {
            let b = remove_extension(file_name);
            let b_path = './' + path.join(conf.interface_brokers_path, b);
            brokers[b] = require(b_path);
            brokers[b].init();
        });
    }
    catch(err) {
        console.error(err);
    }
    console.log(conf.interface_msg_init);
}

const process = (req, res) => {
    // console.log('broker_interface: process: ', req);
    return new Promise((resolve, reject) => {
        // If command received
        if(TSQL.isCmd(req.ACTION)) {
            let action = req.ACTION.toLowerCase();
            let func = eval(action);
            try {
                if(typeof func == 'function') {
                    func(req, res)
                    .then(brokers => resolve(brokers))
                    .catch(err => reject(err));
                }
                else {
                    console.log("broker_interface UNKNOWN COMMAND: ", action);
                }
            }
            catch(err) {
                console.error("broker_interface EXCEPTION: ", error);
            }
        }
        else {
            let broker = req.PARAMS.broker.toLowerCase();
            if(brokers[broker]) {
                brokers[broker].process(req)
                .then(data => resolve(data))
                .catch(err => reject(err));
            }
            else {
                let err = conf.interface_msg_error_broker_not_exist + broker;
                console.error(err);
                reject(err)
            }
        }
    });
}

const get_brokers = () => {
    let get_ticker_promises = [];
    let brokers_list = [];
    return new Promise((resolve, reject) => {
        Object.keys(brokers).forEach( b => {
            // console.log('broker_interface:get_brokers:', b);
            let req = {
                [TSQL.DEFS.ACTION]: 'GET_TICKERS',
                [TSQL.DEFS.PARAMS]: { broker:b }
            };
            get_ticker_promises.push(process(req));
            brokers_list.push(b);
        });

        Promise.all(get_ticker_promises)
        .then( tickers => {
            console.log("All broker's tickers read");
            let all_tickers = {};
            tickers.forEach( (t, i ) => {
                all_tickers[brokers_list[i]] = t;
            })
            console.log(all_tickers);
            resolve(all_tickers);
        })
        .catch(err => reject(err));
    });
}

// IMPORTS

module.exports = { init, process };
