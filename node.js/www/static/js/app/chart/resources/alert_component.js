/** rectangle.js */

class AlertComponent extends ChartComponent {

    static NAME = 'AlertComponent';

    // CONSTANTS
    static LINE_WIDTH = ChartComponent.YEND + 1; // 6
    static LINE_TYPE = AlertComponent.LINE_WIDTH + 1;
    static COLOR = AlertComponent.LINE_TYPE + 1;
    static FILL = AlertComponent.COLOR + 1;
    static TEXT_SHOW = AlertComponent.FILL + 1;
    static TEXT = AlertComponent.TEXT_SHOW + 1;


    // PROPERTIES
    length = 0;

    values = {
        ...this.values,
        trend: 0,
        text: '',
    };

    template = {
        ...this.template,
        type: 'AlertComponent',
        // colors: [],
        fill: '#bd691f',
        opacity: 100,
        lineWidth: 8,
        lineType: Const.LINE_DASH,
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
                
        let line_width =  api.value(AlertComponent.LINE_WIDTH) * 0.3;
        let line_type =  api.value(AlertComponent.LINE_TYPE);
        let line_dash = AlertComponent.LINE_TYPE_PATTERN[line_type];
        let stroke = api.value(AlertComponent.COLOR);
        let fill = api.value(AlertComponent.FILL);

        let showText = api.value(AlertComponent.TEXT_SHOW);
        let text =  api.value(AlertComponent.TEXT);
        // let _rect = this.chart._coordSysMgr._coordinateSystems[0].model.coordinateSystem._axesMap.y[0].grid._rect;
        let yAxisX = param.coordSys.width + param.coordSys.x;
        let xAxisY = param.coordSys.height + param.coordSys.y;
        let width = yAxisX; //api.getWidth() - 65;
        let height = 15;
        
        this.children.push([
            // {
            //     type: 'rect',
            //     id: `${name}_ALARM_INDICATOR_${text}`,
            //     name: `${name}_ALARM_INDICATOR_${text}`,
            //     x: yAxisX,
            //     y: ystart,
            //     shape: {
            //         x: 0,
            //         y: -(height/2),
            //         width: api.getWidth() - width,
            //         height: height,
            //     },
            //     style: {
            //         fill: stroke,
            //         opacity: 0.5,
            //     }
            // },
            {
                type: 'image',
                id: `${name}_ALARM_INDICATOR_${text}`,
                name: `${name}_ALARM_INDICATOR_${text}`,
                x: yAxisX,
                y: ystart,
                style: {
                    fill: '#FF0000',
                    image: 'static/images/icons/alert-bell.gif',
                    x: 0,
                    y: -(height/2),
                    width: height,
                    height: height,
                }
            },
            {
                type: 'line',
                id: `${name}_ALARM_LINE_${text}`,
                name: `${name}_ALARM_LINE_${text}`,
                shape: {
                    x1: 0,
                    y1: ystart,
                    x2: yAxisX,
                    y2: ystart,
                },
                style: {
                    stroke: stroke,
                    lineWidth: line_width,
                    lineDash: line_dash,
                },
            },
            {
                type: 'rect',
                id: `${name}_ALARM_HOLDER_${text}`,
                name: `${name}_ALARM_HOLDER_${text}`,
                x: xstart,
                y: ystart, // + 2,
                // rotation: angle,
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
                x: yAxisX,
                y: ystart,
                style: {
                    y: -(height/2),
                    fill: stroke,
                    text: text, //'🔔',
                },
            });
        }

        this.graphic.z = ChartComponent.Z_LEVEL_TOP;
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
        // super.set_option(chart);

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
        this.chart.getZr().setCursorStyle('n-resize');
        this.update_option();
    }

    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------
    
    static grabData({graphic, template, x, y}) {
        super.grabData({graphic, template, x, y});
        graphic[Const.ID_ID] =  `${Const.ALERT_COMPONENT_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.TEXT_ID] = '';
    }
}

