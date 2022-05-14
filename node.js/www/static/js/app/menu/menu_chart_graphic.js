

/**file: menu_chart_graphic.js */

class MenuChartGraphic {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-chart-graphic';
    static TITLE = 'Chart Graphic';
    static MENU_ICON = '#chart-graphic';

    // Elements
    // Float menu
    static ID_MENU_FLOAT_HANDLE = 'menu-float-handle-';
    static ID_MENU_FLOAT_SETTIGNS = 'menu-float-settings-';
    static ID_MENU_FLOAT_REMOVE = 'menu-float-remove-';
    static ID_MENU_FLOAT_BLOCK = 'menu-float-block-';
    static ID_MENU_FLOAT = 'menu-float-';
    static ELEMENT_ID_MENU_FLOAT = '#menu-float-';
    static ID_MENU_FLOAT_STORED_TEMPLATES = 'menu-float-stored-templates-';
    static ELEMENT_ID_MENU_FLOAT_STORED_TEMPLATES = '#menu-float-stored-templates-';

    // Menu
    static ID_MENU = 'menu-';
    static ELEMENT_ID_MENU = '#menu-';
    static ID_MENU_STORED_TEMPLATES = 'menu-stored-templates-';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-stored-templates-';
    static ID_MENU_TEMPLATE_NAME = 'menu-template-name-';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-template-name-';
    static ID_MENU_OPACITY_LABEL = 'menu-opacity-label-';
    static ELEMENT_ID_MENU_OPACITY_LABEL = '#menu-opacity-label-';
    static ID_MENU_OPACITY = 'menu-opacity-';
    static ELEMENT_ID_MENU_OPACITY = '#menu-opacity-';
    static ID_MENU_LINE_WIDTH = 'menu-line-width-';
    static ELEMENT_ID_MENU_LINE_WIDTH = '#menu-line-width-';
    static ID_MENU_LINE_TYPE = 'menu-line-type-';
    static ELEMENT_ID_MENU_LINE_TYPE = '#menu-line-type-';
    static ID_MENU_TEXT_SHOW = 'menu-text-show-';
    static ELEMENT_ID_MENU_TEXT_SHOW = '#menu-text-show-';
    static TEXT_SHOW_LABEL = 'Mostrar texto';
    static ID_MENU_TEXT_SIDE = 'menu-text-side-';
    static ELEMENT_ID_MENU_TEXT_SIDE = '#menu-text-side-';
    static ID_MENU_TEXT_INFO = 'menu-text-info-';
    static ELEMENT_ID_MENU_TEXT_INFO = '#menu-text-info-';
    static ID_MENU_FOOTER = 'menu-footer-';


    // Menu buttons
    static ID_BUTTON_SAVE = 'menu-button-save-';
    static ID_BUTTON_REMOVE = 'menu-button-remove-';
    static ID_BUTTON_RESET = 'menu-button-reset-';

    // Icons hover help text
    static SETTINGS_TITLE = 'Configuración';
    static REMOVE_TITLE = 'Eliminar';
    static BLOCK_TITLE = 'Bloquear';
    static TEMPLATES_TITLE = 'Plantillas';
    
    //Events
    static EVENT_MENU_CLOSE = 'event-menu-close-';
    static EVENT_STORED_SELECTED = 'event-menu-stored-selected-';
    static EVENT_STORED_SELECTED_FLOAT = 'event-menu-stored-selected-float-';
    static EVENT_OPEN_SETTINGS = 'event-menu-control-open-settings-';
    static EVENT_REMOVE = 'event-menu-control-remove-';
    static EVENT_BLOCK = 'event-menu-control-block-';
    // static EVENT_UPDATE_MODEL = 'event-menu-update-model-';
    
    // Controls events
    static EVENT_LINE_WIDTH_CHANGED = 'event-line-width-changed-';
    static EVENT_LINE_TYPE_CHANGED = 'event-line-type-changed-';
    static EVENT_OPACITY_CHANGED = 'event-opacity-changed-';
    static EVENT_TEXT_SHOW_CHANGED = 'event-text-show-changed-';
    static EVENT_TEXT_SIDE_CHANGED = 'event-text-side-changed-';
    static EVENT_TEXT_INFO_CHANGED = 'event-text-info-changed-';

