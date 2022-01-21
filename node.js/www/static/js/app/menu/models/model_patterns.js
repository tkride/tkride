/** 'model_patterns.js' */

class ModelPatterns {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "model-patterns";

    static DUMMY_PATTERNS = {
        PHY: {
            [Const.BUSCAR_EN_COMBO_ID]: 'MOVIMIENTOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESO',
            [Const.NIVEL_ID]:'1',
            [Const.ID_ID]: 'PHY',
            [Const.VALORES_ID]: '1.27,1.68',
            [Const.SENTIDO_ID]: 'AMBOS',
            [Const.DESDE_ID]: 'INICIO',
            [Const.ITERA_EN_N_ID]: '', //'5',
            [Const.SOLO_MAX_ID]: '0', //'1',
        },
        TARGETS: {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESO',
            [Const.NIVEL_ID]:'1',
            [Const.BUSCAR_EN_ID]:'PHY',
            [Const.ID_ID]: 'TARGETS',
            [Const.VALORES_ID]: '0.13, 0.238, 0.381, 0.55, 0.618, 0.786, 0.87, 1.272, 1.161',
            [Const.SENTIDO_ID]: 'AMBOS',
            [Const.DESDE_ID]: 'FIN',
            [Const.ITERA_EN_N_ID]: '',
            [Const.SOLO_MAX_ID]: '0',
        },
        ZR: {
            [Const.BUSCAR_EN_COMBO_ID]: 'MOVIMIENTOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESO',
            [Const.NIVEL_ID]:'1',
            [Const.BUSCAR_EN_ID]:'PHY',
            [Const.ID_ID]: 'ZR',
            [Const.VALORES_ID]: '0.618, 0.686, 0.713, 0.786',
            [Const.SENTIDO_ID]: 'AMBOS',
            [Const.DESDE_ID]: 'INICIO',
            [Const.ITERA_EN_N_ID]: '',
            [Const.SOLO_MAX_ID]: '0',
        },
        '▲': {
            [Const.BUSCAR_EN_COMBO_ID]: 'RETROCESOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESO',
            [Const.NIVEL_ID]:'1',
            [Const.BUSCAR_EN_ID]:'PHY',
            [Const.ID_ID]: '▲',
            [Const.VALORES_ID]: '0.13',
            [Const.SENTIDO_ID]: 'AMBOS',
            [Const.DESDE_ID]: 'INICIO',
            [Const.ITERA_EN_N_ID]: '5',
            [Const.SOLO_MAX_ID]: '1',
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
        return ModelPatterns.DUMMY_PATTERNS;
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
