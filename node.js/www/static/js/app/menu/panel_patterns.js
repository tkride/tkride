/** 'panel_patterns.js' */

class PanelPatterns {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = 'panel-patterns';
    static TITLE = 'Explorar resultados';

    // Main panel patterns menu elements
    // static MENU = '';
    // static MENU_CONTENT = '';
    static MENU_ICON = '#patterns-results';

    static ELEMENT_PATTERNS_RESULTS_PANEL = '#patterns-results-panel';
    static ELEMENT_PATTERNS_RESULTS_DROPDOWN_RESULTS = '#patterns-results-panel-handler-results';

    static ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER = '#patterns-results-panel-handler';
    static ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_MIN = '#patterns-results-panel-handler-min';
    static TEXT_MINIMIZE = '__';
    static TEXT_MAXIMIZE = '▭';
    static CSS_HANDLER_FONT_SIZE_MIN = '0.5em';
    static CSS_HANDLER_FONT_SIZE_MAX = '0.8em';
    static CSS_SCALE_MIN = 'scale(0.8)';
    static CSS_SCALE_MAX = 'scale(1)';
    static ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_CLOSE = '#patterns-results-panel-handler-close';

    static ELEMENT_PATTERNS_RESULTS_STATS_TABLE = '#patterns-results-panel-tables';
    static ELEMENT_PATTERNS_RESULTS_TABLE_NAME = '#patterns-results-panel-tables th:first-child';
    static ID_PATTERNS_RESULTS_STATS_TABLE = 'patterns-results-stats-table';
    static SELECTOR_TABLE_EXCEPT_NAME = 'td, th:not(:first-child)';
    
    static TEXT_ONLY_CURRENT = 'only-current';
    static TEXT_ALL = 'all';
    static TEXT_SELECTION = 'selection';
    static TEXT_ADD_SELECTION = 'add';
    static TEXT_REMOVE_SELECTION = 'remove';
    static ELEMENT_CLASS_VISUALIZATION_OP = '.visualization-selection-op';
    static ELEMENT_PATTERNS_RESULTS_SELECTED = '#patterns-results-selected';
    static ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE = '.patterns-results-section-visualization-show-mode';
    static ELEMENT_PATTERNS_SECTION_VISUALIZATION = '#patterns-results-section-visualization';

    static ELEMENT_PATTERNS_RESULTS_EXPLORER = '#patterns-results-section-explorer';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT = '#patterns-results-section-explorer-show-ok-count';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT = '#patterns-results-section-explorer-show-nok-count';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT = '#patterns-results-section-explorer-show-current';

    static ELEMENT_PATTERNS_RESULTS_EXPLORER_OK = '#patterns-results-section-explorer-show-ok';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK = '#patterns-results-section-explorer-show-nok';

    static ELEMENT_PATTERNS_RESULTS_EXPLORER_FIRST = '#patterns-results-section-explorer-first';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_BACKWARD = '#patterns-results-section-explorer-backward';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_FORWARD = '#patterns-results-section-explorer-forward';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_LAST = '#patterns-results-section-explorer-last';

    static ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL = '#patterns-results-section-explorer-trend-bull';
    static ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BEAR = '#patterns-results-section-explorer-trend-bear';
    static CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BULL_SELECTED = 'patterns-results-section-explorer-trend-bull-selected';
    static CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BEAR_SELECTED = 'patterns-results-section-explorer-trend-bear-selected';

    static EVENT_PATTERNS_RESULTS_AVAILABLE = 'event-patterns-results-available';
    static EVENT_PLOT_PATTERN = 'event-patterns-plot-pattern';
    static EVENT_PATTERNS_RESULTS_VISUALIZATION_SELECTION = 'event-patterns-results-visualization-selection';
    static EVENT_PATTERNS_RESULTS_SELECTED = 'event-patterns-results-selected';

    static STATS_TEMPLATE = JSON.stringify( {
        [Const.OK_ID]: { [Const.NUM_ID]:0, [Const.PERCENT_ID]: 0 },
        [Const.NOK_ID]: { [Const.NUM_ID]: 0, [Const.PERCENT_ID]: 0 },
        [Const.TOTAL_ID]: { [Const.NUM_ID]: 0, [Const.PERCENT_ID]: 0 }
    });

    static TRENDS = [ Const.BULL_ID, Const.BEAR_ID, Const.BOTH_ID ];

    //----------------------------- PROPERTIES -----------------------------

