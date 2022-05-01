

/**file: menu_status.js */

class MenuFibonacci {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-fibonacci';
    static TITLE = 'Retroceso Fibonacci';
    static MENU_ICON = '#fibonacci-retracement';

    // Elements
    // Float menu
    static ID_MENU_FLOAT_HANDLE = 'menu-float-handle';
    static ID_MENU_FLOAT_SETTIGNS = 'menu-float-settings';
    static ID_MENU_FLOAT_REMOVE = 'menu-float-remove';
    static ID_MENU_FLOAT_BLOCK = 'menu-float-block';
    static ID_MENU_FLOAT = 'menu-fibonacci-float';
    static ELEMENT_ID_MENU_FLOAT = '#menu-fibonacci-float';
    static ID_MENU_FLOAT_STORED_TEMPLATES = 'menu-fibonacci-float-stored-templates';
    static ELEMENT_ID_MENU_FLOAT_STORED_TEMPLATES = '#menu-fibonacci-float-stored-templates';
    
    // Menu
    static ID_MENU_FIBONACCI = 'menu-fibonacci';
    static ELEMENT_ID_MENU_FIBONACCI = '#menu-fibonacci';
    static ID_MENU_STORED_TEMPLATES = 'menu-fibonacci-stored-templates';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-fibonacci-stored-templates';
    static ID_MENU_TEMPLATE_NAME = 'menu-fibonacci-template-name';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-fibonacci-template-name';
    static ID_MENU_RET_VALUES_LABEL = 'menu-fibonacci-ret-values-label';
    static ELEMENT_ID_MENU_RET_VALUES_LABEL = '#menu-fibonacci-ret-values-label';
    static ID_MENU_RET_VALUES = 'menu-fibonacci-ret-values';
    static ELEMENT_ID_MENU_RET_VALUES = '#menu-fibonacci-ret_values';
    static ID_MENU_OPACITY_LABEL = 'menu-fibonacci-opacity-label';
    static ELEMENT_ID_MENU_OPACITY_LABEL = '#menu-fibonacci-opacity-label';
    static ID_MENU_OPACITY = 'menu-fibonacci-opacity';
    static ELEMENT_ID_MENU_OPACITY = '#menu-fibonacci-opacity';
    static ID_MENU_TEXT_SHOW = 'menu-fibonacci-text-show';
    static ELEMENT_ID_MENU_TEXT_SHOW = '#menu-fibonacci-text-show';
    static TEXT_SHOW_LABEL = 'Mostrar texto';
    static ID_MENU_TEXT_SIDE = 'menu-fibonacci-text-side';
    static ELEMENT_ID_MENU_TEXT_SIDE = '#menu-fibonacci-text-side';
    static ID_MENU_TEXT_INFO = 'menu-fibonacci-text-info';
    static ELEMENT_ID_MENU_TEXT_INFO = '#menu-fibonacci-text-info';
    // Menu buttons
    static ID_BUTTON_SAVE = 'menu-fibonacci-button-save';
    static ID_BUTTON_REMOVE = 'menu-fibonacci-button-remove';
    static ID_BUTTON_RESET = 'menu-fibonacci-button-reset';
    // Icons hover help text
    static SETTINGS_TITLE = 'Configuración';
    static REMOVE_TITLE = 'Eliminar';
    static BLOCK_TITLE = 'Bloquear';
    static TEMPLATES_TITLE = 'Plantillas';
    
    //Events
    static EVENT_MENU_CLOSE = 'event-menu-fibonacci-close';
    static EVENT_STORED_SELECTED = 'event-menu-fibonacci-stored-selected';
    static EVENT_OPEN_SETTINGS = 'event-menu-fibonacci-control-open-settings';
    static EVENT_REMOVE = 'event-menu-fibonacci-control-remove';
    static EVENT_BLOCK = 'event-menu-fibonacci-control-block';
    static EVENT_UPDATE_MODEL = 'event-menu-fibonacci-update-model';
    // Buttons events
    static EVENT_SUBMIT = 'event-menu-fibonacci-submit';

