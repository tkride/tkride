

/**file: menu_alarm_component.js */

class MenuAlertComponent extends MenuChartGraphic {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'menu-alert-component';
    static TITLE = 'Programar Alerta';
    static MENU_ICON = '#alert-component';

    // Elements
    // Float menu
    static ID_MENU_FLOAT = 'menu-float-AlertComponent';
    static ELEMENT_ID_MENU_FLOAT = '#menu-float-AlertComponent';
    
    // Menu
    static ID_MENU = 'menu-AlertComponent';
    static ELEMENT_ID_MENU = '#menu-AlertComponent';
    static ID_MENU_STORED_TEMPLATES = 'menu-stored-templates-AlertComponent';
    static ELEMENT_ID_MENU_STORED_TEMPLATES = '#menu-stored-templates-AlertComponent';
    static ID_MENU_TEMPLATE_NAME = 'menu-template-name-AlertComponent';
    static ELEMENT_ID_MENU_TEMPLATE_NAME = '#menu-template-name-AlertComponent';
    static ID_MENU_RET_VALUES_LABEL = 'menu-ret-values-label-AlertComponent';
    static ELEMENT_ID_MENU_RET_VALUES_LABEL = '#menu-ret-values-label-AlertComponent';
    static ID_MENU_RET_VALUES = 'menu-ret-values-AlertComponent';
    static ELEMENT_ID_MENU_RET_VALUES = '#menu-ret_values-AlertComponent';
    
    // Buttons events
    static EVENT_SUBMIT = 'event-menu-submit-AlertComponent';
    static EVENT_RET_VALUES_CHANGED = 'event-ret-values-changed-AlertComponent';

    static EMPTY_FORM = {
        name: '',
        [Const.RET_LEVELS_ID]: [],
        colors: [],
        opacity: 100,
        lineWidth: 8,
        lineType: Const.LINE_DASH,
        textShow: false,
        textSide: 'right',
        textInfo: '%',
    }
    

    //----------------------------- PROPERTIES -----------------------------

    // TODO DUMMY DATA BORRAR
    prev_template = {
        name: 'TMP',
        type: AlertComponent.NAME,
        colors: ['#FF7D00'],
        opacity: 100,
        lineWidth: 8,
        lineType: Const.LINE_DASH,
        textShow: false,
        textSide: 'right',
        textInfo: '%',
    };

    template = {
        name: '',
        type: AlertComponent.NAME,
        levels: [],
        colors: [],
        opacity: 100,
        lineWidth: 8,
        lineType: Const.LINE_DASH,
        textShow: false,
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
            config = config || MenuAlertComponent.EMPTY_FORM;
            super.loadControlsValues(config);
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
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        $(MenuAlertComponent.MENU_ICON).prop('title', MenuAlertComponent.TITLE);

        this.name = AlertComponent.NAME;

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