

/**file: menu_status.js */

class MenuFibonacci {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-fibonacci';
    static MENU_ICON = '#fibonacci-retracement';

    // Elements
    static ID_MENU_FLOAT_HANDLE = 'menu-float-handle';
    static ID_MENU_FLOAT_SETTIGNS = 'menu-float-settings';
    static ID_MENU_FLOAT_REMOVE = 'menu-float-remove';
    static ID_MENU_FLOAT_BLOCK = 'menu-float-block';
    static ID_MENU_FIBONACCI_FLOAT = 'menu-fibonacci-float';
    static ELEMENT_ID_MENU_FIBONACCI_FLOAT = '#menu-fibonacci-float';
    static ID_MENU_FIBONACCI = 'menu-fibonacci';
    static ELEMENT_ID_MENU_FIBONACCI = '#menu-fibonacci';
    static ID_MENU_FIBONACCI_STORED_TEMPLATES = 'menu-fibonacci-stored-templates';
    static ELEMENT_ID_MENU_FIBONACCI_STORED_TEMPLATES = '#menu-fibonacci-stored-templates';
    
    //Events
    static EVENT_MENU_CLOSE = 'event-menu-fibonacci-close';
    static EVENT_STORED_SELECTED = 'event-menu-fibonacci-stored-selected';
    static EVENT_OPEN_SETTINGS = 'event-menu-fibonacci-control-open-settings';
    static EVENT_REMOVE = 'event-menu-fibonacci-control-remove';
    static EVENT_BLOCK = 'event-menu-fibonacci-control-block';
    static EVENT_UPDATE_MODEL = 'event-menu-fibonacci-update-model';

    
    //----------------------------- PROPERTIES -----------------------------
    
    // TODO DUMMY DATA BORRAR
    prev_config = {
        fibo_name: 'test',
        template_name: 'TEST',
        hash: '',
        levels: [1.272, 1.618, 1.88],
        colors: ['rgba(255, 125, 0, 1)', 'rgba(125, 255, 0, 1)', 'rgba(0, 125, 255, 1)'],
        opacity: 0.3,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    };
    config = {
        fibo_name: '',
        template_name: '',
        hash: '',
        levels: [],
        colors: [],
        opacity: 0,
        textShow: '',
        textSide: '',
        textInfo: '',
    }
    model;
    #menu;
    #menu_float;
    #settings;
    #remove;
    #block;
    #stored_templates;

