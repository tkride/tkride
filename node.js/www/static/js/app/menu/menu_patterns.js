/**file: menu_patterns.js */

class MenuPatterns {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static NAME = 'menu-patterns';
    static TITLE = 'Programar Patrones';

    // Main pattern menu elements
    static ID_MENU_PATTERNS = 'patterns-menu'
    static ELEMENT_ID_MENU_PATTERNS = '#patterns-menu';
    static ELEMENT_ID_MENU_CONTENT = '#patterns-menu-content';
    static ELEMENT_ID_MENU_ICON = '#patterns';
    
    //Menu buttons
    static ID_BUTTON_ADD = 'patterns-menu-add';
        static ELEMENT_ID_BUTTON_ADD = '#patterns-menu-add';
    static ID_BUTTON_SAVE = 'patterns-menu-save';
        static ELEMENT_ID_BUTTON_SAVE = '#patterns-menu-save';
    static ID_BUTTON_CLEAR = 'patterns-menu-clear';
        static ELEMENT_ID_BUTTON_CLEAR = '#patterns-menu-clear';
    static ID_BUTTON_SUBMIT = 'patterns-menu-submit';
        static ELEMENT_ID_BUTTON_SUBMIT = '#patterns-menu-submit';

    // Retracement menu type elements
    // Pattern name and stored pattern dropdown
    static ID_PATTERNS_MENU_PATTERN_NAME = 'patterns-menu-pattern-name';
    static ELEMENT_ID_PATTERNS_MENU_PATTERN_NAME_INPUT = '#patterns-menu-pattern-name-input';
    static ID_PATTERNS_MENU_STORED_PATTERNS = 'patterns-menu-stored-patterns';
    // Pattern type dropdown
    static ID_PATTERNS_MENU_TYPE_SELECT = 'patterns-menu-type';
    static ELEMENT_ID_PATTERNS_MENU_TYPE_SELECT = '#patterns-menu-type';
    // Search in results input and dropdown
    static ID_PATTERNS_MENU_SEARCH_IN_INPUT = 'patterns-menu-search-in-name'; //'search-in-ret-name';
    static ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT = '#patterns-menu-search-in-name-input';
    // Movements level
    static ID_PATTERNS_MENU_MOV_LEVEL_ID = 'patterns-menu-mov-level';
    static ELEMENT_ID_PATTERNS_MENU_LEVEL_ID = '#patterns-menu-mov-level';
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
        
    // Filter only max
    static ID_FILTER_MAX = 'patterns-menu-ret-filter-max';
    static NAME_FILTER_MAX = 'filtermax'
    static FILTER_MAX_NO_ID = 'NO';
    static FILTER_MAX_MOV_ID = 'MOVIM.';
    static FILTER_MAX_RET_ID = 'RETROCESO';
    static ONLY_MAX_DEFAULT_VALUE = Const.MAXIMO;

    // Retracements combobox
    static ELEMENT_ID_TYPE_SELECTED = '#patterns-select-type';
    static PATTERNS_TYPE_OPTIONS = [Const.MOVIMIENTOS_ID, Const.RETROCESOS_ID, Const.TENDENCIA_ID, Const.SIGUIENTE_ID];
    static PATTERN_TYPE_CALLBACK = {};

    static ELEMENT_ID_CLOSE = '#patterns-menu-close';

//--------------------------------------------------------------------------------------------//

    static SEARCH_IN_OPTIONS_IDS = {
        'search-in-retracements': Const.RETROCESOS_ID,
        'search-in-ret-stored-rets': Const.RETROCESOS_ID,
        'search-in-trends': Const.TENDENCIA_ID,
        'search-in-movements': Const.MOVIMIENTOS_ID,
        'search-in-next': Const.SIGUIENTE_ID,
    };


