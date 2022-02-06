/**file: chart_model.js */


class ModelChart {

    // ----------------------------- STATIC, CONSTANTS -----------------------------

    // ----------------------------- PROPERTIES -----------------------------
    #id;
    #name;
    #ohlc_data;
    #max_data;
    #movs_data;
    static #patterns = {};
    #pattern_result = {};

    // ----------------------------- CONSTRUCTOR -----------------------------
    constructor() {
    }
    
    // ----------------------------- PRIVATE METHODS -----------------------------

    // ----------------------------- PUBLIC METHODS -----------------------------
//TODO MOVER A LIBRERÍA ESTATICA A PARTE, DEJAR SOLO DATOS Y MÉTODOS RELACIONADOS
    
    // split_ohlc_data(rawData) {
    //     let dataJson;
    //     let data_x = [];
    //     let data_y = [];
    //     let volumes = [];
    //     let trades = [];
    //     let max_y = 0;
    //     let min_y = 1E108;
    //     let max_x = '';
    //     let min_x = '';
        
    //     try {
    //         if((rawData === undefined) || (rawData == null)) {
    //             throw ('No valid candles (OHLC) data received.');
    //         }
    //         if (((Const.TIPO_PARAM_ID in rawData) == false) || (rawData[Const.TIPO_PARAM_ID] != Const.ACTIVO_ID)) {
    //             // throw (Exception('ACTIVE data is needed to plot candles, received ' + instanceof data + ' instead.'));
    //             throw ('ACTIVO data type is needed to parse OHLC, received ' + rawData[Const.TIPO_PARAM_ID] + ' instead.');
    //         }
    //         if (rawData) {
    //             dataJson = JSON.parse(rawData[Const.JSON_ID]);
    //         }
    //         // console.log(dataJson)
    //         if(!dataJson) {
    //             throw('No valid JSON data received from server.');
    //         }

    //         // Supposed sorted data ...
    //         min_x = dataJson[0][0];
    //         max_x = dataJson[dataJson.length-1][0];
    //         for (let i = 0; i < dataJson.length; i++) {
    //             // Stores date time string as x data
    //             data_x.push(dataJson[i].splice(0, 1)[0]);
    //             // Stored volume as [index, volume, {ALCISTA/BAJISTA} ]
    //             // NOTA: Float | 0 -> Convierte a int. Para el caso de valores negativos es mejor que Math.floor(x)
    //             volumes.push( [ i, (dataJson[i][4] | 0), (dataJson[i][0] < dataJson[i][1] ? Const.ALCISTA:Const.BAJISTA) ] );
    //             // Stores trades
    //             trades.push(dataJson[i].splice(7, 1));
    //             // Deletes remaining unused data
    //             dataJson[i].splice(5, (dataJson[i].length-4));
    //             // Stores open, high, low, close array
    //             data_y.push(dataJson[i])
                
    //             dataJson[i].splice(4, 1);

    //             // if (data_x[i] > max_x)
    //             //     max_x = data_x[i];
    //             // else if (data_x[i] < min_x)
    //             //     min_x = data_x[i];

    //             let curr_max_y = Math.max(...dataJson[i]);
    //             let curr_min_y = Math.min(...dataJson[i]);
    //             if (max_y < curr_max_y)
    //                 max_y = curr_max_y;
    //             else if (min_y > curr_min_y)
    //                 min_y = curr_min_y;
    //         }
            

    //         //Fill with empty data to let move start and end beyond limits
    //         let tframe = Time.convert_units(rawData[Const.MARCO_ID][0]);
    //         let span_len = 100;

    //         let limit_date = Time.subtract_value(data_x[0], span_len, rawData[Const.MARCO_ID][0]).format(Time.FORMAT_STR);
    //         let dates = Time.generate_dates(limit_date, data_x[0], rawData[Const.MARCO_ID][0]);
    //         data_x.splice(0, 0, ...dates);
    //         data_y.splice(0, 0, ...(Array(dates.length).fill(Array(4))));
            
