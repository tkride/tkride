
/** chart_graphic.js */

class GraphicComponent extends ChartComponent {

    // CONSTANTS
    static NAME = 'GraphicComponent';

    // PROPERTIES

    // CONSTRUCTOR

    constructor({graphic, template, timeFrame, serialized}) {
        if(serialized) {
            super({serialized});
        }
        else {
            super({graphic: graphic, template, timeFrame });
        }

        this.MOUSEDOWN_CONTROL = {
            [`${this[Const.ID_ID]}${GraphicComponent.CONTROL_START}`]: this.mousedown_control_start,
            [`${this[Const.ID_ID]}${GraphicComponent.CONTROL_END}`]: this.mousedown_control_end,
        };
        this.MOUSEDOWN_DEFAULT = this.mousedown_control;

        if(this.constructor.name == GraphicComponent.NAME) {
            this.update_data();
        }
    }

    update_option() {
        // if(this.utime) {
        //     let diff = performance.now() - this.utime;
        //     console.warn('UPDATE PERIOD: ', diff);
        // }

        let diff_time = (performance.now() - this.last_update)
        if(diff_time > ChartComponent.REFRESH_RATE) {
            this.update_data();
            this.chart.setOption({ series:
                [{
                    id: this[Const.ID_ID],
                    data: this.data,
                    z: this.settings.z_level,
                },
                {
                    id: this[Const.ID_ID]+'_LABEL',
                    data: this.data,
                    z: this.settings.z_level,
                }]
            });
            this.last_update = performance.now();
        }
        // else {
            // console.warn('DIFF TIME: ', diff_time);
        // }

        // this.utime = performance.now();
    }

    set_option(chart) {
        chart.setOption({ 
            series: [
                {
                    id: this[Const.ID_ID]+'_LABEL',
                    name: this[Const.ID_ID]+'_LABEL',
                    type: 'custom',
                    renderItem: this.renderLabel.bind(this),
                    encode: {
                        x: [GraphicComponent.XSTART, GraphicComponent.XEND],
                        y: [GraphicComponent.YSTART, GraphicComponent.YEND],
                    },
                    data: this.data,
                    z: this.settings.z_level,
                }
            ],
        });
    }

    render(param, api) {
        if (param.context.rendered) {
            return;
        }

        // if(this.out) {
        //     let diffOut = (performance.now() - this.out);
        //     if(diffOut > 150) {
        //         console.warn('DIFF OUT: ', diffOut);
        //     }
        // }

        let name = param.seriesName;
        let instant_start = api.value(GraphicComponent.XSTART);
        let xstart = api.coord([instant_start, 0])[0];
        instant_start = Math.round(instant_start - (instant_start % this.values.time_frame));
        // let xstart = api.coord([api.value(GraphicComponent.XSTART), 0])[0];
        let instant_end = api.value(GraphicComponent.XEND);
        let xend = api.coord([instant_end, 0])[0];
        instant_end = Math.round(instant_end - (instant_end % this.values.time_frame));
        // let xend = api.coord([api.value(GraphicComponent.XEND), 0])[0];
        let price_start = api.value(GraphicComponent.YSTART);
        let price_end = api.value(GraphicComponent.YEND);
        let ystart = api.coord([0, price_start])[1];
        let yend = api.coord([0, price_end])[1];
        let show_controls = api.value(GraphicComponent.SHOW_CONTROLS);
        let selected = api.value(GraphicComponent.SELECTED);

        this.children = [];
        this.children.push(...this.get_control_handler({ id: name,
            xstart: xstart,
            ystart: ystart,
            xend: xend,
            yend: yend,
            radius: GraphicComponent.CIRCLE_RADIUS,
            invisible: (show_controls) ? false : true,
            stroke: GraphicComponent.CONTROL_COLOR,
            lineWidth: (selected) ? GraphicComponent.CIRCLE_WIDTH_SELECTED : GraphicComponent.CIRCLE_WIDTH_HOVER,
           })
        );

        this.graphic = {
            type: 'group',
            id: `${name}`,
            name: `${name}`,
            children: [].concat(...this.children),
            draggable: true,
            xstart: xstart,
            xend: xend,
            ystart: ystart,
            yend: yend,
        }

        param.context.rendered = true;

        // let diffIn = (this.in - performance.now());
        // if(diffIn > 150) {
        //     console.warn('DIFF IN: ', diffIn);
        // }
        // this.out = performance.now();
        
        return this.graphic;
    }

