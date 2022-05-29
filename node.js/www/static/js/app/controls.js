
/** 'controls.js' */

/**
 * Dropdown
 * @param el DOM control ID. If DOM element passed, uses it, if string passed, creates it.
 * @param items List of items for dropdown list. If no provided, check for html micro-data
 *              'data-items'.
 * @param header Header control settings { selected | label | arrow }. Can be used all together.
 * @param header.selected { true: show selected item from items list in control header | false(default): don't show }
 * @param header.label { text: label text shown in control header | position: { before | after | inside } | class: specific class applied to label | css: custom style applied to label }
 * @param header.label.position { 'before': Shows label before control.  |  'after': shows label after control.  |  'inside': shows label in control header. }
 * @param header.arrow { true: show down arrow in control header | false(default): don't show }
 * @param event Event/Callback callback name when clicking a list item. If no one provided,
 *                   check for HTML micro-data 'data-event'. If function provided, then
 *                   callback is called when clicking items, instead of triggering event.
 * @param css Aplies CSS properties to each element: css: { container: {..}, items: {..}, label: {..} }
 * @param select_unknown Let select items not available in list.
 * @note Event is triggered to 'document'.
 */
class Dropdown {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "dropdown";
    static CLASS_DROPDOWN = 'dropdown';
    static ELEMENT_CLASS_DROPDOWN = '.dropdown';
    static CLASS_DROPDOWN_CONTENT = 'dropdown-content';
    static ELEMENT_DIV_DROPDOWN_CONTENT = '<div class="' + Dropdown.CLASS_DROPDOWN_CONTENT + '"></div>';

    //----------------------------- PROPERTIES -----------------------------

    #items = [];
    #event_name;
    #callback;
    #control;
    #container_id;
    #header = { label: { enabled: false }, selected: { enabled: false }, arrow: { enabed: false} };
    #items_cont;
    #class;
    #select_unknown = false
    parent;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        if(!params) params = {};
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------