    // Events
    static EVENT_BUILD_MENU = 'event-patterns-build-menu';
    static EVENT_SHOW_PATTERNS = 'event-patterns-show-patterns';
    static EVENT_MENU_CLOSE = 'event-patterns-close-patterns-menu';
    static EVENT_SUBMIT = 'event-patterns-submit';
    static EVENT_SEARCH_IN_RET_SELECTED = 'event-search-in-ret-selected';
    static EVENT_CLEAR_FORM = 'event-patterns-clear-form';
    static EVENT_PATTERNS_MENU_STORED_PATTERN_SELECTED = 'event-patterns-ret-selected';
    static EVENT_TYPE_SELECTED = 'event-patterns-select-type';

    static EVENT_RET_SELECTED = 'event-patterns-ret-selected';

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

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(model) {
        this.init(model);
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
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT).val(pattern[Const.SEARCH_IN_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_LEVEL_ID).val(pattern[Const.LEVEL_ID]);

// xxx //TODO CARGAR SEGUN SELECCION DE TIPO

        // $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FROM).data('RadioButton').selected = pattern[Const.FROM_ID];
        this.set_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FROM, pattern[Const.FROM_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_ITERATE_INPUT).val(pattern[Const.ITERATE_ID]);
        $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_VALUES_INPUT).val(pattern[Const.RET_LEVELS_ID]);
        // $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MAX).data('RadioButton').selected = pattern[Const.ONLY_MAX_ID];
        this.set_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FILTER_MAX, pattern[Const.ONLY_MAX_ID]);
    }

    #read_controls_values() {
        let pattern = {};
        try {
            pattern[Const.ID_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_PATTERN_NAME_INPUT).val();
            pattern[Const.TIPO_PARAM_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_TYPE_SELECT).data('Dropdown').selected;
            pattern[Const.SEARCH_IN_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT).val();
            pattern[Const.LEVEL_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_LEVEL_ID).val();
    
// xxx //TODO LEER SEGUN SELECCION DE TIPO

            // pattern[Const.FROM_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FROM).data('RadioButton').selected;
            pattern[Const.FROM_ID] = this.get_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FROM);
            pattern[Const.ITERATE_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_ITERATE_INPUT).val();
            pattern[Const.RET_LEVELS_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_VALUES_INPUT).val();
            // pattern[Const.ONLY_MAX_ID] = $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_RET_FILTER_MAX).data('RadioButton').selected;
            pattern[Const.ONLY_MAX_ID] = this.get_radio(MenuPatterns.ID_PATTERNS_MENU_RET_FILTER_MAX);
        }
        catch(error) {
            console.error(`ERROR: MenuPatterns::#read_controls_values: ${error}`);
        }
        return pattern;
    }

    #create_menu() {
        // Creates main menu container
        this.#display = new Display({ id: MenuPatterns.ID_MENU_PATTERNS,
                                      title: 'Patrones',
                                      center:true,
                                      draggable: true,
                                      new_classes: 'scroll-custom',
                                      //show: false,
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
                                    input: { class: Const.CLASS_TEXT_INPUT, placeholder: 'Nombre del patrón  ' },
                                });

        let stored_patterns = new Dropdown({
                                        id: MenuPatterns.ID_PATTERNS_MENU_STORED_PATTERNS,
                                        items: Object.keys(this.#models.patterns),
                                        event: MenuPatterns.EVENT_PATTERNS_MENU_STORED_PATTERN_SELECTED,
                                        header: { arrow: true },
                                        css: { items: { 'font-size': '0.8em', 'font-weight': '400' } },
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
        let results = new Inputbox({
                                    id: MenuPatterns.ID_PATTERNS_MENU_SEARCH_IN_INPUT,
                                    container: { class: Const.CLASS_MENU_FIELD },
                                    input: { placeholder: 'Bucar en resultado... ' }
                                 });
        let searchin_combobox = new Dropdown({
                                            id: MenuPatterns.ID_PATTERNS_MENU_STORED_PATTERNS,
                                            items: Object.keys(this.#models.patterns),
                                            event: MenuPatterns.EVENT_SEARCH_IN_RET_SELECTED,
                                            header: { arrow: true },
                                            css: { items: { 'font-size': '0.8em', 'font-weight': '400' } },
                                        });
        searchin_combobox.controls.each( (i, c) => results.control.append(c) );
        // Append control element to display
        this.#display.append_content(results.control);
        
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
        // this.display.append(from.control);
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
        
        // Append control element to display
        this.#display.append_content(ret_content);
    }

    #create_menu_trends() {
    }

    #create_menu_next() {
    }

    #create_menu_buttons() {
        let menu_footer = $('<div>', { id: MenuPatterns.ID_PATTERNS_MENU_FOOTER });
        menu_footer.css( {
            // 'margin-right': '1em',
            // 'padding-bottom': '2em',
            // 'height': '5em',
        });

        // Add separator
        // menu_footer.append(Display.build_separator({ css: { 'width': '310px' } }));

        // Add button add pattern
        let button_add = $('<div>', {
                            id: MenuPatterns.ID_BUTTON_ADD,
                            class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_ADD}`,
                            title: 'Agregar patrón al proceso'
        });
        menu_footer.append(button_add);

        // Add button save pattern
        let button_save = $('<div>', {
            id: MenuPatterns.ID_BUTTON_SAVE,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_SAVE}`,
            title: 'Guardar patrón'
        });
        menu_footer.append(button_save);

        // Add button clear form
        let button_clear = $('<div>', {
            id: MenuPatterns.ID_BUTTON_CLEAR,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_CLEAR}`,
            title: 'Limpiar formulario'
        });
        menu_footer.append(button_clear);
        // button_clear.on('click', e => this.#load_controls_values(MenuPatterns.EMPTY_FORM) );
        button_clear.on('click', e => $(document).trigger(MenuPatterns.EVENT_CLEAR_FORM));

        // Add button submit form to process pattern
        let button_submit = $('<div>', {
            id: MenuPatterns.ID_BUTTON_SUBMIT,
            class: `${Const.CLASS_BUTTON_GENERAL}`,
            text: 'Aplicar',
            title: 'Procesar patrones definidos'
        });
        menu_footer.append(button_submit);
        // Click button action
        button_submit.on('click', e => $(document).trigger(MenuPatterns.EVENT_SUBMIT) );

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

    //----------------------------- PUBLIC METHODS -----------------------------

    init(models) {
        var that = this;

        // Loads model data
        if(models) {
            this.#models = models;
        }
        else console.warn('Patterns Model not defined.');

        MenuPatterns.PATTERN_TYPE_CALLBACK = {
            [Const.MOVIMIENTOS_ID]: this.#show_menu_movements,
            [Const.RETROCESOS_ID]: this.#show_menu_retracements,
            [Const.TENDENCIA_ID]: this.#show_menu_trends,
            [Const.SIGUIENTE_ID]: this.#show_menu_next,
        };

        this.#create_menu();

        $(document).on(MenuPatterns.EVENT_SEARCH_IN_RET_SELECTED, (e, ret_name, el) => {
            $(MenuPatterns.ELEMENT_ID_PATTERNS_MENU_SEARCH_IN_INPUT).val(ret_name);
        });

        $(document).on(MenuPatterns.EVENT_CLEAR_FORM, e => this.#load_controls_values(MenuPatterns.EMPTY_FORM));

        $(document).on(Const.EVENT_CLOSE, e => $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE));

        $(document).on('click', MenuPatterns.ELEMENT_ID_CLOSE, e => $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE));

        $(document).on(MenuPatterns.EVENT_SUBMIT, e => {
            that.#options = that.#read_controls_values();
            that.values_hist.push(that.#options);
            $(document).trigger(MenuPatterns.EVENT_SHOW_PATTERNS, that.#options);
            $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE);
            $(MenuPatterns.ELEMENT_ID_MENU_CONTENT).unbind('keyup');
            console.log(that.#options);
        });

        $(document).on(MenuPatterns.EVENT_BUILD_MENU, e => { $(MenuPatterns.ELEMENT_ID_TYPE_SELECTED).val('RETROCESOS').change(); });
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    static is_visible() { return $(MenuPatterns.ELEMENT_ID_MENU_PATTERNS).is(':visible'); }

    get options() { return this.#options; }

    get_radio(name) { return $('#' + name + ' input:checked').val(); }
    
    set_radio(name, val) { $('#' + name + ' input[value=' + val +']').prop('checked', true); }
    
}