    #is_initilized = false;
    #models;
    #tables = {};
    #explorer = {};
    #data_tree = [];
    #result_data;
    #query = {};

    #model_key;
    #prev_count = 0;
    #current_name;
    #current_order;
    #result;
    #results_selected = [];
    #level;

    #visual_selection = {};
    #prev_results;
    #prev_order;
    #prev_trend;
    #visual_conf = {
        movs: {
            labels:1,
            lines:1,
        },
        fibo: {}
    };

    #visual_selection_dd;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(models) {
        this.#models = models;
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #minimize_panel(force) {
        if((force == PanelPatterns.TEXT_MINIMIZE) || (!force && $(PanelPatterns.ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_MIN).text() == PanelPatterns.TEXT_MINIMIZE)) {
            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_MIN).text(PanelPatterns.TEXT_MAXIMIZE);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL + ' > *').css('margin','0');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE).find(PanelPatterns.SELECTOR_TABLE_EXCEPT_NAME).css('display', 'none');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE).css('display', 'inline-flex');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE + ' > *').css('margin-right', '0.5em');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL).css('transform', PanelPatterns.CSS_SCALE_MIN);
        }
        else {
            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_MIN).text(PanelPatterns.TEXT_MINIMIZE);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL + ' > *').css('margin','1em');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE).find(PanelPatterns.SELECTOR_TABLE_EXCEPT_NAME).css('display', '');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE).css('display', '');
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL).css('transform', PanelPatterns.CSS_SCALE_MAX);
        }
    }

    #update_visualization_mode(mode) {
        if(this.#visual_conf.mode != mode) {
            this.#visual_conf.mode = mode;
            let disabled = $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER).prop('disable');
            if(disabled) {
                this.#enable_explorer();
            }
            $(PanelPatterns.ELEMENT_PATTERNS_SECTION_VISUALIZATION).children().removeClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            // $(PanelPatterns.ELEMENT_PATTERNS_SECTION_VISUALIZATION).children().addClass(Const.CLASS_HOVERABLE_ICON);
            if(mode) {
                $(PanelPatterns.ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE + '[name=' + mode + ']').toggleClass(Const.CLASS_HOVERABLE_ICON_SELECTED); // + ' ' + Const.CLASS_HOVERABLE_ICON);
            }
            if(mode != PanelPatterns.TEXT_SELECTION) {
                this.#hide_visualization_selection();
            }
            else {
                if(!this.#visual_selection[this.#current_name]) {
                    this.#visual_selection[this.#current_name] = {};
                }
            }
            this.#update_current();
        }
    }

    #enable_explorer() {
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER).prop('disable', 'false');
    }

    #disable_explorer() {
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER).prop('disable', 'true');
    }

    #show_visualization_selection() {
        $(PanelPatterns.ELEMENT_CLASS_VISUALIZATION_OP).show();
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_SELECTED).show();
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_SELECTED).css('display', 'inline-block');
    }

    #hide_visualization_selection() {
        $(PanelPatterns.ELEMENT_CLASS_VISUALIZATION_OP).hide();
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_SELECTED).hide();
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_SELECTED).hide();
    }

    #update_visualization_selection(op) {
        try {
            if(op == PanelPatterns.TEXT_ADD_SELECTION) {
                let check_exist = [];
                if(!this.#visual_selection[this.#current_name]) {
                    this.#visual_selection[this.#current_name] = {};
                }

                if(!this.#visual_selection[this.#current_name][this.trend]) {
                    this.#visual_selection[this.#current_name][this.trend] = [];
                }
                else {
                    check_exist = this.#visual_selection[this.#current_name][this.trend].filter(idx => idx == this.current_count);
                }
                
                if(check_exist.length == 0) {
                    this.#visual_selection[this.#current_name][this.trend].push(this.current_count);
                    this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(idx => (idx + 1));
                    this.#update_current();
                }
            }
            else {
                this.#visual_selection[this.#current_name][this.trend] = this.#visual_selection[this.#current_name][this.trend].filter( idx => (idx != this.current_count));
                this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(idx => (idx + 1));
                this.#update_current();
            }
        }
        catch(error) {
            console.error("#update_visualization_selection: ", error);
        }
    }

    #update_explorer_controls() {
        try {
            if(this.#current_name) {

                // If explorer not initialized (never should be here)
                if(!this.#explorer[this.#current_name]) {
                    this.#init_explorer_values();
                    console.error('Initializing explorer values when not needed');
                }
                else {
                    // If previous order lower (more restrictive)
                    if((this.#prev_order) && (this.#current_order) && (this.#prev_order < this.#current_order)) {
                        this.current_count = this.#prev_count;
                    }

                    // Update controls
                    $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(this.current_count);
                    $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(this.ok);
                    $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(this.nok);
                    if(!this.#visual_conf.mode) {
                        this.#update_visualization_mode(PanelPatterns.TEXT_ONLY_CURRENT);
                    }
                    else this.#update_current();
                }
            }
            else {
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(0);
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(0);
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(0);
                this.#update_visualization_mode();
            }
        }
        catch(error) {
            console.error("#create_explorer: ", error);
        }
    }
    
    #init_explorer_values(name) {
        let data = this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name];
        this.#explorer[name] = {};
        this.#explorer[name][Const.OK_ID] = {};

        let sbull = data[Const.STATS_ID][this.level].filter(s=>s[Const.TREND_ID]==Const.BULL)[0];
        let sbear = data[Const.STATS_ID][this.level].filter(s=>s[Const.TREND_ID]==Const.BEAR)[0];

        this.#explorer[name][Const.OK_ID][Const.BULL_ID] = sbull[Const.OK_ID].num;
        this.#explorer[name][Const.OK_ID][Const.BEAR_ID] = sbear[Const.OK_ID].num;
        this.#explorer[name][Const.OK_ID][Const.BOTH_ID] = sbull[Const.OK_ID].num + sbear[Const.OK_ID].num;

        this.#explorer[name][Const.NOK_ID] = {};
        this.#explorer[name][Const.NOK_ID][Const.BULL_ID] = sbull[Const.NOK_ID].num;
        this.#explorer[name][Const.NOK_ID][Const.BEAR_ID] = sbear[Const.NOK_ID].num;
        this.#explorer[name][Const.NOK_ID][Const.BOTH_ID] = sbull[Const.NOK_ID].num + sbear[Const.NOK_ID].num;

        this.#explorer[name][Const.TOTAL_ID] = {};
        this.#explorer[name][Const.TOTAL_ID][Const.BULL_ID] = sbull[Const.TOTAL_ID].num;
        this.#explorer[name][Const.TOTAL_ID][Const.BEAR_ID] = sbear[Const.TOTAL_ID].num;

        this.#explorer[name][Const.CURRENT_ID] = {};
        this.#explorer[name][Const.CURRENT_ID][Const.OK_ID] = {};
        this.#explorer[name][Const.CURRENT_ID][Const.NOK_ID] = {};
        this.#explorer[name][Const.CURRENT_ID][Const.OK_ID][Const.BULL_ID] = 0;
        this.#explorer[name][Const.CURRENT_ID][Const.OK_ID][Const.BEAR_ID] = 0;
        this.#explorer[name][Const.CURRENT_ID][Const.OK_ID][Const.BOTH_ID] = 0;
        this.#explorer[name][Const.CURRENT_ID][Const.NOK_ID][Const.BULL_ID] = 0;
        this.#explorer[name][Const.CURRENT_ID][Const.NOK_ID][Const.BEAR_ID] = 0;
        this.#explorer[name][Const.CURRENT_ID][Const.NOK_ID][Const.BOTH_ID] = 0;
    }

    #init_explorer_controls() {
        // Update controls
        this.trend = '';
        this.#select_ok();
        this.#set_trend_bull();
        this.#set_trend_bear();
        if(this.ok > 0) {
            this.current_count = 0;
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(this.current_count + 1);
        }
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(this.ok);
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(this.nok);
        this.#visual_conf.mode = PanelPatterns.TEXT_ONLY_CURRENT;
        $(PanelPatterns.ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE + '[name=' + this.#visual_conf.mode + ']').toggleClass(Const.CLASS_HOVERABLE_ICON_SELECTED); // + ' ' + Const.CLASS_HOVERABLE_ICON);
        this.#hide_visualization_selection();
    }

    #set_trend_bull() {
        try {
            // Stores current result number selected in explorer
            this.#prev_count = this.current_count;
            if(this.trend == Const.BOTH_ID) {
                this.trend = Const.BEAR_ID

                if(!this.#prev_trend) this.#prev_trend = this.trend;
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL).removeClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BULL_SELECTED);
            }
            else {
                if(this.trend != Const.BULL_ID) {
                    if(this.trend == Const.BEAR_ID) this.trend = Const.BOTH_ID;
                    else this.trend = Const.BULL_ID;
                }
                else return;

                if(!this.#prev_trend) this.#prev_trend = this.trend;
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL).addClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BULL_SELECTED);
            }

            this.#update_explorer_controls();
        }
        catch(error) {
            console.error("#set_trend_bull: ", error);
        }
    }

    #set_trend_bear() {
        try {
            // Stores current result number selected in explorer
            this.#prev_count = this.current_count;
            if(this.trend == Const.BOTH_ID) {
                this.trend = Const.BULL_ID

                if(!this.#prev_trend) this.#prev_trend = this.trend;
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BEAR).removeClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BEAR_SELECTED);
            }
            else {
                if(this.trend != Const.BEAR_ID) {
                    if(this.trend == Const.BULL_ID) this.trend = Const.BOTH_ID;
                    else this.trend = Const.BEAR_ID;
                }
                else return;

                if(!this.#prev_trend) this.#prev_trend = this.trend;
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BEAR).addClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BEAR_SELECTED);
            }

            this.#update_explorer_controls();
        }
        catch(error) {
            console.error("#set_trend_bear: ", error);
        }
    }

    #explore_to_first() {
        if(this.current_count != 0) {
            this.current_count = 0;
            this.#update_current();
        }
    }

    #explore_to_backward() {
        if(this.current_count > 0) {
            this.current_count--;
            this.#update_current();
        }
        else this.current_count = 0;
    }

    #explore_to_forward() {
        if(this.current_count < (this.get_total_results_selected() - 1)) {
            this.current_count++;
            this.#update_current();
        }
        else this.current_count = this.get_total_results_selected() - 1;
    }

    #explore_to_last() {
        if(this.current_count != this.get_total_results_selected() - 1) {
            this.current_count = this.get_total_results_selected() - 1;
            this.#update_current();
        }
    }

    #select_ok() {
        if(this.result != Const.OK_ID) {
            this.result = Const.OK_ID;
            this.#update_explorer_controls();
        }
    }

    #select_nok() {
        if(this.result != Const.NOK_ID) {
            this.result = Const.NOK_ID;
            this.#update_explorer_controls();
        }
    }
    
    #update_current() {
        if(this.#is_initilized == false) { return}
        try {
            let data_plot = {};
            
            // if( (this.#current_name) && (this.#current_model[this.#current_name]) ) {
            if( (this.#current_name)
                && (this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][this.#current_name])
                && (this.#results_selected.length))
            {
                console.time('update current');

                let current_value = this.current_count + 1;
                if(!current_value) { current_value = 0; }
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(current_value);
                
                // Selected data
                let selected_data;
                switch(this.#visual_conf.mode) {
                    case PanelPatterns.TEXT_ONLY_CURRENT:
                        selected_data = [this.current_count];
                        break;
                    case PanelPatterns.TEXT_SELECTION:
                        selected_data = this.#visual_selection[this.#current_name][this.trend];
                        break;
                    case PanelPatterns.TEXT_ALL:
                        selected_data = Array.from({ length:this.get_total_results_selected() }, (v,k) => k);
                        break;
                }

                if(selected_data == undefined) {
                    selected_data = [];
                }

                // Add all patterns selected data to output
                let parent_info;
                let name = this.#current_name;
                do {
                    if(name) {
                        let trend = Const.TREND_VAL[this.trend];
                        let curr_query = this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name][Const.QUERY_ID];

                        data_plot[name] = Object.assign(new RetracementData(), this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name]);
                        // If showing multiple results, son data (ex:PHY) should be always OK data (instead NOK (ex:TARGETS)) ...
                        // ... we search NOK in previous valid results, not previous NOK results
                        let current_result_data = this.result_data;
                        if(parent_info) {
                            current_result_data = Const.DATA_ID;
                        }

                        // Filters by selected trend
                        let data = data_plot[name][current_result_data][this.level].filter(df => {
                            if(trend != undefined)
                                return trend.includes(df[Const.TREND_ID]);
                        });


                        data_plot[name][Const.DATA_ID] = { };
                        data_plot[name][Const.NOK_ID] = { };

                        if(!parent_info) {
                            // Filters selected trend and results from retracement data
                            data_plot[name][Const.DATA_ID][this.level] = data.filter( (v, i) => selected_data.includes(i));
                        }
                        else {
                            let parent_name = parent_info[Const.ID_ID];
                            let from = parent_info[Const.FROM_ID];
                            let { from_ref, until_ref, from_new, until_new } = Retracements.get_comparison_fields(from);
                            // data_plot[name][Const.DATA_ID][this.level] = Retracements.filter(data, data_plot[parent_name][Const.DATA_ID][this.level], [until_ref], [until_new]);
                            data_plot[name][Const.DATA_ID][this.level] = Retracements.filter(data, data_plot[parent_name][Const.DATA_ID][this.level], [from_ref, until_ref], [from_new, until_new]);
                        }

                        parent_info = Object.assign({}, curr_query);
                        name = parent_info[Const.SEARCH_IN_ID];
                    }
                } while(name);

                //TODO TEMPORAL ? ELIMINAR DATOS NO INCLUIDOS
                // Deletes unselected results from final data
                Object.keys(data_plot).forEach( name => {
                    if(this.#results_selected.includes(name) == false) {
                        data_plot[name][Const.DATA_ID] = {}
                    }
                });

                // Zoom settings
                if((data_plot[this.#current_name] != undefined)
                        && (data_plot[this.#current_name].data[this.level] != undefined)
                        && (data_plot[this.#current_name].data[this.level].length > 0) )
                    {
                    let priceMin = [].concat(...data_plot[this.#current_name].data[this.level]
                                                            .map( v => [v[Const.INIT_ID].price, v[Const.END_ID].price, v[Const.CORRECTION_ID].price]))
                                                .reduce( (a,b) => a < b ? a : b);
                    let priceMax = [].concat(...data_plot[this.#current_name].data[this.level]
                                                            .map( v => [v[Const.INIT_ID].price, v[Const.END_ID].price, v[Const.CORRECTION_ID].price]))
                                                .reduce( (a,b) => a > b ? a : b);
                    let dateMin = Object.values(data_plot).map( r => (r.data[this.level]) ?
                                                    r.data[this.level].map(t => t[Const.INIT_ID].time) : undefined)
                                                    .filter( d => d != undefined);
                    dateMin = dateMin.reduce( (a,b) => a < b ? a : b)[0];
                    let dateMax = Object.values(data_plot).map( r => (r.data[this.level]) ?
                                                    r.data[this.level].map(t => t[Const.CORRECTION_ID].time) : undefined)
                                                    .filter( d => d != undefined);
                    dateMax = dateMax.reduce( (a,b) => a > b ? a : b)[0];
                    this.#visual_conf.zoom = {
                        startValue: {x: dateMin, y:priceMin},
                        endValue: { x: dateMax, y:priceMax},
                        margin: {x: 400, y: 400}, //Margin values [x:candles, y:% (max-min)]
                        onlyValid: [true, true]
                    };
                }

                // Previous pattern passed to be delete from chart
                this.#visual_conf.prev_name = this.#prev_results;
                console.timeEnd('update current');

                // if(Object.keys(data_plot).length > 0) {
                $(document).trigger(PanelPatterns.EVENT_PLOT_PATTERN, [data_plot, this.#visual_conf, this.query]);
                // }
            }
        }
        catch(error) {
            console.error("#update_current: ", error);
            console.timeEnd('update current');
        }
    }

    #input_current() {
        try {
            let user_current_input = $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val();
            if($.isNumeric(user_current_input) == false) {
                user_current_input = user_current_input.replace(/[a-zA-Z]/g, '');
            }

            if(user_current_input.length > 0) {
                user_current_input = parseInt(user_current_input) - 1;
                if(user_current_input < 0) user_current_input = 0;
                else if(user_current_input > (this.get_total_results_selected() - 1)) {
                    user_current_input = this.get_total_results_selected() - 1;
                }
                this.current_count = user_current_input;
                this.#update_current();
            }
        }
        catch(error) {
            console.error("#input_current: ", error);
        }
    }

    #select_from_visualization_list(idx) {
        let index = parseInt(idx);
        this.current_count = index - 1;
        this.#update_current();    
    }

    #format_stats_data(data) {
        let stats;
        try {
            // let sbull = (data.stats[Const.BULL_ID] != undefined) ? data.stats[Const.BULL_ID][this.level] : JSON.parse(PanelPatterns.STATS_TEMPLATE);
            // let sbear = (data.stats[Const.BEAR_ID] != undefined) ? data.stats[Const.BEAR_ID][this.level] : JSON.parse(PanelPatterns.STATS_TEMPLATE);
            let sbull = (data.stats[this.level] != undefined) ? data.stats[this.level].filter(s => s[Const.TREND_ID] == Const.BULL)[0] : JSON.parse(PanelPatterns.STATS_TEMPLATE);
            let sbear = (data.stats[this.level] != undefined) ? data.stats[this.level].filter(s => s[Const.TREND_ID] == Const.BEAR)[0] : JSON.parse(PanelPatterns.STATS_TEMPLATE);

            stats = {
                model_info: this.#model_key,
                // title: data[Const.NAME_ID],
                title: data[Const.ID_ID],
                header: [Const.BULL_ID.toUpperCase(), Const.BEAR_ID.toUpperCase()],
                rows: {
                    OK: [ [sbull[Const.OK_ID][Const.NUM_ID], ' ('+(sbull[Const.OK_ID][Const.PERCENT_ID]).toFixed(1)+'%)'], [sbear[Const.OK_ID][Const.NUM_ID], ' ('+(sbear[Const.OK_ID][Const.PERCENT_ID]).toFixed(1)+'%)'] ],
                    NOK: [ [sbull[Const.NOK_ID][Const.NUM_ID], ' ('+(sbull[Const.NOK_ID][Const.PERCENT_ID]).toFixed(1)+'%)'], [sbear[Const.NOK_ID][Const.NUM_ID], ' ('+(sbear[Const.NOK_ID][Const.PERCENT_ID]).toFixed(1)+'%)'] ],
                    TOTAL: [ [ sbull[Const.TOTAL_ID][Const.NUM_ID], ' ('+(sbull[Const.TOTAL_ID][Const.PERCENT_ID]).toFixed(1)+'%)' ], [ sbear[Const.TOTAL_ID][Const.NUM_ID], ' ('+(sbear[Const.TOTAL_ID][Const.PERCENT_ID]).toFixed(1)+'%)' ] ],
                },
            };
        }
        catch(error) {
            console.error("#format_stats_data: ", error);
        }
        return stats;
    }

    #select_data(el) {
        try {
            let name = $(el).text();
            let tree_order;
            let name_order;
            $(el).toggleClass(Const.CLASS_HOVERABLE_ICON_SELECTED);

            // Stores all previous reuslts names selected (to manager chart deletion)
            if(this.#results_selected.length > 0) {
                this.#prev_results = JSON.parse(JSON.stringify(this.#results_selected));
            }
            else {
                this.#prev_results = undefined;
            }

            // If new data is selected
            if($(el).hasClass(Const.CLASS_HOVERABLE_ICON_SELECTED)) {
                // Insert new selected into correct order tree
                name_order = this.#set_result_tree_order(name);
            }

            // If data is unselected
            else {
                // Search and removes unselected data name
                let idx = this.#results_selected.indexOf(name);
                if(idx > -1) {
                    this.#results_selected.splice(idx, 1);
                    // name_order = this.#set_result_tree_order()
                }
            }

            // Get lower order selected data
            name_order = this.#set_result_tree_order()
            
            // Set current real selected name and order
            name = name_order.name;
            tree_order = name_order.order;
            // The lower order controls explorer results, and then must be updated
            if((this.#current_order == undefined) || (this.#current_order == -1) || (tree_order != this.#current_order)) {
                // Stores previous result count number
                this.#prev_count = this.current_count;
                // Stores current selected data trend
                let trend = this.trend;
                // Update current result selected name
                this.#current_name = name;
                // Set the new current order
                this.#current_order = tree_order;
                // Set new selected data trend to same as previous
                if(trend) this.trend = trend;
            }

            // Loads picked results list for current data
            if(this.#visual_selection[this.#current_name])
                this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(v => v+1);
            else {
                this.#visual_selection_dd.items = [];
            }

            this.#update_explorer_controls();

        }
        catch(error) {
            console.error("#select_data error: ", error);
        }
    }

    /**
     * @param name Result name from the tree to be set.
     * If no name provided, will set lower order result available in results selected.
     * @returns Object with current name, order set.
     * @throws Exception if name provided is not in data_tree.
     */
    #set_result_tree_order(name) {
        let tree_order;
        // Get current name tree order
        if(name) {
            tree_order = this.#data_tree.indexOf(name);
        }
        // Get lower result name and tree order from selected results
        else {
            let n_o = this.#get_results_lower_order_result();
            name = n_o.name;
            tree_order = n_o.order;
            // Deletes name from results selected (already in list), and will be added again later with current result order
            let i = this.#results_selected.indexOf(name);
            if(i > -1) {
                this.#results_selected.splice(i, 1);
            }
        }
        
        let i = 0;
        do {
            if((this.#results_selected.length == 0)
                || (tree_order < this.#data_tree.indexOf(this.#results_selected[i]))) {
                break;
            }
            i++;
        } while(i < this.#results_selected.length);
        if(name) this.#results_selected.splice(i, 0, name);

        if(tree_order == -1) throw('ERROR: unknown pattern result name:', name);

        // Stores previous order
        if(this.#current_order) this.#prev_order = this.#current_order;
        return { name: name, order: tree_order };
    }

    #get_results_lower_order_result() {
        let new_order = 0;
        let new_name = '';
        this.#results_selected.forEach(name => {
            let order = this.#data_tree.indexOf(name);
            if((order > -1) && ( (!new_name) || (order < new_order)) ) {
                new_name = name;
                new_order = order;
            }
        });

        return { name: new_name, order: new_order };
    }

    #create_results_tree(name) {
        this.#create_names_tree(name);
        this.#data_tree.forEach(name => {
            this.#init_explorer_values(name);
            this.#init_explorer_controls();
            this.#select_data(this.#tables[name].header_name_element);
        });
    }

    #create_names_tree(name) {
        let data = this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name];
        if(data) {
            this.#data_tree.push(name);
            let parent = data[Const.SEARCH_IN_ID];
            if(parent) {
                this.#create_names_tree(parent);
            }
            let table_data = this.#format_stats_data(data);
            this.#tables[name] = new Table({ data: table_data, title: PanelPatterns.ID_PATTERNS_RESULTS_STATS_TABLE, css: { 'font-size':'0.85em'} });
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE).append(this.#tables[name].table);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_TABLE_NAME).addClass(`${Const.CLASS_HOVERABLE_TEXT}`); // ${Const.CLASS_HOVERABLE_ICON}`);
            this.#current_name = name;
        }
    }

    #reset_panel() {
        this.#is_initilized = false;
        this.#model_key = null;
        this.#data_tree = [];
        this.#current_name = null;
        this.#current_order = null;
        this.#results_selected = [];
        this.#level = null;

        this.#visual_selection = {};
        this.#visual_conf = {
            movs: {
                labels:1,
                lines:1,
            },
            fibo: {}
        };

        Object.keys(this.#tables).forEach(name => {
            if(this.#tables[name].table) {
                this.#tables[name].table.remove();
            }
        });
        this.#tables = {};
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    
    init() {
        try {
            // Event new results available
            $(document).on(PanelPatterns.EVENT_PATTERNS_RESULTS_AVAILABLE, (e, query) => {
                this.#reset_panel();
                if(query) {
                    this.query = query;
                    this.#model_key = query.model_key;
                    this.level = query[Const.LEVEL_ID];
                    // let name = query[Const.NAME_ID];
                    let name = query[Const.ID_ID];
                    this.#create_results_tree(name);
                    this.#is_initilized = true;
                    this.#update_current();
                }
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL + ' > *').each((i, e) => $(e).show())
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL).show();
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL).draggable({containment: "window"});
            });

            // // Dropdown control
            // let dd_control =  $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_DROPDOWN_RESULTS);
            // let items;
            // if($(dd_control).data('source')) {
            //     items = eval($(dd_control).data('source'));
            // }
            // this.#results_dd = new Dropdown({ element: dd_control, items:items });

            // $(document).on(PanelPatterns.EVENT_PATTERNS_RESULTS_SELECTED, (e, result) => {
            //     console.log(result, e);
            // });

            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_CLOSE).on('click', e => {
                this.#minimize_panel(PanelPatterns.TEXT_MAXIMIZE);
                this.#reset_panel();
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_PANEL).hide();
            });

            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_RESULTS_HANDLER_MIN).on('click', e => this.#minimize_panel());

            // Visualization setting controls
            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE).on('click', e => {
                this.#update_visualization_mode($(e.target).attr('name'));
            });

            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE + '+[name=' + PanelPatterns.TEXT_ALL + ']').on('click', e => this.#disable_explorer());

            $(PanelPatterns.ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE + '+[name=' + PanelPatterns.TEXT_SELECTION + ']').on('click', e => this.#show_visualization_selection(e.target));

            $(PanelPatterns.ELEMENT_CLASS_VISUALIZATION_OP).on('click', e => this.#update_visualization_selection($(e.target).attr('name')));

            $(document).on(PanelPatterns.EVENT_PATTERNS_RESULTS_VISUALIZATION_SELECTION, (e, idx, el) => this.#select_from_visualization_list(idx));

            // Explorer options controls
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL).on('click', e => this.#set_trend_bull()); //$(e.target).attr('name')));

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BEAR).on('click', e => this.#set_trend_bear($(e.target).attr('name')));

            // Explorer controls
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_FIRST).on('click', e =>  this.#explore_to_first());

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_BACKWARD).on('click', e =>  this.#explore_to_backward());

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).on('keyup', e => this.#input_current());

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_FORWARD).on('click', e =>  this.#explore_to_forward());

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_LAST).on('click', e =>  this.#explore_to_last());

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK).on('click', e => this.#select_ok());

            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK).on('click', e => this.#select_nok());

            $(document).on('click', PanelPatterns.ELEMENT_PATTERNS_RESULTS_TABLE_NAME, e => this.#select_data(e.target));

            this.#visual_selection_dd = new Dropdown({ element: $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_SELECTED), items: [] });

            $(PanelPatterns.MENU_ICON).prop('title', PanelPatterns.TITLE);
        }
        catch(error) {
            console.error("PanelPatterns init error: ", error);
        }
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get trend() {
        // let trend = Const.BULL_ID;
        let trend;
        if((this.#current_name) && (this.#explorer[this.#current_name] != undefined))
            if(this.#explorer[this.#current_name][Const.TREND_ID] != undefined)
                trend = this.#explorer[this.#current_name][Const.TREND_ID];
        return trend;
    }

    set trend(s) {
        if(this.#current_name)
            if(this.#explorer[this.#current_name])
                this.#explorer[this.#current_name][Const.TREND_ID] = s;
    }

    get result() {
        return this.#result;
        // if(this.#current_name)
            // return this.#explorer[this.#current_name][Const.RESULTS_ID];
        // return null;
    }

    set result(r) {
        this.#result = r;
        // if(this.#current_name) {
            // this.#explorer[this.#current_name][Const.RESULTS_ID] = r;
        // }
    }

    get result_data() {
        this.#result_data = (this.result == Const.OK_ID) ? Const.DATA_ID : 
                                (this.result == Const.NOK_ID) ? Const.NOK_ID : undefined;
        return this.#result_data;
    }

    get current_count() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend];
        return null;
    }

    set current_count(val) {
        if(this.#current_name) {
            if( (val <= this.#explorer[this.#current_name][this.result][this.trend])
                    && (val >= 0) ) {
                this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = val;
            }
            else if((val == null) || (val < 0)) {
                this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = 0;
            }
            else if(val > this.#explorer[this.#current_name][this.result][this.trend]) {
                this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#current_name][this.result][this.trend];
            }
        }
    }

    get ok() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.OK_ID][this.trend];
        return null;
    }

    get nok() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.NOK_ID][this.trend];
        return null;
    }

    get_total_results_selected() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][this.result][this.trend];
        return null;
    }

    get level() { return (this.#level > 0) ? (this.#level - 1) : this.#level; }

    set level(level) { this.#level = level; }

//     /*
//         dataType: Const.RETRACEMENTS_ID
//         data_y: [ [time, price], [time, price], [time, price]]
//         data_ret: [ [time, price] , ret]
//         trend: Const.BULL_ID or Const.BEAR_ID
//         data.id: name + [_BULL_ or _BEAR_] + index
//     */
//    //TODO GENERAR TENDENCIA 'AMBOS' ORDENANDO CON MAP LOS MOVIMIENTOS Y LOS RETROCESOS
//     get current_match() {
//         if(this.#current_name) {
//             let trend_name = (this.trend == Const.BULL_ID) ? '_BULL_' : '_BEAR_';
//             let id = this.#model_key + trend_name + this.current;
//             let data = {
//                 dataType: Const.RETRACEMENTS_ID,
//                 data_y: [this.#current_model[this.#current_name].data_y[this.trend][this.current]],
//                 data_ret: [this.#current_model[this.#current_name].data_ret[this.trend][this.current]],
//                 trend: this.trend,
//                 id: id,
//                 idx: this.current,
//             };
//             return data;
//         }
//         return null;
//     }

    get query() { return this.#query; }
    set query(query) { this.#query = query; }
}