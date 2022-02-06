

/** 'retracements.js' */

class Retracement {
    data = {};
    stats = {};
    name;
    searchin = '';
    level;
    levels = {};
    trend_req;
    from;
    only_max = 0;
    ret_min = Number.MIN_SAFE_INTEGER;
    ret_max = Number.MAX_SAFE_INTEGER;
    logical = '';
    iterate = 0;
}

class Retracements {

    //----------------------------- PUBLIC METHODS -----------------------------

    static process(request) {
        console.time('Retracements');
        var ret = Retracements.#process(request);
        console.timeEnd('Retracements');
        return ret;
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    static #process(request) {
        var ret = new Retracement();
        Retracements.#parse_request(ret, request);
        
        let data_source = request[Const.DATA_ID].data; //[this.#level-1];
        let search_in = (request[Const.SEARCH_IN_ID]) ? request[Const.SEARCH_IN_ID] : undefined; //[this.#level-1] : undefined;

        // Process for each trend requested
        // ret.trend_req.forEach( s => {
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
                stats[i] = [];
                let level = 0;
                level = i;
                // Deep copy to keep source data integrity
                let data_cpy = JSON.parse(JSON.stringify(data));

                // Search all data with search trend
                let mov_source = data_cpy.filter(d => d[Const.TREND_ID] == trend_search);
                let retracements = mov_source.filter( m => (m[Const.RET_ID] >= ret.ret_min) && (m[Const.RET_ID] <= ret.ret_max));

                // Append levels data
                ret.levels.forEach( l => {
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
                stats[i][Const.OK_ID] = { [Const.NUM_ID]: ok, [Const.PERCENT_ID]: ok_pc};
                stats[i][Const.BAD_ID] = { [Const.NUM_ID]: bad, [Const.PERCENT_ID]: bad_pc};
                stats[i][Const.TOTAL_ID] = { [Const.NUM_ID]: total, [Const.PERCENT_ID]: total_pc }; //TODO SI SE BUSCA EN RESULTADOS ANTERIORES NO SERA 100% !!
            });
            
            let trend_str = Const.SENSE_STR[trend_search];
            ret.data[trend_str] = rets;
            ret.stats[trend_str] = stats;
        });
        return ret;
    }
    
    static #parse_request(ret, request) {
        // Validate data source
        let data_source = request[Const.DATA_ID];
        if(data_source == undefined) {
            throw('No valid data received');
        }

        if(!(data_source instanceof Movements) && !(data_source instanceof Retracement) ) {
            throw(`Data type expected Movements or Retracements, but received ${typeof data_source} instead.`);
        }
        
        // Read request parameters
        ret.name = request[Const.NAME_ID];
        let trend_req = request[Const.TREND_ID];
        trend_req = (typeof trend_req === 'undefined') ? undefined : eval(`Const.${trend_req.toUpperCase()}`);
        ret.trend_req = (trend_req instanceof Array) ? trend_req : [trend_req];
        
        ret.iterate = (request[Const.ITERATE_ID] != undefined) ? parseInt(request[Const.ITERATE_ID]) : 0;
        ret.from = request[Const.FROM_ID];
        ret.only_max = request[Const.ONLY_MAX_ID];
        ret.searchin = request[Const.SEARCH_IN_ID];
        
        // TODO TEMPORAL DEBERÍA IR EN EL QUERY NO EN LOS DATOS!
        //Set requested level
        let level = request[Const.LEVEL_ID];
        ret.level = (level != undefined) ? parseInt(level) : 0;
        if(ret.level > 0) ret.level = ret.level - 1;

        // Process levels (may contain logical operators '>', '<')
        let levels = request[Const.RET_LEVELS_ID].split(/[\s,]+/);
        ret.levels = levels.map( (l, i) => {
            ret.logical = l.replace(/[.0-9]+/, '');
            let value = l.replace(/[<>]+/, '');
            value = parseFloat(value);
            return value;
        });

        if(ret.logical == Const.LOGICAL_LOWER_THAN) {
            // ret.ret_min = Number.MIN_SAFE_INTEGER;
            ret.ret_max = Math.max(...ret.levels);
        }
        else if(ret.logical == Const.LOGICAL_HIGHER_THAN) {
            // ret.ret_max = Number.MAX_SAFE_INTEGER;
            ret.ret_min = Math.min(...ret.levels);
        }
        else {
            ret.ret_min = Math.min(...ret.levels);
            ret.ret_max = Math.max(...ret.levels);
        }
        // console.log(ret.logical);
        console.log(ret.levels);
    }
}