    renderLabel(param, api) {
        if (param.context.rendered) {
            return;
        }

        let name = param.seriesName;
        let instant_start = api.value(GraphicComponent.XSTART);
        let xstart = api.coord([instant_start, 0])[0];
        instant_start = Math.round(instant_start - (instant_start % this.values.time_frame));
        // let xstart = api.coord([api.value(GraphicComponent.XSTART), 0])[0];
        let instant_end = api.value(GraphicComponent.XEND);
        let xend = api.coord([instant_end, 0])[0];
        instant_end = Math.round(instant_end - (instant_end % this.values.time_frame));
        let price_start = api.value(GraphicComponent.YSTART);
        let price_end = api.value(GraphicComponent.YEND);
        let ystart = api.coord([0, price_start])[1];
        let yend = api.coord([0, price_end])[1];
        let show_controls = api.value(GraphicComponent.SHOW_CONTROLS);
        let selected = api.value(GraphicComponent.SELECTED);

        let children = [];

        // let _rect = this.chart._coordSysMgr._coordinateSystems[0].model.coordinateSystem._axesMap.y[0].grid._rect;
        let yAxisX = param.coordSys.width + param.coordSys.x;
        let xAxisY = param.coordSys.height + param.coordSys.y;

        children.push(...[
            {
                type: 'rect',
                id: `${name}_YAXIS_BACK`,
                name: `${name}_YAXIS_BACK`,
                x: yAxisX, //this.chart.getWidth() - 65,
                y: yend + 10,
                invisible: (selected) ? false : true,
                shape: {
                    width: 70,
                    height: (ystart - yend) - 20,
                },
                style: {
                    fill: GraphicComponent.CONTROL_AXIS_BACK_COLOR,
                },
            },
            this.get_axis_label({
                name: name+'_YSTART_',
                x: yAxisX, //this.chart.getWidth() - 65,
                y: ystart,
                invisible: (selected) ? false : true,
                text: `${price_start}`.substring(0, 7)}),

            this.get_axis_label({
                name: name+'_YEND_',
                x: yAxisX, //this.chart.getWidth() - 65,
                y: yend,
                invisible: (selected) ? false : true,
                text: `${price_end}`.substring(0, 7)}),
            {
                type: 'rect',
                id: `${name}_XAXIS_BACK`,
                name: `${name}_XAXIS_BACK`,
                x: xstart,
                y: this.chart.getHeight() - 30,
                invisible: (selected) ? false : true,
                shape: {
                    width: (xend - xstart),
                    height: 25,
                },
                style: {
                    fill: GraphicComponent.CONTROL_AXIS_BACK_COLOR,
                },
            },
            this.get_axis_label({
                name: name+'_XSTART_',
                x: xstart - 50,
                y: this.chart.getHeight() - 15,
                invisible: (selected) ? false : true,
                text: new Date(instant_start).toLocaleString().replace(',',''),
                fontSize: 12,
            }),

            this.get_axis_label({
                name: name+'_XEND_',
                x: xend - 50,
                y: this.chart.getHeight() - 15,
                invisible: (selected) ? false : true,
                text: new Date(instant_end).toLocaleString().replace(',',''),
                fontSize: 12,
            }),
        ]);

        let graphic = {
            type: 'group',
            id: `${name}`,
            name: `${name}`,
            children: [].concat(...children),
            draggable: true,
            xstart: xstart,
            xend: xend,
            ystart: ystart,
            yend: yend,
            z: ChartComponent.Z_LEVEL_UNSELECTED,
        }

        param.context.rendered = true;

        return graphic;
    }

