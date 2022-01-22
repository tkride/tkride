/**file: chart_controller.js */

class ChartController {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static EVENT_ENABLE_KEYS = 'enable-keys';
    static EVENT_DISABLE_KEYS = 'disable-keys';
    static EVENT_KEYUP = 'event-keyup';
    static EVENT_KEYDOWN = 'event-keydown';
    static EVENT_RX_HISTORICAL = 'event-rx-historical';
    static EVENT_ADD_CHART = 'event-add-chart';
    static EVENT_TIME_FRAME_CHANGED = 'event-time-frame-changed';

    static LAYOUT_LEFT = 0;
    static LAYOUT_RIGHT = 1;
    static LAYOUT_UP = -1;
    static LAYOUT_ON_ROW = 0;
    static LAYOUT_DOWN = 1;

    static DEFAULT_CHART_ZOOM = 250;

    static CHARTS_FRAMES_PARENT = '#chart-frames';
    static CLASS_CHART_LAYOUT = 'chart-frame-layout';
    static FILTER_TITLE_TICKER = "Selecciona activo";
    static FILTER_TITLE_INTERVAL = "Selecciona intervalo";

    static ID_CHART_TITLE = 'chart-title-';
    static ELEMENT_CHART_TITLE = '#chart-title-';
    static CLASS_CHART_TITLE = 'chart-title';
    static CLASS_CHART_TIME_FRAME = 'chart-time-frame';
    static ELEMENT_CLASS_CHART_TIME_FRAME = '.chart-time-frame';
    static TIME_FRAME_ID = 'chart-time-frame-';
    static ELEMENT_TIME_FRAME = '#chart-time-frame-';
    static CHART_NEW_ROW = '<div class="chart-new-row"></div>';
    static CHART_NEW_COL = '<div class="chart-new-col"></div>';

    //----------------------------- PROPERTIES -----------------------------

    // Models
    #models = {};
    // #patterns = {};
    // View
    #view;
    // Chart layout structure as array
    #chart_frames = {};
    // Active chart
    #activeChart = null;
    //Number of chart frame
    #n_frames = 1;
    #chart_layout = [];
    // Working time frame
    // currentTimeFrame = Time.TIME_FRAMES[parseInt(Time.TIME_FRAMES.length/2)];
    // Working active
    currActive = null;
    currId = null;
    //Interface TQS Controller
    interface;
    //Ticker filter
    #ticker_filter;
    //Time frame
    #time_frame;
    #menus = [];
    #key_config;
    #control_settings;
    #patterns_cb;
    #TSQL = TSQL_node;
    
    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
        //Default value
        this.currActive = {
            [this.#TSQL.ID_ID]:'BTCUSDT',
            [this.#TSQL.BROKER_ID]:'BINANCE',
            [this.#TSQL.MARCO_ID]:'2h',
        };

        this.#patterns_cb = {
            [Const.RETROCESOS_ID]: this.#process_patterns_ret,
            [Const.MOVIMIENTOS_ID]: this.#process_patterns_mov,
            [Const.TENDENCIA_ID]: this.#process_patterns_trend,
            [Const.SIGUIENTE_ID]: this.#process_patterns_next,
        }
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #update_chart_header() {
        if(this.currActive) {
            $(ChartController.ELEMENT_CHART_TITLE + this.#activeChart.id).text(this.currActive[Const.ID_ID] + ' ' + this.currActive[Const.BROKER_ID]);
        }
        $(document).trigger(ChartController.EVENT_TIME_FRAME_CHANGED, this.#time_frame.time_frame);
    }

    #process_patterns_ret(ops, that) {
        return new Promise((resolve, reject) => {
            let model_key = that.current_model_key;
            let result = that.#models[model_key].get_pattern_result(ops[Const.NIVEL_ID], ops[Const.NAME_ID]);
            let in_memory = true;
            if(result) {
                let old_q = Object.keys(result.query);
                let new_q = Object.keys(ops);

                if(old_q.length == new_q.length) {
                    old_q.forEach(k => {
                        // Check same parameters in query 
                        in_memory &= (new_q.indexOf(k) != -1);
                        // Check same values in query parameters
                        in_memory &= (result.query[k] == ops[k]);
                    });
                }
                else in_memory = false;
            }
            else {
                in_memory = false;
            }

            if(in_memory) {
                resolve(result);
            }
            else {
                that.load_movements(model_key, ops[Const.NIVEL_ID], that.#menus[MenuMovs.NAME].level_max)
                .then( () => that.interface.select_movements(model_key, ops[Const.NIVEL_ID]))
                .then(() => that.load_retracements(ops))
                .then( data => resolve(data))
                .catch( error => reject(error));
            }
        });
    }

    #process_patterns_mov(ops, that) {

    }

    #process_patterns_trend(ops, that) {

    }

    #process_patterns_next(ops, that) {

    }

    
    //----------------------------- EVENTS LOAD HISTORIC -----------------------------

