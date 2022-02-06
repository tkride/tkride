/**file: menu_movs.js */

class MenuMovs {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    // Menu element tags
    static NAME = 'menu-movs';
    static TITLE = 'Movimientos';
    static MENU_ICON = '#show-movs';
    static MENU = '#show-movs-menu';
    static ACTIVE = '#show-movs-menu-active';
    static LEVEL_MAX = '#show-movs-menu-level-max';
    static LEVEL_SELECTED = '#show-movs-menu-level-selected';
    static LEVEL_SELECTOR = '#show-movs-menu-level-selector';
    static SHOW_RET = "show-movs-menu-show-ret";
    static LINE_COLOR = '#show-movs-menu-line-color';
    static LINE_WIDTH = '#show-movs-menu-line-width';
    static LINE_TYPE = '#show-movs-menu-line-type';
    // JQuery UI parameters
    static SPINNER_VALUE = 'value';
    static SPINNER_MAX = ['option', 'max'];
    static SLIDER_VALUE_SELECTED = ['option', 'value'];
    static SLIDER_VALUE_MIN = ['option', 'min'];
    static SLIDER_VALUE_MAX = ['option', 'max'];
    // Events
    static EVENT_SPIN_CHANGE = 'spinchange';
    static EVENT_SPIN = 'spin';
    static EVENT_SPIN_START = 'spinstart';
    static EVENT_SPIN_STOP = 'spinstop';
    static EVENT_SLIDER_SLIDE = 'slide';
    static EVENT_SLIDER_CHANGE = 'slidechange';
    static EVENT_UDPATE_MOV_ACTIVE = 'update-mov-active';
    static EVENT_SHOW_MOVEMENTS = 'event-show-movs';
    static EVENT_SHOW_MOVEMENTS_RETRACEMENTS = 'event-show-movs-rets';
    static EVENT_CLOSE_MENU = 'event-movs-close-menu';


    //----------------------------- PROPERTIES -----------------------------

