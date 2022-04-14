/**file: interace_tsql.js */

// Interface between front and server
class InterfaceTSQL {

    //----------------------------- STATIC, CONSTANTS -----------------------------
    static NAME = 'interface-tsql';
    static url_section = 'tsql';

    //----------------------------- PROPERTIES -----------------------------
    #root_url = '';
    // #headers;
    // Saves each query and result as array
    #query_hist = [];
    #workers = [];
    #TSQL = TSQL_node;

    //----------------------------- CONSTRUCTOR -----------------------------
    // constructor(root_url, headers) {
    constructor(root_url) {
        this.#root_url = root_url + InterfaceTSQL.url_section;
        // this.#headers = headers;
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    // send_query(query, successCb, errorCb=null, async = true, timeout, url) {
    //     // if ((url === undefined) || (url == null)) {
    //     if(!url) {
    //         url = this.#root_url;
    //     }
    //     this.#query_hist.push(query);
    //     console.log(query);
    //     Ajax.post(url, this.#headers, query, successCb, errorCb, async, timeout);
    // }

    send_query_worker(query, successCb, errorCb=null, async = true, timeout, url) {
        if(!url) {
            url = this.#root_url;
        }
        this.#query_hist.push(query);
        console.log(query);
        let worker = new Worker('/static/js/app/ajax_worker.js');
        worker.onmessage = e => {
            let data = e.data;
            if(data.status == 200) {
                if(successCb) {
                    successCb(JSON.parse(data.data));
                }
            }
            else if(data.status == 403) {
                if(errorCb) {
                    errorCb(data);
                }
            }
            worker.terminate();
        }
        // worker.postMessage({ query:JSON.stringify(query), headers:this.#headers, url, timeout });
        worker.postMessage({ query:JSON.stringify(query), url, timeout });
    }

    get_queries() {
        return this.#query_hist;
    }

    get_last_query() {
        return this.#query_hist.flat(-1);
    }

    build_query(cmd, params) {
        let query;
        var that = this;
        try {
            query = cmd + this.#TSQL.CMD_CLAUSE_OPEN + ' ';
            if(params) {
                Object.keys(params).forEach(function(key) {
                    query += key;
                    query += that.#TSQL.PARAM_CLAUSE_OPEN;
                    query += params[key]
                    query += that.#TSQL.PARAM_CLAUSE_CLOSE;
                    query += ' ';
                });
            }
            query += this.#TSQL.CMD_CLAUSE_CLOSE;
            query = { query: query };
        }
        catch(error) {
            console.error(error);
            return error;
        }
        return query;
    }

    get_brokers() {
        return new Promise((resolve, reject) => {
            let query = this.build_query(this.#TSQL.GET_BROKERS);
            this.send_query_worker(query,
                                    brokers => resolve(brokers),
                                    error => reject(error)
                                    );
        });
    }

    /** Get brokers tickers */
    load_all_tickers_from(broker) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let query = this.build_query(this.#TSQL.LEE_ACTIVOS_BROKER_ID, {[this.#TSQL.BROKER_ID]: broker});
                // this.send_query(query,
                this.send_query_worker(query,
                                        tickers => {
                                            // that.tickers = JSON.parse(rawData);
                                            // that.tickers = rawData;
                                            resolve(tickers);
                                        },
                                        error => reject(error));
            }
            catch(error) {
                console.error(error);
                reject(broker);
            }
        });
    }

    /** Broker historical data */
    load_historical(request, block=true, timeout=0) {
        var that = this;
        console.log(request);
        return new Promise( (resolve, reject) => {
            var rawData;
            try {
                let timeFrame = (this.#TSQL.MARCO_ID in request) ? request[this.#TSQL.MARCO_ID] : '';
                let from = (this.#TSQL.DESDE_ID in request) ? request[this.#TSQL.DESDE_ID] : '';
                let interval = (this.#TSQL.INTERVALO_ID in request) ? request[this.#TSQL.INTERVALO_ID] : '';
                // let interval = (this.#TSQL.INTERVALO in request) ? request[this.#TSQL.INTERVALO] : '';
                if((from == '') && (interval == '')) {
                    interval = this.get_default_historical_interval(timeFrame);
                    request[this.#TSQL.INTERVALO_ID] = interval;
                }

                if(timeout == 0) {
                    timeout = Const.DEFAULT_LOAD_HISTORIC_TIMEOUT;
                    // timeout = this.calculate_timeout((interval != '') ? interval : from);
                }

                //Builds AJAX query
                let query = this.build_query(this.#TSQL.LEE_HISTORICO_ID, request);
                // that.send_query(query,
                that.send_query_worker(query,
                                (rawData) => { console.log('AJAX: ', rawData); resolve(rawData); },
                                (error) => { console.log('AJAX: ', error); reject(error); },
                                (!block),
                                timeout);
            }
            catch(error) {
                console.error(error);
                rawData = error;
                reject(rawData);
            }
        });
    }

    /** Calculates default historical interval of time, if no one selected */
    get_default_historical_interval(timeFrame) {
        let time_now = Time.now();
        let from = Time.subtract_value(time_now, 1500, timeFrame).format(Time.FORMAT_STR);
        let interval = from + Const.PARAM_SEPARATOR + time_now.format(Time.FORMAT_STR);
        return interval;
    }

    /** Returns timeout in ms. Will apply a maximum delay of 1s per 2 Montths */
    calculate_timeout(period_time, timeFrame='') {
        let timeout = 10000; //Default timeout
        if(typeof period_time == 'string') {
            // If period_time is 'DESDE'
            if(period_time.includes(Const.PARAM_SEPARATOR) == false) {
                period_time = Time.subtract_value(Time.now(Time.FORMAT_STR), period_time).format(Time.FORMAT_STR);
                period_time += Const.PARAM_SEPARATOR + Time.now(Time.FORMAT_STR);
            }

            //Now will have an 'INTERVALO'
            let periods = period_time.split(Const.PARAM_SEPARATOR);
            let start = periods[0];
            let final = periods[1];
            let diff = Time.subtract_dates(final, start);
            timeout = (diff / (Time.MINUTES_IN_HOUR * 2)) * 60 * (Time.MS_IN_SECONDS);
            // timeout = (diff / (Time.MINUTES_IN_HOUR * 2)) * 60 * (Time.MS_IN_SECONDS);
        }
        else {
            console.error(this.calculate_timeout.name + ': parameter period_time expected to be "string" instead of ' + typeof period_time + '.');
        }
        return timeout;
    }

    /** Select maximum working data */
    select_maximum(id, level) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let request = { [this.#TSQL.ID]:id+'_MAX', [Const.NIVEL_ID]: level};
                let query = this.build_query(Const.SELECCIONA_ID, request);
                that.send_query_worker(query, rawData => resolve(rawData), error => reject(error), false, 3000);
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    /** Select movements working data */
    select_movements(id, level) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let level_str = (level!=null) ? ('_' + level) : String();
                let request = { [this.#TSQL.ID]: id + level_str + '_MOV' };
                let query = this.build_query(Const.SELECCIONA_ID, request);
                that.send_query_worker(query, rawData => resolve(rawData), error => reject(error), false, 3000);
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    select_data(request) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let query = this.build_query(Const.SELECCIONA_ID, request);
                // that.send_query(query, rawData => resolve(rawData), error => reject(error), false, 3000);
                that.send_query_worker(query, rawData => resolve(rawData), error => reject(error), false, 3000);
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    /** Maximum data */
    load_maximum(id, level_max) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let request = { [this.#TSQL.ID]:id+'_MAX', [Const.NIVEL_ID]:level_max };
                let query = this.build_query(Const.MAXIMOS_ID, request);
                // that.send_query(query,
                that.send_query_worker(query,
                                        rawData => resolve(rawData),
                                        error => reject(error),
                                        false,
                                        100000);
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    /** Movement data */
    load_movements(id, level) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let level_str = (level!=null) ? ('_' + level) : String();
                let request = { [this.#TSQL.ID]: id + level_str + '_MOV' };
                let query = this.build_query(Const.MOVIMIENTOS_ID, request);
                // that.send_query(query, rawData => resolve(rawData), error => reject(error), false, 10000);
                that.send_query_worker(query, rawData => resolve(rawData), error => reject(error), false, 100000);
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    /** Loads retracements */
    load_retracements(request) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                // request[this.#TSQL.ID] = request[this.#TSQL.ID] + '_RET';
                let query = this.build_query(Const.RETROCESOS_ID, request);
                // that.send_query(query, rawData => resolve(rawData), error => reject(error), false, 10000);
                that.send_query_worker(query, rawData => resolve(rawData), error => reject(error), false, 100000);
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }
}