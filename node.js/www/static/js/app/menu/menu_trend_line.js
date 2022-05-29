

/**file: menu_trend_line.js */

class MenuTrendLine extends MenuChartGraphic {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-trend-line';
    static TITLE = 'Línea de Tendencia';
    static MENU_ICON = '#trend-line';

    // Elements
    // Float menu
    static ID_MENU_FLOAT = 'menu-float-TrendLine';
    static ELEMENT_ID_MENU_FLOAT = '#menu-float-TrendLine';
    
    // Menu
    static ID_MENU = 'menu-TrendLine';
    static ELEMENT_ID_MENU = '#menu-TrendLine';
    static ID_MENU_STORED_TEMPLATES = 'menu-stored-templates-TrendLine';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-stored-templates-TrendLine';
    static ID_MENU_TEMPLATE_NAME = 'menu-template-name-TrendLine';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-template-name-TrendLine';
    static ID_MENU_RET_VALUES_LABEL = 'menu-ret-values-label-TrendLine';
    static ELEMENT_ID_MENU_RET_VALUES_LABEL = '#menu-ret-values-label-TrendLine';
    static ID_MENU_RET_VALUES = 'menu-ret-values-TrendLine';
    static ELEMENT_ID_MENU_RET_VALUES = '#menu-ret_values-TrendLine';
    
    //Events
    // static EVENT_MENU_CLOSE = 'event-menu-close-TrendLine';
    // static EVENT_STORED_SELECTED = 'event-menu-stored-selected-TrendLine';
    // static EVENT_OPEN_SETTINGS = 'event-menu-control-open-settings-TrendLine';
    // static EVENT_REMOVE = 'event-menu-control-remove-TrendLine';
    // static EVENT_BLOCK = 'event-menu-control-block-TrendLine';
    
    // Buttons events
    static EVENT_SUBMIT = 'event-menu-submit-TrendLine';
    static EVENT_RET_VALUES_CHANGED = 'event-ret-values-changed-TrendLine';

    static EMPTY_FORM = {
        name: '',
        [Const.RET_LEVELS_ID]: [],
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: false,
        textSide: 'right',
        textInfo: '%',
    }
    

    //----------------------------- PROPERTIES -----------------------------

    // TODO DUMMY DATA BORRAR
    prev_template = {
        name: 'TMP',
        type: TrendLine.NAME,
        colors: ['#FF7D00', '#7DFF00', '#007DFF'],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: false,
        textSide: 'right',
        textInfo: '%',
    };

    template = {
        name: '',
        type: TrendLine.NAME,
        levels: [],
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: false,
        textSide: 'right',
        textInfo: '%',
    }

    // colorPicker = { ...this.colorPicker };

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        super(models);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    loadControlsValues(config) {
        try {
            config = config || MenuTrendLine.EMPTY_FORM;
            super.loadControlsValues(config);
            this.colorPicker.color = this.template.colors[0];
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

        // Color picker
        this.colorPicker = new ColorPicker({
            id: `${MenuChartGraphic.COLOR_PICKER}${this.name}`,
            classControl: Const.CLASS_MENU_FIELD,
            label: { text: 'Color' },
            color: this.template.colors[0],
            callback: color => {
                this.template.colors = [color];
                this.ref.setTemplate(this.template);
            },
        });
        this.menu.append_content(this.colorPicker.control);
        this.colorPicker.init();
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuTrendLine.MENU_ICON).prop('title', MenuTrendLine.TITLE);

        this.name = TrendLine.NAME;

        this.MENU_TEXT_INFO_OPTIONS = ['%', 'Ángulo', '%(Ángulo)'];
        this.OPTIONS_TEXT_INFO_TRANSLATOR = {
            '%': '%',
            'Ángulo': 'value',
            '%(Ángulo)': '%(value)',
        };
        this.TEXT_INFO_OPTIONS_TRANSLATOR = {
            '%': '%',
            'value': 'Ángulo',
            '%(value)': '%(Ángulo)',
        };

        this.createMenuFloat();
        this.createMenu();
        this.initEvents();
    }

}