    //Options
    static MENU_TEXT_SIDE_OPTIONS = ['Izquierda', 'Derecha', 'Centro'];
    static TEXT_SIDE_OPTIONS_TRANSLATOR = {
        'Izquierda': 'left',
        'Derecha': 'right',
        'Centro': 'center',
    };
    static SIDE_TEXT_OPTIONS_TRANSLATOR = {
        'left' : 'Izquierda',
        'right' : 'Derecha',
        'center' : 'Centro',
    };
    static MENU_TEXT_INFO_OPTIONS = ['%', 'Precio', '%(Precio)'];
    static TEXT_INFO_OPTIONS_TRANSLATOR = {
        '%': '%',
        'Precio': 'value',
        '%(Precio)': '%(value)',
    };
    static INFO_TEXT_OPTIONS_TRANSLATOR = {
        '%': '%',
        'value': 'Precio',
        '%(value)': '%(Precio)',
    };

    static EMPTY_FORM = {
        name: '',
        [Const.RET_LEVELS_ID]: [],
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    }
    

    //----------------------------- PROPERTIES -----------------------------
    
    // TODO DUMMY DATA BORRAR
    prev_template = {
        name: 'TMP',
        type: Fibonacci.NAME,
        levels: [1.272, 1.618, 1.88],
        // colors: ['rgba(255, 125, 0, 1)', 'rgba(125, 255, 0, 1)', 'rgba(0, 125, 255, 1)'],
        // opacity: 0.3,
        colors: ['#FF7D00', '#7DFF00', '#007DFF'],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    };
    template = {
        name: '',
        type: Fibonacci.NAME,
        levels: [],
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    }
    models;
    model;
    #menu;
    #menu_float;
    #settings;
    #remove;
    #block;
    #stored_templates_float;
    #stored_templates;
    #input_name;
    #ret_values;
    #opacity;
    #show_text = true;
    #text_side_options;
    #text_info_options;

