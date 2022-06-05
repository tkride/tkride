/**file: chart_model.js */

// TODO ALAMCENAR TODOS LOS DATOS EN DataModel, ELIMINAR ModelChart
class DataModel {
    id;
    name;
    ohlc = {};
    movs = {};
    patternresults = {};
    // TODO PASAR RESULTADOS DE PATRONES A SU TIPO, EN LUGAR DE INCLUIRLOS TODOS EN patternresults (REVISAR CUANDO SE DESARROLLEN LOS DEMAS CASOS)
    rets = {};
    trend = {};
    next = {};
}

class ModelChart {

    // ----------------------------- STATIC, CONSTANTS -----------------------------

    static OPEN_TIME = 0;
    static OPEN = 1;
    static HIGHT = 2;
    static LOW = 3;
    static CLOSE = 4;
    static VOLUME = 5;
    static CLOSE_TIME = 6;
    static QUOTE_ASSET_VOLUME = 7;
    static TRADES = 8;
    static TAKER_BUY_BASE_ASSET_VOL = 9;
    static TAKER_BUY_QUOTE_ASSET_VOL = 10;
    static IGNORE = 11;

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
    
    splitOhlcData(rawData) {
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

            if(!rawData) {
                throw('No valid JSON data received from server.');
            }

            // Convert from array of dicts to array
            var query = rawData.query;
            dataJson = rawData.data.map( v => [
                v[ModelChart.OPEN_TIME],
                parseFloat(v[ModelChart.OPEN]),
                parseFloat(v[ModelChart.CLOSE]),
                parseFloat(v[ModelChart.HIGHT]),
                parseFloat(v[ModelChart.LOW]),
                parseFloat(v[ModelChart.VOLUME]),
                parseFloat(v[ModelChart.TRADES])
            ]);

            // Supposed sorted data ...
            for (let i = 0; i < dataJson.length; i++) {
                // Stored volume as [index, volume, {ALCISTA/BAJISTA} ]
                // NOTA: Float | 0 -> Convierte a int. Para el caso de valores negativos es mejor que Math.floor(x)
                volumes.push( [ i, (dataJson[i][5] | 0), (dataJson[i][0] < dataJson[i][1] ? Const.ALCISTA:Const.BAJISTA) ] );
                dataJson[i].splice(5, 1);

                // Stores trades
                trades.push(dataJson[i].splice(5, 1));

                // Stores date time string as x data
                data_y.push(dataJson[i]);
            }

            if(rawData.append) {
                // // If new data to append is still last candle information, replace las candle
                // let lastIdx = this.#ohlc_data.data_y.length-1;
                // if(this.#ohlc_data.data_y[lastIdx][ModelChart.OPEN_TIME] == data_y[0][ModelChart.OPEN_TIME]) {
                //     this.#ohlc_data.data_y.splice(lastIdx, 1, ...data_y);
                //     this.#ohlc_data.volume.splice(lastIdx, 1, ...volumes);
                //     this.#ohlc_data.trades.splice(lastIdx, 1, ...trades);
                // }
                // // else if new data started new candle, append and delete firts
                // else {
                //     this.#ohlc_data.data_y.shift();
                //     this.#ohlc_data.data_y.push(...data_y);
                //     this.#ohlc_data.volume.shift();
                //     this.#ohlc_data.volume.push(...volumes);
                //     this.#ohlc_data.trades.shift();
                //     this.#ohlc_data.trades.push(...trades);
                // }
                if(this.#ohlc_data.data_y.at(-data_y.length)[ModelChart.OPEN_TIME] == data_y[0][ModelChart.OPEN_TIME]) {
                    let idx = this.#ohlc_data.data_y.length - data_y.length;
                    this.#ohlc_data.data_y.splice(idx, data_y.length, ...data_y);
                    this.#ohlc_data.volume.splice(idx, volumes.length, ...volumes);
                    this.#ohlc_data.trades.splice(idx, trades.length, ...trades);
                }
                // else if new data started new candle, append and delete firts
                else {
                    let idx = this.#ohlc_data.data_y.map(d => d[ModelChart.OPEN_TIME]).indexOf(data_y[0][ModelChart.OPEN_TIME]);
                    let len = (idx > -1) ? (this.#ohlc_data.data_y.length - idx) : data_y.length;

                    this.#ohlc_data.data_y.splice(0, len);
                    this.#ohlc_data.data_y.splice(idx, data_y.length, ...data_y);
                    this.#ohlc_data.volume.splice(0, len);
                    this.#ohlc_data.volume.splice(idx, volumes.length, ...volumes);
                    this.#ohlc_data.trades.splice(0, len);
                    this.#ohlc_data.trades.splice(idx, trades.length, ...trades);
                }
                // let lastCandleIndex = this.#ohlc_data.data_y.map(v => v[0]).indexOf(data_y[0][0]);
                // if(lastCandleIndex > this.#ohlc_data.lastCandleIndex) {
                //     // Deletes first unused candle
                //     this.#ohlc_data.data_y.shift();
                //     // Fills first valid candle width empty data
                //     let firstCandleIndex = this.#ohlc_data.data_y[this.#ohlc_data.firstCandle];
                //     firstCandleIndex = [firstCandleIndex[ChartView.ECHARTS_TIMESTAMP], undefined, undefined, undefined, undefined];
                //     this.#ohlc_data.data_y.splice(this.#ohlc_data.lastCandleIndex+1, 1, ...data_y);
                // }
                // else {
                //     this.#ohlc_data.data_y.splice(lastCandleIndex, 1, ...data_y);
                // }


                min_y = Math.min(...this.#ohlc_data.data_y.map(v=>v.slice(4, 5)))
                max_y = Math.max(...this.#ohlc_data.data_y.map(v=>v.slice(3, 4)))
                // min_x = this.#ohlc_data.data_y[0][0];
                // max_x = this.#ohlc_data.data_y[this.#ohlc_data.data_y.length-1][0];
            }
            else {
                min_y = Math.min(...data_y.map(v=>v.slice(4, 5)))
                max_y = Math.max(...data_y.map(v=>v.slice(3, 4)))
                
                min_x = data_y[0][0];
                max_x = data_y[data_y.length-1][0];

                //Fill with empty data to let move start and end beyond limits
                let span_len = data_y.length / 4; //200;

                let limit_date = Time.subtract_value(data_y[0][Const.IDX_CANDLE_TIME], span_len, query.timeFrame);
                let dates = Time.generate_dates(limit_date, data_y[0][Const.IDX_CANDLE_TIME], query.timeFrame);
                let datesArrStart = dates.map(v=>[v, undefined, undefined, undefined, undefined]);
                // Insert dates at beginning
                // data_y.splice(0, 0, ...datesArrStart); // XXX
                // let firstCandle = datesArrStart.length;
                // let lastCandleIndex = data_y.length - 1;


                limit_date = Time.add_value(data_y[data_y.length - 1][Const.IDX_CANDLE_TIME], span_len, query.timeFrame);
                let start_date = Time.add_value(data_y[data_y.length - 1][Const.IDX_CANDLE_TIME], 1, query.timeFrame);
                dates = Time.generate_dates(start_date, limit_date, query.timeFrame);
                let datesArrEnd = dates.map(v=>[v, undefined, undefined, undefined, undefined]);
                // Insert dates at end
                // data_y.splice(data_y.length, 0, ...datesArrEnd); // XXX
                let margin = [...datesArrStart, ...datesArrEnd];


                // console.log(datos_json)
                this.#ohlc_data = {
                    id: query.active,
                    name: query.active,
                    broker: query[Const.BROKER_ID],
                    marco: query.timeFrame,
                    dataType: query.data_type,
                    data_y: data_y,
                    volume: volumes,
                    trades: trades,
                    max_y: max_y,
                    min_y: min_y,
                    max_x: max_x,
                    min_x: min_x,
                    // firstCandle: firstCandle,
                    // lastCandleIndex: lastCandleIndex,
                    margin: margin,
                };
                this.#id = this.#ohlc_data.name;
                this.#name = this.#ohlc_data.name;
            }
        }
        catch(error) {
            console.error(error);
            return error;
        }

        return this.#ohlc_data;
    }
    
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
            if(!rawData) {
                throw ('No valid candles (OHLC) data received.');
            }

            // Convert from array of dicts to array
            var query = rawData.query;
            if((rawData.data[0] instanceof Array) == false) {
                dataJson = rawData.data.map( v => [v.openTime, parseFloat(v.open), parseFloat(v.close), parseFloat(v.high), parseFloat(v.low), parseFloat(v.volume), parseFloat(v.trades)]);
            }
            else {
                dataJson = rawData.data.map( v => [
                    v[ModelChart.OPEN_TIME],
                    parseFloat(v[ModelChart.OPEN]),
                    parseFloat(v[ModelChart.HIGHT]),
                    parseFloat(v[ModelChart.LOW]),
                    parseFloat(v[ModelChart.CLOSE]),
                    parseFloat(v[ModelChart.VOLUME]),
                    parseFloat(v[ModelChart.TRADES])
                ]);
            }

            // Supposed sorted data ...
            for (let i = 0; i < dataJson.length; i++) {
                // Stores date time string as x data
                data_y.push(dataJson[i].slice(0, 5));

                // Stored volume as [index, volume, {ALCISTA/BAJISTA} ]
                // NOTA: Float | 0 -> Convierte a int. Para el caso de valores negativos es mejor que Math.floor(x)
                volumes.push( [ i, (dataJson[i][4] | 0), (dataJson[i][0] < dataJson[i][1] ? Const.ALCISTA:Const.BAJISTA) ] );
                
                // Stores trades
                trades.push(dataJson[i].splice(7, 1));
            }

            min_y = Math.min(...data_y.map(v=>v.slice(4, 5)))
            max_y = Math.max(...data_y.map(v=>v.slice(3, 4)))
            
            min_x = data_y[0][0];
            max_x = data_y[data_y.length-1][0];

            //Fill with empty data to let move start and end beyond limits
            // let tframe = Time.convert_units(rawData[Const.TIME_FRAME_ID][0]);
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
                broker: query[Const.BROKER_ID],
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
            // name_ = data_source[Const.NAME_ID][0];
            name_ = data_source[Const.ID_ID][0];
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
    
    get_pattern_result(id) {
        if(this.#pattern_result && this.#pattern_result[level] ) {
            return this.#pattern_result[level][id];
        }
        return null;
    }
    
    set pattern_result(result) {
        if(result) {
            if(!this.#pattern_result[result.level]) this.#pattern_result[result.level] = {};
            // this.#pattern_result[result.level][result[Const.NAME_ID]] = result;
            this.#pattern_result[result.level][result[Const.ID_ID]] = result;
        }
    }

}