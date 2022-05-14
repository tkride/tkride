/**file: menu_patterns.js */

class MenuPatterns {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static NAME = 'menu-patterns';
    static TITLE = 'Programar Patrones';

    // Main pattern menu elements
    static ID_MENU_PATTERNS = 'patterns-menu'
    static ELEMENT_ID_MENU_PATTERNS = '#patterns-menu';
    static ELEMENT_ID_MENU_CONTENT = '#patterns-menu-content';
    static MENU_ICON = '#patterns';
    
    //Menu buttons
    static ELEMENT_ID_CLOSE = '#patterns-menu-close';
    static ID_BUTTON_ADD = 'patterns-menu-add';
        static ELEMENT_ID_BUTTON_ADD = '#patterns-menu-add';
    static ID_BUTTON_SAVE = 'patterns-menu-save';
        static ELEMENT_ID_BUTTON_SAVE = '#patterns-menu-save';
    static ID_BUTTON_REMOVE = 'patterns-menu-remove';
        static ELEMENT_ID_BUTTON_DELETE = '#patterns-menu-delete';
    static ID_BUTTON_RESET = 'patterns-menu-reset';
        static ELEMENT_ID_BUTTON_RESET = '#patterns-menu-reset';
    static ID_BUTTON_SUBMIT = 'patterns-menu-submit';
        static ELEMENT_ID_BUTTON_SUBMIT = '#patterns-menu-submit';

    // Retracement menu type elements
    static ELEMENT_ID_TYPE_SELECTED = '#patterns-select-type';
    static PATTERNS_TYPE_OPTIONS = [Const.MOVIMIENTOS_ID, Const.RETROCESOS_ID, Const.TENDENCIA_ID, Const.SIGUIENTE_ID];
    static PATTERN_TYPE_CALLBACK = {};

    // Pattern name and stored pattern dropdown
    static ID_PATTERNS_MENU_PATTERN_NAME = 'patterns-menu-pattern-name';
    static ELEMENT_ID_PATTERNS_MENU_PATTERN_NAME_INPUT = '#patterns-menu-pattern-name-input';
    static ID_PATTERNS_MENU_STORED_PATTERNS = 'patterns-menu-stored-patterns';
    static ELEMENT_ID_PATTERNS_MENU_STORED_PATTERNS = '#patterns-menu-stored-patterns';
    // Pattern type dropdown
    static ID_PATTERNS_MENU_TYPE_SELECT = 'patterns-menu-type';
    static ELEMENT_ID_PATTERNS_MENU_TYPE_SELECT = '#patterns-menu-type';
    // Search in results input and dropdown
    static ID_PATTERNS_MENU_SEARCH_IN_PATTERNS = 'patterns-menu-search-in-patterns';
    static ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_PATTERNS = '#patterns-menu-search-in-patterns';
    // static ID_PATTERNS_MENU_SEARCH_IN_INPUT = 'patterns-menu-search-in-name'; //'search-in-ret-name';
    // static ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT = '#patterns-menu-search-in-name-input';
    // Movements level
    static ID_PATTERNS_MENU_MOV_LEVEL_ID = 'patterns-menu-mov-level';
    static ELEMENT_ID_PATTERNS_MENU_LEVEL_ID_INPUT = '#patterns-menu-mov-level-input';
    // Footer buttons
    static ID_PATTERNS_MENU_FOOTER = 'patterns-menu-footer';
    // All content containers filter
    static ELEMENT_ID_PATTERNS_MENU_CONTENT_ALL = '[id*=patterns-menu-content-]';

