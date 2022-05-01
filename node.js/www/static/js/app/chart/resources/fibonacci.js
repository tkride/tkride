/** fibonacci.js */

class Fibonacci extends ChartGraphic {

    static NAME = 'Fibonacci';

    // CONSTANTS
    static LINE_WIDTH = ChartGraphic.YEND + 1; // 6
    static LINE_TYPE = Fibonacci.LINE_WIDTH + 1;
    static TEXT_SHOW = Fibonacci.LINE_TYPE + 1;
    static NUM_VALUES = Fibonacci.TEXT_SHOW + 1;
    static YVALUES = Fibonacci.NUM_VALUES + 1;// 10

    // static TREND = 2;
    static YVALUE = 0;
    static TEXT = 1;
    static STROKE = 2;
    static FILL = 3;
    
    static LINE_TYPE_PATTERN = {
        [Const.LINE_SOLID]: [1, 0],
        [Const.LINE_DASH]: [4, 4],
        [Const.LINE_DOT]: [1, 1],
    }

    static EVENT_CREATE = 'event-fibonacci-control-create';
    

    // PROPERTIES

    // Values
    values = {
        ...this.values,
        length: 0,
        yvalues: [],
    };

    // TODO UNUSED?
    trend;

    // Fibonacci template
    template = {
        ...this.template,
        type: 'Fibonacci',
        colors: [],
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
    };

    // Render and dynamic control values
    ydelta = {};
    yvalues_chart = [];
    fillColor = [];

    constructor({graphic, template, timeFrame, serialized}) {
        if(serialized) {
            super({serialized});
            this.values = serialized.values;
            this.template = serialized.template;
        }
        else {
            graphic = graphic || {};
            graphic = Object.assign({}, graphic);
            
            let datasource = (graphic[Const.RET_DATA_SOURCE_ID]) ? graphic[Const.RET_DATA_SOURCE_ID] : undefined;
            if(datasource) {
                graphic[Const.INIT_ID] = datasource[Const.INIT_ID];
                graphic[Const.END_ID] = { time: graphic[Const.CORRECTION_ID].time, price: datasource[Const.END_ID].price };
                graphic[Const.DELTA_INIT_ID] = graphic[Const.END_ID].price - graphic[Const.INIT_ID].price;
                graphic[Const.DELTA_END_ID] = graphic[Const.CORRECTION_ID].price - graphic[Const.END_ID].price;
                graphic[Const.RET_ID] = Math.abs(graphic[Const.DELTA_END_ID] / graphic[Const.DELTA_INIT_ID]);
                
                let ret_levels = graphic[Const.RET_LEVELS_ID];
                graphic[Const.RET_LEVELS_DATA_SOURCE_ID] = [];
                Object.keys(ret_levels).forEach(l => {
                    let level_yvalue = graphic[Const.END_ID].price - (graphic[Const.DELTA_INIT_ID] * l);
                    graphic[Const.RET_LEVELS_DATA_SOURCE_ID][l] = level_yvalue;
                });
            }

            super({graphic: graphic, template, timeFrame });

            this.template = { ...this.template, ...template };

            let ret_levels = (graphic[Const.RET_LEVELS_DATA_SOURCE_ID]) ? graphic[Const.RET_LEVELS_DATA_SOURCE_ID] : graphic[Const.RET_LEVELS_ID];
            this.values.yvalues = Object.values(ret_levels).filter(l => l);
            if(this.template.levels == undefined) {
                this.template.levels = Object.keys(graphic[Const.RET_LEVELS_ID]);
            }
            
            this.trend = Const.TREND_STR[graphic[Const.TREND_ID]];
            this.ydelta = {
                [Const.DELTA_INIT_ID]: graphic[Const.DELTA_INIT_ID],
                [Const.DELTA_END_ID]: graphic[Const.DELTA_END_ID]
            };
            this.values.length = this.template.levels.length;

            if(this.template.colors.length < this.values.length) {
                for(let i = this.template.colors.length; i < this.values.length; i++) {
                    let r = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                    let g = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                    let b = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                    this.template.colors.push(`#${r}${g}${b}`);
                }
            }
        }

        if(this.fillColor.length < this.values.length) {
            this.fillColor = [];
            for(let i = 0; i < this.values.length; i++) {
                let opacity_hex = this.template.opacity.toString(16).toUpperCase().padStart(2,'0');
                this.fillColor.push(`${this.template.colors[i]}${opacity_hex}`);
            }
        }

        // Fill data
        this.update_data();
    }

