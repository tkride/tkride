

/** 'InterfaceDDBB' */

class InterfaceDDBB {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "interface-ddbb";
    static url_section = 'ddbb';

    //----------------------------- PROPERTIES -----------------------------
    #root_url = '';
    #user = '';

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(root_url, user) {
        this.#root_url = root_url + InterfaceDDBB.url_section;
        this.#user = user;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #send_query_worker(params) {
        let query = params.query;
        let successCb = params.successCb;
        let errorCb = params.errorCb;
        let timeout = params.timeout;
        let url = params.url;

        if(!url) {
            url = this.#root_url;
        }
        console.log(query);
        let worker = new Worker('/static/js/app/ajax_worker.js');
        worker.onmessage = e => {
            successCb(JSON.parse(e.data));
            worker.terminate();
        }
        worker.postMessage({ query:JSON.stringify(query), url, timeout });
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init() {
    }

    process(query) {
        return new Promise((resolve, reject) => {
            this.#send_query_worker({ query: query,
                                      successCb: res => resolve(res),
                                      errorCb: err => reject(err),
                                      timeout: 10000
                                    });
        });
    }

    get_error_message(error) {
        let msg = '';
        switch(error.errno) {
            case DDBB.DUPLICATE_KEY: {
                let name = error.sqlMessage.split(' ');
                name = name[2];
                msg = `${DDBB.DUPLICATE_KEY_MSG}: ${name}`;
            } break;
            default: msg = `${DDBB.DDBB_ERROR}: ${error.sqlMessage}`; break;
        }
        return msg;
    }
    
    //----------------------------- GETTERS & SETTERS -----------------------------

    get user() { return this.#user; }
    set user(user) { this.#user = user; }

}