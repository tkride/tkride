

/** 'binance.js' */

class Binance {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "binance";

    // Api query
    static API_URL = 'https://api.binance.com';
    static API_VERSION = '/api/v3/';
    static API_QUERY = Binance.API_URL + Binance.API_VERSION;
    static PING = Binance.API_QUERY + 'ping';
    static TIME = Binance.API_QUERY + 'time';
    static EXCHANGE_INFO = Binance.API_QUERY + 'exchangeInfo';
    static TRADES = Binance.API_QUERY + 'trades';
    static HISTORIC = Binance.API_QUERY + 'klines';

    // Wb socket streams
    static STREAM = 'stream.binance.com';
    static STREAM_PORT = '9443';

    // Events
    static EVENT_VIRTUAL_WEBSOCKET = 'event-virtual-websocket-';

    //----------------------------- PROPERTIES -----------------------------

    tickers = [];
    webSockets = {};
    lastServerTime;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #sendQueryWorker({query, timeout, url, method}) {
        return new Promise((resolve, reject) => {
            // console.log(query);
            let worker = new Worker('/static/js/app/ajax_worker.js');
            worker.onmessage = e => {
                let data = e.data;
                if(data.status == 200) { resolve(JSON.parse(data.data)); }
                else if(data.status == 403) { reject(data); }
                worker.terminate();
            }
            worker.postMessage({ query:JSON.stringify(query), url, timeout, method });
        });
    }

    #formatStreamData(data) {
        let k = data.k;
        let ohlc = [[k.t, k.o, k.h, k.l, k.c, k.v, k.T, k.q, k.n, k.V, k.Q, k.B]];
        return ohlc;
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init() {
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    getTickers() {
        return new Promise((resolve, reject) => {
            console.log('getTickers');
            fetch(Binance.EXCHANGE_INFO)
            .then( data => data.json())
            .then( res => {
                this.tickers = res.symbols.filter(t => t.status == 'TRADING').map(t => t.symbol);
                resolve(this.tickers);
            })
            .catch( err =>{
                console.log(`Server ${Binance.NAME} get tickers error: ${err}.`);
                reject(err);
            });
        });
    }

    ping() {
        return new Promise((resolve, reject) => {
            let start = performance.now();
            let ping = -1;
            fetch(Binance.PING)
            .then( response => {
                ping = performance.now() - start;
                resolve(ping);
            })
            .catch(err => {
                console.log(`Server ${Binance.NAME} ping error: ${err}.`);
                reject(err);
            });
        });
    }

    getServerTime() {
        return new Promise((resolve, reject) => {
            fetch(Binance.TIME)
            .then( data => data.json())
            .then( time => resolve(time.serverTime))
            .catch(err => {
                console.log(`Server ${Binance.NAME} get server time error: ${err}.`);
                reject(err);
            });
        });
    }

    getHistoric({ id, timeFrame, startTime, endTime, limit = 1000 }) {
        return new Promise((resolve, reject) => {
            let baseQuery = Binance.HISTORIC + `?symbol=${id}&interval=${timeFrame}&limit=${limit}`;
            // Default 1 object. Will add base query
            let timeQueries = [{}];
            if(startTime || endTime) {
                timeQueries = Time.getTimeQueries({timeFrame, startTime, endTime, querySize: limit});
            }
            let historicQueries = [];
            timeQueries.forEach( q => {
                let query = (q.startTime) ? baseQuery + `&startTime=${q.startTime}` : baseQuery;
                query = (q.endTime) ? query + `&endTime=${q.endTime}` : query;
                // console.log(query);
                historicQueries.push(this.#sendQueryWorker({url: query, method: 'GET'}));
            });
            
            Promise.all(historicQueries)
            .then( data => resolve([].concat(...data)))
            .catch(err => {
                console.log(`Server ${Binance.NAME} get server time error: ${err}.`);
                reject(err);
            });
        });
    }

    getTrades({ id, timeFrame}) {
        return new Promise((resolve, reject) => {
            fetch(Binance.TIME)
            .then( data => data.json())
            .then( time => resolve(time.serverTime))
            .catch(err => {
                console.log(`Server ${Binance.NAME} get server time error: ${err}.`);
                reject(err);
            });
        });
    }

    openWebSocket_({id, active, timeFrame, callback }) {
        // if(this.webSockets[`${active}_${timeFrame}`]) {
        //     this.webSockets[`${active}_${timeFrame}`].count++;
        // }
        if(this.webSockets[id]) {
            this.webSockets[id].count++;
        }
        else {
            // this.webSockets[`${active}_${timeFrame}`] = {
            this.webSockets[id] = {
                object: new WebSocket(`wss://${Binance.STREAM}:${Binance.STREAM_PORT}/ws/${active.toLowerCase()}@kline_${timeFrame}`),
                count: 1
            };
        }

        // this.webSockets[`${active}_${timeFrame}`].object.onmessage = e => {
        this.webSockets[id].object.onmessage = e => {
            let data = this.#formatStreamData(JSON.parse(e.data));
            if(typeof callback == "function") {
                // console.log(new Date().toLocaleString());
                callback({id, data});
            }
        }
    }
    
    closeWebSocket_({id, active, timeFrame}) {
        id = (id) ? id : `${active}_${timeFrame}`;
        if(this.webSockets[id]) {
            if(--this.webSockets[id].count == 0) {
                this.webSockets[id].object.close();
                delete this.webSockets[id];
            }
        }
    }

    openWebSocket({id, active, timeFrame, callback }) {
        if(this.webSockets[id]) {
            this.webSockets[id].count++;
        }
        else {
            function processWebSocket() {
                let timeout = Date.now() - (parseInt(Date.now()/1000)*1000);
                this.webSockets[id].object = setTimeout( () => processWebSocket.call(this), timeout);
                this.getHistoric({ id: active, timeFrame, limit: 2 })
                .then( data => $(document).trigger(`${Binance.EVENT_VIRTUAL_WEBSOCKET}${id}`, [data]) );
            }

            let timeout = Date.now() - (parseInt(Date.now()/1000)*1000);
            this.webSockets[id] = {
                // object: setInterval( () => {
                //             this.getHistoric({ id: active, timeFrame, limit: 1 }).
                //             then( data => $(document).trigger(`${Binance.EVENT_VIRTUAL_WEBSOCKET}${id}`, [data]) );                
                //         }, 1000),
                object: setTimeout( () => processWebSocket.call(this), timeout),
                count: 1
            };
            // this.webSockets[id].object = setInterval( () => {
            //     this.getHistoric({ id: active, timeFrame, limit: 1 }).
            //     then( data => $(document).trigger(`${Binance.EVENT_VIRTUAL_WEBSOCKET}${id}`, [data]) );                
            // }, 1000);
        }
        
        $(document).on(`${Binance.EVENT_VIRTUAL_WEBSOCKET}${id}`, (e, data) => {
            if(typeof callback == "function") {
                this.getServerTime()
                .then(time => {
                    this.lastServerTime = time;
                    callback({id, data, time});
                });
            }
        });
    }
    
    closeWebSocket({id, active, timeFrame}) {
        id = (id) ? id : `${active}_${timeFrame}`;
        if(this.webSockets[id]) {
            if(--this.webSockets[id].count == 0) {
                // clearInterval(this.webSockets[id].object);
                clearTimeout(this.webSockets[id].object);
                delete this.webSockets[id];
            }
        }
    }
}


// var ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
// var ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_5m');
// ws.onmessage = e => {
//     // console.log(e.data);
//     console.log(new Date().toLocaleString());
// }

