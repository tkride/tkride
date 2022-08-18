


/**
 * Main analysis process algorithm.
 function process() {
     // Get next analysis iteration data
     while(iterate()) {
     
        // Get next source data batch
         while(next()) {
     
            // Check stop condition and break loop if reached.
             if(!checkStop()) {
     
                // Store validate result: true = OK, false = NOK.
                store((validate()));
             }
         }
     }

     // generate results statistics
     report();
 }
 */

class AnalysisData_ {
    data = {};
    nok = {};
    stats = {};
    searchin = '';
    iterate = 0;
    query;
    from;
    until;
    limitMin = -Infinity;
    limitMax = Infinity;
    logical = '';
    trend;

    sourceData = {};
    validationData = {};
    searchInData; // = {};
}



/** 'analysis.js' */

class Analysis_ {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "analisys";

    //----------------------------- PROPERTIES -----------------------------


    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
    }

    //----------------------------- STATIC METHODS -----------------------------

    // static getFamilyRequestTree({request, model, force = false}) {
    static getFamilyRequestTree({request, results, patterns, force = false}) {
        let res = [];
        try {
            // If searches in previous pattern results, copy them or process parent requests recursively to get them
            let parentRequest = request.patterns[request.searchin];
            while(parentRequest) {
                let level = request.level;
                parentRequest.modelKey = request.modelKey;
                // let searchInModel = model[parentRequest.modelKey].patternResults[parentRequest.ID];
                let searchInModel = results[parentRequest.ID];
                
                // If no parent source data available or forces process, will add request to request vector
                if( ((searchInModel ? searchInModel.data[level] : undefined) === undefined) || force) {
                    res.splice(0, 0, parentRequest);
                }
                // parentRequest = model.patterns[parentRequest.searchin];
                parentRequest = patterns[parentRequest.searchin];
            }

            // Stores current request
            res.push(request);
        }
        catch (error) {
            console.error(error);
        }
        return res;
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    
    process(request) {
        let ret = {};
        try {
            console.time(`Analisys_${this.constructor.name}-${request[Const.ID_ID]}`);
            ret = this.parseRequest(request);
            this.prepareData(ret);
            this.buildIterators(ret);
            while(this.iterate()) {

            }
        }
        catch(error) {
            ret.error = `${error}.`;
            console.error(ret.error);
        }
        console.timeEnd(`Analisys_${this.constructor.name}-${request[Const.ID_ID]}`);
        return ret;
    }



    /**
     * parseRequest
     * @abstract Parses request into valid values to perform analisys.
     * @param request Base request.
     * @returns 
     */
     parseRequest(request) {
        let ret = new AnalysisData_();
        try {
            console.time('analysis-parseRequest');

            // ---- WORKAROUND: Infinity is not JSON parseable value
            ret = JSON.parse(JSON.stringify(request, (k, v) => (v == Infinity) ? "Infinity" : v),
                             (k, v) => (v == "Infinity") ? Infinity : v);
            ret = Object.assign(new AnalysisData_(), ret);
            // ----

            console.timeEnd('analysis-parseRequest');
            ret.datatype = AnalysisData_.name;

            // let { until_ref } = this.#getComparisonFields(ret[Const.FROM_ID]);
            // ret[Const.UNTIL_ID] = until_ref;

            //Set requested level
            // ret.level = ret.level ? (parseInt(ret.level)-1) : 0;
            ret.level = ret.level ? parseInt(ret.level) : 0;

            // // Get query fields
            // ret[Const.QUERY_ID] = JSON.parse(JSON.stringify(ret));

            // // Store model information by reference
            // ret[Const.MODEL_ID] = request[Const.MODEL_ID];
            // ret[Const.PATTERNS_ID] = request[Const.PATTERNS_ID];
            // ret[Const.MODEL_KEY_ID] = request[Const.MODEL_KEY_ID];
        }
        catch (error) {
            ret.error = `${error}.`;
            console.error(ret.error);
        }
        return ret;
    }


    prepareData() {
    }


    static iterate({data, ops}) {
        while( (item = Analisys.next({data, index})) != undefined) {
            Analisys_.checkStop({item, ops});
            Analisys_.validate({item, ops});
        }
        Analisys_.report({finalResult});
    }

    static next({data, index}) {
        return data[index];
    }

    static checkStop({item, ops}) {

    }

    static report({finalResult}) {

    }
    
    /**
     * append_hash: Appends hash count identificator, to family results.
     * @param {*} m Movement.
     */
     static appendHash(m) {
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
        return ``;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
}