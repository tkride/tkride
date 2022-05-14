/**file: main.js */


$(document).ready(function() {

    // ---------------------------------------- INIT MAIN VAR & COOKIES ----------------------------------------

    var that = this;
    let raw_cookies = decodeURIComponent(document.cookie).split(';');
    let cookies = {};
    raw_cookies.forEach(c => {
        let kv = c.split('=');
        cookies[kv[0].trim(' ')] = kv[1];
    });
    let user;
    if(cookies.tkride_user) {
        user = cookies.tkride_user;
    }
    let login_timestamp;
    if(cookies.tkride_login_timestamp) {
        login_timestamp = cookies.tkride_login_timestamp;
    }

    // ---------------------------------------- CREATES CHART ----------------------------------------
    const create_controller = () => new Promise((resolve, reject) => {
            that.ctrl = new ChartController();
            if (that.ctrl) resolve(that.ctrl);
            else reject(null);
    });

    // const init_controller = (ctrl, brokers, headers) => new Promise((resolve, reject) => {
    const init_controller = (ctrl) => new Promise((resolve, reject) => {
        if(ctrl) {
            ctrl.init(user,login_timestamp);
            resolve(ctrl);
        }
        else reject(null);
    });

    const chart_created = (ctrl) => new Promise((resolve, reject) => {
        if(ctrl) {
            $(window).trigger(Const.EVENT_CHART_CTRL_CREATED);
            resolve(ctrl);
        }
        else
            reject(null);
    });

    create_controller()
        // .then(resp => init_controller(resp, brokers_list, that.headers))
        .then(resp => init_controller(resp))
        .then(resp => chart_created(resp))
        .catch(resp => console.error('Error al crear el controlador'));
    
    // // ---------------------------------------- CREATES TERMINAL ----------------------------------------
    
    // const create_terminal = (that) => new Promise((resolve, reject) => {
    //     that.terminal = new Terminal(that);
    //     if(that.terminal) resolve(that.terminal);
    //     else reject(null);
    // });

    // const init_terminal = (term) => new Promise((resolve, reject) => {
    //     if(term) {
    //         term.init();
    //         resolve(term);
    //     }
    //     else reject(null);
    // });

    // const terminal_created = (term) => new Promise((resolve, reject) => {
    //     if(term) {
    //         $(window).trigger(Const.EVENT_TERMINAL_CREATED);
    //         resolve(term);
    //     }
    //     else reject(null);
    // });

    // create_terminal(that)
    //     .then(resp => init_terminal(resp))
    //     .then(resp => terminal_created(resp))
    //     .then(() => $(EventController.TERMINAL_OPEN).removeClass(Const.CLASS_DISABLED))
    //     .catch(error => console.error('Error al crear el terminal', error));

    // ---------------------------------------- CREATES EVENT CONTROLLER ----------------------------------------
    that.ecc = $.Deferred();
    // that.etc = $.Deferred();
    $(window).on(Const.EVENT_CHART_CTRL_CREATED, e => that.ecc.resolve(e) );
    // $(window).on(Const.EVENT_TERMINAL_CREATED, e => that.etc.resolve(e) );

    // $.when(that.ecc, that.etc).done( () => {
    $.when(that.ecc).done( () => {
        that.event_ctrl = new EventController();
        that.event_ctrl.init(that);
        $(document).tooltip({});
    });

    // that.drag = false;
    // that.curr_x = 0;
    // that.curr_y = 0;
    // $("#float-menu").draggable();
});

