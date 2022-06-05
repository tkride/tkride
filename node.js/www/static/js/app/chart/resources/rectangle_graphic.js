/** rectangle.js */

class RectangleGraphic extends GraphicComponent {

    static NAME = 'RectangleGraphic';

    // CONSTANTS
    static LINE_WIDTH = ChartComponent.YEND + 1; // 6
    static LINE_TYPE = RectangleGraphic.LINE_WIDTH + 1;
    static COLOR = RectangleGraphic.LINE_TYPE + 1;
    static FILL = RectangleGraphic.COLOR + 1;
    static TEXT_SHOW = RectangleGraphic.FILL + 1;
    static TEXT = RectangleGraphic.TEXT_SHOW + 1;


    // PROPERTIES

    length = 0;
    values = {
        ...this.values,
        trend: 0,
        text: '',
    };

    template = {
        ...this.template,
        type: 'RectangleGraphic',
        // colors: [],
        fill: '#AA552244',
        opacity: 100,
        // lineWidth: 2,
        // lineType: Const.LINE_SOLID,
        textShow: false,
        // textSide: 'right',
        // textInfo: '%',
    };

    constructor({graphic, template, timeFrame, serialized, magnetMode}) {
        if(serialized) {
            super({serialized});
            this.values = serialized.values;
            this.template = serialized.template;
        }
        else {
            graphic = graphic || {};
            graphic = Object.assign({}, graphic);

            super({graphic: graphic, template, timeFrame, magnetMode });

            this.template = { ...this.template, ...template };
            
            this.values.trend = Const.TREND_STR[graphic[Const.TREND_ID]];

            let opacity_hex = this.template.opacity.toString(16).toUpperCase().padStart(2, '0');
            if(this.template.colors.length == 0) {
                let r = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                let g = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                let b = Math.floor((Math.random() * 255)).toString(16).toUpperCase().padStart(2,'0');
                this.template.colors.push(`#${r}${g}${b}${opacity_hex}`);
            }
        }

        // Fill data
        this.update_data();
    }

    render(param, api) {
        if (param.context.rendered) {
            return;
        }

        super.render(param, api);

        let xstart = this.graphic.xstart;
        let xend = this.graphic.xend;
        let ystart = this.graphic.ystart;
        let yend = this.graphic.yend;
                
        let line_width =  api.value(RectangleGraphic.LINE_WIDTH) * 0.3;
        let line_type =  api.value(RectangleGraphic.LINE_TYPE);
        let line_dash = RectangleGraphic.LINE_TYPE_PATTERN[line_type];
        let stroke = api.value(RectangleGraphic.COLOR);
        let fill = api.value(RectangleGraphic.FILL);

        let showText = api.value(RectangleGraphic.TEXT_SHOW);
        let text =  api.value(RectangleGraphic.TEXT);
        let width = (xend - xstart);
        let height = (yend - ystart);
        
        this.children.push([
            {
                type: 'rect',
                id: `${name}_RECTANGLE_${text}`,
                name: `${name}_RECTANGLE_${text}`,
                x: xstart,
                y: ystart,
                cursor: 'crosshair',
                shape: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                },
                style: {
                    stroke: stroke,
                    fill: fill,
                    lineWidth: line_width,
                    lineDash: line_dash,
                },
            },]
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
                    text: text,
                },
            });
        }

        this.graphic.children = [].concat(...this.children);

        param.context.rendered = true;

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
            this.template.fill,
            this.template.textShow,
            text,
        ];
        // let text = this.get_text();
        // for(let i=0; i<this.yvalues.length; i++) {
            // data.push(...[this.yvalues[i], text[i], this.template.colors[i], this.fillColor[i]]);
        // }
        this.data[0].push(...data);
    }

    set_option(chart) {
        super.set_option(chart);

        chart.setOption({ 
            series: [{
                id: this[Const.ID_ID],
                name: this[Const.ID_ID],
                // xAxisIndex: ChartComponent.X_AXIS_INDEX,
                type: 'custom',
                renderItem: this.render.bind(this),
                encode: {
                    x: [ChartComponent.XSTART, ChartComponent.XEND],
                    y: [ChartComponent.YSTART, ChartComponent.YEND],
                },
                data: this.data,
                // clip: true,
                z: this.settings.z_level,
            }],
        });
    }

    get_text() {
        return this.values.text;
    }
    
    setTemplate(template) {
        super.setTemplate(template);
        this.update_option();
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
        
        this.values.trend = Math.sign(this.values.ydelta) * Math.sign(this.values.xdelta);
        this.update_option();
    }


    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------

    static grabData({graphic, template, x, y}) {
        super.grabData({graphic, template, x, y});
        graphic[Const.ID_ID] =  `${Const.RECTANGLE_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.TEXT_ID] = '';
    }

    // static pick_start(e) {
    //     let params = this[1];
    //     let chart = params.chart;
    //     let template = params.template;
    //     let timeFrame = params.timeFrame;
    //     let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
    //     let graphic = {}
    //     graphic[Const.HASH_ID] = new Date().valueOf();
    //     graphic[Const.ID_ID] =  `${Const.RECTANGLE_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
    //     graphic[Const.INIT_ID] = new TimePrice(x, y);
    //     graphic[Const.END_ID] = new TimePrice(x, y);
    //     graphic[Const.TEXT_ID] = '';
    //     graphic[Const.TIMESTAMP_ID] = graphic[Const.INIT_ID].time;

    //     let ref = new RectangleGraphic({graphic, template, timeFrame});
    //     $(document).trigger(ChartComponent.EVENT_PLOT, [ref]);
    //     ref.select();

    //     ref.disable_chart_move();
    //     ref.values.xdrag = x;
    //     ref.values.ydrag = y;
    //     chart.getZr().on('mouseup', GraphicComponent.pick_end, ref);
    //     chart.getZr().on('mousemove', ref.mousemove_control_end, ref);

    //     chart.getZr().off('mouseup', RectangleGraphic.pick_start);
    //     ChartComponent.building_graphic = false;
        
    //     $(document).on(Const.EVENT_CLOSE, (e) => {
    //         GraphicComponent.pick_end.apply(ref, [e, Const.EVENT_CLOSE]);
    //     });
    // }
}

