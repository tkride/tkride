

/** 'retracementsAnalysis.js' */

class RetracementAnalysisData extends AnalysisData_ {
    levels = {};
    onlymax = 0;
    levelsDataSourceName;
    levelsDataSource;
    // limitMin = -Infinity;
    // limitMax = Infinity;
}


class RetracementsAnalysis extends Analysis_ {

    //----------------------------- STATIC, CONSTANTS -----------------------------

    //----------------------------- STATIC, CONSTANTS -----------------------------

    iterator = {};
    iteratorMovement = {};
    iteratorIterate = {};
    request = {};
    model = {};
    patterns = {};
    levelData = {};
    movData = {};
    // Generators
    // Data post process
    postProcessMethods = [];


    //----------------------------- CONSTRUCTOR -----------------------------
    constructor() {
        super();
        this.postProcessMethods = [this.sort, this.filterResults, this.calculateRetracementLevels];
    }


    //----------------------------- PUBLIC METHODS -----------------------------

    // process({request, model, patterns}) {
    process({request, model}) {
        this.model = model[request.modelKey];
        this.patterns = model.patterns;
        let ok = {};
        let nok = {};
        console.log(`${this.constructor.name}-${request[Const.ID_ID]}--------------`);
        console.time(`${this.constructor.name}-${request[Const.ID_ID]}`);
        try {
            this.request = this.parseRequest(request);
            this.prepareData();
            this.#buildIterators();
            let flag = false;
            let i = 0;
            let level = 0;

            // Iterates over each movement from each level
            console.time(`${this.constructor.name}-iterator`);
            for(let movement of this.iterator()) {
                try {
                    if(flag) console.log('(',i++, ') ► ', movement);
                    // If movement is valid
                    if(movement) {
                        // If level changed
                        if(movement.level != undefined) {
                            level = movement.level;
                            ok[level] = [];
                            nok[level] = [];
                        }
                        else {
                            // Validates current iterator data as OK / NOK
                            if (RetracementsAnalysis.validate({movement, limitMax: this.request.limitMax, limitMin: this.request.limitMin})) {
                                ok[level].push(movement);
                            }
                            else {
                                nok[level].push(movement);
                            }
                        }
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            console.timeEnd(`${this.constructor.name}-iterator`);
            
            console.time(`${this.constructor.name}-post process`);
            this.applyPostProcess(ok);
            this.applyPostProcess(nok);
            console.timeEnd(`${this.constructor.name}-post process`);
            
            
            console.time(`${this.constructor.name}-report`);
            this.report({ok, nok});
            console.timeEnd(`${this.constructor.name}-report`);

            console.time(`${this.constructor.name}-store`);
            this.store({ok, nok});
            console.timeEnd(`${this.constructor.name}-store`);
        }
        catch(error) {
            ret.error = `${error}.`;
            console.error(ret.error);
        }
        console.timeEnd(`${this.constructor.name}-${request[Const.ID_ID]}`);
        return this.request;
    }

    /**
     * parseRequest
     * @abstract Parses request into valid values to perform analisys.
     * @param request Base request.
     * @returns 
     */
    parseRequest(request) {
        let ret = new RetracementAnalysisData();
        try {
            ret = Object.assign(new RetracementAnalysisData(), super.parseRequest(request));
            ret.iterate = (ret.iterate != undefined) ? parseInt(ret.iterate) : 0;
            ret.onlymax = (ret.onlymax != undefined) ? ret.onlymax : 0;
            ret.filtermode = (ret.filtermode != undefined) ? ret.filtermode : Const.FILTER_INTERVAL;
            ret.datatype = RetracementAnalysisData.name;

            // let { until_ref } = this.getComparisonFields(ret[Const.FROM_ID]);
            // ret[Const.UNTIL_ID] = until_ref;

            // ret[Const.SEARCH_IN_DATA_ID] = JSON.parse(JSON.stringify(models[Const.PATTERN_RESULTS_ID][ret[Const.SEARCH_IN_ID]]));

            //Set requested level
            // ret[Const.LEVEL_ID] = (ret[Const.LEVEL_ID])
                                    // ? (parseInt(ret[Const.LEVEL_ID])-1)
                                    // : 0;

            // Process levels (may contain logical operators '>', '<')
            let levels = ret.levels.split(/[\s,]+/);
            ret.levels = levels.map( (l, i) => {
                ret.logical = l.replace(/[.0-9]+/, '');
                let value = l.replace(/[<>]+/, '');
                value = parseFloat(value);
                return value;
            });

            if(ret.logical == Const.LOGICAL_LOWER_THAN) {
                ret.limitMax = Math.max(...ret.levels);
                ret.limitMin = -Infinity;
            }
            else if(ret.logical == Const.LOGICAL_HIGHER_THAN) {
                ret.limitMax = Infinity;
                ret.limitMin = Math.min(...ret.levels);
            }
            else {
                ret.limitMin = Math.min(...ret.levels);
                ret.limitMax = Math.max(...ret.levels);
            }

            // Store model information by reference
            // ret.model = this.model; //request[Const.MODEL_ID];
            // ret.patterns = this.patterns; //request[Const.PATTERNS_ID];
            // ret[Const.MODEL_KEY_ID] = request[Const.MODEL_KEY_ID];

            let { untilRef, fromNew, untilNew } = RetracementsAnalysis.getComparisonFields(ret.from);
            ret.until = untilRef;
            ret.fromSearch = fromNew;
            ret.untilSearch = untilNew;
            // ret.until = untilNew;
            // ret.untilSearch = untilRef;
            
            // Get query fields
            console.time('parseRequest-query stringify');
            ret.query = JSON.parse(JSON.stringify(ret,
                                        (k,v) => (v == Infinity) ? "Infinity" : v),
                                    (k, v) => (v == "Infinity") ? Infinity : v);

            console.timeEnd('parseRequest-query stringify');
        }
        catch (error) {
            ret.error = `${error}.`;
            console.error(ret.error);
        }
        return ret;
    }

    /**
     * prepareData
     * @abstract Check data availability, and collect it into data structure
     */
    prepareData() {
        try {
            let level = this.request.level;

            // Deep copy to keep source data unaltered
            this.request.sourceData = JSON.parse(JSON.stringify(this.model.movs.data[level]));
            
            // copy parent pattern results if needed, or throw exception if don't exists
            if(this.request.searchin) {
                let searchInModel = RetracementsAnalysis.#getParentData({patternResults: this.model.patternResults,
                                                                        query: this.request.query,
                                                                        finalParent: this.request.searchin});
                this.request.searchInData = searchInModel
                                        ? JSON.parse(JSON.stringify(searchInModel[level]))
                                        : undefined;
                // If no parent source data available, calls recursively process
                if(this.request.searchInData == undefined) {
                    throw msg(`ERROR: No parent result data found for: ${this.request.searchin}.`);
                }

                try {
                    // Filters data from reference parent results (searchInData)
                    this.request.sourceData = RetracementsAnalysis.filter({ r1: this.request.sourceData,
                                                                            r2: this.request.searchInData,
                                                                            f1: [this.request.untilSearch],
                                                                            f2: [this.request.until],
                                                                            compareHash: false });
                    
                    // Build real movement, based on result (results obtained from iteration, may not fit with regular movements)
                    this.request.sourceData = RetracementsAnalysis.#buildSonMovements({parent: this.request.searchInData,
                                                                                        data: this.request.sourceData,
                                                                                        request: this.request});

                    // TODO LA DIFERENCIA ENTRE TENDENCIAS DEL PADRE AL HIJO, HACE QUE SE DEBA BUSCAR DESDE end O init. CAMBIAR PARA DESACOPLAR ESTA PARTE DEL CÓDIGO
                    // Assign parent pattern trend, depending of search from values
                    this.request.trendSign = RetracementsAnalysis.#getFamilyTrend({model: this.model.patternResults, request: this.request});

                    if(this.request.trendSign == Const.TREND_CHANGE) {
                        let i = 0;
                        while(i < this.request.sourceData.length) {
                            this.request.sourceData[i].trend *= Const.TREND_CHANGE;
                            i++;
                        }
                    }
                }
                catch(err) {
                    console.error(err);
                    throw(err);
                }
            }

            // If limits defined in another pattern result, get it
            if(this.request.levelsDataSourceName) {
                this.request.levelsDataSource = this.#filterParentData({
                                                    patternResults: this.model.patternResults,
                                                    query: this.request.query,
                                                    finalParent: this.request.levelsDataSourceName,
                                                    filterParams: {
                                                        dataLevel: level,
                                                        dataRef: this.request.sourceData, // mov_source,
                                                        fieldsDataContent: [Const.FROM_ID, Const.UNTIL_ID],
                                                        // fieldsData: [Const.TREND_ID],
                                                        fieldsRef: [Const.INIT_ID, Const.END_ID] //, Const.TREND_ID]
                                                    },
                });
                if(this.request.levelsDataSource.length === 0) {
                    throw(`ERROR: no parent results in ${this.request.searchin} matches limits defined for ${this.request.ID}.`)
                }
                // Get levels relative trend to source data
                let levelsRequest = this.patterns[this.request.levelsDataSourceName];
                if(levelsRequest == undefined) {
                    throw(`ERROR: No levels request with name ${this.request.levelsDataSourceName} stored in patterns database.`)
                }
                let levelsTrend = RetracementsAnalysis.#getFamilyTrend({request: levelsRequest,  model: this.model.patternResults});
                this.request.levelsTrend = levelsTrend * this.request.trendSign;
            }
        }
        catch (error) {
            this.req.error = `${error}`;
            console.error(this.req.error);
        }
    }

    /**
     * checkStop
     * @abstract Check if movement retracement meets stop condition defined in request.
     * @param movement Movement information.
     * @param limitMax Maximum retracement allowed before stop processing.
     * @returns true: if stop condition match. false: other case.
     */
    static checkStop({movement, limitMax}) {
        let stop = true;
        try {
            if(limitMax === undefined) {
                throw (`RetracementsAnalysis::checkStop: Retracement limit mimssing. Cannot evaluate.`);
            }
            
            stop = (movement.retracement > limitMax);
        }
        catch (error) {
            throw (error);
        }

        return stop;
    }

    /**
     * validate
     * @abstract Validates retracement pattern condition in given movement.
     * @param movement Source movement data. Overwrites data, appends 'levels' property to object.
     * @param limitMax Maximum retracement limit allowed.
     * @param limitMin Minimum retracement limit allowed.
     * @returns true: retracement matches validation condition. false: other case.
     */
    static validate({movement, limitMax, limitMin}) {
        let ok = false;
        try {
            if((movement.limitMax != undefined) && (movement.limitMin != undefined)) {
                [limitMax, limitMin] = [movement.limitMax, movement.limitMin];
            }

            if((limitMin === undefined) || (limitMax === undefined)) {
                throw (`RetracementsAnalysis::validate: Retracement limit missing. Cannot evaluate.`);
            }
            // Append retracement levels item list
            if(!movement.levels) {
                movement.levels = {};
            }
            ok = ((movement.retracement >= limitMin) && (movement.retracement <= limitMax));
        }
        catch (error) {
            throw (error);
        }
        return ok;
    }

    /**
     * applyPostProcess
     * @abstract Apply post process procedures for result data, in same order as defined in @constructor.
     * @ Sort data by timestamp.
     * @ Filter:
     * @    Filter.type: only maximum retracement or movement.
     * @    Filter.mode: family or interval.
     * @ Calculate retracement levels prices.
     * @param data 
     * @returns data with all defined post process applied. Overwrites source data.
     */
     applyPostProcess(data) {
         try {
             this.postProcessMethods.forEach( p => p.call(this, data));
         }
         catch (error) {
             console.error(error);
         }
    }

    /**
     * sort.
     * Sorts data by timestamp.
     * @param data Source data to be sorted.
     * @returns data sorted. Overwrites source data.
     */
    sort(data) {
        try {
            // Object.values(data).forEach( d => d.sort()); // Do not modifies object!
            Object.keys(data).forEach( k => data[k].sort());
        }
        catch (error) {
            console.error(error);    
        }
    }

    /**
     * filterResults
     * @abstract Applies post processing filter to results.
     * @param data Source data to be filtered.
     * @ type Filter type: maximum movement, or maximum retracement.
     * @ mode Family: filter grouping by result family. Interval: filters grouping by time interval.
     * @retruns data filtered. Overwrites source data.
     */
    filterResults(data) {
        try {
            let type = this.request.onlymax;
            if(type > 0) {
                let mode = this.request.filtermode;
                console.log(`Apply filter ► type: ${type},  mode: ${mode}.`);

                Object.keys(data).forEach( k => {
                    console.time('filterResults');
                    let dataLen = data[k].length;
                    let idx = 0;
                    mode = (mode != undefined) ? mode : Const.FILTER_INTERVAL;
                    while(idx < dataLen) {
                        // Get first init current time
                        // let init_current_time = source[idx][Const.INIT_ID].time;
                        let initTime = data[k][idx].timestamp;
                        let trend = data[k][idx].trend;
                        let group = [];

                        // Select all retracements which starts at same time that current init with same trend
                        let init = data[k].filter( m => (m.timestamp == initTime) && (m.trend == trend) );

                        if(init.length > 1) {
                            // Get last correction instant for all movements that start at same time
                            let correctionTime = init.reduce( (a, b) => (a.correction.time > b.correction.time) ? a : b );
                            correctionTime = correctionTime.correction.time;

                            group = data[k].filter(m => {
                                let res = (mode == Const.FILTER_FAMILY) ?
                                            (m.timestamp == initTime)
                                            : (m.timestamp >= initTime);
                                res &= (m.correction.time <= correctionTime)
                                        && (m.trend == trend);
                                return res;
                            });

                            // If more than 1 result, max filter can be applied
                            if(group.length > 1) {
                                // Delete from source current movement group
                                // source.splice(idx, group_current.length);
                                data[k] = data[k].filter( m => group.includes(m) == false);

                                // Get max
                                if(type == Const.ONLY_MAX_MOVEMENT) {
                                    // From this group, greater movement
                                    group = group.reduce( (prev, curr) => {
                                        let max_prev = Math.abs(prev.deltainit) + Math.abs(prev.deltaend)
                                        let max_curr = Math.abs(curr.deltainit) + Math.abs(curr.deltaend)
                                        if(max_prev > max_curr) return prev;
                                        return curr;
                                    });
                                }
                                else if(type == Const.ONLY_MAX_RETRACEMENT) {
                                    // From this group, greater retracement
                                    group = group.reduce( (prev, curr) => (prev.retracement > curr.retracement) ? prev: curr);
                                }

                                // Re-insert filtered max
                                data[k].splice(idx, 0, group);

                                // Update current total length
                                dataLen = data[k].length;
                            }
                        } // if(init.length > 1)
                        
                        idx++;
                    } // while(idx < dataLen)
                    console.timeEnd('filterResults');
                });
            } // if (type > 0)
        }
        catch (error) {
            console.error(error);    
        }
        // return data;
    }

    /**
     * calculateRetracementLevels
     * @abstract Add retracement levels into each movement, and calculates them prices values.
     * @param data Source data where include calculated retracement levels and prices.
     * @retruns data with retracement levels-prices. Overwrites source data.
     */
    calculateRetracementLevels(data) {
        try {
            let retLevels = this.request.levels;
            if(!retLevels) { throw ('Retracement levels not defined')}
            Object.values(data)
            .forEach( d =>
                d.map( v => {
                    if(Object.keys(v.levels).length == 0) {
                        retLevels.forEach( l => v.levels[l] = v.end.price - (v.deltainit * l));
                    }
                })
            );
        }
        catch (error) {
            console.error(error);    
        }
    }
    
    /**
     * store
     * @abstract Stores result data in DTO structure (this.request).
     * @param ok Ok source data to be stored.
     * @param nok Not ok source data to be stored.
     */
    store({ok, nok}) {
        try {
            this.request.data = ok;
            this.request.nok = nok;
        }
        catch (error) {
            console.error(error);
            
        }
    }

    /**
     * report
     * @abstract Generate results statistics and stores it in DTO structure (this.request).
     * @param ok Ok data result.
     * @param nok Not ok data result.
     * @
     */
    report({ok, nok}) {
        try {
            console.log('@report: generate result statistics.');
            let levels = Object.keys(ok);
            // Get parent stats results if exists
            let searchInModel = this.model.patternResults[this.request.searchin];
            // if(!searchInModel) {
                // searchInModel = this.request;
            // }
            levels.forEach( l => {
                let stats = RetracementsAnalysis.#getStats({ok: ok[l], nok: nok[l], searchInModel});
                if(!this.request.stats[l]) {
                    this.request.stats[l] = [];
                }
                this.request.stats[l].push(...stats);
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    /**
     * getComparisonFields: Get fields to be compared, based on truth table build from 'from' field.
     * @param {*} from 'from' field from query.
     * @returns Object { fromRef, untilRef, fromNew, untilNew }
     */
     static getComparisonFields(from) {
        let untilRef;
        let untilNew;
        let fromRef;
        let fromNew;
        if(from == Const.INIT_ID) {
            fromRef = Const.INIT_ID;
            untilRef = Const.END_ID;
            fromNew = Const.INIT_ID;
            untilNew = Const.END_ID;
        }
        else if(from == Const.END_ID) {
            fromRef = Const.END_ID;
            untilRef = Const.CORRECTION_ID;
            fromNew = Const.INIT_ID;
            untilNew = Const.END_ID;
        }
        else if(from == Const.CORRECTION_ID) {
            fromRef = Const.CORRECTION_ID;
            untilRef = Const.CORRECTION_ID;
            fromNew = Const.INIT_ID;
            untilNew = Const.INIT_ID;
        }
        return { fromRef, untilRef, fromNew, untilNew };
    }

    /**
     * calcProjectedRetracementLimits
     * @abstract Get retracement limits projected from another movement.
     * @param levelMovement Level datas source movement information.
     * @param movement Current analized movement information. Appends
     * @param limitMax Current max retracement value for parent movement.
     * @param limitMin Current min retracement value for parent movement.
     * @param levelsTrend Levels trend sign.
     * @returns [limitMax, limitMin]
     */
     static calcProjectedRetracementLimits({levelMovement, movement, limitMax, limitMin, levelsTrend}) {
        let valueMax;
        let valueMin;
        try {
            if(Math.abs(limitMax) != Infinity) {
                valueMax = levelMovement.end.price - (levelMovement.deltainit * limitMax);
                let deltaEnd = (valueMax - movement.end.price);
                limitMax = ((deltaEnd * movement.trend * levelsTrend) > 0) ?
                                    Math.abs(deltaEnd / movement.deltainit) : 0;
            }
            if(Math.abs(limitMin) != Infinity) {
                valueMin = levelMovement.end.price - (levelMovement.deltainit * limitMin);
                let deltaEnd = (valueMin - movement.end.price);
                limitMin = ((deltaEnd * movement.trend * levelsTrend) > 0) ?
                                    Math.abs(deltaEnd / movement.deltainit) : 0;
            }

            if(levelsTrend == Const.TREND_CHANGE) {
                let retMinTmp = (Math.abs(limitMax) == Infinity) ? 0 : limitMax;
                limitMax = (Math.abs(limitMin) == Infinity) ? 0 : limitMin;
                limitMin = retMinTmp;
            }

            movement.limitMax = limitMax;
            movement.limitMin = limitMin;
        }
        catch(error) {
            throw(`ERROR: @RetracementsAnalysis::calcProjectedRetracementLimits: ${error}.`);
        }
        return [limitMax, limitMin];
    }

    /**
     * calcProjectedRetracementLevels
     * @abstract Get retracement limits projected from another movement.
     * @param levelMovement Level datas source movement information.
     * @param movement Current analized movement information. Appends
     * @param levels Request retracement levels value for parent movement.
     * @param limitMax Current max retracement value for parent movement.
     * @param limitMin Current min retracement value for parent movement.
     * @param levelsTrend Levels trend sign.
     * @returns [limitMax, limitMin]
     */
     static calcProjectedRetracementLevels({levelMovement, movement, levels, limitMax, limitMin, levelsTrend}) {
        let price;
        try {
            movement.levels = {};
            let newLevels = [];
            levels.forEach( l => {
                let newLevel = l;
                if(Math.abs(l) != Infinity) {
                    price = levelMovement.end.price - (levelMovement.deltainit * l);
                    let deltaEnd = (price - movement.end.price);
                    newLevel = ((deltaEnd * movement.trend * levelsTrend) > 0) ?
                                        Math.abs(deltaEnd / movement.deltainit) : 0;
                }

                if(levelsTrend == Const.TREND_CHANGE) {
                    newLevel = (Math.abs(newLevel) == Infinity) ? 0 : newLevel;
                }
                newLevels.push(newLevel);
                movement.levels[l] = price;
            });
            
            if(Math.abs(limitMax) != Infinity) {
                // limitMax = Math.max(...Object.keys(movement.levels));
                limitMax = Math.max(...newLevels);
            }
            
            if (Math.abs(limitMin) != Infinity) {
                // limitMin = Math.min(...Object.keys(movement.levels));
                limitMin = Math.min(...newLevels);
            }

            movement.limitMax = limitMax;
            movement.limitMin = limitMin;
            return [limitMax, limitMin];
        }
        catch(error) {
            throw(`ERROR: @RetracementsAnalysis::calcProjectedRetracementLevels: ${error}.`);
        }
    }

    /**
     * filter: Filters data based in another source data, compairing specified fields.
     * @pre Sorted data
     * @param r1 Data to be filtered
     * @param r2 Filter reference
     * @param f1 Specific fields for r1. If omitted = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
     * @param f2 Specific fields comparison for r2. If omitted = f1.
     * @param compareHash true: Check hash id relationship matches. false: othercase. (Default value: true).
     * @param duplicates If set to true, may return duplicate movements in results. (Default value: false).
     * @returns Array r1 filtered with movs/retracements given in r2
     */
     static filter({r1, r2, f1, f2, compareHash = true, duplicates = false}) {
        if(!f1 || !f1.length) f1 = [Const.INIT_ID, Const.END_ID, Const.CORRECTION_ID];
        if(!f2 || !f2.length) f2 = f1;
         let res = [];
         try {
            r2.map(m2 => {
                // let idx;
                r1.map( (m1, j) => {
                    let checkRes = true;
                    for(let i = 0; i < f1.length; i++) {
                        let c1 = f1[i];
                        let c2 = f2[i];
                        if((c1 != undefined) && (c2 != undefined)) {
                            if((m1[c1].time != undefined) && (m1[c1].price != undefined)) {
                                if ((m2[c2].time != m1[c1].time) || (m2[c2].price) != m1[c1].price) {
                                    checkRes = false;
                                    break;
                                }
                            }
                            else if(m2[c2] != m1[c1]) {
                                checkRes = false;
                                break;
                            }
                        }
                    }

                    if(checkRes) {
                        if(compareHash) {
                            if(m1.hash.length > m2.hash.length) {
                                checkRes = m1.hash.includes(m2.hash);
                            }
                            else {
                                checkRes = m2.hash.includes(m1.hash);
                            }
                        }
                        if(checkRes) { res.push(m1); }
                    }
                });
            });
            
            res.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);

            if(!duplicates && (res.length > 1)) {
                res = res.filter( (m, i) => res.indexOf(m) === i);
            }
        }
        catch(error) {
            let msg = `${this.constructor.name}::filter: ${error}`;
            console.error(msg);
            throw(msg);
        }
        return res;
    }

    /**
     * mergeMovement
     * @abstract Merges 2 movements. Mergin rules are applied based on trend of first movement.
     * @param m1 Base start movement information.
     * @param m2 End movement information.
     * @param endFixed Fixed end point of movement. If new one cannot fit, ends iteration. Default value: true.
     * @param copy true: Works with copy of m1 object. false: overwrites m1 movement object. true if omitted.
     * @returns
     * @ New movement result of merging rules*: { value: merged, done: false }.
     * @ If m1 equals m2, returns { value: m1, done: false }.
     * @ If merging rules ends movement, returns { value: merged, done: true }.
     * @ If m1 or m2 are missing, returns { value: undefined, done: true }.
     */
    static mergeMovement({m1, m2, endFixed = true, copy = true}) {
        let m;
        let done = false;
        let valid = true;
        try {
            // Check both movements exists
            if(m1 && m2) {
                if(copy) { m = JSON.parse(JSON.stringify(m1)); }
                else { m = m1; }
                
                // m1 & m2 are different movements, apply merging
                if((m1.init.time != m2.init.time) || (m1.end.time != m2.end.time) || (m1.correction.time != m2.correction.time)) {
                    // Bull trend movements
                    let initGreater = (m1.init.price < m2.init.price);
                    let endGreater = (m1.end.price < m2.end.price);
                    let correctionGreater = (m1.correction.price < m2.correction.price);
                    // If bear trend
                    if (m.init.price > m.end.price) {
                        initGreater = !initGreater;
                        endGreater = !endGreater;
                        correctionGreater = !correctionGreater;
                    }

                    if(initGreater) {
                        if(endGreater) {
                            if(endFixed) {
                                done = true;
                            }
                            else {
                                m.end = m2.end;
                                m.correction = m2.correction;
                                m.deltainit = m.end.price - m.init.price;
                                m.deltaend = m.correction.price - m.end.price;
                            }
                        }
                        else {
                            if(correctionGreater) {
                                valid = false;
                            }
                            else {
                                m.correction = m2.correction;
                                m.deltaend = m.correction.price - m.end.price;
                            }
                        }
                    }
                    else {
                        if(endGreater) {
                            done = true;
                        }
                        else {
                            if(correctionGreater) {
                                valid = false;
                                // if(Math.abs(m2.deltainit) > Math.abs(m.deltainit)) {
                                    done = true;
                                // }
                            }
                            else {
                                m.correction = m2.correction;
                                m.deltaend = m.correction.price - m.end.price;
                            }
                        }
                    }
                    
                    if(m && valid) {
                        m.retracement = m.deltaend / m.deltainit;
                        if(m.retracement > 0) {
                            done = true;
                        }
                        else {
                            m.retracement = Math.abs(m.retracement);
                        }
                    }
                } // if m1 & m2 different movements
            }
            // At least 1 source movements is missing
            else {
                done = true;
            }

            if(done) {
                m = undefined;
            }
        }
        catch(error) {
            console.error(error);
        }
        return { value: m, valid: valid, done: done };
    }


    //----------------------------- PRIVATE METHODS -----------------------------
    
    /**
     * #processParentPattern
     * @abstract Process parent pattern.
     * @param request Base request to build parent request.
     */
     #processParentPattern(request) {
        try {
            let requestParent = JSON.parse(JSON.stringify(request.patterns[request.searchin]));
            // requestParent[Const.MODEL_KEY_ID] = request[Const.MODEL_KEY_ID];
            // Take data Models by reference
            // requestParent[Const.MODEL_ID] = request[Const.MODEL_ID];
            // requestParent[Const.MODEL_ID] = this.model;
            // requestParent[Const.PATTERNS_ID] = request[Const.PATTERNS_ID];
            // requestParent[Const.PATTERNS_ID] = this.patterns;
            let searchInModel = this.process({request: requestParent, model: this.model, patterns: this.patterns});
            this.model.patternResults[request.searchin] = searchInModel;
            // TODO NO DEBE HABER PROBLEMA EN TOMAR LA REFERENCIA, ESTOS DATOS NO SE DEBEN MODIFICAR EN EL ALGORITMO
            request.searchInData = searchInModel?.[Const.DATA_ID];
            if(!request.searchInData) throw(`Error obteniendo los datos: ${request.searchin}.`);
        }
        catch (error) {
            // throw(error);
            console.error(error);
        }
    }

    /**
     * #buildIterators
     * @abstract Generate all needed class iterators to perform sequential analysis.
     * @param this.iterator Member property to perfor iteration (this.iterator()) over all levels,
     * movements/retracements, and self movement iteration.
     */
    #buildIterators() {
        // Level data deep copy
        // let levelData = JSON.parse(JSON.stringify(this.model.movs.data));
        let levelData = JSON.parse(JSON.stringify(this.request.sourceData));
        let iterateEnd = this.request.iterate;

        // Iterate generator
        this.iteratorIterate = function* generatorIterate({idx = 0, movs}) {
            try {
                // If no iretation requested
                if(iterateEnd == 0) {
                    return movs[idx];
                }

                // Stores base movement
                let m = movs[idx];

                let limitMax = this.request.limitMax;
                let limitMin = this.request.limitMin;
                // If checks levels in external data
                let levelMovement = (this.request.levelsDataSource != undefined) ? this.request.levelsDataSource.filter( ld => m.hash.includes(ld.hash) )[0] : undefined;
                if(levelMovement) {
                    [limitMax, limitMin] = RetracementsAnalysis.calcProjectedRetracementLevels({levelMovement,
                                                                                                movement: m,
                                                                                                levels: this.request.levels,
                                                                                                limitMax: this.request.limitMax,
                                                                                                limitMin: this.request.limitMin,                                                                                               
                                                                                                levelsTrend: this.request.levelsTrend});
                }
                
                // Check if current movement is valid
                if(RetracementsAnalysis.checkStop({movement: m, limitMax})) {
                    return;
                }
                else {
                    yield m;
                }

                // Get all model movements
                let source = this.model.movs.data[this.request.level];
                // Finds the very next movement after current
                idx = source.findIndex( mov => (mov.init.time === m.correction.time) && (mov.init.price === m.correction.price) );

                // Iterates while idx < (idx + iterateEnd) or idx == end of data available.
                let count = iterateEnd;
                let len = Object.keys(source).length;
                for( ; (count > 0) && (idx < len); idx++, count--) {
                    let { value, valid, done } = RetracementsAnalysis.mergeMovement({m1: m, m2: source[idx]});
                    // Calculate projected levels if needed
                    if(levelMovement && value) {
                        [limitMax, limitMin] = RetracementsAnalysis.calcProjectedRetracementLevels({levelMovement,
                                                                                                    movement: value,
                                                                                                    levels: this.request.levels,
                                                                                                    limitMax: this.request.limitMax,
                                                                                                    limitMin: this.request.limitMin,
                                                                                                    levelsTrend: this.request.levelsTrend});
                    }
                    // Merging rules could end iteration process.
                    if(!done) {
                        // Not valid movements will not be processed (but may continue iteration process)
                        m = value;
                        if(valid) {
                            // Increment family result hash identification.
                            Analysis_.increment_hash(value);
// TODO AL ITERAR PATRON HIJO, NO TIENE EN CUENTA EL STOP DEL PADRE! UN TARGET PUEDE LLEGAR A ALARGAR EL PHY DEBAJO DEL STOP
// TODO AL FIJAR PUNTO end DEL MOVIMIENTO, ESTO NO PASA, PERO SI SE UTILIZA fixedEnd = false, HABRIA QUE PASAR LOS STOPS...DE MAS DE 1 PADRE?
                            if(RetracementsAnalysis.checkStop({movement: value, limitMax})) {
                                done = true;
                            }
                        }
                        else {
                            value = undefined;
                        }
                    }

                    if(done) {
                        return;
                    }
                    yield value;
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        // Movements generator
        this.iteratorMovement = function* generatorMovement(movs) {
            try {
                for(let idx = 0; idx < Object.keys(movs).length; idx++) {
                    yield* this.iteratorIterate({idx, movs});
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        // Level data generator
        this.iterator = function* generatorLevel() {
            try {
                // for(let idx = 0; idx < Object.keys(level).length; idx++) {
                for(let idx = 0; idx < (this.request.level+1); idx++) {
                    console.time('generatorMovement');
                    yield { level: idx };
                    // TODO ELIMINAR LOS NIVELES DEL ANALISIS DE RETROCESOS?
                    // yield* this.iteratorMovement(levelData[idx]);
                    yield* this.iteratorMovement(levelData);
                    console.timeEnd('generatorMovement');
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    /**
     * #buildIterators_
     * @abstract Generate all needed class iterators to perform sequential analysis.
     */
     #buildIterators_() {
        // Level data iterator
        let level = JSON.parse(JSON.stringify(this.request[Const.MODEL_ID][Const.MOVS_ID][Const.DATA_ID]));
        this.iterateLevel[Symbol.iterator] = () => {
            let done = false;
            let levelIdx = 0;
            this.levelData = {};
            return {
                next: () => {
                    if(levelIdx < Object.keys(level).length) {
                        this.levelData = level[levelIdx];
                    }
                    else {
                        this.levelData = {};
                        done = true;
                    }
                    levelIdx++;
                    return { value: this.levelData, done: done };
                }
            }
        }

        // Movements iterator
        this.iterateMovement[Symbol.iterator] = () => {
            let done = false;
            let movIdx = 0;
            this.movData = {};
            return {
                next: () => {
                    if(movIdx < Object.keys(this.levelData).length) {
                        this.movData = this.levelData[movIdx];
                    }
                    else {
                        this.movData = {};
                        done = true;
                    }
                    movIdx++;
                    return { value: this.movData, done: done };
                }
            }
        }

        if(this.request.iterate) {
            this.iterateIterator;
        }
    }

    /**
     * #filterParentData: filter parent data relative to current results.
     * @param patternResults Full model data.
     * @param query Query used to get current data results.
     * @param finalParent Final parent name to stop recursive search.
     * @param filterParams { dataLevel | dataRef | fieldsDataContent | fieldsData | fieldsRef }
     * @param filterParams.dataLevel Current movement results level o be analysed.
     * @param filterParams.dataRef Start source reference data. Current results from which search is done, and parent data must be matched.
     * @param filterParams.fieldsDataContent Current data query fields name to perform filter comparation. Ex. FROM, UNTIL, ...
     * @param filterParams.fieldsData Data fields to perform comparison. Ex. 'end', 'correction', 'trend', ...
     * @param filterParams.fieldsRef Reference parent data fields to perform filter comparation.
     * @returns Parent data.
     */
    #filterParentData({patternResults, query, finalParent, filterParams}) {
        let parentData;
        try {
            let dataRef = filterParams.dataRef;
            let level = filterParams.dataLevel;
            let parentName;

            do {
                // Get inmediate parent data
                parentName = query.searchin;

                // First parent data don't need to be filtered
                if(!parentData) {
                    let dataBaseLevels = RetracementsAnalysis.#getParentData({patternResults, query, finalParent: parentName});
                    // Works with copy of level parent data
                    parentData = JSON.parse(JSON.stringify(dataBaseLevels[level]));
                }
                // Higher level parent data, must be filtered matching valid son's results
                else {
                    let database = parentData;
                    let dataParentLevels = RetracementsAnalysis.#getParentData({patternResults, query, finalParent: parentName});
                    // Works with copy of level parent data
                    parentData = JSON.parse(JSON.stringify(dataParentLevels[level]));

                    let fields = [];
                    if(filterParams.fieldsDataContent) filterParams.fieldsDataContent.forEach( f => fields.push(query[f]) );
                    if(filterParams.fieldsData) filterParams.fieldsData.forEach( f => fields.push(f) );
                    // parentData = this.filterResults(parentData,
                    parentData = RetracementsAnalysis.filter({r1: parentData,
                                                              r2: database,
                                                              f1: fields,
                                                              f2: filterParams.fieldsRef});
                }
                // Updates current data query (next parent if exist)
                if(parentName) {
                    query = patternResults[parentName].query;
                }
                else query = undefined;
            } while(parentData && (parentName != finalParent));
        }
        catch(error) {
            let msg = `RetracementsAnalysis::#filterParentData: ${error}`;
            console.error(msg);
            throw(msg);
        }
        return parentData || [];
    }

    /**
     * #getParentData: Get parent data from query and model, stopping in final_parent given.
     * @throws Exception if non-existnts pattern name is found, or if current data is not descendant from parent name. Also for any unexpected operation exception.
     * @param {*} patternResults Full data model.
     * @param {*} query Query to build current base data.
     * @param {*} finalParent Parent data name where stop search.
     * @returns Parent data.
     */
    static #getParentData({patternResults, query, finalParent}) {
        let res;
        try {
            // Check is valid result AND parent of current base data
            let name = query.searchin;
            if(name && finalParent && RetracementsAnalysis.#checkPatternIsParent({patternResults, query, finalParent})) {
                while(name != finalParent) {
                    name = patternResults[name].query.searchin;
                }
                res = patternResults[name].data;
            }
            else {
                let msg = '';
                if(!name) msg = `ERROR: ${name} no es un nombre de patrón válido.`;
                else if(!finalParent) `ERROR: ${finalParent} no es un nombre de patrón válido.`;
                else msg = `ERROR: ${name} no desciende del patrón ${finalParent}.`;
                console.error(msg);
                throw(msg);
            }
        }
        catch(error) {
            // let msg = `ERROR @retracements::get_parent_data: ${error}`;
            let msg = `${error}`;
            console.error(msg);
            throw(msg);
        }
        return res;
    }

    /**
     * #checkPatternIsParent: Check given base data is descendant from given final parent name.
     * @param {*} patternResults Full data model.
     * @param {*} query Query to build current base data.
     * @param {*} finalParent Final parent data name.
     * @returns true: final_parent is ascendant from base data. | false: other case.
     */
     static #checkPatternIsParent({patternResults, query, finalParent}) {
        let res = false;
        while(query && finalParent && !res) {
            let parent_name = query[Const.SEARCH_IN_ID];
            res = (parent_name == finalParent);
            query = (patternResults[parent_name]) ?
                            patternResults[parent_name][Const.QUERY_ID] : undefined;
        }
        return res;
    }

    /**
     * #getStats
     * @abstract Get statistics values from processed results.
     * @param ok Results matches.
     * @param nok Results don't match.
     * @param searchInModel Base model with all data results.
     * @returns Object with { trend, ok, nok, total }. ok, num total: object with { num, '%' }.
     */
    static #getStats({ok, nok, searchInModel}) {
        let res = [];
        Const.BOTH.forEach( s => {
            try {
                // TODO LA TENDENCIA TIENE QUE OBTENERSE EN FUNCION DE LOS DATOS BASE, SI HAY FUENTE PADRE (aka trend_sign)
                let okTrend = ok.filter( m => m.trend == s).length;
                let badTrend = nok.filter(m => m.trend == s).length;
                let totalTrend = okTrend + badTrend;
                let totalBase;
                if(searchInModel) {
                    totalBase = searchInModel.stats[searchInModel.level].filter(v => v.trend == s)[0].ok.num;
                }
                else {
                    totalBase = totalTrend;
                }

                let totalPc = (totalTrend / totalBase) * 100;
                totalPc = (isNaN(totalPc)) ? 0 : totalPc;
                let okPc = (okTrend / totalTrend) * 100;
                okPc = (isNaN(okPc)) ? 0 : okPc;
                let badPc = (badTrend / totalTrend) * 100;
                badPc = (isNaN(badPc)) ? 0 : badPc;
                let stats = {};
                stats.trend = s;
                stats.ok = { num: okTrend, [Const.PERCENT_ID]: okPc};
                stats.nok = { num: badTrend, [Const.PERCENT_ID]: badPc};
                stats.total = { num: totalTrend, [Const.PERCENT_ID]: totalPc };
                res.push(stats);
            }
            catch(err) {
                console.error(err);
                throw(err);
            }
        });
        return res;
    }
    
    /**
     * #getFamilyTrend
     * @abstract Get family trend based on 'from' setting in each query, and base data trend.
     * @param {*} request Request to build current data.
     * @param {*} model Full data model.
     * @returns 1 (Const.TREND_SAME) | -1 (Const.TREND_CHANGE).
     */
     static #getFamilyTrend({request, model}) {
        let trendSign = Const.TREND_SAME;
        if(request && model) {
            let parent = request.searchin;
            if(model[parent]) {
                let parentRequest = model[parent].query;
                trendSign *= RetracementsAnalysis.#getFamilyTrend({request: parentRequest, model})
            }
            if(request.from == Const.END_ID)
                trendSign *= Const.TREND_CHANGE;
        }
        return trendSign;
    }

    /**
     * #buildSonMovements
     * @abstract Build new movement from parent base point. Ex. from correction(parent)->end(son), merges end(parent)->init(son).
     * @param parent Parent source results data, from wich son data is generated.
     * @param data Results find in movements, from parent source data. Could match with result, or need to be merged.
     * @param request Pattern request to get this results.
     * @returns Real son results from parent.
     */
    static #buildSonMovements({parent, data, request}) {
        try {
            data.map( (m, i) => {
                let p = parent.find( v => {
                    return (v[request.until].time == m[request.untilSearch].time) &&
                            (v[request.until].price == m[request.untilSearch].price);
                });
                if(p) {
                    m.timestamp = p.timestamp;
                    m.hash = p.hash; // + Const.HASH_SEP_STR + 0; // 0: First family solution (hash)
                    if(request.from) {
                        m.init = p[request.from];
                        // m.timestamp = m.init.time;
                    }
                    if(request.until) { m.end = p[request.until]; }
                    if(m.init && m.end) { m.deltainit = m.end.price - m.init.price; }
                    if(m.end && m.correction) { m.deltaend = m.correction.price - m.end.price; }
                    if((m.deltainit != undefined) && (m.deltaend != undefined)) {
                        m.retracement = Math.abs(m.deltaend / m.deltainit);
                    }
                    RetracementsAnalysis.appendHash(m);
                }
            });

            data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
        }
        catch(error) {
            throw(error)
        }
        return data;
    }
}

