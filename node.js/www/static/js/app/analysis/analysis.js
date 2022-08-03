


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

class AnalysisData {
    data = {};
    nok = {};
    searchindata = {};
    stats = {};
    searchin = '';
    iterate = 0;
    query;
    from;
    until;
    limit_min = -Infinity;
    limit_max = Infinity;
    logical = '';

    sourceData = {};
    validationData = {};
    searchInData = {};
}



/** 'analysis.js' */

class Analysis {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "analisys";

    //----------------------------- PROPERTIES -----------------------------


    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    static #process(request) {
        var ret = new AnalysisData();

        try {
            Analysis.parseRequest(ret, request);
            ret = Analysis.#process(request);
        }
        catch(error) {

        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    static process(request) {
        var ret = {};
        try {
            console.time(`Analysis ${request[Const.ID_ID]}`);
            ret = this.parseRequest(request);
            ret = Analysis.#process(request);
        }
        catch(error) {
            // ret.error = `Retracements process ERROR: ${error}.`;
            ret.error = `${error}.`;
            console.error(ret.error);
        }
        console.timeEnd(`Analysis ${request[Const.ID_ID]}`);
        return ret;
    }


    static parseRequest(request) {
        var ret;
        try {
        }
        catch (error) {
            ret.error = `${error}.`;
            console.error(ret.error);
        }
        return ret;
    }


    static prepareData() {

    }


    static iterate({data, ops}) {
        while( (item = Analisys.next({data, index})) != undefined) {
            Analisys.checkStop(item, ops);
            Analisys.checkStop({item, ops});
            Analisys.validate({item, ops});
        }
        Analisys.report({finalResult});
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
        return ``;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
}