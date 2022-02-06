/**file: menu_patterns.js */

class MenuPatterns {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static NAME = 'menu-patterns';
    static TITLE = 'Programar Patrones';

    // Main pattern menu elements
    static MENU = '#patterns-menu';
    static MENU_CONTENT = '#patterns-menu-content';
    static MENU_ICON = '#patterns';
    static ADD = '#patterns-menu-add';
    static SAVE = '#patterns-menu-save';
    static CLEAR_FORM = '#patterns-menu-clear';
    static SUBMIT = '#patterns-menu-submit';
    // static SUBMIT_CLICKED = 'patterns-menu-submit-clicked';
    // static TITLE = '#patterns-menu-title';
    static TYPE_RADIO = "input[type='radio']";

    // Generic definitions
    static RETROCESOS = 'RETROCESOS';
    static MOVIMIENTOS = 'MOVIMIENTOS';
    static TENDENCIAS = 'TENDENCIAS';
    static SIGUIENTE = 'SIGUIENTE';

    // Retracement menu type elements
    static MENU_RET = '#patterns-menu-ret';
    static SELECT_TYPE_CONTAINER = '#patterns-menu-ret-type-combo';
    static SEARCH_IN_CONTAINER = '#patterns-menu-ret-search-in-combo';
    static RET_ID = '#patterns-menu-ret-name-input';
    static VALUES = '#patterns-menu-ret-values-input';
    static SENSE = '#patterns-menu-ret-sense';
        static SENSE_DEFAULT_VALUE = Const.ALCISTA_ID;
    static FROM = '#patterns-menu-ret-from';
        static FROM_DEFAULT_VALUE = Const.INICIO_MOV_ID;
    static ITERATE = '#patterns-menu-ret-iterate-input';
    static ONLY_MAX = '#patterns-menu-ret-only-max';
        static ONLY_MAX_DEFAULT_VALUE = Const.MAXIMO;
    // Retracements comboboxed
    static PATTERN_TYPE_SELECT = 'patterns-select-type'
    static TYPE_SELECTED = '#patterns-select-type';
    static PATTERNS_TYPE_OPTIONS = [Const.MOVIMIENTOS_ID, Const.RETROCESOS_ID, Const.TENDENCIA_ID, Const.SIGUIENTE_ID];
    static ID_PATTERN_SEARCH_IN_SELECT = 'patterns-select-search-in';
    static NAME_PATTERN_SEARCH_IN_SELECT = Const.BUSCAR_EN_COMBO_ID;
    static SEARCH_IN_SELECTED = '#patterns-select-search-in';
    // static PATTERNS_SEARCH_IN_OPTIONS = [Const.MOVIMIENTOS_ID, Const.RETROCESOS_ID, Const.TENDENCIA_ID, Const.SIGUIENTE_ID];
    static ELEMENT_SEARCH_IN_MENU = '#patterns-menu-ret-search-in-menu';
    static ELEMENT_SEARCH_IN_RETRACEMENTS = '#search-in-retracements';
        static ELEMENT_SEARCH_IN_RETRACEMENTS_INPUT = '#search-in-ret-name';
        static ELEMENTS_SEARCH_IN_STORED_RETS = '#search-in-ret-stored-rets';
        static ID_SEARCH_IN_STORED_RETS = 'search-in-ret-stored-rets';
    static ELEMENT_SEARCH_IN_TRENDS = '#search-in-trends';
        static ELEMENT_SEARCH_IN_TRENDS_INPUT = '#search-in-trend-name';
    static ELEMENT_SEARCH_IN_MOVEMENTS = '#search-in-movements';
        static ELEMENT_SEARCH_IN_MOVEMENTS_INPUT = '#search-in-level';
    static ELEMENT_SEARCH_IN_NEXT = '#search-in-next';
        static ELEMENT_CLASS_SEARCH_IN_NEXT_INPUT = '.search-in-next-combo';

    static SEARCH_IN_OPTIONS_FILTER = 'div[id^=search-in-]';
    static SEARCH_IN_OPTIONS_IDS = {
        'search-in-retracements': Const.RETROCESOS_ID,
        'search-in-ret-stored-rets': Const.RETROCESOS_ID,
        'search-in-trends': Const.TENDENCIA_ID,
        'search-in-movements': Const.MOVIMIENTOS_ID,
        'search-in-next': Const.SIGUIENTE_ID,
    };
    static ELEMENT_STORED_RETS = '#patterns-menu-stored-rets';
    static ID_STORED_RETS = 'patterns-menu-stored-rets';
    static ELEMENT_CLASS_STORED_RETS = '.stored-rets';
    static ELEMENT_CLOSE = '#patterns-menu-close';

