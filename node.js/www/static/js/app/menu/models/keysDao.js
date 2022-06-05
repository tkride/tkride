/** 'templates_dao.js' */

class KeysDAO {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static NAME = "keys-dao";

    //----------------------------- DUMMY TEST -----------------------------
    static CONTEXTS = {
        general: {
            '-': { description: 'Contexto general del gráfico.' }
        },
    }

    static SHORTCUTS = {
        general: {
            '-': {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Const.EVENT_CLOSE, },
                },
                [ Key([KeyCode.CTRL, GetKeyCode('a')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_ADD_CHART, },
                },
                [ Key([KeyCode.CTRL, GetKeyCode('d')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_DEL_CHART, },
                },
                [ Key([KeyCode.SHIFT]) ]: {
                    command: {
                        [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CHART_ZOOM_VERTICAL,
                        [KeyManager.CMD_KEY_UP]: ControlSettings.EVENT_CHART_ZOOM_VERTICAL_END,
                    },
                },
                [ Key([KeyCode.CTRL]) ]: {
                    command: {
                        [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CHART_WHEEL_MOVE,
                        [KeyManager.CMD_KEY_UP]: ControlSettings.EVENT_CHART_WHEEL_MOVE_END,
                    },
                },
                [ Key([KeyCode.CTRL]) ]: {
                    command: {
                        [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CHART_WHEEL_MOVE,
                        [KeyManager.CMD_KEY_UP]: ControlSettings.EVENT_CHART_WHEEL_MOVE_END,
                    },
                },
                [ Key([KeyCode.SHIFT, GetKeyCode('a')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CHART_AUTO_SCALE, },
                },
                [ Key([KeyCode.CTRL, GetKeyCode('m')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_MOVS_MENU, },
                },
                [ Key([KeyCode.CTRL, GetKeyCode('p')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_PATTERN_MENU, },
                },

                // TODO PARA LOS ELEMENTOS GRÁFICOS HAY QUE CREAR EVENTOS QUE SIMULEN CLICK DEL ICONO DEL MENU
                [ Key([KeyCode.ALT, GetKeyCode('m')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: EventController.EVENT_MAGNET_MODE, },
                },
                [ Key([KeyCode.ALT, GetKeyCode('p')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: EventController.EVENT_PERSIST_MODE, },
                },
                [ Key([KeyCode.ALT, GetKeyCode('f')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CREATE_FIBONACCI, },
                },
                [ Key([KeyCode.ALT, GetKeyCode('t')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CREATE_TREND_LINE, },
                },
                [ Key([KeyCode.ALT, GetKeyCode('r')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CREATE_RECTANGLE, },
                },
                [ Key([KeyCode.ALT, GetKeyCode('a')]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: ControlSettings.EVENT_CREATE_ALERT, },
                },
            }
        },
        [Fibonacci.NAME] : {
            [GraphicComponent.STATUS_CREATING] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Const.EVENT_CLOSE, },
                },
            },
            [GraphicComponent.STATUS_SELECTED] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Fibonacci.EVENT_UNSELECTED, },
                },
                [ Key([KeyCode.DELETE]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: MenuFibonacci.EVENT_REMOVE, },
                },
            },
        },
        [TrendLine.NAME] : {
            [GraphicComponent.STATUS_CREATING] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Const.EVENT_CLOSE, },
                },
            },
            [GraphicComponent.STATUS_SELECTED] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Fibonacci.EVENT_UNSELECTED, },
                },
                [ Key([KeyCode.DELETE]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: MenuFibonacci.EVENT_REMOVE, },
                },
            },
        },
        [RectangleGraphic.NAME] : {
            [GraphicComponent.STATUS_CREATING] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Const.EVENT_CLOSE, },
                },
            },
            [GraphicComponent.STATUS_SELECTED] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Fibonacci.EVENT_UNSELECTED, },
                },
                [ Key([KeyCode.DELETE]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: MenuFibonacci.EVENT_REMOVE, },
                },
            },
        },
        [AlertComponent.NAME] : {
            [GraphicComponent.STATUS_CREATING] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Const.EVENT_CLOSE, },
                },
            },
            [GraphicComponent.STATUS_SELECTED] : {
                [ Key([KeyCode.ESC]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: Fibonacci.EVENT_UNSELECTED, },
                },
                [ Key([KeyCode.DELETE]) ]: {
                    command: { [KeyManager.CMD_KEY_DOWN]: MenuFibonacci.EVENT_REMOVE, },
                },
            },
        },
    };

    static COMMANDS = {
        [Const.EVENT_CLOSE] : 'Finalizar/cerrar.',
        [ControlSettings.EVENT_ADD_CHART] : 'Agrega gráfica al diseño.',
        [ControlSettings.EVENT_DEL_CHART]: 'Elimina gráfica del diseño.',
        [ControlSettings.EVENT_CHART_ZOOM_VERTICAL] : 'Zoom vertical.',
        [ControlSettings.EVENT_CHART_ZOOM_VERTICAL_END]: 'Finalizado zoom vertical.',
        [ControlSettings.EVENT_CHART_WHEEL_MOVE] : 'Desplazamiento horizontal del gráfico.',
        [ControlSettings.EVENT_CHART_WHEEL_MOVE_END]: 'Fin del desplazamiento horizontal del gráfico.',
        [ControlSettings.EVENT_CHART_AUTO_SCALE] : 'Auto escalar gráfico.',
        [ControlSettings.EVENT_MOVS_MENU] : 'Abrir menú movimientos.',
        [ControlSettings.EVENT_PATTERN_MENU] : 'Abrir menu patrones.',

        // TODO PARA LOS ELEMENTOS GRÁFICOS HAY QUE CREAR EVENTOS QUE SIMULEN CLICK DEL ICONO DEL MENU
        [EventController.EVENT_MAGNET_MODE] : 'Alternan modo magnético.',
        [EventController.EVENT_PERSIST_MODE] : 'Alternan persistencia en modo dibujo.',
        [ControlSettings.EVENT_CREATE_FIBONACCI] : 'Crear retroceso de Fibonacci.',
        [ControlSettings.EVENT_CREATE_TREND_LINE] : 'Crear línea de tendencia.',
        [ControlSettings.EVENT_CREATE_RECTANGLE] : 'Crear rectángulo.',
        [ControlSettings.EVENT_CREATE_ALERT] : 'Crear alerta.',

        [Fibonacci.EVENT_UNSELECTED] : 'Deseleccionar Fibonacci.',
        [MenuFibonacci.EVENT_REMOVE] : 'Eliminar Fibonacci.',
        [TrendLine.EVENT_UNSELECTED] : 'Deseleccionar línea de tendencia.',
        [TrendLine.EVENT_REMOVE] : 'Eliminar línea de tendencia.',
        [RectangleGraphic.EVENT_UNSELECTED] : 'Deseleccionar rectángulo.',
        [RectangleGraphic.EVENT_REMOVE] : 'Eliminar rectángulo.',

        [AlertComponent.EVENT_UNSELECTED] : 'Deseleccionar alerta.',
        [AlertComponent.EVENT_REMOVE] : 'Eliminar alarma.',
    }
    
    //----------------------------- PROPERTIES -----------------------------
    #interface_ddbb;
    #models = {};

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(interface_ddbb, models) {
        this.#models = models;
        this.#interface_ddbb = interface_ddbb;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init() {
        this.#models.keys = {
            contexts: KeysDAO.CONTEXTS,
            shortcuts: KeysDAO.SHORTCUTS,
            commands: KeysDAO.COMMANDS,
        };

        // this.load()
        // .then()
        // .catch(error => console.error('KeysDAO: Error loading keyboard configuration from database: ', error));
    }

    load() {
        return new Promise((resolve, reject) => {
            try {
                this.#interface_ddbb.process({ user: this.#interface_ddbb.user,
                                               login_timestamp: this.#interface_ddbb.login_timestamp,
                                               query: DDBB.LOAD_KEY_CONFIGURATION,
                                               params: [ this.#interface_ddbb.user] })
                .then(res => {
                    res = res[0];
                    let keys = {};
                    res.forEach( row => {
                        try {
                            keys = JSON.parse(row.info) || {};
                        }
                        catch(err) {
                            let msg_error = 'Error: cargando configuración del teclado de base de datos:' + err;
                            console.error(msg_error);
                            reject(msg_error);
                        }
                    });
                    this.#models.keys = keys;
                    resolve(true);
                });
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    save(keys) {
        return new Promise((resolve, reject) => {
            console.log('Save keyboard configuration into DDBB.');
            keys.user = this.#interface_ddbb.user;
            this.#interface_ddbb.process({ user: keys.user,
                                            login_timestamp: this.#interface_ddbb.login_timestamp,
                                            query: DDBB.SAVE_KEY_CONFIGURATION,
                                            params: JSON.stringify(keys) })
            .then( res => {
                if(res == 1) {
                    console.log('Keyboard configuration saved:', res);
                    this.load()
                    .then( () => resolve(res))
                    .catch( err => reject(err));
                }
                else {
                    console.error('Error saving keyboard configuration:', res);
                    let msg_error = this.#interface_ddbb.get_error_message(res);
                    reject(msg_error);
                }
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
        });
    }

    delete(keys) {
        return new Promise((resolve, reject) => {
            console.log('Delete keyboard configuration:', keys);
            keys.user = this.#interface_ddbb.user;
            this.#interface_ddbb.process({ user: keys.user,
                                            login_timestamp: this.#interface_ddbb.login_timestamp,
                                            query: DDBB.DELETE_KEY_CONFIGURATION,
                                            params: JSON.stringify(keys) })
            .then( res => {
                if(res.errno == undefined) {
                    if(res >= 1) {
                        console.log('keyboard configuration deleted:', res);
                        this.load()
                        .then( () => resolve(res))
                        .catch( err => reject(err));
                    }
                    else {
                        let msg_error = `La configuración de teclado no existe en la base de datos.`;
                        console.log(msg_error);
                        reject(msg_error);
                    }
                }
                else {
                    console.error(`Error eliminando configuración del teclado ${res}.`);
                    let msg_error = this.#interface_ddbb.get_error_message(res.errno);
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

    get models() { return this.#models.keys; }

}
