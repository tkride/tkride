/** 'patterns_dao.js' */

class PatternsDAO {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static NAME = "patterns-dao";

    static DUMMY_PATTERNS = {
        PHY: {
            [Const.BUSCAR_EN_COMBO_ID]: 'MOVIMIENTOS',
            [Const.TIPO_PARAM_ID]: 'RETROCESOS',
            [Const.LEVEL_ID]:'1',
            [Const.ID_ID]: 'PHY',
            [Const.RET_LEVELS_ID]: '1.27,1.68',
            [Const.TREND_ID]: 'both',
            [Const.FROM_ID]: 'init',
            [Const.ITERATE_ID]: '20',
            [Const.ONLY_MAX_ID]: '0', //'1',
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
            [Const.ITERATE_ID]: '20',
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
            [Const.ITERATE_ID]: '20',
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
            [Const.ITERATE_ID]: '20',
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
    #interface_ddbb;
    #models;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(interface_ddbb, models) {
        this.#models = models;
        this.#interface_ddbb = interface_ddbb;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init() {
        this.load()
        .then()
        .catch(error => console.error('PatternsDAO: Error loading patterns from database: ', error));
    }

    load() {
        return new Promise((resolve, reject) => {
            try {
                this.#interface_ddbb.process({ user: this.#interface_ddbb.user,
                                               login_timestamp: this.#interface_ddbb.login_timestamp,
                                               query: DDBB.LOAD_USER_PATTERNS,
                                               params: [ this.#interface_ddbb.user] })
                .then(res => {
                    // let ddbb_res = res[1];
                    res = res[0];
                    let patterns = {};
                    res.forEach( row => {
                        try {
                            let pattern = JSON.parse(row.values);
                            patterns[pattern[Const.ID_ID]] = pattern;
                        }
                        catch(err) {
                            let msg_error = 'Error: cargando patrones de base de datos:' + err;
                            console.error(msg_error);
                            reject(msg_error);
                        }
                    });
                    this.#models.patterns = patterns;
                    resolve(true);
                });
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    save(pattern) {
        return new Promise((resolve, reject) => {
            console.log('Save pattern into DDBB.');
            pattern.user = this.#interface_ddbb.user;
            this.#interface_ddbb.process({ user: pattern.user,
                                            login_timestamp: this.#interface_ddbb.login_timestamp,
                                            query: DDBB.SAVE_PATTERN,
                                            params: JSON.stringify(pattern) })
            .then( res => {
                if(res == 1) {
                    console.log('Pattern saved:', res);
                    this.load()
                    .then( () => resolve(res))
                    .catch( err => reject(err));
                    // .then( res => resolve(res))
                    // .catch( error => {
                    //     console.error(error);
                    //     // this.write_status( { error: 'Error cargando patrones desde base de datos.', timeout: 5000 });
                    //     resolve('Error cargando patrones desde base de datos.');
                    // });
                }
                else {
                    console.error('Error saving pattern:', res);
                    let msg_error = this.#interface_ddbb.get_error_message(res);
                    // this.write_status({error:'(!) Error guardando patrón: ' + msg_error, timeout: 5000});
                    reject(msg_error);
                }
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    // delete_pattern(pattern) {
    delete(pattern) {
        return new Promise((resolve, reject) => {
            console.log('Delete pattern:', pattern);
            pattern.user = this.#interface_ddbb.user;
            this.#interface_ddbb.process({ user: pattern.user,
                                            login_timestamp: this.#interface_ddbb.login_timestamp,
                                            query: DDBB.DELETE_PATTERN,
                                            params: JSON.stringify(pattern) })
            .then( res => {
                if(res.errno == undefined) {
                    if(res >= 1) {
                        console.log('Pattern deleted:', res);
                        this.load()
                        .then( () => resolve(res))
                        .catch( err => reject(err));
                        // .then( res => resolve(res))
                        // .catch( error => {
                        //     console.error(error);
                        //     // this.write_status( { error: 'Error cargando patrones desde base de datos.', timeout: 5000 });
                        //     reject('Error cargando patrones desde base de datos.');
                        // });
                    }
                    else {
                        let msg_error = `El patrón ${pattern[Const.NAME_ID]} no existe en la base de datos.`;
                        console.log(msg_error);
                        reject(msg_error);
                        // this.write_status({info:'El patrón no existe en base de datos', timeout: 5000});
                    }
                }
                else {
                    console.error(`Error eliminando patrón ${res}.`);
                    let msg_error = this.#interface_ddbb.get_error_message(res.errno);
                    // this.write_status({error:'(!) Error borrando patrón: ' + msg_error, timeout: 5000});
                    reject(msg_error);
                }
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get models() { return this.#models; }

}
