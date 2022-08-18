/**file: chart_view.js */

class ChartView {

    // ----------------------------- STATIC, CONSTANTS -----------------------------

    static ELEMENT_ID_CHART_MAIN = '#chart-main';
    static ELEMENT_CLASS_FOOTER_MENU = '.footer-menu';

    // static CLASS_CHART_SELECTED = 'chart-selected';
    // static ELEMENT_CLASS_CHART_SELECTED = '.chart-selected';
    static CLASS_CHART_SELECTED = 'selected';
    static ELEMENT_CLASS_CHART_SELECTED = '.selected';
    static CHART_TOOLTIP_HEADER_DUMMY = '<p class="chart-tooltip-text" style="color: rgba(0,0,0,0);">';
    static CHART_TOOLTIP_TEXT = '<p class="chart-tooltip-text">';
    static P_CLOSE = '</p>';
    static CHART_TOOLTIP_VALUES = '<p class="chart-tooltip-values" style="';
    static VALUES_CLOSE = '">';
    static BACKGROUND_COLOR = 'var(--border-color)';//'#353535';
    static FONT_COLOR = 'var(--font-color)'; //: #b0b3bc;';

    static Z_AXIS_COMPONENS = 200;

    static TREND_TEXT_ID = { [Const.BULL_ID]: '_BULL_', [Const.BEAR_ID]: '_BEAR_', [Const.BOTH_ID]: '_BOTH_'};
    static LINE_COLOR = { [Const.BULL_ID]: 'rgba(0, 255, 0, 0.8)', [Const.BEAR_ID]: 'rgba(255, 0, 0, 0.8)', [Const.BOTH_ID]: 'rgba(181, 19, 187, 0.8)'};
    static MARK_TEXT_ID = { [Const.BULL_ID]: '_MARK_BULL_', [Const.BEAR_ID]: '_MARK_BEAR_', [Const.BOTH_ID]: '_MARK_BOTH_'};
    static MARK_OFFSET = { [Const.BULL_ID]: [0, -20], [Const.BEAR_ID]: [0, 30], [Const.BOTH_ID]: [0, 0]};
    static MARK_COLOR = { [Const.BULL_ID]: 'rgba(0, 255, 0, 1)', [Const.BEAR_ID]: 'rgba(255, 0, 0, 1)', [Const.BOTH_ID]: 'rgba(181, 19, 187, 1)'};

    static TRENDS = [ Const.BULL_ID, Const.BEAR_ID ]; //, Const.BOTH_ID ];

    static SHOW_LOADING_OPS = {
        textColor: '#aeb1ba',
        fontSize: 24,
        text: 'loading...',
        color: '#aeb1ba',
        spinnerRadius: 30,
        maskColor: 'rgba(18,23,32,0.8)'
    };

    static DATA_ZOOM_SLIDER_HIGHT = 18;
    static CHART_ZOOM_X_DISABLED = { dataZoom: [ { type: 'inside', xAxisIndex: [0], zoomOnMouseWheel: false, } ] };
    static CHART_ZOOM_X_ENABLED = { dataZoom: [ { type: 'inside', xAxisIndex: [0], zoomOnMouseWheel: true, } ] };
    static CHART_Y_AXIS_AUTOSCALE = { yAxis: [ { scale: true, } ] };
    static CHART_ZOOM_Y_DISABLED = { dataZoom: [ { type: 'inside', yAxisIndex: [0], zoomOnMouseWheel: false, } ] };
    static CHART_ZOOM_Y_ENABLED = { dataZoom: [ { type: 'inside', yAxisIndex: [0], zoomOnMouseWheel: 'shift', } ] };
    static DATA_ZOOM_X_INSIDE_ID = 'x_inside';
    static DATA_ZOOM_Y_INSIDE_ID = 'y_inside';
    // static DATA_ZOOM_X_SLIDER = {
    //                         id:'x_slider',
    //                         type: 'slider',
    //                         xAxisIndex: [0],
    //                         // realtime: true,
    //                         dataBackground: {
    //                             areaStyle: { opacity: 0.1, color: '#8392A5'},
    //                             lineStyle: { opacity: 0.1, color: '#8392A5'}
    //                         },
    //                         backgroundColor: 'rgba(47, 69, 84, 0)',
    //                         fillerColor: 'rgba(47, 69, 84, 0.3)',
    //                         handleSize: '100%',
    //                         moveHandleSize: '35%',
    //                         moveHandleStyle: {
    //                             color: 'rgba(47, 69, 84, 0)',
    //                             borderWidth: 0,
    //                             borderCap: 'round',
    //                         },
    //                         height: ChartView.DATA_ZOOM_SLIDER_HIGHT, //slider_height,
    //                         bottom: '2%', //slider_vert_offset,
    //                         // start: 30,
    //                         // end: 70,
    //                         filterMode: 'none',
    //                         throttle: 20,
    //                     };
    static DATA_ZOOM_X_INSIDE = {
                            id:ChartView.DATA_ZOOM_X_INSIDE_ID,
                            type: 'inside',
                            xAxisIndex: [0],
                            zoomOnMouseWheel: true,
                            moveOnMouseWheel: 'ctrl',
                            // preventDefaultMouseMove: true,
                            filterMode: 'filter',
                            throttle: 0,
                        };
    static DATA_ZOOM_Y_INSIDE = {
                            id:ChartView.DATA_ZOOM_Y_INSIDE_ID,
                            type: 'inside',
                            yAxisIndex: [0],
                            zoomOnMouseWheel: 'shift',
                            // preventDefaultMouseMove: true,
                            filterMode: 'none',
                            throttle: 0,
                        };

    static CHART_ZOOM_DISABLED = [{ dataZoom: [/*ChartView.DATA_ZOOM_X_SLIDER*/] }, {replaceMerge: ['dataZoom']}];
    static COLOR_WHITE_INT = 16777215;
    static COLOR_THRESHOLD = 6000000;


    static ECHARTS_TIMESTAMP = 0;
    static ECHARTS_OPEN = 1;
    static ECHARTS_CLOSE = 2;
    static ECHARTS_HIGHT = 3;
    static ECHARTS_LOW = 4;

    static CURSOR_TEXT_FONT_SIZE = 15;

    static EVENT_CHART_FRAME_CLICKED = 'event-chart-frame-clicked';
    static EVENT_SELECT_CHART = 'event-select-chart';
    static EVENT_MAXIMIZE_CHART = 'event-maximize-chart';

    static lastSelectedChart;

    // ----------------------------- PROPERTIES -----------------------------
    cnf = new ChartSettings();
    #chart_view; // TODO SOLO GUARDA OPTION DEL ULTIMO CHART, BORRAR?
    timeFrame = '';
    chart_tree = {};
    selected = [];
    clicked = false;
    prev_zoom;// = { xdelta: 1, ydelta: 1 };
    
