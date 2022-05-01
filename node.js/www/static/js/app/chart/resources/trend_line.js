/** trend_line.js */

class TrendLine extends ChartGraphic {

    static NAME = 'TrendLine';

    // CONSTANTS
    static LINE_WIDTH = ChartGraphic.YEND + 1; // 6
    static LINE_TYPE = TrendLine.LINE_WIDTH + 1;
    static COLOR = TrendLine.LINE_TYPE + 1;
    static TEXT_SHOW = TrendLine.COLOR + 1;
    static TEXT = TrendLine.TEXT_SHOW + 1;
    static SLOPE = TrendLine.TEXT + 1; // 11
    
    static LINE_TYPE_PATTERN = {
        [Const.LINE_SOLID]: [1, 0],
        [Const.LINE_DASH]: [4, 4],
        [Const.LINE_DOT]: [1, 1],
    }

    static EVENT_CREATE = 'event-trend-line-control-create';
    

    // PROPERTIES
    // width;
    // height;
    length = 0;
    values = {
        ...this.values,
        xdelta: {},
        ydelta: {},
        slope: 0,
        angle: 0,
        trend: 0,
    };

    template = {
        ...this.template,
        type: 'TrendLine',
        colors: [],
        lineWidth: 2,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    };

    constructor({graphic, template, timeFrame, serialized}) {
        if(serialized) {
            super({serialized});
            this.values = serialized.values;
            this.template = serialized.template;
        }
        else {
            graphic = graphic || {};
            graphic = Object.assign({}, graphic);

            super({graphic: graphic, template, timeFrame });

            this.template = { ...this.template, ...template };
            
            this.values.slope = graphic[Const.SLOPE_ID];
            this.values.angle = graphic[Const.ANGLE_ID];
            this.values.trend = Const.TREND_STR[graphic[Const.TREND_ID]];
            this.values.xdelta = graphic[Const.DELTA_X_ID];
            this.values.ydelta = graphic[Const.DELTA_Y_ID];

            if(this.template.colors.length == 0) {
                let r = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                let g = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                let b = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                this.template.colors.push(`#${r}${g}${b}`);
            }
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

        let showText = api.value(TrendLine.TEXT_SHOW);
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
                    x1: xstart-2,
                    y1: ystart-2,
                    x2: xend-2,
                    y2: yend-2,
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

        if(showText) {
            this.children.push({
                type: 'text',
                id: `${name}_TEXT_${text}`,
                name: `${name}_TEXT_${text}`,
                x: xstart + 10,
                y: ystart - 10,
                style: {
                    fill: stroke,
                    text: `${(angle*(180/Math.PI)).toFixed(2)}º`,
                },
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
            this.values.slope,
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
                // clip: true,
                z: this.settings.z_level,
            }],
        });
    }

    get_text() {
        if(this.template.textInfo == '%') {
            return parseFloat(this.values.slope).toFixed(2)*100+'%';
        }
        else if(this.template.textInfo == 'value') {
            return parseFloat(this.values.angle).toFixed(2)+'º';
        }
        else {
            let text = `${this.template.levels[i].toFixed(3)*100}% (${this.yvalues[i].toFixed(3)})`;
            return text;
        }
    }

    //CONTROL HANDLERS EVENTS ---------------------------------------------------------

    // Control Area
    mousemove_control(c) {
        let y = this.values.ydrag;
        super.mousemove_control(c);
        this.update_option();
    }

    // Handler start
    mousemove_control_start(c) {
        super.mousemove_control_start(c);

        if(!isNaN(this.values.xstart)) {
            this.values.xdelta = (this.values.xend - this.values.xstart);
        }

        if(!isNaN(this.values.ystart)) {
            this.values.ydelta = (this.values.yend - this.values.ystart);
        }

        this.values.slope = (this.values.ydelta / this.values.xdelta);
        this.values.angle = Math.atan(this.values.slope) * (180/Math.PI);
        this.values.trend = Math.sign(this.values.ydelta) * Math.sign(this.values.xdelta);
        this.update_option();
    }
    
    // Handler end
    mousemove_control_end(c) {
        super.mousemove_control_end(c);
        
        if(!isNaN(this.values.xend)) {
            this.values.xdelta = (this.values.xend - this.values.xstart);
        }

        if(!isNaN(this.values.yend)) {
            this.values.ydelta = (this.values.yend - this.values.ystart);
        }
        
        this.values.slope = (this.values.ydelta / this.values.xdelta);
        this.values.angle = Math.atan(this.values.slope) * (180/Math.PI);
        this.values.trend = Math.sign(this.values.ydelta) * Math.sign(this.values.xdelta);
        this.update_option();
    }



    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let timeFrame = params.timeFrame;
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

        let ref = new TrendLine({graphic, template, timeFrame});
        $(document).trigger(ChartGraphic.EVENT_PLOT, [ref]);
        ref.select();

        // TODO FORZAR EVENTO MOUSEDOWN END CONTROL
        // ref.mousedown_control_end(e);
        // Fibonacci.move_end(e, {chart, template});
        ref.disable_chart_move();
        ref.values.xdrag = x;
        ref.values.ydrag = y;
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

