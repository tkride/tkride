

/**file: menu_rectangle_graphic.js */

class MenuRectangleGraphic extends MenuChartGraphic {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-rectangle-graphic';
    static TITLE = 'Rectángulo';
    static MENU_ICON = '#rectangle-graphic';

    // Elements
    // Float menu
    static ID_MENU_FLOAT = 'menu-float-RectangleGraphic';
    static ELEMENT_ID_MENU_FLOAT = '#menu-float-RectangleGraphic';
    
    // Menu
    static ID_MENU = 'menu-RectangleGraphic';
    static ELEMENT_ID_MENU = '#menu-RectangleGraphic';
    static ID_MENU_STORED_TEMPLATES = 'menu-stored-templates-RectangleGraphic';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-stored-templates-RectangleGraphic';
    static ID_MENU_TEMPLATE_NAME = 'menu-template-name-RectangleGraphic';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-template-name-RectangleGraphic';
    static ID_MENU_RET_VALUES_LABEL = 'menu-ret-values-label-RectangleGraphic';
    static ELEMENT_ID_MENU_RET_VALUES_LABEL = '#menu-ret-values-label-RectangleGraphic';
    static ID_MENU_RET_VALUES = 'menu-ret-values-RectangleGraphic';
    static ELEMENT_ID_MENU_RET_VALUES = '#menu-ret_values-RectangleGraphic';
    
    //Events
    // static EVENT_MENU_CLOSE = 'event-menu-close-RectangleGraphic';
    // static EVENT_STORED_SELECTED = 'event-menu-stored-selected-RectangleGraphic';
    // static EVENT_OPEN_SETTINGS = 'event-menu-control-open-settings-RectangleGraphic';
    // static EVENT_REMOVE = 'event-menu-control-remove-RectangleGraphic';
    // static EVENT_BLOCK = 'event-menu-control-block-RectangleGraphic';
    
    // Buttons events
    static EVENT_SUBMIT = 'event-menu-submit-RectangleGraphic';
    static EVENT_RET_VALUES_CHANGED = 'event-ret-values-changed-RectangleGraphic';

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
        type: RectangleGraphic.NAME,
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
        type: RectangleGraphic.NAME,
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
            config = config || MenuRectangleGraphic.EMPTY_FORM;
            super.loadControlsValues(config);
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
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuRectangleGraphic.MENU_ICON).prop('title', MenuRectangleGraphic.TITLE);

        this.name = RectangleGraphic.NAME;

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