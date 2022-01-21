
/** 'controls.js' */

class Dropdown {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "dropdown";
    static CLASS_DROPDOWN = 'dropdown';
    static ELEMENT_CLASS_DROPDOWN = '.dropdown';
    static CLASS_DROPDOWN_CONTENT = 'dropdown-content';
    static ELEMENT_DIV_DROPDOWN_CONTENT = '<div class="' + Dropdown.CLASS_DROPDOWN_CONTENT + '"></div>';

    //----------------------------- PROPERTIES -----------------------------

    #items;
    #event_name;
    #callback;
    #control;
    #container_id;
    #items_cont;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(el, items, event_name) {
        this.init(el, items, event_name);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------

    init(el, items, event_name) {
        let dd;
        // let container_id = '';
        
        //If identifier pased as element, get element from DOM ...
        if(typeof el == 'string') {
            dd = $(el);
            this.#container_id = el.substring(1, el.length); //Removes '#' or '.' character from element identification
        }
        // ... else uses element
        else {
            dd = $(el);
            this.#container_id = $(el).prop('id');
            // If no parameters defiend, try to get from html micro-data
            if(!items) {
                items = dd.data('items');
                if(items) items = items.split(',');
            }
            if(!event_name) event_name = dd.data('event');
        }

        // If parent does not exist, creates it
        if(dd.length == 0) {
            dd = $('<div id="' + this.#container_id + '" class="' + Dropdown.CLASS_DROPDOWN + '"></div>');
        }

        if(dd.length) {
            this.#control = dd;

            dd.addClass(Dropdown.CLASS_DROPDOWN)
            this.#items_cont = $('<div id="#' + dd.prop('id') + '-content" class="' + Dropdown.CLASS_DROPDOWN_CONTENT + '"></div>');
            dd.append(this.#items_cont);

            // Save items list
            this.#items = items;
            
            // Set event/callback
            if(typeof event_name == 'string') {
                this.#event_name = event_name;
            }
            else if($.isFunction(event_name)) {
                this.#callback = event_name;
            }
            else console.error('ERROR: parameter event/callback "event_name" in dropdown is not an event/function, received: ', typeof event_name, ' instead.');
            //Creates elements and event/callback interaction
            this.items = items;
        }
        else {
            throw ('Element:', el, ' do not exist in DOM.');
        }
        return dd;
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get control() { return this.#control;}

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
        items.forEach( it => {
            let it_el = $('<div id="' + this.#container_id + '-' + it + '">' + it + '</div>');
            this.#items_cont.append(it_el);
            if(this.#event_name) {
                $(it_el).on('click', e => {
                    $(document).trigger(this.#event_name, [it, e]);
                    e.stopPropagation();
                });
            }
            else if(this.#callback) {
                $(it_el).on('click', e => this.#callback(it, e));
            }
        });
    }

}




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
            container_id = el.substring(1, el.length); //Removes '#' or '.' character from element identification
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

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(data, name) {
        this.#name = name;
        this.init(data);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(data) {
        try {
            var that = this;
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
        }
        catch(error) {
            console.error("Table Controls init error: ", error);
        }
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get table() { return this.#table; }

    get name() { return this.#name; }

    get header_name_element() { return this.#table_header_name_element; }
}





/** 'Display' */

class Display {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "display-control";
    
    static TEXT_MINIMIZE = '__';
    static TEXT_MAXIMIZE = '▭';
    
    static DEFAULT_WIDTH = 40;
    static DEFAULT_HEIGHT = 60;
    
    static CLASS_DISPLAY = 'display-control';
    static CLASS_HANDLE_MIN = 'display-control-handle-min';
    static CLASS_HANDLE_CLOSE = 'display-control-handle-close';
    static ELEMENT_HANDLE = '<div class="display-control-handle"><div>';
    static ELEMENT_HANDLE_MIN = '<div class="display-control-handle-min hoverable-icon">' + Display.TEXT_MINIMIZE + '<div>';
    static ELEMENT_HANDLE_CLOSE = '<div class="display-control-handle-close hoverable-close lni lni-close"><div>';
    static ELEMENT_TITLE = '<div class="display-control-title"><div>';

    //----------------------------- PROPERTIES -----------------------------
    #element;
    #element_handle;
    #close_show = true;
    #element_handle_close;
    #close_cb = this.#hide;
    #min_show = true;
    #element_handle_min;
    #min_cb = this.#minimize;
    #element_title;
    #id;
    #center = true;
    #width = Display.DEFAULT_WIDTH;
    #height = Display.DEFAULT_HEIGHT;
    #left = 0;
    #top = 0;
    #title = '';
    #show_title = false;
    #draggable = true;
    #content;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(params) {
        this.init(params);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #create_display() {
        this.#element = $('<div id=' + this.#id + '></div>');

        this.#element_handle = $(Display.ELEMENT_HANDLE);
        this.#element_handle_close = $(Display.ELEMENT_HANDLE_CLOSE);
        this.#element_handle_min = $(Display.ELEMENT_HANDLE_MIN);
        this.#element.append(this.#element_handle);
        if(this.#close_show == true) {
            this.#element_handle.append(this.#element_handle_close);
        }
        if(this.#min_show == true) {
            this.#element_handle.append(this.#element_handle_min);
        }

        this.#element_title = $(Display.ELEMENT_TITLE);
        this.#element_title.text(this.#title);
        this.#element.append(this.#element_title);
        this.#element.addClass(Display.CLASS_DISPLAY);
        this.#element.css({
            'width': this.#width + 'vw',
            'height': this.#height + 'vh',
            'left': this.#left + 'vw',
            'top': this.#top + 'vh',
        });
        $(document.body).prepend(this.#element);
        if(this.#draggable) this.#element.draggable({containment: "window"});
        this.#element.show();
    }

    #hide() {
        this.#element.hide();
    }

    #minimize() {
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init(params) {
        if(!params) params = {};
        
        // Set display name
        this.#id = params.id;
        if(!this.#id) {
            let id = '#' + Display.NAME;
            let i = 0;
            while($(id).length != 0) {
                i++;
                id = '#' + Display.NAME + i;
            }
            this.#id = id;
        }

        // Set display dimensions
        if(params.width) this.#width = params.width;
        if(params.height) this.#height = params.height;

        // Set position
        if(params.center) this.#center = params.center;
        if(this.#center == true) {
            this.#left = (100 - parseInt(this.#width)) / 2;
            this.#top = (100 - parseInt(this.#height)) / 2;
        }
        else {
            if(params.left) this.#left = params.left;
            if(params.top) this.#top = params.top;
        }

        // Set title
        if(params.title) this.#title = params.title;
        if(params.show_title) this.#show_title = params.show_title;

        // Set contents
        if(params.content) this.#content = params.content;

        // Set draggable flag
        if(params.draggable) this.#draggable = params.draggable;

        // Handler settings
        if(params.close == false) this.#close_show = false;
        if(params.close_cb) this.#close_cb = params.close_cb;
        if(params.min == false) this.#min_show = false;
        if(params.min_cb) this.#min_cb = params.min_cb;

        // Creates control and append to DOM
        this.#create_display();

        // Initialize default events
        this.#element_handle_close.on('click', e => this.#close_cb());
        this.#element_handle_close.on('click', e => this.#min_cb());
    }

    //----------------------------- GETTERS & SETTERS -----------------------------
    get element() { return this.#element; }

    get element_handle() { return this.#element_handle; }

    get element_title() { return this.#element_title; }

    get id() { return this.#id}
    set id(id) { this.#id = id; }

    get width() { return this.#width; }
    set width(w) { this.#width = w; }

    get height() { return this.#height; }
    set height(h) { this.#height = h; }

    get title() { return this.#title; }
    set title(title) { this.#title = title; }

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
}