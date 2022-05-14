
function Key(...k) {
    let res = '';
    k.forEach(i => res += i);
    return res;
}

function KeyTicker(active, ...k) {
    // let id = Key(active[Const.ID_ID], active[Const.BROKER_ID], active[Const.TIME_FRAME_ID], (temp_mark) ? Date.now():'');
    let id = Key(active[Const.ID_ID], active[Const.BROKER_ID], active[Const.TIME_FRAME_ID], ...k);
    return id;
}

function GetKeyCode(key) {
    return key.charCodeAt(0) - 32;
}

class ControlSettings {

    //----------------------------- STATIC, CONSTANTS -----------------------------
    static EVENT_CHART_ZOOM_HORIZONTAL = 'event-chart-zoom-horizontal';
    static EVENT_CHART_ZOOM_VERTICAL = 'event-chart-zoom-vertical';
    static EVENT_CHART_ZOOM_VERTICAL_END = 'event-chart-zoom-vertical-end';
    static EVENT_CHART_WHEEL_MOVE = 'event-chart-wheel-move';
    static EVENT_CHART_WHEEL_MOVE_END = 'event-chart-wheel-move-end';
    static EVENT_CHART_AUTO_SCALE = 'event-chart-auto-scale';
    static EVENT_MOVS_MENU = 'event-movs-menu';
    static EVENT_PATTERN_MENU = 'event-pattern-menu';
    static EVENT_ADD_CHART = 'event-add-chart';

    //----------------------------- PROPERTIES -----------------------------
    #cfg = {};
    #events = {};
    #last_keys = [];

    //----------------------------- CONSTRUCTOR -----------------------------
    constructor(cfg) {
        if(cfg) this.#cfg = cfg;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    //TODO LEER DE FICHERO (INICIALIZADO A MANO AHORA)
    init() {
        try {
            this.#events[Key('keydown', [KeyCode.SHIFT])] = [ControlSettings.EVENT_CHART_ZOOM_VERTICAL];
            this.#events[Key('keyup', [KeyCode.SHIFT])] = [ControlSettings.EVENT_CHART_ZOOM_VERTICAL_END];
            // this.#events[Key('keyup', [KeyCode.SHIFT])] = [ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL];
            this.#events[Key(['keydown'], [KeyCode.CTRL])] = [ControlSettings.EVENT_CHART_WHEEL_MOVE];
            this.#events[Key(['keyup'], [KeyCode.CTRL])] = [ControlSettings.EVENT_CHART_WHEEL_MOVE_END];
            // this.#events[Key(['keyup'], [KeyCode.CTRL])] = [ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL];
            this.#events[Key(['keyup'], [KeyCode.ESC])] = [Const.EVENT_CLOSE];
            // this.#events[Key(['keydown'], [KeyCode.ALT, GetKeyCode('t')])] = [Terminal.EVENT_DISPLAY_TERMINAL];
            this.#events[Key(['keydown'], [KeyCode.ALT, GetKeyCode('m')])] = [ControlSettings.EVENT_MOVS_MENU];
            this.#events[Key(['keydown'], [KeyCode.ALT, GetKeyCode('r')])] = [ControlSettings.EVENT_CHART_AUTO_SCALE];
            this.#events[Key(['keydown'], [KeyCode.ALT, GetKeyCode('w')])] = [ControlSettings.EVENT_PATTERN_MENU];
            this.#events[Key(['keydown'], [KeyCode.ALT, GetKeyCode('a')])] = [ControlSettings.EVENT_ADD_CHART];
            console.log(this.#events);
            console.log('Control Settings Initialized OK.');
        }
        catch(error) {
            console.error("Control Settings NOT Initialized: ", error);
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    get(keys, e) {
        let ctrl = this.#events[Key(e,keys)];
        let released = [];
        if(!ctrl) {
            ctrl=[];
            if((e == 'keyup') && (this.#last_keys.length)) {
                released = this.#last_keys;
                this.#last_keys = this.#last_keys.filter(k => !keys.includes(k));
            }
        }
        else {
            console.log(ctrl);
            if(e == 'keydown') {
                this.#last_keys = keys;
                released = this.#last_keys;
            }
        }
        return { event:ctrl, released:released };
    }

    clear() {
        this.#last_keys = [];
    }

    //----------------------------- GETTERS SETTERS -----------------------------

}

