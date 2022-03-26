/**file: event_controller.js */

class EventController {
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static FOOTER_MENU = '#footer-menu';
    static FOOTER_MENU_OPTIONS = '#footer-menu-options';
    static CLASS_FOOT_MENU = 'foot-menu';
    // static TERMINAL_OPEN = '#terminal-open';
    static TICKER_FILTER = '#chart-filter';
    static TIME_FRAME_PANEL = '#chart-time-frame-panel';
    static ADD_CHART = "#add-chart-icon";

    static OUTSIDE_TICKER_FILTER = $('#chart-main > *').not('#chart-filter, #chart-filter > *');
    static OUTSIDE_TIME_FRAME_PANEL = $('#chart-main > *').not('#chart-time-frame-panel, #chart-time-frame-panel > *');

    //----------------------------- PROPERTIES -----------------------------
    keys_down = [];
    #cfg = {};
    #menus = {};
    #menus_icons = [];

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
    }
    
    //----------------------------- PRIVATE METHODS -----------------------------

    #set_icons(sel_icon) {
        this.#menus_icons.each( (i, mi) => {
            // if('#' + $(mi).attr('id') != EventController.TERMINAL_OPEN) {
                $(mi).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
                $(mi).addClass(Const.CLASS_HOVERABLE_ICON);
            // }
        });
        $(sel_icon).addClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
    }

    #manage_patterns_menu() {
        if(MenuPatterns.is_visible()) {
            $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).hide();
            $(MenuPatterns.ELEMENT_ID_MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            $(MenuPatterns.ELEMENT_ID_MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON);
            $(document).trigger(ChartController.EVENT_ENABLE_KEYS);
        }
        else {
            $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).show();
            $(document).trigger(MenuPatterns.EVENT_BUILD_MENU);
            $(MenuPatterns.ELEMENT_ID_MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            $(MenuPatterns.ELEMENT_ID_MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON);
            $(document).trigger(ChartController.EVENT_DISABLE_KEYS);
            $(document).trigger(MenuPatterns.EVENT_UPDATE_MODEL);
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(main) {        
        var that = this;
        try {
            // Menu objects
            that.#menus = main.ctrl.menus;

            // Key configuration & controls
            that.#cfg = main.ctrl.control_settings;

            // Stores all menu icons elements
            this.#menus_icons = $(EventController.FOOTER_MENU).children(); //'.'+EventController.CLASS_FOOT_MENU);
            $.each(this.#menus_icons, (k,i) => $(i).removeClass(Const.CLASS_DISABLED));
            
            // // Term closing or focus lost events
            // let event_term_close_focusout = Terminal.EVENT_CLOSED + ' ' + Terminal.EVENT_FOCUS_LOST;
            // $(window).on(event_term_close_focusout, e => {
            //     $(document).trigger(ChartController.EVENT_ENABLE_KEYS);
            // });

            EventController.OUTSIDE_TICKER_FILTER.on('click', e => {
                if($(TickerFilter.FILTER).is(":visible")) {
                    $(TickerFilter.FILTER).trigger(Const.EVENT_CLOSE);
                }
            });
            
            EventController.OUTSIDE_TIME_FRAME_PANEL.on('click', e => {
                if($(TimeFrame.PANEL).is(':visible')) {
                    $(TimeFrame.PANEL).trigger(Const.EVENT_CLOSE);
                }
            });

            // ---- Foot menu icons click ----
            // $(document).on('click', EventController.TERMINAL_OPEN, e => {
            //     $(document).trigger(Terminal.EVENT_DISPLAY_TERMINAL);
            // });
            
            // // Terminal opened
            // $(document).on(Terminal.EVENT_OPEN, e => {
            //     $(EventController.TERMINAL_OPEN).addClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            //     $(EventController.TERMINAL_OPEN).removeClass(Const.CLASS_HOVERABLE_ICON);
            // });

            // // Terminal focus, closes ticker filter and time frame panel
            // $(document).on(Terminal.EVENT_FOCUS, e => {
            //     if(main.ctrl.ticker_filter.is_visible()) { $(EventController.TICKER_FILTER).trigger(TickerFilter.EVENT_DISABLE); }
            //     if(main.ctrl.time_frame.is_visible()) { $(EventController.TIME_FRAME_PANEL).trigger(TimeFrame.EVENT_DISABLE); }

            //     $(document).trigger(Const.EVENT_CLOSE);
            //     $(document).trigger(ChartController.EVENT_DISABLE_KEYS);
            // });

            // // Closes everything
            // $(document).on(Terminal.EVENT_CLOSED, e => {
            //     $(EventController.TERMINAL_OPEN).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            //     $(EventController.TERMINAL_OPEN).addClass(Const.CLASS_HOVERABLE_ICON);
            // });

            // Show movements
            $(document).on('click', MenuMovs.MENU_ICON, e => {
                $(document).trigger(ControlSettings.EVENT_MOVS_MENU, [main.ctrl.current_active, main.ctrl.current_model_key]);
            });

            $(document).on('click', MenuPatterns.ELEMENT_ID_MENU_ICON, e => {
                that.#manage_patterns_menu();
            });

            $(document).on('click', PanelPatterns.MENU_ICON, e => {
                $(document).trigger(PanelPatterns.EVENT_PATTERNS_RESULTS_AVAILABLE);
            });

            $(document).on(TickerFilter.EVENT_LOAD_HISTORIC, (e, active) => {
                $(document).trigger(MenuMovs.EVENT_CLOSE_MENU);
            });

            // Patterns menu
            $(document).on(ControlSettings.EVENT_PATTERN_MENU, e => {
                that.#manage_patterns_menu();
            });

            $(document).on(MenuPatterns.EVENT_MENU_CLOSE, e => {
                $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).hide();
                $(MenuPatterns.ELEMENT_ID_MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
                $(MenuPatterns.ELEMENT_ID_MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON);
                $(document).trigger(ChartController.EVENT_ENABLE_KEYS);
            });

            // Manages main keyup events
            $(document).on('keyup', e => {
                let ikey = that.keys_down.indexOf(e.keyCode);
                let events;
                if(ikey != -1) {
                    let key_up = that.keys_down.splice(ikey, 1);
                    events = this.#cfg.get(key_up, e.type);
                    //TODO AL ACTIVAR COMANDO DESHABILITAR KEYS DEL CONTROLADOR PARA QUE NO SALTE EL FILTRO NI EL PANEL DE MARCO TEMPORAL
                    if(events.event.length) {
                        events.event.forEach(ev => {
                            e.stopPropagation();
                            e.preventDefault();
                            $(document).trigger(ev, e);
                        });
                    }
                    // else if(events.released.length) {}
                    else {
                        $(document).trigger(ChartController.EVENT_KEYUP, e);
                    }
                }
            });

            // Close all clear keys pressed
            $(document).on(Const.EVENT_CLOSE, e => {
                that.keys_down = [];
                that.#cfg.clear();
            });

            // Manages main keyup events
            $(document).on('keydown', e => {
                if(that.keys_down.indexOf(e.keyCode) === -1) {
                    that.keys_down.push(e.keyCode);
                    let events = this.#cfg.get(that.keys_down, e.type);
                    if(events.event.length) {
                        events.event.forEach(ev => {
                            e.stopPropagation();
                            e.preventDefault();
                            $(document).trigger(ev, e);
                        });
                    }
                    else {
                        $(document).trigger(ChartController.EVENT_KEYDOWN, e);
                    }
                }
            });

            // Clears disable from menu icons
            this.#menus_icons.removeClass(Const.CLASS_DISABLED);

            // Add chart
            let ops; //TODO OPCIONES DE CREACIÓN DE NUEVO CHART (ARRIBA, ABAJO, IZQ. O DERECHA)
            $(EventController.ADD_CHART).on('click', e => $(document).trigger(ChartController.EVENT_ADD_CHART, e, ops));

            console.log("Event Controller Initialized OK.");
        }
        catch(error) {
            console.error("Event Controller NOT Initialized: ", error);
        }
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

}