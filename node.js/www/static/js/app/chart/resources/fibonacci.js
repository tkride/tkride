/** fibonacci.js */

class Fibonacci extends ChartGraphic {
    // CONSTANTS
    static SELECTED = 0;
    static SHOW_CONTROLS = 1;
    static YMIN = 2;
    static XSTART = 3;
    static XEND = 4;
    static YSTART = 5;
    static YEND = 6;
    static NUM_VALUES = 7;
    static YVALUES = 8;

    // static TREND = 2;
    static YVALUE = 0;
    static TEXT = 1;
    static STROKE = 2;
    static FILL = 3;
    
    // PROPERTIES
    trend;
    width;
    height;
    length = 0;
    levels = [];
    ydelta = {};
    yvalues = [];
    yvalues_chart = [];
    lineWidth = 1;
    lineDashStep = [0];
    opacity = 1;
    lineColor = [];
    fillColor = []
    textShow = true;
    textSide = 'right';
    textInfo = '%';
    that = this;

    constructor(retracement, params) {
        if(!params) { params = {}; }
        
        let ret_levels = retracement[Const.RET_LEVELS_ID];
        let levels_tmp = Object.keys(ret_levels);
        let yvalues_tmp = Object.values(ret_levels);

        super({ name: `${Const.FIBO_RET_ID}${(params.name) ? '_'+params.name:''}_${retracement[Const.HASH_ID]}`,
                 xstart: retracement[Const.END_ID].time,
                 xend: retracement[Const.CORRECTION_ID].time,
                //  ystart: Math.min(...yvalues_tmp),
                // yend: Math.max(...yvalues_tmp),
                 ystart: retracement[Const.INIT_ID].price,
                 yend: retracement[Const.END_ID].price,
                 draggable: params.draggable,
                 resizable: params.resizable,
                });

        this.trend = Const.TREND_STR[retracement[Const.TREND_ID]];
        this.levels = levels_tmp;
        this.yvalues = yvalues_tmp;
        this.ydelta = {
            [Const.DELTA_INIT_ID]: retracement[Const.DELTA_INIT_ID],
            [Const.DELTA_END_ID]: retracement[Const.DELTA_END_ID]
        };
        this.length = this.levels.length;

        // Text
        if(params.textShow) { this.textShow = params.textShow; }
        if(params.textSide) { this.textSide = params.textSide; }
        if(params.textInfo) { this.textInfo = params.textInfo; }
        
        // Style
        if(params.lineDashStep) { this.lineDashStep = params.lineDashStep; }
        if(params.lineWidth) { this.lineWidth = params.lineWidth; }
        if(params.opacity) { this.opacity = params.opacity; }
        if(params.lineColor) { this.lineColor = params.lineColor; }
        else {
            for(let i = 0; i < this.length; i++) {
                let r = Math.floor((Math.random() * 255));
                let g = Math.floor((Math.random() * 255));
                let b = Math.floor((Math.random() * 255));
                this.lineColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
                this.fillColor.push(`rgba(${r}, ${g}, ${b}, ${this.opacity})`);
            }
        }

        this.MOUSEDOWN_CONTROL = {
            [`${this.name}${ChartGraphic.CONTROL_START}`]: this.mousedown_control_start,
            [`${this.name}${ChartGraphic.CONTROL_END}`]: this.mousedown_control_end,
        };
        this.MOUSEDOWN_DEFAULT = this.mousedown_control;

        this.MOUSEUP_CONTROL = {
            [`${this.name}${ChartGraphic.CONTROL_START}`]: this.mouseup_control_start,
            [`${this.name}${ChartGraphic.CONTROL_END}`]: this.mouseup_control_end,
        };
        this.MOUSEUP_DEFAULT = this.mouseup_control;

        // Fill data
        this.update_data();
    }