    render(param, api) {
        super.render(param, api);

        // let trend = api.value(Fibonacci.TREND);
        let textShow = api.value(Fibonacci.TEXT_SHOW);
        let xstart = this.graphic.xstart;
        let xend = this.graphic.xend;
        
        //Width is fixed
        let width = (xend - xstart);
        let yvalue, stroke, fill, height, text;
        
        let line_width = api.value(Fibonacci.LINE_WIDTH) * 0.3;
        let line_type =  api.value(Fibonacci.LINE_TYPE);
        let line_dash = Fibonacci.LINE_TYPE_PATTERN[line_type];
        // let line_dash = Math.abs(width);
        
        let len = api.value(Fibonacci.NUM_VALUES);
        let yprev = 0;

        for(let j=0; j<len; j++) {
            let idx = Fibonacci.YVALUES + (j*4);
            yvalue = api.coord([0, api.value(Fibonacci.YVALUE + idx)])[1];
            if(!yprev) { yprev = yvalue; }
            if((Math.abs(yvalue) != Infinity) && !isNaN(yvalue)) {
                text = api.value(Fibonacci.TEXT + idx);
                [stroke, fill] = [api.value(Fibonacci.STROKE + idx), api.value(Fibonacci.FILL + idx)];

                height = -(yvalue - yprev);
                height = (height) ? height : 2;
                this.children.push(...[
                    {
                        type: 'line',
                        id: `${name}_LEVEL_LINE_${text}`,
                        name: `${name}_LEVEL_LINE_${text}`,
                        x: 0,
                        y: 0,
                        shape: {
                            x1: xstart,
                            y1: yvalue,
                            x2: xend,
                            y2: yvalue,
                        },
                        style: {
                            fill: fill,
                            stroke: stroke,
                            lineWidth: line_width,
                            lineDash: line_dash,
                            // lineDash: [...line_dash],
                        },
                    },
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
                            lineWidth: line_width,
                            // lineDash: [line_dash, Math.abs(width) + Math.abs((2*height))],
                            lineDash: [0, Math.abs(width) + Math.abs((2*height))],
                            // lineDash: [...line_dash],
                        },
                    },
                ]);

                if(textShow) {
                    this.children.push({
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
                    });
                }
            }
            yprev = yvalue;
        }

        this.graphic.children = [].concat(...this.children);

        return this.graphic;
    }
    
    update_data() {
        // Width is fixed, so it's appended first once
        super.update_data();
        let data = [this.template.lineWidth, this.template.lineType, this.template.textShow, this.values.yvalues.length];
        let text = this.get_text();
        for(let i=0; i<this.values.yvalues.length; i++) {
            data.push(...[this.values.yvalues[i], text[i], this.template.colors[i], this.fillColor[i]]);
        }
        this.data[0].push(...data);
    }

    set_option(chart) {
        super.set_option(chart);

        let yenc = [ChartGraphic.YSTART, ChartGraphic.YEND].concat(...this.values.yvalues.map( (el, i) => Fibonacci.YVALUES + (i*4)));
        chart.setOption({ 
            series: [{
                id: this[Const.ID_ID],
                name: this[Const.ID_ID],
                type: 'custom',
                renderItem: this.render.bind(this),
                encode: {
                    x: [ChartGraphic.XSTART, ChartGraphic.XEND],
                    y: yenc,
                },
                data: this.data,
                // clip: true,
                z: this.settings.z_level,
            }],
        });
    }

    get_text() {
        if(this.template.textInfo == '%') {
            return [...this.template.levels.map(v => parseFloat(v).toFixed(3))];
        }
        else if(this.template.textInfo == 'value') {
            return [...this.values.yvalues.map(v => parseFloat(v).toFixed(3))];
        }
        else {
            let text = [];
            for(let i = 0; i < this.values.length; i++) {
                text.push(`${this.template.levels[i].toFixed(3)} (${this.values.yvalues[i].toFixed(3)})`)
            }
            return text;
        }
    }

    //CONTROL HANDLERS EVENTS ---------------------------------------------------------

    // Control Area
    mousemove_control(c) {
        let y = this.values.ydrag;
        super.mousemove_control(c);
        if(!isNaN(y) && !isNaN(this.values.ydrag)) {
            let deltaY = this.values.ydrag - y;
            this.values.yvalues = this.values.yvalues.map(yv => yv += deltaY);
        }
        this.update_option();
    }

    // Handler start
    mousemove_control_start(c) {
        super.mousemove_control_start(c);

        if(!isNaN(this.values.ydrag)) {
            this.values.yvalues = this.values.yvalues.map( (yv,i) => {
                this.ydelta[Const.DELTA_INIT_ID] = (this.values.yend - this.values.ystart);
                let corr = this.values.yend - (this.ydelta[Const.DELTA_INIT_ID] * this.template.levels[i]);
                this.ydelta[Const.DELTA_END_ID] = (corr - this.values.yend);
                return corr;
            });
        }
        this.update_option();
    }
    
    // Handler end
    mousemove_control_end(c) {
        super.mousemove_control_end(c);
        
        if(!isNaN(this.values.ydrag)) {
            this.values.yvalues = this.values.yvalues.map( (yv,i) => {
                this.ydelta[Const.DELTA_INIT_ID] = (this.values.yend - this.values.ystart);
                let corr = this.values.yend - (this.ydelta[Const.DELTA_INIT_ID] * this.template.levels[i]);
                this.ydelta[Const.DELTA_END_ID] = (corr - this.values.yend);
                return corr;
            });
        }
        this.update_option();
    }



    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------
