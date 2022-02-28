

/** 'retracements.js' */

class Retracement {
    data = {};
    nok = {};
    searchindata = {};
    stats = {};
    // name;
    searchin = '';
    level;
    levels = {};
    trend;
    trend_parent;
    from;
    onlymax = 0;
    ret_min = -Infinity; //Number.MIN_SAFE_INTEGER;
    ret_max = Infinity; //Number.MAX_SAFE_INTEGER;
    logical = '';
    iterate = 0;
    query;
}

class Retracements {

    //----------------------------- PUBLIC METHODS -----------------------------

    static process(request) {
        try {
            console.time(`Retracements ${request[Const.ID_ID]}`);
            var ret = Retracements.#process(request);
        }
        catch(error) {
            console.error(`Retracements process ERROR: ${error}.`);
        }
        console.timeEnd(`Retracements ${request[Const.ID_ID]}`);
        return ret;
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    static #process(request) {
        var ret = new Retracement();
        try {
            Retracements.#parse_request(ret, request);

            // Deep copy to keep source data integrity
            let data_source = JSON.parse(JSON.stringify(ret[Const.MODEL_ID][Const.MOVS_ID][Const.DATA_ID]));
            let search_in = (ret[Const.SEARCH_IN_ID]) ? ret[Const.SEARCH_IN_ID] : undefined;
            let search_in_model = ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID][search_in];
            let search_in_data = ((search_in_model != undefined) && (search_in != undefined)) ?
                                            JSON.parse(JSON.stringify(search_in_model[Const.DATA_ID])) : undefined;
            // If parent results not in current results, then process to make them available
            if(search_in && !search_in_data) {
                let request_parent = JSON.parse(JSON.stringify(ret[Const.PATTERNS_ID][search_in]));
                request_parent[Const.MODEL_ID] = ret[Const.MODEL_ID];
                request_parent[Const.MODEL_KEY_ID] = ret[Const.MODEL_KEY_ID];
                request_parent[Const.PATTERNS_ID] = ret[Const.PATTERNS_ID];
                Retracements.process(request_parent);
                search_in_model = ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID][search_in];
                search_in_data = ((search_in_model != undefined) && (search_in != undefined)) ?
                                                JSON.parse(JSON.stringify(search_in_model[Const.DATA_ID])) : undefined;
            }

            let level_data_source = ret[Const.RET_LEVELS_DATA_SOURCE_ID];

            let from = ret[Const.QUERY_ID][Const.FROM_ID];
            let until = ret[Const.QUERY_ID][Const.UNTIL_ID];
            let levels_from = ret[Const.RET_LEVELS_FROM_ID];

            // Iterate over all levels
            data_source.forEach((mov_source, i) => {
                let level = i;
                let trend_sign = 1;
                let level_source;

                if(ret[Const.DATA_ID][level] == undefined) ret[Const.DATA_ID][level] = [];
                if(ret[Const.NOK_ID][level] == undefined) ret[Const.NOK_ID][level] = [];
                if(ret[Const.STATS_ID][level] == undefined) ret[Const.STATS_ID][level] = [];


                // Check real request trend (when starts search from END, current mov trend is the opposite)
                // trend_sign = Retracements.get_family_trend(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID], ret[Const.QUERY_ID], search_in);
                trend_sign = Retracements.get_family_trend(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID], ret[Const.QUERY_ID]);

                // Update real source trend in retracement data (when searching targets, the results trend, should be stored as source retracement data trend).
                if(trend_sign == (-1)) {
                    mov_source.map( v => v[Const.TREND_ID] = (v[Const.TREND_ID]*trend_sign) );
                }

                // Check if limits defined in parent data
                if(level_data_source) {
                    level_source = Retracements.filter_parent_data(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID], ret[Const.QUERY_ID], level_data_source,
                                                                    { data_level: level, data_ref: mov_source,
                                                                      fields_data_content: [Const.FROM_ID, Const.UNTIL_ID],
                                                                    //   fields_data: [Const.TREND_ID],
                                                                      fields_ref: [Const.INIT_ID, Const.END_ID] //, Const.TREND_ID]
                                                                    });
                }

                // Search data in results
                if(search_in_data != undefined) {
                    mov_source = Retracements.filter(mov_source, search_in_data[level], [Const.INIT_ID, Const.END_ID, Const.TREND_ID], [from, until, Const.TREND_ID]);
                }

