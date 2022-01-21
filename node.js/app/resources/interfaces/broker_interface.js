
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
    return new Promise((resolve, reject) => {
        let broker = req.PARAMS.broker.toLowerCase();
        if(brokers[broker]) {
            brokers[broker].process(req, res)
            .then(data => resolve(data))
            .catch(err => reject(err));
        }
        else {
            let err = conf.interface_msg_error_broker_not_exist + broker;
            console.error(err);
            reject(err)
        }
    });
}

// IMPORTS

module.exports = { init, process };