    event_load_historic(active, event_id) {
        var that = this;
        if(active) {
            this.currActive = active;
        }
        
        if(!this.#time_frame.time_frame) {
            console.error('Selecciona un marco temporal.');
            return;
        }
        
        if(!this.currActive) {
            console.error('Selecciona un activo.');
            this.write_status({error:'Selecciona un activo.'});
            return;
        }

        // this.write_status({progress:'Cargando información del activo...', value:0, max:1, loading:1 });
        this.write_status({info:'Cargando información del activo...', loading:1 });

        // Get initial date time
        let end_time = Time.now(Time.FORMAT_STR);
        this.currActive[this.#TSQL.MARCO_ID] = this.#time_frame.time_frame;
        let init_time = Time.subtract_value(end_time, 3000, this.currActive[this.#TSQL.MARCO_ID]).format(Time.FORMAT_STR);
        // let query = { [Const.ID_ID]:this.currActive[Const.ID_ID],
        //             [Const.BROKER_ID]:this.currActive[Const.BROKER_ID],
        //             [Const.MARCO_ID]:this.currActive[Const.MARCO_ID],
        //             [Const.INTERVALO_ID]:init_time + Const.PARAM_SEPARATOR + end_time,
        // };
        let query = { [this.#TSQL.ID_ID]:this.currActive[this.#TSQL.ID_ID],
                    [this.#TSQL.BROKER_ID]:this.currActive[this.#TSQL.BROKER_ID],
                    [this.#TSQL.MARCO_ID]:this.currActive[this.#TSQL.MARCO_ID],
                    [this.#TSQL.INTERVALO_ID]:init_time, // + this.#TSQL.PARAM_SEPARATOR + end_time,
        };

        if(this.#activeChart == null) {
            this.create_chart({ col: ChartController.LAYOUT_RIGHT, row: ChartController.LAYOUT_ON_ROW });
        }
        
        this.#update_chart_header();
        
        this.active_chart.showLoading(ChartView.SHOW_LOADING_OPS);
        this.plot_historical(query, this.active_chart, null, true)
        .then(() => {
            // Updates menu movs options
            this.#menus[MenuMovs.NAME].update_active(this.current_active, this.active_chart_id);
            
            // Loads max and movements data from server
            //TODO MENU MOVS VOLVER A CAMBIAR POR DEFECTO NIVEL 4
            let iter = [...Array(this.#menus[MenuMovs.NAME].level_max).keys()].map(i=>(i+1));
            let end = $.Deferred();
            this.loopPromise(iter, this.iterateMovs, end)
            .catch( error => console.error(error));

            $.when(end).done(() => {
                this.write_status({info:'Movimientos cargados.', timeout: 2500});
                $(MenuMovs.MENU_ICON).removeClass(Const.CLASS_DISABLED);
            });
            
            // Returns event or promise according to caller
            if(event_id) $(document).trigger(event_id);
            else return new Promise( resolve => resolve(this.currActive));
        })
        .catch( () => new Promise( (resolve, reject) => {
                                        let msg = 'Error cargando los datos del activo:' + (event_id) ? event_id : '';
                                        console.error(msg);
                                        reject(msg);
                                    })
        );
        // $(document).on(plot_event_id, e => { if(event_id) $(document).trigger(event_id); });
    }

    loopPromise(i, cb, end) {
        var that = this;
        return new Promise((resolve, reject) => {
            cb(i[0], that)
            .then( () => {
                i.splice(0,1);
                if(i.length == 0) { end.resolve(); resolve(); }
                else { that.loopPromise(i, cb, end); }
            })
            .then( () => resolve())
            .catch(error => reject(error));
        });
    }

    iterateMovs(i, that) {
        // let model_key = that.generate_model_key(that.currActive, that.#activeChart.id);
        let model_key = that.current_model_key;
        // that.write_status({progress:'Cargando información de movimientos...', value:i-1, max:that.#menus[MenuMovs.NAME].level_max, loading:1});
        that.write_status({info:'Cargando información de movimientos...', loading:1});
        // return that.load_movements(that.#menus[MenuMovs.NAME].id, i, that.#menus[MenuMovs.NAME].level_max)
        return that.load_movements(model_key, i, that.#menus[MenuMovs.NAME].level_max)
    }

    //----------------------------- EVENTS SET TIME FRAME -----------------------------

    set_time_frame(timeFrame) {
        this.#time_frame.time_frame = timeFrame;
        this.currActive[Const.MARCO_ID] = timeFrame;
    }

    bind_keys_time_frame(e) {
        var that = this;
        $(TimeFrame.ELEMENT_INPUT).keyup(function(e) {
            e.preventDefault();
            that.event_time_frame_key_up(e);
        });
        //Copies first char detected in main, lost otherwise
        $(TimeFrame.ELEMENT_INPUT).val(e.key);
        this.event_time_frame_key_up(e);
    }

    //----------------------------- EVENTS CONTROLLER -----------------------------

    enable_events() {
        var that = this;
        
        $(document).on(ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL, (e, key) => {
            if(that.active_chart) that.active_chart.setOption(ChartView.CHART_ZOOM_X_ENABLED);
        });

        $(document).on(ControlSettings.EVENT_CHART_ZOOM_VERTICAL, (e, key) => {
            let data_zoom = that.get_chart_option('dataZoom');
            let data_zoom_y = data_zoom.filter(dz => { if (dz) return dz.id == ChartView.DATA_ZOOM_Y_INSIDE_ID; });
            if(data_zoom_y.length == 0) {
                that.active_chart.setOption({ dataZoom: [ ChartView.DATA_ZOOM_Y_INSIDE ] });
            }
            that.active_chart.setOption(ChartView.CHART_ZOOM_X_DISABLED);
        });
        $(document).on(ControlSettings.EVENT_CHART_ZOOM_VERTICAL_END, (e, key) => $(document).trigger(ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL));
        
        $(document).on(ControlSettings.EVENT_CHART_WHEEL_MOVE, (e, key) => that.active_chart.setOption(ChartView.CHART_ZOOM_X_DISABLED));
        $(document).on(ControlSettings.EVENT_CHART_WHEEL_MOVE_END, (e, key) => $(document).trigger(ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL));
        
        $(document).on(ControlSettings.EVENT_CHART_AUTO_SCALE, (e, key) => {
            //TODO HAY QUE GUARDAR LA CONF DE ZOOM COMPLETA EN CTES, Y QUITAR LA PARTE DE ZOOM Y (yAxisIndex) PARA QUE HAGA AUTOSCALE EN Y
            console.log('AUTOSCALE');
            // var id = KeyTicker(that.current_active) + '_' + that.#activeChart.id;
            // let model_key = that.generate_model_key(that.currActive, that.#activeChart.id);
            let model_key = that.current_model_key;
            let y_max = Math.max(... that.#models[model_key].ohlc.data_y.map(h => h[3]).filter(d => d!=undefined).filter(d => d!= NaN) );
            let y_min = Math.min(... that.#models[model_key].ohlc.data_y.map(h => h[3]).filter(d => d!=undefined).filter(d => d!= NaN) );
            that.active_chart.setOption({ yAxis: { scale: true, min: y_min, max: y_max} });
            that.active_chart.setOption({ dataZoom: [ ChartView.DATA_ZOOM_X_INSIDE, ChartView.DATA_ZOOM_X_SLIDER ] }, { replaceMerge: ['dataZoom']} );
            console.log(that.get_chart_option('yAxis'));
            console.log(that.get_chart_option('dataZoom'));
        });

        $(document).on(ChartController.EVENT_KEYUP, (e, key) => {
            let filter_visible = that.#ticker_filter.is_visible();
            let tframe_visible = that.#time_frame.is_visible();
            let all_closed = (!filter_visible) && (!tframe_visible);
            if(all_closed && (KeyCode.is_alpha(key.keyCode))) { $(document).trigger(TickerFilter.EVENT_ENABLE, key); }
            else if(all_closed && (KeyCode.is_num(key.keyCode))) { $(document).trigger(TimeFrame.EVENT_ENABLE, key); }
            //e.stopPropagation();
        });

        $(document).on(ChartController.EVENT_ADD_CHART, (e, ops) => {
            console.log('EVENT_ADD_CHART');
            this.create_chart({col:ChartController.LAYOUT_RIGHT, row: ChartController.LAYOUT_ON_ROW });
            this.event_load_historic(this.currActive);
        });
    }

    #create_menus() {
        if(!this.#menus[MenuStatus.NAME]) { this.#menus[MenuStatus.NAME] = new MenuStatus(this); }
        if(!this.#menus[MenuMovs.NAME]) { this.#menus[MenuMovs.NAME] = new MenuMovs(); }
        // if(!this.#menus[MenuPatterns.NAME]) { this.#menus[MenuPatterns.NAME] = new MenuPatterns(this.#patterns); }
        if(!this.#menus[MenuPatterns.NAME]) { this.#menus[MenuPatterns.NAME] = new MenuPatterns(this.#models); }
        if(!this.#menus[MenuSettings.NAME]) { this.#menus[MenuSettings.NAME] = new MenuSettings(this); }
        if(!this.#menus[PanelPatterns.NAME]) { this.#menus[PanelPatterns.NAME] = new PanelPatterns(this.#models); }
        if(!this.#key_config) { this.#key_config = new KeyConfig(); }
        if(!this.#control_settings) { this.#control_settings = new ControlSettings(this.#key_config); }
    }

    #init_interfaces(headers) {
        this.interface = new InterfaceTQS(Const.ROOT_URL, headers);
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init(brokers_list, headers, view) {
        var that = this;

        try {
            // Create objects
            // this.#patterns = new ModelPatterns('', this.#models);
            new ModelPatterns('', this.#models);

            if (view) { this.#view = view; }
            else { this.#view = new ChartView(); }

            // this.#ticker_filter = new TickerFilter();
            this.#time_frame = new TimeFrame();

            this.#init_interfaces(headers);

            // Creates all option menus
            this.#create_menus();
        
            let brokers = new Brokers(brokers_list);
            $.each(brokers.get_brokers(), function(broker) {
                that.interface.load_all_tickers_from(broker)
                .then(tickers => brokers.set_tickers(broker, tickers))
                .catch( broker => that.write_status({error:'(!) Errors cargando tickers desde los brokers: ' + broker}) )
                .finally(resp => {
                    that.#ticker_filter = new TickerFilter();
                    that.#ticker_filter.brokers = brokers;
                    that.write_status({info:'Completada Carga de Tickers desde los brokers.'});
                });
            });

            this.enable_events();

            $(document).on(ChartController.EVENT_ENABLE_KEYS, function(e) {
                that.enable_events();
            });

            $(document).on(ChartController.EVENT_DISABLE_KEYS, function(e) {
                if($(TickerFilter.FILTER).is(':visible')) {
                    $(TickerFilter.FILTER).trigger(Const.EVENT_CLOSE);
                }
                if($(TimeFrame.PANEL).is(':visible')) {
                    $(TimeFrame.PANEL).trigger(Const.EVENT_CLOSE);
                }
                $(document).unbind(ChartController.EVENT_KEYUP);
            });

            // TODO SEPARAR LOS MARKPOINTS DONDE ESTAN LAS ETIQUETAS DE PLOT_MOVEMENTS, PARA MOSTRARLOS/ESCONDERLOS FACILMENTE (DEBEN ESTAR DENTRO DE LOS DATOS DE LINEA!)
            $(document).on(MenuMovs.EVENT_SHOW_MOVEMENTS_RETRACEMENTS, (e, show_rets) => {
                if(show_rets) { }
                else {
                    // let series_to_del = [];
                    // that.#view.clear_chart(that.active_chart, series_to_del);
                }
            });

            $(document).on(MenuMovs.EVENT_SHOW_MOVEMENTS, (e, opt) => {
                console.log('CONTROLLER EVENT SHOW MOVEMENTS', e, opt);
                // let model_key = that.generate_model_key(that.currActive, that.#activeChart.id);
                let model_key = that.current_model_key;
                let series_to_del = [];
                if(that.#models[model_key].movs) {
                    series_to_del = Object.keys(that.#models[model_key].movs).map(k => that.#models[model_key].movs[k].id);
                }

                if(opt.active) {
                    let id = opt[Const.ID_ID];
                    let level_max = opt[Const.MAXIMOS_ID][Const.NIVEL_ID];
                    let level_selected = opt[Const.NIVEL_ID];
                    console.log(level_max, that.#models);
//TODO CONTROLAR LOS ERRORES, PARA DEVOLVER UN ERROR EN SECCION DE ESTADO, SI NO HAY DATOS DEL SERVIDOR, TAMBIEN CONTROLAR OTRAS VARIABLES COMO LEVEL_SELECTED, ETC
                    that.load_movements(id, level_selected, level_max)
                    .then(res => {
                        that.#view.clear_chart(that.active_chart, series_to_del);
                        that.#view.plot_movements(res, that.active_chart);
                    })
                    .catch( (error) => {
                        console.error('Error loading movements: ', error);
                        that.#view.clear_chart(that.active_chart, series_to_del);
                    });
                }
                else {
                    that.#view.clear_chart(that.active_chart, series_to_del);
                }
            });

            $(document).on(MenuPatterns.EVENT_SHOW_PATTERNS, function(e, opt) {
                that.write_status({info:'Buscando coincidencias...', loading:1});
                opt.model_key = that.current_model_key;
                if(that.#patterns_cb[opt[Const.TIPO_PARAM_ID]]) {
                    that.#patterns_cb[opt[Const.TIPO_PARAM_ID]](opt, that)
                    .then( res => {
                        that.write_status({clear: 1});
                        $(document).trigger(PanelPatterns.EVENT_PATTERNS_RESULTS_AVAILABLE, opt);
                    })
                    .catch( err => {
                        console.error('Error procesando patrones: ', err);
                        that.write_status({error:['Error procesando patrones:', err], timeout:5000});
                    });
                }
                else {
                    that.write_status({error:'Error, tipo de patrón desconocido: ' + options[Const.TIPO_PARAM_ID], timeout:5000});
                }
            });

            $(document).on(PanelPatterns.EVENT_PLOT_PATTERN, (e, pattern, ops) => {
                // this.#view.plot_pattern(pattern, ops, this.active_chart);
                let prev = pattern.prev_name;
                delete pattern.prev_name;
                let zoom = pattern.zoom;
                delete pattern.zoom;

                let series_to_del = [];
                if(prev) series_to_del.push(prev);
                that.#view.clear_chart(that.active_chart, series_to_del);

                Object.keys(pattern).forEach(k => {
                    series_to_del = [];
                    if(that.#models[that.current_model_key].pattern_result[pattern[k].level][pattern[k].name]) {
                        series_to_del = [that.#models[that.current_model_key].pattern_result[pattern[k].level][pattern[k].name].id];
                    }
                    that.#view.clear_chart(that.active_chart, series_to_del);

                    if(zoom) that.#view.zoom_chart(zoom, that.active_chart);

                    that.#view.plot_retracements(pattern[k], that.active_chart);
                });
            });

            $(document).on(TickerFilter.EVENT_LOAD_HISTORIC, (e, active) => that.event_load_historic(active));

            // Time Frame header //TODO CAMBIAR
            // this.#build_header();

            console.log("Chart Controller Initialized OK.");
        }
        catch(error) {
            console.error("Chart Controller NOT Initialized: ", error);
        }
    }
    
    //----------------------------- GETTERS SETTERS -----------------------------

    get models() { return this.#models; }

    get current_model_key() { return this.generate_model_key(this.currActive, ''); } //this.#activeChart.id); }

    get_level_max(id) { return this.#models[id].max.level_max; }
    
    get_level_selected(id) { return this.#models[id].max.level_selected; }

    get view() { return this.#view; }

    get interface() { return this.interface; }

    get active_chart() { return this.#chart_frames[this.#activeChart.id].chart; }
    
    get active_chart_id() { return this.#activeChart.id; }

    get patterns() { return this.#models.patterns; }

    // set_active_chart(chart) { this.#activeChart = chart; }

    get_chart_option(...options) {
        if(this.active_chart) {
            let ops_str = '.' + options.join('.');
            ops_str = 'this.active_chart.getOption()' + ops_str;
            let res = eval(ops_str);
            return res;
        }
        else {
            return null;
        }
    }

    get current_active() { return this.currActive; }

    get current_active_desc() {
        let desc = this.currActive[Const.ID_ID];
        desc += ' ' + this.currActive[Const.MARCO_ID];
        desc += ' ' + this.currActive[Const.BROKER_ID];
        return desc;
    }

    get ticker_filter() { return this.#ticker_filter; }

    get time_frame() { return this.#time_frame; }

    get menus() { return this.#menus; }

    get key_config() { return this.#key_config; }

    get control_settings() { return this.#control_settings; }

    //----------------------------- INTERFACE METHODS -----------------------------
    send_query(query, cb, error=null, async=true, timeout, url) {
        this.interface.send_query(query, cb, error, async, timeout, url);
    }

    //----------------------------- CHART METHODS -----------------------------

    generate_model_key(active, chart_id) {
        let model_key = KeyTicker(active) + chart_id;
        return model_key;
    }
    
    generate_layout(place, id) {
        let row = 0;
        let frame = $('<div />',
                    { 'id':id, class: ChartController.CLASS_CHART_LAYOUT });
        if(place.row == ChartController.LAYOUT_DOWN) {
            this.#chart_layout.splice(0, 0, 0);
            $(ChartController.CHARTS_FRAMES_PARENT).append(ChartController.CHART_NEW_ROW);
            $(ChartController.CHARTS_FRAMES_PARENT).append(frame);
        }
        else if(place.row == ChartController.LAYOUT_UP) {
            this.#chart_layout.push(1);
            row = 1;
            $(ChartController.CHARTS_FRAMES_PARENT).prepend(ChartController.CHART_NEW_ROW);
            $(ChartController.CHARTS_FRAMES_PARENT).prepend(frame);
        }
        else {
            //TODO DEFINIR CREACION DINAMICA DEL LAYOUT BIEN
            if(this.#chart_layout.length == 0) {
                this.#chart_layout.push(0);
            }
            if(place.col == ChartController.LAYOUT_LEFT) {
                $(ChartController.CHARTS_FRAMES_PARENT).prepend(frame);
            }
            else if(place.col == ChartController.LAYOUT_RIGHT) {
                $(ChartController.CHARTS_FRAMES_PARENT).append(frame);
            }
        }
        
        this.#chart_layout[row] += 1;
        let w = (100 / this.#chart_layout[row]) + '%';
        let h = (100 / this.#chart_layout.length) + '%';
        $('.'+ChartController.CLASS_CHART_LAYOUT).css({
            'width': w,
            'height': h
        });

        // Updates all charts sizes to new layout
        let charts = Object.keys(this.#chart_frames);
        charts.forEach( c => this.#chart_frames[c].chart.resize());

        return frame;
    }

    create_chart(place) {
        var that = this;
        try {
            let id = this.#n_frames + '_' + Date.now();
            let frame = this.generate_layout(place, id);
            let chart = this.#view.create_chart(frame[0])
            let chart_info = { chart:chart, id: id, num:this.#n_frames, frame: frame }
            this.#chart_frames[id] = chart_info;
            this.#n_frames++;
            this.#activeChart = chart_info;
            this.#create_header();
            return this.#activeChart;
        }
        catch(error) {
            console.error('Error creating chart:', error);
        }
        return null;
    }

    #create_header() {
        let id = this.#activeChart.id;
        let title_el = $('<div>', {
            id: ChartController.ID_CHART_TITLE + id,
            class: ChartController.CLASS_CHART_TITLE + ' ' + Const.CLASS_HOVERABLE_ICON,
            // text: this.currActive[Const.ID_ID] + ' ' + this.currActive[Const.BROKER_ID],
        });

        this.#chart_frames[id].frame.append(title_el);
        $(ChartController.ELEMENT_CHART_TITLE + id).on('click', e => {
            e.stopPropagation();
            $(document).trigger(TickerFilter.EVENT_ENABLE);
        });

        this.#update_chart_header();

        let time_frame_el = $('<div>', {
            id: ChartController.TIME_FRAME_ID + id,
            class: ChartController.CLASS_CHART_TIME_FRAME + ' ' + Const.CLASS_HOVERABLE_ICON + ' ' + Const.CLASS_BUTTON_GENERAL,
        })
        .append('<p>' + this.#time_frame.time_frame + '</p>');

        this.#chart_frames[id].frame.append(time_frame_el);
         //TODO PUEDE QUE LOS MARCOS TEMPORALES CAMBIEN DE UN BROKER A OTRO EN EL FUTURO
        let time_frame_dropdown = new Dropdown(time_frame_el,
                                                    Time.TIME_FRAMES,
                                                    ChartController.EVENT_TIME_FRAME_CHANGED);

        $(document).on(ChartController.EVENT_TIME_FRAME_CHANGED, (e, txt, el) => {
            let time_frame = txt;
            // if(typeof el == 'string') time_frame = el;
            // else time_frame = $(el.target).text();
            $(ChartController.ELEMENT_TIME_FRAME +  this.#activeChart.id).find('p').text(time_frame);
            this.set_time_frame(time_frame);
        });

    }

    plot_candles(data, chart=null, clear=true) {
        if(chart == null) {
            chart = this.active_chart;
        }
        return this.#view.plot_candles(data, chart, clear);
    }

    zoom_chart_default(data) {
        let price_arr_max = [];
        let sub_data = data.data_y.filter(p => p[Const.IDX_CANDLE_OPEN] != undefined);
        sub_data.map((p, i) => {
            if((i >= sub_data.length-ChartController.DEFAULT_CHART_ZOOM) && (i <= sub_data.length-1)) {
                price_arr_max.push(p[Const.IDX_CANDLE_HIGH]);
            }
        });
        let price_arr_min = [];
        sub_data.map((p, i) => {
            if((i >= sub_data.length-ChartController.DEFAULT_CHART_ZOOM) && (i <= sub_data.length-1)) {
                price_arr_min.push(p[Const.IDX_CANDLE_LOW]);
            }
        });

        let priceMin = Math.min(...price_arr_min);
        let priceMax = Math.max(...price_arr_max);
        let dateMin = sub_data[sub_data.length - ChartController.DEFAULT_CHART_ZOOM][Const.IDX_CANDLE_TIME]; //data.data_y[data.data_y.length-ChartController.DEFAULT_CHART_ZOOM][Const.IDX_CANDLE_TIME];
        let dateMax = sub_data[sub_data.length - 1][Const.IDX_CANDLE_TIME]; //data.data_y[data.data_y.length-1][Const.IDX_CANDLE_TIME];
        let zoom = {
            startValue: {x: dateMin, y:priceMin},
            endValue: { x: dateMax, y:priceMax},
            margin: {x: 3.5, y: 1.5}, //Margin values %
        };
        if(zoom) {
            this.#view.zoom_chart(zoom, this.active_chart);
        }
    }

    load_historical(request, model_key = null) {
        var that = this;
        return new Promise( (resolve, reject) => {
            // model_key = this.generate_model_key(request, this.#activeChart.id);
            model_key = this.current_model_key;
console.time('historic');
            this.interface.load_historical(request, false)
            .then(rawData => {
                    let model = new ModelChart();
                    that.#models[model_key] = model;
                    that.#models[model_key].split_ohlc_data(rawData);
console.timeEnd('historic');
console.time('MaxRelative');
let start = performance.now();
let rmax = new MaxRelative(that.#models[model_key].ohlc, 3);
let end = performance.now();
let diff = end - start;
console.timeEnd('MaxRelative');
console.log('Max processing time (', rmax.length, ' for ', rmax.levels, ' levels) :', diff, 'ms');
                    resolve(that.#models[model_key].ohlc);
            })
            .catch( error => reject(error));
        });
    }
    
    plot_historical(request, chart, model_key = null, clear=true) {
        var that = this;
        return new Promise( (resolve, reject) => {
            this.load_historical(request, model_key)
            .then( data => that.plot_candles(data, chart, clear) )
            .then( data => that.zoom_chart_default(data) )
            .then( data => that.active_chart.hideLoading())
            .then( data => resolve(data))
            .catch( data => {
                console.error('Error loading active:', data);
                this.write_status({info:'Error loading active: ' + JSON.stringify(data), timeout: 3000});
                reject(data);
            });
        });
    }

    write_status(content) {
        let status = this.#menus[MenuStatus.NAME];
        if(content != null) {
            if(content.loading) status.show_loading();
            else status.hide_loading();

            if(content.timeout) setTimeout(() => { status.info = status.content; status.hide_loading() }, content.timeout);

            if(content.clear) { status.content = ''; }

            if(content.info != null) {
                status.info = content.info;
                // status.progress_hide();
            }
            else if(content.error != null) {
                status.error = content.error;
                // status.progress_hide();
            }
            // else if(content.progress != null) {
                // status.progress_show();
            //     status.content = content.progress;
            //     if(content.value != null) {
            //         status.progress_value = content.value;
            //     }
            //     if(content.max != null) {
            //         status.progress_max = content.max;
            //     }
            // }
        }
        
    }

    // INTERFACE METHODS
    // Load data from server

    select_data(request) {
        try {
            return this.interface.select_data(request);
        }
        catch(error) {
            throw('Error when select server data maximum:', error);
        }
    }

    select_maximum(model_key, level, level_max) {
        try {
            return new Promise( (resolve, reject) => {
                let data = $.Deferred();

                if(level > level_max) level_max = level;
                this.load_maximum(model_key, level_max)
                .then( max => data.resolve(max))
                .catch( error => data.reject(error));

                $.when(data)
                .done( max => {
                    this.interface.select_maximum(model_key, level)
                    .then( data => {
                        this.#models[model_key].max.level_selected = level;
                        resolve(data);
                    })
                    .catch( error => {
                        console.log('Error selecting max data:', error);
                        reject(error);
                    });
                })
                .catch( error => {
                    console.error('Error loading max data:', error);
                    reject(error);
                });
            });
        }
        catch(error) {
            throw('Error when select server data maximum:', error);
        }
    }

    load_maximum(model_key, level_max) {
        return new Promise( (resolve, reject) => {
            let max = $.Deferred();
            if(!model_key) model_key = this.generate_model_key(request, this.#activeChart.id);
            
            if((!this.#models[model_key].max) || (this.#models[model_key].max.level_max < level_max)) {
                this.interface.load_maximum(model_key, level_max)
                .then( rawData => {
                    if(rawData) {
                        this.#models[model_key].split_max_data(rawData);
                        console.log('LOAD_MAXIMUM DATA LOADED:', this.#models[model_key].max);
                        resolve(this.#models[model_key].max);
                    }
                })
                .catch( error => reject('Error loading max: ' + error));
            }
            else {
                max.resolve(this.#models[model_key].max);
            }

            $.when(max)
            .done( data => resolve(data))
            .catch( error => console.error('Error loading max:', error));
        });
    }

    load_movements(model_key, level, level_max) {
        return new Promise( (resolve, reject) => {
            let movs = $.Deferred();
            // if(!model_key) model_key = this.generate_model_key(request, this.#activeChart.id);
            if(!model_key) model_key = this.current_model_key;

            if( (!this.#models[model_key].movs) || (!Object.keys(this.#models[model_key].movs).includes(String(level))) ) {
            // if( (!this.#models[model_key].movs) || (!Object.keys(this.#models[model_key].movs).includes(parseInt(level))) ) {
                this.select_data(this.currActive)
                .then( () => this.select_maximum(model_key, level, level_max))
                .then( () => this.interface.load_movements(model_key, level))
                .then( rawData => {
                    let ret = this.#models[model_key].split_movements_data(rawData);
                    if(ret === 'string' ) reject(ret);
                    console.log(ret);
                    movs.resolve(ret);
                })
                .catch( error => {
                    console.log('Error loading movements:', error);
                    movs.reject(error);
                });
            }
            else {
                movs.resolve(this.#models[model_key].movs[level]);
            }

            $.when(movs)
            .done( data => resolve(data))
            .catch( error => reject(error));
        });
    }

    load_retracements(request, model_key) {
        return new Promise( (resolve, reject) => {
            if(request) {
                if(!model_key) model_key = this.current_model_key;
                request.model_key = model_key;
                
                // TODO XXX PARA GUARDAR EN MEMORIA, ACTUALMENTE HAY QUE DIFERENCIAR SOLO POR EL NOMBRE DEL RETROCESO, ...
                // HAY QUE AÑADIR MODEL KEY DELANTE, CUANDO SE ORGANICE EN JS NO HABRA PROBLEMAS
                let req = Object.assign({}, request);
                req[Const.ID_ID] = model_key + '_' + req[Const.ID_ID];
                if(req[Const.BUSCAR_EN_ID]) {
                    req[Const.BUSCAR_EN_ID] = model_key + '_' + req[Const.BUSCAR_EN_ID];
                }

                this.interface.load_retracements(req)
                .then( rawData => {
                    let ret = this.#models[request.model_key].split_retracements_data(rawData, request);
                    if(ret === 'string' ) reject(ret);
                    console.log(ret);
                    resolve(ret);
                });
            }
            else { reject('No request received.'); }
        });
    }

    // Plot methods
    plot_max(rawData, chart) {
        this.#view.plot_max(rawData, chart);
    }

    plot_movements(rawData, chart){
        this.#view.plot_movements(rawData, chart);
    }

    plot_retracements(rawData, chart){
        this.#view.plot_movements(rawData, chart);
    }

    //----------------------------- TIME FRAME METHODS -----------------------------

    // enables_time_frame_input(e) {
    //     // $("#chart-time-frame-panel").css('display', 'block');
    //     $("#chart-time-frame-panel").show();
    //     $(TimeFrame.INPUT).focus();
    //     this.bind_keys_time_frame(e);
    // }

    // disables_time_frame_input() {
    //     $(TimeFrame.INPUT).val('');
    //     // $("#chart-time-frame-panel").css('display', 'none');
    //     $("#chart-time-frame-panel").hide();
    //     $(TimeFrame.INPUT).unbind('keyup');
    //     // $(TimeFrame.INPUT).off();
    // }

    // is_time_frame_visible() {
    //     let res = ($("#chart-time-frame-panel").is(":visible"));
    //     return res;
    // }
    
    // is_ticker_filter_focused() {
    //     let res = $(TimeFrame.INPUT).is(":focus");
    //     return res;
    // }

}