    update_data() {
        // Width is fixed, so it's appended first once
        this.data = [];
        let ymin = Math.min(...this.yvalues);
        // let change_start_controls = ((this.ystart > this.yend) && (this.trend == Const.BULL_ID)) ? true : false;
        let text = this.get_text();
        this.data = [this.selected, /*change_start_controls*/this.show_controls, ymin, this.xstart, this.xend, this.ystart, this.yend, this.yvalues.length];
        for(let i=0; i<this.yvalues.length; i++) {
            this.data.push(...[this.yvalues[i], text[i], this.lineColor[i], this.fillColor[i]]);
        }
        this.data = [this.data];
    }

    render(param, api) {
        if (param.context.rendered) {
            return;
        }
        param.context.rendered = true;

        let name = param.seriesName;
        let xstart = api.coord([api.value(Fibonacci.XSTART), 0])[0];
        let xend = api.coord([api.value(Fibonacci.XEND), 0])[0];
        let ystart = api.value(Fibonacci.YSTART);
        let yend = api.value(Fibonacci.YEND);
        let ymin =  api.value(Fibonacci.YMIN);
        ystart = api.coord([0, ystart])[1];
        yend = api.coord([0, yend])[1];
        ymin =  api.coord([0, ymin])[1];
        let show_controls = api.value(Fibonacci.SHOW_CONTROLS);
        // let trend = api.value(Fibonacci.TREND);
        let selected = (api.value(Fibonacci.SELECTED) == true) ? true : false;

        //Width is fixed
        let width = xend - xstart;
        let yvalue, stroke, fill, height, text;
        let children = [];
        
        // let len = param.encode.y.length - 2;
        let len = api.value(Fibonacci.NUM_VALUES);
        for(let j=0; j<len; j++) {
            let idx = Fibonacci.YVALUES + (j*4);
            yvalue = api.coord([0, api.value(Fibonacci.YVALUE + idx)])[1];
            text = api.value(Fibonacci.TEXT + idx);
            [stroke, fill] = [api.value(Fibonacci.STROKE + idx), api.value(Fibonacci.FILL + idx)];

            height = Math.abs(yvalue - ymin);
            children.push([
                {
                    type: 'rect',
                    id: `${name}_LEVEL_${text}`,
                    name: `${name}_LEVEL_${text}`,
                    x: xstart,
                    y: yvalue,
                    z: 100,
                    shape: {
                        x: 0,
                        y: 0,
                        width: width,
                        height: height,
                    },
                    style: {
                        fill: fill,
                        stroke: stroke,
                        lineWidth: 1,
                        lineDash: [width, (width) + 2*height],
                    },
                },
                {
                    type: 'text',
                    id: `${name}_TEXT_${text}`,
                    name: `${name}_TEXT_${text}`,
                    z: 101,
                    x: xend + 5,
                    y: yvalue - 5,
                    style: {
                        fill: stroke,
                        width: width,
                        text: text,
                    }
                },
            ]);
        }

        children.push(...super.get_control_handler({ id: name,
                                                     xstart: xstart,
                                                     ystart: ystart,
                                                     xend: xend,
                                                     yend: yend,
                                                     radius: ChartGraphic.CIRCLE_RADIUS,
                                                     invisible: (show_controls) ? false : true,
                                                     stroke: ChartGraphic.CIRCLE_COLOR,
                                                     lineWidth: (selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
                                                    })
        );
        //     [{
        //         type: 'circle',
        //         id: `${name}_CONTROL_START`,
        //         name: `${name}_CONTROL_START`,
        //         z: 102,
        //         invisible: (show_controls) ? false : true,
        //         draggable: true,
        //         shape: {
        //             cx: xstart,
        //             cy: ystart,
        //             r: 6, 
        //         },
        //         style: {
        //             stroke: ChartGraphic.CIRCLE_COLOR,
        //             lineWidth: (selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
        //         },
        //     },
        //     {
        //         type: 'circle',
        //         z: 102,
        //         id: `${name}_CONTROL_END`,
        //         name: `${name}_CONTROL_END`,
        //         invisible: (show_controls) ? false : true,
        //         draggable: true,
        //         shape: {
        //             cx: xend,
        //             cy: yend,
        //             r: 6, 
        //         },
        //         style: {
        //             stroke: ChartGraphic.CIRCLE_COLOR,
        //             lineWidth: (selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
        //         },
        // }]
        // );

        //

        let fibo = {
            type: 'group',
            id: `${name}`,
            name: `${name}`,
            children: [].concat(...children),
            draggable: true,
        }

        return fibo;
    }
    
    set_option(chart) {
        let yenc = [Fibonacci.YSTART, Fibonacci.YEND].concat(...this.yvalues.map( (el, i) => Fibonacci.YVALUES + (i*4)));
        chart.setOption({ /*graphic: controls,*/
                          series: [{
                                id: this.name,
                                name: this.name,
                                type: 'custom',
                                renderItem: this.render,
                                encode: {
                                    x: [Fibonacci.XSTART, Fibonacci.XEND],
                                    y: yenc,
                                },
                                data: this.data,
                            }],
        },
        );
    }

    plot(chart) {
        this.chart = chart;

        this.set_option(chart);
        this.bind_handler_events();

        // chart.on('dataZoom', { seriesName: this.name } , (c) => {
        //     // console.log(c);
        //     super.get_controls(chart);
        //     super.plot_controls(chart);
        // });
        
        // chart.on('mousedown', { seriesName: this.name }, c => {
        //     let func = this.MOUSEDOWN_CONTROL[c.event.target.name] || this.MOUSEDOWN_DEFAULT;
        //     if(typeof func == 'function') {
        //         func.call(this, c);
        //     }
        // });
        
        // chart.on('click', { element: `${this.name}_CONTROL_START` }, c => {
        //     console.log(this.name);
        // });

        // chart.on('click', { element: `${this.name}_CONTROL_END` }, c => {
        //     console.log(this.name);
        // });

        return this.controls;
    }

    update_option() {
        this.update_data();
        this.chart.setOption({ series: [{
                id: this.name,
                data: this.data,
            }] },
        );
    }

    get_plot(chart) {
        var that = this;
        let children = [];
        this.chart = chart;
        
        [this.xstart_chart, this.ystart_chart] = chart.convertToPixel({xAxisIndex: 0, yAxisIndex: 0}, [this.xstart, this.ystart]);
        [this.xend_chart, this.yend_chart] = chart.convertToPixel({xAxisIndex: 0, yAxisIndex: 0}, [this.xend, this.yend]);
        let text = this.get_text();

        // Draws Fibonacci levels
        for(let i = 0; i < this.length; i++) {
            this.yvalues_chart[i] = chart.convertToPixel({yAxisIndex:0}, this.yvalues[i]);
            this.width = this.xend_chart - this.xstart_chart;
            this.height = Math.abs(this.yvalues_chart[i] - this.ystart_chart);
            children.push([
                {
                    type: 'rect',
                    id: `${this.name}_LEVEL_${this.yvalues[i]}`,
                    x: this.xstart_chart,
                    y: this.yvalues_chart[i],
                    z: 100,
                    // renderItem: this.renderItem,
                    shape: {
                        x: 0,
                        y: 0,
                        width: this.width,
                        height: this.height,
                    },
                    style: {
                        fill: this.fillColor[i],
                        stroke: this.lineColor[i],
                        lineWidth: 1,
                        lineDash: [this.width, (this.width) + 2*(this.height)],
                    },
                },
                {
                    type: 'text',
                    id: `${this.name}_TEXT_${this.yvalues[i]}`,
                    z: 101,
                    left: this.xend_chart + 5,
                    top: this.yvalues_chart[i] - 5,
                    style: {
                        fill: this.lineColor[i],
                        width: this.width,
                        // overflow: 'break',
                        text: text[i],
                    }
                },
            ]);
        }

        children.push(
            [{
                type: 'circle',
                id: `${this.name}_START`,
                z: 102,
                invisible: (this.selected) ? false : true,
                draggable: true,
                shape: {
                    cx: this.xstart_chart,
                    cy: this.ystart_chart,
                    r: 6, 
                },
                style: {
                    stroke: ChartGraphic.CIRCLE_COLOR,
                    lineWidth: (this.selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
                },
                ondrag(c) {
                    [that.xstart, that.ystart] = that.chart.convertFromPixel({xAxisIndex:0, yAxisIndex:0}, [that.xstart_chart + this.x, that.ystart_chart + this.y]);
                    for(let i = 0; i < that.length; i++) {
                        that.yvalues[i] = that.chart.convertFromPixel({yAxisIndex:0}, (that.yvalues_chart[i] + this.y));
                    }
                    // that.plot(that.chart);
                    // let ctrl = that.get_plot(that.chart);
                    // that.chart.setOption({graphic: ctrl}, {replaceMerge: ['graphic']});
                }
            },
            {
                type: 'circle',
                id: `${this.name}_END`,
                z: 102,
                invisible: (this.selected) ? false : true,
                draggable: true,
                shape: {
                    cx: this.xend_chart,
                    cy: this.yend_chart,
                    r: 6, 
                },
                style: {
                    stroke: ChartGraphic.CIRCLE_COLOR,
                    lineWidth: (this.selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
                },
                // ondrag(c) {
                //     [that.xend, that.yend] = that.chart.convertFromPixel({xAxisIndex:0, yAxisIndex:0}, [that.xend_chart + this.x, that.yend_chart + this.y]);
                //     for(let i = 0; i < that.length; i++) {
                //         that.yvalues[i] = that.chart.convertFromPixel({yAxisIndex:0}, (that.yvalues_chart[i] + this.y));
                //     }
                // }
            }]
        )
        
        let fibo = {
            type: 'group',
            id: this.name,
            children: [].concat(...children),
            draggable: this.draggable,
            // renderItem: this.renderItem,
            // ondragstart: (d) => {
            //     that.selected = true;
            //     that.show_controls();

            //     if(that.dragging == false) {
            //         let dz = chart.getOption().dataZoom;
            //         let xi = dz.filter(z => z.id == 'x_inside')[0];
            //         let yi = dz.filter(z => z.id == 'y_inside')[0];
            //         chart.setOption(...ChartView.CHART_ZOOM_DISABLED);
            //         if(xi) {
            //             ChartView.DATA_ZOOM_X_INSIDE.start = xi.start;
            //             ChartView.DATA_ZOOM_X_INSIDE.end = xi.end;
            //         }
            //         if(yi) {
            //             ChartView.DATA_ZOOM_Y_INSIDE.start = yi.start;
            //             ChartView.DATA_ZOOM_Y_INSIDE.end = yi.end;
            //         }
            //         that.dragging = true;
            //     }
            // },
            // ondrag(d) {
            //     [that.xstart, that.ystart] = that.chart.convertFromPixel({xAxisIndex:0, yAxisIndex:0}, [that.xstart_chart + this.x, that.ystart_chart + this.y]);
            //     [that.xend, that.yend] = that.chart.convertFromPixel({xAxisIndex:0, yAxisIndex:0}, [that.xend_chart + this.x, that.yend_chart + this.y]);
            //     for(let i = 0; i < that.length; i++) {
            //         that.yvalues[i] = that.chart.convertFromPixel({yAxisIndex:0}, (that.yvalues_chart[i] + this.y));
            //     }
            // },
            // ondragend: (d, b) => {
            //     that.dragging = false;
            //     chart.setOption( { dataZoom: [
            //         ChartView.DATA_ZOOM_X_INSIDE,
            //         // ChartView.DATA_ZOOM_X_SLIDER,
            //         ChartView.DATA_ZOOM_Y_INSIDE,
            //     ] });
            // },
            // onmouseover(m) {
            //     if(that.selected == false) {
            //         that.show_controls();
            //     }
            // },
            // onmouseout(m) {
            //     if(that.selected == false) {
            //         that.hide_controls();
            //     }
            // },
            // onclick(c) {
            //     if(c == false) {
            //         that.selected = false;
            //         that.hide_controls();
            //     }
            //     else {
            //         that.selected = true;
            //         that.show_controls();
            //     }
            // }
        }

        return fibo;
    }

    remove(chart) {
        let gElements = chart.getOption().graphic;
        if(gElements && gElements[0].length) {
            let idx = gElements.findIndex(g => g.id == this.name);
            gElements.splice(idx, 1);
            chart.setOption({graphic: gElements});
        }
        this.unbind_handler_events();
    }

    get_text() {
        if(this.textInfo == '%') {
            return this.levels;
        }
        else if(this.textInfo == 'value') {
            return [...this.yvalues.toFixed(3)];
        }
        else {
            let text = [];
            for(let i = 0; i < this.length; i++) {
                text.push(`${this.levels[i].toFixed(3)} (${this.yvalues[i].toFixed(3)})`)
            }
            return text;
        }
    }

    //CONTROL HANDLERS EVENTS ---------------------------------------------------------
    
    bind_handler_events()
    {
        this.chart.on('mousedown', { seriesName: this.name }, Fibonacci.mousedown_control_management.bind(this));
        this.chart.on('mouseover', { seriesName: this.name }, Fibonacci.mouseover.bind(this));
        this.chart.on('mouseout', { seriesName: this.name }, Fibonacci.mouseout.bind(this));
    }

    unbind_handler_events()
    {
        this.chart.off('mousedown');//, this.mousedown_control_management.bind(this));
        this.chart.off('mouseover');//, this.mouseover.bind(this));
        this.chart.off('mouseout');//, this.mouseout.bind(this));
    }

    disable_chart_move() {
        let dz = this.chart.getOption().dataZoom;
        dz.forEach(z => z.moveOnMouseMove = false);
        this.chart.setOption({dataZoom: dz});
    }

    enable_chart_move() {
        let dz = this.chart.getOption().dataZoom;
        dz.forEach(z => z.moveOnMouseMove = true);
        this.chart.setOption({dataZoom: dz});
    }

    // Functions managers
    static mousedown_control_management(c) {
        if(c.event.target.parent.name == this.name) {
            [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
            let func = this.MOUSEDOWN_CONTROL[c.event.target.name] || this.MOUSEDOWN_DEFAULT;
            if(typeof func == 'function') {
                func.call(this, c);
            }
        }
    }

    static mouseover(c) {
        if(c.event.target.parent.name == this.name) {
            if(this.selected == false) {
                this.show_controls = true;
                this.update_option(c);
            }
        }
    }

    static mouseout(c) {
        if(c.event.target.parent.name == this.name) {
            if(this.selected == false) {
                this.show_controls = false;
                this.update_option(c);
            }
        }
    }

    // Control Area
    mousedown_control(c) {
        if(this.selected == false) {
            this.selected = true;
            this.update_option();
        }
        console.log(this.name, ': control');
        this.disable_chart_move();
        this.chart.getZr().on('mousemove', this.mousemove_control, this);
        this.chart.getZr().on('mouseup', this.mouseup_control, this);
    }
    
    mousemove_control(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        if(!isNaN(x) && !isNaN(this.xdrag)) {
            let deltaX = x - this.xdrag;
            this.xstart += deltaX;
            this.xend += deltaX;
            this.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.ydrag)) {
            let deltaY = y - this.ydrag;
            this.ystart += deltaY;
            this.yend += deltaY;
            this.yvalues = this.yvalues.map(yv => yv += deltaY);
            this.ydrag = y;
        }
        this.update_option();
    }

    mouseup_control(c) {
        console.log('control finished');
        this.chart.getZr().off('mousemove', this.mousemove_control);
        this.chart.getZr().off('mouseup', this.mouseup_control);
        this.enable_chart_move();
    }
    
    // Handler start
    mousedown_control_start(c) {
        console.log(this.name, ': control_start');
        this.disable_chart_move();
        this.chart.getZr().on('mousemove', this.mousemove_control_start, this);
        this.chart.getZr().on('mouseup', this.mouseup_control_start, this);
    }

    mousemove_control_start(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        if(!isNaN(x)) {
            this.xstart = x;
            this.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.ydrag)) {
            this.ystart = y;
            this.ydrag = y;
            this.yvalues = this.yvalues.map( (yv,i) => {
                this.ydelta[Const.DELTA_INIT_ID] = (this.yend - this.ystart);
                return this.yend - (this.ydelta[Const.DELTA_INIT_ID] * this.levels[i]);
            });
        }
        this.update_option();
    }
    
    mouseup_control_start(c) {
        console.log('control start finished');
        this.chart.getZr().off('mousemove', this.mousemove_control_start, this);
        this.chart.getZr().off('mouseup', this.mouseup_control_start, this);
        this.enable_chart_move();
    }

    // Handler end
    mousedown_control_end(c) {
        console.log(this.name, ': control_end');
        this.disable_chart_move();
        this.chart.getZr().on('mousemove', this.mousemove_control_end, this);
        this.chart.getZr().on('mouseup', this.mouseup_control_end, this);
    }

    mousemove_control_end(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        if(!isNaN(x)) {
            this.xend = x;
            this.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.ydrag)) {
            this.yend = y;
            this.ydrag = y;
            this.yvalues = this.yvalues.map( (yv,i) => {
                this.ydelta[Const.DELTA_INIT_ID] = (this.yend - this.ystart);
                return this.yend - (this.ydelta[Const.DELTA_INIT_ID] * this.levels[i]);
            });
        }
        this.update_option();
    }

    mouseup_control_end(c) {
        console.log('control end finished');
        this.chart.getZr().off('mousemove', this.mousemove_control_end, this);
        this.chart.getZr().off('mouseup', this.mouseup_control_end, this);
        this.enable_chart_move();
    }


    // hide_controls() {
    //     let cstart = this.chart.getOption().graphic[0].elements.filter( g => g.id == `${this.name}_START`)[0];
    //     let cend = this.chart.getOption().graphic[0].elements.filter( g => g.id == `${this.name}_END`)[0];
    //     cstart.style.lineWidth = ChartGraphic.CIRCLE_WIDTH_HOVER;
    //     cstart.invisible = true;
    //     cend.style.lineWidth = ChartGraphic.CIRCLE_WIDTH_HOVER;
    //     cend.invisible = true;
    //     this.chart.setOption({graphic: [cstart, cend]});
    // }

    // show_controls() {
    //     let cstart = this.chart.getOption().graphic[0].elements.filter( g => g.id == `${this.name}_START`)[0];
    //     let cend = this.chart.getOption().graphic[0].elements.filter( g => g.id == `${this.name}_END`)[0];
    //     cstart.invisible = false;
    //     cend.invisible = false;
    //     if(this.selected) {
    //         cstart.style.lineWidth = ChartGraphic.CIRCLE_WIDTH_SELECTED;
    //         cend.style.lineWidth = ChartGraphic.CIRCLE_WIDTH_SELECTED;
    //     }
    //     else {
    //         cstart.style.lineWidth = ChartGraphic.CIRCLE_WIDTH_HOVER;
    //         cend.style.lineWidth = ChartGraphic.CIRCLE_WIDTH_HOVER;
    //     }
    //     this.chart.setOption({graphic: [cstart, cend]}); //, {replaceMerge: ['graphic']});
    // }
}

