/**file: chart_controller.js */

class ChartController {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static EVENT_ENABLE_KEYS = 'enable-keys';
    static EVENT_DISABLE_KEYS = 'disable-keys';
    static EVENT_KEYUP = 'event-keyup';
    static EVENT_KEYDOWN = 'event-keydown';
    static EVENT_RX_HISTORICAL = 'event-rx-historical';
    static EVENT_ADD_CHART = 'event-add-chart';
    static EVENT_DEL_CHART = 'event-del-chart';
    static EVENT_TIME_FRAME_CHANGED = 'event-time-frame-changed';

    static LAYOUT_LEFT = 0;
    static LAYOUT_RIGHT = 1;
    static LAYOUT_UP = -1;
    static LAYOUT_ON_ROW = 0;
    static LAYOUT_DOWN = 1;

    static DEFAULT_CHART_ZOOM = 500;//250;

    static CHARTS_FRAMES_PARENT = '#chart-frames';
    static CLASS_CHART_LAYOUT = 'chart-frame-layout';
    static CLASS_CHART_BORDER = 'chart-border';
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

    static TRASH_MAX_SIZE = 100;

    //Default value
    static DEFAULT_ACTIVE = {
        [Const.ID_ID]:'BTCUSDT',
        [Const.BROKER_ID]:'binance',
        [Const.TIME_FRAME_ID]:'2h',
    }

    //----------------------------- PROPERTIES -----------------------------

    // Models
    #EVENT_SOURCE = {};
    #MENUS_ICON_GRAPHIC = {};
    #models = {};
    #chart_models = {};
    patterns_dao;
    templates_dao;
    keysDao;
    keyManager;
    #trash = [];
    selected = [];
    // View
    #view;
    //Brokers manager
    #brokers;
    // Ticker filter
    #ticker_filter;
    // Time frame
    #time_frame;
    // Chart layout structure as array
    #chartFrames = {};
    // Number of chart frames
    #n_frames = 1;
    #chart_layout = [];
    // Active chart
    #activeChartId = 0;
    // Interface TSQL Controller
    interface;
    interface_ddbb;
    session_info;
    user;
    login_timestamp;

    #menus = [];
    #key_config;
    #control_settings;
    #patterns_cb;
    #TSQL = TSQL_node;