    //         limit_date = Time.add_value(data_x[data_x.length - 1], span_len, rawData[Const.MARCO_ID][0]).format(Time.FORMAT_STR);
    //         let start_date = Time.add_value(data_x[data_x.length - 1], 1, rawData[Const.MARCO_ID][0]).format(Time.FORMAT_STR);
    //         dates = Time.generate_dates(start_date, limit_date, rawData[Const.MARCO_ID][0]);
    //         data_x.splice(data_x.length, 0, ...dates);
    //         data_y.splice(data_y.length, 0, ...(new Array(dates.length).fill(Array(4))));

    //         // console.log(datos_json)
    //         this.#ohlc_data = {
    //             id: rawData[Const.ID_ID][0],
    //             name: rawData[Const.ID_ID][0],
    //             broker: rawData[Const.BROKER_ID][0],
    //             marco: rawData[Const.MARCO_ID][0],
    //             dataType: rawData[Const.TIPO_PARAM_ID],
    //             data_x: data_x,
    //             data_y: data_y,
    //             volume: volumes,
    //             trades: trades,
    //             max_y: max_y,
    //             min_y: min_y,
    //             max_x: max_x,
    //             min_x: min_x,
    //         };

    //         this.#id = this.#ohlc_data.name;
    //         this.#name = this.#ohlc_data.name;
    //     }
    //     catch(error) {
    //         console.error(error);
    //         return error;
    //     }

    //     return this.#ohlc_data;
    // }
    split_ohlc_data(rawData) {
        let dataJson;
        let data_x = [];
        let data_y = [];
        let volumes = [];
        let trades = [];
        let max_y = 0;
        let min_y = 1E108;
        let max_x = '';
        let min_x = '';
        
        try {
            if(rawData === undefined) {
                throw ('No valid candles (OHLC) data received.');
            }
            // if (((Const.TIPO_PARAM_ID in rawData) == false) || (rawData[Const.TIPO_PARAM_ID] != Const.ACTIVO_ID)) {
            //     // throw (Exception('ACTIVE data is needed to plot candles, received ' + instanceof data + ' instead.'));
            //     throw ('ACTIVO data type is needed to parse OHLC, received ' + rawData[Const.TIPO_PARAM_ID] + ' instead.');
            // }
            // if (rawData) {
                // dataJson = JSON.parse(rawData[Const.JSON_ID]);
                // dataJson = rawData;
            // }
            // console.log(dataJson)
            // if(!dataJson) {
            if(!rawData) {
                throw('No valid JSON data received from server.');
            }

            // Convert from array of dicts to array
            var query = rawData.query;
            dataJson = rawData.data.map( v => [v.openTime, parseFloat(v.open), parseFloat(v.close), parseFloat(v.high), parseFloat(v.low), parseFloat(v.volume), parseFloat(v.trades)]);

            // Supposed sorted data ...
            // min_x = dataJson[0][0];
            // max_x = dataJson[dataJson.length-1][0];
            for (let i = 0; i < dataJson.length; i++) {
                // Stores date time string as x data
                data_y.push(dataJson[i].slice(0, 5));
                // data_x.push(dataJson[i].splice(0, 1)[0]);

                // Stored volume as [index, volume, {ALCISTA/BAJISTA} ]
                // NOTA: Float | 0 -> Convierte a int. Para el caso de valores negativos es mejor que Math.floor(x)
                volumes.push( [ i, (dataJson[i][4] | 0), (dataJson[i][0] < dataJson[i][1] ? Const.ALCISTA:Const.BAJISTA) ] );
                
                // Stores trades
                trades.push(dataJson[i].splice(7, 1));
                
                // Deletes remaining unused data
                // dataJson[i].splice(5, (dataJson[i].length-4));
                
                // Stores open, high, low, close array
                // data_y.push(dataJson[i])
                
                // dataJson[i].splice(4, 1);

                // if (data_x[i] > max_x)
                //     max_x = data_x[i];
                // else if (data_x[i] < min_x)
                //     min_x = data_x[i];

                // let curr_max_y = Math.max(...dataJson[i]);
                // let curr_min_y = Math.min(...dataJson[i]);
                // if (max_y < curr_max_y)
                //     max_y = curr_max_y;
                // else if (min_y > curr_min_y)
                //     min_y = curr_min_y;
            }

            min_y = Math.min(...data_y.map(v=>v.slice(4, 5)))
            max_y = Math.max(...data_y.map(v=>v.slice(3, 4)))
            
            min_x = data_y[0][0];
            max_x = data_y[data_y.length-1][0];

            //Fill with empty data to let move start and end beyond limits
            // let tframe = Time.convert_units(rawData[Const.MARCO_ID][0]);
            // let tframe = Time.convert_units(query.interval);
            let span_len = 200;

            // let limit_date = Time.subtract_value(data_x[0], span_len, query.interval);
            // let dates = Time.generate_dates(limit_date, data_x[0], query.interval);
            let limit_date = Time.subtract_value(data_y[0][Const.IDX_CANDLE_TIME], span_len, query.interval);
            let dates = Time.generate_dates(limit_date, data_y[0][Const.IDX_CANDLE_TIME], query.interval);
            let dates_arr = dates.map(v=>[v, undefined, undefined, undefined, undefined]);
            // Insert dates at beginning
            // data_x.splice(0, 0, ...dates);
            data_y.splice(0, 0, ...dates_arr);

            // limit_date = Time.add_value(data_x[data_x.length - 1], span_len, query.interval);
            // let start_date = Time.add_value(data_x[data_x.length - 1], 1, query.interval);
            limit_date = Time.add_value(data_y[data_y.length - 1][Const.IDX_CANDLE_TIME], span_len, query.interval);
            let start_date = Time.add_value(data_y[data_y.length - 1][Const.IDX_CANDLE_TIME], 1, query.interval);
            dates = Time.generate_dates(start_date, limit_date, query.interval);
            dates_arr = dates.map(v=>[v, undefined, undefined, undefined, undefined]);
            // Insert dates at end
            // data_x.splice(data_x.length, 0, ...dates);
            data_y.splice(data_y.length, 0, ...dates_arr);
            
            // console.log(datos_json)
            this.#ohlc_data = {
                id: query.id,
                name: query.id,
                broker: query.broker,
                marco: query.interval,
                dataType: query.data_type,//[TSQL_node.TIPO_PARAM_ID],
                // data_x: data_x,
                data_y: data_y,
                volume: volumes,
                trades: trades,
                max_y: max_y,
                min_y: min_y,
                max_x: max_x,
                min_x: min_x,
            };

            this.#id = this.#ohlc_data.name;
            this.#name = this.#ohlc_data.name;
        }
        catch(error) {
            console.error(error);
            return error;
        }