                // Get results: Stores matches (and matched parent results if exists search_in_data).
                //              Stores not valid (nok), and parent nok (if search_in_data exists).
                //TODO CUANDO SE HAGAN ITERACIONES, CAMBIARA LA CONDICION!!
                let retracements = [];
                let nok = [];
                mov_source.map( (m, i) => {
                    let ok = false;
                    // If checks levels in external data
                    if(level_source) {
                        // let m_source = level_source.filter(s => s[levels_from].time == m[Const.INIT_ID].time)[0];
                        let m_source = level_source[i];
                        if(m_source) {
                            let ret_max = ret.ret_max;
                            let ret_min = ret.ret_min;
                            if(Math.abs(ret_max) != Infinity) {
                                let new_max = m_source[Const.END_ID].price - (m_source[Const.DELTA_INIT_ID] * ret.ret_max);
                                let new_delta_end_max = (new_max - m[Const.END_ID].price);
                                ret_max = ((new_delta_end_max * m[Const.TREND_ID]) < 0) ?
                                                    Math.abs(new_delta_end_max / m[Const.DELTA_INIT_ID]) : 0;
                            }
                            if(Math.abs(ret_min) != Infinity) {
                                let new_min = m_source[Const.END_ID].price - (m_source[Const.DELTA_INIT_ID] * ret.ret_min);
                                let new_delta_end_min = (new_min - m[Const.END_ID].price);
                                ret_min = ((new_delta_end_min * m[Const.TREND_ID] * trend_sign) < 0) ?
                                                    Math.abs(new_delta_end_min / m[Const.DELTA_INIT_ID]) : 0;
                            }
                            
                            if(levels_from == Const.END_ID) {
                                ret_max = (Math.abs(ret_max) == Infinity) ? 0 : ret_max;
                                ret_min = (Math.abs(ret_min) == Infinity) ? 0 : ret_min;
                                ok = ((m[Const.RET_ID] <= ret_min) && (m[Const.RET_ID] >= ret_max));
                            }
                            else {
                                ok = ((m[Const.RET_ID] >= ret_min) && (m[Const.RET_ID] <= ret_max));
                            }
                        }
                        else {
                            let a = 'dump';
                        }
                    }
                    // else if checks levels in current data
                    //TODO CAMBIAR NOMBRE DEL CAMPO ret_min POR retmin PARA UTILIZAR LA DEFINICION Const.RET_MIN_ID
                    else ok = ((m[Const.RET_ID] >= ret.ret_min) && (m[Const.RET_ID] <= ret.ret_max));

                    if(ok) retracements.push(m);
                    else nok.push(m);
                });

                // Append calculated retracement level price data
                ret[Const.RET_LEVELS_ID].forEach( l => {
                    retracements.map( (v, i) => v[l] = v[Const.END_ID].price - (v[Const.DELTA_INIT_ID] * l) );
                });
                
                // Push current level results into Retracement final object
                ret[Const.DATA_ID][level].push(...retracements);
                ret[Const.NOK_ID][level].push(...nok);

                // STATS: Group statistics results by trend
                let stats = Retracements.#get_stats(retracements,
                                                    mov_source,
                                                    (search_in_data != undefined) ? search_in_model[Const.STATS_ID][level] : undefined,
                                                    trend_sign);
                ret[Const.STATS_ID][level].push(...stats);
            });
            delete ret[Const.MODEL_ID];

            // Sorts each result level data
            Object.keys(ret[Const.DATA_ID]).forEach( l => {
                ret[Const.DATA_ID][l].sort( (x, y) => ( x[Const.TIMESTAMP_ID] > y[Const.TIMESTAMP_ID]) ? 1 : -1 );
            });

        }
        catch(error) {
            let msg = `Retracements process ERROR: ${error}.`;
            console.error(msg);
            throw(msg);
        }

