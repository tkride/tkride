

/** 'retracements.js' */

class Retracement {
    data = {};
    nok = {};
    searchindata = {};
    stats = {};
    searchin = '';
    level;
    levels = {};
    trend;
    trend_parent;
    from;
    until;
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
            
            // If parent results not processed yet, then process to make them available
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

            //
            let level_data_source = ret[Const.RET_LEVELS_DATA_SOURCE_ID];

            let from = ret[Const.QUERY_ID][Const.FROM_ID];
            let until = ret[Const.QUERY_ID][Const.UNTIL_ID];
            let { until_ref, until_new } = Retracements.get_comparison_fields(from);
            // let levels_from = ret[Const.RET_LEVELS_FROM_ID];
            let levels_from;

            // Iterate over all levels
            data_source.forEach((mov_source, i) => {
                let level = i;
                let trend_sign = 1;
                let level_source;
                let levels_trend;
                let search_source;

                if(ret[Const.DATA_ID][level] == undefined) ret[Const.DATA_ID][level] = [];
                if(ret[Const.NOK_ID][level] == undefined) ret[Const.NOK_ID][level] = [];
                if(ret[Const.STATS_ID][level] == undefined) ret[Const.STATS_ID][level] = [];

                // Check real request trend (when starts search from END, current mov trend is the opposite)
                trend_sign = Retracements.get_family_trend(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID], ret[Const.QUERY_ID]);

                // Update real source trend in retracement data (when searching targets, the results trend, should be stored as source retracement data trend).
                if(trend_sign == (-1)) {
                    mov_source.map( v => v[Const.TREND_ID] = (v[Const.TREND_ID]*trend_sign) );
                }

                // If limits defined in any parent data, get it
                if(level_data_source) {
                    level_source = Retracements.filter_parent_data(ret[Const.MODEL_ID][Const.PATTERN_RESULTS_ID], ret[Const.QUERY_ID], level_data_source,
                                                                    { data_level: level, data_ref: mov_source,
                                                                      fields_data_content: [Const.FROM_ID, Const.UNTIL_ID],
                                                                    //   fields_data: [Const.TREND_ID],
                                                                      fields_ref: [Const.INIT_ID, Const.END_ID] //, Const.TREND_ID]
                                                                    });
                    if(level_source.length) {
                        levels_trend = ((level_source[0][Const.END_ID].price - level_source[0][Const.INIT_ID].price) > 0) ? Const.BULL : Const.BEAR;
                    }
                }

                // Search data in parent results (search_in_data)
                if(search_in_data != undefined) {
                    search_source = Retracements.filter(mov_source, search_in_data[level], [until_new, Const.TREND_ID], [until_ref, Const.TREND_ID], false);
                    // search_source = Retracements.filter(mov_source, search_in_data[level], [until_new], [until_ref], false);
                    // If base parent data, and levels from any parent, check levels trend vs current data trend, to determine from configuration
                    if(level_source && search_source.length) {
                        let mov_trend = ((search_source[0][Const.END_ID].price - search_source[0][Const.INIT_ID].price) > 0) ? Const.BULL : Const.BEAR;
                        levels_from = (levels_trend != mov_trend) ? Const.END_ID : Const.INIT_ID;
                    }
                }
                else {
                    search_source = mov_source;
                }

                // Get results: Stores matches (matched parent results if exists search_in_data).
                //              Stores not valid ,nok (matched parent nok if search_in_data exists).
                let retracements = [];
                let nok = [];
                search_source.map( (m, i) => {
                    let ok = false;
                    
                    // If movement has same information than any previous, object is treated as reference! Need to deepcopy (?)
                    m = JSON.parse(JSON.stringify(m));
                    // console.log(Retracements.toString(m));
                    // Build real movement, based on result (if result obtained from iteration, may not fit with regular movements)
                    if(search_in_data) {
                        m[Const.TIMESTAMP_ID] = search_in_data[level][i][Const.TIMESTAMP_ID];
                        m[Const.HASH_ID] = search_in_data[level][i][Const.HASH_ID];// + Const.HASH_SEP_STR + 0; // 0: First family solution (hash)
                        if(from) { m[Const.INIT_ID] = search_in_data[level][i][from]; }
                        if(until) { m[Const.END_ID] = search_in_data[level][i][until]; }
                        if(from) { m[Const.DELTA_INIT_ID] = m[Const.END_ID].price - m[Const.INIT_ID].price; }
                        if(until) { m[Const.DELTA_END_ID] = m[Const.CORRECTION_ID].price - m[Const.END_ID].price; }
                        if((from != undefined) || (until != undefined)) { m[Const.RET_ID] = Math.abs(m[Const.DELTA_END_ID] / m[Const.DELTA_INIT_ID]); }
                        // console.log(Retracements.toString(m)); console.log('');
                    }

                    // Appends new familiy results hash identification;
                    Retracements.append_hash(m);

                    let ret_max = ret[Const.RET_MAX_ID];
                    let ret_min = ret[Const.RET_MIN_ID];
                    // If checks levels in external data
                    if(level_source) {
                        // TODO NO: PUEDEN HABER MULTIPLES SOLUCIONES
                        let parent_source = level_source[i];
                        // TODO TAMPOCO: PUEDEN HABER MULTIPLES SOLUCIONES
                        // let parent_source = level_source.filter( ls => ls[Const.TIMESTAMP_ID] == m[Const.TIMESTAMP_ID])[0];
                        if(parent_source) {
                                let new_ret =
                                Retracements.get_projected_retracement_limits( { parent: parent_source,
                                                                                 movement: m,
                                                                                 [Const.RET_MAX_ID]: ret.ret_max,
                                                                                 [Const.RET_MIN_ID]: ret.ret_min,
                                                                                 trend_sign: trend_sign,
                                                                                 levels_from: levels_from } );
                                ret_max = new_ret.ret_max;
                                ret_min = new_ret.ret_min;
                                m[Const.RET_LEVELS_DATA_SOURCE_ID] = { [new_ret.ret_max]: new_ret.value_max,
                                                                       [new_ret.ret_min]: new_ret.value_min };
                                m[Const.RET_DATA_SOURCE_ID] = {   [Const.INIT_ID]: new_ret[Const.INIT_ID],
                                                                       [Const.END_ID]: new_ret[Const.END_ID] };
                        }
                        else {
                            console.warn(`No match level source for: ${level_source[i]}`);
                        }
                    }
                    
                    // Append retracement levels item list
                    m[Const.RET_LEVELS_ID] = {};

                    ok = ((m[Const.RET_ID] >= ret_min) && (m[Const.RET_ID] <= ret_max));
                    if(ok) retracements.push(m);
                    else nok.push(m);

                    // If iteration defined
                    if(ret[Const.ITERATE_ID] && (m[Const.RET_ID] <= ret_max)) {
                // TODO Y TENER EN CUENTA QUE LOS RESULTADOS BASE, PUEDEN NO ESTAR EN LOS MOVIMIENTOS FUENTE DIRECTAMENTE (MERGE DE MOVIMIENTOS, RESULTADOS DE ITERACIONES)
                        //TODO BUSCAR EN LOS MOVIMIENTOS A PARTIR DEL SELECCIONADO (O RESULTADO PADRE SELECCIONADO)
                        // let search_remain = search_source.slice(i);
                        // TODO ENCONTRAR EL MOVIMIENTO ACTUAL EN LA FUENTE
                        // let idx_mov = mov_source.map(ms => ms[Const.INIT_ID].time).indexOf(m[Const.CORRECTION_ID].time);
                        let idx_mov = mov_source.map(ms => ms[Const.INIT_ID].time).indexOf(m[until].time);
                        let mov_remain = mov_source.slice(idx_mov);
                        let res_it = Retracements.process_iteration({
                                                         start_movement: m,
                                                        //  source: search_remain,
                                                         source: mov_remain,
                                                         ret_max: ret_max,
                                                         ret_min: ret_min,
                                                         iterations: ret[Const.ITERATE_ID],
                                                         from: from,
                                                         trend_sign: trend_sign,
                        });
                        
                        // Append iteration results to retracements
                        retracements.push(...res_it.ok);
                        nok.push(...res_it.nok);
                    }
                });

                // If filter only max is defined
                if(ret[Const.ONLY_MAX_ID] != Const.NO) {
                    retracements = Retracements.filter_max_movements(retracements, ret[Const.ONLY_MAX_ID]);
                    // nok = Retracements.filter_max_movements(nok, ret[Const.ONLY_MAX_ID]);
                }

                // Append calculated retracement level price data

                retracements.map( v => ret[Const.RET_LEVELS_ID].forEach( l => v[Const.RET_LEVELS_ID][l] = v[Const.END_ID].price - (v[Const.DELTA_INIT_ID] * l)) );
                
                // Sort results by timestamp
                retracements.sort();

                // Push current level results into Retracement final object
                ret[Const.DATA_ID][level].push(...retracements);
                ret[Const.NOK_ID][level].push(...nok);

                // STATS: Group statistics results by trend
                let stats = Retracements.#get_stats(retracements,
                                                    nok,
                                                    // search_source,
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
request[Const.MODEL_ID][Const.PATTERN_RESULTS_ID][request[Const.ID_ID]] = ret;
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


    static #get_stats_(rets, data_source, search_in_model, trend_sign) {
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


    static #get_stats(ok_data, nok_data, search_in_model, trend_sign) {
        let res = [];
        Const.BOTH.forEach( s => {
            let total;
            let ok = ok_data.filter( m => m[Const.TREND_ID] == (s*trend_sign)).length;
            let bad = nok_data.filter(m => m[Const.TREND_ID] == (s*trend_sign)).length;
            let total_current = ok + bad;
            if(search_in_model != undefined) {
                total = search_in_model.filter(t => t[Const.TREND_ID] == (s*trend_sign))[0][Const.OK_ID].num;
            }
            else {
                total = total_current;
            }
            let total_pc = (total_current / total) * 100;
            total_pc = (isNaN(total_pc)) ? 0 : total_pc;
            let ok_pc = (ok / total_current) * 100;
            ok_pc = (isNaN(ok_pc)) ? 0 : ok_pc;
            let bad_pc = (bad / total_current) * 100;
            bad_pc = (isNaN(bad_pc)) ? 0 : bad_pc;
            let stats = {};
            stats[Const.TREND_ID] = s*trend_sign;
            stats[Const.OK_ID] = { [Const.NUM_ID]: ok, [Const.PERCENT_ID]: ok_pc};
            stats[Const.NOK_ID] = { [Const.NUM_ID]: bad, [Const.PERCENT_ID]: bad_pc};
            stats[Const.TOTAL_ID] = { [Const.NUM_ID]: total_current, [Const.PERCENT_ID]: total_pc };
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


    /**
     * filter_: DELETE. Unused version. Filters data based in another source data, compairing specified fields.
     * @pre Sorted data 
     * @param r1 Data to be filtered.
     * @param r2 Filter reference.
     * @param f1 Specific fields for r1. If omitted = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
     * @param f2 Specific fields comparison for r2. If omitted = f1.
     * @returns Array r1 filtered with movs/retracements given in r2
     */
    static filter_(r1, r2, f1, f2) {
        if(!f1 || !f1.length) f1 = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
        if(!f2 || !f2.length) f2 = f1;
        let ind1 = 0;
        let ret = [];
        for(let ind2 = 0; ind2 < r2.length; ind2++) {
            if(ind1 >= r1.length) ind1 = 0; // Retracement not find drives to end of source data...restart with next search
            for( ; ind1 < r1.length; ind1++) {
                let res = true;
                // f2.forEach( (f, i) => {
                f2.every( (f, i) => {
                    if((f != undefined) && (f1[i] != undefined)) {
                        if(r2[ind2][f].time != undefined) {
                            res &= (r2[ind2][f].time == r1[ind1][f1[i]].time)
                                    && (r2[ind2][f].price == r1[ind1][f1[i]].price);
                        }
                        else { res &= (r2[ind2][f] == r1[ind1][f1[i]]);}
                    }
                    return res;
                    // else res = false;
                });
                if(res) {
                    ret.push(r1[ind1++]);
                    break;
                }
            }
        }
        return ret;
    }


    /**
     * filter: Filters data based in another source data, compairing specified fields.
     * @pre Sorted data 
     * @param r1 Data to be filtered
     * @param r2 Filter reference
     * @param f1 Specific fields for r1. If omitted = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
     * @param f2 Specific fields comparison for r2. If omitted = f1.
     * @param compare_hash true: Check hash id relationship matches. false: othercase. (Default value: true).
     * @returns Array r1 filtered with movs/retracements given in r2
     */
     static filter(r1, r2, f1, f2, compare_hash = true) {
        if(!f1 || !f1.length) f1 = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
        if(!f2 || !f2.length) f2 = f1;
         let res = [];
         try {
            r2.map(m2 => {
                // let idx;
                r1.map( (m1, j) => {
                    let check_res = true;
                    for(let i = 0; i < f1.length; i++) {
                        let c1 = f1[i];
                        let c2 = f2[i];
                        if((c1 != undefined) && (c2 != undefined)) {
                            if(m1[c1].time != undefined) {
                                if (m2[c2].time != m1[c1].time) {
                                    check_res = false;
                                    break;
                                }
                            }
                            else if(m2[c2] != m1[c1]) {
                                check_res = false;
                                break;
                            }
                        }
                    }
                    
                    if(check_res) {
                        if(compare_hash) {
                            if(m1[Const.HASH_ID].length > m2[Const.HASH_ID].length) {
                                check_res = m1[Const.HASH_ID].includes(m2[Const.HASH_ID]);
                            }
                            else {
                                check_res = m2[Const.HASH_ID].includes(m1[Const.HASH_ID]);
                            }
                        }
                        if(check_res) { res.push(m1); }
                    }
                });
            });
        }
        catch(error) {
            let msg = `EXCEPTION Retracements.filter: ${error}`;
            console.error(msg);
            throw(msg);
        }
        return res;
    }


    /**
     * get_comparison_fields: Get fields to be compared, based on truth table build from 'from' field.
     * @param {*} from 'from' field from query.
     * @returns Object { from_ref, until_ref, from_new, until_new }
     */
    static get_comparison_fields(from) {
        let until_ref;
        let until_new;
        let from_ref;
        let from_new;
        if(from == Const.INIT_ID) {
            from_ref = Const.INIT_ID;
            until_ref = Const.END_ID;
            from_new = Const.INIT_ID;
            until_new = Const.END_ID;
        }
        else if(from == Const.END_ID) {
            from_ref = Const.END_ID;
            until_ref = Const.CORRECTION_ID;
            from_new = Const.INIT_ID;
            until_new = Const.END_ID;
        }
        else if(from == Const.CORRECTION_ID) {
            from_ref = Const.CORRECTION_ID;
            until_ref = Const.CORRECTION_ID;
            from_new = Const.INIT_ID;
            until_new = Const.INIT_ID;
        }
        return { from_ref, until_ref, from_new, until_new };
    }


    /**
     * get_family_trend: Get family trend based on 'from' setting in each query, and base data trend. 
     * @param {*} model Full data model.
     * @param {*} query Query to build current data.
     * @returns trend_sign: 1 (Const.BULL) | -1 (Const.BEAR).
     */
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


    /**
     * check_pattern_is_parent: Check given base data is descendant from given final parent name.
     * @param {*} pattern_results Full data model.
     * @param {*} query Query to build current base data.
     * @param {*} final_parent Final parent data name.
     * @returns true: final_parent is ascendant from base data. | false: other case.
     */
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


    /**
     * get_parent_data: Get parent data from query and model, stopping in final_parent given.
     * @throws Exception if non-existnts pattern name is found, or if current data is not descendant from parent name. Also for any unexpected operation exception.
     * @param {*} pattern_results Full data model.
     * @param {*} query Query to build current base data.
     * @param {*} final_parent Parent data name where stop search.
     * @returns Parent data.
     */
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


    /**
     * filter_parent_data: filter parent data relative to current results.
     * @param pattern_results Full model data.
     * @param query Query used to get current data results.
     * @param final_parent Final parent name to stop recursive search.
     * @param filter_params { data_level | data_ref | fields_data_content | fields_data | fields_Ref }
     * @param filter_params.data_level Current movement results level o be analysed.
     * @param filter_params.data_ref Start source reference data. Current results from which search is done, and parent data must be matched.
     * @param filter_params.fields_data_content Current data query fields name to perform filter comparation. Ex. FROM, UNTIL, ...
     * @param filter_params.fields_data Data fields to perform comparison. Ex. 'end', 'correction', 'trend', ...
     * @param filter_params.fields_ref Reference parent data fields to perform filter comparation.
     * @returns Parent data.
     */
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
                    let data_base_levels = Retracements.get_parent_data(pattern_results, query, parent_name);
                    // Works with copy of level parent data
                    data_parent = JSON.parse(JSON.stringify(data_base_levels[level]));
                }
                // Higher level parent data, must be filtered matching valid son's results
                else {
                    let data_base = data_parent;
                    let data_parent_levels = Retracements.get_parent_data(pattern_results, query, parent_name);
                    // Works with copy of level parent data
                    data_parent = JSON.parse(JSON.stringify(data_parent_levels[level]));

                    let fields = [];
                    if(filter_params.fields_data_content) filter_params.fields_data_content.forEach( f => fields.push(query[f]) );
                    if(filter_params.fields_data) filter_params.fields_data.forEach( f => fields.push(f) );
                    data_parent = Retracements.filter(data_parent,
                                                      data_base,
                                                      fields,
                                                      filter_params.fields_ref);
                }
                // Updates current data query (next parent if exist)
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


    /**
     * get_projected_retracement_limits: Get retracement limits projected from another movement
     * @param {*} params { parent, movement, retmax, retmin, trend_sign, levels_from }
     * @param parent Parent movement information.
     * @param movement Current analized movement information.
     * @param retmax Current max retracement value for parent movement.
     * @param retmin Current min retracement value for parent movement.
     * @param trend_sign Stored equivalent trend sign, based on first pattern.
     * @param levels_from Point from movement, where retracement starts: [ init | end | correction ].
     * @returns Object with { ret_max, value_max, ret_min, value_min, (TimePrice)init, (TimePrice)end } values.
     */
    static get_projected_retracement_limits(params) {
        let ret_max;
        let ret_min;
        let value_max;
        let value_min;
        let init;
        let end;
        try {
            let parent = params.parent;
            let mov = params.movement;
            ret_max = params[Const.RET_MAX_ID];
            ret_min = params[Const.RET_MIN_ID];
            let trend_sign = params.trend_sign;
            let levels_from = params.levels_from;
            
            if(Math.abs(ret_max) != Infinity) {
                value_max = parent[Const.END_ID].price - (parent[Const.DELTA_INIT_ID] * ret_max);
                let new_delta_end_max = (value_max - mov[Const.END_ID].price);
                ret_max = ((new_delta_end_max * mov[Const.TREND_ID]) < 0) ?
                                    Math.abs(new_delta_end_max / mov[Const.DELTA_INIT_ID]) : 0;
            }
            if(Math.abs(ret_min) != Infinity) {
                value_min = parent[Const.END_ID].price - (parent[Const.DELTA_INIT_ID] * ret_min);
                let new_delta_end_min = (value_min - mov[Const.END_ID].price);
                ret_min = ((new_delta_end_min * mov[Const.TREND_ID] * trend_sign) < 0) ?
                                    Math.abs(new_delta_end_min / mov[Const.DELTA_INIT_ID]) : 0;
            }
            
            if(levels_from == Const.END_ID) {
                let ret_min_tmp = (Math.abs(ret_max) == Infinity) ? 0 : ret_max;
                ret_max = (Math.abs(ret_min) == Infinity) ? 0 : ret_min;
                ret_min = ret_min_tmp;
            }

            init = parent[Const.INIT_ID];
            end = parent[Const.END_ID];
        }
        catch(error) {
            let msg = `ERROR: @Retracements::get_parent_retracement_limits: ${error}.`;
            console.error(msg);
            throw(msg);
        }

        return { ret_max, value_max, ret_min, value_min, init, end };
    }


    /**
     * process_iteration: Searches movements that matches retracement restrictions specified, mergin availables movements.
     * @param {*} params { start_movement, source, start_idx, ret_max, ret_min, iterations, from, trend_sign }
     * @param start_movement Base start movement, from where iteration starts.
     * @param source Movements data source array, starting with next to start movement.
     * @param ret_max Maximum retracement allowed.
     * @param ret_min Minimum retracement allowed.
     * @param iterations Number of max iterations (if restriction allows them).
     * @param from 'From' where movement is started, referenced from a parent source.
     * @param trend_sign Result ascendant trend sign.
     * @returns Object with { ok (matches with restriction) , nok (not matches restrictions) } arrays of movements.
     */
    static process_iteration(params) {
        let ok = [];
        let nok = [];
        try {
            let m = JSON.parse(JSON.stringify(params.start_movement));
            let source = params.source;
            let ret_max = params.ret_max;
            let ret_min = params.ret_min;
            let max_iter = params.iterations;
            let iter = 0;
            let end_fixed = (params.from == Const.END_ID) ? true : false;
            let trend_sign = (params.trend_sign < 0) ? Const.BEAR : Const.BULL;
            
            let ms = source.filter( mov => mov[Const.TREND_ID] == m[Const.TREND_ID]);
            let prev_ret = m[Const.RET_ID];

            for(let i = 0; (i < ms.length) && (iter < max_iter); i++, iter++) {
                // Merge with next movement
                let new_mov = Retracements.merge_movements(m, ms[i], trend_sign, end_fixed);

                //
                if(new_mov == null) {
                    break;
                }

                // If generated movement is diferent
                if(JSON.stringify(new_mov) != JSON.stringify(m)) {
                    //TODO EL LIMITE TAMBIEN SE TIENE QUE COMPROBAR POR EL MINIMO, RECORDAR QUE HACIA SI HABIA UNA CORRECCION POR DEBAJO DEL INICIO, PERO NO ERA FINAL DEL MOVIMIENTO
                    //TODO SE DESPLAZABA EL INICIO DEL MOVIMIENTO
                    
                    // Updates hash id for family results
                    Retracements.increment_hash(new_mov);
                    
                    // Check retracement restrictions
                    let check = ((new_mov[Const.RET_ID] >= ret_min) && (new_mov[Const.RET_ID] <= ret_max));
                    if( (check == false) || (prev_ret > new_mov[Const.RET_ID]) ) {
                        nok.push(new_mov);
                        if(new_mov[Const.RET_ID] > ret_max) break;
                    }
                    else { ok.push(new_mov); }
                    m = new_mov;
                }
            }
        }
        catch(error) {
            let msg = `ERROR: @Retracements::process_iteration: ${error}.`;
            console.log(msg);
            throw(msg);
        }

        return { ok, nok };
    }


    /**
     * merge_movements: Merges 2 movements, taking greater END and lower CORRECTION for BULL movement (and inverse for BEAR).
     * @param {*} m1 Base movement from where is started.
     * @param {*} m2 Second movement, from where END and CORRECTION are checked to merge them.
     * @param {*} trend_sign Result ascendant trend sign.
     * @param {*} end_fixed true: Fixes 'end' timestamp of new movement.
     * @returns New merged resulting movement, with posible new END, CORRECTION, DELTA_INIT, DELTA_END and RETRACEMENT values.
     * Returns null if error movement: null values or new INIT-END gives new movement.
     */
    static merge_movements(m1, m2, trend_sign = 1, end_fixed = false) {
        let new_mov = JSON.parse(JSON.stringify(m1));

        // TODO ? RESTRINGIR TODOS LOS NULL ?
        // First check no null values in movements
        if( (m1[Const.INIT_ID].price != null) &&
        (m2[Const.INIT_ID].price != null) &&
        (m1[Const.END_ID].price != null) &&
        (m2[Const.END_ID].price != null) &&
        (m1[Const.CORRECTION_ID].price != null) &&
        (m2[Const.CORRECTION_ID].price != null) )
        {
            let init_lower = ( ( (m2[Const.INIT_ID].price - new_mov[Const.INIT_ID].price) * new_mov[Const.TREND_ID] * trend_sign) < 0);
            let end_greater = ( ( (m2[Const.END_ID].price - new_mov[Const.END_ID].price) * new_mov[Const.TREND_ID] * trend_sign) > 0);
            let correction_lower = ( ( (m2[Const.CORRECTION_ID].price - new_mov[Const.CORRECTION_ID].price) * new_mov[Const.TREND_ID] * trend_sign) < 0);

            // BULL: init< / BEAR: init>
            if(init_lower) {
                // BULL: end< / BEAR: end>
                if(!end_greater) {
                    // BULL: correction< / BEAR: correction>
                    if(correction_lower) {
                        new_mov[Const.CORRECTION_ID] = m2[Const.CORRECTION_ID];
                        new_mov[Const.DELTA_END_ID] = new_mov[Const.CORRECTION_ID].price - new_mov[Const.END_ID].price;
                        new_mov[Const.RET_ID] = new_mov[Const.DELTA_END_ID] / new_mov[Const.DELTA_INIT_ID];
                        if(new_mov[Const.RET_ID] > 0) {
                            new_mov = null;
                        }
                        else {
                            new_mov[Const.RET_ID] = Math.abs(new_mov[Const.RET_ID]);
                        }
                    }
                    // No valid new movement
                    else { new_mov = null; }
                }
                // No valid new movement
                else { new_mov = null; }
            }
            // BULL: init>= / BEAR: init<=
            else {
                // BULL: end> / BEAR: end<
                if(end_greater) {
                    if(end_fixed) {
                        new_mov = null;
                    }
                    else {
                        new_mov[Const.END_ID] = m2[Const.END_ID];
                        new_mov[Const.CORRECTION_ID] = m2[Const.CORRECTION_ID];
                        new_mov[Const.DELTA_INIT_ID] = new_mov[Const.END_ID].price - new_mov[Const.INIT_ID].price;
                        new_mov[Const.DELTA_END_ID] = new_mov[Const.CORRECTION_ID].price - new_mov[Const.END_ID].price;
                        new_mov[Const.RET_ID] = new_mov[Const.DELTA_END_ID] / new_mov[Const.DELTA_INIT_ID];
                        if(new_mov[Const.RET_ID] > 0) {
                            new_mov = null;
                        }
                        else {
                            new_mov[Const.RET_ID] = Math.abs(new_mov[Const.RET_ID]);
                        }
                    }
                }
                // BULL: end< / BEAR: end>
                else {
                    new_mov[Const.CORRECTION_ID] = m2[Const.CORRECTION_ID];
                    new_mov[Const.DELTA_END_ID] = new_mov[Const.CORRECTION_ID].price - new_mov[Const.END_ID].price;
                    new_mov[Const.RET_ID] = new_mov[Const.DELTA_END_ID] / new_mov[Const.DELTA_INIT_ID];
                    if(new_mov[Const.RET_ID] > 0) {
                        new_mov = null;
                    }
                    else {
                        new_mov[Const.RET_ID] = Math.abs(new_mov[Const.RET_ID]);
                    }
                }
            }
        }
        else {
            new_mov = null;
        }

        return new_mov;
    }


    /**
     * filter_max_movements_
     * @param source Data source to be filtered.
     * @param type Tipe of filter: { Const.ONLY_MAX_MOVEMENT | Const.ONLY_MAX_RETRACEMENT }.
     * @returns source with data filtered.
     */
    //TODO NO FILTRA BIEN LOS MÁXIMOS MOVIMIENTOS BAJISTAS
    static filter_max_movements_(source, type) {
        console.time('filter_max');
        //TODO Para cada instante de las correcciones (comenzando por la última)
        let max_filtered = [];
        let total_len = source.length;
        let last_idx = total_len - 1;
        let ok = 0;
        while(last_idx > 0) {
            // Select all retracements which ends at same time that current correction
            let corr_current = source.filter(m => m[Const.CORRECTION_ID].time == source[last_idx][Const.CORRECTION_ID].time);

            // If more than 1 result, max filter can be applied
            if(corr_current.length > 1) {
                let corr_curr_time = corr_current.reduce( (a, b) => (a[Const.CORRECTION_ID].time > b[Const.CORRECTION_ID].time) ? a : b );
                corr_curr_time = corr_curr_time[Const.CORRECTION_ID].time;

                // From current correction, selects first init time
                let init_current_time = corr_current.reduce( (a, b) => a[Const.INIT_ID].time < b[Const.INIT_ID].time ? a : b);
                init_current_time = init_current_time[Const.INIT_ID].time;

                // Select all retracements with init time equal or after current init (and correction equal or before to current correction)
                let group_curr = source.filter(m => (m[Const.INIT_ID].time >= init_current_time) && (m[Const.CORRECTION_ID].time <= corr_curr_time) );

                // Deletes from source, all involved data in group
                source = source.filter( m => group_curr.includes(m) == false );

                // Get max
                if(type == Const.ONLY_MAX_MOVEMENT) {
                    // From this group, greater movement
                    group_curr = group_curr.reduce( (prev, curr) => {
                        let max_prev = Math.abs(prev[Const.DELTA_INIT_ID]) + Math.abs(prev[Const.DELTA_END_ID])
                        let max_curr = Math.abs(curr[Const.DELTA_INIT_ID]) + Math.abs(curr[Const.DELTA_END_ID])
                        if(max_prev > max_curr) return prev;
                        return curr;
                    });
                }
                else if(type == Const.ONLY_MAX_RETRACEMENT) {
                    // From this group, greater retracement
                    group_curr = group_curr.reduce( (prev, curr) => (prev[Const.RET_ID] > curr[Const.RET_ID]) ? prev: max_curr);
                }
                max_filtered.push(group_curr);
            }
            
            // If length hasn't changed, decrements iterator index ...
            if(source.length == total_len) {
                last_idx--;
                ok++;
            }
            // ... else, restart from last, with modified data source
            else {
                total_len = source.length;
                last_idx = total_len - 1 - ok;
            }
        }
        console.timeEnd('filter_max');
        return max_filtered;
    } // filter_max_movements_

    /**
     * filter_max_movements
     * @param source Data source to be filtered.
     * @param type Tipe of filter: { Const.ONLY_MAX_MOVEMENT | Const.ONLY_MAX_RETRACEMENT }.
     * @returns source with data filtered.
     */
    //TODO NO FILTRA BIEN LOS MAXIMOS MOVIMIENTOS BAJISTAS
    static filter_max_movements(source, type) {
        console.time('filter_max');
        let total_len = source.length;
        let idx = 0;
        while(idx < total_len) {
                                                    //TODO ENER EN CUENTA LA TENDENCIA !!!!!
            // Get first init current time
            let init_current_time = source[idx][Const.INIT_ID].time;
            let trend_current = source[idx][Const.TREND_ID];

            // Select all retracements which starts at same time that current init with same trend
            let init_current = source.filter( m => (m[Const.INIT_ID].time == init_current_time) && (m[Const.TREND_ID] == trend_current) );

            // Get last correction instant for all movements that start at same time
            let corr_current_time = init_current.reduce( (a, b) => (a[Const.CORRECTION_ID].time > b[Const.CORRECTION_ID].time) ? a : b );
            corr_current_time = corr_current_time[Const.CORRECTION_ID].time;

            // Select all retracements with init time equal or after current init (and correction equal or before to current correction), and same trend
            let group_current = source.filter(m => (m[Const.INIT_ID].time >= init_current_time)
                                                    && (m[Const.CORRECTION_ID].time <= corr_current_time)
                                                    && (m[Const.TREND_ID] == trend_current) );

            // If more than 1 result, max filter can be applied
            if(group_current.length > 1) {
                // Delete from source current movement group
                // source.splice(idx, group_current.length);
                source = source.filter( m => group_current.includes(m) == false);

                // Get max
                if(type == Const.ONLY_MAX_MOVEMENT) {
                    // From this group, greater movement
                    group_current = group_current.reduce( (prev, curr) => {
                        let max_prev = Math.abs(prev[Const.DELTA_INIT_ID]) + Math.abs(prev[Const.DELTA_END_ID])
                        let max_curr = Math.abs(curr[Const.DELTA_INIT_ID]) + Math.abs(curr[Const.DELTA_END_ID])
                        if(max_prev > max_curr) return prev;
                        return curr;
                    });
                }
                else if(type == Const.ONLY_MAX_RETRACEMENT) {
                    // From this group, greater retracement
                    group_current = group_current.reduce( (prev, curr) => (prev[Const.RET_ID] > curr[Const.RET_ID]) ? prev: curr);
                }

                // Re-insert filtered max
                source.splice(idx, 0, group_current);

                // Update current total length
                total_len = source.length;
            }
            
            idx++;
        }
        console.timeEnd('filter_max');
        return source;
    } // filter_max_movements


    /**
     * append_hash: Appends hash count identificator, to family results.
     * @param {*} m Movement.
     */
     static append_hash(m) {
        m[Const.HASH_ID] = m[Const.HASH_ID] + Const.HASH_SEP_STR + 0;
    }


    /**
     * increment_hash: Increments last hash count id, to be used as familiy results identification. Append first if not created
     * @param {*} m Movement.
     */
    static increment_hash(m) {
        let hash = m[Const.HASH_ID];
        let hash_values = hash.split(Const.HASH_SEP_STR);
        if(hash_values.length <= 1) {
            hash = hash + Const.HASH_SEP_STR + 0;
        }
        else {
            let hash_count = parseInt(hash_values[hash_values.length - 1]);
            hash_values[hash_values.length - 1] = '' + (++hash_count);
            hash = hash_values.reduce( (a, b) => a + Const.HASH_SEP_STR + b);
        }
        m[Const.HASH_ID] = hash;
    }


    static toString(m) {
        return `${m[Const.HASH_ID]} ► ${new Date(m[Const.INIT_ID].time).toLocaleString()}(${m.init.price}) | ${new Date(m[Const.END_ID].time).toLocaleString()}(${m.end.price}) | ${new Date(m[Const.CORRECTION_ID].time).toLocaleString()}(${m.correction.price}) | ${m.retracement.toFixed(3)} | ${m.trend}`
    }
}