    // Events
    static EVENT_BUILD_MENU = 'event-patterns-build-menu';
    static EVENT_SHOW_PATTERNS = 'event-patterns-show-patterns';
    static EVENT_MENU_CLOSE = 'event-patterns-close-patterns-menu';
    static EVENT_SUBMIT = 'event-patterns-submit';
    static EVENT_RET_SELECTED = 'event-patterns-ret-selected';
    static EVENT_SEARCH_IN_RET_SELECTED = 'event-search-in-ret-selected';
    static EVENT_CLEAR_FORM = 'event-patterns-clear-form';

    // static EMPTY_FORM = {
    //     [Const.TIPO_PARAM_ID]: Const.RETROCESOS_ID,
    //     [Const.BUSCAR_EN_COMBO_ID]: Const.MOVIMIENTOS_ID,
    //     [Const.NIVEL_ID]: '',
    //     [Const.BUSCAR_EN_ID]: '',
    //     [Const.ID_ID]: '',
    //     [Const.VALORES_ID]: '',
    //     [Const.SENTIDO_ID]: Const.ALCISTA,
    //     [Const.DESDE_ID]: Const.INICIO_ID,
    //     [Const.ITERA_EN_N_ID]: '',
    //     [Const.SOLO_MAX_ID]: Const.NO,
    //     [Const.NAME_ID]: '',
    // };
    static EMPTY_FORM = {
        [Const.TIPO_PARAM_ID]: Const.RETROCESOS_ID,
        [Const.BUSCAR_EN_COMBO_ID]: Const.MOVIMIENTOS_ID,
        [Const.LEVEL_ID]: '',
        [Const.SEARCH_IN_ID]: '',
        [Const.ID_ID]: '',
        [Const.RET_LEVELS_ID]: '',
        [Const.TREND_ID]: Const.ALCISTA,
        [Const.FROM_ID]: Const.INICIO_ID,
        [Const.ITERATE_ID]: '',
        [Const.ONLY_MAX_ID]: Const.NO,
        [Const.NAME_ID]: '',
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
        [Const.NAME_ID]: '',
    };

