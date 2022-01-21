

/**file: menu_status.js */

class MenuStatus {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-status';
    static CLASS_PROGRESS_BAR = 'ui-progressbar';
    static CLASS_PROGRESS_BAR_COMPLETE = 'ui-progressbar-complete';
    static CLASS_PROGRESS_BAR_VALUE = 'ui-progressbar-value';
    static FOOTER_STATUS = '#footer-status';
    static CONTENT = '#footer-status-content';
    static PROGRESS_BAR = '#footer-status-progress';
    static CLASS_ERROR = 'footer-status-error';

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
        $(MenuStatus.PROGRESS_BAR).progressbar({
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
        let content = $(MenuStatus.CONTENT).text();
        if(!content) {
            content = '';
        }
        return content;
    }
    
    set content(value) { 
        $(MenuStatus.CONTENT).removeClass(MenuStatus.CLASS_ERROR)
        $(MenuStatus.CONTENT).text(value);
    }

    set info(value) {
        $(MenuStatus.CONTENT).removeClass(MenuStatus.CLASS_ERROR);
        this.content = value;
    }

    set error(value) {
        this.content = value;
        $(MenuStatus.CONTENT).addClass(MenuStatus.CLASS_ERROR);
    }
    
    get progress_max() { return $(MenuStatus.PROGRESS_BAR).progressbar(...MenuStatus.PROGRESS_MAX); }
    
    set progress_max(value) { $(MenuStatus.PROGRESS_BAR).progressbar(...MenuStatus.PROGRESS_MAX, value); }

    get progress_value() { return $(MenuStatus.PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_VALUE); }
    
    set progress_value(value) { $(MenuStatus.PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_VALUE, value); }

    progress_disable() { $(MenuStatus.PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_DISABLE); }

    progress_enable() { $(MenuStatus.PROGRESS_BAR).progressbar(MenuStatus.PROGRESS_ENABLE); }
    
    progress_hide() { $(MenuStatus.PROGRESS_BAR).hide(); }

    progress_show() { $(MenuStatus.PROGRESS_BAR).show(); }

}