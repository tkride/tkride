

/**file: menu_rectangle_graphic.js */

class MenuCircleGraphic extends MenuChartGraphic {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-circle-graphic';
    static TITLE = 'Círculo';
    static MENU_ICON = '#circle-graphic';

    // Elements
    // Float menu
    static ID_MENU_FLOAT = 'menu-float-CircleGraphic';
    static ELEMENT_ID_MENU_FLOAT = '#menu-float-CircleGraphic';
    
    // Menu
    static ID_MENU = 'menu-CircleGraphic';
    static ELEMENT_ID_MENU = '#menu-CircleGraphic';
    static ID_MENU_STORED_TEMPLATES = 'menu-stored-templates-CircleGraphic';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-stored-templates-CircleGraphic';
    static ID_MENU_TEMPLATE_NAME = 'menu-template-name-CircleGraphic';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-template-name-CircleGraphic';
    static ID_MENU_RET_VALUES_LABEL = 'menu-ret-values-label-CircleGraphic';
    static ELEMENT_ID_MENU_RET_VALUES_LABEL = '#menu-ret-values-label-CircleGraphic';
    static ID_MENU_RET_VALUES = 'menu-ret-values-CircleGraphic';
    static ELEMENT_ID_MENU_RET_VALUES = '#menu-ret_values-CircleGraphic';
    
    //Events
    // static EVENT_MENU_CLOSE = 'event-menu-close-CircleGraphic';
    // static EVENT_STORED_SELECTED = 'event-menu-stored-selected-CircleGraphic';
    // static EVENT_OPEN_SETTINGS = 'event-menu-control-open-settings-CircleGraphic';
    // static EVENT_REMOVE = 'event-menu-control-remove-CircleGraphic';
    // static EVENT_BLOCK = 'event-menu-control-block-CircleGraphic';
    
    // Buttons events
    static EVENT_SUBMIT = 'event-menu-submit-CircleGraphic';
    static EVENT_RET_VALUES_CHANGED = 'event-ret-values-changed-CircleGraphic';

    static EMPTY_FORM = {
        name: '',
        [Const.RET_LEVELS_ID]: [],
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: false,
        textSide: 'right',
        textInfo: 'value',
    }
    

    //----------------------------- PROPERTIES -----------------------------

    // TODO DUMMY DATA BORRAR
    prev_template = {
        name: 'TMP',
        type: CircleGraphic.NAME,
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
        type: CircleGraphic.NAME,
        levels: [],
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: false,
        textSide: 'right',
        textInfo: 'value',
    }

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        super(models);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    loadControlsValues(config) {
        try {
            config = config || MenuCircleGraphic.EMPTY_FORM;
            super.loadControlsValues(config);
            this.colorPicker.color = this.template.colors[0];
            this.colorPickerFillColor.color = this.template.fillColors[0];
        }
        catch(error) {
            console.error(error);
        }
    }

    readControlsValues() {
        try {
            super.readControlsValues();
            this.template.colors = [this.colorPicker.color];
            this.template.fillColors = [this.colorPickerFillColor.color];
            return this.template;
        }
        catch(error) {
            console.error(error);
        }
    }

    createMenuFloat() {
        super.createMenuFloat();
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

        // Fill color picker
        this.colorPickerFillColor = new ColorPicker({
            id: `${MenuChartGraphic.COLOR_PICKER}${MenuRectangleGraphic.FILL_COLOR_PICKER}${this.name}`,
            classControl: Const.CLASS_MENU_FIELD,
            label: { text: 'Relleno' },
            color: this.template.fill,
            callback: color => {
                this.template.fillColors = [color];
                this.ref.setTemplate(this.template);
            },
        });
        this.menu.append_content(this.colorPickerFillColor.control);
        this.colorPickerFillColor.init();
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuCircleGraphic.MENU_ICON).prop('title', MenuCircleGraphic.TITLE);

        this.name = CircleGraphic.NAME;

        this.MENU_TEXT_INFO_OPTIONS = ['Texto'];
        this.OPTIONS_TEXT_INFO_TRANSLATOR = {
            'Texto': 'value',
        };
        this.TEXT_INFO_OPTIONS_TRANSLATOR = {
            'value': 'Texto',
        };

        this.createMenuFloat();
        this.createMenu();
        this.initEvents();
    }

}