// TODO TEMPORAL: PARA HACER PROCESO RECURSIVO
let model_key = request[Const.MODEL_KEY_ID];
let model = request[Const.MODEL_ID];
// model[model_key][Const.PATTERN_RESULTS_ID][request[Const.ID_ID]] = ret;
model[Const.PATTERN_RESULTS_ID][request[Const.ID_ID]] = ret;
// TODO -----------------------------------------

        return ret;
    }
    
    static #parse_request(ret, request) {
        // Validate data source
        let data_type = request[Const.BUSCAR_EN_COMBO_ID];

        //---- TODO TRADUCCION TEMPORAL. OBTENER TIPO DE DATOS BIEN EN ORIGEN ----
        if( data_type == Const.MOVIMIENTOS_ID)
            data_type = Const.MOVS_ID;
        else if(data_type == Const.RETROCESOS_ID)
            data_type = Const.PATTERN_RESULTS_ID;
        // ---- END TRADUCCION TEMPORAL. OBTENER TIPO DE DATOS BIEN EN ORIGEN ----

        ret[Const.DATA_TYPE_ID] = data_type;
        
        // Read request parameters
        // ret[Const.NAME_ID] = request[Const.NAME_ID];
        ret[Const.ID_ID] = request[Const.ID_ID];
        let trend_req = request[Const.TREND_ID];
        trend_req = (typeof trend_req === 'undefined') ? undefined : eval(`Const.${trend_req.toUpperCase()}`);
        ret[Const.TREND_ID] = (trend_req instanceof Array) ? trend_req : [trend_req];
        
        ret[Const.ITERATE_ID] = (request[Const.ITERATE_ID] != undefined) ? parseInt(request[Const.ITERATE_ID]) : 0;
        ret[Const.ONLY_MAX_ID] = (request[Const.ONLY_MAX_ID] != undefined) ? request[Const.ONLY_MAX_ID] : 0;

        ret[Const.FROM_ID] = request[Const.FROM_ID];
        if(ret[Const.FROM_ID]) {
            if(ret[Const.FROM_ID] == Const.END_ID) {
                ret[Const.UNTIL_ID] = Const.CORRECTION_ID;
            }
            else if(ret[Const.FROM_ID] == Const.INIT_ID) {
                ret[Const.UNTIL_ID] = Const.END_ID;
            }
            else if(ret[Const.FROM_ID] == Const.CORRECTION_ID) {
                ret[Const.UNTIL_ID] = undefined;
            }
        }
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

        ret[Const.RET_LEVELS_DATA_SOURCE_ID] = request[Const.RET_LEVELS_DATA_SOURCE_ID];
        ret[Const.RET_LEVELS_FROM_ID] = request[Const.RET_LEVELS_FROM_ID];

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

        // Get query fields
        ret[Const.QUERY_ID] = JSON.parse(JSON.stringify(ret));

        // Query fields by reference
        ret[Const.MODEL_ID] = request[Const.MODEL_ID];
        ret[Const.PATTERNS_ID] = request[Const.PATTERNS_ID];
        ret[Const.MODEL_KEY_ID] = request[Const.MODEL_KEY_ID];
    }

    static #get_stats(rets, data_source, search_in_model, trend_sign) {
        let res = [];
        Const.BOTH.forEach( s => {
            let total;
            let total_current = data_source.filter(d => d[Const.TREND_ID] == (s*trend_sign)).length;
            if(search_in_model != undefined) {
                total = search_in_model.filter(t => t[Const.TREND_ID] == (s*trend_sign))[0][Const.OK_ID].num;
            }
            else {
                total = total_current;
            }
            let total_pc = (total / total_current) * 100;
            let ok = rets.filter(d => d[Const.TREND_ID] == s*trend_sign).length;
            let ok_pc = (ok / total) * 100;
            let bad = (total - ok);
            let bad_pc = (bad / total) * 100;
            let stats = {};
            stats[Const.TREND_ID] = s*trend_sign;
            stats[Const.OK_ID] = { [Const.NUM_ID]: ok, [Const.PERCENT_ID]: ok_pc};
            stats[Const.NOK_ID] = { [Const.NUM_ID]: bad, [Const.PERCENT_ID]: bad_pc};
            stats[Const.TOTAL_ID] = { [Const.NUM_ID]: total, [Const.PERCENT_ID]: total_pc };
            res.push(stats);
        });
        return res;
    }

    /** 
     * @param m1 Movement 1
     * @param m2 Movement 2
     * @param f1 Array of movement fields to be compared.
     *     If only f1 provided, select same fields on m1 & m2.
     *     Ex.: equal_mov(m1, m2, [Const.INIT_ID, Const.END_ID, Const.TREND_ID]);
     * @param f2 Array of movement fields for movement 2, to be compared.
     *     Ex.: equal_mov( m1, m2, [Const.END_ID], [Const.INIT_ID]);
     * @returns true: if all fields are equal. false: other case.
     */
    static equal_mov(m1, m2, f1, f2) {
        let res = false;
        if((f1 != undefined) && (f1 instanceof Array) && (f1.length > 0)) {
            if(f2 == undefined) f2 = f1;
            else if(f1.length != f2.length)
                throw('Error: Retracement.equal_mov: Parameter f2 length must be null or same length of f1');
            
            res = true;
            f1.forEach( (f, i) => {
                if(m1[f].time != undefined) {
                    res &= (m1[f].time == m2[f2[i]].time)
                            && (m1[f].price == m2[f2[i]].price);
                }
                else res &= (m1[f] == m2[f2[i]]);
            });    
        }
        else {
            res = (m1[Const.INIT_ID].time == m2[Const.INIT_ID].time)
                    && (m1[Const.END_ID].price == m2[Const.END_ID].price)
                    && (m1[Const.CORRECTION_ID].price == m2[Const.CORRECTION_ID].price);
        }
        return res;
    }

    /**@pre Sorted data 
     * @param r1 Data to be filtered
     * @param r2 Filter reference
     * @param f1 Specific fields for r1. If omitted = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
     * @param f2 Specific fields comparison for r2. If omitted = f1.
     * @returns Array r1 filtered with movs/retracements given in r2
     */
    static filter(r1, r2, f1, f2) {
        if(!f1 || !f1.length) f1 = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
        if(!f2 || !f2.length) f2 = f1;
        let ind1 = 0;
        let ret = [];
        for(let ind2 = 0; ind2 < r2.length; ind2++) {
            if(ind1 >= r1.length) ind1 = 0; // Retracement not find drives to end of source data...restart with next search
            for( ; ind1 < r1.length; ind1++) {
                let res = true;
                f2.forEach( (f, i) => {
                    if(f != undefined) {
                        if(r2[ind2][f].time != undefined)
                            res &= (r2[ind2][f].time == r1[ind1][f1[i]].time)
                                    && (r2[ind2][f].price == r1[ind1][f1[i]].price);

                        else { res &= (r2[ind2][f] == r1[ind1][f1[i]]);}
                    }
                    else res = false;
                });
                if(res) {
                    ret.push(r1[ind1++]);
                    break;
                }
            }
        }
        return ret;
    }

    static get_family_trend(model, query) {
        let trend_sign = 1;
        if(query) {
            let parent = query[Const.SEARCH_IN_ID];
            if(model && parent && (model[parent])) {
                let query_parent = model[parent][Const.QUERY_ID];
                trend_sign *= Retracements.get_family_trend(model, query_parent)
            }
            if(query[Const.FROM_ID] == Const.END_ID)
                trend_sign *= (-1);
        }
        return trend_sign;
    }

    static check_pattern_is_parent(pattern_results, query, final_parent) {
        let res = false;
        while(query && final_parent && !res) {
            let parent_name = query[Const.SEARCH_IN_ID];
            res = (parent_name == final_parent);
            query = (pattern_results[parent_name]) ?
                            pattern_results[parent_name][Const.QUERY_ID] : undefined;
        }
        return res;
    }

    static get_parent_data(pattern_results, query, final_parent) {
        let res;
        try {
            // Check is valid result AND parent of current base data
            let name = query[Const.SEARCH_IN_ID];
            if(name && final_parent && Retracements.check_pattern_is_parent(pattern_results, query, final_parent)) {
                while(name != final_parent) {
                    name = pattern_results[name][Const.QUERY_ID][Const.SEARCH_IN_ID];
                }
                res = pattern_results[name][Const.DATA_ID];
            }
            else {
                let msg = '';
                if(!name) msg = `ERROR: ${name} no es un nombre de patrón válido.`;
                else if(!final_parent) `ERROR: ${final_parent} no es un nombre de patrón válido.`;
                else msg = `ERROR: ${name} no desciende del patrón ${final_parent}.`;
                console.error(msg);
                throw(msg);
            }
        }
        catch(error) {
            let msg = `ERROR @retracements::get_parent_data: ${error}`;
            console.error(msg);
            throw(msg);
        }
        return res;
    }

    static filter_parent_data(pattern_results, query, final_parent, filter_params) {
        let data_parent;
        try {
            let data_ref = filter_params.data_ref;
            let level = filter_params.data_level;
            let parent_name;
            do {
                // Get inmediate parent data
                parent_name = query[Const.SEARCH_IN_ID];

                // First parent data don't need to be filtered
                if(!data_parent) {
                    let parent_data_ref = Retracements.get_parent_data(pattern_results, query, parent_name);
                    // Works with copy of level parent data
                    data_parent = JSON.parse(JSON.stringify(parent_data_ref[level]));
                }
                // Higher level parent data, must be filtered matching valid son results
                else {
                    if(data_parent) {
                        let fields = [];
                        if(filter_params.fields_data_content) filter_params.fields_data_content.forEach( f => fields.push(query[f]) );
                        if(filter_params.fields_data) filter_params.fields_data.forEach( f => fields.push(f) );
                        data_parent = Retracements.filter(data_ref,
                                                          data_parent,
                                                          fields,
                                                          filter_params.fields_ref
                        );
                        // let from = (filter_params.fields_data && filter_params.fields_data.from) ? filter_params.fields_data.from : query[Const.FROM_ID];
                        // let until = (filter_params.fields_data && filter_params.fields_data.until) ? filter_params.fields_data.until : query[Const.UNTIL_ID];
                        // let trend = (filter_params.fields_data && filter_params.fields_data.trend) ? filter_params.fields_data.trend : filter_params.fields_ref.trend;
                                                          //   [from, until, trend],
                                                          //   [filter_params.fields_ref.from, filter_params.fields_ref.until, filter_params.fields_ref.trend]);
                    }
                }

                if(parent_name) {
                    query = pattern_results[parent_name][Const.QUERY_ID];
                }
                else query = undefined;
            } while(data_parent && (parent_name != final_parent));
        }
        catch(error) {
            let msg = `ERROR @retracements::get_parent_data: ${error}`;
            console.error(msg);
            throw(msg);
        }
        return data_parent;
    }

}

