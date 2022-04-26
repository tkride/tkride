/** trend_line.js */

class TrendLine extends ChartGraphic {

    static NAME = 'TrendLine';

    // CONSTANTS
    static LINE_WIDTH = ChartGraphic.YEND + 1; // 6
    static LINE_TYPE = TrendLine.LINE_WIDTH + 1;
    static COLOR = TrendLine.LINE_TYPE + 1;
    static SHOW_TEXT = TrendLine.COLOR + 1;
    static TEXT = TrendLine.SHOW_TEXT + 1;
    static SLOPE = TrendLine.TEXT + 1; // 11
    
    static LINE_TYPE_PATTERN = {
        [Const.LINE_SOLID]: [1, 0],
        [Const.LINE_DASH]: [4, 4],
        [Const.LINE_DOT]: [1, 1],
    }

    static EVENT_CREATE = 'event-trend-line-control-create';
    

    // PROPERTIES
    trend;
    width;
    height;
    length = 0;
    xdelta = {};
    ydelta = {};
    slope;
    angle;
    trend;
    template = {
        colors: [],
        lineWidth: 2,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    };

    constructor({graphic, template}) {
        graphic = graphic || {};
        graphic = Object.assign({}, graphic);
        
        // let datasource = (graphic[Const.RET_DATA_SOURCE_ID]) ? graphic[Const.RET_DATA_SOURCE_ID] : undefined;
        // if(datasource) {
        //     graphic[Const.INIT_ID] = datasource[Const.INIT_ID];
        //     graphic[Const.END_ID] = { time: graphic[Const.CORRECTION_ID].time, price: datasource[Const.END_ID].price };
            // graphic[Const.DELTA_X_ID] = graphic[Const.END_ID].price - graphic[Const.INIT_ID].price;
            // graphic[Const.DELTA_Y_ID] = graphic[Const.CORRECTION_ID].price - graphic[Const.END_ID].price;
            // graphic[Const.SLOPE_ID] = Math.abs(graphic[Const.DELTA_Y_ID] / graphic[Const.DELTA_X_ID]);
            // graphic[Const.ANGLE_ID] = Math.atan(graphic[Const.SLOPE_ID])*(180/Math.PI);
            
            // let ret_levels = graphic[Const.RET_LEVELS_ID];
            // graphic[Const.RET_LEVELS_DATA_SOURCE_ID] = [];
            // Object.keys(ret_levels).forEach(l => {
            //     let level_yvalue = graphic[Const.END_ID].price - (graphic[Const.DELTA_INIT_ID] * l);
            //     graphic[Const.RET_LEVELS_DATA_SOURCE_ID][l] = level_yvalue;
            // });
        // }

        super({graphic: graphic, template });

        this.template = { ...this.template, ...template };
        
        this.slope = graphic[Const.SLOPE_ID];
        this.angle = graphic[Const.ANGLE_ID];
        this.trend = Const.TREND_STR[graphic[Const.TREND_ID]];
        this.xdelta = graphic[Const.DELTA_X_ID];
        this.ydelta = graphic[Const.DELTA_Y_ID];

        if(this.template.colors.length == 0) {
            let r = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
            let g = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
            let b = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
            this.template.colors.push(`#${r}${g}${b}`);
        }

        // Fill data
        this.update_data();
    }

    render(param, api) {
        super.render(param, api);

        // let trend = api.value(TrendLine.TREND);
        let xstart = this.graphic.xstart;
        let xend = this.graphic.xend;
        let ystart = this.graphic.ystart;
        let yend = this.graphic.yend;
                
        let line_width =  api.value(TrendLine.LINE_WIDTH) * 0.3;
        let line_type =  api.value(TrendLine.LINE_TYPE);
        let line_dash = TrendLine.LINE_TYPE_PATTERN[line_type];
        let stroke = api.value(TrendLine.COLOR);

        let show_text = api.value(TrendLine.SHOW_TEXT);
        let text =  api.value(TrendLine.TEXT);
        // let slope =  api.value(TrendLine.SLOPE);
        let height = 6;
        let dy = -(yend - ystart);
        let dx = (xend - xstart);
        let width = Math.sqrt((dx**2) + (dy**2));
        let slope = dy / dx;
        let angle = Math.atan(slope);
        
        this.children.push([
            {
                type: 'line',
                id: `${name}_TREND_LINE_LINE_${text}`,
                name: `${name}_TREND_LINE_LINE_${text}`,
                shape: {
                    x1: xstart,
                    y1: ystart,
                    x2: xend,
                    y2: yend,
                },
                style: {
                    stroke: stroke,
                    lineWidth: line_width,
                    lineDash: line_dash,
                },
            },
            {
                type: 'rect',
                id: `${name}_TREND_LINE_HOLDER_${text}`,
                name: `${name}_TREND_LINE_HOLDER_${text}`,
                x: xstart,
                y: ystart + 2,
                rotation: angle,
                invisible: true,
                shape: {
                    x: 0,
                    y: -3,
                    width: width,
                    height: height,
                },
                style: { fill: '#FF0000' }
            }]
        );

        if(show_text) {
            this.children.push({
                type: 'text',
                id: `${name}_TEXT_${text}`,
                name: `${name}_TEXT_${text}`,
                x: (xstart > xend) ? (xstart+5) : (xend+5),
                y: ystart - 5,
                style: {
                    fill: stroke,
                    text: `${(angle*(180/Math.PI)).toFixed(2)}º`, //text,
                }
            });
        }

        this.graphic.children = [].concat(...this.children);

        return this.graphic;
    }
    
