

/** 'retracements.js' */

class Retracement {
    data = {};
    searchindata = {};
    stats = {};
    name;
    searchin = '';
    level;
    levels = {};
    trend;
    from;
    onlymax = 0;
    ret_min = Number.MIN_SAFE_INTEGER;
    ret_max = Number.MAX_SAFE_INTEGER;
    logical = '';
    iterate = 0;
}

class Retracements {

    //----------------------------- PUBLIC METHODS -----------------------------

    static process(request) {
        try {
            console.time('Retracements');
            var ret = Retracements.#process(request);
        }
        catch(error) {
            console.error(`Retracements process ERROR: ${error}.`);
        }
        console.timeEnd('Retracements');
        return ret;
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    static #process(request) {
        var ret = new Retracement();
        try {
            Retracements.#parse_request(ret, request);

            // Deep copy to keep source data integrity
            let data_source = JSON.parse(JSON.stringify(ret[Const.MODEL_ID][Const.MOVS_ID][Const.DATA_ID]));
            let search_in = (ret[Const.SEARCH_IN_ID] != undefined) ? ret[Const.SEARCH_IN_ID] : undefined;
            let search_in_model = ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID][search_in];
            let search_in_data = (search_in != undefined) ? JSON.parse(JSON.stringify(search_in_model[Const.DATA_ID])) : undefined;

            // Iterate over all levels
            data_source.forEach((mov_source, i) => {
                // rets[i] = [];
                let level = i;
                let trend_sign = 1;
                if(ret[Const.DATA_ID][i] == undefined) ret[Const.DATA_ID][level] = [];
                if(ret[Const.STATS_ID][i] == undefined) ret[Const.STATS_ID][level] = [];

                // Check real request trend (when starts search from END, current mov trend is the opposite)
                if(ret.from == Const.END_ID) {
                    trend_sign = (-1);
                }

                // Search data in results
                let mov_filt = [];
                if(search_in_data != undefined) {
                    let imov = 0;
                    // let search_trend = search_in_data[level].filter( d => d[Const.TREND_ID] == s)
                    for (let isearch = 0; isearch < search_in_data[level].length; isearch++) {
                        for (; imov < mov_source.length; imov++) {
                            if( ((mov_source[imov][Const.TREND_ID] * trend_sign) == search_in_data[level][isearch][Const.TREND_ID])
                                && (mov_source[imov][Const.INIT_ID].time == search_in_data[level][isearch][Const.END_ID].time)
                                && (mov_source[imov][Const.INIT_ID].price == search_in_data[level][isearch][Const.END_ID].price) ) {
                                mov_filt.push(mov_source[imov++]);
                                break;
                            }
                        }
                    }
                    mov_source = mov_filt;
                }

                // Get results
                let retracements = mov_source.filter( m => (m[Const.RET_ID] >= ret.ret_min) && (m[Const.RET_ID] <= ret.ret_max));

                // Append calculated retracement level price data
                ret[Const.RET_LEVELS_ID].forEach( l => {
                    retracements.map( (v, i) => v[l] = v[Const.END_ID].price - (v[Const.DELTA_INIT_ID] * l) );
                });

                // Update real source trend in retracement data (when searching targets, the results trend, should be stored as source retracement data trend).
                if(trend_sign == (-1)) {
                    retracements.map( v => v[Const.TREND_ID] = (v[Const.TREND_ID]*trend_sign) );
                }
                
                // Push current level results into Retracement final object
                ret[Const.DATA_ID][level].push(...retracements);

                // STATS
                // Group statistics results by trend
                Const.BOTH.forEach( s => {
                    let total;
                    let total_current = mov_source.filter(d => d[Const.TREND_ID] == (s*trend_sign)).length;
                    if(search_in_data != undefined) {
                        total = search_in_model[Const.STATS_ID][level].filter(t => t[Const.TREND_ID] == (s*trend_sign))[0][Const.OK_ID].num;
                    }
                    else {
                        total = total_current;
                    }
                    let total_pc = (total / total_current) * 100;
                    let ok = retracements.filter(d => d[Const.TREND_ID] == s*trend_sign).length;
                    let ok_pc = (ok / total) * 100;
                    let bad = (total - ok);
                    let bad_pc = (bad / total) * 100;
                    let stats = {};
                    stats[Const.TREND_ID] = s*trend_sign;
                    stats[Const.OK_ID] = { [Const.NUM_ID]: ok, [Const.PERCENT_ID]: ok_pc};
                    stats[Const.BAD_ID] = { [Const.NUM_ID]: bad, [Const.PERCENT_ID]: bad_pc};
                    stats[Const.TOTAL_ID] = { [Const.NUM_ID]: total, [Const.PERCENT_ID]: total_pc };
                    ret[Const.STATS_ID][level].push(stats);
                });
            });
            delete ret[Const.MODEL_ID];

            // Sorts each result level data
            Object.keys(ret[Const.DATA_ID]).forEach( l => {
                ret[Const.DATA_ID][l].sort( (x, y) => ( x[Const.TIMESTAMP_ID] > y[Const.TIMESTAMP_ID]) ? 1 : -1 );
            });

        }
        catch(error) {
            console.error(`Retracements process ERROR: ${error}.`);
        }
        return ret;
    }
    
    static #parse_request(ret, request) {
        // Validate data source
        ret[Const.MODEL_ID] = request[Const.MODEL_ID];
        let data_type = request[Const.BUSCAR_EN_COMBO_ID];

        //---- TODO TRADUCCION TEMPORAL. OBTENER TIPO DE DATOS BIEN EN ORIGEN ----
        if( data_type == Const.MOVIMIENTOS_ID)
            data_type = Const.MOVS_ID;
        else if(data_type == Const.RETROCESOS_ID)
            data_type = Const.PATTERN_RESULTS_ID;
        // ---- END TRADUCCION TEMPORAL. OBTENER TIPO DE DATOS BIEN EN ORIGEN ----

        ret[Const.DATA_TYPE_ID] = data_type;

        // if(!(data_source instanceof Movements) && !(data_source instanceof Retracement) ) {
        //     throw(`Data type expected Movements or Retracements, but received ${typeof data_source} instead.`);
        // }
        
        // Read request parameters
        ret[Const.NAME_ID] = request[Const.NAME_ID];
        // ret[Const.DATA_ID] = JSON.parse(JSON.stringify(models[data_type].data));
        let trend_req = request[Const.TREND_ID];
        trend_req = (typeof trend_req === 'undefined') ? undefined : eval(`Const.${trend_req.toUpperCase()}`);
        ret[Const.TREND_ID] = (trend_req instanceof Array) ? trend_req : [trend_req];
        
        ret[Const.ITERATE_ID] = (request[Const.ITERATE_ID] != undefined) ? parseInt(request[Const.ITERATE_ID]) : 0;
        ret[Const.FROM_ID] = request[Const.FROM_ID];
        ret[Const.ONLY_MAX_ID] = request[Const.ONLY_MAX_ID];
        ret[Const.SEARCH_IN_ID] = request[Const.SEARCH_IN_ID];
        // ret[Const.SEARCH_IN_DATA_ID] = JSON.parse(JSON.stringify(models[Const.PATTERN_RESULTS_ID][ret[Const.SEARCH_IN_ID]]));
        
        // TODO TEMPORAL DEBERÍA IR EN EL QUERY NO EN LOS DATOS!
        //Set requested level
        let level = request[Const.LEVEL_ID];
        ret[Const.LEVEL_ID] = (level != undefined) ? parseInt(level) : 0;
        if(ret[Const.LEVEL_ID] > 0) ret[Const.LEVEL_ID] = ret[Const.LEVEL_ID] - 1;

        // Process levels (may contain logical operators '>', '<')
        let levels = request[Const.RET_LEVELS_ID].split(/[\s,]+/);
        ret[Const.RET_LEVELS_ID] = levels.map( (l, i) => {
            ret[Const.LOGICAL_ID] = l.replace(/[.0-9]+/, '');
            let value = l.replace(/[<>]+/, '');
            value = parseFloat(value);
            return value;
        });

        if(ret[Const.LOGICAL_ID] == Const.LOGICAL_LOWER_THAN) {
            // ret.ret_min = Number.MIN_SAFE_INTEGER;
            ret.ret_max = Math.max(...ret.levels);
        }
        else if(ret[Const.LOGICAL_ID] == Const.LOGICAL_HIGHER_THAN) {
            // ret.ret_max = Number.MAX_SAFE_INTEGER;
            ret.ret_min = Math.min(...ret.levels);
        }
        else {
            ret.ret_min = Math.min(...ret.levels);
            ret.ret_max = Math.max(...ret.levels);
        }
    }
}