    init(params) {
        let dd;
        let items;

        params = params || {};

        this.parent = params.parent;

        // Let force select unknown items
        if(params.select_unknown) { this.#select_unknown = (params.select_unknown == true) ? true : false; }

        // If DOM element passed
        if(params.element != undefined) {
            dd = $(params.element);
            this.#container_id = $(params.element).prop('id');
        }
        //If identifier passed as string, get element from DOM ...
        else if (params.id != undefined) {
            // dd = $(`#${params.id}`);
            this.#container_id = params.id.replace(/[#.\s]+/g, ''); //Removes '#' or '.' character from element identification
            dd = $('<div id="' + this.#container_id + '" class="' + Dropdown.CLASS_DROPDOWN + ' ' + Const.CLASS_BUTTON_SLIM + '"></div>');
        }

        // If no items/event-callback provided, try to get from html micro-data
        if(params.items == undefined) {
            items = dd.data('items');
            if(items) items = items.split(',');
        }
        else items = params.items;

        if((params.event == undefined) && (params.callback == undefined)) {
            this.#event_name = dd.data('event');
            if(!this.#event_name) this.#callback = dd.data('callback');
        }
        else {
            if(params.event != undefined) {
                this.#event_name = params.event;
            }
            else if(params.callback != undefined) {
                this.#callback = params.callback;
                if(typeof this.#callback != "function") {
                    console.warn('WARNING: @Dropdown::init(): provided callback is not a function, "eval" will be applied.');
                    this.#callback = eval(this.#callback);
                }
            }
        }

        if(params.class) {
            this.#class = params.class;
        }

        // If parent does not exist, creates it
        if(dd.length == 0) {
            // dd = $('<div id="' + this.#container_id + '" class="' + Dropdown.CLASS_DROPDOWN + ' ' + Const.CLASS_BUTTON_SLIM + '"></div>');
        }

        // Set header behaviour
        if(params.header) {
            // Build label
            if(params.header.label) {
                this.#header.label = params.header.label;
                this.#header.label.enabled = true;
                let label_class = (this.#header.label.class) ? this.#header.label.class : '';
                this.#header.label.control = $(`<span id='${this.#container_id}-label' class='${label_class}'></span>`);
                if(params.css.label) { this.#header.label.css = params.css.label; }
                if(this.#header.label.css) {
                    this.#header.label.control.css(this.#header.label.css);
                }
            }

            // Shows selected item
            if(params.header.selected) {
                this.#header.selected.enabled = true;
                // Add header span control to set text (selected item)
                this.#header.selected.control = $(`<span id='${this.#container_id}-selected'></span>`);
            }
            
            if(params.header.arrow) {
                this.#header.arrow.enabled = true;
                // Add header span control to set arrow icon
                let classes = Const.CLASS_ICON_ARROW_DOWN;
                if(this.#header.selected.enabled || this.#header.label.position == Const.LABEL_POSITION_INSIDE) {
                    classes += ' ' + Const.CLASS_DROPDOWN_ARROW;
                }
                this.#header.arrow.control = $(`<span id='${this.#container_id}-arrow' class='${classes}'></span>`);
            }
        }

        if(dd.length) {
            this.#control = dd;

            if(params.css) {
                if(params.css.container) {
                    this.#control.css(params.css.container);
                }
            }
            
            // Stores custom object in DOM element
            this.#control.data('Dropdown', this);

            if(this.#header.selected.enabled) {
                this.#control.append(this.#header.selected.control);
            }

            //If label text configured
            if(this.#header.label.enabled) {
                if(this.#header.label.position == Const.LABEL_POSITION_BEFORE) {    
                    this.#control.splice(0, 0, this.#header.label.control[0]);
                }
                else if(this.#header.label.position == Const.LABEL_POSITION_AFTER) {
                    this.#control.push(this.#header.label.control);
                }
                else if((this.#header.label.position == undefined) || (this.#header.label.position == Const.LABEL_POSITION_INSIDE)) {
                    this.#control.append(this.#header.label.control);
                }
            }

            // Set arrow header icon
            if(this.#header.arrow.enabled) {
                this.#control.append(this.#header.arrow.control);
            }
        
            // Add dropdown container
            this.#items_cont = $('<div id="' + this.#control.prop('id') + '-content" class="' + Dropdown.CLASS_DROPDOWN_CONTENT + '"></div>');
            if(params.css) {
                if(params.css.items) {
                    this.#items_cont.css(params.css.items);
                }
            }
            this.#control.append(this.#items_cont);
    
            //Creates elements and event/callback interaction
            this.items = items;

            // Set label text
            if(this.#header.label.enabled) this.#header.label.control.text(this.#header.label.text);

            
            // Create main control container
            let main_container = $('<div>', {
                id: this.#container_id + '-container',
                class: (this.#class) ? this.#class : ''
            });
            main_container.append(this.#control);
            this.#control = main_container;
        }
        else {
            throw ('Element:', el, ' do not exist in DOM.');
        }

        return this.#control;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    // get control() { return this.#control.find(`${this.#container_id}`);}
    get control() { return this.#control;}

    get controls() { return this.#control;}

    get items() { return this.#items; }

    set items(items) {
        this.#items_cont.empty();
        this.add_items(items);
    }

    get event_name() { return this.#event_name; }

    get callback() { return this.#callback; }

    add_items(items) {
        if(items instanceof Array == false) {
            items = [items];
        }

        // Clears whitespaces around elements
        if(items) items = items.map(s => s.trim());
        
        items.forEach( it => {
            let it_el = $('<div id="' + this.#container_id + '-' + it + '">' + it + '</div>');
            this.#items_cont.append(it_el);
            $(it_el).on('click', e => {
                if(this.#header.selected.enabled) this.selected = it;
                if(this.#event_name) {
                    $(document).trigger(this.#event_name, [it, (this.parent) ? this.parent[0].id : this.parent, e]);
                    e.stopPropagation();
                }
                else if(this.#callback) this.#callback(it, (this.parent) ? this.parent[0].id : this.parent, e);
            });
        });

        this.#items = items;

        //Set first item by default
        if(this.#header.selected.enabled) {
            this.selected = '';
            // this.selected = items[0];
            // Event listener or callback methos Need to be defined before this point
            // if(this.#event_name) $(document).trigger(this.#event_name, [items[0], this]);
            // else if(this.#callback) this.#callback(items[0], this);
        }
    }

    get selected() { return this.#header.selected.text; }
    set selected(selected) {
        this.#header.selected.text = selected;
        if(this.#header.selected.control) {
            this.#header.selected.control.text(this.#header.selected.text);
        }
        else if(this.#items.includes(selected) == false) {
            console.log(`WARNING: No existe el elemento ${selected} en la lista.`);
        }
    }

    select(item, e) {
        if(this.#items.includes(item)) {
            if(this.#header.selected.enabled) this.selected = item;
            if(this.#event_name) $(document).trigger(this.#event_name, [item, e]);
            else if(this.#callback) this.#callback(item, e);
        }
        else {
            if(this.#select_unknown) { this.selected = item; }
            else { this.selected = ''; }
        }
    }

    get label() { return this.#header.label.text; }
    set label(label) {
        this.#header.label.text = label;
        this.#header.label.control.text(this.#header.label.text);
    }
}



/**
 * Combobox
 * @param el DOM control ID. If DOM element passed, uses it, if string passed, creates it.
 * @param items List of items for combobox list. If no provided, check for html micro-data
 *              'data-items'.
 * @param event_name Event/Callback name when clicking a list item. If no one provided,
 *                     check for HTML micro-data 'data-event'.
 * @note Event is triggered to 'document'.
 */
class Combobox {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "combobox";
    static CLASS_COMBOBOX = 'combobox';
    static ELEMENT_CLASS_COMBOBOX = '.combobox';
    static CLASS_COMBOBOX_HANDLER = 'combobox-handler';
    static ELEMENT_CLASS_COMBOBOX_HANDLER = '.combobox-handler';
    static ELEMENT_CLASS_COMBOBOX_HANDLER_ARROW = '.combobox-handler-arrow';
    static ELEMENT_OUTSIDE_COMBOBOX = '*:not([class=^' + Combobox.CLASS_COMBOBOX + '])';
    static ELEMENT_HANDLER = '<p class="combobox-handler"></p><span class="combobox-handler-arrow lni lni-chevron-down"></span>';
    static CLASS_COMBOBOX_CONTENT = 'combobox-content';
    static ELEMENT_CLASS_COMBOBOX_CONTENT = '.combobox-content';
    static ELEMENT_DIV_COMBOBOX_CONTENT = '<div class="' + Combobox.CLASS_COMBOBOX_CONTENT + '"></div>';

    //----------------------------- PROPERTIES -----------------------------

    #items;
    #control;
    #event_name;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(el, items, event_name) {
        this.init(el, items, event_name);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------

    init(el, items, event_name) {
        let dd;
        let container_id = '';
        
        //If identifier pased as element, get element from DOM ...
        if(typeof el == 'string') {
            dd = $(el);
            container_id = el.replace('#', ''); //Removes '#' or '.' character from element identification
        }
        // ... else uses element
        else {
            dd = $(el);
            container_id = $(el).prop('id');
            // If no parameters defiend, try to get from html micro-data
            if(!items) {
                items = dd.data('items');
                if(items) items = items.split(',');
            }
            if(!event_name) event_name = dd.data('event');
        }

        // If parent does not exist, creates it
        if(dd.length == 0) {
            dd = $('<div id="' + container_id + '" class="' + Combobox.CLASS_COMBOBOX + '"></div>');
        }

        if(dd.length) {
            this.#control = dd;
            dd.append(Combobox.ELEMENT_HANDLER);

            dd.addClass(Combobox.CLASS_COMBOBOX)
            let items_content = $('<div id="' + dd.prop('id') + '-content" class="' + Combobox.CLASS_COMBOBOX_CONTENT
                                + '"></div>');
            dd.append(items_content);

            this.#items = items;
            if(items) {
                items.forEach( (it) => {
                    let it_el = $('<div id="' + container_id + '-' + it + '">' + it + '</div>');
                    items_content.append(it_el);
                    // If event name passed, triggers event ...
                    if(typeof event_name == 'string') this.#event_name = event_name;
                    else this.#event_name = 'change';

                    let click_id = '#' + it_el.prop('id');
                    if(!click_id) click_id = '.' + it_el.prop('class');
                    $(document).on('click', click_id, e => {
                        this.val = it;
                        dd.trigger(this.#event_name, [it, this]);
                        dd.find(Combobox.ELEMENT_CLASS_COMBOBOX_CONTENT).css('display', 'none');
                        e.stopPropagation();
                    });
                });

                this.val = items[0]; // Default set first item
            }

            // dd.on('click', e => {
            let click_id = '#' + dd.prop('id');
            if(!click_id) click_id = '.' + dd.prop('class');

            // Click control to slide down
            $(document).on('click', click_id, e => {
                let cb_content = dd.find(Combobox.ELEMENT_CLASS_COMBOBOX_CONTENT);
                if(cb_content) {
                    cb_content.show();
                    // cb_content.css('display', 'block');
                }
                dd.find(Combobox.ELEMENT_CLASS_COMBOBOX_HANDLER).focus();
                e.stopPropagation();
            });

            // Click outside control to slide up
            // $(document).on('click', ':not(' + click_id + ','  + click_id + ' > *)', e => {
            $(document).on('click', ':not([class*=' + Combobox.CLASS_COMBOBOX + '])', e => {
                let cb_control = dd.find(Combobox.ELEMENT_CLASS_COMBOBOX_CONTENT)
                if(cb_control) cb_control.hide(); //css('display', 'none');
                e.stopPropagation();
            });

            // $(document).filter('[class*=' + Combobox.ELEMENT_CLASS_COMBOBOX_HANDLER + ']', e => {
            //     let cb_control = dd.find(Combobox.ELEMENT_CLASS_COMBOBOX_CONTENT)
            //     if(cb_control) cb_control.toggle();
            // });
        }
        else {
            throw ('Element:', el, ' do not exist in DOM.');
        }

        // Stores custom object in DOM element
        dd.data('Combobox', this);
        return dd;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get val() { return this.#control.find(Combobox.ELEMENT_CLASS_COMBOBOX_HANDLER).text(); }

    set val(value) {
        let cb = this.#control.find(Combobox.ELEMENT_CLASS_COMBOBOX_HANDLER).text(value);
        this.#control.trigger(this.#event_name, [value, this]);
    }

    get items() { return this.#items; }

    get control() { return this.#control; }

    get event_name() { return this.#event_name; }

}



class Table {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "table";

    //----------------------------- PROPERTIES -----------------------------

    #name;
    #table;
    #table_header;
    #table_header_name_element;
    #header;
    #rows;
    #css;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {
        try {
            var that = this;
            
            let data = params.data;
            // this.#name = params.name;
            this.#name = params.data.title;
            this.#css = params.css;

            let title = (data.title) ? data.title : '';
            this.#table = $('<table>', { id: this.#name + '-' + title});
            this.#header = data.header;
            this.#rows = data.rows;
            
            this.#table_header = $('<tr>', {id:this.#name + '-row-header'});
            this.#table.append(this.#table_header);

            this.#table_header.append('<th>' + title + '</th>');
            if(this.#header) {
                this.#header.forEach(col => {
                    this.#table_header.append('<th>' + col + '</th>');
                });
            }

            this.#table_header_name_element = $(this.#table_header).children(':first');

            Object.keys(this.#rows).forEach( row => {
                // Generate row element
                let data_row = $('<tr>', { id: this.#name + '-row-' + row});
                // Appends row if not exist in DOM
                if(this.#table.find(data_row).length == 0) {
                    data_row.append('<td>' + row + '</td>');
                    this.#table.append(data_row);
                }
                // Appends data to current row
                for(let i = 0; i < this.#rows[row].length; i++) {
                    let value_str = '';
                    
                    if(that.#rows[row][i] instanceof Array) {
                        that.#rows[row][i].forEach( v => {
                            if(value_str.length != 0) value_str += ' ';
                            value_str += v;
                        });
                    }
                    else {
                        value_str = String(that.#rows[row][i]);
                    }
                    data_row.append('<td>' + value_str + '</td>')
                }
                // this.#rows[row].forEach(v => data_row.append('<td>' + v + ' (' + this.#pc[row] + '%)' + '</td>'));
            });

            if(this.#css) { this.#table.css(this.#css); }
        }
        catch(error) {
            console.error("Table Controls init error: ", error);
        }

        // Stores custom object in DOM element
        this.#table.data('Table', this);
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get table() { return this.#table; }

    get name() { return this.#name; }

    get header_name_element() { return this.#table_header_name_element; }
}



/** 'Display'
 * @Constructor input params object: configuration parameters:
 * @param id DOM identifier.
 * @param width Display width.
 * @param height Display height.
 * @param center True forces initial centered position.
 * @param left Value for left initial position.
 * @param top Value for top position.
 * @param title Title for display.
 * @param title_css Title css custom style.
 * @param show_title true for showing title in display.
 * @param no_title true do not create title in display.
 * @param draggable true for make display draggable.
 * @param close Shows handler close icon.
 * @param close_cb Custom callback when clicking close icon.
 * @param min Shows handler minimize icon.
 * @param min_cb Custom callback when clicking min icon.
 * @param insert Auto insert display element in DOM (body).
 * @param class Toggles default control class.
 * @param new_classes Appends new control classes.
 * @param show Shows display control on create (true by default).
 * @param overflow false: disables overflow. Any other case, applies default configuration.
 * @returns Custom properties can be accesed from DOM using data('Display) method.
 */

class Display {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "display-control";
    
    static TEXT_MINIMIZE = '__';
    static TEXT_MAXIMIZE = '▭';
    
    // Classes
    static CLASS_ICONS = 'display-control-icons';
    static CLASS_ICONS_FLOAT = 'display-control-icons-float';
    static CLASS_DISPLAY = 'display-control';
    static CLASS_TITLE = 'display-control-TITLE';
    static CLASS_CONTENT = 'display-control-content';
    static CLASS_SEPARATOR = 'display-control-separator';
    static CLASS_SEPARATOR_VERT = 'display-control-separator-vert';
    static CLASS_HANDLE_MIN = 'display-control-handle-min';
    static CLASS_HANDLE_CLOSE = 'display-control-handle-close';

    static ELEMENT_HANDLE = '<div class="display-control-handle"><div>';
    static ELEMENT_HANDLE_MIN = '<div class="display-control-handle-min hoverable-icon">' + Display.TEXT_MINIMIZE + '<div>';
    static ELEMENT_HANDLE_CLOSE = '<div class="display-control-handle-close hoverable-close lni lni-close"><div>';
    static ELEMENT_TITLE = '<div class="display-control-title"><div>';

    static DEFAULT_WIDTH = 40;
    static DEFAULT_WIDTH_UNITS = 'vw'
    static DEFAULT_HEIGHT = 60;
    static DEFAULT_HEIGHT_UNITS = 'vh';
    // static DEFAULT_CONTENT = `<div class='${Display.CLASS_CONTENT} ${Const.CLASS_SCROLL_CUSTOM}'></div>`;
    static DEFAULT_CONTENT = `<div class='${Display.CLASS_CONTENT}'></div>`;
    static CSS_OVERFLOW_NONE = { 'overflow': 'none' };
    
    static SEPARATOR = `<div class='${Display.CLASS_SEPARATOR}'></div>`
    static SEPARATOR_VERT = `<div class='${Display.CLASS_SEPARATOR_VERT}'></div>`

    //----------------------------- PROPERTIES -----------------------------
    #element;
    #element_handle;
    #close_show = true;
    #element_handle_close;
    #close_cb = this.hide;
    #min_show = false;
    #element_handle_min;
    #min_cb = this.#minimize;
    #element_title;
    #id;
    #center = false;
    #width;// = Display.DEFAULT_WIDTH;
    #width_units;// = Display.DEFAULT_WIDTH_UNITS;
    #height;// = Display.DEFAULT_HEIGHT;
    #height_units;// = Display.DEFAULT_HEIGHT_UNITS;
    #left = 0;
    #left_units = '';
    #top = 0;
    #top_units = '';
    #title = '';
    #title_css = '';
    #tooltip = '';
    #show_title = true;
    #no_title = false;
    #draggable = true;
    #content = $(Display.DEFAULT_CONTENT);
    #insert = true;
    #class = Display.CLASS_DISPLAY;
    #new_classes = '';
    #css = '';
    #show = true;
    #overflow = true;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        if(!params) params = {};
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #create_display() {
        // Create main div with css classes
        this.#element = $(`<div id='${this.#id}' class='${this.#class} ${this.#new_classes}'></div>`);
        if(this.#overflow == false) {
            this.#element.addClass(Const.CLASS_SCROLL_NONE);
        }

        // Handle controls
        if(this.#close_show || this.#min_show) {
            this.#element_handle = $(Display.ELEMENT_HANDLE);
            this.#element_handle_close = $(Display.ELEMENT_HANDLE_CLOSE);
            this.#element_handle_min = $(Display.ELEMENT_HANDLE_MIN);
            if(this.#close_show == true) {
                this.#element_handle.append(this.#element_handle_close);
                this.#element_handle_close.on('click', e => this.#close_cb.call(this));
            }
            if(this.#min_show == true) {
                this.#element_handle.append(this.#element_handle_min);
                this.#element_handle_min.on('click', e => this.#min_cb());
            }
            this.#element.append(this.#element_handle);
        }

        // Title configuration
        if(this.#no_title == false) {
            this.#element_title = $(Display.ELEMENT_TITLE);
            if(this.#show_title) { this.#element_title.text(this.#title); }
            if(this.#title_css) { this.#element_title.css(this.#title_css); }
            this.#element.append(this.#element_title);
        }

        // Dimensions
        this.#element.css({
            'width': (this.#width != undefined) ? (this.#width + this.#width_units) : '',
            'height': (this.#height != undefined) ? (this.#height + this.#height_units) : '',
            'left': this.#left + this.#left_units,
            'top': this.#top + this.#top_units,
        });

        // Apply custom css modifications
        if(this.#css) this.#element.css(this.#css);

        if(this.#tooltip) {
            this.#element.prop('title', this.#tooltip);
        }

        // Append content div
        if(this.#overflow == false) { this.#content.addClass(Const.CLASS_SCROLL_NONE) }
        else { this.#content = this.#content.addClass(Const.CLASS_SCROLL_CUSTOM); }
        this.#element.append(this.#content);

        // Check insert into DOM when creating
        if(this.#insert) {
            $(document.body).prepend(this.#element);
        }

        // Drag feature management
        if(this.#draggable) this.#element.draggable({containment: "window"});

        // Check show when creating
        if(this.#insert) {
            if(this.#show) {
                this.#element.show();
            }
            else {
                this.#element.hide();
            }
        }

        // Stores custom class in DOM element
        this.#element.data('Display', this);
    }

    #minimize() {
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {
        if(!params) params = {};

        if(params.insert != undefined) this.#insert = params.insert;
        
        // Set tooltip 
        if(params.tooltip) {
            this.#tooltip = params.tooltip;
        }

        if(params.overflow != undefined) {
            this.#overflow = params.overflow;
        }
        
        // Set display name
        this.#id = params.id;
        if(!this.#id) {
            let id = '#' + Display.NAME;
            let i = 0;
            while($(id).length != 0) {
                i++;
                id = '#' + Display.NAME + i;
            }
            this.#id = id.replace('#', '');
        }

        // Set display dimensions
        if(params.width) this.#width = params.width;
        if(params.height) this.#height = params.height;

        if(params.width) this.#width = params.width.replace(/[a-zA-Z]+/g, '');
        if(params.width) this.#width_units = params.width.replace(/[0-9.]+/g, '');
        if(params.height) this.#height = params.height.replace(/[a-zA-Z]+/g, '');
        if(params.height) this.#height_units = params.height.replace(/[0-9.]+/g, '');

        // Set position
        if(params.center != undefined) this.#center = params.center;
        if(this.#center == true) {

            if(this.#width_units == undefined) { this.#width_units = 'px'; }
            if(this.#height_units == undefined) { this.#height_units = 'px'; }

            let wref = '100';
            let href = '100';
            if(this.#width_units == 'px') { wref = window.screen.width; }
            else if(this.#width_units == 'em') { wref = $(window).width() / parseFloat($("body").css("font-size"));}

            if(this.#height_units == 'px') { href = window.screen.height; }
            else if(this.#height_units == 'em') { href = $(window).height() / parseFloat($("body").css("font-size"));}

            if(this.#width == undefined) {  this.#left = wref/2; }
            else { this.#left = (wref - parseFloat(this.#width)) / 2; }
            this.#left_units = this.#width_units;

            if(this.#height == undefined) { this.#top = href/2; }
            else { this.#top = (href - parseFloat(this.#height)) / 2; }
            this.#top_units = this.#height_units;
        }
        else {
            if(params.left) this.#left = params.left.replace(/[a-zA-Z]+/g, '');
            if(params.left) this.#left_units = params.left.replace(/[0-9.]+/g, '');
            if(params.top) this.#top = params.top.replace(/[a-zA-Z]+/g, '');
            if(params.top) this.#top_units = params.top.replace(/[0-9.]+/g, '');
            if(params.left) this.#left = parseFloat(params.left);
            if(params.top) this.#top = parseFloat(params.top);
        }

        // Set title
        if(params.title) this.#title = params.title;
        if(params.title_css) this.#title_css = params.title_css;
        if(params.show_title != undefined) this.#show_title = params.show_title;
        if(params.no_title != undefined) this.#no_title = params.no_title;

        // Set contents
        if(params.content != undefined) this.#content = params.content;

        // Set draggable flag
        if(params.draggable != undefined) this.#draggable = params.draggable;

        // Handler settings
        if(params.close == false) this.#close_show = false;
        if(params.close_cb) this.#close_cb = params.close_cb;
        if(params.min == false) this.#min_show = false;
        if(params.min_cb) this.#min_cb = params.min_cb;

        // Set custom style class
        if(params.class != undefined) this.#class = params.class;
        
        // append custom style classes
        if(params.new_classes != undefined) this.#new_classes = params.new_classes;

        if(params.css != undefined) this.#css = params.css;

        // Show on create
        if(params.show != undefined) this.#show = params.show;

        // Creates control and append to DOM
        this.#create_display();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get control() { return this.#element; }

    get class() { return this.#element.attr('class'); }
    set class(_class) { this.#element.attr('class', _class); }
    
    get element_handle() { return this.#element_handle; }

    get element_title() { return this.#element_title; }

    get id() { return this.#id}
    set id(id) { this.#id = id; }

    get title() { return this.#title; }
    set title(title) {
        this.#title = title;
        this.#element_title.text(this.#title);
    }

    get tooltip() { return this.#element.title; }
    set tooltip(tooltip) { this.#element.attr('title', tooltip); }

    get width() { return this.#element.css('width'); }
    set width(width) {
        this.#width = parseFloat(width.replace(/[a-zA-Z]+/g, ''));
        this.#width_units = width.replace(/[0-9.]+/g, '');
        this.#element.css('width', this.width);
    }

    get height() { return this.#element.css('height'); }
    set height(height) {
        this.#height = parseFloat(height.replace(/[a-zA-Z]+/g, ''));
        this.#height_units = height.replace(/[0-9.]+/g, '');
        this.#element.css('height', this.height);
    }

    get left() { return this.#element.css('left') }
    set left(left) {
        this.#left = parseFloat(left.replace(/[a-zA-Z]+/g, ''));
        this.#left_units = left.replace(/[0-9.]+/g, '');
        this.#element.css('left', this.left);
    }

    get top() { return this.#element.css('top'); }
    set top(top) {
        this.#top = parseFloat(top.replace(/[a-zA-Z]+/g, ''));
        this.#top_units = top.replace(/[0-9.]+/g, '');
        this.#element.css('top', this.top);
    }

    get element_title() { return this.#element_title; }
    set element_title(title) {
        this.#element_title = title;
    }

    get element_handle() { return this.#element_handle; }
    set element_handle(handle) { this.#element_handle = handle; }

    get element_handle_close() { return this.#element_handle_close; }
    set element_handle_close(close) { this.#element_handle_close = close; }

    get element_handle_min() { return this.#element_handle_min; }
    set element_handle_min(min) { this.#element_handle_min = min; }

    get show_title() { return this.#show_title; }
    set show_title(show) { this.#show_title = show; }

    get draggable() { return this.#draggable; }
    set draggable(d) {
        this.#draggable = d;
        if(this.#draggable) this.#element.draggable('enable');
        else {
            this.#element.draggable('disable');
        }
    }

    get content() { return this.#content; }
    set content(content) { this.#content = content; }

    get close_cb() { return this.#close_cb; }
    set close_cb(close_cb) { this.#close_cb = close_cb; }

    get min_cb() { return this.#min_cb; }
    set min_cb(min_cb) { this.#min_cb = min_cb; }

    append(content, id) {
        let ref = this.#element;
        if(id) {
            // Busca el padre del nuevo elemento en el control
            let el = this.#element.find(id);
            if(el) {
                ref = el;
            }
        }
        
        ref.append(content);
    }

    prepend(content, id) {
        let ref = this.#element;
        if(id) {
            // Busca el padre del nuevo elemento en el control
            let el = this.#element.find(id);
            if(el) {
                ref = el;
            }
        }

        ref.prepend(content);
    }

    append_content(content, id) {
        let ref = this.#content;
        if(id) {
            // Busca el padre del nuevo elemento en content
            let el = this.#content.find(id);
            if(el) {
                ref = el;
            }
        }
        
        ref.append(content);
    }

    prepend_content(content, id) {
        let ref = this.#content;
        if(id) {
            //TODO BUSCAR ELEMENTO EN this.#content
            let el = this.#content.find(id);
            if(el) {
                ref = el;
            }
        }

        ref.prepend(content);
    }

    static build_p(content, id, dclass=Display.CLASS_CONTENT) {
        if(!id) id = '';
        let div = $(`<p id="${id}" class="${dclass}">${content}</p>`);
        return div;
    }

    static build_div(content, id, dclass=Display.CLASS_CONTENT) {
        if(!id) id = '';
        let div = $(`<div id="${id}" class="${dclass}">${content}</div>`);
        return div;
    }

    static build_separator(params) {
        params = params || {};
        let class_ = params.class || '';
        let vert = params.vert || false;
        let sep = (vert) ? $(Display.SEPARATOR_VERT, { class: class_ }) :
                           $(Display.SEPARATOR, { class: class_ });
        if(params.id) sep.attr('id', params.id);
        if(params.css) sep.css(params.css);
        return sep;
    }

    remove(id) {
        //TODO this.content find id
        if(id) {
            let el = this.#content.find(id);
            if(el) {
                $(el).remove();
            }
        }
    }

    show() {
        this.#element.show();
    }
    
    hide() {
        this.#element.hide();
    }
} // Display



/** 'Inputbox'
 * @param container Container { class | css }
 * @param label Set a label for input control: { text | class | position | css }
 * @param input Set input control properties: { text | class | css | placeholder | maxlength }
 * @param event Get/Set event/callback. Object with {name} and {callback function} .
 * @param event Set event name.
 * @param callback Set callback on text change.
 * @param limit Applies function to text content, for example, apply regex to avoid content.
 * @param text Get/Set the content of input control.
 * @param placeholder Get/Set a placeholder for input control.
 * @param label_text Get/Set label text.
 */

// * @param event.name Get/Set event name.
// * @param event.callback Get/Set callback method.

class Inputbox {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "input-box";

    static DEFAULT_MAX_LENGTH = 50;

    //----------------------------- PROPERTIES -----------------------------

    #id;
    #label = { enabled: false };
    #input = {};
    #container = {};
    event;
    callback;
    limit;
    #css;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        if(!params) params = {};
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #create_control() {
        // Creates div container
        this.#container.control = $('<div>', {
                            id: this.#id,
                            class: (this.#container.class) ? this.#container.class : '',
                        });

        // Apply custom css style
        if(this.#container.css) {
            this.#container.control.css(this.#container.css);
        }

        if(this.#container.tooltip) {
            this.#container.control.attr('title', this.#container.tooltip);
        }

        // Creates inputbox
        let maxlength = this.#input.maxlength || Inputbox.DEFAULT_MAX_LENGTH;
        this.#input.control = $('<input>', {
            id: `${this.#id}-input`,
            class: (this.#input.class) ? this.#input.class : '',
            value: this.#input.text || '',
            placeholder: (this.#input.placeholder) ? this.#input.placeholder : '',
            maxlength: maxlength
          });
        
        // Apply custom css style
        if(this.#input.css) {
            this.#input.control.css(this.#input.css);
        }
        this.#container.control.append(this.#input.control);

        // Creates label if defined
        if(this.#label.enabled) {
            this.#label.control = $('<span>', {
                                        id: `${this.#id}-label`,
                                        text: this.#label.text,
                                        class: (this.#label.class) ? this.#label.class : ''
                                });
            if((this.#label.position == undefined) || (this.#label.position == Const.LABEL_POSITION_BEFORE)) {
                this.#container.control.prepend(this.#label.control);
            }
            else if (this.#label.position == Const.LABEL_POSITION_AFTER) {
                this.#container.control.append(this.#label.control);
            }
        }
        
        // Apply custom css style
        if(this.#label.css) {
            this.#label.control.css(this.#label.css);
        }
        
        // Add current object information to DOM element
        this.#container.control.data('Inputbox', this)

        this.#input.control.on('change', (e) => {
            if(this.limit) {
                this.text = this.limit(this.text);
            }
            if(this.event) { $(document).trigger(this.event, [this.text, e]); }
            if(this.callback) { this.callback(this.text); }
        });
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {

        // Set control ID name
        if(params.id) {
            this.#id = params.id;
        }
        
        // Set container's custom style classes
        if(params.container) {
            this.#container = params.container;
        }

        // Input control settings
        if(params.input) {
            this.#input = params.input;
        }

        // Label settigns
        if(params.label) {
            this.#label.enabled = true;
            this.#label.position = params.label.position;
            this.#label.text = params.label.text;
        }

        // // If custom event provided
        // if(params.event) {
        //     this.#event.name = params.event.name;
        //     this.#event.callback = params.event.callback;
        //     $(document).on(this.#event.name, (e) => this.#event.callback(e));
        // }

        this.event = params.event;
        this.callback = params.callback;
        this.limit = params.limit;

        this.#create_control();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
    
    // Input
    get text() { return this.#input.control.val(); }
    set text(text) {
        this.#input.text = text;
        this.#input.control.val(text);
    }
    
    get placeholder() { return this.#input.placeholder; }
    set placeholder(placeholder) {
        this.#input.placeholder = placeholder;
        this.#input.control.attr('placeholder', placeholder);
    }

    get tooltip() { return this.#container.control.title; }
    set tooltip(tooltip) { this.#container.control.attr('title', tooltip); }

    get input_class() { return this.#input.class; }
    set input_class(class_) { this.#input.class = class_; }

    get input() { return this.#input.control; }
    set input(control) { this.#input.control = control; }

    // Label
    get label_text() { return this.#label.text; }
    set label_text(text) { this.#label.text = text; }

    get label_class() { return this.#label.class; }
    set label_class(class_) { this.#label.class = class_; }

    get label() { return this.#label.control; }
    set label(control) { this.#label.control = control; }

    // Container
    get class() { return this.#container.class; }
    set class(class_) { this.#container.class = class_; }

    get control() { return this.#container.control; }
    set control(control) { this.#container.control = control; }

    // Event
    get event() { return this.event; }
    set event(event) { this.event = event; }
} // Inputbox




/** 'Radiobutton' */

class RadioButton {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "radio-button";

    //----------------------------- PROPERTIES -----------------------------

    #id = '';
    #name = '';
    #buttons = { control: {} };
    #label = { };
    #container = {};

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        if(!params) params = {};
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #create_control() {
        this.#container.control = $('<div>', {
                                    id: this.#id,
                                    class: this.#container.class || '',
                                });
        if(this.#container.css) {
            this.#container.control.css(this.#container.css);
        }
        
        // Create buttons
        this.#buttons.control = this.#buttons.control || {};
        Object.keys(this.#buttons.values).forEach(button_name => {
            let value = this.#buttons.values[button_name];
            this.#buttons.control[value] = $(`<input type='radio' id='${this.#id}-radio-${value}' name='${this.#name}' class='${Const.CLASS_BUTTON_GENERAL}' value='${value}'>`)
            // Applies custom style
            if(this.#buttons.css) {
                this.#buttons.control[value].css(this.#buttons.css);
            }
            // Add control to container
            this.#container.control.append(this.#buttons.control[value]);
            
            // Add label for button to container
            let label = $(`<label for='${this.#id}-radio-${value}'>${button_name}</label>`)
            this.#container.control.append(label);
        });

        // Set default checked if defined
        if(this.#buttons.checked != undefined) {
            this.#buttons.control[this.#buttons.checked].prop('checked', true)
        }

        // Creates label
        this.#label.control = $('<label>', {
            id: `${this.#id}-label`,
            text: this.#label.text || '',
            class: this.#label.class || '',
        });
        //Apply custom style if provided
        if(this.#label.css) {
            this.#label.control.css(this.#label.css);
        }
        
        //Set label position if defined
        if(this.#label.position) {
            if(this.#label.position == Const.LABEL_POSITION_BEFORE) {
                this.#container.control.prepend(this.#label.control);
            }
            else if(this.#label.position == Const.LABEL_POSITION_AFTER) {
                this.#container.control.append(this.#label.control);
            }
        }
        else {
            this.#container.control.prepend(this.#label.control);
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {
        //TODO AGREGAR PARAMETRO ELEMENT, PARA AGREGAR OPCION DE UTILIZAR UN CONTENEDOR EXTERNO YA CREADO
        if(params.id) {
            this.#id = params.id;
        }

        if(params.name) {
            this.#name = params.name;
        }

        if(params.container) {
            this.#container = params.container;
        }

        if(params.buttons) {
            this.#buttons = params.buttons;
        }

        if(params.label) {
            this.#label = params.label;
        }

        this.#create_control();

        this.#container.control.data('RadioButton', this);
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get control() { return this.#container.control; }
    set control(control) { this.#container.control = control; }

    get buttons() { return this.#buttons.control; }
    set buttons(buttons) { return this.#buttons.control = buttons; }

    get name() { return this.#name; }
    set name(name) { this.#name = name; }

    get selected() {
        let res = this.#container.control.find(`input[name=${this.#name}]:checked`).val();
        return res;
    }
    set selected(name) {
        if(name) {
            this.#buttons.control[name].prop('checked', 'true')
        }
    }

} // RadioButton




/** 'slider' */

class Slider {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "slider";

    static DEFAULT_ID = 'SLIDER-';

    //----------------------------- PROPERTIES -----------------------------

    control;
    #form;
    #label;
    #input_range;
    #output;
    event;
    id;
    min;
    max;
    step;
    value;
    css;
    class;
    show_output;
    units;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #create_control() {
        this.control = $('<div>', {
            id: this.id,
            name: this.id,
            css: this.css.container || ' ',
            class: this.class || '',
        });

        // Form
        this.#form = $('<form>', { id: this.id + 'form'});
        
        if(this.label) {
            this.#label = $('<label>', {
                id: this.id+'-label',
                name: this.id+'-label',
                text: this.label.text || '',
                class: this.label.class || '',
                css: this.css.label || { 'margin-left': '0.2em' },
            });

            if( (this.label.position == undefined) ||
                (this.label.position == Const.LABEL_POSITION_BEFORE) ) {
                this.#form.append(this.#label);
            }
        }

        // Range input
        this.#input_range = $('<input>',{
            id: this.id + '-input',
            name: this.id + '-input',
            type: 'range',
            min: this.min,
            max: this.max,
            step: this.step,
            value: this.value,
            css: this.css.input || ' ',
        });
        if(this.css) {
            this.#input_range.css(this.css);
        }

        // Appends input to form
        this.#form.append(this.#input_range);
        
        // Output
        if(this.show_output) {
            this.#output = $('<span>', {
                id: this.id+'-output',
                name: this.id+'-output',
                css: this.css.output || { 'display': 'inline', 'margin-left': '0.2em' },
            });
            this.#output.text(this.value);
            
            this.#form.append(this.#output);
        }

        if(this.label && this.#label && (this.label.position == Const.LABEL_POSITION_AFTER)) {
            this.#form.append(this.#label);
        }

        this.#input_range.on('change', e => {
            this.value = this.#input_range.val();
            if(this.show_output) {
                this.#output.text(this.value + this.units);
            }
            if(this.event) {
                $(document).trigger(this.event, [this.value, e]);
            }
        });

        this.control.append(this.#form);

        this.control.data('Slider', this);
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {
        this.id = params.id || `${Slider.DEFAULT_ID}${new Date().valueOf()}`;
        this.min = params.min || 0;
        this.max = params.max || 1;
        this.step = params.step || 0.1;
        this.value = params.default || 0;
        this.class = params.class;
        this.css = params.css;
        this.label = params.label;
        this.show_output = params.show_output;
        this.event = params.event;
        this.units = params.units || '';
        this.#create_control();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    set_val(value) {
        this.value = value;
        this.#input_range.val(value);
        if(this.show_output) {
            this.#output.text(this.value);
        }
    }

    set event(event) { this.event = event; }
} // Slider




/** 'Checkbox' */

class Checkbox {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'checkbox';
    static TITLE = 'Checkbox';
    static CLASS_CONTAINER = 'custom-checkbox-container';
    static CLASS_CHECKMARK = 'custom-checkbox-checkmark';

    //----------------------------- PROPERTIES -----------------------------

    control;
    #input;
    #checkmark;
    id;
    label;
    css;
    class;
    side;
    event;
    // color;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #create_control() {
        this.control = $('<label>', {
            id: this.id + '-label',
            css: this.css || ' ',
            class: `${this.class} ${Checkbox.CLASS_CONTAINER}`,
            text: this.label,
        });

        this.#input = $('<input>',{ type: "checkbox", });        

        this.#checkmark = $('<span>', {
            id: this.id + '-checkmark',
            class: Checkbox.CLASS_CHECKMARK,
        });
        if((this.side) && (this.side == 'left')) {
            this.#checkmark.css({left: '0'});
        }

        this.control.append(this.#input, this.#checkmark);
        this.control.data('Checkbox', this);

        this.#input.on('change', (e) => {
            if(this.event) {
                $(document).trigger(this.event, [this.checked, e]);
            }
        });
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {
        let search_id = params.id;
        if(search_id == undefined) {
            search_id = Checkbox.TITLE;
        }
        //Check if current id exists
        let count = 1;
        while($(`#${search_id}`).length > 0) {
            search_id = `${search_id}-${count++}`;
        }
        this.id = search_id;
        this.label = params.label;
        this.css = params.css;
        this.class = params.class;
        this.side = params.side || 'right';
        this.event = params.event;
        // this.#color = params.color;
        this.#create_control();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get checked() { return this.#input.prop('checked'); }
    set checked(checked) { this.#input.prop('checked', checked); }
}



/** 'ColorPicker' */

/**
 * ColorPicker
 * @abstract Creates color picker control, with palette and color mixer. init() should be called afer added to DOM.
 * @param id identifier of control.
 * @param height Height of container div.
 * @param Width Width of container div.
 * @param classControl class bind to main control container.
 * @param label Label control if specified.
 * @param label.text Text content of label.
 * @param label.position Position of label in container: {Const.LABEL_POSTION_AFTER / Const.LABEL_POSITION_BEFORE }
 * Position is before if omitted.
 * @param Color Selected color when is created.
 * @param css CSS to be applied to main control container.
 * @param event Event triggered when color picker selection is done.
 * @param callback Callback method to be called when color picker selection is done.
 */
class ColorPicker {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "ColorPicker";

    static CLASS_COLOR_PICKER = 'color-picker';
    static ELEMENT_CLASS_COLOR_PICKER = '.color-picker';
    static DEFAULT_NAME = 'color-picker-';
    static CONTAINER_NAME = '-container';
    static LABEL_NAME = '-label';
    static ACEPTAR = 'Aceptar';
    static CANCELAR = 'Cancelar';

    static DEFAULT_OPTIONS = {
        showInput: true,
        allowEmpty: true,
        showInitial: true, // Show previous color in palette
        showAlpha: false,
        color: 'red',
        showPaletteOnly: true,
        togglePaletteOnly: true,
        containerClassName: ColorPicker.CLASS_COLOR_PICKER,
        hideAfterPaletteSelect: true,
        chooseText: ColorPicker.ACEPTAR,
        cancelText: ColorPicker.CANCELAR,
    };

    static DEFAULT_CONTAINER = {
        height: '15px',
        width: '15px',
        'border-radius': '2px',
        cursor: 'pointer',
        margin: '0.1em 0px 0em 4em',
    };

    //----------------------------- PROPERTIES -----------------------------

    static NUM_ELEMENTS = 0;

    control;
    container;
    colorPicker;
    label;
    id;
    options;
    #color;
    event;
    callback;
    labelOps;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor({id, height, width, classControl, css, options, label, color, event, callback}) {
        this.create({id, height, width, classControl, css, options, label, color, event, callback});
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    
    create({id, height, width, classControl, css, options, label, color, event, callback}) {
        if(id) {
            this.id = id;
        }
        else {
            do {
                ColorPicker.NUM_ELEMENTS++;
                this.id = `${ColorPicker.DEFAULT_NAME}${ColorPicker.NUM_ELEMENTS}`;
            } while($(`#${this.id}`).length > 0);
        }

        this.control = $('<div>', {
            id: this.id + ColorPicker.CONTAINER_NAME,
            class: classControl || '',
        });

        this.container = $('<div>', {
            id: this.id,
            css: {...ColorPicker.DEFAULT_CONTAINER},
        });

        this.control.append(this.container);

        if(height) {
            this.container.css(height, 'height');
        }
        if(width) {
            this.container.css(width, 'width');
        }
        if(css) {
            this.container.css(css);
        }

        //Set label position if defined
        if(label) {
            this.labelOps = label;
            this.label = $('<p>', {
                id: this.id + ColorPicker.LABEL_NAME,
                text: this.labelOps.text || '',
                css: { margin: '0 0 0 1em', position: 'absolute', }
            });

            if(this.labelOps.css) {
                this.label.css(this.labelOps.css);
            }
        
            if(this.labelOps.position == Const.LABEL_POSITION_BEFORE) {
                this.control.prepend(this.label);
            }
            else if(this.labelOps.position == Const.LABEL_POSITION_AFTER) {
                this.control.append(this.label);
            }
            else {
                this.control.prepend(this.label);
            }
        }


        if(color) {
            this.#color = color;
        }
        else {
            let r = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
            let g = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
            let b = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
            this.#color = `#${r}${g}${b}`;
            // this.#color = '#2922bb';
        }

        this.container.css({ 'background-color': this.#color});
        
        this.options = options || ColorPicker.DEFAULT_OPTIONS;
        this.options.color = this.#color;

        this.event = event;
        this.callback = callback;

        this.control.data('ColorPicker', this);
    }

    init() {
        $(this.container).spectrum(this.options);
        $(this.container).on('change', (e, color) => {
            this.updateColor(color.toHexString());
        });
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get color() { return this.#color; }
    set color(color) { this.updateColor(color) }

    updateColor(color) {
        this.#color = color || this.#color;
        this.container.css('background-color', this.#color);
        if(this.event) { $(this.container).trigger(this.event, this.#color); }
        if(this.callback) { this.callback(this.#color); }
    }
}




/** 'InputColor' */

/**
 * InputColor 
 * @abstract Creates an inputbox + color picker control. init() should be called afer added to DOM.
 * @param id identifier of control.
 * @param input Inputbox options. Default applied if missing.
 * @param input.input Inputbox options for input control: { text | class | css | placeholder | maxlength }.
 * @param input.event Inputbox event triggered when text is modified.
 * @param input.callback Inputbox callback method when text is modified.
 * @param colorPicker ColorPicker options. Default applied if missing.
 * @param classControl class bind to main control container.
 * @param css CSS to be applied to main control container.
 * @param event Events triggered when modifcation is done.
 * @param event.color Event triggered when color picker selection is done.
 * @param event.input Event triggered when inputbox text modification is done.
 * @param callback Callback methods to be called when modification is done.
 * @param callback.color Callback method to be called when color picker selection is done.
 * @param callback.text Callback method to be called when inputbox text is modified.
 */
class InputColor {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "InputColor";

    static DEFAULT_NAME = 'input-color-';
    static CONTAINER_NAME = '-container';
    static COLOR_PICKER_NAME = '-color-picker';
    static INPUTBOX_NAME = '-input-box';
    static DEFAULT_COLOR_PICKER = {
        css: { postion: 'relative', margin: '0', }
    };
    static DEFAULT_INPUTBOX = {
        input: { css: { 'max-width': '3em' }, maxlength: 6, },
        position: Const.LABEL_POSITION_AFTER,
    };

    //----------------------------- PROPERTIES -----------------------------

    static NUM_ELEMENTS = 0;

    control;
    inputBox;
    colorPicker;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor({id, input, colorPicker, classControl, css, event, callback}) {
        this.create({id, input, colorPicker, classControl, css, event, callback})
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------

    create({id, input, colorPicker, classControl, css, event, callback}) {
        this.id = id;
        if(!this.id) {
            do {
                InputColor.NUM_ELEMENTS++;
                this.id = `${InputColor.DEFAULT_NAME}${InputColor.NUM_ELEMENTS}`
            } while($(`#${this.id}`).length > 0);
        }

        this.control = $('<div>', {
            id: `${this.id}${InputColor.CONTAINER_NAME}`,
            class: classControl || '',
        });

        if(css) { this.control.css(css); }

        colorPicker = colorPicker || {};
        let colorPickerOpts = { ...InputColor.DEFAULT_COLOR_PICKER, ...colorPicker};
        colorPickerOpts.id = this.id + InputColor.COLOR_PICKER_NAME;
        this.colorPicker = new ColorPicker(colorPickerOpts);
        this.control.append(this.colorPicker.control);

        let inputBoxOps = InputColor.DEFAULT_INPUTBOX;
        input = input || {};
        inputBoxOps = { ...inputBoxOps,
            ...input,
            input: {
                ...inputBoxOps.input || {},
                ...input.input || {},
             },
        };
        
        inputBoxOps.id = this.id + InputColor.INPUTBOX_NAME;
        this.inputBox = new Inputbox(inputBoxOps);
        if(inputBoxOps.position == Const.LABEL_POSITION_BEFORE) {
            this.control.prepend(this.inputBox.control);
        }
        else if(inputBoxOps.position == Const.LABEL_POSITION_AFTER) {
            this.control.append(this.inputBox.control);
        }
        // Unknown
        else {
            this.control.prepend(this.inputBox.control);
        }

        this.event = event;
        this.callback = callback;

        this.control.data(this.constructor.name, this);
    }
    
    init() {
        this.colorPicker.init();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
}



