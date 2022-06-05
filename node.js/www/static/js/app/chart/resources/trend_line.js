/** trend_line.js */

class TrendLine extends GraphicComponent {

    static NAME = 'TrendLine';

    // CONSTANTS
    static LINE_WIDTH = ChartComponent.YEND + 1; // 6
    static LINE_TYPE = TrendLine.LINE_WIDTH + 1;
    static COLOR = TrendLine.LINE_TYPE + 1;
    static TEXT_SHOW = TrendLine.COLOR + 1;
    static TEXT = TrendLine.TEXT_SHOW + 1;
    static SLOPE = TrendLine.TEXT + 1; // 11
    

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
        // colors: [],
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
                // this.template.colors.push(`#${r}${g}${b}${opacity_hex}`);
                this.template.colors.push(`#${r}${g}${b}`);
            }
        }

        this.getOpacityColors();

        // Fill data
        this.update_data();
    }
    

    render(param, api) {
        if (param.context.rendered) {
            return;
        }
        
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
        let height = 10;
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
                    y: -(height/2),
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

        param.context.rendered = true;

        return this.graphic;
    }
    
    
    getOpacityColors() {
        let opacityHex = super.getOpacityHex();
        this.color = `${this.template.colors[0]}${opacityHex}`;
    }


    update_data() {
        // Width is fixed, so it's appended first once
        super.update_data();
        let text = this.get_text();
        let data = [
            this.template.lineWidth,
            this.template.lineType,
            this.color,
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
        if(this.template.textInfo == '%') {
            return parseFloat(this.values.slope).toFixed(2)*100+'%';
        }
        else if(this.template.textInfo == 'value') {
            return parseFloat(this.values.angle).toFixed(2)+'º';
        }
        else {
            let text = `${this.values.slope.toFixed(3)*100}% (${this.values.angle.toFixed(3)})`;
            return text;
        }
    }
    
    setTemplate(template) {
        super.setTemplate(template);
        this.getOpacityColors();
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

    static grabData({graphic, template, x, y}) {
        super.grabData({graphic, template, x, y});

        graphic[Const.ID_ID] =  `${Const.TREND_LINE_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.DELTA_X_ID] = 0;
        graphic[Const.DELTA_Y_ID] = 0;
        graphic[Const.SLOPE_ID] = 0;
        graphic[Const.ANGLE_ID] = 0;
    }
}

