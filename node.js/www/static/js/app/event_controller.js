/**file: event_controller.js */

class EventController {
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static ELEMENT_CLASS_RIGHT_MENU = '.right-menu';
    static ELEMENT_CLASS_FOOTER_MENU = '.footer-menu';
    static ELEMENT_CLASS_FOOTER_MENU_OPTIONS = '.footer-menu-options';
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
            $(mi).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            // $(mi).addClass(Const.CLASS_HOVERABLE_ICON);
        });
        $(sel_icon).addClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
    }

    #manage_patterns_menu() {
        if(MenuPatterns.is_visible()) {
            $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).hide();
            $(MenuPatterns.MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            // $(MenuPatterns.MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON);
            $(document).trigger(ChartController.EVENT_ENABLE_KEYS);
        }
        else {
            $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).show();
            $(document).trigger(MenuPatterns.EVENT_BUILD_MENU);
            $(MenuPatterns.MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            // $(MenuPatterns.MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON);
            $(document).trigger(ChartController.EVENT_DISABLE_KEYS);
            $(document).trigger(Const.EVENT_UPDATE_MODEL, [MenuPatterns.NAME]);
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
            this.#menus_icons = $(`${EventController.ELEMENT_CLASS_RIGHT_MENU},
                                    ${EventController.ELEMENT_CLASS_FOOTER_MENU}`)
                                .children();

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

            // Show movements
            $(document).on('click', MenuMovs.MENU_ICON, e => {
                $(document).trigger(ControlSettings.EVENT_MOVS_MENU, [main.ctrl.activeChart.active, main.ctrl.activeChart.modelKey]);
            });

            // Show Patterns Menu
            $(document).on('click', MenuPatterns.MENU_ICON, e => {
                that.#manage_patterns_menu();
            });

            // Show Patterns Results Menu
            $(document).on('click', PanelPatterns.MENU_ICON, e => {
                $(document).trigger(PanelPatterns.EVENT_PATTERNS_RESULTS_AVAILABLE);
            });

            // TODO XXX GESTIONAR EVENTO DE FORMA GENERICA
            Conf.getGraphicControlsNames().forEach( g => {
                let menuClass = Conf.getGraphicControlsMenu(g);
                let graphicClass = eval(g);
                $(document).on('click', menuClass.MENU_ICON, e => {
                    // $(document).trigger(graphicClass.EVENT_CREATE);
                    $(document).trigger(ChartComponent.EVENT_CREATE, graphicClass);
                    $(menuClass.MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
                    // $(menuClass.MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON);
                    $(document).trigger(ChartController.EVENT_DISABLE_KEYS);
                    $(document).trigger(Const.EVENT_UPDATE_MODEL, [g]);
                });
            });

            // Load historic event
            $(document).on(TickerFilter.EVENT_LOAD_HISTORIC, (e, active) => {
                $(document).trigger(MenuMovs.EVENT_CLOSE_MENU);
            });

            // Patterns menu
            $(document).on(ControlSettings.EVENT_PATTERN_MENU, e => {
                that.#manage_patterns_menu();
            });

            $(document).on(MenuPatterns.EVENT_MENU_CLOSE, e => {
                $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).hide();
                $(MenuPatterns.MENU_ICON).removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
                // $(MenuPatterns.MENU_ICON).addClass(Const.CLASS_HOVERABLE_ICON);
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