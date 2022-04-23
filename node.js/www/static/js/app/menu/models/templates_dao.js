/** 'templates_dao.js' */

class TemplatesDAO {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static NAME = "templates-dao";

    static DUMMY_TEMPLATES = {
        [Fibonacci.NAME]: {
            PHY: {
                name: 'PHY',
                levels: [1.127, 1.272,1.618, 1.88],
                colors: ['rgba(121,122,134,255)',
                         'rgba(255,153,1,255)',
                         'rgba(66,165,245,255)',
                         'rgba(255,1,1,255)'],
                opacity: 0.2,
                textShow: true,
                textSide: 'right',
                textInfo: '%',
            },
            TARGETS: {
                name: 'TARGETS',
                levels: [0.13, 0.146, 0.17, 0.238, 0.313, 0.381, 0.455, 0.55, 0.618, 0.686, 0.713, 0.786, 0.83, 0.87, 1.127, 1.272, 1.618, 1.88],
                colors: ['rgba(255, 255, 255, 1)',
                         'rgba(255, 255, 255, 1)',
                         'rgba(233,30,99,255)',
                         'rgba(244,67,54,255)',
                         'rgba(244,67,54,255)',
                         'rgba(77,174,80,255)',
                         'rgba(1,151,136,255)',
                         'rgba(255, 255, 255, 1)',
                         'rgba(1,151,136,255)',
                         'rgba(201,11,224,255)',
                         'rgba(244,67,54,255)',
                         'rgba(0,188,212,255)',
                         'rgba(171,70,189,255)',
                         'rgba(233,30,99,255)',
                         'rgba(121,122,134,255)',
                         'rgba(255,153,1,255)',
                         'rgba(66,165,245,255)',
                         'rgba(255,1,1,255)'],
                opacity: 0.2,
                textShow: true,
                textSide: 'right',
                textInfo: '%',
            },
            ZR: {
                name: 'PHY',
                levels: [0.618, 0.686, 0.713, 0.786],
                colors: ['rgba(1,151,136,255)',
                         'rgba(201,11,224,255)',
                         'rgba(244,67,54,255)',
                         'rgba(0,188,212,255)',],
                opacity: 0.2,
                textShow: true,
                textSide: 'right',
                textInfo: '%',
            },
        }
    };

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
        this.load()
        .then()
        .catch(error => console.error('TemplatesDAO: Error loading templates from database: ', error));
    }

    load() {
        return new Promise((resolve, reject) => {
            try {
                this.#interface_ddbb.process({ user: this.#interface_ddbb.user,
                                               login_timestamp: this.#interface_ddbb.login_timestamp,
                                               query: DDBB.LOAD_USER_TEMPLATES,
                                               params: [ this.#interface_ddbb.user] })
                .then(res => {
                    res = res[0];
                    let templates = {};
                    res.forEach( row => {
                        try {
                            let template = JSON.parse(row.info);
                            templates[template.type] = templates[template.type] || {}
                            templates[template.type][template.name] = template;
                        }
                        catch(err) {
                            let msg_error = 'Error: cargando plantillas de base de datos:' + err;
                            console.error(msg_error);
                            reject(msg_error);
                        }
                    });
                    this.#models.templates = templates;
                    resolve(true);
                });
            }
            catch(error) {
                console.error(error);
                reject(error);
            }
        });
    }

    save(template) {
        return new Promise((resolve, reject) => {
            console.log('Save template into DDBB.');
            template.user = this.#interface_ddbb.user;
            this.#interface_ddbb.process({ user: template.user,
                                            login_timestamp: this.#interface_ddbb.login_timestamp,
                                            query: DDBB.SAVE_TEMPLATE,
                                            params: JSON.stringify(template) })
            .then( res => {
                if(res == 1) {
                    console.log('Template saved:', res);
                    this.load()
                    .then( () => resolve(res))
                    .catch( err => reject(err));
                }
                else {
                    console.error('Error saving template:', res);
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

    delete(template) {
        return new Promise((resolve, reject) => {
            console.log('Delete template:', template);
            template.user = this.#interface_ddbb.user;
            this.#interface_ddbb.process({ user: template.user,
                                            login_timestamp: this.#interface_ddbb.login_timestamp,
                                            query: DDBB.DELETE_TEMPLATE,
                                            params: JSON.stringify(template) })
            .then( res => {
                if(res.errno == undefined) {
                    if(res >= 1) {
                        console.log('Template deleted:', res);
                        this.load()
                        .then( () => resolve(res))
                        .catch( err => reject(err));
                    }
                    else {
                        let msg_error = `La plantilla ${template.name} no existe en la base de datos.`;
                        console.log(msg_error);
                        reject(msg_error);
                    }
                }
                else {
                    console.error(`Error eliminando plantilla ${res}.`);
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

    get models() { return this.#models; }

}