//TODO LOS MENUS TAMBIEN TIENEN QUE SER ESCALABLES, EXTENDER CLASES BASE
//TODO MENU FLOTANTE AGREGA SETTINGS PROPIOS, EL MENU EXTENDIDO, PROPIEDADES

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let timeFrame = params.timeFrame;
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        let graphic = {}
        graphic[Const.HASH_ID] = new Date().valueOf();
        graphic[Const.ID_ID] =  `${Const.FIBO_RET_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.INIT_ID] = new TimePrice(x, y);
        graphic[Const.END_ID] = new TimePrice(x, y);
        graphic[Const.CORRECTION_ID] = new TimePrice(x, y);
        graphic[Const.DELTA_INIT_ID] = 0;
        graphic[Const.DELTA_END_ID] = 0;
        graphic[Const.RET_ID] = 0;
        graphic[Const.TIMESTAMP_ID] = graphic[Const.INIT_ID].time;
        
        graphic[Const.RET_LEVELS_ID] = {};
        template[Const.RET_LEVELS_ID].forEach(l => {
            graphic[Const.RET_LEVELS_ID][l] = y;
        });

        let ref = new Fibonacci({graphic, template, timeFrame});
        $(document).trigger(ChartGraphic.EVENT_PLOT, [ref]);
        ref.select();

        // TODO FORZAR EVENTO MOUSEDOWN END CONTROL
        // ref.mousedown_control_end(e);
        // Fibonacci.move_end(e, {chart, template});
        ref.disable_chart_move();
        ref.values.xdrag = x;
        ref.values.ydrag = y;
        chart.getZr().on('mousedown', Fibonacci.pick_end, ref);
        chart.getZr().on('mousemove', ref.mousemove_control_end, ref);

        chart.getZr().off('mousedown', Fibonacci.pick_start);
        ChartGraphic.building_graphic = false;
    }

    static pick_end(e) {
        $(document).trigger(ChartGraphic.EVENT_CREATED, [Fibonacci.NAME]);
        this.chart.getZr().off('mousemove', this.mousemove_control_end);
        this.chart.getZr().off('mousedown', Fibonacci.pick_end);
        this.enable_chart_move();
    }
}