    fibo_ref;
    #open_float = false;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(model) {
        this.model = model;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    #get_clicked_stored_fibonacci(fib_name) {
        // if(this.model.fibonacci) {
        //     let fib = this.model.fibonacci[fib_name];
        //     if(fib) {
        //         this.#load_controls_values(fib);
        //     }
        // }
        console.log(fib_name);
    }

    #load_controls_values(fib) {

    }

    #update_lock() {
        if(this.fibo_ref.blocked) {
            this.#block.removeClass(`${Const.CLASS_ICON_UNLOCK} ${Const.CLASS_HOVERABLE_ICON}`);
            this.#block.addClass(`${Const.CLASS_ICON_LOCK} ${Const.CLASS_HOVERABLE_ICON_SELECTED}`);
            this.#remove.removeClass(Const.CLASS_HOVERABLE_ICON);
            this.#remove.addClass(Const.CLASS_DISABLED);
        }
        else {
            this.#block.removeClass(`${Const.CLASS_ICON_LOCK} ${Const.CLASS_HOVERABLE_ICON_SELECTED}`);
            this.#block.addClass(`${Const.CLASS_ICON_UNLOCK} ${Const.CLASS_HOVERABLE_ICON}`);
            this.#remove.addClass(Const.CLASS_HOVERABLE_ICON);
            this.#remove.removeClass(Const.CLASS_DISABLED);
        }
    }

    #create_menu_float() {
        // Creates main menu container
        this.#menu_float = new Display({ id: MenuFibonacci.ID_MENU_FIBONACCI_FLOAT,
            top:'15%',
            left:'30%',
            no_title: true,
            show_handler: false,
            show: false,
            draggable: true,
            close: false,
            height: '3em',
            overflow: false,
        });


        // Drag handle
        let handle = $('<div>', {
            id: MenuFibonacci.ID_MENU_FLOAT_HANDLE,
            class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_BACK_POINTS}`,
            css: { padding: '1em 0.5em', border: 'none' },
        });
        this.#menu_float.append_content(handle);


        // Settings
        this.#settings = $('<div>', {
            id: MenuFibonacci.ID_MENU_FLOAT_SETTIGNS,
            class: `${Const.CLASS_ICON_SETTINGS} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '1em' },
        });
        this.#menu_float.append_content(this.#settings);
        this.#settings.on('click', e => $(document).trigger(MenuFibonacci.EVENT_OPEN_SETTINGS, e));

        
        // Remove
        this.#remove = $('<div>', {
            id: MenuFibonacci.ID_MENU_FLOAT_REMOVE,
            class: `${Const.CLASS_ICON_REMOVE} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '1em' },
        });
        this.#menu_float.append_content(this.#remove);
        this.#remove.on('click', e => {
            if(this.fibo_ref.blocked == false) {
                this.#menu_float.hide()
                $(document).trigger(MenuFibonacci.EVENT_REMOVE, this.fibo_ref);
            }
        });

        
        // Block
        this.#block = $('<div>', {
            id: MenuFibonacci.ID_MENU_FLOAT_BLOCK,
            class: `${Const.CLASS_ICON_UNLOCK} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '0.5em', 'font-size': '1.5em', },
        });
        this.#menu_float.append_content(this.#block);
        this.#block.on('click', e => {
            this.fibo_ref.blocked = !this.fibo_ref.blocked;
            this.#update_lock();
        });


        // Templates dropdown
        this.#stored_templates = new Dropdown({
                                        id: MenuFibonacci.ID_MENU_FIBONACCI_STORED_TEMPLATES,
                                        items: ['A', 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'],
                                        event: MenuFibonacci.EVENT_STORED_SELECTED,
                                        header: { selected: true },
                                        select_unknown: true,
                                        class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
                                        css: {
                                            items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
                                            container: { 'background-color': 'var(--color-invisible)', height: '1.35em', padding: '0.5em 0.3em', },
                                        },
                                    });
        // this.#stored_templates.select('A');
        $(document).on(MenuFibonacci.EVENT_STORED_SELECTED, (e, ret_name) => {
            this.#get_clicked_stored_fibonacci(ret_name)
        });
        this.#menu_float.append_content(this.#stored_templates.controls);
 
        // Append control element to floating menu
    }

    #create_menu() {
        // Creates main menu container
        this.#menu = new Display({ id: MenuFibonacci.ID_MENU_FIBONACCI,
                                      title: 'Fibonacci',
                                      title_css: { 'font-size': '1.25em' },
                                      top:'15%',
                                      left:'30%',
                                      draggable: true,
                                      new_classes: 'scroll-custom',
                                      //   width: '300px',
                                      close_cb: this.hide.bind(this),
                                     });

        this.#menu.element_handle_close.on('click', e =>  $(document).trigger(MenuFibonacci.EVENT_MENU_CLOSE) );
        this.#menu.control.hide();

        // Add separator
        this.#menu.append(Display.build_separator());

        // Appends common controls to menu panel display
        // // Creates name input box
        // let name = new Inputbox({
        //                             id: MenuFibonacci.ID_PATTERNS_MENU_PATTERN_NAME,
        //                             container: { class: Const.CLASS_MENU_FIELD },
        //                             label: { text: 'Nombre', position: Const.LABEL_POSITION_BEFORE },
        //                             input: { class: Const.CLASS_TEXT_INPUT,
        //                                      placeholder: 'Nombre del patrón  ',
        //                                      css: { 'max-width': '9em',  'font-size': '0.8em' },
        //                             }
        //                         });

        // this.#stored_templates = new Dropdown({
        //                                 id: MenuFibonacci.ID_MENU_FIBONACCI_STORED_TEMPLATES,
        //                                 items: [], //Object.keys(this.#models.patterns),
        //                                 event: MenuFibonacci.EVENT_STORED_SELECTED,
        //                                 header: { arrow: true },
        //                                 css: { items: { 'font-size': '0.8em', 'font-weight': '400', left: '-50%' } },
        // });
        // this.#stored_templates.controls.each( (i, c) => this.#menu.control.append(c) );
        // $(document).on(MenuFibonacci.EVENT_STORED_SELECTED, (e, fib_name) => {
        //     this.#get_clicked_stored_fibonacci(fib_name)
        // });
        // // Append control element to display
        // this.#menu.append_content(stored.control);

        // // Creates pattern type selection combo box
        // let types_container = $('<div>', { class: Const.CLASS_MENU_FIELD});
        // let types_label = $('<p>', { text: 'Tipo' });
        // types_container.append(types_label);
        // let types_combobox = new Dropdown({
        //                                     id: MenuFibonacci.ID_PATTERNS_MENU_TYPE_SELECT,
        //                                     items: MenuFibonacci.PATTERNS_TYPE_OPTIONS,
        //                                     event: MenuFibonacci.EVENT_TYPE_SELECTED,
        //                                     header: { selected: true },
        //                                     css: { container: { 'font-size': '1em', 'font-weight': '400' } },
        //                                 });
        // types_combobox.controls.each( (i, c) => types_container.append(c) );
        // // Append control element to display
        // this.#display.append_content(types_container);
        // //Build type selected event
        // $(document).on(MenuFibonacci.EVENT_TYPE_SELECTED, (e, type) => {
        //     $(MenuFibonacci.ELEMENT_ID_PATTERNS_MENU_CONTENT_ALL).hide();
        //     if(MenuFibonacci.PATTERN_TYPE_CALLBACK[type]) {
        //         MenuFibonacci.PATTERN_TYPE_CALLBACK[type]();
        //     }
        //     else console.warn(`WARNING: Selected pattern type ${type} don't defined.`);
        // });

        // // Creates pattern results search in selection
        // // let results = new Inputbox({
        // //                             id: MenuFibonacci.ID_PATTERNS_MENU_SEARCH_IN_INPUT,
        // //                             container: { class: Const.CLASS_MENU_FIELD },
        // //                             input: { placeholder: 'Bucar en resultado... ' }
        // //                          });
        // let searchin_combobox = new Dropdown({
        //                                     id: MenuFibonacci.ID_PATTERNS_MENU_SEARCH_IN_PATTERNS,
        //                                     // items: Object.keys(this.#models.patterns),
        //                                     items: [],
        //                                     // event: MenuFibonacci.EVENT_SEARCH_IN_RET_SELECTED,
        //                                     class: Const.CLASS_MENU_FIELD,
        //                                     header: { selected: true, label: { text: 'Buscar en resultado', position: Const.LABEL_POSITION_BEFORE} },
        //                                     css: { items: { 'font-size': '0.8em', 'font-weight': '400', left: '-50%' } },
        //                                 });
        // // searchin_combobox.controls.each( (i, c) => results.control.append(c) );
        // searchin_combobox.controls.each( (i, c) => this.#display.append_content(c) );
        // // Append control element to display
        // // this.#display.append_content(results.control);
        
        // // Nivel de movimientos
        // let mov_level = new Inputbox({
        //     id: MenuFibonacci.ID_PATTERNS_MENU_MOV_LEVEL_ID,
        //     container: { class: Const.CLASS_MENU_FIELD },
        //     label: { text: 'Nivel movimiento', position: Const.LABEL_POSITION_BEFORE },
        //     input: { class: Const.CLASS_MENU_INPUT_SHORT, text: '1' }
        //  });
        // // Append control element to display
        //  this.#display.append_content(mov_level.control);

        // Add content menu ----------------------------------------------------------
        // this.#create_menu_retracements();
        // this.#create_menu_buttons();
    }
    
    #init_events() {
        $(document).on(MenuFibonacci.EVENT_UPDATE_MODEL, (e, params) => {
            prev_config = {};
        });
    }

    // #create_menu_retracements() {
    //     let ret_content = $('<div>', { id: MenuFibonacci.ID_PATTERNS_MENU_CONTENT_RETRACEMENTS } );
    //     ret_content.css({ margin: '0', display: 'none' });

    //     // Add separator
    //     ret_content.append(Display.build_separator());

    //     // Add retracement values
    //     let ret_values = new Inputbox({
    //         id: MenuFibonacci.ID_PATTERNS_MENU_RET_VALUES,
    //         container: { class: Const.CLASS_MENU_FIELD, tooltip: 'Valores de retroceso de fibonacci (ej: 0.23, 0.382, >0.618). Admite operadores > y <.)' },
    //         input: { css: {'min-width': '13.5em' },  placeholder: 'Valores retroceso Fibonacci  ' }
    //         });
    //     // Append control element to display
    //     ret_content.append(ret_values.control);

    //     // Add from option
    //     let from = new RadioButton({
    //                                     id: MenuFibonacci.ID_PATTERNS_MENU_RET_FROM,
    //                                     container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
    //                                     name: Const.FROM_ID,
    //                                     label: { text: 'Desde', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
    //                                     buttons: { values: {
    //                                                         [Const.INICIO_ID]: Const.INIT_ID,
    //                                                         [Const.FIN_ID]: Const.END_ID,
    //                                                         [Const.CORRECCION_DESDE_ID]: Const.CORRECTION_ID
    //                                                 },
    //                                                 checked: Const.INIT_ID,
    //                                                 class: Const.CLASS_BUTTON_GENERAL,
    //                                                 css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
    //                                             }
    //                                 });
    //     // Append control element to display
    //     ret_content.append(from.control);

    //     // Add iterate value
    //     let iterate = new Inputbox({
    //         id: MenuFibonacci.ID_PATTERNS_MENU_RET_ITERATE,
    //         container: { class: Const.CLASS_MENU_FIELD },
    //         label: { text: 'Itera búsqueda', position: Const.LABEL_POSITION_BEFORE },
    //         input: { class: Const.CLASS_MENU_INPUT_SHORT, text: '0' }
    //     });
    //     // Append control element to display
    //     ret_content.append(iterate.control);

    //     // Add filter max option
    //     let filter_max = new RadioButton({
    //         id: MenuFibonacci.ID_PATTERNS_MENU_RET_FILTER_MAX,
    //         container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
    //         name: MenuFibonacci.NAME_FILTER_MAX,
    //         label: { text: 'Solo máximo', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
    //         buttons: { values: {
    //                             [MenuFibonacci.FILTER_MAX_NO_ID]: Const.NO,
    //                             [MenuFibonacci.FILTER_MAX_MOV_ID]: Const.MOVIMIENTO,
    //                             [MenuFibonacci.FILTER_MAX_RET_ID]: Const.RETROCESO
    //                     },
    //                     checked: Const.NO,
    //                     class: Const.CLASS_BUTTON_GENERAL,
    //                     css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
    //                 }
    //     });
    //     // Append control element to display
    //     ret_content.append(filter_max.control);

    //     // Append levels data source
    //     let levels_data_source = new Dropdown({
    //         id: MenuFibonacci.ID_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE,
    //         // items: Object.keys(this.#models.patterns),
    //         items: [],
    //         // event: MenuFibonacci.EVENT_PATTERNS_MENU_RET_LEVELS_DATA_SOURCE_SELECTED,
    //         class: Const.CLASS_MENU_FIELD,
    //         header: { selected: true, label: { text: 'Datos fuente de niveles', position: Const.LABEL_POSITION_BEFORE } },
    //         css: { items: { 'font-size': '0.8em', 'font-weight': '400' } },
    //     });
    //     levels_data_source.controls.each( (i, c) => ret_content.append(c) );

    //     // // Add from option
    //     // let levels_from = new RadioButton({
    //     //     id: MenuFibonacci.ID_PATTERNS_MENU_RET_LEVELS_FROM,
    //     //     container: { class: `${Const.CLASS_MENU_FIELD} ${Const.CLASS_MENU_OPTIONS_RADIO}` },
    //     //     name: Const.FROM_STOP_ID,
    //     //     label: { text: 'Desde de niveles', css: { 'display': 'block', 'margin-bottom': '0.5em' } },
    //     //     buttons: { values: {
    //     //                         [Const.INICIO_ID]: Const.INIT_ID,
    //     //                         [Const.FIN_ID]: Const.END_ID,
    //     //                         [Const.CORRECCION_DESDE_ID]: Const.CORRECTION_ID
    //     //                 },
    //     //                 checked: Const.INIT_ID,
    //     //                 class: Const.CLASS_BUTTON_GENERAL,
    //     //                 css: { 'margin': '0', 'font-size': '0.7em', 'font-weight': '200'}
    //     //             }
    //     // });
    //     // // Append control element to display
    //     // ret_content.append(levels_from.control);

    //     // Append control element to display
    //     this.#display.append_content(ret_content);
    // }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        this.#create_menu_float();
        this.#create_menu();
        this.#init_events();
    }

    load_config(params) {
        this.config.fibo_name = params.name;
        this.config.template_name = params.template_name;
        this.config.levels = params.levels;
        this.config.colors = params.colors;
        this.config.opacity = params.opacity;
        this.config.textShow = params.textShow;
        this.config.textSide = params.textSide;
        this.config.textInfo = params.textInfo;
    }

    show(params) {
        this.#menu_float.hide();
        this.#menu.show();
        this.#load_controls_values(params);
    }

    hide() {
        this.#menu.hide();
        if(this.#open_float) {
            this.#menu_float.show();
        }
    }

    show_float(params) {
        this.#open_float = true;
        this.#menu_float.show();
        this.fibo_ref = params;
        this.load_config(params);
        this.#stored_templates.select(this.config.template_name);
        this.#update_lock();
    }

    hide_float() {
        this.#menu_float.hide();
        this.#open_float = false;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
    

    // #create_menu_buttons() {
    //     let menu_footer = $('<div>', { id: MenuFibonacci.ID_PATTERNS_MENU_FOOTER });

    //     // Add button add pattern
    //     let button_add = $('<div>', {
    //         id: MenuFibonacci.ID_BUTTON_ADD,
    //         class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_ADD}`,
    //         title: 'Agregar patrón al proceso'
    //     });
    //     menu_footer.append(button_add);

    //     // Add button save pattern
    //     let button_save = $('<div>', {
    //         id: MenuFibonacci.ID_BUTTON_SAVE,
    //         class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_SAVE}`,
    //         title: 'Guardar patrón'
    //     });
    //     menu_footer.append(button_save);
    //     button_save.on('click', e => $(document).trigger(MenuFibonacci.EVENT_SAVE_PATTERN))

    //     // Add button delete pattern
    //     let button_delete = $('<div>', {
    //         id: MenuFibonacci.ID_BUTTON_DELETE,
    //         class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_DELETE}`,
    //         title: 'Eliminar patrón'
    //     });
    //     menu_footer.append(button_delete);
    //     button_delete.on('click', e => $(document).trigger(MenuFibonacci.EVENT_DELETE_PATTERN));

    //     // Add button reset form
    //     let button_reset = $('<div>', {
    //         id: MenuFibonacci.ID_BUTTON_RESET,
    //         class: `${Const.CLASS_BUTTON_GENERAL} ${Const.CLASS_ICON_CLEAR}`,
    //         title: 'Limpiar formulario'
    //     });
    //     menu_footer.append(button_reset);
    //     button_reset.on('click', e => $(document).trigger(MenuFibonacci.EVENT_CLEAR_FORM));

    //     // Add button submit form to process pattern
    //     let button_submit = $('<div>', {
    //         id: MenuFibonacci.ID_BUTTON_SUBMIT,
    //         class: `${Const.CLASS_BUTTON_GENERAL}`,
    //         text: 'Aplicar',
    //         title: 'Procesar patrones definidos'
    //     });
    //     menu_footer.append(button_submit);
    //     // Click button action
    //     button_submit.on('click', e => $(document).trigger(MenuFibonacci.EVENT_SUBMIT) );

    //     this.#display.append(menu_footer);
    // }

}