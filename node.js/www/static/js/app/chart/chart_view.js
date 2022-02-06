/**file: chart_view.js */


class ChartView {

    // ----------------------------- STATIC, CONSTANTS -----------------------------
    static CHART_TOOLTIP_HEADER_DUMMY = '<p class="chart-tooltip-text" style="color: rgba(0,0,0,0);">';
    static CHART_TOOLTIP_TEXT = '<p class="chart-tooltip-text">';
    static P_CLOSE = '</p>';
    static CHART_TOOLTIP_VALUES = '<p class="chart-tooltip-values" style="';
    static VALUES_CLOSE = '">';
    static BACKGROUND_COLOR = 'var(--border-color)';//'#353535';

    static TREND_TEXT_ID = { [Const.BULL_ID]: '_BULL_', [Const.BEAR_ID]: '_BEAR_', [Const.BOTH_ID]: '_BOTH_'};
    static LINE_COLOR = { [Const.BULL_ID]: 'rgba(0, 255, 0, 0.8)', [Const.BEAR_ID]: 'rgba(255, 0, 0, 0.8)', [Const.BOTH_ID]: 'rgba(181, 19, 187, 0.8)'};
    static MARK_TEXT_ID = { [Const.BULL_ID]: '_MARK_BULL_', [Const.BEAR_ID]: '_MARK_BEAR_', [Const.BOTH_ID]: '_MARK_BOTH_'};
    static MARK_OFFSET = { [Const.BULL_ID]: [0, -20], [Const.BEAR_ID]: [0, 30], [Const.BOTH_ID]: [0, 0]};
    static MARK_COLOR = { [Const.BULL_ID]: 'rgba(0, 255, 0, 1)', [Const.BEAR_ID]: 'rgba(255, 0, 0, 1)', [Const.BOTH_ID]: 'rgba(181, 19, 187, 1)'};

    static TRENDS = [ Const.BULL_ID, Const.BEAR_ID, Const.BOTH_ID ];

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
    static DATA_ZOOM_Y_INSIDE_ID = 'y_inside';
    static DATA_ZOOM_X_INSIDE = {
                            id:'x_inside',
                            type: 'inside',
                            xAxisIndex: [0],
                            // realtime: true,
                            zoomOnMouseWheel: true,
                            moveOnMouseWheel: 'ctrl',
                            // start: 30,
                            // end: 70,
                            // start: 99,
                            // end: 100,
                            // filterMode: 'none',
                        };
    static DATA_ZOOM_X_SLIDER = {
                            id:'x_slider',
                            type: 'slider',
                            xAxisIndex: [0],
                            // realtime: true,
                            dataBackground: {
                                areaStyle: { opacity: 0.1, color: '#8392A5'},
                                lineStyle: { opacity: 0.1, color: '#8392A5'}
                            },
                            backgroundColor: 'rgba(47, 69, 84, 0)',
                            fillerColor: 'rgba(47, 69, 84, 0.3)',
                            handleSize: '100%',
                            moveHandleSize: '35%',
                            moveHandleStyle: {
                                color: 'rgba(47, 69, 84, 0)',
                                borderWidth: 0,
                                borderCap: 'round',
                            },
                            height: ChartView.DATA_ZOOM_SLIDER_HIGHT, //slider_height,
                            bottom: '2%', //slider_vert_offset,
                            // start: 30,
                            // end: 70,
                            filterMode: 'none',
                        };
    static DATA_ZOOM_Y_INSIDE = {
                            id:'y_inside',
                            type: 'inside',
                            yAxisIndex: [0],
                            zoomOnMouseWheel: 'shift',
                            // start: 25,
                            // end: 35,
                            filterMode: 'none',
                        };

    // ----------------------------- PROPERTIES -----------------------------
    cnf = new ChartSettings();
    #chart_view;
    timeFrame = '';
    
