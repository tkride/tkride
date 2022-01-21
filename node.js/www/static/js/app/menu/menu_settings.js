/** 'menu_settings.js' */

class MenuSettings {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "menu-settings";
    static TITLE = 'Configuración de usuario';
    static MENU_ICON = '#user-settings';

    //----------------------------- PROPERTIES -----------------------------
    #main;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(main) {
        this.#main = main;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    init() {
        $(MenuSettings.MENU_ICON).prop('title', MenuSettings.TITLE);
    }

    //----------------------------- GETTES & SETTERS -----------------------------
}
