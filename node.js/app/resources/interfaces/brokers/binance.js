
// IMPORTS

const conf = require('../../../../serverSettings.json');
const TSQL = require('../TSQL/TSQL_def');
const Binance = require('binance-api-node').default;
const TIME = require('../../helpers/time_handler');
const client = Binance();

// CONSTANTS

const MAX_HISTORIC_SIZE = 1000;

// PROPERIES

cb_map = {};

// PRIVATE METHODS

// ACTIONS

function get_tickers(params) {
    return new Promise( (resolve, reject) => {
        client.exchangeInfo()
        .then(data => {
            let tickers = data.symbols.map( s => s.symbol);
            resolve(tickers);
        })
        .catch(err => reject(err));
    });
}

function load_historic(query) {
    return new Promise( (resolve, reject) => {
console.log("QUERY:", query);

        let historic_queries = [];
        let time_queries = [];
        query.data_type = "historic";
        time_queries = TIME.get_time_queries(query, MAX_HISTORIC_SIZE);
        console.log(time_queries);
        time_queries.forEach( (time, i) => {
            historic_queries.push(
                client.candles({
                    symbol: query.id,
                    limit:1000,
                    interval:query.interval,
                    startTime:time.starttime,
                    endTime:time.endtime
                })
                // .then(historic => {
                //     console.log(historic);
                //     historics.push(historic);
                //     resolve(historics);
                // })
                // .catch(err => reject(err))
            );
        });

        Promise.all(historic_queries)
        .then(historics => {
            console.log('TOTAL HISTORICS RX: ', historics.length);
            resolve({ query: query, data: [].concat(...historics) });
        })
        .catch(err => reject(err));
    })
}

function select(params) {
}

function get_rel_max(params) {
    
}

function get_movements(params) {
    
}

function get_retracements(params) {
    
}

// PUBLIC METHODS

const init = () => {
    console.log(conf.interface_msg_init, ': BINANCE');
    TSQL.ACTIONS.forEach(d => {
        var fun = eval(d.toLowerCase());
        cb_map[d] = fun;
    });
}

const process = (req, res) => {
    return new Promise( (resolve, reject) => {
        if(req) {
            const action = req[TSQL.DEFS.ACTION];
            console.log(conf.interface_msg_processing, req);
            if(action)
                cb_map[action](req[TSQL.DEFS.PARAMS])
                .then(data => resolve(data))
                .catch(err => reject(err));
            else reject(conf.interface_msg_error_processing_action + action)
        }
    });
}

// EXPORTS

module.exports = { process, init }