    //----------------------------- CONSTRUCTOR -----------------------------
    constructor(chartSettings) {
        if(chartSettings) {
            this.cnf = chartSettings;
        }
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #split_retracements(data_source, query) {
        let res;
        console.time('split_retracements');
        
        let data_x = {};
        let data = {};
        let data_ret = {};
        let data_delta_ini = {};
        let data_delta_fin = {};
        let data_ret_levels = [];
        let data_ret_prices = {};
        let stats = {}
        let level_;
        let name_;
        let model_key_;

        console.log(data_source);

        try {
            if(!data_source) {
                throw ('No data available.');
            }

            // if (rawData[Const.TIPO_PARAM_ID] != Const.RETROCESOS_ID) {
            if ((data_source instanceof Retracement) == false) {
                throw('Retracement data type expected, received ' + typeof data_source + ' instead.');
            }

            stats = data_source.stats;
            let bull = (data_source.data[Const.BULL_ID] != undefined) ? data_source.data[Const.BULL_ID][data_source[Const.LEVEL_ID]].filter(d => d[Const.TREND_ID] > 0) : [];
            let bear = (data_source.data[Const.BEAR_ID] != undefined) ? data_source.data[Const.BEAR_ID][data_source[Const.LEVEL_ID]].filter(d => d[Const.TREND_ID] < 0) : [];
            data_ret[Const.BULL_ID] = bull.map( d => [[d[Const.END_ID].time, d[Const.END_ID].price], d[Const.RET_ID]] );
            data_ret[Const.BEAR_ID] = bear.map( d => [[d[Const.END_ID].time, d[Const.END_ID].price], d[Const.RET_ID]] );
            data_ret_levels = data_source[Const.RET_LEVELS_ID];
            data_ret_prices[Const.BULL_ID] = bull.map( d => [].concat(data_ret_levels.map(l => d[l])) );
            data_ret_prices[Const.BEAR_ID] = bear.map( d => [].concat(data_ret_levels.map(l => d[l])) );
            
            data_delta_ini[Const.BULL_ID] = bull.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_INIT_ID]] );
            data_delta_fin[Const.BULL_ID] = bull.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_END_ID]] );
            data_delta_ini[Const.BEAR_ID] = bear.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_INIT_ID]] );
            data_delta_fin[Const.BEAR_ID] = bear.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_END_ID]] );

            // data[Const.BULL_ID] = [].concat( ...bull.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) ) );
            // data[Const.BEAR_ID] = [].concat( ...bear.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) ) );
            data[Const.BULL_ID] = bull.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) );
            data[Const.BEAR_ID] = bear.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) );
            
            // console.log(data_ret);
            // console.log(data_x);
            // console.log(data_y);
            // console.log(data_delta_ini);
            // console.log(data_delta_fin);


            level_ = query[Const.LEVEL_ID];
            name_ = data_source[Const.NAME_ID];
            model_key_ = query.model_key;
            // if(!this.#pattern_result) { this.#pattern_result = {}; }
            // if(!this.#pattern_result[level_]) { this.#pattern_result[level_] = {}; }

            // this.#pattern_result[level_][name_] = {
            //     id: rawData[Const.ID_ID][0],
            //     name: name_,
            //     dataType: rawData[Const.TIPO_PARAM_ID],
            //     stats: stats,
            //     data_x: {[level_]: data_x},
            //     data_y: {[level_]: data_y},
            //     data_ret: {[level_]: data_ret},
            //     data_ret_values: {[level_]: data_ret_values},
            //     data_ret_levels: {[level_]: data_ret_levels},
            //     delta_ini: {[level_]: data_delta_ini},
            //     delta_fin: {[level_]: data_delta_fin},
            //     level: level_,
            //     query: query,
            //     model_key: model_key_,
            // };
            // this.#pattern_result[level_][name_] = {
            res = {
                id: query[Const.ID_ID],
                name: name_,
                dataType: data_source.dataType,
                stats: stats,
                // data_x: data_x,
                data: data,
                data_ret: data_ret,
                data_ret_values: data_ret_levels,
                data_ret_levels: data_ret_prices,
                delta_ini: data_delta_ini,
                delta_fin: data_delta_fin,
                level: level_,
                search_in: query[Const.SEARCH_IN_ID],
                query: query,
                model_key: model_key_,
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


    //----------------------------- PUBLIC METHODS -----------------------------
    create_chart(frame) {
        let chart = echarts.init(frame);
        // let timeFrame = this.create_time_frame(name);
        // $(frame).append(timeFrame);
        $(window).resize(function() { chart.resize(); });
        return chart;
    }

    // create_time_frame(name='') {
    //     let id = '';
    //     if(name != '') {
    //         id='id="chart-time-frame-' + name + '"';
    //     }
    //     let timeFrame = '<ul ' + id + ' class="chart-time-frame">';
    //     for(let i=0; i<Time.TIME_FRAMES.length; i++) {
    //         timeFrame += '<li class="chart-time-frame-time">' + Time.TIME_FRAMES[i] + '</li>';
    //     }
    //     timeFrame += '</ul>';
    //     return timeFrame;
    // }
    
    plot_candles(data, chart=null, clear=true)
    {
        let ret = 0;
        var that = this;
        try {
            
            if(!data) {
                throw ('No data available to plot.');
            }

            // if ((data) && (data.dataType != Const.ACTIVO_ID)) {
                // throw ('ACTIVO data type is needed to plot candles, received ' + data.dataType + ' instead.');
            // }

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
            
            this.clear_chart(chart);
// data.data_y.forEach( (v, i) => {
//     v.splice(0,0,data.data_x[i]);
// });
            // Specify the configuration items and data for the chart
            this.#chart_view = {
                
                animation: false,

                backgroundColor:this.cnf.colorBackground,

                axisPointer: {
                    link: [
                        {
                            xAxisIndex: 'all'
                        }
                    ],
                    label: {
                        backgroundColor: this.cnf.colorCross
                    }
                },

                grid: [
                    {
                        // left: grid_left,
                        // right: grid_right,
                        // top: '-' + vert_margins_pc,
                        // height: grid_height,
                        // left: 65,//'5%', //'-100%',
                        // right: '0%', //'-100%',
                        // top: '0%', //'-200%',
                        left: 65,
                        bottom: '8%',
                        height: '91.8%',
                        width: '96.6%',
                    },
                    // {
                    //     left: '5%',
                    //     right: '8%',
                    //     top: '80%',
                    //     height: '16%'
                    // }
                ],
                
                xAxis: [
                    {
                        // scale: true,
                        // type: 'category',
                        // type: 'datetime',
                        type: 'time',
                        // data: data.data_x,
                        backgroundColor: ChartView.BACKGROUND_COLOR,
                        position: 'bottom',
                        // offset:x_axis_vert_offset,
                        // offset: -150,
                        axisLine: { show: true, lineStyle: { color: this.cnf.colorTextAxis } },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: true },
                        min: null, //'1970-01-01 00:00:00',//'dataMin',
                        max: null, //'2022-11-01 00:00:00', //Time.add_value(Time.now(Time.FORMAT_STR), '1M').format(Time.FORMAT_STR),//'dataMax',
                        axisLabel: {
                            formatter: axisValue => {
                              return moment(axisValue).format("MM-DD HH:mm");
                            }
                        },
                    },
                ],

                yAxis:[
                    {
                        scale: true,
                        gridIndex: 0,
                        splitNumber: 10,
                        axisLine: { show: true },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: true, color: this.cnf.colorTextAxis },
                        min: min_y,
                        max: max_y,
                    },
                    // {
                    //     scale: true,
                    //     boundaryGap: false,
                    //     gridIndex: 1,
                    //     splitNumber: 2,
                    //     axisLine: { onZero: false },
                    //     axisTick: { show: false },
                    //     splitLine: { show: false },
                    //     axisLabel: { show: false },
                    // },
                ],
                // visualMap: [
                //     {
                //         show: false,
                //         seriesIndex: 1,
                //         dimension: 2,
                //         pieces: [
                //             {
                //                 value: 1,
                //                 color: this.cnf.colorUp
                //             },
                //             {
                //                 value: -1,
                //                 color: this.cnf.colorDown
                //             }
                //         ]
                //     },
                // ],
                dataZoom: [
                    ChartView.DATA_ZOOM_X_INSIDE,
                    ChartView.DATA_ZOOM_X_SLIDER,
                    ChartView.DATA_ZOOM_Y_INSIDE,
                ],

                series: [
                    {
                        id: data.name,
                        name: data.name,
                        type: 'candlestick',
                        clip: true,
                        // clip: false,
                        data: data.data_y,
                        itemStyle: {
                            color: this.cnf.colorUp,
                            color0: this.cnf.colorDown,
                            borderColor: this.cnf.colorBorderUp,
                            borderColor0: this.cnf.colorBorderDownd,
                        },
                        barWidth: '75%',
                    },
                    // {
                    //     name: 'Volume',
                    //     type: 'bar',
                    //     xAxisIndex: 1,
                    //     yAxisIndex: 1,
                    //     data: data.volumes
                    // }
                ],

                toolbox: {
                    feature: {
                        dataZoom: {
                            // yAxisIndex: true,
                        },
                        restore: {},
                        saveAsImage: {
                            name: data.name + '_' + data.marco + '_' + data.broker + '_' + Time.now(Time.FORMAT_FILE),
                            type: 'jpg',
                            excludeComponents: ['toolbox', 'title'],
                        },
                    },
                    top: grid_top,
                    right: tools_x_offset,
                },
                
                tooltip: {
                    useUTC: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    borderWidth: 0, //1,
                    borderColor: 'rgba(0,0,0,0)',//this.cnf.colorCross,
                    backgroundColor: 'rgba(0,0,0,0)',
                    padding: 0, //10,
                    textStyle: {
                        color: this.cnf.colorCross,
                        width: '65%',
                        height: '1em',
                        textBorderWidth: 0,
                    },
                    position: [x_offset, grid_top],
                    formatter: function(params, ticket, callback) {
                        return that.format_chart_tooltip(data, params);
                    },
                    extraCssText: 'box-shadow: 0 0 0 rgba(0,0,0,0)',
                },

            };

            // Display the chart using the configuration items and data just specified.
            chart.setOption(this.#chart_view);
            // chart.dispatchAction({
            //     type                    : 'takeGlobalCursor',
            //     key                     : 'dataZoomSelect',
            //     dataZoomSelectActive    : true,
            // });
            ret = data;
        }
        catch(error) {
            console.error(error);
            ret = error;
        }

        return ret;
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
            if ((data.dataType == "movements") == false) {
                throw ('"Movements" data type is needed to plot movements, received ' + typeof data + ' instead.');
            }

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
                markPoint: ret_markpoints_bull
            };

            let move_series_bear = {
                id: data.name + '_BEAR', name: data.name + '_BEAR',
                data: data.data_y[Const.BAJISTA_ID],
                type: 'line', color: "rgba(255, 255, 255, 0.8)",
                lineStyle: { width: 1, opacity: 0.8, },
                showSymbol: false,
                markPoint: ret_markpoints_bear
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

    plot_retracements(data_source, chart, query) {
        let ret;
        console.time('plot_retracements');
        try {
            let data = this.#split_retracements(data_source, query);

            // Labels for markpoint bull
            let ret_labels;
            let ret_markpoints;
            // let ret_labels_bull;
            // let ret_markpoints_bull;
            // let ret_series_bull = [];

            // let ret_labels_bear;
            // let ret_markpoints_bear;
            // let ret_series_bear = [];

            let ret_series = [];

            ChartView.TRENDS.forEach( t => {
                // Marks
                if(data.data_ret[t]) {
                    ret_labels = data.data_ret[t].map( (r, i) => {
                        return this.generate_label(r[0], r[1], data.name + ChartView.MARK_TEXT_ID[t] + i,
                                            ChartView.MARK_OFFSET[t], ChartView.MARK_COLOR[t]);
                    });
    
                    // Markpoint bull label
                    ret_markpoints = {
                        label: { formatter: r => (r.value != null) ? parseFloat(r.value).toFixed(3) + '' : '', },
                        data: ret_labels,
                    };
                }
                // Lines
                if(data.data[t]) {
                    let ret_series_trend = data.data[t].map( (r, i) => {
                        return {
                            id: data.id + ChartView.TREND_TEXT_ID[t] + i, name: data.name,
                            type: 'line', color: ChartView.LINE_COLOR[t],
                            lineStyle: { width: 2, opacity: 0.6, },
                            showSymbol: false,
                            data: r,
                            markPoint: ret_markpoints
                        }
                    });

                    ret_series = ret_series.concat(ret_series_trend);
                }
            });

            // ret_series = ret_series_bull.concat(ret_series_bear);

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
                        { type: 'group'}
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
        try {
            let curr_option = chart.getOption();
            if(series && (series.length == 0)) { return series; }
            if(curr_option) {
                if(series) {
                    let series_filt = curr_option.series;
                    for(let i=0; i<series.length; i++) {
                        for(let j=0; j<series_filt.length;) {
                            if((series_filt[j] != undefined) && (series_filt[j].id.includes(series[i]))) series_filt.splice(j,1);
                            else j++;
                        }
                    }
                    curr_option.series = [...new Set(series_filt)];
                    // let series_filt = [];
                    // series.forEach(se => {
                    //     // series_filt = series_filt.concat(curr_option.series.filter( s => (s!=null) && ((s.name.includes(se) == false) )) );
                    //     series_filt = series_filt.concat(curr_option.series.filter( s => (s!=null) && ((s.id.includes(se) == false) )) );
                    // });
                    // curr_option.series = [...new Set(series_filt)];
                    //// curr_option.series = curr_option.series.filter(s => (series.indexOf(s.name) < 0));
                }
                else {
                    if(curr_option.series) { curr_option.series = []; }
                }
                chart.setOption( { series:curr_option.series }, {replaceMerge: ['series']});
                ret = series;
            }
        }
        catch(error) {
            console.log('Error clearing chart: ', error);
            ret = error;
        }
        return ret;
    }

    zoom_chart(zoom, chart) {
        let ret;
        try {
            
            // chart.on('datazoom', function(params) {
            //     console.log(params);
            // });

            // let start = chart.convertToPixel({xAxisIndex: 0, yAxisIndex: 0}, [zoom.start, zoom.startValue]);
            // let end = chart.convertToPixel({xAxisIndex: 0, yAxisIndex: 0}, [zoom.end, zoom.endValue]);
            // chart.getModel().option.xAxis[0].data.slice(-1);
            // chart.getModel().option.xAxis[0].data.slice(-1);
            // chart.dispatchAction({
            //     type: 'dataZoom',
            //     startValue: startValue,
            //     endValue: endValue,
            //     start:start,
            //     end:end,
            // });

            // let maxValue = chart.getOption().yAxis[0].max; //Math.max(...chart.getModel().option.series[0].data.map(p=>p[2]).filter(v=>v!=undefined));
            // let data = chart.getModel().option.xAxis[0].data;
            let data = chart.getModel().option.series[0].data.filter(v=>v[1]).map(v => v[0]);
            let x_start_idx = data.indexOf(zoom.startValue.x);
            let x_end_idx = data.indexOf(zoom.endValue.x);
            if(!x_start_idx) {
                x_start_idx = 0;
            }

            let filtered = chart.getModel().option.series[0].data.filter(v=>v[1]).slice(x_start_idx, x_end_idx);
            let maxValue = Math.max(...filtered.map(v => v[3]));
            let minValue = Math.min(...filtered.map(v => v[4]));

            let margin = {
                x: (zoom.margin.x != null) ? zoom.margin.x : 0,
                y: (zoom.margin.y != null) ? zoom.margin.y : 0,
            }

            // Zoom from values
            if(zoom.startValue) {
                let marginValue = {
                    // x: parseInt((margin.x/100) * x_end_idx), //data.length),
                    x: parseInt(margin.x), //data.length),
                    y: parseInt((margin.y/100) * maxValue) //(maxValue - minValue))
                }

                let startValue = {
                    x: data[data.indexOf(zoom.startValue.x) - marginValue.x],
                    y: zoom.startValue.y - marginValue.y,
                }
                if(startValue.x == undefined)
                    startValue.x = data[0];

                let endValue = {
                    x: data[data.indexOf(zoom.endValue.x) + marginValue.x],
                    y: zoom.endValue.y + marginValue.y,
                }
                
                chart.dispatchAction({
                    type: 'dataZoom',
                    batch: [
                        {dataZoomId: 'x_inside', startValue: startValue.x, endValue: endValue.x, type: 'dataZoom',},
                        {dataZoomId: 'y_inside', startValue: startValue.y, endValue: endValue.y, type: 'dataZoom',}
                    ]
                });
            }
            // Zoom from percent
            else if(zoom.start) {
                // let startPrice = (zoom.startValue / maxValue) * 100 * (0.973);
                // let endPrice = (zoom.endValue / maxValue) * 100 * (1.027);
                // let data = chart.getModel().option.xAxis[0].data;
                // let startTime = ((data.indexOf(zoom.start) * 100) / data.length) * 0.93;
                // let endtime = ((data.indexOf(zoom.end) * 100) / data.length) * 1.07;

                chart.dispatchAction({
                    type: 'dataZoom',
                    batch: [
                        {dataZoomId: 'x_inside', start: zoom.start.x - margin.x, end: zoom.end.x + margin.x, type: 'dataZoom',},
                        {dataZoomId: 'y_inside', start: zoom.start.y - margin.y, end: zoom.end.y + margin.y, type: 'dataZoom',}
                    ]
                });
            }

            ret = zoom;
        }
        catch(error) {
            console.log('Error clearing chart: ', error);
            ret = error;
        }
        return ret;
    }

    plot_label(data, chart) {

    }

    format_chart_tooltip(data, params) {
        //Get max length of all values
        let len_max = 4;
        let open = '';
        let high = '';
        let low = '';
        let close = '';
        let width_values = 'width:' + len_max * 0.6 + 'em;';
        let color_values = 'color:rgba(0, 0, 0, 0);';
        let value;
        let color;
        try {
            if((params != undefined) && (params[0].value != undefined)) {
                if(params[0].value.includes(undefined)) {
                    if(params[0].axisValue > data.max_x) {
                        let idx_time = data.data_y.map(v=>v[Const.IDX_CANDLE_TIME]).indexOf(data.max_x);
                        // value = [params[0].value[0], ...data.data_y[data.data_x.indexOf(data.max_x)]];
                        value = [params[0].value[0], ...data.data_y[idx_time].slice(1, 5)];
                        color = (value[Const.IDX_CANDLE_OPEN] < value[Const.IDX_CANDLE_CLOSE]) ? this.cnf.colorUp : this.cnf.colorDown;
                    }
                    else {
                        let idx_time = data.data_y.map(v=>v[Const.IDX_CANDLE_TIME]).indexOf(data.max_x);
                        // value = [params[0].value[0], ...data.data_y[data.data_x.indexOf(data.min_x)]];
                        value = [params[0].value[0], ...data.data_y[idx_time].slice(1, 5)];
                        color = (value[Const.IDX_CANDLE_OPEN] < value[Const.IDX_CANDLE_CLOSE]) ? this.cnf.colorUp : this.cnf.colorDown;
                    }
                }
                else {
                    value = params[0].value;
                    color = params[0].color;
                }

                len_max = Math.max(...[value[Const.IDX_CANDLE_OPEN].toString().length, value[Const.IDX_CANDLE_CLOSE].toString().length,
                                    value[Const.IDX_CANDLE_HIGH].toString().length, value[Const.IDX_CANDLE_LOW].toString().length]);
                //Set length of container
                width_values = 'width:' + len_max * 0.6 + 'em;';
                //Set color for values (bull, bear colors)
                color_values = 'color:' + color + ';';
                
                //Adjust number of decimals to meet max length
                if(value.includes(undefined) == false) {
                    open = value[Const.IDX_CANDLE_OPEN];
                    let diff_dec = (len_max - open.toString().length) - 1;
                    open = (diff_dec > 0) ? open.toFixed(diff_dec) : open;
                    high = value[Const.IDX_CANDLE_HIGH];
                    diff_dec = (len_max - high.toString().length) - 1;
                    high = (diff_dec > 0) ? high.toFixed(diff_dec) : high;
                    low = value[Const.IDX_CANDLE_LOW];
                    diff_dec = (len_max - low.toString().length) - 1;
                    low = (diff_dec > 0) ? low.toFixed(diff_dec) : low;
                    close = value[Const.IDX_CANDLE_CLOSE];
                    diff_dec = (len_max - close.toString().length) - 1;
                    close = (diff_dec > 0) ? close.toFixed(diff_dec) : close;
                }
            }
        }
        catch(error) {
            console.error(error);
            // alert(error);
        }
        let info = '<div class="class-tooltip">' +
                        ChartView.CHART_TOOLTIP_HEADER_DUMMY + data.name + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_HEADER_DUMMY + data.marco + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_HEADER_DUMMY + data.broker + '__' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + '' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'O' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + open + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'H' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + high + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'L' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + low + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_TEXT + 'C' + ChartView.P_CLOSE +
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + ChartView.VALUES_CLOSE + close + ChartView.P_CLOSE +
                    '</div>';
        return info;
    }

    get_chart_view() {
        return this.#chart_view;
    }

    generate_label(coord, data, id='',
                    offset=[0,0], textColor='rgba(125,125,125,1)',
                    symbol='circle', showSymbol=false, symbolColor='rgba(0,0,0,0)', symbolSize=10) {

        let label = {
                    id: id, name: id,
                    coord: coord, value: data,
                    symbol: symbol,
                    showSymbol: showSymbol,
                    label: { offset: offset, color: textColor, },
                    itemStyle: { color: symbolColor, itemSize: symbolSize, },
        };

        return label;
    }
}