    get_control_handler({ id, name, xstart, ystart, xend, yend, radius, stroke, lineWidth, fill = 'rgba(0, 0, 0, 0)', z = GraphicComponent.Z_LEVEL_UNSELECTED, invisible = true, draggable = true }) {
        if(name == undefined) { name = id; }
        
        return [{
            type: 'circle',
            z: z,
            id: `${id}${GraphicComponent.CONTROL_START}`,
            name: `${id}${GraphicComponent.CONTROL_START}`,
            invisible: invisible,
            draggable: draggable,
            shape: {
                cx: xstart,
                cy: ystart,
                r: radius,
            },
            style: {
                stroke: stroke,
                fill: fill,
                lineWidth: lineWidth,
            },
        },
        {
            type: 'circle',
            z: z,
            id: `${id}${GraphicComponent.CONTROL_END}`,
            name: `${id}${GraphicComponent.CONTROL_END}`,
            invisible: invisible,
            draggable: draggable,
            shape: {
                cx: xend,
                cy: yend,
                r: radius, 
            },
            style: {
                stroke: stroke,
                fill: fill,
                lineWidth: lineWidth,
            },
        }];
    } //get_control_handler

    get_axis_label({ name, x, y, z, invisible, text, fontSize }) {
        fontSize = (fontSize) ? fontSize : 15;
        let width = (text.length*(fontSize/1.8)) + 10;
        return [
            {
                type: 'rect',
                id: `${name}_AXIS_LABEL`,
                name: `${name}_AXIS_LABEL`,
                x: x,
                y: y - 15,
                z: z,
                invisible: invisible,
                shape: {
                    width: width,
                    height: 25,
                },
                style: {
                    fill: GraphicComponent.CONTROL_LABEL_COLOR,
                },
            },
            {
                type: 'text',
                id: `${name}_AXIS_TEXT`,
                name: `${name}_AXIS_TEXT`,
                x: x + 10,// + 35,
                y: y - 10,
                z: z+1,
                invisible: invisible,
                style: {
                    text: text,
                    fontSize: fontSize,
                    fill: GraphicComponent.CONTROL_TEXT_COLOR,
                }
            },
        ];
    }


    // EVENTS -------------------------------------------------------

    //CONTROL HANDLERS EVENTS ---------------------------------------------------------

    // Mousedown management
    // mousedown_control_management(c) {
    //     if(c.event.target.parent.name == this[Const.ID_ID]) {
    //         let func = this.MOUSEDOWN_CONTROL[c.event.target.name] || this.MOUSEDOWN_DEFAULT;
    //         if(typeof func == 'function') {
    //             func.call(this, c);
    //         }
    //     }
    // }
    
    // Control Area
    // mousedown_control(c) {
    //     console.log(this[Const.ID_ID], ': control');
    //     [this.values.xdrag, this.values.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

    //     if(this.controlStatus.selected == false) {
    //         this.select();
    //     }
    //     if(!this.controlStatus.blocked && this.settings.draggable) {
    //         this.disable_chart_move();
    //         this.chart.getZr().on('mousemove', this.mousemove_control, this);
    //         this.chart.getZr().on('mouseup', this.mouseup_control, this);
    //     }
    //     if(this.constructor.name == GraphicComponent.NAME) {
    //         this.update_option();
    //     }
    // }
    
    // mousemove_control(c) {
    //     let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
    //     if(!isNaN(x) && !isNaN(this.values.xdrag)) {
    //         let deltaX = x - this.values.xdrag;
    //         this.values.xstart += deltaX;
    //         this.values.xend += deltaX;
    //         this.values.xdrag = x;
    //     }

    //     if(!isNaN(y) && !isNaN(this.values.ydrag)) {
    //         let deltaY = y - this.values.ydrag;
    //         this.values.ystart += deltaY;
    //         this.values.yend += deltaY;
    //         this.values.ydrag = y;
    //     }
    //     if(this.constructor.name == GraphicComponent.NAME) {
    //         this.update_option();
    //     }
    // }