    //RETRACEMENTS
    static ID_PATTERNS_MENU_CONTENT_RETRACEMENTS = 'patterns-menu-content-ret';
    static ELEMENT_ID_PATTERNS_MENU_CONTENT_RETRACEMENTS = '#patterns-menu-content-ret';
    // Retracement values
    static ID_PATTERNS_MENU_RET_VALUES = 'patterns-menu-ret-values';
    static ELEMENT_ID_PATTERNS_MENU_RET_VALUES_INPUT = '#patterns-menu-ret-values-input';
    // Retracement from search
    static ID_PATTERNS_MENU_RET_FROM = 'patterns-menu-ret-from';
    static ELEMENT_ID_PATTERNS_MENU_RET_FROM = '#patterns-menu-ret-from';
    // Retracement iterate
    static ID_PATTERNS_MENU_RET_ITERATE = 'patterns-menu-ret-iterate';
    static ELEMENT_ID_PATTERNS_MENU_RET_ITERATE_INPUT = '#patterns-menu-ret-iterate-input';
    // Retracement filter max (movement or retracement)
    static ID_PATTERNS_MENU_RET_FILTER_MAX = 'patterns-menu-ret-filter-max';
    static ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MAX = '#patterns-menu-ret-filter-max';
    // Retracement filter mode (family or interval)
    static ID_PATTERNS_MENU_RET_FILTER_MODE = 'patterns-menu-ret-filter-mode';
    static ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MODE = '#patterns-menu-ret-filter-mode';

    // Filter only max
    static ID_FILTER_MAX = 'patterns-menu-ret-filter-max';
    static NAME_FILTER_MAX = 'filtermax'
    static FILTER_MAX_NO_ID = 'NO';
    static FILTER_MAX_MOV_ID = 'MOVIM.';
    static FILTER_MAX_RET_ID = 'RETROCESO';
    static ONLY_MAX_DEFAULT_VALUE = Const.MAXIMO;

    // Filter mode
    static ID_FILTER_MDOE = 'patterns-menu-ret-filter-mode';
    static NAME_FILTER_MODE = 'filtermode';
    static FILTER_MODE_FAMILY_ID = 'FAMILIA';
    static FILTER_MODE_INTERVAL_ID = 'INTERVALO';
    static FILTER_MODE_DEFAULT_VALUE = Const.FILTER_INTERVAL;

    // Stop data source
    static ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE = 'patterns-menu-ret-levels-data-source';
    static ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE = '#patterns-menu-ret-levels-data-source';
    // Retracement from search
    static ID_PATTERNS_MENU_RET_LEVELS_FROM = 'patterns-menu-ret-levels-from';
    static ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_FROM = '#patterns-menu-ret-levels-from';

    // Events
    static EVENT_BUILD_MENU = 'event-patterns-build-menu';
    static EVENT_SHOW_PATTERNS = 'event-patterns-show-patterns';
    static EVENT_MENU_CLOSE = 'event-patterns-close-patterns-menu';
    // static EVENT_SUBMIT = 'event-patterns-submit';
    // static EVENT_SEARCH_IN_RET_SELECTED = 'event-search-in-ret-selected';
    // static EVENT_CLEAR_FORM = 'event-patterns-clear-form';
    // static EVENT_DELETE_PATTERN = 'event-patterns-delete-pattern';
    // static EVENT_SAVE_PATTERN = 'event-patterns-save-pattern';
    // static EVENT_DDBB_LOAD_USER_PATTERNS = 'event-patterns-ddbb-load-user-patterns';
    // static EVENT_DDBB_DELETE_PATTERN = 'event-patterns-ddbb-delete-pattern';
    // static EVENT_DDBB_SAVE_PATTERN = 'event-patterns-ddbb-save-pattern';
    static EVENT_PATTERNS_MENU_STORED_PATTERN_SELECTED = 'event-patterns-ret-selected';
    static EVENT_TYPE_SELECTED = 'event-patterns-select-type';
    static EVENT_RET_SELECTED = 'event-patterns-ret-selected';
    static EVENT_UPDATE_MODEL = 'event-patterns-update-model';
    // static EVENT_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE_SELECTED = 'patterns-menu-ret-levels-data-source-selected';
    // static EVENT_PATTERNS_MENU_RET_STOP_LEVELS_SELECTED = 'patterns-menu-ret-stop-levels-selected';

//--------------------------------------------------------------------------------------------//