        return this.#ohlc_data;
    }

    split_max_data(rawData) {
        let dataJson;
        let data_x = {};
        let data_y = {};
        data_y[Const.HIGH_ID] = {};
        data_y[Const.LOW_ID] = {};
        let max_y = 0;
        let min_y = 1E108;
        let max_x = '';
        let min_x;
        
        try {
            if((rawData === undefined) || (rawData == null)) {
                throw ('No valid relative maximum data received.');
            }
            if (((Const.TIPO_PARAM_ID in rawData) == false) || (rawData[Const.TIPO_PARAM_ID] != Const.MAXIMOS_ID)) {
                // throw (Exception('ACTIVE data is needed to plot candles, received ' + instanceof data + ' instead.'));
                throw ('MAXIMOS data type is needed to parse relative MAXIMUM, received ' + rawData[Const.TIPO_PARAM_ID] + ' instead.');
            }

            let levels = Object.keys(rawData[Const.JSON_ID]);
            let data_max = {};
            levels.forEach(level => {
                let data = rawData[Const.JSON_ID][level];
                data_max[level] = data.replaceAll('NaN', null);
                data_max[level] = JSON.parse(data_max[level]);
            });
            
            if(Object.keys(data_max).length == 0) {
                throw('No valid JSON data received from server.');
            }

            levels.forEach(level => {
                data_x[level+''] = data_max[level].map(mx => mx[0]);
                data_y[Const.HIGH_ID][level+''] = data_max[level].map(mh => mh[1]);
                data_y[Const.LOW_ID][level+''] = data_max[level].map(ml => ml[2]);
                
                let curr_x = data_x[level+''].slice();
                let curr_max_x = curr_x[curr_x.length-1];
                let curr_min_x = curr_x[0];
                if (curr_max_x > max_x)
                    max_x = curr_max_x;
                else if ((!min_x) || (curr_min_x < min_x))
                    min_x = curr_min_x;

                let curr_max_y = Math.max(...data_y[Const.HIGH_ID][level+'']);
                let curr_min_y = Math.min(...data_y[Const.LOW_ID][level+''].filter(y => y!=null));
                if (curr_max_y > max_y)
                    max_y = curr_max_y;
                else if (curr_min_y < min_y)
                    min_y = curr_min_y;
            });


            let level_id = rawData[Const.NIVEL_ID][0];
            this.#max_data = {
                id: rawData[Const.ID_ID][0],
                name: rawData[Const.ID_ID][0],
                level_max: level_id,
                level_selected: level_id,
                dataType: rawData[Const.TIPO_PARAM_ID],
                data_x: data_x,
                data_y: data_y,
                max_x: max_x,
                min_x: min_x,
                max_y: max_y,
                min_y: min_y,
            };
        }
        catch(error) {
            console.error(error);
            return error;
        }

        return this.#max_data;
    }
    
    split_movements_data(dataJson) {
        // console.log(rawData);

        try {
            if((dataJson instanceof Movements) == false) {
                throw('"Movements" data type expected, received ' + typeof dataJson + ' instead.');
            }

            if(!dataJson) {
                throw('No valid data received from server.');
            }

            dataJson.data.forEach( (data, i) => {
                let bull = data.filter(d => parseInt(d[Const.TREND_ID]) > 0);
                let bear = data.filter(d => parseInt(d[Const.TREND_ID]) < 0);
                let data_ret = { [Const.ALCISTA_ID]: bull.map( d => [d[Const.END_ID].data, d[Const.RET_ID]] ) };
                data_ret[Const.BAJISTA_ID] = bear.map( d => [d[Const.END_ID].data, d[Const.RET_ID]] );

                let data_delta_ini = { [Const.ALCISTA_ID]: bull.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_INIT_ID]] ) };
                data_delta_ini[Const.BAJISTA_ID] = bear.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_INIT_ID]] );

                let data_delta_fin = { [Const.ALCISTA_ID]: bull.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_END_ID]] ) };
                data_delta_fin[Const.BAJISTA_ID] = bear.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_END_ID]] );

                let data_y = { [Const.ALCISTA_ID]: [].concat( ...bull.map(d => [d[Const.INIT_ID].data, d[Const.END_ID].data, d[Const.CORRECTION_ID].data]) ) };
                data_y[Const.BAJISTA_ID] = [].concat( ...bear.map(d => [d[Const.INIT_ID].data, d[Const.END_ID].data, d[Const.CORRECTION_ID].data]) );
                
                if(!this.#movs_data) { this.#movs_data = {}; }
                this.#movs_data[i] = {
                    id: dataJson.id,
                    name: dataJson.id,
                    dataType: dataJson.dataType,
                    // data_x: data_x,
                    data_y: data_y,
                    data_ret: data_ret,
                    delta_ini: data_delta_ini,
                    delta_fin: data_delta_fin,
                    level: i, //this.#max_data.level_selected
                };
            });
        }
        catch(error) {
            console.error(error);
            return error;
        }
        return this.#movs_data;//this.#max_data.level_selected];
    }
    
    split_retracements_data(data_source, query) {
        let data_x = {};
        let data_y = {};
        let data_ret = {};
        let data_delta_ini = {};
        let data_delta_fin = {};
        let data_ret_values = [];
        let data_ret_levels = {};
        let stats = {}
        let level_;
        let name_;
        let model_key_;

        console.log(data_source);

        try {
            // if (rawData[Const.TIPO_PARAM_ID] != Const.RETROCESOS_ID) {
            if ((data_source instanceof Retracements) == false) {
                throw('Retracements data type expected, received ' + typeof(data_source) + ' instead.');
            }

            stats = data_source.stats;
            let bull = data_source.data.filter(d => parseInt(d[4]) > 0);
            let bear = data_source.data.filter(d => parseInt(d[4]) < 0);
            data_ret[Const.ALCISTA_ID] = bull.map( d => [d[2].split(','), d[7]] );
            data_ret[Const.BAJISTA_ID] = bear.map( d => [d[2].split(','), d[7]] );
            data_ret_values = data_source[Const.VALORES_ID];
            data_ret_levels[Const.ALCISTA_ID] = [].concat(...bull.map( d => [d.slice(8, d.length)]) );
            data_ret_levels[Const.BAJISTA_ID] = [].concat(...bear.map( d => [d.slice(8, d.length)]) );

            data_delta_ini[Const.ALCISTA_ID] = bull.map( d => [d[0],d[5]] );
            data_delta_fin[Const.ALCISTA_ID] = bull.map( d => [d[0],d[6]] );
            data_delta_ini[Const.BAJISTA_ID] = bear.map( d => [d[0],d[5]] );
            data_delta_fin[Const.BAJISTA_ID] = bear.map( d => [d[0],d[6]] );

            data_x[Const.ALCISTA_ID] = [].concat( ...bull.map( d => [d.slice(1,4).map(dd => dd.split(',')[0])]) );
            data_x[Const.BAJISTA_ID] = [].concat( ...bear.map( d => [d.slice(1,4).map(dd => dd.split(',')[0])]) );
            data_y[Const.ALCISTA_ID] = [].concat( ...bull.map(d => [d.slice(1,4).map(dd => dd.split(','))]) );
            data_y[Const.BAJISTA_ID] = [].concat( ...bear.map(d => [d.slice(1,4).map(dd => dd.split(','))]) );
            
            // console.log(data_ret);
            // console.log(data_x);
            // console.log(data_y);
            // console.log(data_delta_ini);
            // console.log(data_delta_fin);


            level_ = data_source[Const.NIVEL_ID][0];
            name_ = data_source[Const.NAME_ID][0];
            model_key_ = query.model_key;
            if(!this.#pattern_result) { this.#pattern_result = {}; }
            if(!this.#pattern_result[level_]) { this.#pattern_result[level_] = {}; }

            // this.#pattern_result[level_][name_] = {
            //     id: rawData[Const.ID_ID][0],
            //     name: name_,
            //     dataType: rawData[Const.TIPO_PARAM_ID],
            //     stats: stats,
            //     data_x: {[level_]: data_x},
            //     data_y: {[level_]: data_y},
            //     data_ret: {[level_]: data_ret},
            //     data_ret_values: {[level_]: data_ret_values},
            //     data_ret_levels: {[level_]: data_ret_levels},
            //     delta_ini: {[level_]: data_delta_ini},
            //     delta_fin: {[level_]: data_delta_fin},
            //     level: level_,
            //     query: query,
            //     model_key: model_key_,
            // };
            this.#pattern_result[level_][name_] = {
                id: data_source[Const.ID_ID][0],
                name: name_,
                dataType: data_source[Const.TIPO_PARAM_ID],
                stats: stats,
                data_x: data_x,
                data_y: data_y,
                data_ret: data_ret,
                data_ret_values: data_ret_values,
                data_ret_levels: data_ret_levels,
                delta_ini: data_delta_ini,
                delta_fin: data_delta_fin,
                level: level_,
                search_in: query[Const.BUSCAR_EN_ID],
                query: query,
                model_key: model_key_,
            };
        }
        catch(error) {
            console.error(error);
            return error;
        }
        return this.#pattern_result[level_][name_];
    }

    // ----------------------------- GETTERS & SETTERS -----------------------------
    get id() { return this.#id; }
    set id(id) { this.id = id; }

    get name() { return this.#name; }
    set name(name) { this.name = name; }

    get ohlc() { return this.#ohlc_data; }
    set ohlc(ohlc) { this.#ohlc_data = ohlc; }

    get max() { return this.#max_data; }
    set max(max) { this.#max_data = max; }

    get movs() { return this.#movs_data; }
    set movs(movs) { this.#movs_data = movs; }

    static get patterns() { return this.#patterns; }
    
    static set patterns(patterns) { this.#patterns = patterns; }
    
    static add_pattern(pattern) { this.#patterns[pattern[Const.ID_ID]] = pattern; }

    get pattern_result() { return this.#pattern_result; }
    
    get_pattern_result(level, id) {
        if(this.#pattern_result && this.#pattern_result[level] ) {
            return this.#pattern_result[level][id];
        }
        return null;
    }
    
    set pattern_result(result) {
        if(result) {
            if(!this.#pattern_result[result.level]) this.#pattern_result[result.level] = {};
            this.#pattern_result[result.level][result[Const.NAME_ID]] = result;
        }
    }

}