    // mouseup_control(c) {
    //     console.log('control finished');
    //     this.chart.getZr().off('mousemove', this.mousemove_control);
    //     this.chart.getZr().off('mouseup', this.mouseup_control);
    //     this.enable_chart_move();
    // }

    // Handler start
    mousedown_control_start(c) {
        console.log(this[Const.ID_ID], ': control_start');
        [this.values.xdrag, this.values.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.controlStatus.selected == false) {
            this.select();
        }
        
        if(!this.controlStatus.blocked && this.settings.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control_start, this);
            this.chart.getZr().on('mouseup', this.mouseup_control_start, this);
        }
        if(this.constructor.name == GraphicComponent.NAME) {
            this.update_option();
        }
    }

    mousemove_control_start(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        this.chart.getZr().setCursorStyle('ne-resize');
        if(!isNaN(x)) {
            this.values.xstart = x;
            this.values.xdrag = x;
        }
        if(!isNaN(y) && !isNaN(this.values.ydrag)) {
            this.values.ystart = y;
            this.values.ydrag = y;
        }
        if(this.constructor.name == GraphicComponent.NAME) {
            this.update_option();
        }
    }

    mouseup_control_start(c) {
        console.log('control start finished');
        this.chart.getZr().setCursorStyle('crosshair');
        this.chart.getZr().off('mousemove', this.mousemove_control_start, this);
        this.chart.getZr().off('mouseup', this.mouseup_control_start, this);
        this.enable_chart_move();
    }

    // Handler end
    mousedown_control_end(c) {
        console.log(this[Const.ID_ID], ': control_end');
        [this.values.xdrag, this.values.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.controlStatus.selected == false) {
            this.select();
        }
        
        if(!this.controlStatus.blocked && this.settings.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control_end, this);
            this.chart.getZr().on('mouseup', this.mouseup_control_end, this);
        }
        if(this.constructor.name == GraphicComponent.NAME) {
            this.update_option();
        }
    }

    mousemove_control_end(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        this.chart.getZr().setCursorStyle('ne-resize');
        if(!isNaN(x)) {
            this.values.xend = x;
            this.values.xdrag = x;
        }
        if(!isNaN(y) && !isNaN(this.values.ydrag)) {
            this.values.yend = y;
            this.values.ydrag = y;
        }
        if(this.constructor.name == GraphicComponent.NAME) {
            this.update_option();
        }
    }

    mouseup_control_end(c) {
        console.log('control end finished');
        this.chart.getZr().setCursorStyle('crosshair');
        this.chart.getZr().off('mousemove', this.mousemove_control_end, this);
        this.chart.getZr().off('mouseup', this.mouseup_control_end, this);
        this.enable_chart_move();
    }


    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------
    
    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let timeFrame = params.timeFrame;
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        let graphic = {};

        this[0].grabData({graphic, template, x, y});

        let ref = new this[0]({graphic, template, timeFrame});
        $(document).trigger(GraphicComponent.EVENT_PLOT, [ref]);
        ref.select();

        ref.disable_chart_move();
        ref.values.xdrag = x;
        ref.values.ydrag = y;
        chart.getZr().on('mouseup', GraphicComponent.pick_end, ref);
        chart.getZr().on('mousemove', ref.mousemove_control_end, ref);

        chart.getZr().off('mouseup', GraphicComponent.pick_start);
        ChartComponent.building_graphic = false;

        $(document).on(Const.EVENT_CLOSE, (e) => {
            GraphicComponent.pick_end.apply(ref, [e, Const.EVENT_CANCELED]);
        });
    }

    static pick_end(e, param) {
        $(document).off(Const.EVENT_CLOSE);
        this.chart.getZr().off('mousemove', this.mousemove_control_end);
        this.chart.getZr().off('mouseup', GraphicComponent.pick_end);
        this.enable_chart_move();
        $(document).trigger(ChartComponent.EVENT_CREATED, [this.constructor.name, param]);
        if(param == Const.EVENT_CANCELED) {
            $(document).trigger(MenuChartGraphic.EVENT_REMOVE, [this]);
        }
    }
}