    // Buttons events
    static EVENT_SUBMIT = 'event-menu-submit-';

    static EMPTY_FORM = {
        name: '',
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    }
    

    //----------------------------- PROPERTIES -----------------------------
    //Options
    MENU_LINE_WIDTH_OPTIONS = ['1', '2', '3', '4'];
    OPTIONS_LINE_WIDTH_TRANSLATOR = {
        '1': '1',
        '2': '4',
        '3': '9',
        '4': '16',
    };
    LINE_WIDTH_OPTIONS_TRANSLATOR = {
        '1': '1',
        '4': '2',
        '9': '3',
        '16': '4',
    };

    MENU_LINE_TYPE_OPTIONS = ['———', '--------', '···············'];
    OPTIONS_LINE_TYPE_TRANSLATOR = {
        '———': Const.LINE_SOLID,
        '--------': Const.LINE_DASH,
        '···············': Const.LINE_DOT,
    };
    LINE_TYPE_OPTIONS_TRANSLATOR = {
        [Const.LINE_SOLID]: '———',
        [Const.LINE_DASH]: '--------',
        [Const.LINE_DOT]: '···············',
    };

    MENU_TEXT_SIDE_OPTIONS = ['Izquierda', 'Derecha', 'Centro'];
    OPTIONS_TEXT_SIDE_TRANSLATOR = {
        'Izquierda': 'left',
        'Derecha': 'right',
        'Centro': 'center',
    };
    TEXT_SIDE_OPTIONS_TRANSLATOR = {
        'left' : 'Izquierda',
        'right' : 'Derecha',
        'center' : 'Centro',
    };
    MENU_TEXT_INFO_OPTIONS = ['%', 'Precio', '%(Precio)'];
    OPTIONS_TEXT_INFO_TRANSLATOR = {
        '%': '%',
        'Precio': 'value',
        '%(Precio)': '%(value)',
    };
    TEXT_INFO_OPTIONS_TRANSLATOR = {
        '%': '%',
        'value': 'Precio',
        '%(value)': '%(Precio)',
    };
    
    // TODO DUMMY DATA BORRAR
    prev_template = {
        name: 'TMP',
        type: GraphicComponent.NAME,
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
        type: GraphicComponent.NAME,
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    }

    name;
    models;
    model;
    menu;
    menuFloat;
    settings;
    remove;
    block;
    storedTemplatesFloat;
    storedTemplates;
    inputName;
    opacity;
    lineWidth;
    lineType;
    showText = true;
    textSideOptions;
    textInfoOptions;

