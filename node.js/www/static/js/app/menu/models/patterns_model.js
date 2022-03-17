/** 'patterns_model.js' */

class PatternsModel {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "model-patterns";

    static DUMMY_PATTERNS = {
        PHY: {
            [Const.BUSCAR_EN_COMBO_ID]: 'MOVIMIENTOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.ID_ID]: 'PHY',
            [Const.RET_LEVELS_ID]: '1.27,1.68',
            [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'init',
            [Const.ITERATE_ID]: '10',
            [Const.ONLY_MAX_ID]: '1',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: '',
            // [Const.RET_LEVELS_FROM_ID]: 'init',
        },
        TARGETS: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'PHY',
            [Const.ID_ID]: 'TARGETS',
            [Const.RET_LEVELS_ID]: '0.13, 0.238, 0.381, 0.55, 0.618, 0.786, 0.87, 1.272, 1.161',
            [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: '',
            // [Const.RET_LEVELS_FROM_ID]: 'init',
        },
        CC_SC_UP: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'PHY',
            [Const.ID_ID]: 'CC_SC_UP',
            [Const.RET_LEVELS_ID]: '0.1, 0.238, 0.381, 0.55, 0.6',
            // [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: '',
            // [Const.RET_LEVELS_FROM_ID]: 'init',
        },
        CC_SC_DOWN: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'CC_SC_UP',
            [Const.ID_ID]: 'CC_SC_DOWN',
            [Const.RET_LEVELS_ID]: '0.09, 0.18',
            // [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: 'CC_SC_UP',
            // [Const.RET_LEVELS_FROM_ID]: 'end',
        },
        CC_SC_TARGETS: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'CC_SC_DOWN',
            [Const.ID_ID]: 'CC_SC_TARGETS',
            [Const.RET_LEVELS_ID]: '>0.61',
            // [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: 'CC_SC_UP',
            // [Const.RET_LEVELS_FROM_ID]: 'init',
        },
        CC_1: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'PHY',
            [Const.ID_ID]: 'CC_1',
            [Const.RET_LEVELS_ID]: '0.395, 0.55, 0.6',
            // [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: '',
            // [Const.RET_LEVELS_FROM_ID]: 'init',
        },
        CC: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'CC_1',
            [Const.ID_ID]: 'CC',
            [Const.RET_LEVELS_ID]: '0.09, 0.18',
            // [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: 'CC_1',
            // [Const.RET_LEVELS_FROM_ID]: 'end',
        },
        CC_TARGETS: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'CC',
            [Const.ID_ID]: 'CC_TARGETS',
            [Const.RET_LEVELS_ID]: '>0.61',
            // [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: 'CC_1',
            // [Const.RET_LEVELS_FROM_ID]: 'init',
        },
        ZR: {
            [Const.BUSCAR_EN_COMBO_ID]: 'MOVIMIENTOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'PHY',
            [Const.ID_ID]: 'ZR',
            [Const.RET_LEVELS_ID]: '0.618, 0.686, 0.713, 0.786',
            [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'end',
            [Const.ITERATE_ID]: '0',
            [Const.ONLY_MAX_ID]: '0',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: '',
            // [Const.RET_LEVELS_FROM_ID]: '',
        },
        '▲': {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.SEARCH_IN_ID]:'PHY',
            [Const.ID_ID]: '▲',
            [Const.RET_LEVELS_ID]: '0.13',
            [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'init',
            [Const.ITERATE_ID]: '5',
            [Const.ONLY_MAX_ID]: '1',
            [Const.RET_LEVELS_DATA_SOURCE_ID]: '',
            // [Const.RET_LEVELS_FROM_ID]: '',
        },
    };

    //----------------------------- PROPERTIES -----------------------------
    #ddbb_connection;
    // #patterns = {};
    // #results = {};
    #models;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(ddbb_connection, models) {
        this.#models = models;
        this.init(ddbb_connection);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #connect_ddbb() {
        return true;
    }

    #load_patterns() {
        return PatternsModel.DUMMY_PATTERNS;
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(ddbb_connection) {
        this.#ddbb_connection = ddbb_connection;
        // TODO CONECTAR A BBDD PARA LEER PATRONES GUARDADOS
        if(this.#connect_ddbb()) {
            // this.#patterns = this.#load_patterns();
            if(this.#models) {
                this.#models.patterns = this.#load_patterns();
            }
        }
    }

    static get_parent_patterns(name) {
        let parents = [];
        do {
            if(this.#models[Const.PATTERNS_ID][name]) {
                name = this.#models[Const.PATTERNS_ID][name][Const.SEARCH_IN_ID];
                if(name) parents.push(name);
            }
            else {
                name = undefined;
            }
        } while(name);
        return parents;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
    
    // get patterns() { return this.#patterns; }

    // get results() { return this.#results}
    
    // set results(value) { return this.#results = value; }

    // get model() { return this.#models; }
    
    // set_result(id, value) {
    //     if(this.#results) {
    //         if(!this.#results[value.model_key]) this.#results[value.model_key] = {};
    //         this.#results[value.model_key][id] = value;
    //     }
    // }

    // get_result(active, id) {
    //     if((this.#results) && (this.#results[active]))
    //         return this.#results[active][id];
    //     else
    //         return null;
    // }

}
