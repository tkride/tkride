


class TimeFrame {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static EVENT_ENABLE = 'time-frame-enable';
    static EVENT_DISABLE = 'time-frame-disable';
    static PANEL = '#chart-time-frame-panel';
    static ELEMENT_INPUT = '#chart-time-frame-panel-input';

    static EVENT_TIME_FRAME_CHANGED = 'event-time-frame-panel-time-frame-changed';
    
    //----------------------------- PROPERTIES -----------------------------
    // Working time frame
    // #time_frame = Time.TIME_FRAMES[parseInt(Time.TIME_FRAMES.length/2)];
    #time_frame;
    #new_time;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    #update_view() {
        if($(TimeFrame.ELEMENT_INPUT).hasClass("input-border-error")) {
            $(TimeFrame.ELEMENT_INPUT).removeClass("input-border-error");
            $(TimeFrame.ELEMENT_INPUT).addClass("input-border-ok");
        }
        let valid = false;
        let time_frame_in = $(TimeFrame.ELEMENT_INPUT).val();
        let time_frame = {
            value: time_frame_in.replace(/[a-zA-Z]/g, ''),
            units: time_frame_in.replace(/[0-9]/g, ''),
            str() { return this.value + this.units; }
        };
        if(time_frame.units.length == 0) {
            time_frame.units = 'm'; // Default minutes
        }

        if(Time.TIME_FRAMES.includes(time_frame.str())) {
            valid = true;
        }
        else {
            let timeAux = { ...time_frame };
            if(timeAux.units == 'm') {
                timeAux.value = parseFloat(timeAux.value / 60);
                timeAux.units = 'h';
                if(Time.TIME_FRAMES.includes(timeAux.str()) == true) {
                    time_frame = timeAux;
                    valid = true;
                }
            }

            if(!valid) {
                timeAux = { ...time_frame };
                if(timeAux.units == 'd') {
                    timeAux.value = parseFloat(timeAux.value / 7);
                    timeAux.units = 'w';
                    if(Time.TIME_FRAMES.includes(timeAux.str()) == true) {
                        time_frame = timeAux;
                        valid = true;
                    }
                }    
            }

            if(!valid) {
                timeAux = { ...time_frame };
                if(timeAux.units == 'd') {
                    timeAux.value = parseFloat(timeAux.value / 30);
                    timeAux.units = 'M'
                    if(Time.TIME_FRAMES.includes(timeAux.str()) == true) {
                        time_frame = timeAux;
                        valid = true;
                    }
                }
            }
        }
        
        if(valid) {
            this.#new_time = time_frame.str();
        }
        else {
            this.#new_time = null;
        }
    }


    #store_info() {
        if(this.#new_time) {
            this.#disable();
            if((!this.#time_frame) || (this.#time_frame != this.#new_time)) {
                this.#time_frame = this.#new_time;
                $(document).trigger(TimeFrame.EVENT_TIME_FRAME_CHANGED, this.#time_frame);
            }
        }
        else {
            if($(TimeFrame.ELEMENT_INPUT).hasClass("input-border-error") == false) {
                $(TimeFrame.ELEMENT_INPUT).removeClass("input-border-ok");
                $(TimeFrame.ELEMENT_INPUT).addClass("input-border-error");
            }
        }
    }
    
    #enable(e) {
        $(TimeFrame.PANEL).show();
        $(TimeFrame.ELEMENT_INPUT).focus();
        this.#bind_events(e);
    }

    #disable() {
        $(TimeFrame.ELEMENT_INPUT).val('');
        $(TimeFrame.PANEL).hide();
        $(TimeFrame.ELEMENT_INPUT).unbind('keyup');
    }

    //----------------------------- EVENTS -----------------------------
    
    #bind_events(e) {
        var that = this;
        $(TimeFrame.ELEMENT_INPUT).keyup(e => that.#event_keyup(e));
        //Copies first char detected in main, lost otherwise
        $(TimeFrame.ELEMENT_INPUT).val(e.key);
        this.#event_keyup(e);
    }

    #event_keyup(e) {
        if(e.keyCode == KeyCode.ENTER) { this.#store_info(); }
        // else if(e.keyCode == KeyCode.ESC) { this.#disable(); }
        else { this.#update_view(); }
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get time_frame() { return this.#time_frame; }

    set time_frame(time) {
        this.#new_time = time;
        this.#store_info();
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        var that = this;
        try {
            $(document).on(TimeFrame.EVENT_ENABLE, (e, key) => { that.#enable(key); });
            $(document).on(Const.EVENT_CLOSE, (e, key) => { that.#disable(); });
            $(TimeFrame.PANEL).on(Const.EVENT_CLOSE, (e, key) => { that.#disable(); });
        }
        catch(error) {
            console.error("Time frame panel ERROR.");
        }
    }

    is_visible() { return ($(TimeFrame.PANEL).is(":visible")); }

    is_focused() { return $(TimeFrame.ELEMENT_INPUT).is(":focus"); }
}