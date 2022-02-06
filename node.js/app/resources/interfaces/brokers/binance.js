
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


/**
 * 
 * @param {*} query query request fields:
 * id: symbol
 * interval: time frame (1m, 3m, 5m, 15m, 30, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M)
 * starttime: first timestamp in EPOCH UNIX (ms)
 * endtime: last candle timestamp in EPOCH UNIX (ms)
 * @returns Promise object { query, data }
 * query: input query
 * data: array of candle information
 *       candle information example:
 * [
    {
        openTime: 1508328900000,
        open: '0.05655000',
        high: '0.05656500',
        low: '0.05613200',
        close: '0.05632400',
        volume: '68.88800000',
        closeTime: 1508329199999,
        quoteAssetVolume: '2.29500857',
        trades: 85,
        baseAssetVolume: '40.61900000',
    },
  ]
 */
function load_historic(query) {
    return new Promise( (resolve, reject) => {
// console.log("QUERY:", query);
        console.time('load_historic');
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
            );
        });

        Promise.all(historic_queries)
        .then(historics => {
            console.timeEnd('load_historic');
            console.log('TOTAL HISTORICS RX: ', historics.length);
            resolve({ query: query, data: [].concat(...historics) });
        })
        .catch(err => {
            console.timeEnd('load_historic:', query);
            reject(err);
        });
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

const process = (req) => {
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