    #select_type_options;
    #menu_ret;
    #menu_ret_options = {};
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
            let ret = this.#models.patterns[ret_name]; //MenuPatterns.DUMMY_MEMORY[ret_name];
            if(ret) {
                this.#apply_stored_values(ret);
            }
        }
    }

    #apply_stored_values(val) {
        //TODO CARGAR TODA LA INFO DEL RETROCESO EN LOS CAMPOS DESDE MEMORIA
        let search_in_type = $(MenuPatterns.SEARCH_IN_SELECTED).val();
        var names = new Set();
        $(MenuPatterns.MENU_CONTENT).find('input, select').each((i, n) => names.add($(n).attr('name')));
        names = Array.from(names);
        names = names.filter(i => (i!=undefined) & (i!= false));
        // names.forEach( (name, idx) =>
        for(let idx=0; idx<names.length; idx++) {
            let el = $(MenuPatterns.MENU_CONTENT + '* [name=' + names[idx] +']');
            if(el.is(':radio')) {
                if(val[names[idx]] != null) $('#' + el.parent().prop('id') + ' input[value=' + val[names[idx]] +']').prop('checked', true);
            }
            else if(el.is('select')) {
                if(val[names[idx]] != null) el.val(val[names[idx]]).change();
                let names_upd = new Set();
                $(MenuPatterns.MENU_CONTENT).find('input, select').each((i, n) => names_upd.add($(n).attr('name')));
                names_upd = Array.from(names_upd);
                names_upd = names_upd.filter( i => (i!=undefined) && (i!=false));
                names_upd = names_upd.filter( i => !names.includes(i));
                names.push(...names_upd);
            }
            else if(el.is(':input')) {
                if(val[names[idx]] != null) el.val(val[names[idx]]);
            }
        };
    }

    #create_type_selector() {
        let that = this;
        let select_el = this.#select_type_options.clone()
        select_el.prop('name', MenuPatterns.PATTERN_TYPE_SELECT);
        select_el.prop('id', MenuPatterns.PATTERN_TYPE_SELECT);
        $(MenuPatterns.SELECT_TYPE_CONTAINER).append(select_el);

        $(MenuPatterns.TYPE_SELECTED).on('change', e => {
            let type = $(MenuPatterns.TYPE_SELECTED).val();
            $(MenuPatterns.MENU_CONTENT).empty();
            switch(type) {
                case Const.RETROCESOS_ID:
                    $(MenuPatterns.MENU_CONTENT).append(this.#menu_ret.clone());
                    this.#create_search_in_selector();
                    $(MenuPatterns.SEARCH_IN_SELECTED).val('MOVIMIENTOS').change();
                    
                    // Find all dropdown type items, to create them
                    let dd_controls = $(MenuPatterns.MENU_CONTENT).find(Dropdown.ELEMENT_CLASS_DROPDOWN);
                    dd_controls.each( (idx, dd_item) => {
                        let items;
                        if($(dd_item).data('source')) items = eval($(dd_item).data('source'));
                        // Const.create_dropdown(dd_controls, items);
                        new Dropdown(dd_controls, items);
                        // Const.create_dropdown(dd_items, Object.keys(this.#model));
                    });
                    
                    $(document).on(MenuPatterns.EVENT_RET_SELECTED, (e, ret_name, el) => this.#get_clicked_stored_ret(ret_name));

                    // Load values
                    if(this.values_hist.length) { this.#apply_stored_values(this.values_hist[this.values_hist.length-1]); }
                    else { $(MenuPatterns.SENSE + ' input[value=' + MenuPatterns.SENSE_DEFAULT_VALUE +']').prop('checked', true); }
                    
                    break;
                // case Const.MOVIMIENTOS_ID: $(MenuPatterns.MENU_CONTENT).append($(MenuPatterns.MENU_RET).clone()); break;
                // case Const.TENDENCIA_ID: $(MenuPatterns.MENU_CONTENT).append($(MenuPatterns.MENU_RET).clone()); break;
                // case Const.SIGUIENTE_ID: $(MenuPatterns.MENU_CONTENT).append($(MenuPatterns.MENU_RET).clone()); break;
                default: $(MenuPatterns.MENU_CONTENT).empty();  break;
            }
        });

        // $(MenuPatterns.SUBMIT).on('click', e => $(document).trigger(MenuPatterns.EVENT_SUBMIT));
        $(document).on('click', MenuPatterns.SUBMIT, e => $(document).trigger(MenuPatterns.EVENT_SUBMIT));

        // ENTER key apply configuration
        $(document).on('keyup', MenuPatterns.MENU_CONTENT + ' ' + MenuPatterns.MENU_CONTENT + ' *', e => {
            if(e.keyCode == KeyCode.ENTER) {
                $(document).trigger(MenuPatterns.EVENT_SUBMIT);
            }
        });
    }

    #create_search_in_selector() {
        let that = this;
        let select_el = this.#select_type_options.clone()
        select_el.prop('id', MenuPatterns.ID_PATTERN_SEARCH_IN_SELECT);
        select_el.prop('name', MenuPatterns.NAME_PATTERN_SEARCH_IN_SELECT);
        $(MenuPatterns.SEARCH_IN_CONTAINER).append(select_el);

        $(MenuPatterns.SEARCH_IN_SELECTED).on('change', e => {
            let type = $(MenuPatterns.SEARCH_IN_SELECTED).val();
            $(MenuPatterns.ELEMENT_SEARCH_IN_MENU).empty();
            try {
                // Clones search in menu
                let menu_cloned = this.#menu_ret_options[type].clone();
                
                //Appends search in menu to its main menu container
                $(MenuPatterns.ELEMENT_SEARCH_IN_MENU).append(menu_cloned);
                
                // Find all dropdown controls and create them
                let dd_controls = $(menu_cloned).find(Dropdown.ELEMENT_CLASS_DROPDOWN);
                dd_controls.each( (idx, dd_item) => {
                    let items;
                    if($(dd_item).data('source')) items = eval($(dd_item).data('source'));
                    // Const.create_dropdown(dd_item, items);
                    new Dropdown(dd_item, items);
                });
            }
            catch(error) {
                console.error('Unexpected type:', error);
            }
        });
    }

    #get_options() {
        let ret = {};
        ret[Const.TIPO_PARAM_ID] = $(MenuPatterns.TYPE_SELECTED).val();
        // let search_in_type = $(MenuPatterns.SEARCH_IN_SELECTED).val();
        var names = new Set();
        $(MenuPatterns.MENU_CONTENT).find('input, select').each((i, n) => names.add($(n).attr('name')));
        names = Array.from(names);
        names = names.filter(i => (i!=undefined) & (i!= false));
        names.forEach( name => {
            let el = $(MenuPatterns.MENU_CONTENT + '* [name=' + name +']');
            if(el.is(':radio')) {
                // ret[name] = this.get_radio(el.parent().prop('id'));
                ret[name] = $('#' + el.parent().prop('id') + ' input:checked').val();
            }
            else if(el.is('select')) {
                ret[name] = el.val();
            }
            else if(el.is(':input')) {
                ret[name] = el.val();
            }
        });

        ret[Const.NAME_ID] = ret[Const.ID_ID]; // TODO HARCODED NOMBRE ORIGINAL (PARA NO MOSTRAR EN LA TABLA EL GENERADO CON MODEL KEY)
        return ret;
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init(models) {
        var that = this;

        // Loads model data
        if(models) {
            this.#models = models;
        }
        else console.warn('Patterns Model not defined.');

        this.#menu_ret = $(MenuPatterns.MENU_RET).clone();
        $(MenuPatterns.MENU_RET).remove();

        this.#select_type_options = '<select name="" id="">';
        this.#select_type_options = $(this.#select_type_options);
        MenuPatterns.PATTERNS_TYPE_OPTIONS.forEach(o => { this.#select_type_options.append('<option value=' + o + '>' + o + '</option>'); });
        
        let ret_options = $(MenuPatterns.SEARCH_IN_OPTIONS_FILTER);
        ret_options.each( (i, el) => {
            let el_cloned = $(el).clone();
            if(MenuPatterns.SEARCH_IN_OPTIONS_IDS[el.id]) {
                if(!this.#menu_ret_options[MenuPatterns.SEARCH_IN_OPTIONS_IDS[el.id]])
                    this.#menu_ret_options[MenuPatterns.SEARCH_IN_OPTIONS_IDS[el.id]] = el_cloned;
                else  this.#menu_ret_options[MenuPatterns.SEARCH_IN_OPTIONS_IDS[el.id]].append(el_cloned);
            }
        });

        $(document).on(MenuPatterns.EVENT_SEARCH_IN_RET_SELECTED, (e, ret_name, el) => {
            $(MenuPatterns.ELEMENT_SEARCH_IN_RETRACEMENTS_INPUT).val(ret_name);
        });

        ret_options.remove();
        
        $(MenuPatterns.MENU_ICON).prop('title', MenuPatterns.TITLE);
        $(MenuPatterns.MENU).draggable({containment: "window"});
        // $(MenuPatterns.MENU).resizable();
        $(MenuPatterns.MENU).hide();
        $(MenuPatterns.SELECT_TYPE_CONTAINER).select();
        this.#create_type_selector();

        $(document).on(Const.EVENT_CLOSE, e => $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE));

        $(document).on('click', MenuPatterns.ELEMENT_CLOSE, e => $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE));

        $(document).on('click', MenuPatterns.CLEAR_FORM, e => { that.#apply_stored_values(MenuPatterns.EMPTY_FORM); });

        $(document).on(MenuPatterns.EVENT_SUBMIT, E => {
            that.#options = that.#get_options();
            that.values_hist.push(that.#options);
            $(document).trigger(MenuPatterns.EVENT_SHOW_PATTERNS, that.#options);
            $(document).trigger(MenuPatterns.EVENT_MENU_CLOSE);
            $(MenuPatterns.MENU_CONTENT).unbind('keyup');
            console.log(that.#options);
        });

        $(document).on(MenuPatterns.EVENT_BUILD_MENU, e => { $(MenuPatterns.TYPE_SELECTED).val('RETROCESOS').change(); });
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    static is_visible() { return $(MenuPatterns.MENU).is(':visible'); }

    get options() { return this.#options; }

    get_radio(name) { return $('#' + name + ' input:checked').val(); }
    
    set_radio(name, val) { $('#' + name + ' input[value=' + val +']').prop('checked', true); }
    
}