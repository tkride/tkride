

/**file: menu_status.js */

class MenuStatus {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-status';
    static CLASS_PROGRESS_BAR = 'ui-progressbar';
    static CLASS_PROGRESS_BAR_COMPLETE = 'ui-progressbar-complete';
    static CLASS_PROGRESS_BAR_VALUE = 'ui-progressbar-value';
    static ELEMENT_ID_FOOTER_STATUS = '#footer-status';
    static ELEMENT_ID_CONTENT = '#footer-status-content';
    static ELEMENT_ID_PROGRESS_BAR = '#footer-status-progress';
    static ELEMENT_ID_CLASS_INFO = 'footer-status-info';
    static ELEMENT_ID_CLASS_ERROR = 'footer-status-error';

    static PROGRESS_VALUE = 'value';
    static PROGRESS_DISABLE = 'disable';
    static PROGRESS_ENABLE = 'enable';
    static PROGRESS_MAX = ['option', 'max'];
    static LOADING = '#footer-status-loading';

    //----------------------------- PROPERTIES -----------------------------

    main;
    progress_bar;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(main) {
        this.main = main;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar({
            classes: {
                [MenuStatus.CLASS_PROGRESS_BAR]: "highlight",
            },
            disabled: false, value: 0, max: 10,
        });
    }

    show_loading() {
        $(MenuStatus.LOADING).show();
    }

    hide_loading() {
        $(MenuStatus.LOADING).hide();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get content() {
        let content = $(MenuStatus.ELEMENT_ID_CONTENT).text();
        if(!content) {
            content = '';
        }
        return content;
    }
    
    set content(value) { 
        if(!value) {
            this.back_hide();
        }
        else {
            this.back_show();
            $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).removeClass(MenuStatus.ELEMENT_ID_CLASS_ERROR);
            $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).addClass(MenuStatus.ELEMENT_ID_CLASS_INFO);
        }
        $(MenuStatus.ELEMENT_ID_CONTENT).text(value);
    }

    set info(value) {
        if(!value) {
            this.back_hide();
        }
        else {
            this.back_show();
            $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).removeClass(MenuStatus.ELEMENT_ID_CLASS_ERROR);
            $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).addClass(MenuStatus.ELEMENT_ID_CLASS_INFO);
        }
        $(MenuStatus.ELEMENT_ID_CONTENT).text(value);
    }

    set error(value) {
        if(!value) {
            this.back_hide();
        }
        else {
            this.back_show();
            $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).addClass(MenuStatus.ELEMENT_ID_CLASS_ERROR);
            $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).removeClass(MenuStatus.ELEMENT_ID_CLASS_INFO);
        }
        $(MenuStatus.ELEMENT_ID_CONTENT).text(value);
    }
    
    get progress_max() { return $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar(...MenuStatus.PROGRESS_MAX); }
    
    set progress_max(value) { $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar(...MenuStatus.PROGRESS_MAX, value); }

    get progress_value() { return $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_VALUE); }
    
    set progress_value(value) { $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_VALUE, value); }

    progress_disable() { $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_DISABLE); }

    progress_enable() { $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_ENABLE); }
    
    progress_hide() { $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).hide(); }

    progress_show() { $(MenuStatus.ELEMENT_ID_PROGRESS_BAR).show(); }

    back_hide() { $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).hide(); }

    back_show() { $(MenuStatus.ELEMENT_ID_FOOTER_STATUS).show(); }

}