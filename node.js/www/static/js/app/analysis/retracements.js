

/** 'retracements.js' */

class Retracement {
    data = {};
    nok = {};
    searchindata = {};
    stats = {};
    name;
    searchin = '';
    level;
    levels = {};
    trend;
    trend_parent;
    from;
    onlymax = 0;
    ret_min = Number.MIN_SAFE_INTEGER;
    ret_max = Number.MAX_SAFE_INTEGER;
    logical = '';
    iterate = 0;
    query;
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
                let level = i;
                let trend_sign = 1;
                if(ret[Const.DATA_ID][level] == undefined) ret[Const.DATA_ID][level] = [];
                if(ret[Const.NOK_ID][level] == undefined) ret[Const.NOK_ID][level] = [];
                if(ret[Const.STATS_ID][level] == undefined) ret[Const.STATS_ID][level] = [];

                // Check real request trend (when starts search from END, current mov trend is the opposite)
                trend_sign = Retracements.get_family_trend(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID], ret[Const.QUERY_ID], search_in);
                // if(ret[Const.FROM_ID] == Const.END_ID) {
                    // trend_sign = (-1);
                // }

                // Update real source trend in retracement data (when searching targets, the results trend, should be stored as source retracement data trend).
                if(trend_sign == (-1)) {
                    mov_source.map( v => v[Const.TREND_ID] = (v[Const.TREND_ID]*trend_sign) );
                }
                

                // Search data in results
                if(search_in_data != undefined) {
                    let from = ret[Const.QUERY_ID][Const.FROM_ID];
                    let until = ret[Const.QUERY_ID][Const.UNTIL_ID];
                    mov_source = Retracements.filter(mov_source, search_in_data[level], [Const.INIT_ID, Const.END_ID, Const.TREND_ID], [from, until, Const.TREND_ID]);
                }

                // Get results: Stores matches (and matched parent results if exists search_in_data).
                //              Stores not valid (nok), and parent nok (if search_in_data exists).
                //TODO CUANDO SE HAGAN ITERACIONES, CAMBIARA LA CONDICION!!
                let retracements = [];
                let nok = [];
                mov_source.map( (m, i) => {
                    if((m[Const.RET_ID] >= ret.ret_min) && (m[Const.RET_ID] <= ret.ret_max)) {
                        retracements.push(m);
                    }
                    else {
                        nok.push(m);
                    }
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
            console.error(`Retracements process ERROR: ${error}.`);
        }
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
        ret[Const.NAME_ID] = request[Const.NAME_ID];
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
        ret[Const.MODEL_ID] = request[Const.MODEL_ID];
        // delete ret[Const.QUERY_ID][Const.MODEL_ID];
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

    static get_family_trend(model, query, parent) {
        let trend_sign = 1;
        if(model && parent && (model[parent])) {
            let query_parent = model[parent][Const.QUERY_ID];
            let parent_parent = query_parent[Const.SEARCH_IN_ID];
            trend_sign *= Retracements.get_family_trend(model, query_parent, parent_parent)
        }
        if(query[Const.FROM_ID] == Const.END_ID)
            trend_sign *= (-1);

        return trend_sign;
    }
}

