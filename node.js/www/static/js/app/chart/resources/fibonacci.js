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

    static EVENT_SELECTED = 'event-fibonacci-control-selected';
    static EVENT_UNSELECTED = 'event-fibonacci-control-unselected';
    static EVENT_CREATE = 'event-fibonacci-control-create';
    static EVENT_PLOT = 'event-fibonacci-control-plot';
    
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

    constructor({retracement, params, template}) {
        params = params || {};
        retracement = retracement || {};
        
        // If contructor called with template, will create Fibonacci Retracement, interactively
        if(template != undefined) {
            Fibonacci.#load_template({retracement, params, template});
        }

        let datasource = (retracement[Const.RET_DATA_SOURCE_ID]) ? retracement[Const.RET_DATA_SOURCE_ID] : undefined;

        super({ name: `${Const.FIBO_RET_ID}${(params.name) ? '_' + params.name:''}_${retracement[Const.HASH_ID]}`,
                template_name: (params.template_name != undefined) ?
                                    params.template_name :
                                    `${Const.FIBO_RET_ID}${(params.name) ? '_' + params.name:''}_${retracement[Const.HASH_ID]}`,
                xstart: (datasource) ? datasource[Const.INIT_ID].time : retracement[Const.INIT_ID].time,
                xend: retracement[Const.CORRECTION_ID].time,
                ystart: (datasource) ? datasource[Const.INIT_ID].price : retracement[Const.INIT_ID].price,
                yend: (datasource) ? datasource[Const.END_ID].price : retracement[Const.END_ID].price,
                draggable: params.draggable,
            });

        let ret_levels = (retracement[Const.RET_LEVELS_DATA_SOURCE_ID]) ? retracement[Const.RET_LEVELS_DATA_SOURCE_ID] : retracement[Const.RET_LEVELS_ID];
        // this.levels = Object.keys(ret_levels);
        this.levels = Object.keys(retracement[Const.RET_LEVELS_ID]);
        this.yvalues = Object.values(ret_levels).filter(l => l);
        this.trend = Const.TREND_STR[retracement[Const.TREND_ID]];
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
        let text = this.get_text();
        this.data = [this.selected, this.show_controls, ymin, this.xstart, this.xend, this.ystart, this.yend, this.yvalues.length];
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
            if((Math.abs(yvalue) != Infinity) && !isNaN(yvalue)) {
                text = api.value(Fibonacci.TEXT + idx);
                [stroke, fill] = [api.value(Fibonacci.STROKE + idx), api.value(Fibonacci.FILL + idx)];

                height = Math.abs(yvalue - ymin);
                height = (height) ? height : 1;
                children.push([
                    {
                        type: 'rect',
                        id: `${name}_LEVEL_${text}`,
                        name: `${name}_LEVEL_${text}`,
                        x: xstart,
                        y: yvalue,
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
                        x: (xstart > xend) ? (xstart+5) : (xend+5),
                        y: yvalue - 5,
                        style: {
                            fill: stroke,
                            width: width,
                            text: text,
                        }
                    },
                ]);
            }
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
        chart.setOption({ 
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
                                clip: true,
                                z: this.z_level,
                            }],
        },
        );
    }

    plot(chart) {
        this.chart = chart;

        this.set_option(chart);
        this.bind_handler_events({ mousedown: this.mousedown_control_management,
                                   mouseover: this.mouseover,
                                   mouseout: this.mouseout,
                                });

        return this.controls;
    }

    update_option() {
        this.update_data();
        this.chart.setOption({ series: [{
                id: this.name,
                data: this.data,
                z: this.z_level,
            }] },
        );
    }

    remove(chart) {
        let gElements = chart.getOption().graphic;
        this.unbind_handler_events();
        if(gElements && gElements[0].length) {
            let idx = gElements.findIndex(g => g.id == this.name);
            gElements.splice(idx, 1);
            chart.setOption({graphic: gElements});
        }
    }

    get_text() {
        if(this.textInfo == '%') {
            return [...this.levels.map(v => parseFloat(v).toFixed(3))];
        }
        else if(this.textInfo == 'value') {
            return [...this.yvalues.map(v => parseFloat(v).toFixed(3))];
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

    select() {
        if(this.selected == false) {
            super.select();
            this.update_option();
        }
    }

    unselect() {
        if(this.selected == true) {
            super.unselect();
            this.update_option();
            $(document).trigger(Fibonacci.EVENT_UNSELECTED, this);
        }
    }

    // Functions managers
    mousedown_control_management(c) {
        if(c.event.target.parent.name == this.name) {
            let func = this.MOUSEDOWN_CONTROL[c.event.target.name] || this.MOUSEDOWN_DEFAULT;
            if(typeof func == 'function') {
                func.call(this, c);
            }
        }
    }

    mouseover(c) {
        if(c.event.target.parent.name == this.name) {
            if(this.selected == false) {
                this.show_controls = true;
                this.update_option(c);
            }
        }
    }

    mouseout(c) {
        if(c.event.target.parent.name == this.name) {
            if(this.selected == false) {
                this.show_controls = false;
                this.update_option(c);
            }
        }
    }

    // Control Area
    mousedown_control(c) {
        console.log(this.name, ': control');
        [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.selected == false) {
            this.select();
            $(document).trigger(Fibonacci.EVENT_SELECTED, [this]);
        }
        if(!this.blocked && this.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control, this);
            this.chart.getZr().on('mouseup', this.mouseup_control, this);
        }
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
        [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.selected == false) {
            this.select();
            $(document).trigger(Fibonacci.EVENT_SELECTED, [this]);
        }
        
        if(!this.blocked && this.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control_start, this);
            this.chart.getZr().on('mouseup', this.mouseup_control_start, this);
        }
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
        [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.selected == false) {
            this.select();
            $(document).trigger(Fibonacci.EVENT_SELECTED, [this]);
        }
        
        if(!this.blocked && this.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control_end, this);
            this.chart.getZr().on('mouseup', this.mouseup_control_end, this);
        }
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

    static building_fibo = false;
    static build_fibonacci({chart, template}) {
        if(Fibonacci.building_fibo == false) {
            Fibonacci.building_fibo = true;
            chart.getZr().on('mousedown', Fibonacci.pick_start, [this, {chart, template}]);
        }
    }

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        template[Const.INIT_ID] = new TimePrice(x, y);
        template[Const.END_ID] = new TimePrice(x, y);
        template[Const.CORRECTION_ID] = new TimePrice(x, y);
        template[Const.DELTA_INIT_ID] = 0;
        template[Const.DELTA_END_ID] = 0;
        template[Const.NAME_ID] = `${Const.FIBO_RET_ID}-${new Date().valueOf()}`;
        template.ref = new Fibonacci({template});
        // template.ref.plot(chart);
        $(document).trigger(Fibonacci.EVENT_PLOT, [template.ref]);
        // $(document).trigger(Fibonacci.EVENT_SELECTED, [template.ref]);
        // template.ref.select();

        // TODO FORZAR EVENTO MOUSEDOWN END CONTROL
        // template.ref.mousedown_control_end(e);
        // Fibonacci.move_end(e, {chart, template});
        template.ref.disable_chart_move();
        template.ref.xdrag = x;
        template.ref.ydrag = y;
        chart.getZr().on('mousedown', Fibonacci.pick_end, template.ref);
        chart.getZr().on('mousemove', template.ref.mousemove_control_end, template.ref);

        chart.getZr().off('mousedown', Fibonacci.pick_start);
        Fibonacci.building_fibo = false;
    }

    static pick_end(e) {
        this.chart.getZr().off('mousemove', this.mousemove_control_end);
        this.chart.getZr().off('mousedown', Fibonacci.pick_end);
        this.enable_chart_move();
    }
    
    static #load_template({retracement, params, template}) {
        // Load retracement from template
        retracement[Const.HASH_ID] = template[Const.HASH_ID];
        retracement[Const.INIT_ID] = template[Const.INIT_ID];
        retracement[Const.END_ID] = template[Const.END_ID];
        retracement[Const.CORRECTION_ID] = template[Const.CORRECTION_ID];
        let price = template[Const.INIT_ID].price;
        retracement[Const.RET_LEVELS_ID] = {};
        template[Const.RET_LEVELS_ID].forEach(l => {
            retracement[Const.RET_LEVELS_ID][l] = price;
        });
        retracement[Const.TREND_ID] = template[Const.TREND_ID];
        retracement[Const.DELTA_INIT_ID] = template[Const.DELTA_INIT_ID];
        retracement[Const.DELTA_END_ID] = template[Const.DELTA_END_ID];
        // Load parameters from template
        params[Const.NAME_ID] = template[Const.NAME_ID];
        params.template_name = template.template_name;
        params.draggable = template.draggable;
        params.textShow = template.textShow;
        params.textSide = template.textSide;
        params.textInfo = template.textInfo;
        params.lineDashStep = template.lineDashStep;
        params.lineWidth = template.lineWidth;
        params.opacity = template.opacity;
        params.lineColor = template.lineColor;
    }
}