    static SEARCH_IN_OPTIONS_IDS = {
        'search-in-retracements': Const.RETROCESOS_ID,
        'search-in-ret-stored-rets': Const.RETROCESOS_ID,
        'search-in-trends': Const.TENDENCIA_ID,
        'search-in-movements': Const.MOVIMIENTOS_ID,
        'search-in-next': Const.SIGUIENTE_ID,
    };


    static EMPTY_FORM = {
        [Const.TIPO_PARAM_ID]: Const.MOVIMIENTOS_ID,
        [Const.BUSCAR_EN_COMBO_ID]: Const.MOVIMIENTOS_ID,
        [Const.LEVEL_ID]: '1',
        [Const.SEARCH_IN_ID]: '',
        [Const.ID_ID]: '',
        [Const.RET_LEVELS_ID]: '',
        [Const.FROM_ID]: Const.INIT_ID,
        [Const.ITERATE_ID]: '0',
        [Const.ONLY_MAX_ID]: Const.NO,
    };

    //----------------------------- PROPERTIES -----------------------------

    #options = {
        active: false,
        [Const.TIPO_PARAM_ID]: Const.RETROCESOS_ID,
        [Const.BUSCAR_EN_COMBO_ID]: Const.MOVIMIENTOS_ID,
        [Const.ID_ID]: '',
        [Const.VALORES_ID]: '',
        [Const.SENTIDO_ID]: '',
        [Const.DESDE_ID]: '',
        [Const.ITERA_EN_N_ID]: '',
        [Const.SOLO_MAX_ID]: '',
    };

    #display;
    values_hist = [];
    #models;
    stored_compositions = {};
    CALLBACK_LOAD_CONTROLS_VALUES = {};
    CALLBACK_READ_CONTROLS_VALUES = {};

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        this.#models = models;
        if(models == undefined) { console.warn('MODELS NOT DEFINED.'); }
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    #get_clicked_stored_ret(ret_name, e) {
        if(this.#models.patterns) {
            let ret = this.#models.patterns[ret_name];
            if(ret) {
                this.#load_controls_values(ret);
            }
        }
    }

    #load_controls_values(pattern) {
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_PATTERN_NAME_INPUT).val(pattern[Const.ID_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_TYPE_SELECT).data('Dropdown').select(pattern[Const.TIPO_PARAM_ID]);
        // $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT).val(pattern[Const.SEARCH_IN_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_PATTERNS).data('Dropdown').select(pattern[Const.SEARCH_IN_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_LEVEL_ID_INPUT).val(pattern[Const.LEVEL_ID]);

        if(this.CALLBACK_LOAD_CONTROLS_VALUES[pattern[Const.TIPO_PARAM_ID]]) {
            this.CALLBACK_LOAD_CONTROLS_VALUES[pattern[Const.TIPO_PARAM_ID]](pattern);
        }
    }

    #load_controls_values_movements(pattern) {
    }

    #load_controls_values_retracements(pattern) {
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FROM).data('RadioButton').selected = pattern[Const.FROM_ID];
        // this.set_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FROM, pattern[Const.FROM_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_ITERATE_INPUT).val(pattern[Const.ITERATE_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_VALUES_INPUT).val(pattern[Const.RET_LEVELS_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MAX).data('RadioButton').selected = pattern[Const.ONLY_MAX_ID];
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MODE).data('RadioButton').selected = pattern[Const.FILTER_MODE_ID];
        // this.set_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FILTER_MAX, pattern[Const.ONLY_MAX_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE).data('Dropdown').select(pattern[Const.RET_LEVELS_DATA_SOURCE_ID]);
        // $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_FROM).data('RadioButton').selected = pattern[Const.RET_LEVELS_FROM_ID];
    }

    #load_controls_values_trends(pattern) {
    }

    #load_controls_values_next(pattern) {
    }

    #read_controls_values() {
        let pattern = {};
        try {
            pattern[Const.ID_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_PATTERN_NAME_INPUT).val();
            pattern[Const.TIPO_PARAM_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_TYPE_SELECT).data('Dropdown').selected;
            // pattern[Const.SEARCH_IN_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT).val();
            pattern[Const.SEARCH_IN_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_PATTERNS).data('Dropdown').selected;
            pattern[Const.LEVEL_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_LEVEL_ID_INPUT).val();
    
            if(this.CALLBACK_READ_CONTROLS_VALUES[pattern[Const.TIPO_PARAM_ID]]) {
                let pattern_type = this.CALLBACK_READ_CONTROLS_VALUES[pattern[Const.TIPO_PARAM_ID]]();
                pattern = { ...pattern, ...pattern_type };
            }
        }
        catch(error) {
            console.error(`ERROR: MenuPatterns::#read_controls_values: ${error}`);
        }
        return pattern;
    }

    #read_controls_values_movements() {
    }
    
    #read_controls_values_retracements() {
        let pattern = {};
        pattern[Const.FROM_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FROM).data('RadioButton').selected;
        // pattern[Const.FROM_ID] = that.get_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FROM);
        pattern[Const.ITERATE_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_ITERATE_INPUT).val();
        pattern[Const.RET_LEVELS_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_VALUES_INPUT).val();
        pattern[Const.ONLY_MAX_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MAX).data('RadioButton').selected;
        // pattern[Const.ONLY_MAX_ID] = that.get_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FILTER_MAX);
        pattern[Const.FILTER_MODE_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MODE).data('RadioButton').selected;
        pattern[Const.RET_LEVELS_DATA_SOURCE_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE).data('Dropdown').selected;
        // pattern[Const.RET_LEVELS_FROM_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_FROM).data('RadioButton').selected;
        return pattern;
    }
    
    #read_controls_values_trends() {
    }
    
    #read_controls_values_next() {

    }

    #delete_pattern() {
        let values = this.#read_controls_values();
        let pattern = { [Const.NAME_ID]: values[Const.ID_ID ]};
        // $(document).trigger(MenuPatterns.EVENT_DDBB_DELETE_PATTERN, [pattern]);
        $(document).trigger(Const.EVENT_DDBB_DELETE_MODEL, [MenuPatterns.NAME, pattern]);
    }
    
    #save_pattern() {
        // Get stored info from controls
        let pattern = this.#read_controls_values();
        if(pattern[Const.ID_ID]) {
            // Send DDBB query via chart controller
            // $(document).trigger(MenuPatterns.EVENT_DDBB_SAVE_PATTERN, [pattern]);
            $(document).trigger(Const.EVENT_DDBB_SAVE_MODEL, [MenuPatterns.NAME, pattern]);
        }
    }

    #create_menu() {
        // Creates main menu container
        this.#display = new Display({ id: MenuPatterns.ID_MENU_PATTERNS,
                                      title: 'Patrones',
                                      title_css: { 'font-size': '1.25em' },
                                      css: { padding: '0.7em' },
                                      top:'15%',
                                      left:'30%',
                                      draggable: true,
                                    //   new_classes: 'scroll-custom',
                                      overflow: false,
                                    //   width: '300px',
                                     });
        this.#display.element_handle_close.on('click', e =>  $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE) );
        this.#display.control.hide();

        // Add separator
        this.#display.append(Display.build_separator());

        // Appends common controls to menu panel display
        // Creates name input box
        let name = new Inputbox({
                                    id: MenuPatterns.ID_PATTERNS_MENU_PATTERN_NAME,
                                    container: { class: Const.CLASS_MENU_FIELD },
                                    label: { text: 'Nombre', position: Const.LABEL_POSITION_BEFORE },
                                    input: { class: Const.CLASS_TEXT_INPUT,
                                             placeholder: 'Nombre del patrón  ',
                                             css: { 'max-width': '9em',  'font-size': '0.8em' },
                                    }
                                });

        let stored_patterns = new Dropdown({
                                        id: MenuPatterns.ID_PATTERNS_MENU_STORED_PATTERNS,
                                        items: [],
                                        event: MenuPatterns.EVENT_PATTERNS_MENU_STORED_PATTERN_SELECTED,
                                        header: { arrow: true },
                                        css: { items: { 'font-size': '0.8em', 'font-weight': '400', left: '-50%' } },
                                        parent: this.#display.control,
                                    });
        stored_patterns.controls.each( (i, c) => name.control.append(c) );
        $(document).on(MenuPatterns.EVENT_PATTERNS_MENU_STORED_PATTERN_SELECTED, (e, ret_name) => {
            this.#get_clicked_stored_ret(ret_name)
        });
        // Append control element to display
        this.#display.append_content(name.control);

        // Creates pattern type selection combo box
        let types_container = $('<div>', { class: Const.CLASS_MENU_FIELD});
        let types_label = $('<p>', { text: 'Tipo' });
        types_container.append(types_label);
        let types_combobox = new Dropdown({
                                            id: MenuPatterns.ID_PATTERNS_MENU_TYPE_SELECT,
                                            items: MenuPatterns.PATTERNS_TYPE_OPTIONS,
                                            event: MenuPatterns.EVENT_TYPE_SELECTED,
                                            header: { selected: true },
                                            css: { container: { 'font-size': '1em', 'font-weight': '400' } },
                                            parent: this.#display.control,
                                        });
        types_combobox.controls.each( (i, c) => types_container.append(c) );
        // Append control element to display
        this.#display.append_content(types_container);
        //Build type selected event
        $(document).on(MenuPatterns.EVENT_TYPE_SELECTED, (e, type) => {
            $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_CONTENT_ALL).hide();
            if(MenuPatterns.PATTERN_TYPE_CALLBACK[type]) {
                MenuPatterns.PATTERN_TYPE_CALLBACK[type]();
            }
            else console.warn(`WARNING: Selected pattern type ${type} don't defined.`);
        });

        // Creates pattern results search in selection
        // let results = new Inputbox({
        //                             id: MenuPatterns.ID_PATTERNS_MENU_SEARCH_IN_INPUT,
        //                             container: { class: Const.CLASS_MENU_FIELD },
        //                             input: { placeholder: 'Bucar en resultado... ' }
        //                          });
        let searchin_combobox = new Dropdown({
                                            id: MenuPatterns.ID_PATTERNS_MENU_SEARCH_IN_PATTERNS,
                                            items: [],
                                            // event: MenuPatterns.EVENT_SEARCH_IN_RET_SELECTED,
                                            class: Const.CLASS_MENU_FIELD,
                                            header: { selected: true, label: { text: 'Buscar en resultado', position: Const.LABEL_POSITION_BEFORE} },
                                            css: { items: { 'font-size': '0.8em', 'font-weight': '400', left: '-50%' } },
                                            parent: this.#display.control,
                                        });
        searchin_combobox.controls.each( (i, c) => this.#display.append_content(c) );
        
        // Nivel de movimientos
        let mov_level = new Inputbox({
            id: MenuPatterns.ID_PATTERNS_MENU_MOV_LEVEL_ID,
            container: { class: Const.CLASS_MENU_FIELD },
            label: { text: 'Nivel movimiento', position: Const.LABEL_POSITION_BEFORE },
            input: { class: Const.CLASS_MENU_INPUT_SHORT, text: '1' }
         });
        // Append control element to display
         this.#display.append_content(mov_level.control);

        // Add content menu ----------------------------------------------------------
        this.#create_menu_movements();
        this.#create_menu_retracements();
        this.#create_menu_trends();
        this.#create_menu_next();
        this.#create_menu_buttons();
    }

    #create_menu_movements() {
    }

    #create_menu_retracements() {
        let ret_content = $('<div>', { id: MenuPatterns.ID_PATTERNS_MENU_CONTENT_RETRACEMENTS } );
        ret_content.css({ margin: '0', display: 'none' });

        // Add separator
        ret_content.append(Display.build_separator());

        // Add retracement values
        let ret_values = new Inputbox({
            id: MenuPatterns.ID_PATTERNS_MENU_RET_VALUES,
            container: { class: Const.CLASS_MENU_FIELD, tooltip: 'Valores de retroceso de fibonacci (ej: 0.23, 0.382, >0.618). Admite operadores > y <.)' },
            input: { css: {'min-width': '13.5em' },  placeholder: 'Valores retroceso Fibonacci  ' }
            });
        // Append control element to display
        ret_content.append(ret_values.control);

        // Add from option
        let from = new RadioButton({
                                        id: MenuPatterns.ID_PATTERNS_MENU_RET_FROM,
                                        container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
                                        name: Const.FROM_ID,
                                        label: { text: 'Desde', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
                                        buttons: { values: {
                                                            [Const.INICIO_ID]: Const.INIT_ID,
                                                            [Const.FIN_ID]: Const.END_ID,
                                                            [Const.CORRECCION_DESDE_ID]: Const.CORRECTION_ID
                                                    },
                                                    checked: Const.INIT_ID,
                                                    class: Const.CLASS_BUTTON_GENERAL,
                                                    css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
                                                }
                                    });
        // Append control element to display
        ret_content.append(from.control);

        // Add iterate value
        let iterate = new Inputbox({
            id: MenuPatterns.ID_PATTERNS_MENU_RET_ITERATE,
            container: { class: Const.CLASS_MENU_FIELD },
            label: { text: 'Itera búsqueda', position: Const.LABEL_POSITION_BEFORE },
            input: { class: Const.CLASS_MENU_INPUT_SHORT, text: '0' }
        });
        // Append control element to display
        ret_content.append(iterate.control);

        // Add filter max option
        let filter_max = new RadioButton({
            id: MenuPatterns.ID_PATTERNS_MENU_RET_FILTER_MAX,
            container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
            name: MenuPatterns.NAME_FILTER_MAX,
            label: { text: 'Solo máximo', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
            buttons: { values: {
                                [MenuPatterns.FILTER_MAX_NO_ID]: Const.NO,
                                [MenuPatterns.FILTER_MAX_MOV_ID]: Const.MOVIMIENTO,
                                [MenuPatterns.FILTER_MAX_RET_ID]: Const.RETROCESO
                        },
                        checked: Const.NO,
                        class: Const.CLASS_BUTTON_GENERAL,
                        css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
                    }
        });

        // Append control element to display
        ret_content.append(filter_max.control);

        // Add filter max option
        let filter_mode = new RadioButton({
            id: MenuPatterns.ID_PATTERNS_MENU_RET_FILTER_MODE,
            container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
            name: MenuPatterns.NAME_FILTER_MODE,
            label: { text: 'Modo filtro', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
            buttons: { values: {
                                [MenuPatterns.FILTER_MODE_FAMILY_ID]: Const.FILTER_FAMILY,
                                [MenuPatterns.FILTER_MODE_INTERVAL_ID]: Const.FILTER_INTERVAL,
                        },
                        checked: Const.FILTER_INTERVAL,
                        class: Const.CLASS_BUTTON_GENERAL,
                        css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
                    }
        });
        // Append control element to display
        ret_content.append(filter_mode.control);

        // Append levels data source
        let levels_data_source = new Dropdown({
            id: MenuPatterns.ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE,
            // items: Object.keys(this.#models.patterns),
            items: [],
            // event: MenuPatterns.EVENT_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE_SELECTED,
            class: Const.CLASS_MENU_FIELD,
            header: { selected: true, label: { text: 'Datos fuente de niveles', position: Const.LABEL_POSITION_BEFORE } },
            css: { items: { 'font-size': '0.8em', 'font-weight': '400' } },
            parent: ret_content,
        });
        levels_data_source.controls.each( (i, c) => ret_content.append(c) );

        // // Add from option
        // let levels_from = new RadioButton({
        //     id: MenuPatterns.ID_PATTERNS_MENU_RET_LEVELS_FROM,
        //     container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
        //     name: Const.FROM_STOP_ID,
        //     label: { text: 'Desde de niveles', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
        //     buttons: { values: {
        //                         [Const.INICIO_ID]: Const.INIT_ID,
        //                         [Const.FIN_ID]: Const.END_ID,
        //                         [Const.CORRECCION_DESDE_ID]: Const.CORRECTION_ID
        //                 },
        //                 checked: Const.INIT_ID,
        //                 class: Const.CLASS_BUTTON_GENERAL,
        //                 css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
        //             }
        // });
        // // Append control element to display
        // ret_content.append(levels_from.control);

        // Append control element to display
        this.#display.append_content(ret_content);
    }

    #create_menu_trends() {
    }

    #create_menu_next() {
    }

    #create_menu_buttons() {
        var that = this;
        let menu_footer = $('<div>', {
            id: MenuPatterns.ID_PATTERNS_MENU_FOOTER,
            css: {
                'margin': '0 0 4em 1em',
            },
        });

        // Add button add pattern
        let button_add = $('<div>', {
            id: MenuPatterns.ID_BUTTON_ADD,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_ADD}`,
            title: 'Agregar patrón al proceso'
        });
        menu_footer.append(button_add);

        // Add button save pattern
        let button_save = $('<div>', {
            id: MenuPatterns.ID_BUTTON_SAVE,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_SAVE}`,
            title: 'Guardar patrón'
        });
        menu_footer.append(button_save);
        // button_save.on('click', e => $(document).trigger(MenuPatterns.EVENT_SAVE_PATTERN))
        button_save.on('click', e => this.#save_pattern())

        // Add button delete pattern
        let button_delete = $('<div>', {
            id: MenuPatterns.ID_BUTTON_REMOVE,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_REMOVE}`,
            title: 'Eliminar patrón'
        });
        menu_footer.append(button_delete);
        // button_delete.on('click', e => $(document).trigger(MenuPatterns.EVENT_DELETE_PATTERN));
        button_delete.on('click', e => this.#delete_pattern());

        // Add button reset form
        let button_reset = $('<div>', {
            id: MenuPatterns.ID_BUTTON_RESET,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_CLEAR}`,
            title: 'Limpiar formulario'
        });
        menu_footer.append(button_reset);
        // button_reset.on('click', e => $(document).trigger(MenuPatterns.EVENT_CLEAR_FORM));
        button_reset.on('click', e => this.#load_controls_values(MenuPatterns.EMPTY_FORM));

        // Add button submit form to process pattern
        let button_submit = $('<div>', {
            id: MenuPatterns.ID_BUTTON_SUBMIT,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS}`,
            text: 'Aplicar',
            title: 'Procesar patrones definidos'
        });
        menu_footer.append(button_submit);
        // Click button action
        // button_submit.on('click', e => $(document).trigger(MenuPatterns.EVENT_SUBMIT) );
        button_submit.on('click', e => {
            that.#options = that.#read_controls_values();
            that.values_hist.push(that.#options);
            $(document).trigger(MenuPatterns.EVENT_SHOW_PATTERNS, that.#options);
            $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE);
            $(MenuPatterns.ELEMENT_ID_MENU_CONTENT).unbind('keyup');
            console.log(that.#options);
        });

        this.#display.append(menu_footer);
    }

    // SHOW CONTENT MENUS FOR EACH PATTERN TYPES
    #show_menu_movements() {
    }
    
    #show_menu_retracements() {
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_CONTENT_RETRACEMENTS).show();
    }

    #show_menu_trends() {
    }

    #show_menu_next() {
    }

    #update_model() {
        // Update patterns list
        let patterns_dd = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_STORED_PATTERNS).data('Dropdown');
        patterns_dd.items = Object.keys(this.#models.patterns);
        let searchin_combobox = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_PATTERNS).data('Dropdown');
        
        let selected = searchin_combobox.selected;
        searchin_combobox.items = Object.keys(this.#models.patterns);
        if(searchin_combobox.items.includes(selected)) { searchin_combobox.selected = selected; }
        
        let levels_data_source = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE).data('Dropdown');
        selected = levels_data_source.selected;
        levels_data_source.items = Object.keys(this.#models.patterns);
        if(levels_data_source.items.includes(selected)) { levels_data_source.selected = selected; }
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        var that = this;
        try {
            $(MenuPatterns.MENU_ICON).prop('title', MenuPatterns.TITLE);

            MenuPatterns.PATTERN_TYPE_CALLBACK = {
                [Const.MOVIMIENTOS_ID]: this.#show_menu_movements,
                [Const.RETROCESOS_ID]: this.#show_menu_retracements,
                [Const.TENDENCIA_ID]: this.#show_menu_trends,
                [Const.SIGUIENTE_ID]: this.#show_menu_next,
            };
            
            this.CALLBACK_READ_CONTROLS_VALUES = {
                [Const.MOVIMIENTOS_ID]: this.#read_controls_values_movements,
                [Const.RETROCESOS_ID]: this.#read_controls_values_retracements,
                [Const.TENDENCIA_ID]: this.#read_controls_values_trends,
                [Const.SIGUIENTE_ID]: this.#read_controls_values_next,
            }
            
            this.CALLBACK_LOAD_CONTROLS_VALUES = {
                [Const.MOVIMIENTOS_ID]: this.#load_controls_values_movements,
                [Const.RETROCESOS_ID]: this.#load_controls_values_retracements,
                [Const.TENDENCIA_ID]: this.#load_controls_values_trends,
                [Const.SIGUIENTE_ID]: this.#load_controls_values_next,
            }

            this.#create_menu();

            // $(document).on(MenuPatterns.EVENT_SEARCH_IN_RET_SELECTED, (e, ret_name, el) => {
                // $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT).val(ret_name);
            // });

            // $(document).on(MenuPatterns.EVENT_CLEAR_FORM, e => this.#load_controls_values(MenuPatterns.EMPTY_FORM));

            // $(document).on(MenuPatterns.EVENT_DELETE_PATTERN, e => this.#delete_pattern());

            // $(document).on(MenuPatterns.EVENT_SAVE_PATTERN, e => this.#save_pattern());

            $(document).on(Const.EVENT_CLOSE, e => $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE));

            $(document).on('click', MenuPatterns.ELEMENT_ID_CLOSE, e => $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE));

            // $(document).on(MenuPatterns.EVENT_SUBMIT, e => {
            //     that.#options = that.#read_controls_values();
            //     that.values_hist.push(that.#options);
            //     $(document).trigger(MenuPatterns.EVENT_SHOW_PATTERNS, that.#options);
            //     $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE);
            //     $(MenuPatterns.ELEMENT_ID_MENU_CONTENT).unbind('keyup');
            //     console.log(that.#options);
            // });

            $(document).on(MenuPatterns.EVENT_BUILD_MENU, e => { $(MenuPatterns.ELEMENT_ID_TYPE_SELECTED).val('RETROCESOS').change(); });

            $(document).on(Const.EVENT_UPDATE_MODEL, (e, source) => {
                if(source == MenuPatterns.NAME) {
                    this.#update_model();
                }
            });
        }
        catch(error) {
            console.error(error);
        }
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    static is_visible() { return $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).is(':visible'); }

    get options() { return this.#options; }

    get_radio(name) { return $('#' + name + ' input:checked').val(); }
    
    set_radio(name, val) { $('#' + name + ' input[value=' + val +']').prop('checked', true); }
    
}