

/**file: menu_fibonacci.js */

class MenuFibonacci extends MenuChartGraphic {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-fibonacci';
    static TITLE = 'Retroceso Fibonacci';
    static MENU_ICON = '#fibonacci-retracement';

    // Elements
    // Float menu
    static ID_MENU_FLOAT = 'menu-float-Fibonacci';
    static ELEMENT_ID_MENU_FLOAT = '#menu-float-Fibonacci';
    
    // Menu
    static ID_MENU = 'menu-Fibonacci';
    static ELEMENT_ID_MENU = '#menu-Fibonacci';
    static ID_MENU_STORED_TEMPLATES = 'menu-stored-templates-Fibonacci';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-stored-templates-Fibonacci';
    static ID_MENU_TEMPLATE_NAME = 'menu-template-name-Fibonacci';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-template-name-Fibonacci';
    static ID_MENU_RET_VALUES_LABEL = 'menu-ret-values-label-Fibonacci';
    static ELEMENT_ID_MENU_RET_VALUES_LABEL = '#menu-ret-values-label-Fibonacci';
    static ID_MENU_RET_VALUES = 'menu-ret-values-Fibonacci';
    static ELEMENT_ID_MENU_RET_VALUES = '#menu-ret_values-Fibonacci';
    
    //Events
    // static EVENT_MENU_CLOSE = 'event-menu-close-Fibonacci';
    // static EVENT_STORED_SELECTED = 'event-menu-stored-selected-Fibonacci';
    // static EVENT_OPEN_SETTINGS = 'event-menu-control-open-settings-Fibonacci';
    // static EVENT_REMOVE = 'event-menu-control-remove-Fibonacci';
    // static EVENT_BLOCK = 'event-menu-control-block-Fibonacci';

    // Buttons events
    static EVENT_SUBMIT = 'event-menu-submit-Fibonacci';
    static EVENT_RET_VALUES_CHANGED = 'event-ret-values-changed-Fibonacci';

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

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        super(models);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    loadControlsValues(config) {
        try {
            config = config || MenuFibonacci.EMPTY_FORM;
            super.loadControlsValues(config);
            this.retValues.text = (this.template.levels.length > 0) ?
                                        this.template.levels.reduce( (s, l) => s+','+l)
                                        : '';
        }
        catch(error) {
            console.error(error);
        }
    }

    readControlsValues() {
        try {
            super.readControlsValues();
            let levels = this.retValues.text.split(',');
            this.template[Const.RET_LEVELS_ID] = levels;
            return this.template;
        }
        catch(error) {
            console.error(error);
        }
    }

    createMenuFloat() {
        super.createMenuFloat();

    //     // Templates dropdown
    //     this.storedTemplatesFloat = new Dropdown({
    //         id: MenuFibonacci.ID_MENU_FLOAT_STORED_TEMPLATES,
    //         items: [],
    //         event: MenuFibonacci.EVENT_STORED_SELECTED,
    //         header: { selected: true },
    //         select_unknown: true,
    //         class: `${Display.CLASS_ICONS_FLOAT} ${Const.CLASS_HOVERABLE_ICON}`,
    //         css: {
    //             items: { 'font-size': '0.8em', 'font-weight': '400', left: '0%', },
    //             container: { 'background-color': 'var(--color-invisible)', height: '1.35em', padding: '0.5em 0.3em', },
    //         },
    //         parent: this.menuFloat.control,
    //     });
    //     $(document).on(MenuFibonacci.EVENT_STORED_SELECTED, (e, name) => {
    //         this.getClickedStoredTemplates(name)
    //     });

    //     // Append control element to floating menu
    //     // this.#stored_templates_float.controls.prop('title', MenuFibonacci.TEMPLATES_TITLE);
    //     this.menuFloat.append_content(this.storedTemplatesFloat.controls);
    }

    createMenu() {
        super.createMenu();

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
        // Append control element to display
        this.menu.append_content(ret_label_container);
        
        // Add retracement values
        this.retValues = new Inputbox({
            id: MenuFibonacci.ID_MENU_RET_VALUES,
            event: MenuFibonacci.EVENT_RET_VALUES_CHANGED,
            container: { class: Const.CLASS_MENU_FIELD, tooltip: 'Valores de retroceso de fibonacci (ej: 0.23, 0.382, >0.618). Admite operadores > y <.)' },
            input: { css: {'min-width': '13.5em' },  placeholder: 'Valores retroceso Fibonacci  ' }
        });
        // Append control element to display
        this.menu.append_content(this.retValues.control);

        $(document).on(MenuFibonacci.EVENT_RET_VALUES_CHANGED, (e, retracements) => {
            retracements = retracements.split(',');
            this.template.levels = retracements;
            this.ref.setTemplate(this.template);
        });
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuFibonacci.MENU_ICON).prop('title', MenuFibonacci.TITLE);

        this.name = Fibonacci.NAME;

        // this.MENU_TEXT_SIDE_OPTIONS = ['Izquierda', 'Derecha', 'Centro'];
        // this.TEXT_SIDE_OPTIONS_TRANSLATOR = {
        //     'Izquierda': 'left',
        //     'Derecha': 'right',
        //     'Centro': 'center',
        // };
        // this.SIDE_TEXT_OPTIONS_TRANSLATOR = {
        //     'left' : 'Izquierda',
        //     'right' : 'Derecha',
        //     'center' : 'Centro',
        // };
        // this.MENU_TEXT_INFO_OPTIONS = ['%', 'Precio', '%(Precio)'];
        // this.TEXT_INFO_OPTIONS_TRANSLATOR = {
        //     '%': '%',
        //     'Precio': 'value',
        //     '%(Precio)': '%(value)',
        // };
        // this.INFO_TEXT_OPTIONS_TRANSLATOR = {
        //     '%': '%',
        //     'value': 'Precio',
        //     '%(value)': '%(Precio)',
        // };

        this.createMenuFloat();
        this.createMenu();
        this.initEvents();
    }

}