    //----------------------------- CONSTRUCTOR -----------------------------
    constructor(chartSettings) {
        if(chartSettings) {
            this.cnf = chartSettings;
        }
        this.resize_chart_window();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    format_retracements(data) {
        let res;
        console.time('split_retracements');
        
        let dataRes = [];
        let data_ret = [];

        console.log(data);

        try {
            if(!data) {
                throw ('No data available.');
            }

            // Iterates over all retracement patterns names
            Object.keys(data).forEach(n => {
                // Iterates over all levels available in each retracement pattern
                Object.keys(data[n].data).forEach(l => {
                    let dl = data[n].data[l];
                    data_ret.push(...dl.map( r => [[r.end.time, r.end.price], r.retracement, Const.TREND_STR[r.trend], n] ));
                    dataRes.push(...dl.map(d => [ d.init, d.end, d.correction, Const.TREND_STR[d.trend], d.levels, n ]
                                        .map(dd => dd.time ? [dd.time, dd.price] : dd) ));
                });
            });

            res = {
                data: dataRes,
                data_ret: data_ret,
                levels: [0],
            };
        }
        catch(error) {
            console.error(error);
            res = error;
        }

        // return this.#pattern_result[level_][name_];
        console.timeEnd('split_retracements');
        return res;
    }

    format_fibo_retracement_data(data_source) {
        // Iterates over all retracement patterns names
        let res = [];
        try {
            Object.keys(data_source).forEach(n => {
                // Iterates over all levels available in each retracement pattern
                Object.keys(data_source[n][Const.DATA_ID]).forEach(l => {
                    let data_level = data_source[n][Const.DATA_ID][l];
                    res.push(...data_level.map((r, i) => {
                        let name = `${Const.FIBO_RET_ID}_${n}_${l}_${i}`;
                        let trend = Const.TREND_STR[r[Const.TREND_ID]];
                        let levels = Object.keys(r[Const.RET_LEVELS_ID]);
                        let values = Object.values(r[Const.RET_LEVELS_ID]);
                        // Y values (price
                        let ymin = Math.min(...levels);
                        let ymax = Math.max(...levels);
                        let ystart, yend;
                        [ystart, yend] = [r[Const.INIT_ID].price, r[Const.END_ID].price];
                        if(ystart > yend) { [ystart, yend] = [yend, ystart]; }
                        let height = yend - ystart;
                        // X values (time)
                        let xstart, xend;
                        [xstart, xend] = [r[Const.END_ID].time, r[Const.CORRECTION_ID].time];
                        let width = xend - xstart;
                        
                        return {
                            name: name,
                            trend: trend,
                            levels: levels,
                            values: values,
                            xstart: xstart,
                            xend: xend,
                            width: width,
                            ystart: ystart,
                            yend: yend,
                            height: height,
                            ymin: ymin,
                            ymax: ymax,
                            // levelsdatasource: levels_datasource,
                            // valuesdatasource: values_datasource,
                        }
                    }));
                });
            });
        }
        catch(error) {
            console.error(error);
            res = error;
        }
        return res;
    }


    //----------------------------- PUBLIC METHODS -----------------------------
    initChart(params) {
        let id = params.id;
        let frame = params.frame[0];
        let chart = echarts.init(frame, null, {
            // renderer: 'svg',
            renderer: 'canvas',
        });

        // chart.setOption({animatoinEasing: 'linear'});
        // chart.id = id;
        chart.id = id;
        var that = this;
        // $(window).resize(() => that.resize_chart_window(chart));
        $(window).on('resize', () => that.resize_chart_window(chart));
        this.onClickChart(chart, id);
        this.zoomAxisWheel({chart, id});
        this.chart_tree[id] = {};
        this.chart_tree[id][Const.CHART_ID] = chart;
        this.chart_tree[id][Const.GRAPHICS_ID] = {};
        return chart;
    }

    plot_candles(data, chart=null, clear=true)
    {
        let ret = 0;
        var that = this;
        try {
            
            if(!data) {
                throw ('No data available to plot.');
            }

            if(clear) {
                // chart.setOption({series: []}, { replaceMerge: ['series']});
                this.clear_chart(chart);
            }

            let max_y = data.max_y*3;
            let min_y = 0;//-max_y;
            let max_x = data.max_x;
            let min_x = data.min_x;
            let doc_heigh = $(document).height();
            let work_heigh_pc = 1;//2;
            let vert_margins = (work_heigh_pc)/2; // (work_heigh_pc - 1)/2;
            let x_axis_vert_offset = -(doc_heigh * work_heigh_pc * (vert_margins/2));
            // let x_offset = '5%';
            let x_offset = '90px';
            let tools_x_offset = '2%';
            let grid_left = '4%';
            let grid_right = '5%';
            let grid_top = '15px'; //'2%';
            let grid_height = work_heigh_pc * 100 * '%';
            let vert_margins_pc = vert_margins * 100 + '%';
            let y_offset = (vert_margins/2) * 100 + '%';
            let slider_height = 18;
            let slider_vert_offset = doc_heigh * 0.075;
     
            // Specify the configuration items and data for the chart
            this.#chart_view = {
                
                animation: false,

                backgroundColor:this.cnf.colorBackground,

                axisPointer: {
                    link: [ { xAxisIndex: 'all' } ],
                    label: { backgroundColor: this.cnf.colorCross }
                },

                grid: [
                    {
                        left: '0px',
                        bottom: '10px',
                        height: '100%',//'95%',
                        width: '100%', //'98.5%',
                        margin: '5px',
                        containLabel: true,
                    },
                ],
                
                xAxis: [
                    {
                        id: 'data',
                        scale: true,
                        type: 'time',
                        // type: 'category',
                        // data: data.data_y.map(d => new Date(d[0]).toLocaleString().replace(',','')),
                        backgroundColor: ChartView.BACKGROUND_COLOR,
                        position: 'bottom',
                        splitNumber: 6,
                        // offset:x_axis_vert_offset,
                        // offset: -15,
                        axisLine: { show: true, lineStyle: { color: this.cnf.colorLineAxis }, onZero: true },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: {
                            // formatter: axisValue => { return moment(axisValue).format("MM-DD HH:mm"); },
                            show: true,
                            color: this.cnf.colorTextAxis,
                            fontSize: 15,
                            backgroundColor: 'transparent',
                            showMaxLabel: false,
                        },
                        min: null,
                        max: null,
                    },
                ],

                yAxis:[
                    {
                        scale: true,
                        gridIndex: 0,
                        position: 'right',
                        splitNumber: 11,
                        // offset: -15,
                        // axisLine: { show: true, lineStyle: { color: this.cnf.colorTextAxis } },
                        axisLine: { show: true, lineStyle: { color: this.cnf.colorLineAxis } },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: {
                            show: true,
                            color: this.cnf.colorTextAxis,
                            fontSize: 15,
                            margin: 0,
                            // Workaround hasta que pueda configurar ancho de eje (no parece que pueda hacerse)
                            formatter: price => { return `${price}      `; },
                            backgroundColor: 'transparent',
                            showMaxLabel: false,
                            verticalAlign: 'middle',
                            padding: [0, 0, 0, 15],
                        },
                        min: min_y,
                        max: max_y,
                    },
                ],

                dataZoom: [
                    ChartView.DATA_ZOOM_X_INSIDE,
                    ChartView.DATA_ZOOM_Y_INSIDE,
                ],

                series: [
                    {
                        id: data.name,
                        name: data.name,
                        type: 'candlestick',
                        data: data.data_y,
                        // data: data.data_y.map(d => d.slice(1,5)),
                        clip: true,
                        itemStyle: {
                            color: this.cnf.colorUp,
                            color0: this.cnf.colorDown,
                            borderColor: this.cnf.colorBorderUp,
                            borderColor0: this.cnf.colorBorderDownd,
                        },
                        // barWidth: '75%',
                        barMinWidth: 1, //'75%',
                        barMaxWidth: 34, //'85%',
                        // barWidth: '250%',
                        // barMinWidth: '150%',
                        // barMaxWidth: '450%',
                        emphasys: {
                            disabled: true,
                        },
                        z: 100,
                        zlevel: 0,
                    },
                    {
                        id: data.name + '_MARGIN',
                        name: data.name,
                        type: 'candlestick',
                        data: data.margin,
                        clip: true,
                    }
                ],

                toolbox: {
                    feature: {
                        dataZoom: {
                            // yAxisIndex: true,
                        },
                        // restore: {},
                        saveAsImage: {
                            icon: 'image://static/images/icons/camera.png',
                            name: data.name + '_' + data.marco + '_' + data.broker + '_' + Time.now(Time.FORMAT_FILE),
                            type: 'jpg',
                            excludeComponents: ['toolbox', 'title'],
                        },
                    },
                    // top: grid_top,
                    // right: tools_x_offset,
                    top: '15px',
                    right: '80px',
                },
                
                tooltip: {
                    useUTC: true,
                    trigger: 'axis',
                    alwaysShowContent: true,
                    axisPointer: {
                        type: 'cross',
                        snap: true,
                        z: ChartView.Z_AXIS_COMPONENS,
                    },
                    borderWidth: 0, //1,
                    borderColor: 'rgba(0,0,0,0)',
                    backgroundColor: 'rgba(80,80,80,0.03)',
                    padding: 0, //[5, 20],
                    textStyle: {
                        color: this.cnf.colorCross,
                        // width: '65%',
                        height: '1em',
                        textBorderWidth: 0,
                    },
                    // position: ['10px', '35px'],
                    position: ['65px', '13px'],
                    // position: ['25px', '30px'],
                    z: ChartView.Z_AXIS_COMPONENS,
                    zlevel: 0,
                    formatter: function(params, ticket, callback) {
                        return that.format_chart_tooltip(data, params);
                    },
                    extraCssText: 'box-shadow: 0 0 0 rgba(0,0,0,0);',
                },
            };

            // Display the chart using the configuration items and data just specified.
            chart.setOption(this.#chart_view);
            // chart.dispatchAction({
            //     type                    : 'takeGlobalCursor',
            //     key                     : 'dataZoomSelect',
            //     dataZoomSelectActive    : true,
            // });

            // this.plotPriceCursor({data, chart});
            ret = data;
        }
        catch(error) {
            console.error(error);
            ret = error;
        }

        return ret;
    }

    static PRICE_LABEL_LAST_PRICE = 0;
    static PRICE_LABEL_COLOR = ChartView.PRICE_LABEL_LAST_PRICE + 1;
    static PRICE_LABEL_SHOW_TIME = ChartView.PRICE_LABEL_COLOR + 1;
    static PRICE_LABEL_SHOW_LINE = ChartView.PRICE_LABEL_SHOW_TIME + 1;
    static PRICE_LABEL_TIME_REMAIN = ChartView.PRICE_LABEL_SHOW_LINE + 1;

    plotPriceCursor({query, data, chart, showLine = true, showTime = true}) {
        // let lastCandleIndex = data.data_y[data.lastCandleIndex];
        let lastCandle = data.data_y.at(-1);
        let lastPrice = lastCandle[ChartView.ECHARTS_CLOSE];
        let color = (lastCandle[ChartView.ECHARTS_CLOSE] > lastCandle[ChartView.ECHARTS_OPEN]) ? this.cnf.colorUp : this.cnf.colorDown;
        let lastTime = lastCandle[ChartView.ECHARTS_TIMESTAMP];

        let timeFrame = query[Const.TIME_FRAME_ID];
        timeFrame = Time.convertToSeconds(timeFrame)*Time.MS_IN_SECONDS;
        let timeRemain = Time.getCountdown({finalTime: (lastTime+timeFrame)});

        chart.setOption({
            series: {
                id: `${data.name}_CURSOR`,
                name: `${data.name}_CURSOR`,
                type: 'custom',
                renderItem: this.renderCursor.bind(this),
                encode: {
                    x: [0],
                    y: [0],
                },
                data: [[lastPrice, color, showTime, showLine, timeRemain]],
                z: ChartView.Z_AXIS_COMPONENS,
                zlevel: 0,
            }
        });

        return data;
    }
        
    updateCandles({data, chart}) {
        // // Find series index
        // let seriesIndex = Object.keys(chart.getOption().series.filter(s => s.name == data.name))[0];
        // chart.appendData({
        //     seriesIndex: seriesIndex,
        //     data: data,
        // });
        chart.setOption({ series:
                {
                    id: data.name,
                    name: data.name,
                    data: data.data_y,
                }
            },
            // { replaceMerge: 'series' }
        );
    }

    updatePriceCursor_({query, data, chart, showLine = true, showTime = true}) {
        let lastCandle = data.data_y.at(-1);
        let lastPrice = lastCandle[ChartView.ECHARTS_CLOSE];
        let color = (lastCandle[ChartView.ECHARTS_CLOSE] > lastCandle[ChartView.ECHARTS_OPEN]) ? this.cnf.colorUp : this.cnf.colorDown;
        
        let lastTime = lastCandle[ChartView.ECHARTS_TIMESTAMP];
        let timeFrame = query[Const.TIME_FRAME_ID];
        timeFrame = Time.convertToSeconds(timeFrame)*Time.MS_IN_SECONDS;
        let timeRemain = Time.getCountdown({finalTime: (lastTime+timeFrame)});

        chart.setOption({series: [
            {
                // id: `${data.name}_CURSOR`,
                id: `${query[Const.ID_ID]}_CURSOR`,
                data: [[lastPrice, color, showTime, showLine, timeRemain]],
            }
        ]});
    }

    // NOTA: VERSION CON DATOS DEL WEB SOCKET:
    //  * TIENE LOS DATOS EN STRING, Y EN DIFERENTE ORDEN.
    //  * APORTA EL TIEMPO FINAL DE VELA DIRECTAMENTE.
    updatePriceCursor({query, data, chart, time, showLine = true, showTime = true}) {
        let lastPrice = parseFloat(data[4]);
        let color = (data[4] > data[1]) ? this.cnf.colorUp : this.cnf.colorDown;
        let lastTime = data[6];
        // TODO WORKAROUND: BINANCE ENTREGA LA NUEVA VELA UNOS 5s MAS TARDE
        let timeRemain = Time.getCountdown({finalTime: lastTime, initTime: time}); //Date.now()-(5*Time.MS_IN_SECONDS) });

        chart.setOption({series: [
            {
                id: `${query[Const.ID_ID]}_CURSOR`,
                data: [[lastPrice, color, showTime, showLine, timeRemain]],
            }
        ]});
    }

    renderCursor(params, api) {
        let lastPrice = api.value(ChartView.PRICE_LABEL_LAST_PRICE);
        let color = api.value(ChartView.PRICE_LABEL_COLOR);
        let showTime = api.value(ChartView.PRICE_LABEL_SHOW_TIME);
        let showLine = api.value(ChartView.PRICE_LABEL_SHOW_LINE);
        let textTime = `${api.value(ChartView.PRICE_LABEL_TIME_REMAIN)}`;
        let yLastPrice = api.coord([0, lastPrice])[1]
        let textPrice = `${lastPrice}`;

        let yAxisX = params.coordSys.width + params.coordSys.x;
        let xAxisY = params.coordSys.height + params.coordSys.y;
        let width = api.getWidth() - yAxisX;
        // let width = (textPrice.length*(15/1.8)) + 10;

        let id = params.seriesId;
        let name = params.seriesName;

        let priceCursor = this.getPriceCursor({ id, name,
                                                x: yAxisX, //api.getWidth(),
                                                y: yLastPrice,
                                                width: width,
                                                textPrice,
                                                color,
                                                showTime: showTime,
                                                textTime,
                                                showLine: showLine});

        return priceCursor;
    }
    
    getPriceCursor({id, name, x, y, width, textPrice, color, showTime = false, textTime, showLine = false}) {
        // Check minimum contrast between font and label background color
        let colorText = ((ChartView.COLOR_WHITE_INT - parseInt(color.substring(1), 16)) < ChartView.COLOR_THRESHOLD) ? 'black' : 'white';
        width = width? width : 65;

        let children =  [
            {
                type: 'rect',
                id: `${id}_CURSOR_LABEL`,
                name: `${name}_CURSOR_LABEL`,
                x: 0, //-65,
                y: -12,
                z: ChartView.Z_AXIS_COMPONENS,
                shape: {
                    width: width, //65,
                    height: (showTime) ? 40 : 24,
                },
                style: {
                    fill: color,
                },
            },
            {
                type: 'text',
                id: `${id}_CURSOR_PRICE_TEXT`,
                name: `${name}_CURSOR_PRICE_TEXT`,
                x: 5, //-60,
                y: -6,
                z: ChartView.Z_AXIS_COMPONENS,
                style: {
                    text: textPrice,
                    fontSize: 14,
                    fill: colorText,
                }
            },
        ];

        if(showTime) {
            children.push({
                type: 'text',
                id: `${id}_CURSOR_TIME_TEXT`,
                name: `${name}_CURSOR_TIME_TEXT`,
                x: 5, //-60,
                y: 10,
                z: ChartView.Z_AXIS_COMPONENS,
                style: {
                    text: textTime,
                    fontSize: 14,
                    fill: colorText,
                }
            });
        }

        if(showLine) {
            children.push({
                type: 'line',
                id: `${id}_CURSOR_LINE`,
                name: `${name}_CURSOR_LINE`,
                z: ChartView.Z_AXIS_COMPONENS,
                shape: {
                    x1: -x,
                    x2: width, //-65,
                    y1: 0,
                    y2: 0,
                },
                style: {
                    stroke: color,
                    lineWidth: 0.4,
                    lineDash: [1, 1],
                },
            });
        }

        let priceCursor = {
            type: 'group',
            id: `${id}_CURSOR_GROUP`,
            name: `${name}_CURSOR_GROUP`,
            children: children,
            x: x,
            y: y,
            z: ChartView.Z_AXIS_COMPONENS,
            clip: false,
        }

        return priceCursor;
    }

    plot_max(data, chart=null) {
        let ret;
        try {
            if(!data) {
                throw ('No data available to plot.');
            }

            if((data) && (data.dataType != Const.MAXIMOS_ID)) {
                throw('MAXIMOS data type is needed to plot MAXIMUM, received' + data.dataType + ' instead.');
            }

            // Specify the configuration items and data for the chart
            this.#chart_view = {
                xAxis: {
                    type:'category',
                    data: data.data_x
                },
                yAxis: {},
                series: [
                    {
                        id: data.id[0],
                        name: data.name,
                        color: this.cnf.colorUp,
                        gridIndex:1,
                        symbolSize: 10,
                        type: 'scatter',
                        data: data.data_y[Const.HIGH_ID],
                    },
                    {
                        id: data.id[0],
                        name: data.name,
                        color: this.cnf.colorDown,
                        gridIndex:1,
                        symbolSize: 10,
                        type: 'scatter',
                        data: data.data_y[Const.LOW_ID],
                    },
                ],
            };
            chart.setOption(this.#chart_view);
            ret = data;
        }
        catch(error) {
            console.error(error);
            ret = error;
        }
        return ret;
    }

    plot_movements(data, chart) {
        let ret;
        try {

            if(!data) {
                throw ('No data available to plot.');
            }

            // if (data.dataType != Const.MOVIMIENTOS_ID) {
            // if ((data instanceof Movements) == false) {
            // if ((data.dataType == "movements") == false) {
                // throw ('"Movements" data type is needed to plot movements, received ' + typeof data + ' instead.');
            // }

            let level = data.level;
            // let curr_option = chart.getOption();
            // let data_append = data.data_y[Const.ALCISTA_ID].filter(d => {
            //     let t = data.data_y[Const.BAJISTA_ID].map(b => b[0]);
            //     return !t.includes(d[0]);
            // });
            // let full_data = (data.data_y[Const.BAJISTA_ID].concat(data_append)).sort();

            // Labels for markpoint bull
            let ret_labels_bull = data.data_ret[Const.ALCISTA_ID].map( (r, i) => {
                return this.generate_label(r[0], r[1], data.name + '_MARK_BULL_' + i,
                                    [0,-20], 'rgba(0, 255, 0, 1)');
            });
            // Markpoint label
            let ret_markpoints_bull = {
                    label: { formatter: r => (r.value != null) ? parseFloat(r.value).toFixed(3) + '' : '', },
                    data: ret_labels_bull,
            };

            // Labels for markpoint bear
            let ret_labels_bear = data.data_ret[Const.BAJISTA_ID].map( (r, i) => {
                return this.generate_label(r[0], r[1], data.name + '_MARK_BEAR_' + i,
                                    [0,30], 'rgba(255, 0, 0, 1)');
            });

            // Markpoint label
            let ret_markpoints_bear = {
                label: { formatter: r => (r.value != null) ? parseFloat(r.value).toFixed(3) + '' : '', },
                data: ret_labels_bear,
            };

            let move_series_bull = {
                id: data.name + '_BULL', name: data.name + '_BULL',
                data: data.data_y[Const.ALCISTA_ID],
                type: 'line', color: "rgba(255, 255, 255, 0.8)",
                lineStyle: { width: 1, opacity: 0.8, },
                showSymbol: false,
                markPoint: ret_markpoints_bull,
                z: 100,
            };

            let move_series_bear = {
                id: data.name + '_BEAR', name: data.name + '_BEAR',
                data: data.data_y[Const.BAJISTA_ID],
                type: 'line', color: "rgba(255, 255, 255, 0.8)",
                lineStyle: { width: 1, opacity: 0.8, },
                showSymbol: false,
                markPoint: ret_markpoints_bear,
                z: 100,
            };

            // let ret_labels = ret_labels_bull.concat(ret_labels_bear);

            let move_series = [move_series_bull, move_series_bear];

            // Appends retracement labels
            // move_series = move_series.concat(ret_values);

            // Applies to chart
            chart.setOption({ series: move_series },
                            { notMerge: false, normalMerge: 'series' });

            ret = data;
        }
        catch(error) {
            console.error(error);
            ret = error;
        }
        return ret;
    }

    plot_retracements(data, chart) {
        let ret;
        console.time('plot_retracements');
        try {
            // Labels for markpoint bull
            let ret_labels;
            let ret_markpoints;

            let ret_series = [];
            let real_trend = data.data.map(d => {
                let rt = (d[0][1] > d[1][1]) ? Const.BEAR_ID : Const.BULL_ID;
                return [d[5], rt];
            });
            
            data.data_ret.map( dr => dr.push( real_trend.filter(rt => rt[0]==dr[3])[0][1] ) );

            ret_markpoints = this.generate_markpoints(data.data_ret);
            if(data.data) {
                let ret_series_trend = data.data.map( (r, i) => {
                    let values = r.slice(0, 3);
                    let trend = r[3];
                    let name = r[5];
                    return {
                        id: name + ChartView.TREND_TEXT_ID[trend] + i,
                        name: name,
                        type: 'line', color: ChartView.LINE_COLOR[trend],
                        lineStyle: { width: 3, opacity: 0.75, },
                        showSymbol: false,
                        data: values,
                        markPoint: ret_markpoints
                    }
                });

                ret_series = ret_series.concat(ret_series_trend);
            }

            // Fibonacci retracement graphic
            let fibo = {
                graphic: {
                    elements: [
                        { type: 'group'}
                    ]
                }
            }

            // Applies to chart
            chart.setOption({ series: ret_series, });

            ret = data;
        }
        catch(error) {
            console.error(error);
            ret = error;
        }

        console.timeEnd('plot_retracements');
        return ret;
    }

    /**
     * Plots movement and fibonacci pattern (single data)
    * input parameters:
        * data:
                dataType: Const.RETROCESOS_ID
                data_y: [ [time, price], [time, price], [time, price]]
                data_ret: [ [time, price] , ret]
                trend: Const.BULL_ID or Const.BEAR_ID
                data.id: name + [_BULL_ or _BEAR_] + index
        * ops:
                movs: { labels: 0/1, lines: 0/1 }
                fibo: {}
        * chart
    * returns: data (input parameter)
*/
    plot_pattern(data, ops, chart) {
        let ret;

        try {

            if(!data) {
                throw ('No data available to plot.');
            }

            if (data.dataType != Const.RETROCESOS_ID) {
                throw ('RETROCESOS data type is needed to plot pattern, received ' + data.dataType + ' instead.');
            }

            let color_trend;
            let offset_trend;
            let ret_labels;
            let ret_markpoints;
            let ret_series;

            // if(data.trend == Const.BULL_ID) {
                color_trend = 'rgba(0, 255, 0, 1)';
                offset_trend = [0, -20];
            // }
            // else {
            //     color_trend = 'rgba(255, 0, 0, 1)';
            //     offset_trend = [0, 30];
            // }

            if(ops.movs.labels) {
                // Labels for markpoint bull
                ret_labels = [this.generate_label(data.data_ret[0], data.data_ret[1], data.id, offset_trend, color_trend) ];

                // Markpoint bull label
                ret_markpoints = {
                    label: { formatter: r => (r.value != null) ? parseFloat(r.value).toFixed(3) + '' : '', },
                    data: ret_labels,
                };
            }

            // Lines bull
            if(ops.movs.lines) {
                ret_series = [{
                        id: data.id,
                        name: data.id,
                        type: 'line', color: color_trend,
                        lineStyle: { width: 1, opacity: 0.8, },
                        showSymbol: false,
                        data: data.data_y,
                        markPoint: ret_markpoints
                }];
            }

            // Fibonacci retracement graphic
            let fibo = {
                graphic: {
                    elements: [
                        { type: 'group' }
                    ]
                }
            }

            // Applies to chart
            if(ops.movs.lines) {
                chart.setOption({ series: ret_series, });
            }

            ret = data;
        }
        catch(error) {
            console.error(error);
            ret = error;
        }
        return ret;
    }

    /*** If series == null, clears all chart series. */
    clear_chart(chart, series=null) {
        let ret;
        let num_series = 1;
        let num_graphics = 0;
        try {
            let curr_option = chart.getOption();
            if(series && (series.length == 0)) { return series; }
            if(curr_option) {
                if(series) {
                    let chart_series = curr_option.series;
                    num_series = chart_series.length;
                    let graphics = (curr_option.graphic && (curr_option.graphic.length)) ? curr_option.graphic[0].elements : [];
                    num_graphics = graphics.length;
                    for(let i=0; i<series.length; i++) {
                        graphics = [].concat(...graphics.filter( g => (g != undefined) && g.id.includes(series[i]) == false));
                        Object.keys(this.chart_tree[chart.id][Const.GRAPHICS_ID]).forEach(g => {
                            if(g.includes(series[i])) {
                                if(this.chart_tree[chart.id][Const.GRAPHICS_ID][g].remove) {
                                    this.chart_tree[chart.id][Const.GRAPHICS_ID][g].remove();
                                }
                                delete this.chart_tree[chart.id][Const.GRAPHICS_ID][g];
                            }
                        });
                        chart_series = [].concat(...chart_series.filter( s => (s != undefined) && s.id.includes(series[i]) == false));
                    }
                    curr_option.series = [...new Set(chart_series)];
                    curr_option.graphic = [...new Set(graphics)];
                }
                else {
                    if(curr_option.series) { curr_option.series = []; }
                    if(curr_option.graphic) { curr_option.graphic = []; }
                }

                // Updates chart
                if(num_series > 1) {
                    // chart.clear();
                    chart.setOption( { series: [] }, {replaceMerge: ['series']} );
                    chart.setOption( { series: curr_option.series }, {replaceMerge: ['series']} );
                }
                if(num_graphics) {
                    // chart.setOption( { graphic: [] }, {replaceMerge: ['graphic']} );
                    chart.setOption( { graphic: curr_option.graphic }, {replaceMerge: ['graphic']} );
                }

                // Updates chart tree with deleted objects
                // series.forEach(s => {
                //     let gs = Object.values(this.chart_tree[chart.id][Const.GRAPHICS_ID]).filter(sg => sg[Const.NAME_ID].includes(s));
                //     for(let ig=0; ig < gs.length; ig++) {
                //         if(gs[ig].remove()) {
                //             gs[ig].remove();
                //         }
                //         delete gs[ig];
                //     }
                // });
                // this.chart_tree = this.chart_tree.filter(o => series.includes(o.name) == false);

                ret = series;
            }
        }
        catch(error) {
            console.log('Error clearing chart: ', error);
            ret = error;
        }
        return ret;
    }

    /** zoom_chart
     * @param zoom: 2 types of settings.
     * margin is optional parameter.
     * By values:
     *          {   
                    startValue: {x: dateMin, y:priceMin},
                    endValue: { x: dateMax, y:priceMax},
                    margin: {x: +/- candles, y: +/- % (max-min)},
                }
     * By %:
                {
                    start: {x: %, y: %},
                    end: { x: %, y: %},
                    margin: {x: +/- %, y: +/- %},
                }
        onlyValid: [startValue, endValue] true: filter all undefined dates || false: start/end could be undefined date
     * @param chart Chart object to zoom.
     * @param min Optional parameter. Min axis values. {x, y} to limit zoom.
     * @param max Optional parameter. Max axis values. {x, y} to limit zoom.
     * @returns Zoom object with updated information if ok. Error message other case.
     */
    zoomChart({zoom, chart, min, max}) {
        let ret;
        try {
            let margin = zoom.margin || { x: 0, y: 0 };
            margin = {
                x: margin.x/100,
                y: margin.y/100,
             };

            // Zoom from axis values
            if(zoom.startValue) {
                let startValue = zoom.startValue || {x: 0, y: 0};
                let endValue = zoom.endValue || {x: 0, y: 0};
                let diff = {
                    x: endValue.x - startValue.x,
                    y: endValue.y - startValue.y,
                }
                startValue = {
                    x: startValue.x - (diff.x * margin.x),
                    y: startValue.y - (diff.y * margin.y),
                };
                endValue = {
                    x: endValue.x + (diff.x * margin.x),
                    y: endValue.y + (diff.y * margin.y),
                };

                // CLIP values to max-min
                if(min) {
                    if(startValue.x < min.x) { startValue.x = min.x; }
                    if(startValue.y < min.y) { startValue.y = min.y; }
                }
                if(max) {
                    if(endValue.x > max.x) { endValue.x = max.x; }
                    if(endValue.y > max.y) { endValue.y = max.y; }
                }

                chart.dispatchAction({
                    type: 'dataZoom',
                    batch: [
                        {
                            dataZoomId: ChartView.DATA_ZOOM_X_INSIDE_ID,
                            startValue: startValue.x,
                            endValue: endValue.x,
                            type: 'dataZoom',
                        },
                        {
                            dataZoomId: ChartView.DATA_ZOOM_Y_INSIDE_ID,
                            startValue: startValue.y,
                            endValue: endValue.y,
                            type: 'dataZoom',
                        }
                    ]
                });
            }

            // Zoom from total data percent
            else if(zoom.start) {
                let start = zoom.start || {x: 0, y: 0};
                let end = zoom.end || {x: 0, y: 0};
                start = {
                    x: start.x * (1 - margin.x),
                    y: start.y * (1 - margin.y),
                }
                end = {
                    x: end.x * (1 + margin.x),
                    y: end.y * (1 + margin.y),
                }
                // CLIP max-min
                if(start.x < 0) { start.x = 0; }
                if(start.y < 0) { start.y = 0; }
                if(end.x > 100) { end.x = 0; }
                if(end.y > 100) { end.y = 0; }

                chart.dispatchAction({
                    type: 'dataZoom',
                    batch: [
                        {
                            dataZoomId: ChartView.DATA_ZOOM_X_INSIDE_ID,
                            start: start.x,
                            end: end.x,
                            type: 'dataZoom',
                        },
                        {
                            dataZoomId: ChartView.DATA_ZOOM_Y_INSIDE_ID,
                            start: start.y,
                            end: end.y,
                            type: 'dataZoom',
                        }
                    ]
                });
            }

            ret = zoom;
        }
        catch(error) {
            console.log('Error zooming chart: ', error);
            ret = error;
        }
        return ret;
    }

    plot_label(data, chart) {

    }

    format_chart_tooltip(data, params) {
        if( params && ((params instanceof Array) == false) ) {
            params = [params];
        }

        // if((!params) || (params[0].componentSubType != 'candlestick')) {
            // return;
        // }

        //Get max length of all values
        let strLenMax = 4;
        let open = '';
        let high = '';
        let low = '';
        let close = '';
        let delta = '';
        let deltaPc = '';
        let width_values = 'width:' + strLenMax * 0.6 + 'em;';
        let color_values = 'color:rgba(0, 0, 0, 0);';
        let value;
        let color;
        let idxTime;
        try {
            if((params != undefined) && (params[0].axisValue != undefined)) {
                // if(params[0].value.includes(undefined)) {
                if(params[0].axisValue > data.data_y.at(-1)[Const.IDX_CANDLE_TIME]) {
                    idxTime = data.data_y.length-1;
                }
                else if(params[0].axisValue < data.data_y[0][Const.IDX_CANDLE_TIME]) {
                    idxTime = 0;
                }
                else {
                    idxTime = params[0].dataIndex;
                    // value = params[0].value;
                    // color = params[0].color;
                }
                
                value = data.data_y[idxTime];
                color = (value[Const.IDX_CANDLE_OPEN] < value[Const.IDX_CANDLE_CLOSE]) ? this.cnf.colorUp : this.cnf.colorDown;

                // Get max length of prices (OHLC) strings
                strLenMax = Math.max(...[value[Const.IDX_CANDLE_OPEN].toString().length, value[Const.IDX_CANDLE_CLOSE].toString().length,
                                    value[Const.IDX_CANDLE_HIGH].toString().length, value[Const.IDX_CANDLE_LOW].toString().length]);

                //Set length of container
                width_values = 'width:' + strLenMax * 0.6 + 'em;';
                //Set color for values (bull, bear colors)
                color_values = 'color:' + color + ';';
                
                //Adjust number of decimals to meet max length
                if(value.includes(undefined) == false) {
                    open = value[Const.IDX_CANDLE_OPEN];
                    let diffDec = (strLenMax - open.toString().length) - 1;
                    open = (diffDec > 0) ? open.toFixed(diffDec) : open;
                    high = value[Const.IDX_CANDLE_HIGH];
                    diffDec = (strLenMax - high.toString().length) - 1;
                    high = (diffDec > 0) ? high.toFixed(diffDec) : high;
                    low = value[Const.IDX_CANDLE_LOW];
                    diffDec = (strLenMax - low.toString().length) - 1;
                    low = (diffDec > 0) ? low.toFixed(diffDec) : low;
                    close = value[Const.IDX_CANDLE_CLOSE];
                    diffDec = (strLenMax - close.toString().length) - 1;
                    close = (diffDec > 0) ? close.toFixed(diffDec) : close;
                    // if(idxTime != undefined) {
                    if(idxTime > 0) {
                        let prev_close = data.data_y[idxTime-1][Const.IDX_CANDLE_CLOSE];
                        delta = (close - prev_close);
                        deltaPc = (delta/close) * 100;
                        delta = delta.toFixed((diffDec > 0) ? diffDec : 2);
                        deltaPc = deltaPc.toFixed(2);
                    }
                    else {
                        delta = '-'
                        deltaPc = '-'
                    }
                }
            }
        }
        catch(error) {
            // console.error(`value: ${value}.`);
            // console.error(error);
        }
        let info = '<div class="class-tooltip" style="font-size: 0.9em;">' +
                        // ChartView.CHART_TOOLTIP_HEADER_DUMMY + data.marco + ChartView.P_CLOSE +
                        // ChartView.CHART_TOOLTIP_HEADER_DUMMY + '..___________' + ChartView.P_CLOSE +
                        // ChartView.CHART_TOOLTIP_HEADER_DUMMY + data.name + ChartView.P_CLOSE +
                        // ChartView.CHART_TOOLTIP_HEADER_DUMMY + data.broker + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + data.name + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + `(${data.broker})` + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + '' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'O' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + open + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'H' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + high + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'L' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + low + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'C' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + close + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + 'font-size: 0.8em;' + ChartView.VALUES_CLOSE + ` ${delta} (${deltaPc}%)` + ChartView.P_CLOSE +
                    '</div>';

        // ChartView.prev_tooltip_info = info;
        return info;
    }

    get_chart_view() {
        return this.#chart_view;
    }

    generate_markpoints(data) {
        var ret_markpoints;
        try {
            if(data) {
                // Marks
                let ret_labels = data.map( (r, i) => {
                    let coord = r[0];
                    let value = r[1];
                    let trend = r[2];
                    let name = r[3];
                    let real_trend = r[4];
                    return this.generate_label(coord, value, name + ChartView.MARK_TEXT_ID[trend] + i,
                                        ChartView.MARK_OFFSET[real_trend], ChartView.MARK_COLOR[trend]);
                });

                // Markpoint label
                ret_markpoints = {
                    label: { formatter: r => (r.value != null) ? parseFloat(r.value).toFixed(3) + '' : '', },
                    data: ret_labels,
                };
            }
        }
        catch(error) {
            console.log(`ERROR: generate_markpoints: ${error}.`);
        }
        return ret_markpoints;
    }

    generate_label(coord, data, id='',
                    offset=[0,0], textColor='rgba(125,125,125,1)',
                    symbol='circle', showSymbol=false, symbolColor='rgba(0,0,0,0)', symbolSize=10) {

        let label = {
                    id: id,
                    name: id,
                    coord: coord, value: data,
                    symbol: symbol,
                    showSymbol: showSymbol,
                    label: { offset: offset, color: textColor, },
                    itemStyle: { color: symbolColor, itemSize: symbolSize, },
                    z: 99,
        };

        return label;
    }
    
    draw_chart_component(data, chart) {
        try {
            if((data instanceof Array) == false) {
                data = [data];
            }
            
            data.forEach(f => {
                try {
                    f.plot(chart);
                    this.chart_tree[chart.id][Const.GRAPHICS_ID][f[Const.ID_ID]] = f;
                }
                catch(error) {
                    console.error(`EXCEPTION draw_chart_component:${error}.`);
                }
            });
        }
        catch(error) {
            console.error(error);
        }
    }

    resize_chart_window(chart) {
        let screen_height = $(window).height(); //$(window).outerHeight();
        let footer_menu_height = $(ChartView.ELEMENT_CLASS_FOOTER_MENU).css('height');
        footer_menu_height = footer_menu_height.replace(/[a-zA-Z]/g, '');
        screen_height -= footer_menu_height;
        $(ChartView.ELEMENT_ID_CHART_MAIN).css('height', `${screen_height}px`);
        if(chart != undefined) {
            chart.resize();
        }
    }

    // ZOOM AXIS DRAGGING --------------------------------------------------------------------------------------------

    onClickChart(chart, id) {
        var x1 = 0, y1 = 0;
        var x2 = 0, y2 = 0;
        var that = this;
        let lastClickTime = 0;
        let idTimer = 0;

        chart.getZr().on('mousedown', (e) => {
            let [x, y] = chart.convertFromPixel({ xAxisIndex:0, yAxisIndex:0}, [e.offsetX, e.offsetY]);
            let xzoom = chart._model.option.dataZoom.filter(z => z.id && z.id.includes(ChartView.DATA_ZOOM_X_INSIDE_ID))[0];
            let yzoom = chart._model.option.dataZoom.filter(z => z.id && z.id.includes(ChartView.DATA_ZOOM_Y_INSIDE_ID))[0];
            if( (x > xzoom.endValue) && (y < yzoom.startValue)) {
            }
            else if(x > xzoom.endValue) {
                [x1, y1] = [undefined, y];
                chart.getZr().setCursorStyle('n-resize');
                chart.getZr().on('mousemove', dragAxisZoom);
            }
            else if(y < yzoom.startValue) {
                [x1, y1] = [x, undefined];
                chart.getZr().setCursorStyle('e-resize');
                chart.getZr().on('mousemove', dragAxisZoom);
            }
            else {
                // If double click in blank chart zone, maximizes selected chart
                if((!e.target) && (performance.now() - lastClickTime) < Const.DOUBLE_CLICK_TIMEOUT) {
                    if(idTimer) clearTimeout(idTimer);
                    $(document).trigger(ChartView.EVENT_MAXIMIZE_CHART, [chart.id]);
                }
                else {
                    // Unselect all graphic's controls except clicked one
                    idTimer = setTimeout( () => processClick.call(this, e), Const.DOUBLE_CLICK_WAIT);
                }
                lastClickTime = performance.now();
            }
        });

        function processClick(e) {
            if(chart.id != ChartView.lastSelectedChart) {
                $(document).trigger(ChartView.EVENT_SELECT_CHART, [chart.id]);
                ChartView.lastSelectedChart = chart.id;
            }

            let target_name = (e.target) ? e.target.parent.name : '';
            Object.keys(this.chart_tree).forEach( chartId => {
                Object.values(this.chart_tree[chartId][Const.GRAPHICS_ID]).forEach( g => {
                    if(g[Const.ID_ID] != target_name) {
                        if(typeof g.unselect == "function") {
                            g.unselect();
                        }
                    }
                });
            });
        }

        function dragAxisZoom(e) {
            if(x1) {
                chart.getZr().setCursorStyle('e-resize');

                x2 = chart.convertFromPixel({ xAxisIndex:0 }, e.offsetX);
                let xzoom = chart._model.option.dataZoom.filter(z => z.id.includes(ChartView.DATA_ZOOM_X_INSIDE_ID))[0];
                let yzoom = chart._model.option.dataZoom.filter(z => z.id.includes(ChartView.DATA_ZOOM_Y_INSIDE_ID))[0];
                let delta = (x2 - x1);
                // Zoom over sign, stops zoom
                that.zoomChart({
                    zoom: { startValue: { x: xzoom.startValue - delta, y: yzoom.startValue },
                                    endValue: { x: xzoom.endValue + delta, y: yzoom.endValue },
                                    onlyValid: [false, false],
                            },
                    chart
                });
                x1 = x2;
            }
            else if(y1) {
                chart.getZr().setCursorStyle('n-resize');

                y2 = chart.convertFromPixel({ yAxisIndex:0 }, e.offsetY);
                let xzoom = chart._model.option.dataZoom.filter(z => z.id.includes(ChartView.DATA_ZOOM_X_INSIDE_ID))[0];
                let yzoom = chart._model.option.dataZoom.filter(z => z.id.includes(ChartView.DATA_ZOOM_Y_INSIDE_ID))[0];
                let delta = -(y2 - y1);
                // Zoom over sign, stops zoom
                that.zoomChart({
                    zoom: { startValue: { x: xzoom.startValue, y: yzoom.startValue - delta },
                                    endValue: { x: xzoom.endValue, y: yzoom.endValue + delta },
                                    onlyValid: [false, false],
                                },
                                chart
                });
                y1 = y2;
            }
        }

        chart.getZr().on('mouseup', (e) => {
            x1 = 0;
            y1 = 0;
            chart.getZr().off('mousemove', dragAxisZoom);
            chart.getZr().setCursorStyle('crosshair');
        });
    }

    zoomAxisWheel({chart, id}) {
        let lastWheel = performance.now();
        if(chart) {
            chart.getZr().on('mousewheel', (e) => {
                if( (performance.now() - lastWheel) > 30) {
                    let _rect = chart._coordSysMgr._coordinateSystems[0].model.coordinateSystem._axesMap.y[0].grid._rect;
                    let yAxisX = _rect.width + _rect.x;
                    let xAxisY = _rect.height + _rect.y;
                    // Ignore zoom if crossing both axis
                    let crossPoint = ((e.offsetX > yAxisX) && (e.offsetY > xAxisY));
                    let chartZone = ((e.offsetX < yAxisX) && (e.offsetY < xAxisY));
                    if( crossPoint || chartZone ) {}
                    else {
                        let xZoom = chart._model.option.dataZoom.filter(z => z.id.includes(ChartView.DATA_ZOOM_X_INSIDE_ID))[0];
                        let yZoom = chart._model.option.dataZoom.filter(z => z.id.includes(ChartView.DATA_ZOOM_Y_INSIDE_ID))[0];

                        let yStart = yZoom.startValue;
                        let yEnd = yZoom.endValue;
                        let xStart = xZoom.startValue;
                        let xEnd = xZoom.endValue;
                        let delta = -e.wheelDelta;

                        if(e.offsetX > yAxisX) {
                            let absErr = (yEnd - yStart) / (yEnd + yStart);
                            delta = (absErr * 0.2) * Math.sign(delta); // 20% zoom of total visual range
                            yStart *= (1-delta);
                            yEnd *= (1+delta);
                        }
                        else if(e.offsetY > xAxisY) {
                            let absErr = (xEnd - xStart) / (xEnd + xStart);
                            delta = (absErr * 0.2) * Math.sign(delta); // 20% zoom of total visual range
                            xStart *= (1-delta);
                            xEnd *= (1+delta);
                            if(xStart > xEnd) {
                                [xStart, xEnd] = [xEnd, xStart];
                            }
                        }

                        this.zoomChart({
                            zoom: { startValue: { x: xStart, y: yStart },
                                    endValue: { x: xEnd, y: yEnd },
                                    onlyValid: [false, false],
                            },
                            chart
                        });
                    }
                    
                }
            });
        }
    }

    select({chart, items}) {
        if((items instanceof Array) == false) {
            items = [items];
        }

        if(items[0] == '*') {
            Object.values(this.chart_tree[chart.id][Const.GRAPHICS_ID]).forEach( g => {
                if(typeof g.select == 'function') {
                    g.select();
                }
            });
        }
        else {
            items.forEach( i => {
                let item = this.chart_tree[chart.id][Const.GRAPHICS_ID][i];
                if(typeof item.select == 'function') {
                    item.select();
                }
            });
        }
    }

    unselect({chart, items}) {
        if((items instanceof Array) == false) {
            items = [items];
        }

        if(items[0] == '*') {
            Object.values(this.chart_tree[chart.id][Const.GRAPHICS_ID]).forEach( g => {
                if(typeof g.unselect == 'function') {
                    g.unselect();
                }
            });
        }
        else {
            items.forEach( i => {
                let item = this.chart_tree[chart.id][Const.GRAPHICS_ID][i];
                if(typeof item.unselect == 'function') {
                    item.unselect();
                }
            });
        }
    }
}