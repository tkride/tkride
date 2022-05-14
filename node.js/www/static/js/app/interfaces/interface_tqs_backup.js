/**file: interace_tqs.js */

// Interface between front and server
class InterfaceTQS {

    //----------------------------- STATIC, CONSTANTS -----------------------------

    //----------------------------- PROPERTIES -----------------------------
    #root_url = '';
    #headers;
    // Saves each query and result as array
    #query_hist = [];
    #workers = [];

    //----------------------------- CONSTRUCTOR -----------------------------
    constructor(root_url, headers) {
        this.#root_url = root_url;
        this.#headers = headers;
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    send_query(query, successCb, errorCb=null, async = true, timeout, url) {
        // if ((url === undefined) || (url == null)) {
        if(!url) {
            url = this.#root_url;
        }
        this.#query_hist.push(query);
        console.log(query);
        Ajax.post(url, this.#headers, query, successCb, errorCb, async, timeout);
    }

    send_query_worker(query, successCb, errorCb=null, async = true, timeout, url) {
        if(!url) {
            url = this.#root_url;
        }
        this.#query_hist.push(query);
        console.log(query);
        let worker = new Worker('/static/js/app/ajax_worker.js');
        worker.onmessage = e => {
            successCb(JSON.parse(e.data));
            worker.terminate();
        }
        worker.postMessage({ query:JSON.stringify(query), headers:this.#headers, url, timeout });
    }

    get_queries() {
        return this.#query_hist;
    }

    get_last_query() {
        return this.#query_hist.flat(-1);
    }

    build_query(cmd, params) {
        let query;
        try {
            query = cmd + Const.CMD_CLAUSE_OPEN + ' ';
            Object.keys(params).forEach(function(key) {
                query += key;
                query += Const.PARAM_CLAUSE_OPEN;
                query += params[key]
                query += Const.PARAM_CLAUSE_CLOSE;
                query += ' ';
            });
            query += Const.CMD_CLAUSE_CLOSE;
            query = { query: query };
        }
        catch(error) {
            console.error(error);
            return error;
        }
        return query;
    }

    /** Get brokers tickers */
    load_all_tickers_from(broker) {
        var that = this;
        return new Promise( (resolve, reject) => {
            try {
                let query = this.build_query(Const.LEE_ACTIVOS_BROKER_ID, {[Const.ID_ID]: broker});
                // this.send_query(query,
                this.send_query_worker(query,
                                        rawData => {
                                            that.tickers = JSON.parse(rawData[Const.JSON_ID]);
                                            resolve(that.tickers);
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
        return new Promise( (resolve, reject) => {
            var rawData;
            try {
                let timeFrame = (Const.TIME_FRAME_ID in request) ? request[Const.TIME_FRAME_ID] : '';
                let from = (Const.DESDE_ID in request) ? request[Const.DESDE_ID] : '';
                let interval = (Const.INTERVALO_ID in request) ? request[Const.INTERVALO_ID] : '';
                if((from == '') && (interval == '')) {
                    interval = (from != '') ? from : ((interval != '') ? interval : this.get_default_historical_interval(timeFrame));
                    request[Const.INTERVALO_ID] = interval;
                }
                if(timeout == 0) {
                    timeout = this.calculate_timeout((interval != '') ? interval : from);
                }

                //Builds AJAX query
                let query = this.build_query(Const.LEE_HISTORICO_ID, request);
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
                let request = { [Const.ID_ID]:id+'_MAX', [Const.NIVEL_ID]: level};
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
                let request = { [Const.ID_ID]: id + level_str + '_MOV' };
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
                let request = { [Const.ID_ID]:id+'_MAX', [Const.NIVEL_ID]:level_max };
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
                let request = { [Const.ID_ID]: id + level_str + '_MOV' };
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
                // request[Const.ID_ID] = request[Const.ID_ID] + '_RET';
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