    update_data() {
        // Width is fixed, so it's appended first once
        super.update_data();
        let text = this.get_text();
        let data = [
            this.template.lineWidth,
            this.template.lineType,
            this.template.colors[0],
            this.template.textShow,
            text,
            this.slope,
        ];
        // let text = this.get_text();
        // for(let i=0; i<this.yvalues.length; i++) {
            // data.push(...[this.yvalues[i], text[i], this.template.colors[i], this.fillColor[i]]);
        // }
        this.data[0].push(...data);
    }

    set_option(chart) {
        chart.setOption({ 
            series: [{
                id: this[Const.ID_ID],
                name: this[Const.ID_ID],
                type: 'custom',
                renderItem: this.render.bind(this),
                encode: {
                    x: [ChartGraphic.XSTART, ChartGraphic.XEND],
                    y: [ChartGraphic.YSTART, ChartGraphic.YEND],
                },
                data: this.data,
                clip: true,
                z: this.z_level,
            }],
        });
    }

    get_text() {
        if(this.template.textInfo == '%') {
            return parseFloat(this.slope).toFixed(2)*100+'%';
        }
        else if(this.template.textInfo == 'value') {
            return parseFloat(this.angle).toFixed(2)+'º';
        }
        else {
            let text = `${this.template.levels[i].toFixed(3)*100}% (${this.yvalues[i].toFixed(3)})`;
            return text;
        }
    }

    //CONTROL HANDLERS EVENTS ---------------------------------------------------------

    // Control Area
    mousemove_control(c) {
        let y = this.ydrag;
        super.mousemove_control(c);
        this.update_option();
    }

    // Handler start
    mousemove_control_start(c) {
        super.mousemove_control_start(c);

        if(!isNaN(this.xstart)) {
            this.xdelta = (this.xend - this.xstart);
        }

        if(!isNaN(this.ystart)) {
            this.ydelta = (this.yend - this.ystart);
        }

        this.slope = (this.ydelta / this.xdelta);
        this.angle = Math.atan(this.slope) * (180/Math.PI);
        this.trend = Math.sign(this.ydelta) * Math.sign(this.xdelta);
        this.update_option();
    }
    
    // Handler end
    mousemove_control_end(c) {
        super.mousemove_control_end(c);
        
        if(!isNaN(this.xend)) {
            this.xdelta = (this.xend - this.xstart);
        }

        if(!isNaN(this.yend)) {
            this.ydelta = (this.yend - this.ystart);
        }
        
        this.slope = (this.ydelta / this.xdelta);
        this.angle = Math.atan(this.slope) * (180/Math.PI);
        this.trend = Math.sign(this.ydelta) * Math.sign(this.xdelta);
        this.update_option();
    }



    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        let graphic = {}
        graphic[Const.HASH_ID] = new Date().valueOf();
        graphic[Const.ID_ID] =  `${Const.TREND_LINE_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.INIT_ID] = new TimePrice(x, y);
        graphic[Const.END_ID] = new TimePrice(x, y);
        graphic[Const.DELTA_X_ID] = 0;
        graphic[Const.DELTA_Y_ID] = 0;
        graphic[Const.SLOPE_ID] = 0;
        graphic[Const.ANGLE_ID] = 0;
        graphic[Const.TREND_ID] = Const.BULL;
        graphic[Const.TIMESTAMP_ID] = graphic[Const.INIT_ID].time;

        let ref = new TrendLine({graphic, template});
        $(document).trigger(ChartGraphic.EVENT_PLOT, [ref]);

        // TODO FORZAR EVENTO MOUSEDOWN END CONTROL
        // ref.mousedown_control_end(e);
        // Fibonacci.move_end(e, {chart, template});
        ref.disable_chart_move();
        ref.xdrag = x;
        ref.ydrag = y;
        chart.getZr().on('mousedown', TrendLine.pick_end, ref);
        chart.getZr().on('mousemove', ref.mousemove_control_end, ref);

        chart.getZr().off('mousedown', TrendLine.pick_start);
        ChartGraphic.building_graphic = false;
    }

    static pick_end(e) {
        $(document).trigger(ChartGraphic.EVENT_CREATED, [TrendLine.NAME]);
        this.chart.getZr().off('mousemove', this.mousemove_control_end);
        this.chart.getZr().off('mousedown', TrendLine.pick_end);
        this.enable_chart_move();
    }
}

