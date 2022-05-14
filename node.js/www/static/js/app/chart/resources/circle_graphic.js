/** rectangle.js */

class CircleGraphic extends GraphicComponent {

    static NAME = 'CircleGraphic';

    // CONSTANTS
    static LINE_WIDTH = ChartComponent.YEND + 1; // 6
    static LINE_TYPE = CircleGraphic.LINE_WIDTH + 1;
    static COLOR = CircleGraphic.LINE_TYPE + 1;
    static FILL = CircleGraphic.COLOR + 1;
    static TEXT_SHOW = CircleGraphic.FILL + 1;
    static TEXT = CircleGraphic.TEXT_SHOW + 1;
    

    // PROPERTIES

    length = 0;
    values = {
        ...this.values,
        trend: 0,
        text: '',
    };

    template = {
        ...this.template,
        type: 'CircleGraphic',
        // colors: [],
        fill: '#AA552244',
        opacity: 100,
        // lineWidth: 2,
        // lineType: Const.LINE_SOLID,
        textShow: false,
        // textSide: 'right',
        // textInfo: '%',
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
                
        let line_width =  api.value(CircleGraphic.LINE_WIDTH) * 0.3;
        let line_type =  api.value(CircleGraphic.LINE_TYPE);
        let line_dash = CircleGraphic.LINE_TYPE_PATTERN[line_type];
        let stroke = api.value(CircleGraphic.COLOR);
        let fill = api.value(CircleGraphic.FILL);

        let showText = api.value(CircleGraphic.TEXT_SHOW);
        let text =  api.value(CircleGraphic.TEXT);
        let radius = Math.abs(xend - xstart);
        
        this.children.push([
            {
                type: 'circle',
                id: `${name}_CIRCLE_${text}`,
                name: `${name}_CIRCLE_${text}`,
                x: xstart,
                y: ystart,
                shape: {
                    cx: 0,
                    cy: 0,
                    r: radius,
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

        graphic[Const.ID_ID] =  `${Const.FIBO_RET_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.TEXT_ID] = '';
    }
}

