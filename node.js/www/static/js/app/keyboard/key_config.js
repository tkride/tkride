/**file: key_config.js */

function GetKeyCode(key) {
    return key.charCodeAt(0) - 32;
}

class KeyConfig {
 
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static KEY_CHART_ZOOM_VERTICAL = [KeyCode.SHIFT];
    static KEY_CHART_ZOOM_VERTICAL_END = [];
    
    static KEY_CHART_ZOOM_HORIZONTAL = [];
    static KEY_CHART_ZOOM_HORIZONTAL_END = [];
    
    static KEY_CHART_WHEEL_MOVE = [KeyCode.CTRL];
    static KEY_CHART_WHEEL_MOVE_END = [];
    
    static KEY_CLOSE_ALL = [KeyCode.ESC];
    
    static KEY_EVENT_MOVS_MENU = [KeyCode.ALT, GetKeyCode('m')];
    
    static KEY_CHART_AUTO_SCALE = [KeyCode.ALT, GetKeyCode('r')];
    static KEY_CHART_AUTO_SCALE_END = [];

    static KEY_PATTERN_MENU = [KeyCode.ALT, GetKeyCode('w')];
    
    static KEY_ADD_CHART = [KeyCode.ALT, GetKeyCode('a')];

    //----------------------------- PROPERTIES -----------------------------

    main;

    //----------------------------- CONSTRUCTOR -----------------------------
    constructor(main) {
        this.main = main;
    }
    
    //----------------------------- PRIVATE METHODS  -----------------------------

    //----------------------------- GETTER & SETTER -----------------------------

}