    persistMode = false; // Persist last tool enabled
    magnetMode = false; // Magnet mode (jumps to closest price value)
    
    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
        this.#patterns_cb = {
            [Const.RETROCESOS_ID]: this.#process_patterns_ret,
            [Const.MOVIMIENTOS_ID]: this.#process_patterns_mov,
            [Const.TENDENCIA_ID]: this.#process_patterns_trend,
            [Const.SIGUIENTE_ID]: this.#process_patterns_next,
        }

        Conf.GRAPHIC_CONTROLS = {
            [Fibonacci.NAME]: MenuFibonacci,
            [TrendLine.NAME]: MenuTrendLine,
            [RectangleGraphic.NAME]: MenuRectangleGraphic,
            [CircleGraphic.NAME]: MenuCircleGraphic,
            [AlertComponent.NAME]: MenuAlertComponent,
        }
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #update_chart_header(chartInfo) {
        let active = chartInfo.active;
        if(active) {
            // $(ChartController.ELEMENT_CHART_TITLE + chartInfo.id).text(active[Const.ID_ID] + ' (' + active[Const.BROKER_ID] + ')');
        }
        // $(document).trigger(ChartController.EVENT_TIME_FRAME_CHANGED, this.#time_frame.time_frame);
        if($(ChartController.ELEMENT_TIME_FRAME +  chartInfo.id).length > 0) {
            $(ChartController.ELEMENT_TIME_FRAME +  chartInfo.id).data('Dropdown').selected = active[Const.TIME_FRAME_ID];
        }
    }

    #process_patterns_ret(ops, that) {
        return new Promise((resolve, reject) => {
            // let modelKey = that.activeChart.modelKey; // TODO XXX PASAR CHART
            let modelKey = ops.modelKey;
            // let result = that.#chart_models[modelKey].getPatternResult(ops[Const.ID_ID]);
            let result = that.#models[modelKey][Const.PATTERN_RESULTS_ID][ops[Const.ID_ID]];
            let in_memory = false;
            // If result exists, check same parameters and values in query
            if(result) {
                in_memory = true;
                let old_q = Object.keys(result.query);
                let new_q = Object.keys(ops);
                if(old_q.length == new_q.length) {
                    old_q.forEach(k => {
                        in_memory &= (new_q.indexOf(k) != -1);
                        in_memory &= (result.query[k] == ops[k]);
                    });
                }
                else in_memory = false;
            }

            if(in_memory) {
                resolve(result);
            }
            else {
                try {
                    // ops[Const.DATA_ID] = that.#models[modelKey][Const.MOVS_ID]; //[level];
                    ops[Const.MODEL_ID] = that.#models[modelKey];
                    ops[Const.PATTERNS_ID] = that.#models[Const.PATTERNS_ID];
                    // Process recursively all parent results
                    // let ret = Retracements.process(ops);

                    let ops2 = JSON.parse(JSON.stringify(ops));
                    // Process all parent dependant results for request
                    // let resultsTree = RetracementsAnalysis.getFamilyRequestTree({request: ops2, model: that.#models});
                    let resultsTree = RetracementsAnalysis.getFamilyRequestTree({request: ops2, results: that.#models[ops.modelKey], patterns: that.#models.patterns});
                    Object.values(resultsTree).forEach( (request) => {
                        let ra = new RetracementsAnalysis();
                        let retb = ra.process({request, model: that.#models});
                        // Stores result in model
                        that.#models[modelKey].patternResults[retb.ID] = retb;
                    });
                    // let ra = new RetracementsAnalysis();
                    // let retb = ra.process({request: ops2, model: that.#models});
                    // let retb = ra.process({request: ops2, model: that.#models[modelKey], patterns: that.#models[Const.PATTERNS_ID]});

                    //TODO MOVER PATTERN RESULT DE #chart_models A #models
                    // that.#models[modelKey][Const.PATTERN_RESULTS_ID][ops[Const.ID_ID]] = ret;
                    // Store retracements results
                    // ops[Const.DATA_ID] = ret;

                    // if(!ret.error) resolve(ret);
                    // if(!ret.error) resolve(retb);
                    // else reject(`${ret.error}`);
                    resolve();
                }
                catch(err) {
                    // reject(`ERROR processing retracements: ${err}`);
                    reject(`${err}`);
                }
                // that.load_movements(modelKey, ops[Const.NIVEL_ID], that.#menus[MenuMovs.NAME].level_max)
                // .then( () => that.interface.select_movements(modelKey, ops[Const.NIVEL_ID]))
                // .then(() => that.load_retracements(ops))
                // .then( data => resolve(data))
                // .catch( error => reject(error));
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
// TODO SOLO CARGAR EL HISTORICO EN EL FRAME INDICADO, CREAR FRAME AFUERA
    eventLoadHistoric(chartInfo) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.eventLoadHistoricAsync(chartInfo)), 0);
        });
    }

    eventLoadHistoricAsync(chartInfo) {
        let clearChart = false;

        // Deletes chart and graphic controls
        try {
            // Stops web socket data update, if exists, and deletes model information
            if(chartInfo.prevModelKey && chartInfo.prevActive) {
                this.#brokers.brokers[chartInfo.prevActive[Const.BROKER_ID]]
                .closeWebSocket({id: chartInfo.prevModelKey});

                delete this.#models[chartInfo.prevModelKey];
            }

            let seriesToDel = [];
            // If active changed in this frame, delete previous plots
            if(chartInfo.prevActive) {
                if(chartInfo.prevActive[Const.ID_ID] != chartInfo.active[Const.ID_ID]) {
                    seriesToDel = Object.keys(this.#view.chart_tree[chartInfo.chart.id][Const.GRAPHICS_ID]);
                    this.#view.chart_tree[chartInfo.chart.id][Const.GRAPHICS_ID] = {};
                }
                seriesToDel.push(chartInfo.prevActive[Const.ID_ID]);
            }
            if(seriesToDel.length) {
                this.#view.clear_chart(chartInfo.chart, seriesToDel);
            }
        }
        catch(err) { /* If not exists, chart tree creation is managed in later chart creation. */ }

        // Replace with new active settigns
        clearChart = true;
        
        if(Object.keys(chartInfo.active).length == 0) {
            let errMsg = 'ERROR: activo no especificado.';
            console.error(errMsg);
            this.writeStatus({error: errMsg});
            return;
        }

        return new Promise( (resolve, reject) => {
            // Status notification
            this.writeStatus({info:'Cargando información del activo...', loading:1 });

            // Get initial date time
            let end_time = Time.now(Time.FORMAT_STR);
            // let init_time = Time.subtract_value(end_time, 100000, chartInfo.active[Const.TIME_FRAME_ID]).format(Time.FORMAT_STR);
            // let init_time = Time.subtract_value(end_time, 15000, chartInfo.active[Const.TIME_FRAME_ID]).format(Time.FORMAT_STR);
            let init_time = Time.subtract_value(end_time, 10000, chartInfo.active[Const.TIME_FRAME_ID]).format(Time.FORMAT_STR);
            // let init_time = Time.subtract_value(end_time, 150, chartInfo.active[Const.TIME_FRAME_ID]).format(Time.FORMAT_STR);

            let query = { [Const.ACTIVE_ID]:chartInfo.active[Const.ID_ID],
                        [Const.BROKER_ID]:chartInfo.active[Const.BROKER_ID],
                        [Const.TIME_FRAME_ID]:chartInfo.active[Const.TIME_FRAME_ID],
                        [Const.START_TIME_ID]:init_time, // + this.#TSQL.PARAM_SEPARATOR + end_time,
            };

            // Updates time frame dropdown and chart title
            try { this.#update_chart_header(chartInfo); }
            catch(err) { console.error(err); }

            // Plot chart
            this.plotHistorical({query, chart: chartInfo.chart, modelKey: chartInfo.modelKey, clear: clearChart, zoom: chartInfo.zoom})
            .then(() => {
                // Updates menu movs options
                this.#menus[MenuMovs.NAME].update_active(chartInfo.active, chartInfo.id);
                
                //TODO GUARDAR MODELO DE DATOS FUENTE, NO SOLO 'CHART MODEL'
                if(!this.#models[chartInfo.modelKey]) this.#models[chartInfo.modelKey] = new DataModel();
                this.#models[chartInfo.modelKey][Const.MOVS_ID] = new Movements(this.#chart_models[chartInfo.modelKey].ohlc, this.#menus[MenuMovs.NAME].level_max, chartInfo.modelKey);

                console.time('Split movs');
                let ret = this.#chart_models[chartInfo.modelKey].split_movements_data(this.#models[chartInfo.modelKey][Const.MOVS_ID]);
                console.timeEnd('Split movs');
                
                this.writeStatus({info:'Movimientos cargados.', timeout: 2500});
                $(MenuMovs.MENU_ICON).removeClass(Const.CLASS_DISABLED);

                //Update graphic controls for time frame changes
                let graphics = Object.values(this.#view.chart_tree[chartInfo.chart.id][Const.GRAPHICS_ID]);
                if(graphics.length) {
                    graphics.forEach(g => g.setTimeFrame(chartInfo.active[Const.TIME_FRAME_ID]));
                }

                // this.addChartSelector({id: chartInfo.id, chart: chartInfo.chart});
                this.createActiveStream(chartInfo);
                resolve(chartInfo.active);
            })
            .catch( (err) => {
                let msg = 'Error cargando los datos del activo.';
                console.error(msg);
                reject(msg);
            });
        });
    }

    addChartSelector({id, chart}) {
        chart.setOption({
            series: [{
                id: id,
                name: id,
                type: 'custom',
                data: [0, 0],
                renderItem: (param, api) => {
                    let children = [{
                        type: 'rect',
                        id: id,
                        name: id,
                        invisible: true,
                        cursor: 'crosshair',
                        x: 0,
                        y: 0,
                        shape: {
                            width: api.getWidth(),
                            height: api.getHeight() ,
                        },
                        // style: { fill: 'rgba(255,0,0,0.5)', }
                    }];

                    let graphic = {
                        type: 'group',
                        id: id,
                        name: id,
                        cursor: 'crosshair',
                        children: children,
                        x: 0,
                        y: 0,
                        z: 120,
                    }

                    return graphic;
                },
            }]
        });
        chart.on('mousedown', { seriesId: id }, (e) => {
            this.selectChart({ id: e.seriesId });
        });
    }

    //----------------------------- EVENTS SET TIME FRAME -----------------------------

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
        
        if(!$._data(document, 'events')[ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL]) {
            $(document).on(ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL, (e, key) => {
                if(that.activeChart.chart) {
                    that.activeChart.chart.setOption(ChartView.CHART_ZOOM_X_ENABLED);
                }
                e.stopPropagation();
                e.preventDefault();
            });
        }

        if(!$._data(document, 'events')[ControlSettings.EVENT_CHART_ZOOM_VERTICAL]) {
            $(document).on(ControlSettings.EVENT_CHART_ZOOM_VERTICAL, (e, key) => {
                let data_zoom = that.get_chart_option('dataZoom');
                let data_zoom_y = data_zoom.filter(dz => { if (dz) return dz.id == ChartView.DATA_ZOOM_Y_INSIDE_ID; });
                if(data_zoom_y.length == 0) {
                    that.activeChart.chart.setOption({ dataZoom: [ ChartView.DATA_ZOOM_Y_INSIDE ] });
                }
                that.activeChart.chart.setOption(ChartView.CHART_ZOOM_X_DISABLED);
                e.stopPropagation();
                e.preventDefault();
            });
        }

        if(!$._data(document, 'events')[ControlSettings.EVENT_CHART_ZOOM_VERTICAL_END]) {
            $(document).on(ControlSettings.EVENT_CHART_ZOOM_VERTICAL_END, (e, key) => {
                $(document).trigger(ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL);
                e.stopPropagation();
                e.preventDefault();
            });
        }
        
        if(!$._data(document, 'events')[ControlSettings.EVENT_CHART_WHEEL_MOVE]) {
            $(document).on(ControlSettings.EVENT_CHART_WHEEL_MOVE, (e, key) => that.activeChart.chart.setOption(ChartView.CHART_ZOOM_X_DISABLED));
        }

        if(!$._data(document, 'events')[ControlSettings.EVENT_CHART_WHEEL_MOVE_END]) {
            $(document).on(ControlSettings.EVENT_CHART_WHEEL_MOVE_END, (e, key) => $(document).trigger(ControlSettings.EVENT_CHART_ZOOM_HORIZONTAL));
        }
        
        if(!$._data(document, 'events')[ControlSettings.EVENT_CHART_AUTO_SCALE]) {
            $(document).on(ControlSettings.EVENT_CHART_AUTO_SCALE, (e, key) => {
                //TODO HAY QUE GUARDAR LA CONF DE ZOOM COMPLETA EN CTES, Y QUITAR LA PARTE DE ZOOM Y (yAxisIndex) PARA QUE HAGA AUTOSCALE EN Y
                console.log('AUTOSCALE');
                let modelKey = this.activeChart.modelKey;
                let y_max = Math.max(... that.#chart_models[modelKey].ohlc.data_y.map(h => h[3]).filter(d => d!=undefined).filter(d => d!= NaN) );
                let y_min = Math.min(... that.#chart_models[modelKey].ohlc.data_y.map(h => h[3]).filter(d => d!=undefined).filter(d => d!= NaN) );
                that.activeChart.chart.setOption({ yAxis: { scale: true, min: y_min, max: y_max} });
                // that.activeChart.chart.setOption({ dataZoom: [ ChartView.DATA_ZOOM_X_INSIDE_FILTER/*, ChartView.DATA_ZOOM_X_SLIDER*/ ] }, { replaceMerge: ['dataZoom']} );
                that.activeChart.chart.setOption(ChartView.CHART_ZOOM_Y_DISABLED);
                console.log(that.get_chart_option('yAxis'));
                console.log(that.get_chart_option('dataZoom'));
            });
        }

        if(!$._data(document, 'events')[ChartController.EVENT_KEYUP]) {
            $(document).on(ChartController.EVENT_KEYUP, (e, key) => {
                let filter_visible = that.#ticker_filter.is_visible();
                let tframe_visible = that.#time_frame.is_visible();
                let all_closed = (!filter_visible) && (!tframe_visible);
                if(all_closed && (KeyCode.is_alpha(key.keyCode))) { $(document).trigger(TickerFilter.EVENT_ENABLE, key); }
                else if(all_closed && (KeyCode.is_num(key.keyCode))) { $(document).trigger(TimeFrame.EVENT_ENABLE, key); }
                //e.stopPropagation();
            });
        }

        if(!$._data(document, 'events')[ChartController.EVENT_ADD_CHART]) {
            $(document).on(ChartController.EVENT_ADD_CHART, (e, ops) => {
                console.log('EVENT_ADD_CHART');
                let id = this.createChart({place: {col:ChartController.LAYOUT_RIGHT, row: ChartController.LAYOUT_ON_ROW }});
                let prevActive = this.activeChart.active;
                this.selectChart({id})
                this.updateChartActive({
                    chartInfo: this.activeChart,
                    newActive: this.activeChart.active || prevActive,
                    zoom: {}
                });
                this.eventLoadHistoric(this.activeChart);
            });
        }

        if(!$._data(document, 'events')[ChartController.EVENT_DEL_CHART]) {
            $(document).on(ChartController.EVENT_DEL_CHART, (e, ops) => {
                console.log('EVENT_DEL_CHART');
                let id = this.activeChart.id;
                this.removeChart({id});
            });
        }

        $(document).on(ChartView.EVENT_SELECT_CHART, (e, id) => this.selectChart({id}));

    }

    #create_menus() {
        if(!this.#menus[MenuStatus.NAME]) { this.#menus[MenuStatus.NAME] = new MenuStatus(this); }
        if(!this.#menus[MenuMovs.NAME]) { this.#menus[MenuMovs.NAME] = new MenuMovs(); }
        if(!this.#menus[MenuPatterns.NAME]) { this.#menus[MenuPatterns.NAME] = new MenuPatterns(this.#models); }
        if(!this.#menus[MenuSettings.NAME]) { this.#menus[MenuSettings.NAME] = new MenuSettings(this); }
        if(!this.#menus[PanelPatterns.NAME]) { this.#menus[PanelPatterns.NAME] = new PanelPatterns(this.#models); }
        if(!this.#key_config) { this.#key_config = new KeyConfig(); }
        if(!this.#control_settings) { this.#control_settings = new ControlSettings(this.#key_config); }

        $(Const.ELEMENT_ID_PERSIST_MODE).on('click', (e) => {
            this.persistMode = !this.persistMode;
            $(e.target).toggleClass(Const.CLASS_SELECTED);
            // // Manages cancel operation
            // if(this.persistMode) { $(document).on(Const.EVENT_CLOSE, (e) => $(Const.ELEMENT_ID_PERSIST_MODE).trigger('click')); }
            // else { $(document).off(Const.EVENT_CLOSE); }
        });

        $(Const.ELEMENT_ID_MAGNET_MODE).on('click', (e) => {
            this.magnetMode = !this.magnetMode;
            $(e.target).toggleClass(Const.CLASS_SELECTED);
            let graphics = Object.values(this.#view.chart_tree[this.activeChart.chart.id][Const.GRAPHICS_ID]);
            if(graphics.length) {
                graphics.forEach(g => g.setMagnetMode(this.magnetMode));
            }
            // // Manages cancel operation
            // if(this.magnetMode) { $(document).on(Const.EVENT_CLOSE, (e) => $(Const.ELEMENT_ID_MAGNET_MODE).trigger('click')); }
            // else { $(document).off(Const.EVENT_CLOSE); }
        });


        // Creates graphic controls menus
        Conf.getGraphicControlsNames().forEach( g => {
            if(!this.#menus[g]) {
                let menuClass = Conf.getGraphicControlsMenu(g);
                this.#MENUS_ICON_GRAPHIC[g] = menuClass.MENU_ICON;
                this.#models.templates = this.#models.templates || {};
                this.#models.templates[g] = this.#models.templates[g] || {};
                this.#menus[g] = new menuClass(this.#models);
            }
        });
        
        // Declare create event
        $(document).on(ChartComponent.EVENT_CREATE, (e, graphicClass) => {
            // let conf = (this.#menus[graphicClass.NAME]) ? this.#menus[graphicClass.NAME].prev_template : {};
            let conf = (this.#menus[graphicClass.NAME]) ? this.#menus[graphicClass.NAME].template : {};
            conf = (conf.name && conf.name.length) ? conf : (this.#menus[graphicClass.NAME].prev_template || {});
            graphicClass.create({ chart: this.activeChart.chart, template: conf, timeFrame: this.activeChart.active[Const.TIME_FRAME_ID], magnetMode: this.magnetMode });
        });
        
        $(document).on(ChartComponent.EVENT_SELECTED, (e, params) => {
            let menuName = params.constructor.name;
            if(this.#menus[menuName]) {
                $(document).trigger(Const.EVENT_UPDATE_MODEL, [menuName]);
                this.#menus[menuName].show_float(params);
                if(this.selected.indexOf(params) === -1) {
                    this.selected.push(params);
                }
                this.keyManager.setContext({ context: [menuName], sub: [GraphicComponent.STATUS_SELECTED] })
            }
        });

        $(document).on(ChartComponent.EVENT_DOUBLE_CLICK, (e, params) => {
            let menuName = params.constructor.name;
            if(this.#menus[menuName]) {
                $(document).trigger(MenuChartGraphic.EVENT_OPEN_SETTINGS, [this.#menus[menuName].ref])
            }
        });

        $(document).on(ChartComponent.EVENT_UNSELECTED, (e, params) => {
            params = params || this.selected.at(-1);
            let menu_name = params.constructor.name;
            if(this.#menus[menu_name]) {
                // Removes from selected list
                let idx = this.selected.indexOf(params);
                if(idx != -1) {
                    this.selected.splice(idx, 1);
                }
                // If no more selections, hides menus
                if(this.selected.length == 0) {
                    this.#menus[menu_name].hide_float();
                    this.#menus[menu_name].hide();
                    this.keyManager.setContext({})
                    $(document).trigger(ChartController.EVENT_ENABLE_KEYS);
                }
            }
        });

        $(document).on(ChartComponent.EVENT_PLOT, (e, components) => {
            this.#view.draw_chart_component(components, this.activeChart.chart);
        });

        $(document).on(ChartComponent.EVENT_CREATED, (e, type, param) => {
            if((!this.persistMode) || (param == Const.EVENT_CANCELED)) {
                let icon = this.#MENUS_ICON_GRAPHIC[type];
                if(icon) {
                    $(icon).removeClass(Const.CLASS_SELECTED);
                }
                $(document).trigger(ChartController.EVENT_ENABLE_KEYS);
            }
            else {
                let graphicClass = eval(type);
                let conf = (this.#menus[graphicClass.NAME]) ? this.#menus[graphicClass.NAME].prev_template : {};
                graphicClass.create({ chart: this.activeChart.chart, template: conf, timeFrame: this.activeChart.active[Const.TIME_FRAME_ID], magnetMode: this.magnetMode });
            }
        });
            
        $(document).on(MenuChartGraphic.EVENT_OPEN_SETTINGS, (e, params) => {
            let menuName = params.constructor.name;
            this.keyManager.setContext({ context: [menuName], sub: [ChartComponent.STATUS_EDITING] })
            if(this.#menus[menuName]) {
                $(document).trigger(ChartController.EVENT_DISABLE_KEYS);
                this.#menus[menuName].show(params);
            }
        });

        $(document).on(MenuChartGraphic.EVENT_MENU_CLOSE, (e, params) => {
            let menuName = params;
            this.keyManager.setContext({ context: [menuName], sub: [ChartComponent.STATUS_SELECTED] })
        });

        $(document).on(MenuChartGraphic.EVENT_REMOVE, (e, graphic) => {
            graphic = graphic || this.selected.at(-1);
            this.keyManager.setContext({});
            this.throw_trash(graphic, MenuChartGraphic.EVENT_REMOVE);
            this.#view.clear_chart(this.activeChart.chart, [graphic[Const.ID_ID]]);
        });
    }

    #init_interfaces() {
        // Creates interface with TSQL scripting
        this.interface = new InterfaceTSQL(Const.ROOT_URL);
        this.interface_ddbb = new InterfaceDDBB(Const.ROOT_URL, this.user, this.login_timestamp);
    }

    #init_brokers() {
        return new Promise((resolve, reject) => {
            // Load from server, available brokers and tickers
            this.interface.get_brokers()
            .then( brokers_info => {
                // var brokers = new Brokers(brokers_info);
                // resolve(brokers);
                var broker_clients = {};
                var tickersLoad = [];
                brokers_info.forEach(broker => {
                    try {
                        let first = broker[0].toUpperCase();
                        let brokerName = first + broker.substring(1);
                        let brokerClass = eval(brokerName);
                        broker_clients[broker] = new brokerClass();
                        tickersLoad.push(broker_clients[broker].getTickers());
                    }
                    catch(error) {
                        console.error(`Error creating broker client ${broker}: ${error}`);
                    }
                });
                Promise.allSettled(tickersLoad)
                .then(tickers => {
                    this.writeStatus({info:'Completada Carga de Tickers desde los brokers.'});
                    console.log('Completada Carga de Tickers desde los brokers.');
                    var brokers = new Brokers(broker_clients);
                    resolve(brokers);
                });
            })
            .catch(error => {
                this.writeStatus({error:'(!) Errores cargando tickers desde los brokers: ' + error});
                console.error(error);
                reject(error);
            });
        });
    }

    // TODO PASAR A LOS MENUS EL OBJETO DAO? LA SUSCRIPCION A EVENTOS EN EL CONTROLADOR, SERIA CON FINES DE NOTIFICACION A USUARIO
    #init_events_models() {
        // $(document).on(DDBB.EVENT_DDBB_LOAD_USER_MODEL, (e) => {
        //     this.templates_dao.load()
        //     .then(res => $(document).trigger(DDBB.EVENT_UPDATE_MODEL))
        //     .catch(error => this.writeStatus( { error: error, timeout: 5000 })})
        //     .finally(() => $(document).trigger(Const.EVENT_UPDATE_MODEL, source));
        // });

        $(document).on(Const.EVENT_DDBB_DELETE_MODEL, (e, source, model_name) => {
            let source_info = this.#EVENT_SOURCE[source];
            let dao = source_info[0];
            let source_name = source_info[1];
            if(dao != undefined) {
                dao.delete(model_name)
                .then(res => this.writeStatus({info: `${source_name} ${model_name[Const.NAME_ID]} eliminada.`, timeout: 5000}))
                .catch(error => {this.writeStatus({error: error, timeout: 5000})})
                .finally(() => $(document).trigger(Const.EVENT_UPDATE_MODEL, source));
            }
            else {
                this.writeStatus({error: `ERROR eliminando modelo, fuente "${source}" desconocida.`, timeout: 5000});
            }
        });

        $(document).on(Const.EVENT_DDBB_SAVE_MODEL, (e, source, info) => {
            let source_info = this.#EVENT_SOURCE[source];
            let dao = source_info[0];
            let source_name = source_info[1];
            if(dao != undefined) {
                dao.save(info)
                .then(res => this.writeStatus({info: `${source_name} ${info.ID || info.name} guardada.`, timeout: 5000}))
                .catch(error => this.writeStatus({error: error, timeout: 5000}))
                .finally(() => $(document).trigger(Const.EVENT_UPDATE_MODEL, [source]));
            }
            else {
                this.writeStatus({error: `ERROR guardando modelo, fuente "${source}" desconocida.`, timeout: 5000});
            }
        });
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init(user, login_timestamp, view) {
        var that = this;
        this.user = user;
        this.login_timestamp =login_timestamp;

        try {
            // Init interfaces to decouple data access with server
            this.#init_interfaces();
            
            // Create patterns model
            this.patterns_dao = new PatternsDAO(this.interface_ddbb, this.#models);
            this.#EVENT_SOURCE[MenuPatterns.NAME] = [this.patterns_dao, MenuPatterns.TITLE];
            
            // Create templates model
            this.templates_dao = new TemplatesDAO(this.interface_ddbb, this.#models);
            this.#EVENT_SOURCE[Fibonacci.NAME] = [this.templates_dao, MenuFibonacci.TITLE];
            this.#EVENT_SOURCE[TrendLine.NAME] = [this.templates_dao, MenuTrendLine.TITLE];
            this.#EVENT_SOURCE[RectangleGraphic.NAME] = [this.templates_dao, MenuRectangleGraphic.TITLE];
            
            // Create keyboard configuration
            this.keysDao = new KeysDAO(this.interface_ddbb, this.#models);
            this.keyManager = new KeyManager(this.keysDao.models);

            // Creates all option menus
            this.#create_menus();

            // Init tickers filter
            this.#ticker_filter = new TickerFilter();

            // Creates view
            if (view) { this.#view = view; }
            else { this.#view = new ChartView(); }

            this.#time_frame = new TimeFrame();

            // Brokers manager
            let brokersAwait = $.Deferred();
            this.#init_brokers()
            .then(brokers => {
                this.#brokers = brokers;
                this.#ticker_filter.brokers = brokers;
                brokersAwait.resolve();
            })
            .catch(err => console.error(err));

            // Load last session
            $.when(brokersAwait).done( () => {
                console.log('Load last user session.');
                this.interface_ddbb.process({ user: this.interface_ddbb.user,
                                            login_timestamp: this.interface_ddbb.login_timestamp,
                                            query: DDBB.LOAD_SESSION,
                                            params: this.interface_ddbb.user })
                .then( res => {
                    console.log('Last session info:', res);
                    this.restoreSession(res);
                })
                .catch(err => console.error(err));
            });

            // Set autosave last session timer
            setInterval(this.saveSession.bind(this), Const.AUTOSAVE_SESSION_TIME);
            
            
            //TODO REVISAR EVENTOS QUE DEBE GESTIONAR ESTE CONTROLADOR - SEPARAR EVENTOS DE TECLADO -> MOVER AL CONTROLADOR DE TECLADO
            // Enables events managed by chart controller
            this.enable_events();

            // Handle enable keys events
            $(document).on(ChartController.EVENT_ENABLE_KEYS, function(e) {
                that.enable_events();
            });

            // Handle key events disabling
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
                    // that.#view.clear_chart(that.activeChart.chart, series_to_del);
                }
            });

            // Handles event Show movements
            //TODO REFACTORIZAR CONTENIDO A METODO
            $(document).on(MenuMovs.EVENT_SHOW_MOVEMENTS, (e, opt) => {
                console.log('CONTROLLER EVENT SHOW MOVEMENTS', e, opt);
                let modelKey = this.activeChart.modelKey;
                let series_to_del = [];
                if(that.#chart_models[modelKey].movs) {
                    series_to_del = Object.keys(that.#chart_models[modelKey].movs).map(k => that.#chart_models[modelKey].movs[k].id);
                }

                if(opt.active) {
                    try {
                        let id = opt[Const.ID_ID];
                        let level_max = opt[Const.MAXIMOS_ID][Const.NIVEL_ID];
                        let level_selected = opt[Const.NIVEL_ID];
                        console.log(level_max, that.#chart_models);
                        that.#view.clear_chart(that.activeChart.chart, series_to_del);
                        that.#view.plot_movements(this.#chart_models[id].movs[level_selected-1], that.activeChart.chart);
                        
                        // //TODO CONTROLAR LOS ERRORES, PARA DEVOLVER UN ERROR EN SECCION DE ESTADO, SI NO HAY DATOS DEL SERVIDOR, TAMBIEN CONTROLAR OTRAS VARIABLES COMO LEVEL_SELECTED, ETC
                        // that.load_movements(id, level_selected, level_max)
                        // .then(res => {
                        //     that.#view.clear_chart(that.activeChart.chart, series_to_del);
                        //     that.#view.plot_movements(res, that.activeChart.chart);
                        // })
                        // .catch( (error) => {
                        //     console.error('Error loading movements: ', error);
                        //     that.#view.clear_chart(that.activeChart.chart, series_to_del);
                        // });
                    }
                    catch(error) {
                        console.error('Error loading movements: ', error);
                        that.#view.clear_chart(that.activeChart.chart, series_to_del);
                    }
                }
                else {
                    that.#view.clear_chart(that.activeChart.chart, series_to_del);
                }
            });

            // Handles event Show Patterns results
            $(document).on(MenuPatterns.EVENT_SHOW_PATTERNS, function(e, query) {
                let start_time = 0;
                that.writeStatus({info:'Buscando coincidencias...', loading:1});
                query.modelKey = that.activeChart.modelKey;
                start_time = performance.now();
                if(that.#patterns_cb[query[Const.TIPO_PARAM_ID]]) {
                    that.#patterns_cb[query[Const.TIPO_PARAM_ID]](query, that)
                    .then( res => {
                        // that.writeStatus({clear: 1});
                        let end_time = performance.now();
                        let total_time = (end_time - start_time).toFixed(3);
                        console.log(`Pattern process time for ${query[Const.ID_ID]}: ${total_time}ms`);
                        that.writeStatus({info:`Tiempo de proceso total para ${query[Const.ID_ID]}: ${total_time}ms`, timeout:5000});
                        $(document).trigger(PanelPatterns.EVENT_PATTERNS_RESULTS_AVAILABLE, query);
                    })
                    .catch( err => {
                        // console.error('Error procesando patrones: ', err);
                        // that.writeStatus({error:['Error procesando patrones:', err], timeout:5000});
                        console.error(err);
                        that.writeStatus({error:[err], timeout:5000});
                    });
                }
                else {
                    that.writeStatus({error:'Error, tipo de patrón desconocido: ' + options[Const.TIPO_PARAM_ID], timeout:5000});
                }
            });

            // Handles event to plot Patterns results and explorer
            $(document).on(PanelPatterns.EVENT_PLOT_PATTERN, (e, pattern, visual_conf, query) => {
                let prev = visual_conf.prev_name;
                let zoom = visual_conf.zoom;

                let series_to_del = [];
                if(prev) series_to_del.push(...prev);
                // Forces deletion for previous plots (need to be here, data may be empty, and therefore won t enter in next forEach loop)
                that.#view.clear_chart(that.activeChart.chart, series_to_del);

                series_to_del = [];
                Object.keys(pattern).forEach(k => {
                    if(that.#models[this.activeChart.modelKey].patternResults[pattern[k][Const.ID_ID]].data[pattern[k].level]) {
                        series_to_del.push(that.#models[this.activeChart.modelKey].patternResults[pattern[k][Const.ID_ID]][Const.ID_ID]);
                    }
                });
                
                that.#view.clear_chart(that.activeChart.chart, series_to_del);

                // if(zoom) that.#view.zoom_chart(zoom, that.activeChart.chart);
                // let min = 0; // XXX
                // let max = 0;
                // if(zoom) { that.#view.zoomChart({zoom, chart: that.activeChart.chart, max, min}); }
                if(zoom) { that.#view.zoomChart({zoom, chart: that.activeChart.chart}); }

                let ret_plot = that.#view.format_retracements(pattern);
                that.#view.plot_retracements(ret_plot, that.activeChart.chart);
                // let fibo_ret = that.#view.format_fibo_retracement_data(pattern);
                // that.#view.draw_chart_component(ret_plot, fibo_ret, query, that.activeChart.chart);
                let fibos = [];
                Object.values(pattern).forEach(p => {
                    if(Object.keys(p[Const.DATA_ID]).length) {
                        Object.values(p[Const.DATA_ID][p[Const.LEVEL_ID]]).forEach(r => {
                            // fibos.push(new Fibonacci({ graphic:r, template:{ name:`${p[Const.ID_ID]}_${r[Const.TIMESTAMP_ID]}`, opacity: 0.1 }}) );
                            fibos.push(new Fibonacci({ graphic:r, template:{ name:`${p[Const.ID_ID]}`, opacity: 30 }, timeFrame: that.activeChart.active[Const.TIME_FRAME_ID]}) );
                        });
                    }
                });
                that.#view.draw_chart_component(fibos, that.activeChart.chart);
            });

            // Handles event to load candles historic
            $(document).on(TickerFilter.EVENT_LOAD_HISTORIC, (e, active) => {
                this.updateChartActive({chartInfo: this.activeChart, newActive: active, zoom: {}});
                this.eventLoadHistoric(this.activeChart);
            });

            // Handles event active chart time frame changed from keyboard
            $(document).on(TimeFrame.EVENT_TIME_FRAME_CHANGED, (e, timeFrame) =>  {
                if(this.activeChart.active.timeFrame && this.activeChart.active) {
                    if(this.activeChart.active.timeFrame != timeFrame) {
                        this.activeChart.zoom = this.adaptTimeZoom({chartInfo: this.activeChart, timeFrame});
                        this.updateChartTimeFrame(this.activeChart, timeFrame);
                        this.eventLoadHistoric(this.activeChart);
                    }
                }
            });

            $(document).on(ChartController.EVENT_TIME_FRAME_CHANGED, (e, timeFrame, id, el) => {
                if(this.#chartFrames[id]) {
                    if(this.#chartFrames[id].active.timeFrame != timeFrame) {
                        this.activeChart.zoom = this.adaptTimeZoom({chartInfo: this.activeChart, timeFrame});
                        this.updateChartTimeFrame(this.#chartFrames[id], timeFrame);
                        this.eventLoadHistoric(this.#chartFrames[id]);
                    }
                }
            });

            // $(document).on(ChartComponent.EVENT_UNSELECTED, (e) => this.#view.unselect({ chart: this.activeChart, items:[Const.WILDCARD] }) );

            $(document).on(ChartView.EVENT_MAXIMIZE_CHART, (e, id) => this.toggleMaximizeChart(id) );

            this.#init_events_models();
            console.log("Chart Controller Initialized OK.");
        }
        catch(error) {
            console.error("Chart Controller NOT Initialized: ", error);
        }
    }
    
    adaptTimeZoom({chartInfo, timeFrame}) {
        let zoom = chartInfo.zoom;
        let chart = chartInfo.chart;
        let { zoomX, zoomY } = this.getChartZoom(chart);
        if(zoom) {
            let xs = zoomX.startValue;
            let xe = zoomX.endValue;
            let tfs = Time.convertToSeconds(chartInfo.active.timeFrame) * Time.MS_IN_SECONDS;
            let nCandles = (xe-xs) / tfs;
            tfs = Time.convertToSeconds(timeFrame) * Time.MS_IN_SECONDS;
            xs = xe - (tfs * nCandles);
            
            let ys = zoomY.startValue;
            let ye = zoomY.endValue;
            if(isNaN(ys)) {
                ys = (chart._api.getCoordinateSystems()[0]._rect.y
                    + chart._api.getCoordinateSystems()[0]._rect.height);
                ys = chart.convertFromPixel(ys);
            }
            if(isNaN(ye)) {
                ye = chart.convertFromPixel(chart._api.getCoordinateSystems()[0]._rect.y)
            }
            zoom = {
                startValue: { x: xs, y: ys },
                endValue:   { x: xe, y: ye }
            }
        }
        return zoom;
    }

    // TRASH MANAGEMENT
    // TODO TRASH GUARDAR EN BBDD PARA RECUPERAR HISTORIAL
    throw_trash(item, op) {
        if(this.#trash.length > ChartController.TRASH_MAX_SIZE) {
            this.#trash.shift();
        }
        let garbage = {
            timestamp: new Date().valueOf(),
            item: item,
            operation: op
        };
        this.#trash.push(garbage);
    }

    backup_trash() {
        let backup = this.#trash.pop();
        // TODO TRASH TRATAR CADA ELEMENTO PARA APLICAR LA OPERACION INVERSA
        return backup;
    }

    //----------------------------- GETTERS SETTERS -----------------------------

    get models() { return this.#models; }

    get chart_models() { return this.#chart_models; }

    get_level_max(id) { return this.#chart_models[id].max.level_max; }
    
    get_level_selected(id) { return this.#chart_models[id].max.level_selected; }

    get view() { return this.#view; }

    get interface() { return this.interface; }

    set activeChart(chartInfo) {
        if(chartInfo.id) {
            this.updateChartActive({
                chartInfo: this.#chartFrames[chartInfo.id],
                newActive: chartInfo.active,
            });
        }
        this.#activeChartId = chartInfo.id;
    }

    get activeChart() { return this.#chartFrames[this.#activeChartId]; }
    
    get patterns() { return this.#chart_models.patterns; }

    get_chart_option(...options) {
        if(this.activeChart.chart) {
            let ops_str = '.' + options.join('.');
            ops_str = 'this.activeChart.chart.getOption()' + ops_str;
            let res = eval(ops_str);
            return res;
        }
        else {
            return null;
        }
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

    generate_model_key({active, chartId}) {
        let modelKey = KeyTicker(active) + chartId;
        return modelKey;
    }
    
    updateChartActive({chartInfo, newActive, zoom}) {
        chartInfo.prevModelKey = chartInfo.modelKey;
        chartInfo.prevActive = chartInfo.active;
        chartInfo.active = { ...chartInfo.active, ...newActive };
        if(zoom) { chartInfo.zoom = zoom; }
        if(Object.keys(chartInfo.active).length == 0) {
            chartInfo.active = undefined;
        }
        if(chartInfo.active) {
            chartInfo.modelKey = this.generate_model_key({active: chartInfo.active, chartId: chartInfo.chart.id});
        }
    }

    updateChartTimeFrame(chartInfo, timeFrame) {
        let newActive = JSON.parse(JSON.stringify(chartInfo.active));
        newActive[Const.TIME_FRAME_ID] = timeFrame;
        this.updateChartActive({chartInfo, newActive});
    }

    updateLayout() {
        let h = (100 / this.#chart_layout.length) + '%';
        this.#chart_layout.forEach( row => {
            let w = (100 / row) + '%';
            $('.'+ChartController.CLASS_CHART_LAYOUT).css({
                width: w,
                height: h,
                display: 'block'
            });
        });
            
        // Updates all charts sizes to new layout
        // Object.values(this.#chartFrames).forEach( cf => cf.chart.resize());
        $(window).trigger('resize');
    }

    addFrame({id, place}) {
        let row = 0;
        let frame = $('<div />',
                    { 'id':id, class: `${ChartController.CLASS_CHART_LAYOUT}` });
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
        this.updateLayout();
        // this.#chart_layout[row] += 1;
        // let w = (100 / this.#chart_layout[row]) + '%';
        // let h = (100 / this.#chart_layout.length) + '%';
        // $('.'+ChartController.CLASS_CHART_LAYOUT).css({
        //     'width': w,
        //     'height': h
        // });

        // // Updates all charts sizes to new layout
        // let charts = Object.keys(this.#chartFrames);
        // charts.forEach( c => this.#chartFrames[c].chart.resize());

        return frame;
    }

    toggleMaximizeChart(id) {
        // If more than 1 chart, maximized selected one
        if(Object.keys(this.#chartFrames).length > 1) {
            this.#chartFrames[id].maximized = !this.#chartFrames[id].maximized;
            if(this.#chartFrames[id].maximized) {
                let dispBkp = this.#chartFrames[id].frame.css('display');
                this.#chart_layout.forEach( () => {
                    $('.'+ChartController.CLASS_CHART_LAYOUT).css({ display: 'none' });
                });
                this.#chartFrames[id].frame.css({ display: dispBkp });
                $(window).trigger('resize');
            }
            else {
                this.updateLayout();
            }
        }
    }

    createChart({id, place}) {
        try {
            id = id || (this.#n_frames + '_' + Date.now());
            let frame = this.addFrame({id, place});
            let chart = this.#view.initChart({ id: id, frame: frame })
            this.#create_header({id, frame});

            // Stores chart information in array
            this.#chartFrames[id] = {
                id: id,
                num: this.#n_frames,
                frame: frame,
                chart: chart,
                zoom: {},
                maximized: false,
            };

            // Increase number of total frames
            this.#n_frames++;
            return id;
        }
        catch(error) {
            console.error('Error creating chart:', error);
        }
        return null;
    }

    removeChart({id}) {
        try {
            this.#chartFrames[id].chart.dispose();
            delete this.#chartFrames[id];
            let row = this.#chart_layout.length - 1;
            this.#chart_layout[row]--;
            this.updateLayout(row);
            $(window).trigger('resize');
        }
        catch(err) {
            console.error(`Error removing chart: ${err}`);
        }
    }

    selectChart({id}) {
        if(!this.activeChart) {
            this.activeChart = this.#chartFrames[id];
        }
        else if((this.#chartFrames[id]) && (id != this.activeChart.chart.id)) {
            let currentActiveFrame = this.#chartFrames[this.activeChart.chart.id].frame;
            $(currentActiveFrame).removeClass(ChartView.CLASS_CHART_SELECTED);
            this.activeChart = this.#chartFrames[id];
            $(this.#chartFrames[id].frame).addClass(ChartView.CLASS_CHART_SELECTED);
        }
    }

    #create_header({id, frame}) {
        let title_el = $('<div>', {
            id: ChartController.ID_CHART_TITLE + id,
            class: ChartController.CLASS_CHART_TITLE + ' ' + Const.CLASS_HOVERABLE_ICON,
        });

        frame.append(title_el);
        $(ChartController.ELEMENT_CHART_TITLE + id).on('click', e => {
            e.stopPropagation();
            $(document).trigger(TickerFilter.EVENT_ENABLE);
        });

        // this.#update_chart_header();

        let time_frame_el = $('<div>', {
            id: ChartController.TIME_FRAME_ID + id + '-container',
            class: ChartController.CLASS_CHART_TIME_FRAME,
        });
        // this.#chartFrames[id].frame.append(time_frame_el);
        frame.append(time_frame_el);

         //TODO PUEDE QUE LOS MARCOS TEMPORALES CAMBIEN DE UN BROKER A OTRO EN EL FUTURO
        let time_frame_dropdown = new Dropdown( {
                                                  id: ChartController.TIME_FRAME_ID + id,
                                                  items: Time.TIME_FRAMES,
                                                  event: ChartController.EVENT_TIME_FRAME_CHANGED,
                                                  header: { selected: true },
                                                  parent: frame
                                                });
                                                
        time_frame_dropdown.controls.each( (i, c) => time_frame_el.append(c) );

        // $(document).on(ChartController.EVENT_TIME_FRAME_CHANGED, (e, timeFrame, id, el) => {
        //     if(this.#chartFrames[id]) {
        //         this.updateChartTimeFrame(this.#chartFrames[id], timeFrame);
        //         this.eventLoadHistoric(this.#chartFrames[id]);
        //     }
        // });
    }

    zoomChartDefault(data, chart) {
        let price_arr_max = [];
        let dataFilt = data.data_y.filter(p => p[Const.IDX_CANDLE_OPEN]);
        dataFilt = (dataFilt.length > ChartController.DEFAULT_CHART_ZOOM)
                    ? dataFilt.splice( (dataFilt.length - ChartController.DEFAULT_CHART_ZOOM), dataFilt.length-1)
                    : dataFilt;
        let priceMin = Math.min(...dataFilt.map(v => v[Const.IDX_CANDLE_LOW]));
        let priceMax = Math.max(...dataFilt.map(v => v[Const.IDX_CANDLE_HIGH]));
        let dateMin = dataFilt[0][Const.IDX_CANDLE_TIME];
        let dateMax = dataFilt[dataFilt.length - 1][Const.IDX_CANDLE_TIME];
        let min = { x: data.data_y[0][Const.IDX_CANDLE_TIME] };
        let max = { x: data.data_y[data.data_y.length - 1][Const.IDX_CANDLE_TIME] };
        // dataFilt.map((p, i) => {
        //     if((i >= dataFilt.length-ChartController.DEFAULT_CHART_ZOOM) && (i <= dataFilt.length-1)) {
        //         price_arr_max.push(p[Const.IDX_CANDLE_HIGH]);
        //     }
        // });
        // let price_arr_min = [];
        // dataFilt.map((p, i) => {
        //     if((i >= dataFilt.length-ChartController.DEFAULT_CHART_ZOOM) && (i <= dataFilt.length-1)) {
        //         price_arr_min.push(p[Const.IDX_CANDLE_LOW]);
        //     }
        // });

        // let priceMin = Math.min(...price_arr_min);
        // let priceMax = Math.max(...price_arr_max);        
        // let offset_zoom = (dataFilt.length > ChartController.DEFAULT_CHART_ZOOM) ? ChartController.DEFAULT_CHART_ZOOM : dataFilt.length;
        // let dateMin = dataFilt[dataFilt.length - offset_zoom][Const.IDX_CANDLE_TIME]; //data.data_y[data.data_y.length-ChartController.DEFAULT_CHART_ZOOM][Const.IDX_CANDLE_TIME];
        // let dateMax = dataFilt[dataFilt.length - 1][Const.IDX_CANDLE_TIME]; //data.data_y[data.data_y.length-1][Const.IDX_CANDLE_TIME];
        let zoom = {
            startValue: {x: dateMin, y:priceMin},
            endValue: { x: dateMax, y:priceMax},
            // margin: {x: /*3.5*/5, y: 5}, //Margin values %
            margin: {x: 10, y: 10}, //Margin values %
        };
        if(zoom) {
            // this.#view.zoom_chart({data: data.data_y, zoom, chart});
            this.#view.zoomChart({zoom, chart, min, max});
        }
        return zoom;
    }

    loadHistorical({query, modelKey = null}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.loadHistoricalAsync({query, modelKey})), 0);
        });
    }

    loadHistoricalAsync({query, modelKey = null}) {
        return new Promise( (resolve, reject) => {
            console.time('historic');
            let id = query[Const.ACTIVE_ID];
            let broker = query[Const.BROKER_ID].toLowerCase();
            let timeFrame = query[Const.TIME_FRAME_ID];
            let startTime = query[Const.START_TIME_ID];
            let endTime = query[Const.END_TIME_ID];
            // this.interface.load_historical(request, false)
            this.#brokers.brokers[broker].getHistoric({ id, timeFrame, startTime, endTime })
            .then(rawData => {
                    let model = new ModelChart();
                    this.#chart_models[modelKey] = model;
                    this.#chart_models[modelKey].splitOhlcData({query:query, data: rawData});
                    // this.#chart_models[modelKey].split_ohlc_data(rawData);
                    console.timeEnd('historic');
                    resolve(this.#chart_models[modelKey].ohlc);
            })
            .catch( error => {
                console.timeEnd('historic');
                reject(error);
            });
        });
    }
    
    // createActiveStream(query, chart) {
    createActiveStream(chartInfo) {
        let query = chartInfo.active;
        let chart = chartInfo.chart;
        let broker = query[Const.BROKER_ID].toLowerCase();
        let id = chartInfo.modelKey;
        let active = query[Const.ID_ID];
        let timeFrame = query[Const.TIME_FRAME_ID];
        
        function updateCandles({id, data, time}) {
            let dataOhlc = this.#chart_models[id].splitOhlcData({ query, data, append: true });
            this.#view.updateCandles({ data: dataOhlc, chart });
            // setTimeout(() => this.#view.updatePriceCursor_({ query, data: dataOhlc, chart }), 10);
            setTimeout(() => this.#view.updatePriceCursor({ query, data: data.at(-1), time, chart }), 0);
        }
        this.#brokers.brokers[broker].openWebSocket({id, active, timeFrame, callback: updateCandles.bind(this)});
    }
    
    plotHistorical({query, chart, modelKey = null, clear=true, zoom}) {
        return new Promise( (resolve, reject) => {
            chart.showLoading(ChartView.SHOW_LOADING_OPS);
            this.loadHistorical({query, modelKey})
            .then( data => this.#view.plot_candles(data, chart, clear) )
            .then( data => this.#view.plotPriceCursor({query, data, chart}) )
            .then( data => {
                if(!zoom || !Object.keys(zoom).length) { this.zoomChartDefault(data, chart); }
                else { this.#view.zoomChart({zoom, chart})}
             })
            .then( data => chart.hideLoading())
            .then( data => resolve(data))
            .catch( data => {
                console.error('Error loading active:', data);
                this.writeStatus({info:'Error loading active: ' + JSON.stringify(data), timeout: 3000});
                reject(data);
            });
        });
    }

    writeStatus(content) {
        let status = this.#menus[MenuStatus.NAME];
        if(content != null) {
            if(content.loading) status.show_loading();
            else status.hide_loading();

            // if(content.timeout) setTimeout(() => { status.info = status.content; status.hide_loading() }, content.timeout);
            if(content.timeout) {
                setTimeout(() => {
                    status.content = '';
                    status.hide_loading()
                },
                content.timeout);
            }

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

    saveSession() {
        // Save current session
        let session = {};
        let resource = {};
        Object.keys(this.#chartFrames).forEach( ch => {
            // console.log(that.#chartFrames[ch]);
            session[ch] = {};
            let { zoomX, zoomY } = this.getChartZoom(this.#chartFrames[ch].chart);
            let startValue;
            let endValue;
            if(zoomX && zoomY) {
                startValue = { x: zoomX.startValue, y: zoomY.startValue };
                endValue = { x: zoomX.endValue, y: zoomY.endValue };
            }
            session[ch] = {
                active: this.#chartFrames[ch][Const.ACTIVE_ID],
                zoom: { startValue, endValue },
                tools: {
                    magnetMode: this.magnetMode,
                    persistMode: this.persistMode,
                }
            };
            resource[ch] = {};
            Object.keys(this.#view.chart_tree[ch][Const.GRAPHICS_ID]).forEach(g => {
                resource[ch][g] = this.#view.chart_tree[ch][Const.GRAPHICS_ID][g].serialize();
            });
        });
        
        session.layout = this.#chart_layout;
        this.interface_ddbb.process({ user: this.interface_ddbb.user,
                                        login_timestamp: this.interface_ddbb.login_timestamp,
                                        query: DDBB.SAVE_SESSION,
                                        params: JSON.stringify({ user: this.interface_ddbb.user, resources: /*JSON.stringify*/(resource), sessions: /*JSON.stringify*/(session) }) })
        .then( res => console.log(`Save session ${new Date().toLocaleString()} done.`))
        .catch(err => console.error(err));
    }

    getChartZoom(chart) {
        let zoomChart = chart.getOption().dataZoom;
        let zoomX = zoomChart.filter(dz => { if (dz) return dz.id == ChartView.DATA_ZOOM_X_INSIDE_ID; })[0];
        let zoomY = zoomChart.filter(dz => { if (dz) return dz.id == ChartView.DATA_ZOOM_Y_INSIDE_ID; })[0];
        return { zoomX, zoomY };
    }

    restoreSession(session) {
        let frames = {};
        let resources = {};

        try { frames = JSON.parse(session[0][0].session); }
        catch(error) { console.error(error);}

        try { resources = JSON.parse(session[0][0].resources); }
        catch(error) { console.error(error);}

        let layout = frames.layout;
        delete frames.layout;
        let framesId = Object.keys(frames);
        let loadResults = [];
        
        if(framesId.length) {
            framesId.forEach(id => {
                // TODO METODO GENRAL DE GESTION DE NUEVO CHART
                // TODO CREAR EL FRAME
                // TODO DETERNER WEB SOCKET SI ES NECESARIO (SI YA HAY ACTIVO EN FRAME CREADO)
                // TODO PROCESAR CARGA DE HISTORICO (AGREGAR ACTIVO EN this.#chartFrames[id_frame])
                // TODO AGREGAR MARCO AL FRAME
                // TODO CREAR WEB SOCKET
                this.createChart({id: id, place: { col: ChartController.LAYOUT_RIGHT, row: ChartController.LAYOUT_ON_ROW }});
                this.selectChart({id});
                this.updateChartActive({
                    chartInfo: this.activeChart,
                    newActive: frames[id].active || ChartController.DEFAULT_ACTIVE,
                });
                this.activeChart.zoom = frames[id].zoom;
                loadResults.push(this.eventLoadHistoric(this.activeChart));
                this.restoreTools(frames[id].tools);
            });
            
            Promise.allSettled(loadResults)
            .then(res => {
                Object.keys(resources).forEach(frameId => {
                    let graphicsSerialized = Object.values(resources[frameId]);
                    if(graphicsSerialized.length > 0) {
                        let graphics = [];
                        graphicsSerialized.forEach( g => {
                            try { graphics.push(ChartComponent.deserialize(g)); }
                            catch(error) { console.error(`Error deserializing graphic control: ${error}`); }
                        });
                        this.#view.draw_chart_component(graphics, this.#chartFrames[frameId].chart);
                        graphics.forEach( g => {
                            if(g.isSelected()) {
                                $(document).trigger(ChartComponent.EVENT_SELECTED, [g]);
                            }
                        });
                    }
                });
            })
            .catch(error => {
                let errMsg = `Error restoring preivous session: ${error}`;
                console.error(errMsg);
                this.writeStatus({error: errMsg});
            });
        }
        // If no session loaded
        else {
            let id = this.createChart({place: { col: ChartController.LAYOUT_RIGHT, row: ChartController.LAYOUT_ON_ROW }});
            this.selectChart({id});
            this.updateChartActive({
                chartInfo: this.activeChart,
                newActive: this.activeChart.active || ChartController.DEFAULT_ACTIVE,
            });
            loadResults.push(this.eventLoadHistoric(this.activeChart));
        }
    }

    restoreTools(tools) {
        if(tools) {
            if(tools.magnetMode) {
                this.magnetMode = !tools.magnetMode;
                $(Const.ELEMENT_ID_MAGNET_MODE).trigger('click');
            }
            if(tools.persistMode) {
                this.persistMode = !tools.persistMode;
                $(Const.ELEMENT_ID_PERSIST_MODE).trigger('click');
            }
        }
    }

}