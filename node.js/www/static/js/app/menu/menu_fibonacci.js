

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

    static CLASS_LEVEL_CONTROL_CONTAINER = 'level-control-container-fibonacci';
    static LEVEL_CONTROL_NAME = 'level-control-';
    
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

    //----------------------------- PUBLIC METHODS -----------------------------

    loadControlsValues(config) {
        try {
            let lastConfigStr;
            let configStr;
            if(this.lastConfig
                && ( Object.keys(this.lastConfig).length == Object.keys(config).length )
            ) {
                lastConfigStr = JSON.stringify(Object.entries(this.lastConfig).sort());
                configStr = JSON.stringify(Object.entries(config).sort());
            }

            if( (!lastConfigStr) || ( lastConfigStr != configStr) ) {
                config = config || MenuFibonacci.EMPTY_FORM;
                super.loadControlsValues(config);
                // this.retValues.text = (this.template.levels.length > 0) ?
                //                             this.template.levels.reduce( (s, l) => s+','+l)
                //                             : '';
                this.createLevelControls();
                this.lastConfig = config;
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    readControlsValues() {
        try {
            super.readControlsValues();
            // let levels = this.retValues.text.split(',');
            // this.template[Const.RET_LEVELS_ID] = levels;
            if(this.inputColors.length) {
                this.template.levels = [];
                this.template.colors = [];

                this.inputColors.forEach( (ic,i) => {
                    this.template.levels.push(ic.inputBox.text);
                    this.template.colors.push(ic.colorPicker.color);
                });
            }
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

        let retLabelContainer = $('<div>', {
            css: { 'display': 'block', margin: '0 0 0 1em', },
            class: Const.CLASS_MENU_FIELD,
        });
        let retLabel = $('<p>', {
            id: MenuFibonacci.ID_MENU_RET_VALUES_LABEL,
            text: 'Valores retroceso',
        });
        retLabelContainer.append(retLabel);
        
        let levelAdd = $('<div>', {
            class: `${Const.CLASS_ICON_ADD} ${Const.CLASS_HOVERABLE_TEXT}`,
            title: 'Agregar retroceso',
        });
        retLabelContainer.append(levelAdd);

        let levelRemove = $('<div>', {
            class: `${Const.CLASS_ICON_MINUS} ${Const.CLASS_HOVERABLE_TEXT}`,
            title: 'Eliminar retroceso',
        });
        retLabelContainer.append(levelRemove);

        // Append control element to display
        this.menu.append_content(retLabelContainer);

        levelAdd.on('click', e => {
            this.template.levels.push( this.template.levels.at(-1) || 1);
            this.inputColors.push(this.addLevelControl(this.template.levels.at(-1), this.template.levels.length-1));
        })

        levelRemove.on('click', e => {
            this.template.levels.pop();
            this.template.colors.pop();
            this.inputColors.pop();
            let childs = this.levelControlLines.at(-1).children();
            if(childs.length > 1) {
                this.menu.remove(childs[childs.length-1]);
                this.levelControlLines.at(-1).remove(childs[childs.length-1]);
            }
            else {
                this.menu.remove(this.levelControlLines.at(-1)[0]);
                this.levelControlLines.pop();
            }
        })

        this.createLevelControls();

        // // Add retracement values
        // this.retValues = new Inputbox({
        //     id: MenuFibonacci.ID_MENU_RET_VALUES,
        //     event: MenuFibonacci.EVENT_RET_VALUES_CHANGED,
        //     container: { class: Const.CLASS_MENU_FIELD, tooltip: 'Valores de retroceso de fibonacci (ej: 0.23, 0.382, >0.618). Admite operadores > y <.)' },
        //     input: { css: {'min-width': '13.5em' },  placeholder: 'Valores retroceso Fibonacci  ' }
        // });
        // // Append control element to display
        // this.menu.append_content(this.retValues.control);

        // $(document).on(MenuFibonacci.EVENT_RET_VALUES_CHANGED, (e, retracements) => {
        //     retracements = retracements.split(',');
        //     this.template.levels = retracements;
        //     this.ref.setTemplate(this.template);
        // });
    }

    createLevelControls() {
        this.template.levels = this.template.levels || [];
        
        if(this.levelControlLines && this.levelControlLines.length) {
            this.levelControlLines.forEach( c => this.menu.remove(c) );
        }
        
        this.levelControlLines = [];
        this.lastLevelSide = false;
        this.inputColors = [];
        this.template.levels.forEach( (level, i) => {
            this.inputColors.push(this.addLevelControl(level, i));
        });
    }

    addLevelControl(level, i) {
        let lc = new InputColor({
            id: `${MenuFibonacci.LEVEL_CONTROL_NAME}${level}-${i}`,
            // classControl: Const.CLASS_MENU_FIELD,
            input: {
                input: { text: level },
                callback: text => {
                    this.template.levels[i] = text;
                    this.ref.setTemplate(this.template);
                },
                limit: text => text.replace(/[^.0-9]/g, ''),
            },
            colorPicker: {
                color: this.template.colors[i],
                callback: color => {
                    this.template.colors[i] = color || this.template.colors.at(-1);
                    this.ref.setTemplate(this.template);
                }
            }
        });

        // Control created at left
        if(!this.lastLevelSide) {
            this.levelControlLines.push($('<div>', {
            class: `${MenuFibonacci.CLASS_LEVEL_CONTROL_CONTAINER} ${Const.CLASS_MENU_FIELD}`,
            }));
            this.menu.append_content(this.levelControlLines.at(-1));
        }

        // Control created at right
        this.levelControlLines.at(-1).append(lc.control);
        lc.init();
        this.lastLevelSide = !this.lastLevelSide;

        return lc;
    }

    //----------------------------- INIT METHOD -----------------------------

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