    ref;
    openFloat = false;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        this.models = models;
        this.name  = GraphicComponent.NAME;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    getClickedStoredTemplates(templateName) {
        try {
            if(this.models.templates[this.name]) {
                let template = this.models.templates[this.name][templateName];
                if(template) {
                    this.loadControlsValues(template);
                }
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    loadControlsValues(config) {
        try {
            config = config || MenuChartGraphic.EMPTY_FORM;
            this.template = config;
            this.inputName.text = this.template.name;
            this.storedTemplatesFloat.selected = this.template.name;
            this.storedTemplates.selected = this.template.name;
            this.opacity.set_val(this.template.opacity);
            let lineWidth = this.LINE_WIDTH_OPTIONS_TRANSLATOR[this.template.lineWidth] || this.template.lineWidth;
            this.lineWidth.select(lineWidth);
            let lineType = this.LINE_TYPE_OPTIONS_TRANSLATOR[this.template.lineType] ||this.template.lineType;
            this.lineType.select(lineType);
            this.showText.checked = this.template.textShow;
            let textSide = this.TEXT_SIDE_OPTIONS_TRANSLATOR[this.template.textSide] || this.template.textSide;
            let textInfo = this.TEXT_INFO_OPTIONS_TRANSLATOR[this.template.textInfo] || this.template.textInfo;
            this.textSideOptions.select(textSide);
            this.textInfoOptions.select(textInfo);
        }
        catch(error) {
            console.error(error);
        }
    }

    readControlsValues() {
        try {
            let textSide = this.OPTIONS_TEXT_SIDE_TRANSLATOR[this.textSideOptions.selected] || this.textSideOptions.selected;
            let textInfo = this.OPTIONS_TEXT_INFO_TRANSLATOR[this.textInfoOptions.selected] || this.textInfoOptions.selected;
            let lineWidth = this.OPTIONS_LINE_WIDTH_TRANSLATOR[this.lineWidth.selected] || this.lineWidth.selected;
            let lineType = this.OPTIONS_LINE_TYPE_TRANSLATOR[this.lineType.selected] || this.lineType.selected;
            this.template = {
                type: this.name,
                name: this.inputName.text,
                colors: this.template.colors || [], // TODO XXX TEMPORAL HASTA CREAR CONTROL GRAFICO
                opacity: this.opacity.value,
                lineWidth: parseInt(lineWidth),
                lineType: lineType,
                textShow: this.showText.checked,
                textSide: textSide,
                textInfo: textInfo,
            }
            return this.template;
        }
        catch(error) {
            console.error(error);
        }
    }

    updateLock() {
        try {
            if(this.ref.controlStatus.blocked) {
                this.block.removeClass(`${Const.CLASS_ICON_UNLOCK}`); // ${Const.CLASS_HOVERABLE_ICON}`);
                this.block.addClass(`${Const.CLASS_ICON_LOCK} ${Const.CLASS_HOVERABLE_ICON_SELECTED}`);
                this.remove.removeClass(Const.CLASS_HOVERABLE_ICON);
                this.remove.addClass(Const.CLASS_DISABLED);
            }
            else {
                this.block.removeClass(`${Const.CLASS_ICON_LOCK} ${Const.CLASS_HOVERABLE_ICON_SELECTED}`);
                this.block.addClass(`${Const.CLASS_ICON_UNLOCK}`);// ${Const.CLASS_HOVERABLE_ICON}`);
                this.remove.addClass(Const.CLASS_HOVERABLE_ICON);
                this.remove.removeClass(Const.CLASS_DISABLED);
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    updateModel() {
        try {
            // Save current selected template
            let template_selected = this.inputName.text;
            // Load new model data available options
            this.storedTemplates.items = Object.keys(this.models.templates[this.name] || []);
            this.storedTemplatesFloat.items = Object.keys(this.models.templates[this.name] || []);
            // Restores previous selected template if still exists
            if(this.storedTemplates.items.includes(template_selected)) {
                this.storedTemplates.select(template_selected);
                this.storedTemplatesFloat.select(template_selected);
            }
        }
        catch(error) {
            console.error(error);
        }
    }
    
    deleteTemplate() {
        let values = this.readControlsValues();
        let template = { name: values.name, type: this.name };
        $(document).trigger(Const.EVENT_DDBB_DELETE_MODEL, [this.name, template]);
    }
    
    saveTemplate() {
        // Get stored info from controls
        let template = this.readControlsValues();
        if(template.name) {
            // Send DDBB query via chart controller
            $(document).trigger(Const.EVENT_DDBB_SAVE_MODEL, [this.name, template]);
        }
    }

    createMenuFloat() {
        // Creates main menu container
        this.menuFloat = new Display({
            id: MenuChartGraphic.ID_MENU_FLOAT+this.name,
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
            id: MenuChartGraphic.ID_MENU_FLOAT_HANDLE+this.name,
            class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_BACK_POINTS}`,
            css: { padding: '1em 0.5em', border: 'none' },
        });
        this.menuFloat.append_content(handle);


        // Settings
        this.settings = $('<div>', {
            id: MenuChartGraphic.ID_MENU_FLOAT_SETTIGNS+this.name,
            class: `${Const.CLASS_ICON_SETTINGS} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '1em' },
            title: MenuChartGraphic.SETTINGS_TITLE,
        });
        this.menuFloat.append_content(this.settings);
        this.settings.on('click', e => $(document).trigger(MenuChartGraphic.EVENT_OPEN_SETTINGS, [this.ref]));

        
        // Remove
        this.remove = $('<div>', {
            id: MenuChartGraphic.ID_MENU_FLOAT_REMOVE+this.name,
            class: `${Const.CLASS_ICON_REMOVE} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '1em' },
            title: MenuChartGraphic.REMOVE_TITLE,
        });
        this.menuFloat.append_content(this.remove);
        this.remove.on('click', e => {
            if(this.ref.controlStatus.blocked == false) {
                this.menuFloat.hide()
                $(document).trigger(MenuChartGraphic.EVENT_REMOVE, [this.ref]);
            }
        });

        
        // Block
        this.block = $('<div>', {
            id: MenuChartGraphic.ID_MENU_FLOAT_BLOCK+this.name,
            class: `${Const.CLASS_ICON_UNLOCK} ${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: { padding: '0.5em', 'font-size': '1.5em', },
            title: MenuChartGraphic.BLOCK_TITLE
        });
        this.menuFloat.append_content(this.block);
        this.block.on('click', e => {
            this.ref.controlStatus.blocked = !this.ref.controlStatus.blocked;
            this.updateLock();
        });


        // Templates dropdown
        this.storedTemplatesFloat = new Dropdown({
            id: MenuChartGraphic.ID_MENU_FLOAT_STORED_TEMPLATES+this.name,
            items: [],
            event: MenuChartGraphic.EVENT_STORED_SELECTED_FLOAT+this.name,
            header: { selected: true },
            select_unknown: true,
            class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
                container: { 'background-color': 'var(--color-invisible)', height: '1.35em', padding: '0.5em 0.3em', },
            },
            parent: this.menuFloat.control,
        });
        $(document).on(MenuChartGraphic.EVENT_STORED_SELECTED_FLOAT+this.name, (e, name) => {
            this.getClickedStoredTemplates(name)
        });

        // Append control element to floating menu
        // this.#stored_templates_float.controls.prop('title', MenuChartGraphic.TEMPLATES_TITLE);
        this.menuFloat.append_content(this.storedTemplatesFloat.controls);
 
    }

    createMenu() {
        // Creates main menu container
        this.menu = new Display({
            id: MenuChartGraphic.ID_MENU+this.name,
            title: this.name,
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

        this.menu.element_handle_close.on('click', e =>  $(document).trigger(MenuChartGraphic.EVENT_MENU_CLOSE+this.name, [this.name]) );
        this.menu.control.hide();

        // Add separator
        this.menu.append(Display.build_separator());

        // Creates name input box
        this.inputName = new Inputbox({
            id: MenuChartGraphic.ID_MENU_TEMPLATE_NAME+this.name,
            container: { class: Const.CLASS_MENU_FIELD },
            label: { text: 'Nombre', position: Const.LABEL_POSITION_BEFORE },
            input: { class: Const.CLASS_TEXT_INPUT,
                     placeholder: 'Nombre de plantilla  ',
                     css: { 'max-width': '9em',  'font-size': '0.8em' },
            }
        });

        // Templates dropdown
        this.storedTemplates = new Dropdown({
            id: MenuChartGraphic.ID_MENU_STORED_TEMPLATES+this.name,
            event: MenuChartGraphic.EVENT_STORED_SELECTED+this.name,
            items: [],
            header: { arrow: true },
            select_unknown: true,
            // class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
                // container: { 'background-color': 'var(--color-invisible)', height: '1.35em', padding: '0.5em 0.3em', },
            },
            parent: this.menu.control,
        });

        this.storedTemplates.controls.each( (i, c) => this.inputName.control.append(c) );
        $(document).on(MenuChartGraphic.EVENT_STORED_SELECTED+this.name, (e, templateName) => {
            this.getClickedStoredTemplates(templateName)
        });

        // Append control element to display
        this.menu.append_content(this.inputName.control);


        // Opacity
        let opacity_label_container = $('<div>', {
            css: { 'display': 'block', margin: '0 0 0 1em', },
        });
        let opacity_label = $('<p>', {
            id: MenuChartGraphic.ID_MENU_OPACITY_LABEL+this.name,
            class: Const.CLASS_MENU_FIELD,
            text: 'Opacidad',
        });
        opacity_label_container.append(opacity_label);
        this.menu.append_content(opacity_label_container);

        this.opacity = new Slider({
            id: MenuChartGraphic.ID_MENU_OPACITY+this.name,
            event: MenuChartGraphic.EVENT_OPACITY_CHANGED+this.name,
            units: '%',
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
        this.menu.append_content(this.opacity.control);

        $(document).on(MenuChartGraphic.EVENT_OPACITY_CHANGED+this.name, (e, opacity) => {
            this.template.opacity = parseInt(opacity);
            this.ref.setTemplate(this.template);
        });

        // Line width
        this.lineWidth = new Dropdown({
            id: MenuChartGraphic.ID_MENU_LINE_WIDTH+this.name,
            event: MenuChartGraphic.EVENT_LINE_WIDTH_CHANGED+this.name,
            items: this.MENU_LINE_WIDTH_OPTIONS,
            header: {
                selected: true,
                label: {
                    text: 'Grosor de línea',
                    position: Const.LABEL_POSITION_BEFORE,
                    css: { 'marging-bottom': '1em' },
                },
            },
            class: Const.CLASS_MENU_FIELD,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
            },
            parent: this.menu.control,
        });
        this.menu.append_content(this.lineWidth.control);
        this.lineWidth.select(this.MENU_LINE_WIDTH_OPTIONS[1]);

        $(document).on(MenuChartGraphic.EVENT_LINE_WIDTH_CHANGED+this.name, (e, lineWidth) => {
            this.template.lineWidth = parseInt(this.OPTIONS_LINE_WIDTH_TRANSLATOR[lineWidth]);
            this.ref.setTemplate(this.template);
        });

        // Line Type
        this.lineType = new Dropdown({
            id: MenuChartGraphic.ID_MENU_LINE_TYPE+this.name,
            event: MenuChartGraphic.EVENT_LINE_TYPE_CHANGED+this.name,
            items: this.MENU_LINE_TYPE_OPTIONS,
            header: {
                selected: true,
                label: {
                    text: 'Estilo de línea',
                    position: Const.LABEL_POSITION_BEFORE,
                    css: { 'marging-bottom': '1em' },
                },
            },
            class: Const.CLASS_MENU_FIELD,
            css: {
                items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
            },
            parent: this.menu.control,
        });
        this.menu.append_content(this.lineType.control);
        this.lineType.select(this.MENU_LINE_TYPE_OPTIONS[1]);

        $(document).on(MenuChartGraphic.EVENT_LINE_TYPE_CHANGED+this.name, (e, lineType) => {
            lineType = this.OPTIONS_LINE_TYPE_TRANSLATOR[lineType];
            this.template.lineType = lineType;
            this.ref.setTemplate(this.template);
        });

        // Show text
        this.showText = new Checkbox({
            id: MenuChartGraphic.ID_MENU_TEXT_SHOW+this.name,
            event: MenuChartGraphic.EVENT_TEXT_SHOW_CHANGED+this.name,
            label:MenuChartGraphic.TEXT_SHOW_LABEL,
            class: Const.CLASS_MENU_FIELD,
        });
        this.menu.append_content(this.showText.control);

        $(document).on(MenuChartGraphic.EVENT_TEXT_SHOW_CHANGED+this.name, (e, textShow) => {
            this.template.textShow = textShow;
            this.ref.setTemplate(this.template);
        });

        // Text side
        this.textSideOptions = new Dropdown({
            id: MenuChartGraphic.ID_MENU_TEXT_SIDE+this.name,
            event: MenuChartGraphic.EVENT_TEXT_SIDE_CHANGED+this.name,
            items: this.MENU_TEXT_SIDE_OPTIONS,
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
            parent: this.menu.control,
        });
        this.menu.append_content(this.textSideOptions.control);
        this.textSideOptions.select(this.MENU_TEXT_SIDE_OPTIONS[1]);

        $(document).on(MenuChartGraphic.EVENT_TEXT_SIDE_CHANGED+this.name, (e, textSide) => {
            textSide = this.OPTIONS_TEXT_SIDE_TRANSLATOR[textSide];
            this.template.textSide = textSide;
            this.ref.setTemplate(this.template);
        });

        // Text info
        this.textInfoOptions = new Dropdown({
            id: MenuChartGraphic.ID_MENU_TEXT_INFO+this.name,
            items: this.MENU_TEXT_INFO_OPTIONS,
            event: MenuChartGraphic.EVENT_TEXT_INFO_CHANGED+this.name,
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
            parent: this.menu.control,
        });
        this.menu.append_content(this.textInfoOptions.control);
        this.textInfoOptions.select(this.MENU_TEXT_INFO_OPTIONS[0]);
        
        $(document).on(MenuChartGraphic.EVENT_TEXT_INFO_CHANGED+this.name, (e, textInfo) => {
            textInfo = this.OPTIONS_TEXT_INFO_TRANSLATOR[textInfo];
            this.template.textInfo = textInfo;
            this.ref.setTemplate(this.template);
        });

        this.createMenuButtons();
    }

    createMenuButtons() {
        let menu_footer = $('<div>', {
            id: MenuChartGraphic.ID_MENU_FOOTER+this.name,
            css: { 'margin': '0 0 4em 1em', },
        });

        // Add button save template
        let button_save = $('<div>', {
            id: MenuChartGraphic.ID_BUTTON_SAVE+this.name,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_SAVE}`,
            title: 'Guardar plantilla'
        });
        menu_footer.append(button_save);
        button_save.on('click', e => this.saveTemplate())

        // Add button delete pattern
        let button_delete = $('<div>', {
            id: MenuChartGraphic.ID_BUTTON_REMOVE+this.name,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_REMOVE}`,
            title: 'Eliminar plantilla'
        });
        menu_footer.append(button_delete);
        button_delete.on('click', e => this.deleteTemplate());

        // Add button reset form
        let button_reset = $('<div>', {
            id: MenuChartGraphic.ID_BUTTON_RESET+this.name,
            class: `${Const.CLASS_BUTTON_GENERAL} ${Display.CLASS_ICONS} ${Const.CLASS_ICON_CLEAR}`,
            title: 'Limpiar formulario'
        });
        menu_footer.append(button_reset);
        // button_reset.on('click', e => this.loadControlsValues(MenuChartGraphic.EMPTY_FORM));
        button_reset.on('click', e => this.loadControlsValues());

        this.menu.append(menu_footer);
    }
    
    initEvents() {
        try {
            $(document).on(Const.EVENT_UPDATE_MODEL, (e, source) => {
                if(source == this.name) {
                    this.updateModel();
                }
            });

            // $(document).on(Const.EVENT_CLOSE, e => $(document).trigger(MenuFibonacci.EVENT_MENU_CLOSE, [Fibonacci.NAME]));

            // TODO LANZAR EVENTO SUBMIT CON CADA CAMBIO DE VALOR, SE DEBE VER INTERACTIVO EN PANTALLA
            $(document).on(MenuChartGraphic.EVENT_SUBMIT+this.name, e => {
            });
        }
        catch(error) {
            console.error(error);
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        this.createMenuFloat();
        this.createMenu();
        this.initEvents();
    }

    show(params) {
        this.menuFloat.hide();
        this.menu.show();
        this.loadControlsValues(params.template);
    }

    hide() {
        this.menu.hide();
        if(this.openFloat) {
            this.menuFloat.show();
        }
    }

    show_float(params) {
        this.openFloat = true;
        this.menuFloat.show();
        this.ref = params;
        this.template = params.template;
        this.storedTemplatesFloat.select(this.template.name);
        this.updateLock();
    }

    hide_float() {
        this.menuFloat.hide();
        this.openFloat = false;
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