
// CONSTANTS

// IMPORTS

const TSQL = require('./TSQL_def');
const conf = require('../../../../serverSettings.json');

// function load_commands() {
//     return new Promise ( (resolve, reject) => {
//         $.getJSON("TSQL.json", data => resolve(data));
//     });
// }

// function parse (query) {
//     var res;
//     console.log('PARSE TSQL');
//     try {
//         console.log(query)
//         // Filter deletes empty array values
//         let items = query.trim().split(/[\s]+/).filter(v => v);
//         if(items.length > 0) {
//             // First always is the action
//             res = {};
//             res[TSQL.ACTION] = items.splice(0, 1);
//             let key_value = items.filter( k => (TSQL[k] != undefined));
//             let values = items.filter( v => (key_value.indexOf(v) == -1));
//             key_value.forEach( (p, i) => res[p] = values[i]);
//             console.log(res);
//         }
//     }
//     catch(error) {
//         console.error('ERROR parsing TSQL: ' + error);
//     }
//     return res;
// }
// function parse (query) {
//     var res;
//     try {
//         console.log(query)
//         // Filter deletes empty array values
//         let items = query.trim().split(/[()\s]+/).filter(v => v);
//         if(items.length > 0) {
            
//             // First always is the action
//             res = {};
//             res[TSQL.DEFS.ACTION] = items.splice(0, 1)[0];
//             res[TSQL.DEFS.PARAMS] = {};
//             let param_value = items.map( pv => pv.trim().split(/[\[\]\s]+/).filter(v=>v));

//             // Get params
//             let params = param_value.map(pv => pv[0]);

//             // Get params values
//             let values = param_value.map( pv => pv[1]);
//             values = values.map(v => v.trim().split(/[],\s]+/).filter(v=>v));

//             // Check unknown params (just notification puspose)
//             let unknown_params = params.filter(p => (TSQL.get(p) == undefined));
//             if(unknown_params.length > 0) {
//                 unknown_params.forEach(up => console.warn(conf.TSQL_msg_warning_unkown_param, up));
//             }
            
//             // Stores params
//             params.forEach( (p, i) => {
//                 let value = values[i];
//                 // If value has just 1 item, stores it as string
//                 if(value.length <= 1) {
//                     value = value[0];
//                 }
//                 res[TSQL.DEFS.PARAMS][p.toLowerCase()] = value;
//             });
//         }
//     }
//     catch(error) {
//         console.error('ERROR parsing TSQL: ' + error);
//     }
//     return res;
// }
function parse (query) {
    var res;
    try {
        console.log(query)
        // Filter deletes empty array values
        let items = query.trim().split(/[()]+/).filter(v => v);
        if(items.length > 0) {
            
            // First always is the action
            res = {};
            res[TSQL.DEFS.ACTION] = items.splice(0, 1)[0];
            res[TSQL.DEFS.PARAMS] = {};

            // let param_value = items.map( pv => pv.trim().split(/[\[\]\s]+/).filter(v=>v));
            let param_value = items.splice(0, 1)[0].split(/[$\]]+/).map(i=> i.trim().split(/\[+/))
                                    .filter(v=>v[0]);
            // Get params
            let params = param_value.map(pv => pv[0]);
            // Get params values
            let values = param_value.map( pv => pv[1]);
            values = values.map(v => v.trim().split(/[,]+/).filter(v=>v));
            // Check unknown params (just notification puspose)
            let unknown_params = params.filter(p => (TSQL.get(p) == undefined));
            if(unknown_params.length > 0) {
                unknown_params.forEach(up => console.warn(conf.TSQL_msg_warning_unkown_param, up));
            }
            
            // Stores params
            params.forEach( (p, i) => {
                let value = values[i];
                // If value has just 1 item, stores it as string
                if(value.length <= 1) {
                    value = value[0];
                }
                res[TSQL.DEFS.PARAMS][p.toLowerCase()] = value;
            });
        }
    }
    catch(error) {
        console.error('ERROR parsing TSQL: ' + error);
    }
    return res;
}


exports.parse = parse;


// const Binance = require('binance-api-node').default
// const client = Binance();

// exports.test = function test(req, res) {
//     if(req.method == 'POST') {
//         let query = '';
//         // Collect all received data
//         req.on('data', data => {
//             query += data;
//         });

//         req.on('end', data => {

//         });

//         client.ws.allTickers(tickers => {
//         console.log(tickers)
//         });

//         query = parse('LOAD_HISTORIC(BROKER[BINANCE] ID[BTCUSDT] INTERVAL[5m] FROM[2w])');
//         var ethbtc;
//         client.candles({ symbol: query.ID, limit:1, interval:query.INTERVAL, startTime:1610313691000, endTime:1641849691000 })
//         .then(data => {
//         ethbtc = data;
//         console.log(ethbtc);
//         });
//     }
//     else if(req.method == 'GET') {
//         // client.ws.allTickers(tickers => {
//         //     console.log(tickers)
//         // });

//         client.exchangeInfo()
//         .then(data => {
//             let tickers = [];
//             data.symbols.map( s => tickers.push(s.symbol));
//             console.log(tickers);
//         })
//         .catch(err => console.log(err));

//         // client.candles({symbol: 'BTCUSDT'})
//         // .then(data => console.log(data))
//         // .catch(err => console.log(err));

//         // client.ws.candles('ETHBTC', '1m', candle => {
//             // console.log(candle)
//         // })
//     }

// }