    fibo_ref;
    #open_float = false;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        this.models = models;
        // this.model = models.templates[Fibonacci.NAME];
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    #get_clicked_stored_templates(name) {
        try {
            if(this.models.templates[Fibonacci.NAME]) {
                let fib = this.models.templates[Fibonacci.NAME][name];
                if(fib) {
                    this.#load_controls_values(fib);
                }
            }
            // this.#load_controls_values(this.model[name]);
            // console.log(name);
        }
        catch(error) {
            console.error(error);
        }
    }

    #load_controls_values(config) {
        try {
            this.template = config;
            this.#input_name.text = this.template.name;
            this.#ret_values.text = this.template.levels.reduce( (s, l) => s+','+l);
            //this.#level_colors
            this.#opacity.set_val(this.template.opacity);
            this.#show_text.checked = this.template.textShow;
            let text_side = MenuFibonacci.SIDE_TEXT_OPTIONS_TRANSLATOR[this.template.textSide] || this.template.textSide;
            let text_info = MenuFibonacci.INFO_TEXT_OPTIONS_TRANSLATOR[this.template.textInfo] || this.template.textInfo;
            this.#text_side_options.select(text_side);
            this.#text_info_options.select(text_info);
        }
        catch(error) {
            console.error(error);
        }
    }

    #read_controls_values() {
        try {
            let levels = this.#ret_values.text.split(',');
            let text_side = MenuFibonacci.TEXT_SIDE_OPTIONS_TRANSLATOR[this.#text_side_options.selected] || this.#text_side_options.selected;
            let text_info = MenuFibonacci.TEXT_INFO_OPTIONS_TRANSLATOR[this.#text_info_options.selected] || this.#text_info_options.selected;
            this.template = {
                type: Fibonacci.NAME,
                name: this.#input_name.text,
                [Const.RET_LEVELS_ID]: levels,
                colors: [],
                opacity: this.#opacity.value,
                lineWidth: 1,
                lineType: Const.LINE_SOLID,
                textShow: this.#show_text.checked,
                textSide: text_side,
                textInfo: text_info,
            }
            return this.template;
        }
        catch(error) {
            console.error(error);
        }
    }

    #update_lock() {
        try {
            if(this.fibo_ref.controlStatus.blocked) {
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
        catch(error) {
            console.error(error);
        }
    }

    #update_model() {
        try {
            // this.prev_template = (this.template.levels.length > 0) ? this.template : this.prev_template;
            // Update templates list
            // this.#stored_templates = $(MenuFibonacci.ELEMENT_ID_MENU_FIBONACCI_STORED_TEMPLATES).data('Dropdown');
            // Save current selected template
            // let template_selected = this.#stored_templates.selected;
            let template_selected = this.#input_name.text;
            // Load new model data available options
            this.#stored_templates.items = Object.keys(this.models.templates[Fibonacci.NAME] || []);
            this.#stored_templates_float.items = Object.keys(this.models.templates[Fibonacci.NAME] || []);
            // Restores previous selected template if still exists
            if(this.#stored_templates.items.includes(template_selected)) {
                // this.#stored_templates.selected = template_selected;
                // this.#stored_templates_float.selected = template_selected;
                this.#stored_templates.select(template_selected);
                this.#stored_templates_float.select(template_selected);
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    
    #delete_template() {
        let values = this.#read_controls_values();
        let template = { name: values.name, type: Fibonacci.NAME };
        $(document).trigger(Const.EVENT_DDBB_DELETE_MODEL, [MenuFibonacci.NAME, template]);
    }
    
    #save_template() {
        // Get stored info from controls
        let template = this.#read_controls_values();
        if(template.name) {
            // Send DDBB query via chart controller
            $(document).trigger(Const.EVENT_DDBB_SAVE_MODEL, [MenuFibonacci.NAME, template]);
        }
    }

    #create_menu_float() {
        // Creates main menu container
        this.#menu_float = new Display({ id: MenuFibonacci.ID_MENU_FLOAT,
            top:'15%',
            left:'30%',
            no_title: true,
            show_handler: false,
            show: false,
            draggable: true,
            close: false,
            height: '40px',
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
            title: MenuFibonacci.SETTINGS_TITLE,
        });
        this.#menu_float.append_content(this.#settings);
        this.#settings.on('click', e => $(document).trigger(MenuFibonacci.EVENT_OPEN_SETTINGS, [this.fibo_ref]));

        
        // Remove
        this.#remove = $('<div>', {
            id: MenuFibonacci.ID_MENU_FLOAT_REMOVE,
            class: `${Const.CLASS_ICON_REMOVE} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '1em' },
            title: MenuFibonacci.REMOVE_TITLE,
        });
        this.#menu_float.append_content(this.#remove);
        this.#remove.on('click', e => {
            if(this.fibo_ref.controlStatus.blocked == false) {
                this.#menu_float.hide()
                $(document).trigger(MenuFibonacci.EVENT_REMOVE, this.fibo_ref);
            }
        });

        
        // Block
        this.#block = $('<div>', {
            id: MenuFibonacci.ID_MENU_FLOAT_BLOCK,
            class: `${Const.CLASS_ICON_UNLOCK} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '0.5em', 'font-size': '1.5em', },
            title: MenuFibonacci.BLOCK_TITLE
        });
        this.#menu_float.append_content(this.#block);
        this.#block.on('click', e => {
            this.fibo_ref.controlStatus.blocked = !this.fibo_ref.controlStatus.blocked;
            this.#update_lock();
        });


        // Templates dropdown
        this.#stored_templates_float = new Dropdown({
            id: MenuFibonacci.ID_MENU_FLOAT_STORED_TEMPLATES,
            items: [],
            event: MenuFibonacci.EVENT_STORED_SELECTED,
            header: { selected: true },
            select_unknown: true,
            class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
                container: { 'background-color': 'var(--color-invisible)', height: '1.35em', padding: '0.5em 0.3em', },
            },
        });
        $(document).on(MenuFibonacci.EVENT_STORED_SELECTED, (e, name) => {
            this.#get_clicked_stored_templates(name)
        });
        // this.#stored_templates_float.controls.prop('title', MenuFibonacci.TEMPLATES_TITLE);
        this.#menu_float.append_content(this.#stored_templates_float.controls);
 
        // Append control element to floating menu
    }

    #create_menu() {
        // Creates main menu container
        this.#menu = new Display({
            id: MenuFibonacci.ID_MENU_FIBONACCI,
            title: 'Fibonacci',
            title_css: { 'font-size': '1.25em' },
            css: { padding: '0.7em' },
            top:'15%',
            left:'30%',
            draggable: true,
            // new_classes: 'scroll-custom',
            overflow: false,
            // width: '300px',
            close_cb: this.hide.bind(this),
        });

        this.#menu.element_handle_close.on('click', e =>  $(document).trigger(MenuFibonacci.EVENT_MENU_CLOSE, [Fibonacci.NAME]) );
        this.#menu.control.hide();

        // Add separator
        this.#menu.append(Display.build_separator());

        // Creates name input box
        this.#input_name = new Inputbox({
            id: MenuFibonacci.ID_MENU_TEMPLATE_NAME,
            container: { class: Const.CLASS_MENU_FIELD },
            label: { text: 'Nombre', position: Const.LABEL_POSITION_BEFORE },
            input: { class: Const.CLASS_TEXT_INPUT,
                     placeholder: 'Nombre de plantilla  ',
                     css: { 'max-width': '9em',  'font-size': '0.8em' },
            }
        });

        // Templates dropdown
        this.#stored_templates = new Dropdown({
            id: MenuFibonacci.ID_MENU_STORED_TEMPLATES,
            items: [],
            event: MenuFibonacci.EVENT_STORED_SELECTED,
            header: { arrow: true },
            select_unknown: true,
            // class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
                // container: { 'background-color': 'var(--color-invisible)', height: '1.35em', padding: '0.5em 0.3em', },
            },
        });

        this.#stored_templates.controls.each( (i, c) => this.#input_name.control.append(c) );
        // $(document).on(MenuFibonacci.EVENT_STORED_SELECTED, (e, ret_name) => {
        //     this.#get_clicked_stored_templates(ret_name)
        // });

        // Append control element to display
        this.#menu.append_content(this.#input_name.control);

        let ret_label_container = $('<div>', {
            css: { 'display': 'block', margin: '0 0 0 1em', },
                    // class: Const.CLASS_MENU_FIELD,
        });
        let ret_label = $('<p>', {
            id: MenuFibonacci.ID_MENU_RET_VALUES_LABEL,
            class: Const.CLASS_MENU_FIELD,
            text: 'Valores retroceso',
        });
        ret_label_container.append(ret_label);
        this.#menu.append_content(ret_label_container);

        
        // Add retracement values
        this.#ret_values = new Inputbox({
            id: MenuFibonacci.ID_MENU_RET_VALUES,
            container: { class: Const.CLASS_MENU_FIELD, tooltip: 'Valores de retroceso de fibonacci (ej: 0.23, 0.382, >0.618). Admite operadores > y <.)' },
            input: { css: {'min-width': '13.5em' },  placeholder: 'Valores retroceso Fibonacci  ' }
        });

        // Append control element to display
        this.#menu.append_content(this.#ret_values.control);


        // Opacity
        let opacity_label_container = $('<div>', {
            css: { 'display': 'block', margin: '0 0 0 1em', },
        });
        let opacity_label = $('<p>', {
            id: MenuFibonacci.ID_MENU_OPACITY_LABEL,
            class: Const.CLASS_MENU_FIELD,
            text: 'Opacidad',
        });
        opacity_label_container.append(opacity_label);
        this.#menu.append_content(opacity_label_container);

        this.#opacity = new Slider({
            id: MenuFibonacci.ID_MENU_OPACITY,
            min: 0,
            max: 100,
            step: 2,
            default: 50,
            class: Const.CLASS_MENU_FIELD,
            css: {
                input: { 'margin-right': '0.5em', height: '0.5em', width: '8em' },
            },
            show_output: true,
        });
        this.#menu.append_content(this.#opacity.control);


        // Show text
        this.#show_text = new Checkbox({
            id: MenuFibonacci.ID_MENU_TEXT_SHOW,
            label:MenuFibonacci.TEXT_SHOW_LABEL,
            class: Const.CLASS_MENU_FIELD,
        });
        this.#menu.append_content(this.#show_text.control);


        // Text side
        this.#text_side_options = new Dropdown({
            id: MenuFibonacci.ID_MENU_TEXT_SIDE,
            items: MenuFibonacci.MENU_TEXT_SIDE_OPTIONS,
            header: {
                selected: true,
                label: {
                    text: 'Posición texto',
                    position: Const.LABEL_POSITION_BEFORE,
                    css: { 'marging-bottom': '1em' },
                },
            },
            class: Const.CLASS_MENU_FIELD,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
            },
        });
        this.#menu.append_content(this.#text_side_options.control);
        this.#text_side_options.select(MenuFibonacci.MENU_TEXT_SIDE_OPTIONS[1]);

        
        // Text info
        this.#text_info_options = new Dropdown({
            id: MenuFibonacci.ID_MENU_TEXT_INFO,
            items: MenuFibonacci.MENU_TEXT_INFO_OPTIONS,
            header: {
                selected: true,
                label: {
                    text: 'Información texto',
                    position: Const.LABEL_POSITION_BEFORE,
                    css: { 'marging-bottom': '1em' },
                 },
             },
            class: Const.CLASS_MENU_FIELD,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
            },
        });
        this.#menu.append_content(this.#text_info_options.control);
        this.#text_info_options.select(MenuFibonacci.MENU_TEXT_INFO_OPTIONS[0]);

        this.#create_menu_buttons();
    }

    #create_menu_buttons() {
        let menu_footer = $('<div>', {
            id: MenuFibonacci.ID_MENU_FOOTER,
            css: { 'margin': '0 0 4em 1em', },
        });

        // Add button save template
        let button_save = $('<div>', {
            id: MenuFibonacci.ID_BUTTON_SAVE,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_SAVE}`,
            title: 'Guardar plantilla'
        });
        menu_footer.append(button_save);
        button_save.on('click', e => this.#save_template())

        // Add button delete pattern
        let button_delete = $('<div>', {
            id: MenuFibonacci.ID_BUTTON_REMOVE,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_REMOVE}`,
            title: 'Eliminar plantilla'
        });
        menu_footer.append(button_delete);
        button_delete.on('click', e => this.#delete_template());

        // Add button reset form
        let button_reset = $('<div>', {
            id: MenuFibonacci.ID_BUTTON_RESET,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_CLEAR}`,
            title: 'Limpiar formulario'
        });
        menu_footer.append(button_reset);
        button_reset.on('click', e => this.#load_controls_values(MenuFibonacci.EMPTY_FORM));

        this.#menu.append(menu_footer);
    }
    
    #init_events() {
        try {
            $(document).on(Const.EVENT_UPDATE_MODEL, (e, source) => {
                if(source == MenuFibonacci.NAME) {
                    this.#update_model();
                }
            });

            // $(document).on(Const.EVENT_CLOSE, e => $(document).trigger(MenuFibonacci.EVENT_MENU_CLOSE, [Fibonacci.NAME]));

            // TODO LANZAR EVENTO SUBMIT CON CADA CAMBIO DE VALOR, SE DEBE VER INTERACTIVO EN PANTALLA
            $(document).on(MenuFibonacci.EVENT_SUBMIT, e => {
            });
        }
        catch(error) {
            console.error(error);
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuFibonacci.MENU_ICON).prop('title', MenuFibonacci.TITLE);

        this.#create_menu_float();
        this.#create_menu();
        this.#init_events();
    }

    show(params) {
        this.#menu_float.hide();
        this.#menu.show();
        this.#load_controls_values(params.template);
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
        this.template = params.template;
        this.#stored_templates_float.select(this.template.name);
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