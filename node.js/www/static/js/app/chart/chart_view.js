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
    static DATA_ZOOM_Y_INSIDE_ID = 'y_inside';
    static DATA_ZOOM_X_INSIDE = {
                            id:'x_inside',
                            type: 'inside',
                            xAxisIndex: [0],
                            // realtime: true,
                            zoomOnMouseWheel: true,
                            moveOnMouseWheel: 'ctrl',
                            // animation: {
                            //    duration: 0,
                            //    easing: 'linear',
                            // }
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

    static CHART_ZOOM_DISABLED = [{ dataZoom: [/*ChartView.DATA_ZOOM_X_SLIDER*/] }, {replaceMerge: ['dataZoom']}];

    static prev_tooltip_info = '';

    // ----------------------------- PROPERTIES -----------------------------
    cnf = new ChartSettings();
    #chart_view; // TODO SOLO GUARDA OPTION DEL ULTIMO CHART, BORRAR?
    timeFrame = '';
    static chart_tree = {};
    selected = [];
    clicked = false;
    prev_zoom;// = { xdelta: 1, ydelta: 1 };
    
    //----------------------------- CONSTRUCTOR -----------------------------
    constructor(chartSettings) {
        if(chartSettings) {
            this.cnf = chartSettings;
        }
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    format_retracements(data_source) {
        let res;
        console.time('split_retracements');
        
        let data = [];
        let data_ret = [];
        let trend = [];
        // let data_delta_ini = {};
        // let data_delta_fin = {};
        // let data_ret_levels = [];
        // let data_ret_values = {};
        // let stats = {}
        // let level_;

        console.log(data_source);

        try {
            if(!data_source) {
                throw ('No data available.');
            }

            // Iterates over all retracement patterns names
            Object.keys(data_source).forEach(n => {
                // Iterates over all levels available in each retracement pattern
                Object.keys(data_source[n][Const.DATA_ID]).forEach(l => {
                    let dl = data_source[n][Const.DATA_ID][l];
                    data_ret.push(...dl.map(r => [[r[Const.END_ID].time, r[Const.END_ID].price], r[Const.RET_ID], Const.TREND_STR[r[Const.TREND_ID]], n] ));
                    data.push(...dl.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID], Const.TREND_STR[d[Const.TREND_ID]], d[Const.RET_LEVELS_ID], n ]
                                        .map(dd => dd.time ? [dd.time, dd.price] : dd) ));
                });
            });

            // data_ret = data_source.data[level].map( d => [[d[Const.END_ID].time, d[Const.END_ID].price], d[Const.RET_ID]] );
            // data = data_source.data[level].map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) );
            // trend = data_source.data[level].map(d => d[Const.TREND_ID]);

            // level_ = query[Const.LEVEL_ID];
            // model_key = query.model_key;
            // stats = data_source.stats;

            // let bull = data_source.data[level].filter(d => d[Const.TREND_ID] == Const.BULL);
            // let bear = data_source.data[level].filter(d => d[Const.TREND_ID] == Const.BEAR);
            // data_ret[Const.BULL_ID] = bull.map( d => [[d[Const.END_ID].time, d[Const.END_ID].price], d[Const.RET_ID]] );
            // data_ret[Const.BEAR_ID] = bear.map( d => [[d[Const.END_ID].time, d[Const.END_ID].price], d[Const.RET_ID]] );
            // data_ret_levels = data_source[Const.RET_LEVELS_ID];
            // data_ret_values[Const.BULL_ID] = bull.map( d => [].concat(data_ret_levels.map(l => d[l])) );
            // data_ret_values[Const.BEAR_ID] = bear.map( d => [].concat(data_ret_levels.map(l => d[l])) );
            
            // data_delta_ini[Const.BULL_ID] = bull.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_INIT_ID]] );
            // data_delta_fin[Const.BULL_ID] = bull.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_END_ID]] );
            // data_delta_ini[Const.BEAR_ID] = bear.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_INIT_ID]] );
            // data_delta_fin[Const.BEAR_ID] = bear.map( d => [d[Const.TIMESTAMP_ID],d[Const.DELTA_END_ID]] );

            // data[Const.BULL_ID] = bull.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) );
            // data[Const.BEAR_ID] = bear.map(d => [ d[Const.INIT_ID], d[Const.END_ID], d[Const.CORRECTION_ID] ].map(dd => [dd.time, dd.price]) );

            res = {
                // id: query[Const.ID_ID],
                // name: data_source[Const.NAME_ID],
                data: data,
                data_ret: data_ret,
                trend: trend,
                levels: [0],
                // dataType: data_source.dataType,
                // stats: stats,
                // data_ret_levels: data_ret_levels,
                // data_ret_values: data_ret_values,
                // delta_ini: data_delta_ini,
                // delta_fin: data_delta_fin,
                // level: level_,
                // search_in: query[Const.SEARCH_IN_ID],
                // query: query,
                // model_key: model_key,
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
                        let ret_levels = r[Const.RET_LEVELS_ID];
                        let levels = Object.keys(ret_levels);
                        let values = Object.values(ret_levels);
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
    create_chart(params) {
        let id = params.id;
        let frame = params.frame[0];
        let chart = echarts.init(frame);
        // chart.setOption({animatoinEasing: 'linear'});
        // chart.setOption({animationEasingUpdate: 'linear'});
        // chart.setOption({animationDuration: 0});
        // chart.setOption({animationDurationUpdate: 0});
        chart[Const.ID_ID] = id;
        // let timeFrame = this.create_time_frame(name);
        // $(frame).append(timeFrame);
        $(window).resize(function() { chart.resize(); });
        this.update_zoom(chart);
        this.zoomAxis(chart, id);
        ChartView.chart_tree[id] = {};
        ChartView.chart_tree[id][Const.CHART_ID] = chart;
        ChartView.chart_tree[id][Const.GRAPHICS_ID] = {};
        let chart_info = { chart: chart, id: id, num: params.num, frame: params.frame }
        return chart_info;
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
                        // left: 65,
                        left: '1%',
                        // bottom: '8%',
                        bottom: '10px',
                        // height: '91.8%',
                        height: '95%',
                        // width: '96.6%',
                        width: '98.5%',
                        containLabel: true,
                        // z: 99,
                        // zlevel: 1,
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
                        triggerEvent: true,
                        silent: false,
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
                        // boundaryGap: true,
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
                        triggerEvent: true,
                        silent: false,
                        gridIndex: 0,
                        splitNumber: 10,
                        axisLine: { show: true, lineStyle: { color: this.cnf.colorTextAxis } },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: true, color: this.cnf.colorTextAxis },
                        min: min_y,
                        max: max_y,
                        boundaryGap: true,
                        axisLabel: {
                            formatter: price => {
                                return price;
                            }
                        }
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
                    // ChartView.DATA_ZOOM_X_SLIDER,
                    ChartView.DATA_ZOOM_Y_INSIDE,
                ],

                series: [
                    {
                        id: data.name,
                        name: data.name,
                        type: 'candlestick',
                        clip: true,
                        data: data.data_y,
                        // connectNulls: true,
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
                        // restore: {},
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

    plot_retracements(data, chart) {
        let ret;
        console.time('plot_retracements');
        try {
            // let data = this.format_retracements(data_source, query);

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
            // ChartView.TRENDS.forEach( t => {
                // // Marks
                // if(data.data_ret[t]) {
                //     ret_labels = data.data_ret[t].map( (r, i) => {
                //         return this.generate_label(r[0], r[1], data[Const.NAME_ID] + ChartView.MARK_TEXT_ID[t] + i,
                //                             ChartView.MARK_OFFSET[t], ChartView.MARK_COLOR[t]);
                //     });
    
                //     // Markpoint label
                //     ret_markpoints = {
                //         label: { formatter: r => (r.value != null) ? parseFloat(r.value).toFixed(3) + '' : '', },
                //         data: ret_labels,
                //     };
                // }

                // Lines
                // if(data.data[t]) {
                //     let ret_series_trend = data.data[t].map( (r, i) => {
                //         return {
                //             id: data[Const.NAME_ID] + ChartView.TREND_TEXT_ID[t] + i, name: data[Const.NAME_ID],
                //             type: 'line', color: ChartView.LINE_COLOR[t],
                //             lineStyle: { width: 3, opacity: 0.6, },
                //             showSymbol: false,
                //             data: r,
                //             markPoint: ret_markpoints
                //         }
                //     });

                //     ret_series = ret_series.concat(ret_series_trend);
                // }
            // });

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
        try {
            let curr_option = chart.getOption();
            if(series && (series.length == 0)) { return series; }
            if(curr_option) {
                if(series) {
                    let chart_series = curr_option.series;
                    let graphics = (curr_option.graphic && (curr_option.graphic.length)) ? curr_option.graphic[0].elements : [];
                    for(let i=0; i<series.length; i++) {
                        graphics = [].concat(...graphics.filter( g => (g != undefined) && g.id.includes(series[i]) == false));
                        Object.keys(ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID]).forEach(g => {
                            if(g.includes(series[i])) {
                                if(ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID][g].remove) {
                                    ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID][g].remove(chart);
                                }
                                delete ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID][g];
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
                chart.setOption( { series: [] }, {replaceMerge: ['series']} );
                chart.setOption( { series: curr_option.series }, {replaceMerge: ['series']} );
                chart.setOption( { graphic: [] }, {replaceMerge: ['graphic']} );
                chart.setOption( { graphic: curr_option.graphic }, {replaceMerge: ['graphic']} );

                // Updates chart tree with deleted objects
                // series.forEach(s => {
                //     let gs = Object.values(ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID]).filter(sg => sg[Const.NAME_ID].includes(s));
                //     for(let ig=0; ig < gs.length; ig++) {
                //         if(gs[ig].remove()) {
                //             gs[ig].remove();
                //         }
                //         delete gs[ig];
                //     }
                // });
                // ChartView.chart_tree = ChartView.chart_tree.filter(o => series.includes(o.name) == false);

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
     * @param zoom: 2 types of settings. By values:
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
     * @returns Zoom object with updated information if ok. Error message other case.
     */
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

            let data = chart.getModel().option.series[0].data.filter(v=>v[1]).map(v => v[0]);
            
            let margin = {
                x: ( (zoom.margin != undefined) && (zoom.margin.x != null) ) ? zoom.margin.x : 0,
                y: ( (zoom.margin != undefined) && (zoom.margin.y != null) ) ? zoom.margin.y : 0,
            }
            let minValue = 0;
            let maxValue = 0;

            let tf = data[1] - data[0];
            let remainder = (zoom.startValue.x) ? (zoom.startValue.x % tf)  : 0;
            zoom.startValue.x = zoom.startValue.x - remainder;

            if(margin.x && margin.y) {
                let x_start_idx = (zoom.startValue != undefined) ? data.indexOf(Math.floor(zoom.startValue.x)) : 0;
                let x_end_idx = (zoom.endValue != undefined) ? data.indexOf(zoom.endValue.x) : 0;
                if(x_start_idx < 0) {
                    x_start_idx = 0;
                }
                if(x_end_idx < 0) {
                    x_end_idx = data.length-1;
                }

                let filtered = chart.getModel().option.series[0].data.filter(v=>v[1]).slice(x_start_idx, x_end_idx);
                maxValue = Math.max(...filtered.map(v => v[3]));
                minValue = Math.min(...filtered.map(v => v[4]));
            }

            // Zoom from values
            if(zoom.startValue) {
                let marginValue = {
                    x: parseInt(margin.x)*tf,
                    y: ( parseInt(margin.y) / 100 ) * (maxValue - minValue)
                }

                let startValue = {
                    x: zoom.startValue.x - marginValue.x,
                    y: zoom.startValue.y - marginValue.y,
                };

                if(( (zoom.onlyValid != undefined) && (zoom.onlyValid[0] == true) ) && (startValue.x == undefined)) {
                    startValue.x = data[0];
                }

                let endValue = {
                    x: zoom.endValue.x + marginValue.x,
                    y: zoom.endValue.y + marginValue.y,
                }
                if(( (zoom.onlyValid != undefined) && (zoom.onlyValid[1] == true) ) && (endValue.x == undefined)) {
                    endValue.x = data[data.length - 1];
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
        if((!params) || (params[0].componentSubType != 'candlestick')) {
            return ChartView.prev_tooltip_info;
        }

        //Get max length of all values
        let len_max = 4;
        let open = '';
        let high = '';
        let low = '';
        let close = '';
        let delta = '';
        let delta_pc = '';
        let width_values = 'width:' + len_max * 0.6 + 'em;';
        let color_values = 'color:rgba(0, 0, 0, 0);';
        let value;
        let color;
        let idx_time;
        try {
            if((params != undefined) && (params[0].value != undefined)) {
                if(params[0].value.includes(undefined)) {
                    if(params[0].axisValue > data.max_x) {
                        idx_time = data.data_y.map(v=>v[Const.IDX_CANDLE_TIME]).indexOf(data.max_x);
                        // value = [params[0].value[0], ...data.data_y[data.data_x.indexOf(data.max_x)]];
                        value = [params[0].value[0], ...data.data_y[idx_time].slice(1, 5)];
                        color = (value[Const.IDX_CANDLE_OPEN] < value[Const.IDX_CANDLE_CLOSE]) ? this.cnf.colorUp : this.cnf.colorDown;
                    }
                    else {
                        idx_time = data.data_y.map(v=>v[Const.IDX_CANDLE_TIME]).indexOf(data.min_x);
                        // value = [params[0].value[0], ...data.data_y[data.data_x.indexOf(data.min_x)]];
                        value = [params[0].value[0], ...data.data_y[idx_time].slice(1, 5)];
                        color = (value[Const.IDX_CANDLE_OPEN] < value[Const.IDX_CANDLE_CLOSE]) ? this.cnf.colorUp : this.cnf.colorDown;
                    }
                }
                else {
                    idx_time = params[0].dataIndex;
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
                    if(idx_time != undefined) {
                        let prev_close = data.data_y[idx_time-1][Const.IDX_CANDLE_CLOSE];
                        delta = (close - prev_close);
                        delta_pc = (delta/close) * 100;
                        delta = delta.toFixed((diff_dec > 0) ? diff_dec : 2);
                        delta_pc = delta_pc.toFixed(2);
                    }
                }
            }
        }
        catch(error) {
            // console.error(`value: ${value}.`);
            // console.error(error);
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
                        ChartView.CHART_TOOLTIP_VALUES + color_values + width_values + 'font-size: 0.9em;' + ChartView.VALUES_CLOSE + `${delta} (${delta_pc}%)` + ChartView.P_CLOSE +
                    '</div>';

        ChartView.prev_tooltip_info = info;
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
                    return this.generate_label(coord, value, name + ChartView.MARK_TEXT_ID[trend] + i,
                                        ChartView.MARK_OFFSET[trend], ChartView.MARK_COLOR[trend]);
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
        };

        return label;
    }
    
    draw_fibonacci(data, chart) {
        try {
            data.forEach(f => {
                try {
                    f.plot(chart);
                    // ChartView.#chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID].push(f);
                    ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID][f[Const.NAME_ID]] = f;
                }
                catch(error) {
                    console.error(`EXCEPTION draw_fibonacci:${error}.`);
                }
            });
        }
        catch(error) {
            console.error(error);
        }
    }

    update_zoom(chart) {
        // var zoom_enabled = true;
        // window.addEventListener('resize', updatePosition);
        // chart.on('dataZoom', updatePosition);
        // function updatePosition(z) {
        //     // if(zoom_enabled) {
        //     //     Object.values(ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID]).forEach(f => {
        //     //         f.plot(chart);
        //     //     });
        //     //     zoom_enabled = false;
        //     //     setTimeout(e => zoom_enabled = true, 100);
        //     // }
        // }
    }

    update(chart) {
        try {
            chart.resize();
            if(Object.keys(ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID]).length > 0) {
                let graphics = [];
                Object.values(ChartView.chart_tree[chart[Const.ID_ID]][Const.GRAPHICS_ID]).forEach( g => {
                    graphics.push(g.get_plot(chart));
                });
                chart.setOption( {graphic: []}, {replaceMerge: ['graphic']});
                chart.setOption( {graphic: graphics}, {replaceMerge: ['graphic']});
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    zoomAxis(chart, id) {
        var x1 = 0, y1 = 0;
        var x2 = 0, y2 = 0;
        var that = this;
        chart.getZr().on('mousedown', (e) => {
            let [x, y] = chart.convertFromPixel({ xAxisIndex:0, yAxisIndex:0}, [e.offsetX, e.offsetY]);
            let xzoom = chart._model.option.dataZoom.filter(z => z.id.includes('x_inside'))[0];
            let yzoom = chart._model.option.dataZoom.filter(z => z.id.includes('y_inside'))[0];
            if( (x < xzoom.startValue) && (y < yzoom.startValue)) {
            }
            else if(x < xzoom.startValue) {
                [x1, y1] = [undefined, y];
                chart.getZr().on('mousemove', dragAxisZoom);
                // console.log('y start:', yzoom.startValue);
                // console.log(`y1:${y1}`);
            }
            else if(y < yzoom.startValue) {
                [x1, y1] = [x, undefined];
                chart.getZr().on('mousemove', dragAxisZoom);
                // console.log('x start:', xzoom.startValue);
                // console.log(`x1:${x1}`);
            }
        });

        function dragAxisZoom(e) {
            if(x1) {
                x2 = chart.convertFromPixel({ xAxisIndex:0 }, e.offsetX);
                let xzoom = chart._model.option.dataZoom.filter(z => z.id.includes('x_inside'))[0];
                let yzoom = chart._model.option.dataZoom.filter(z => z.id.includes('y_inside'))[0];
                let delta = (x2 - x1)/25;
                // Zoom over sign, stops zoom
                // console.log(delta);
                that.zoom_chart({ startValue: { x: xzoom.startValue - delta, y: yzoom.startValue },
                                    endValue: { x: xzoom.endValue + delta, y: yzoom.endValue },
                                    onlyValid: [false, false],
                                }, chart);
            }
            else if(y1) {
                y2 = chart.convertFromPixel({ yAxisIndex:0 }, e.offsetY);
                let xzoom = chart._model.option.dataZoom.filter(z => z.id.includes('x_inside'))[0];
                let yzoom = chart._model.option.dataZoom.filter(z => z.id.includes('y_inside'))[0];
                let delta = (y2 - y1)/25;
                // Zoom over sign, stops zoom
                // console.log(delta);
                that.zoom_chart({ startValue: { x: xzoom.startValue, y: yzoom.startValue - delta },
                                    endValue: { x: xzoom.endValue, y: yzoom.endValue + delta },
                                    onlyValid: [false, false],
                                }, chart);
            }
        }

        chart.getZr().on('mouseup', (e) => {
            x1 = 0;
            y1 = 0;
            chart.getZr().off('mousemove', dragAxisZoom);
        });

        // chart.getZr().on('mousedown', (e) => {
        //     let graphics = chart.getOption().graphic;
        //     if(graphics && (graphics.length > 0)) {
        //         graphics = chart.getOption().graphic[0].elements;
        //         // Blank chart clicked
        //         if(e.target == undefined) {
        //             graphics.forEach( g => {
        //                 if((g.id.includes('CONTROL_START')) || (g.id.includes('CONTROL_END'))) {
        //                     let parent = chart.getOption().graphic[0].elements.filter(p => p.id == g.parentId)[0];
        //                     parent.onclick(false);
        //                 }
        //             });
        //             that.selected = [];
        //         }
        //         else if(e.target != undefined) {
        //             let fibos = graphics.filter( f => (f.id != e.target.parent.id) && (f.type == 'group') && (f.id.includes('FIBO')));
        //             that.selected = [e.target.parent.id];
        //             fibos.forEach( f=> f.onclick(false));
        //         }
        //     }
        // });

        // chart.on('mousedown', (params) => {
        //     console.log(params)
        // });

        // chart.on('click', (params) => {
        //     that.clicked = true;
        //     if(params.componentType == 'graphic') {
        //         let sel = params.event.target.parent.id;
        //         if(that.selected.includes(params.event.target.parent.id) == false) {
        //             that.selected = [sel];
        //         }
        //     }
        // });
    }
}