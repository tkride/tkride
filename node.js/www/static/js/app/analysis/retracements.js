

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
            let data_source = JSON.parse(JSON.stringify(ret[Const.MODEL_ID][ret[Const.DATA_TYPE_ID]][Const.DATA_ID]));
            let search_in = (ret[Const.SEARCH_IN_ID] != undefined) ? ret[Const.SEARCH_IN_ID] : undefined;
            let search_in_data = (search_in != undefined) ? JSON.parse(JSON.stringify(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID][search_in])) : undefined;

            // Process for each trend requested
            Const.BOTH.forEach( s => {
                let rets = {};
                let stats = {};
                let trend_search = s;
                
                // When searching targets, the results trend, should be stored as source retracement data trend.
                if(ret.from == Const.END_ID) {
                    trend_search = s * (-1);
                }

                // Iterate over all levels
                data_source.forEach((data, i) => {
                    rets[i] = []; //{ [Const.DATA_ID]: [], [Const.STATS_ID]: {} };
                    stats[i] = {};
                    let level = 0;
                    level = i;
                    // Deep copy to keep source data integrity
                    // let data_cpy = JSON.parse(JSON.stringify(data));
                    let data_cpy = data;

                    // Search all data with search trend
                    let base_data = (ret[Const.SEARCH_IN_DATA_ID] != undefined) ? ret[Const.SEARCH_IN_DATA_ID] : data_cpy;

                    let mov_source = data_cpy.filter(d => d[Const.TREND_ID] == trend_search);
                    let retracements = mov_source.filter( m => (m[Const.RET_ID] >= ret.ret_min) && (m[Const.RET_ID] <= ret.ret_max));

                    // Append levels data
                    ret[Const.RET_LEVELS_ID].forEach( l => {
                        retracements.map( (v, i) => v[l] = v[Const.END_ID].price - (v[Const.DELTA_INIT_ID] * l) );
                    });

                    // Update real source trend in retracement data
                    if(trend_search != s) {
                        retracements.map( (v, i) => v[Const.TREND_ID] = s );
                    }
                    // rets[i][Const.DATA_ID] = retracements;
                    rets[i] = retracements;

                    // STATS
                    let total = mov_source.length;
                    let total_pc = (total / total) * 100; // TODO CUANDO SE BUSQUE EN RESULTADOS ANTERIORES, CAMBIARA DEL 100%
                    let ok = retracements.length;
                    let ok_pc = (ok / total) * 100;
                    let bad = (total - ok);
                    let bad_pc = (bad / total) * 100;
                    stats[i][Const.TREND_ID] = trend_search;
                    stats[i][Const.OK_ID] = { [Const.NUM_ID]: ok, [Const.PERCENT_ID]: ok_pc};
                    stats[i][Const.BAD_ID] = { [Const.NUM_ID]: bad, [Const.PERCENT_ID]: bad_pc};
                    stats[i][Const.TOTAL_ID] = { [Const.NUM_ID]: total, [Const.PERCENT_ID]: total_pc }; //TODO SI SE BUSCA EN RESULTADOS ANTERIORES NO SERA 100% !!
                });
                
                // let trend_str = Const.TREND_STR[trend_search];
                // ret[Const.DATA_ID][trend_str] = rets;
                // ret[Const.STATS_ID][trend_str] = stats;
                Object.keys(rets).forEach( l => {
                    if(ret[Const.DATA_ID][l] == undefined) ret[Const.DATA_ID][l] = [];
                    if(ret[Const.STATS_ID][l] == undefined) ret[Const.STATS_ID][l] = [];
                    ret[Const.DATA_ID][l].push(...rets[l]);
                    ret[Const.STATS_ID][l].push(stats[l]);
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