    #options = {
        [Const.ACTIVO_ID]: {},
        [Const.ID_ID]: '',
        [Const.NIVEL_ID]: 1,
        [Const.MAXIMOS_ID]: { [Const.NIVEL_ID]: 6 },
        active: false,
        show_ret:false,
    };

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #init_menu() {
        var that = this;
        try {
            console.log('Initializing movs menu options.');
            // Active
            $(MenuMovs.ACTIVE).text(''+this.#options[Const.ACTIVO_ID]);

            // Level max spinner
            let spinner_conf = { min: 1, max: this.level_max, value: parseInt(this.level_max) };
            $(MenuMovs.LEVEL_MAX).spinner(spinner_conf);
            this.set_spinner_value(spinner_conf.value);
            $(MenuMovs.LEVEL_MAX).on(MenuMovs.EVENT_SPIN_STOP, (e, ui) => {
                that.level_max = that.get_spinner_value();
                if(that.get_spinner_max() <= that.level_max) {
                    that.level_max += 1;
                    that.set_spinner_max(that.level_max);
                    that.set_spinner_value(that.level_max);
                }
                let level_sel = that.get_slider_selected()
                if(that.level_max <= level_sel) {
                    that.set_slider_selected(that.level_max);
                }
                that.set_slider_max(that.level_max);
            });

            // Level slider
            // let slider_conf = { min: 1, max: this.level_max, value: this.level_selected} ;
            let slider_conf = { min: 1, max: this.get_spinner_value(), value: this.level_selected } ;
            $(MenuMovs.LEVEL_SELECTOR).slider(slider_conf);
            
            // Label level slider
            $(MenuMovs.LEVEL_SELECTED).text(this.level_selected + ':');

            // Event level slider
            $(MenuMovs.LEVEL_SELECTOR).on(MenuMovs.EVENT_SLIDER_SLIDE, (e, ui) => {
                console.log('EVENT SLIDE');
                that.level_selected = ui.value;
                $(MenuMovs.LEVEL_SELECTED).text(ui.value + ':');
            });

            // Event level selected
            $(MenuMovs.LEVEL_SELECTOR).on(MenuMovs.EVENT_SLIDER_CHANGE, (e, ui) => {
                console.log('EVENT SLIDER CHANGE');
                that.level_selected = ui.value;
                $(MenuMovs.LEVEL_SELECTED).text(ui.value + ':');
                console.log(that.active);
                if(Object.keys(that.active).length) {
                    $(document).trigger(MenuMovs.EVENT_SHOW_MOVEMENTS, that.options);
                }
            });

            // Checkbox show retracements
            $(MenuMovs.SHOW_RET).on('change', e => {
                that.#options = this.checked;
                $(document).trigger(MenuMovs.EVENT_SHOW_MOVEMENTS_RETRACEMENTS, that.#options.show_ret);
            });

            $(document).on(MenuMovs.EVENT_UDPATE_MOV_ACTIVE, (e, opt) => {
                that.active = opt.active;
                that.id = opt.id;
            });
        }
        catch(error) {
            console.error('Error initializing movements menu options:', error);
        }
    }

    #close_menu() {
        if($(MenuMovs.MENU).is(':visible')) {
            $(MenuMovs.MENU).toggle();
            $(MenuMovs.MENU_ICON).toggleClass(Const.CLASS_HOVERABLE_ICON + ' ' + Const.CLASS_HOVERABLE_ICON_SELECTED);
            this.#options.active = false;
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        var that = this;

        try {
            // Initialize menu components
            this.#init_menu();
            $(MenuMovs.MENU_ICON).prop('title', MenuMovs.TITLE);
            $(MenuMovs.MENU).hide();

            //TODO MOVER A FICHERO MAS APROPIADO
            $(EventController.FOOTER_MENU_OPTIONS).append($(MenuMovs.MENU));

            // Forces closing menu
            $(document).on(Const.EVENT_CLOSE, e => { if(e.target == document) { that.#close_menu(); } });

            $(document).on(MenuMovs.EVENT_CLOSE_MENU, e => this.#close_menu());

            $(document).on(ControlSettings.EVENT_MOVS_MENU, (e, active, model_key) => {
                if($(MenuMovs.MENU).is(':visible') == false) {
                    that.update_active(active, model_key);
                }
                that.#options.active = !that.#options.active;
                $(MenuMovs.MENU).toggle();
                $(MenuMovs.MENU_ICON).toggleClass(Const.CLASS_HOVERABLE_ICON + ' ' + Const.CLASS_HOVERABLE_ICON_SELECTED);
                $(document).trigger(MenuMovs.EVENT_SHOW_MOVEMENTS, that.options);
            });
            console.log('Movs menu initialized OK.');
        }
        catch(error) {
            console.error("Menu Movs NOT Initialized: ", error);
        }
    }

    update_active(active, model_key) {
        this.active = active;
        this.id = model_key; //KeyTicker(this.active, model_key);
        this.set_active_label(this.active);
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get_active_label() { return $(MenuMovs.ACTIVE).text(); }

    set_active_label(active) { $(MenuMovs.ACTIVE).text(active[Const.ID_ID] + ' ' + active[Const.MARCO_ID] + ' ' + active[Const.BROKER_ID]); }

    get_spinner_value() { return $(MenuMovs.LEVEL_MAX).spinner(MenuMovs.SPINNER_VALUE); }

    set_spinner_value(max) { $(MenuMovs.LEVEL_MAX).spinner(MenuMovs.SPINNER_VALUE, max); }

    get_spinner_max() { return $(MenuMovs.LEVEL_MAX).spinner(...MenuMovs.SPINNER_MAX); }

    set_spinner_max(max) { $(MenuMovs.LEVEL_MAX).spinner(...MenuMovs.SPINNER_MAX, max); }

    get_slider_selected() { return $(MenuMovs.LEVEL_SELECTOR).slider(...MenuMovs.SLIDER_VALUE_SELECTED); }
    
    set_slider_selected(level) { $(MenuMovs.LEVEL_SELECTOR).slider(...MenuMovs.SLIDER_VALUE_SELECTED, level); }

    get_slider_max() { return $(MenuMovs.LEVEL_SELECTOR).slider(...MenuMovs.SLIDER_VALUE_MAX); }

    set_slider_max(level) { $(MenuMovs.LEVEL_SELECTOR).slider(...MenuMovs.SLIDER_VALUE_MAX, level); }

    get_slider_min() { return $(MenuMovs.LEVEL_SELECTOR).slider(...MenuMovs.SLIDER_VALUE_MIN); }

    set_slider_min(level) { $(MenuMovs.LEVEL_SELECTOR).slider(...MenuMovs.SLIDER_VALUE_MIN, level); }

    get active() { return this.#options[Const.ACTIVO_ID]; }
    
    set active(active) { this.#options[Const.ACTIVO_ID] = active; }

    get id() { return this.#options[Const.ID_ID]; }

    set id(id) { this.#options[Const.ID_ID] = id; }

    get level_selected() { return this.#options[Const.NIVEL_ID]; }

    set level_selected(level) { this.#options[Const.NIVEL_ID] = level; }
    
    get level_max() { return this.#options[Const.MAXIMOS_ID][Const.NIVEL_ID]; }
    
    set level_max(level) { this.#options[Const.MAXIMOS_ID][Const.NIVEL_ID] = level; }

    get options() { return this.#options; }
}