class Retracements_ {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    #dataType = "retracements";
    get dataType() { return this.#dataType; }

    //----------------------------- PROPERTIES -----------------------------

    #data = {};
    #stats = {};
    #name;
    #level;
    #levels = {};
    #sense_req;
    #from;
    #only_max = 0;
    #ret_min = Number.MIN_SAFE_INTEGER;
    #ret_max = Number.MAX_SAFE_INTEGER;
    #logical = '';
    #iterate = 0;
    searchin = '';

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(request) {
        // Copy constructor
        if(request instanceof Retracements) {
            this.clone(request);
        }
        else if(request == undefined) {
            // Empty properties, could copy another instance via clone method
        }
        // Default constructor
        else {
            console.time('Retracements');
            this.#parse_request(request);
            this.#process(request);
            console.timeEnd('Retracements');
        }
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #parse_request(request) {
        // Validate data source
        let data_source = request[Const.DATA_ID];
        if(data_source == undefined) {
            throw('No valid data received');
        }

        if(!(data_source instanceof Movements) && !(data_source instanceof Retracements) ) {
            throw(`Data type expected Movements or Retracements, but received ${typeof data_source} instead.`);
        }
        
        // Read request parameters
        this.#name = request[Const.NAME_ID];
        let sense_req = request[Const.TREND_ID];
        sense_req = (typeof sense_req === 'undefined') ? undefined : eval(`Const.${sense_req}`);
        this.#sense_req = (sense_req instanceof Array) ? sense_req : [sense_req];
        
        this.#iterate = (request[Const.ITERATE_ID] != undefined) ? parseInt(request[Const.ITERATE_ID]) : 0;
        this.#from = request[Const.FROM_ID];
        this.#only_max = request[Const.ONLY_MAX_ID];
        this.searchin = request[Const.SEARCH_IN_ID];
        
        // TODO TEMPORAL DEBERÍA IR EN EL QUERY NO EN LOS DATOS!
        //Set requested level
        let level = request[Const.LEVEL_ID];
        this.#level = (level != undefined) ? parseInt(level) : 0;
        if(this.#level > 0) this.#level = this.#level - 1;

        // Process levels (may contain logical operators '>', '<')
        let levels = request[Const.RET_LEVELS_ID].split(/[\s,]+/);
        this.#levels = levels.map( (l, i) => {
            this.#logical = l.replace(/[.0-9]+/, '');
            let value = l.replace(/[<>]+/, '');
            value = parseFloat(value);
            return value;
        });

        if(this.#logical == Const.LOGICAL_LOWER_THAN) {
            // this.#ret_min = Number.MIN_SAFE_INTEGER;
            this.#ret_max = Math.max(...this.#levels);
        }
        else if(this.#logical == Const.LOGICAL_HIGHER_THAN) {
            // this.#ret_max = Number.MAX_SAFE_INTEGER;
            this.#ret_min = Math.min(...this.#levels);
        }
        else {
            this.#ret_min = Math.min(...this.#levels);
            this.#ret_max = Math.max(...this.#levels);
        }
        // console.log(this.#logical);
        console.log(this.#levels);
    }
    
    #process(request) {
        let data_source = request[Const.DATA_ID].data; //[this.#level-1];
        let search_in = (request[Const.SEARCH_IN_ID]) ? request[Const.SEARCH_IN_ID] : undefined; //[this.#level-1] : undefined;

        // Process for each sense requested
        // this.#sense_req.forEach( s => {
        Const.BOTH.forEach( s => {
            let rets = {};
            let stats = {};
            let sense_search = s;
            
            // When searching targets, the results sense, should be stored as source retracement data sense.
            if(this.#from == Const.END_ID) {
                sense_search = s * (-1);
            }

            // Iterate over all levels
            data_source.forEach((data, i) => {
                rets[i] = []; //{ [Const.DATA_ID]: [], [Const.STATS_ID]: {} };
                stats[i] = [];
                let level = 0;
                level = i;
                // Deep copy to keep source data integrity
                let data_cpy = JSON.parse(JSON.stringify(data));

                // Search all data with search sense
                let mov_source = data_cpy.filter(d => d[Const.TREND_ID] == sense_search);
                let retracements = mov_source.filter( m => (m[Const.RET_ID] >= this.#ret_min) && (m[Const.RET_ID] <= this.#ret_max));

                // Append levels data
                this.#levels.forEach( l => {
                    retracements.map( (v, i) => v[l] = v[Const.END_ID].price - (v[Const.DELTA_INIT_ID] * l) );
                });

                // Update real source sense in retracement data
                if(sense_search != s) {
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
                stats[i][Const.OK_ID] = { [Const.NUM_ID]: ok, [Const.PERCENT_ID]: ok_pc};
                stats[i][Const.BAD_ID] = { [Const.NUM_ID]: bad, [Const.PERCENT_ID]: bad_pc};
                stats[i][Const.TOTAL_ID] = { [Const.NUM_ID]: total, [Const.PERCENT_ID]: total_pc }; //TODO SI SE BUSCA EN RESULTADOS ANTERIORES NO SERA 100% !!
            });
            
            let sense_str = Const.SENSE_STR[sense_search];
            this.#data[sense_str] = rets;
            this.#stats[sense_str] = stats;
        });
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    clone(o) {
        this.#data = JSON.parse(JSON.stringify(o.#data) || JSON.stringify({}));
        this.#stats = JSON.parse(JSON.stringify(o.#stats) || JSON.stringify({}));
        this.#name = JSON.parse(JSON.stringify(o.#name) || '');
        this.#level = JSON.parse(JSON.stringify(o.#level) || JSON.stringify(0));
        this.#levels  = JSON.parse(JSON.stringify(o.#levels) || JSON.stringify({}));
        this.#sense_req = JSON.parse(JSON.stringify(o.#sense_req) || '');
        this.#from = JSON.parse(JSON.stringify(o.#from) || '');
        this.#only_max = JSON.parse(JSON.stringify(o.#only_max) || JSON.stringify(0));
        this.#ret_min = JSON.parse(JSON.stringify(o.#ret_min) || JSON.stringify(Number.MIN_SAFE_INTEGER));
        this.#ret_max = JSON.parse(JSON.stringify(o.#ret_max) || JSON.stringify(Number.MAX_SAFE_INTEGER));
        this.#logical = JSON.parse(JSON.stringify(o.#logical) || JSON.stringify(''));
        this.#iterate = JSON.parse(JSON.stringify(o.#iterate) || JSON.stringify(0));
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    /** Return retracement calculations results */
    get data() { return this.#data; }
    set data(data) { this.#data = data; }
    
    /** Return statistics calculations */
    get stats() { return this.#stats; }
    set stats(stats) { this.#stats = stats; }
    
    /** Return name of retracement */
    get name() { return this.#name; }
    set name(name) { this.#name = name; }

    get level() { return this.#level; }
    set level(level) { this.#level = level; }

    /** Return retracement levels calculated */
    get levels() { return this.#levels; }
    set levels(levels) { this.#levels = levels; }

    /** Return all the trend senses calculated */
    get sense_req() { return this.#sense_req; }
    set sense_req(sense_req) { this.#sense_req = sense_req; }

    /** Return the retracement initial point calculation, relative to movement (init, end, correction) */
    get from() { return this.#from; }
    set from(from) { this.#from = from; }

    /** Return if only maximum (movement, retracement) is stored in results, in iteration method */
    get only_max() { return this.#only_max; }
    set only_max(only_max) { this.#only_max = only_max; }

    /** Return logical operators (if any) in retracement levels */
    get logical() { return this.#logical; }
    set logical(logical) { this.#logical = logical; }

    /** Return how many iterations are done (if done) */
    get iterate() { return (this.#iterate) ? this.#iterate : 0; }
    set iterate(iterate) { this.#iterate = iterate; }
}