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
        [Const.BAD_ID]: { [Const.NUM_ID]: 0, [Const.PERCENT_ID]: 0 },
        [Const.TOTAL_ID]: { [Const.NUM_ID]: 0, [Const.PERCENT_ID]: 0 }
    });

    //----------------------------- PROPERTIES -----------------------------

    #models;
    #tables = {};
    #explorer = {};
    #data_tree = [];
    #results_dd;
    #query = {};

    #model_key;
    #current_model = {};
    #current_name;
    #current_order;
    #results_selected = [];
    #level;

    #visual_selection = {};
    #prev_name;
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
            $(PanelPatterns.ELEMENT_PATTERNS_SECTION_VISUALIZATION).children().addClass(Const.CLASS_HOVERABLE_ICON);
            if(mode) {
                $(PanelPatterns.ELEMENT_CLASS_PATTERNS_VISUALIZATION_SHOW_MODE + '[name=' + mode + ']').toggleClass(Const.CLASS_HOVERABLE_ICON_SELECTED + ' ' + Const.CLASS_HOVERABLE_ICON);
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
                    check_exist = this.#visual_selection[this.#current_name][this.trend].filter(idx => idx == this.current);
                }
                
                if(check_exist.length == 0) {
                    this.#visual_selection[this.#current_name][this.trend].push(this.current);
                    this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(idx => (idx + 1));
                    this.#update_current();
                }
            }
            else {
                this.#visual_selection[this.#current_name][this.trend] = this.#visual_selection[this.#current_name][this.trend].filter( idx => (idx != this.current));
                this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(idx => (idx + 1));
                this.#update_current();
            }
        }
        catch(error) {
            console.error("#update_visualization_selection: ", error);
        }
    }

    #generate_nok() {
        // this.#patterns.model.movs;
    }

    #generate_both_trends() {
        try {
            // var merged_y = this.#current_model[this.#current_name].data[Const.BULL_ID][this.level]
            //                 .concat(this.#current_model[this.#current_name].data[Const.BEAR_ID][this.level])
            //                 .sort( (x, y) => ( x[Const.TIMESTAMP_ID] > y[Const.TIMESTAMP_ID]) ? 1 : -1 );
            // this.#current_model[this.#current_name].data[Const.BOTH_ID] = { [this.level]: merged_y };
            let dbull = this.#current_model[this.#current_name].data[this.level].filter(d => d[Const.TREND_ID] == Const.BULL);
            let dbear = this.#current_model[this.#current_name].data[this.level].filter(d => d[Const.TREND_ID] == Const.BEAR);
            let dboth = this.#current_model[this.#current_name].data[this.level]
                        .sort( (x, y) => ( x[Const.TIMESTAMP_ID] > y[Const.TIMESTAMP_ID]) ? 1 : -1 );
            this.#current_model[this.#current_name].data[Const.BULL_ID] = { [this.level]: dbull };
            this.#current_model[this.#current_name].data[Const.BEAR_ID] = { [this.level]: dbear };
            this.#current_model[this.#current_name].data[Const.BOTH_ID] = { [this.level]: dboth };

            // var merged_x = this.#current_model[this.#current_name].data_x[Const.BULL_ID].concat(this.#current_model[this.#current_name].data_x[Const.BEAR_ID]).sort();
            // var merged_ret = this.#current_model[this.#current_name].data_ret[Const.BULL_ID][this.level].concat(this.#current_model[this.#current_name].data_ret[Const.BEAR_ID][this.level]).sort();
            // var merged_ret_levels = this.#current_model[this.#current_name].data_ret_levels[Const.BULL_ID][this.level].concat(this.#current_model[this.#current_name].data_ret[Const.BEAR_ID][this.level]).sort();
            // var merged_delta_fin = this.#current_model[this.#current_name].delta_fin[Const.BULL_ID][this.level].concat(this.#current_model[this.#current_name].delta_fin[Const.BEAR_ID][this.level]).sort();
            // var merged_delta_ini = this.#current_model[this.#current_name].delta_ini[Const.BULL_ID][this.level].concat(this.#current_model[this.#current_name].delta_ini[Const.BEAR_ID][this.level]).sort();
            // // this.#current_model[this.#current_name].data_x[Const.BOTH_ID] = merged_x;
            // this.#current_model[this.#current_name].data_ret[Const.BOTH_ID] = merged_ret;
            // this.#current_model[this.#current_name].data_ret_levels[Const.BOTH_ID] = merged_ret_levels;
            // this.#current_model[this.#current_name].delta_fin[Const.BOTH_ID] = merged_delta_fin;
            // this.#current_model[this.#current_name].delta_ini[Const.BOTH_ID] = merged_delta_ini;
            
            // let merged_bull_x = [...merged_x];
            // let merged_bear_x = [...merged_x];
            // merged_bull_x.map( (v, i) => { if(this.#current_model[this.#current_name].data_x[Const.BULL_ID].indexOf(v) == -1) merged_bull_x[i] = Array(); });
            // merged_bear_x.map( (v, i) => { if(this.#current_model[this.#current_name].data_x[Const.BEAR_ID].indexOf(v) == -1) merged_bear_x[i] = Array(); });
            
            // let merged_bull_y = [...merged_y];
            // let merged_bear_y = [...merged_y];
            // merged_bull_y.map( (v, i) => { if(this.#current_model[this.#current_name].data[Const.BULL_ID][this.level].indexOf(v) == -1) merged_bull_y[i] = Array(); });
            // merged_bear_y.map( (v, i) => { if(this.#current_model[this.#current_name].data[Const.BEAR_ID][this.level].indexOf(v) == -1) merged_bear_y[i] = Array(); });

            // let merged_bull_ret = [...merged_ret];
            // let merged_bear_ret = [...merged_ret];
            // merged_bull_ret.map( (v, i) => { if(this.#current_model[this.#current_name].data_ret[Const.BULL_ID].indexOf(v) == -1) merged_bull_ret[i] = Array(); });
            // merged_bear_ret.map( (v, i) => { if(this.#current_model[this.#current_name].data_ret[Const.BEAR_ID].indexOf(v) == -1) merged_bear_ret[i] = Array(); });

            // let merged_bull_ret_levels = [...merged_ret_levels];
            // let merged_bear_ret_levels = [...merged_ret_levels];
            // merged_bull_ret_levels.map( (v, i) => { if(this.#current_model[this.#current_name].data_ret_levels[Const.BULL_ID].indexOf(v) == -1) merged_bull_ret_levels[i] = Array(); });
            // merged_bear_ret_levels.map( (v, i) => { if(this.#current_model[this.#current_name].data_ret_levels[Const.BEAR_ID].indexOf(v) == -1) merged_bear_ret_levels[i] = Array(); });
        }
        catch(error) {
            console.error("#generate_both_trends: ", error);
        }
    }

    #set_explorer_values() {
        try {
            if(this.#current_name) {
                // Initialize properties
                // this.#generate_nok();
                // this.#generate_both_trends();

                this.#current_name = this.#current_model[this.#current_name][Const.NAME_ID];
                if(!this.#explorer[this.#current_name]) {
                    this.#set_default_explorer_values();
                }
                else {
                    if((this.#prev_order < this.#current_order) && this.#prev_name) {
                        if(!this.#prev_trend) this.#prev_trend = this.trend;
                        // this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#prev_name][Const.CURRENT_ID][this.result][this.#prev_trend];
                        this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#prev_name][Const.CURRENT_ID][this.result][this.trend];
                    }
                    else if(this.trend != this.#prev_trend) {
                        if(!this.#prev_trend) this.#prev_trend = this.trend;
                        // this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.#prev_trend];
                        this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend];
                    }
                    // Limits maximum value
                    if(this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] > this.#explorer[this.#current_name][this.result][this.trend]) {
                        this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#current_name][this.result][this.trend];
                    }    

                    // Update controls
                    $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(this.ok);
                    $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(this.nok);
                    $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(this.current);
                    if(!this.#visual_conf.mode) {
                        // this.#visual_conf.mode = PanelPatterns.TEXT_ONLY_CURRENT;
                        this.#update_visualization_mode(PanelPatterns.TEXT_ONLY_CURRENT);
                    }
                    else this.#update_current();
                }
            }
            else {
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(0);
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(0);
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(0);
                this.#update_visualization_mode(Const.EMPTY_STR);
            }
        }
        catch(error) {
            console.error("#create_explorer: ", error);
        }
    }
    
    #set_default_explorer_values() {
        this.#explorer[this.#current_name] = {};
        this.trend = '';
        this.#explorer[this.#current_name][Const.RESULTS_ID] = Const.OK_ID;
        this.#explorer[this.#current_name][Const.OK_ID] = {};

        let sbull = this.#current_model[this.#current_name].stats[this.level].filter(s=>s[Const.TREND_ID]==Const.BULL)[0];
        let sbear = this.#current_model[this.#current_name].stats[this.level].filter(s=>s[Const.TREND_ID]==Const.BEAR)[0];

        this.#explorer[this.#current_name][Const.OK_ID][Const.BULL_ID] = sbull[Const.OK_ID].num;
        this.#explorer[this.#current_name][Const.OK_ID][Const.BEAR_ID] = sbear[Const.OK_ID].num;
        this.#explorer[this.#current_name][Const.OK_ID][Const.BOTH_ID] = sbull[Const.OK_ID].num + sbear[Const.OK_ID].num;

        this.#explorer[this.#current_name][Const.BAD_ID] = {};
        this.#explorer[this.#current_name][Const.BAD_ID][Const.BULL_ID] = sbull[Const.BAD_ID].num;
        this.#explorer[this.#current_name][Const.BAD_ID][Const.BEAR_ID] = sbear[Const.BAD_ID].num;
        this.#explorer[this.#current_name][Const.BAD_ID][Const.BOTH_ID] = sbull[Const.BAD_ID].num + sbear[Const.BAD_ID].num;

        this.#explorer[this.#current_name][Const.TOTAL_ID] = {};
        this.#explorer[this.#current_name][Const.TOTAL_ID][Const.BULL_ID] = sbull[Const.TOTAL_ID].num;
        this.#explorer[this.#current_name][Const.TOTAL_ID][Const.BEAR_ID] = sbear[Const.TOTAL_ID].num;

        this.#explorer[this.#current_name][Const.CURRENT_ID] = {};
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.OK_ID] = {};
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.BAD_ID] = {};
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.OK_ID][Const.BULL_ID] = 0;
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.OK_ID][Const.BEAR_ID] = 0;
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.OK_ID][Const.BOTH_ID] = 0;
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.BAD_ID][Const.BULL_ID] = 0;
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.BAD_ID][Const.BEAR_ID] = 0;
        this.#explorer[this.#current_name][Const.CURRENT_ID][Const.BAD_ID][Const.BOTH_ID] = 0;

        // Update controls
        this.#set_trend_bull(Const.BULL_ID);
        if(this.ok > 0) {
            this.#update_current();
        }
        // $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(this.current);
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(this.ok);
        $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(this.nok);
        this.#update_visualization_mode(PanelPatterns.TEXT_ONLY_CURRENT);
    }

    #set_trend_bull(trend) {
        try {
            let current = this.current;
            if(this.trend == Const.BOTH_ID) {
                this.trend = Const.BEAR_ID
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL).removeClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BULL_SELECTED);
            }
            else {
                if(this.trend != Const.BULL_ID) {
                    if(this.trend == Const.BEAR_ID) this.trend = Const.BOTH_ID;
                    else this.trend = Const.BULL_ID;
                }
                else return;
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL).addClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BULL_SELECTED);
            }
            this.current = current;
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(this.current);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(this.ok);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(this.nok);
            this.#update_data_trend();
            this.#set_explorer_values();
        }
        catch(error) {
            console.error("#set_trend_bull: ", error);
        }
    }

    #set_trend_bear(trend) {
        try {
            let current = this.current;
            if(this.trend == Const.BOTH_ID) {
                this.trend = Const.BULL_ID
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BEAR).removeClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BEAR_SELECTED);
            }
            else {
                if(this.trend != Const.BEAR_ID) {
                    if(this.trend == Const.BULL_ID) this.trend = Const.BOTH_ID;
                    else this.trend = Const.BEAR_ID;
                }
                else return;
                $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BEAR).addClass(PanelPatterns.CLASS_PATTERNS_RESULTS_TREND_EXPLORER_BEAR_SELECTED);
            }
            this.current = current;
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(this.current);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_OK_COUNT).text(this.ok);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_NOK_COUNT).text(this.nok);
            this.#update_data_trend();
            this.#set_explorer_values();
        }
        catch(error) {
            console.error("#set_trend_bear: ", error);
        }
    }

    #update_data_trend() {
        try {
            let trend = Const.TREND_VAL[this.trend];
            this.#results_selected.forEach(name => {
                if(!this.#current_model[name]) {
                    this.#current_model[name] = { [this.level]: [] };
                }
                this.#current_model[name].data[this.level] = JSON.parse(JSON.stringify(this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name].data[this.level]
                                                            .filter(v => trend.includes(v[Const.TREND_ID])) ));
            });
        }
        catch(error) {
            console.error(`#update_data_trend ERROR: ${error}.`);
        }
    }

    #explore_to_first() {
        if(this.current != 0) {
            this.current = 0;
            this.#update_current();
        }
    }

    #explore_to_backward() {
        if(this.current > 0) {
            this.current--;
            this.#update_current();
        }
        else this.current = 0;
    }

    #explore_to_forward() {
        if(this.current < (this.get_total_results_selected() - 1)) {
            this.current++;
            this.#update_current();
        }
        else this.current = this.get_total_results_selected() - 1;
    }

    #explore_to_last() {
        if(this.current != this.get_total_results_selected() - 1) {
            this.current = this.get_total_results_selected() - 1;
            this.#update_current();
        }
    }

    #select_ok() {
        if(this.result != Const.OK_ID) {
            this.result = Const.OK_ID;
            this.#set_explorer_values();
        }
    }

    #select_nok() {
        if(this.result != Const.BAD_ID) {
            this.result = Const.BAD_ID;
            this.#set_explorer_values();
        }
    }
    
    #update_current() {
        console.time('update current');
        try {
            let data_plot = {};
            // let trend = Const.TREND_VAL[this.trend];

            let current_value = this.current + 1;
            if(!current_value) { current_value = 0; }
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_CURRENT).val(current_value);
            
            // Selected data
            let selected_data;
            switch(this.#visual_conf.mode) {
                case PanelPatterns.TEXT_ONLY_CURRENT:
                    selected_data = [this.current];
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
            this.#results_selected.forEach(name => {
                if(name) {
                    // data_plot[name] = new Retracements(this.#current_model[name]);
                    // data_plot[name] = JSON.parse(JSON.stringify(this.#current_model[name]));
                    data_plot[name] = Object.assign(new Retracement(), this.#current_model[name]);
                    // Reset data
                    data_plot[name].data = { };
                    // Filters selected trend and results from retracement data
                    data_plot[name].data[this.level] = this.#current_model[name].data[this.level]
                                                        // .filter( v => trend.includes(v[Const.TREND_ID]) )
                                                        .filter( (v, i) => selected_data.includes(i));
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
                let dateMin = [].concat(...data_plot[this.#current_name].data[this.level].map(t => t[Const.INIT_ID].time)).reduce((a, b) => a < b ? a : b);
                let dateMax = [].concat(...data_plot[this.#current_name].data[this.level].map(t => t[Const.CORRECTION_ID].time)).reduce((a, b) => a > b ? a : b);
                this.#visual_conf.zoom = {
                    startValue: {x: dateMin, y:priceMin},
                    endValue: { x: dateMax, y:priceMax},
                    margin: {x: 30, y: 5}, //Margin values [x:candles, y:% max]
                };
            }

            // Previous pattern passed to be delete from chart
            this.#visual_conf.prev_name = this.#prev_name;
            console.timeEnd('update current');

            $(document).trigger(PanelPatterns.EVENT_PLOT_PATTERN, [data_plot, this.#visual_conf, this.query]);
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
                this.current = user_current_input;
                this.#update_current();
            }
        }
        catch(error) {
            console.error("#input_current: ", error);
        }
    }

    #select_from_visualization_list(idx) {
        let index = parseInt(idx);
        this.current = index - 1;
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
                title: data[Const.NAME_ID],
                header: [Const.BULL_ID.toUpperCase(), Const.BEAR_ID.toUpperCase()],
                rows: {
                    OK: [ [sbull[Const.OK_ID][Const.NUM_ID], '('+(sbull[Const.OK_ID][Const.PERCENT_ID]).toFixed(2)+'%)'], [sbear[Const.OK_ID][Const.NUM_ID], '('+(sbear[Const.OK_ID][Const.PERCENT_ID]).toFixed(2)+'%)'] ],
                    NOK: [ [sbull[Const.BAD_ID][Const.NUM_ID], '('+(sbull[Const.BAD_ID][Const.PERCENT_ID]).toFixed(2)+'%)'], [sbear[Const.BAD_ID][Const.NUM_ID], '('+(sbear[Const.BAD_ID][Const.PERCENT_ID]).toFixed(2)+'%)'] ],
                    TOTAL: [sbull[Const.TOTAL_ID][Const.NUM_ID], sbear[Const.TOTAL_ID][Const.NUM_ID]],
                },
            };

            // tbull = parseInt(sbull[Const.OK_ID]);
            // tbull += parseInt(sbull[Const.BAD_ID]);
            // tbear = parseInt(sbear[Const.OK_ID]);
            // tbear += parseInt(sbear[Const.BAD_ID]);
            
            // let pcbull = {
            //     [Const.OK_ID]: (tbull == 0) ? 0 : ((sbull[Const.OK_ID]/tbull)*100).toFixed(2),
            //     [Const.BAD_ID]: (tbull == 0) ? 0 : ((sbull[Const.BAD_ID]/tbull)*100).toFixed(2),
            //     [Const.NO_EVAL_ID]: (tbull == 0) ? 0 : ((sbull[Const.NO_EVAL_ID]/tbull)*100).toFixed(2),
            // };

            // let pcbear = {
            //     [Const.OK_ID]: (tbear == 0) ? 0 : ((sbear[Const.OK_ID]/tbear)*100).toFixed(2),
            //     [Const.BAD_ID]: (tbear == 0) ? 0 : ((sbear[Const.BAD_ID]/tbear)*100).toFixed(2),
            //     [Const.NO_EVAL_ID]: (tbear == 0) ? 0 : ((sbear[Const.NO_EVAL_ID]/tbear)*100).toFixed(2),
            // };

            // stats = {
            //     model_info: this.#model_key,
            //     title: data[Const.NAME_ID],
            //     header:[Const.BULL_ID, Const.BEAR_ID],
            //     rows: {
            //         OK: [ [sbull[Const.OK_ID], '('+pcbull[Const.OK_ID]+'%)'], [sbear[Const.OK_ID], '('+pcbear[Const.OK_ID]+'%)'] ],
            //         NOK: [ [sbull[Const.BAD_ID], '('+pcbull[Const.BAD_ID]+'%)'], [sbear[Const.BAD_ID], '('+pcbear[Const.BAD_ID]+'%)'] ],
            //         TOTAL: [tbull, tbear],
            //     },
            // };
        }
        catch(error) {
            console.error("#format_stats_data: ", error);
        }
        return stats;
    }

    #select_data(el) {
        try {
            let name = $(el).text();
            $(el).toggleClass(Const.CLASS_HOVERABLE_ICON_SELECTED);
            if($(el).hasClass(Const.CLASS_HOVERABLE_ICON_SELECTED)) {
                let data = this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name];
                let tree_order = this.#data_tree.indexOf(name);
                let i = 0;
                do {
                    if((this.#results_selected.length == 0)
                        || (tree_order < this.#data_tree.indexOf(this.#results_selected[i]))) {
                        break;
                    }
                    i++;
                } while(i < this.#results_selected.length);
                this.#results_selected.splice(i, 0, name);

                if(tree_order == -1) throw('ERROR: unknown pattern result name:', name);

                // If first data name selected OR new selected data has lower order, update explorer and current data model
                // (the lower order controls explorer results)
                if((this.#current_order == undefined) || (this.#current_order == -1) || (tree_order < this.#current_order)) {
                    // Stores previous selected results
                    if(this.#current_name) this.#prev_name = this.#current_name;
                    if(this.#current_order) this.#prev_order = this.#current_order;
                    if(this.trend) this.#prev_trend = this.trend;
                    let trend = this.trend;
                    
                    // Update current results seletion
                    this.#current_name = name;
                    if(trend) this.trend = trend;
                    this.#current_order = tree_order; //this.#data_tree.indexOf(this.#current_name);
                    this.#current_model[name] = JSON.parse(JSON.stringify(data));
                    if(this.#visual_selection[this.#current_name])
                        this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(v => v+1);
                    else {
                        this.#visual_selection_dd.items = [];
                    }
                }
                this.#set_explorer_values();
            }
            else {
                let idx = this.#results_selected.indexOf(name);
                if(idx > -1) {
                    this.#results_selected.splice(idx, 1);
                    // If deleted is the lower order result, searches next lower order result selected
                    if(this.#current_name == name) {
                        let new_name;
                        let new_order;
                        this.#results_selected.forEach(name => {
                            let order = this.#data_tree.indexOf(name);
                            if((order > -1) && ( (!new_name) || (order < new_order)) ) {
                                new_name = name;
                                new_order = order;
                            }
                        });

                        if(this.#current_name) this.#prev_name = this.#current_name;
                        if(this.#current_order) this.#prev_order = this.#current_order;
                        if(this.trend) this.#prev_trend = this.trend;
                        let trend = this.trend;

                        this.#current_name = new_name;
                        this.#current_order = new_order;
                        if(trend) this.trend = trend;
                        if(this.#visual_selection[this.#current_name])
                            this.#visual_selection_dd.items = this.#visual_selection[this.#current_name][this.trend].map(v => v+1);
                        else 
                            this.#visual_selection_dd.items = [];
                    }
                    this.#set_explorer_values();
                }
            }
        }
        catch(error) {
            console.error("#select_data error: ", error);
        }
    }

    // TODO BUSCADOR SOBRE RESULTADOS (RETROCESO <,>,=,!=), BUSCAR EN: RESULTADO (PHY-TARGET), OK-NOK, ALCISTA-BAJISTA, MAX-MIN, PENDIENTE, ...
    #create_results_tree(name) {
        let data = this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][name]; //[this.level];
        if(data) {
            this.#data_tree.push(name);
            let parent = data[Const.SEARCH_IN_ID];
            if(parent) {
                this.#create_results_tree(parent);
                // parent_data = this.#models[this.#model_key][Const.PATTERN_RESULTS_ID][parent]; //[this.level];
            }
            let table_data = this.#format_stats_data(data);
            this.#tables[name] = new Table(table_data, PanelPatterns.ID_PATTERNS_RESULTS_STATS_TABLE);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_STATS_TABLE).append(this.#tables[name].table);
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_TABLE_NAME).addClass(Const.CLASS_HOVERABLE_TEXT);
            this.#select_data(this.#tables[name].header_name_element);
        }
    }

    #reset_panel() {
        this.#model_key = null;
        this.#data_tree = [];
        this.#current_model = {};
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
                    let name = query[Const.NAME_ID];
                    this.#generate_nok();
                    // this.#generate_both_trends();
                    this.#create_results_tree(name);
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
            // this.#results_dd = new Dropdown(dd_control, items);

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
            $(PanelPatterns.ELEMENT_PATTERNS_RESULTS_EXPLORER_TREND_BULL).on('click', e => this.#set_trend_bull($(e.target).attr('name')));

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

            this.#visual_selection_dd = new Dropdown($(PanelPatterns.ELEMENT_PATTERNS_RESULTS_SELECTED), []);

            $(PanelPatterns.MENU_ICON).prop('title', PanelPatterns.TITLE);
        }
        catch(error) {
            console.error("PanelPatterns init error: ", error);
        }
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    get trend() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.TREND_ID];
        return null;
    }

    set trend(s) {
        if(this.#current_name)
            if(this.#explorer[this.#current_name])
                this.#explorer[this.#current_name][Const.TREND_ID] = s;
    }

    get result() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.RESULTS_ID];
        return null;
    }

    set result(r) {
        if(this.#current_name) {
            this.#explorer[this.#current_name][Const.RESULTS_ID] = r;
        }
    }

    get current() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend];
        return null;
    }

    set current(val) {
        if(this.#current_name) {
            if(val == null) {
                this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = 0;
            }
            // else if(this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] < this.#explorer[this.#current_name][this.result][this.trend]) {
            else if( (val <= this.#explorer[this.#current_name][this.result][this.trend])
                    && (val >= 0) ) {
                this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = val;
            }
            // else {
                // this.#explorer[this.#current_name][Const.CURRENT_ID][this.result][this.trend] = this.#explorer[this.#current_name][this.result][this.trend];
            // }
        }
    }

    get ok() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.OK_ID][this.trend];
        return null;
    }

    get nok() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][Const.BAD_ID][this.trend];
        return null;
    }

    get_total_results_selected() {
        if(this.#current_name)
            return this.#explorer[this.#current_name][this.result][this.trend];
        return null;
    }

    get level() { return (this.#level > 0) ? (this.#level - 1) : this.#level; }

    set level(level) { this.#level = level; }

    /*
        dataType: Const.RETRACEMENTS_ID
        data_y: [ [time, price], [time, price], [time, price]]
        data_ret: [ [time, price] , ret]
        trend: Const.BULL_ID or Const.BEAR_ID
        data.id: name + [_BULL_ or _BEAR_] + index
    */
   //TODO GENERAR TENDENCIA 'AMBOS' ORDENANDO CON MAP LOS MOVIMIENTOS Y LOS RETROCESOS
    get current_match() {
        if(this.#current_name) {
            let trend_name = (this.trend == Const.BULL_ID) ? '_BULL_' : '_BEAR_';
            let id = this.#model_key + trend_name + this.current;
            let data = {
                dataType: Const.RETRACEMENTS_ID,
                data_y: [this.#current_model[this.#current_name].data_y[this.trend][this.current]],
                data_ret: [this.#current_model[this.#current_name].data_ret[this.trend][this.current]],
                trend: this.trend,
                id: id,
                idx: this.current,
            };
            return data;
        }
        return null;
    }

    get query() { return this.#query; }
    set query(query) { this.#query = query; }
}