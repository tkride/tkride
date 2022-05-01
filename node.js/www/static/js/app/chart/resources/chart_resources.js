
/** chart_resources.js */

class ChartGraphic {

    // CONSTANTS
    static NAME = 'ChartGraphic';

    static SELECTED = 0;
    static SHOW_CONTROLS = ChartGraphic.SELECTED + 1;
    static XSTART = ChartGraphic.SHOW_CONTROLS + 1;
    static XEND = ChartGraphic.XSTART + 1;
    static YSTART = ChartGraphic.XEND + 1;
    static YEND = ChartGraphic.YSTART + 1; //5

    // CONTROLS
    static CONTROL_COLOR = '#2962ff';
    static CONTROL_AXIS_BACK_COLOR = '#2962ff50';
    static CONTROL_TEXT_COLOR = 'white';
    static CONTROL_LABEL_COLOR = '#2962ff';
    static CIRCLE_WIDTH_HOVER = 1;
    static CIRCLE_WIDTH_SELECTED = 2;
    static CIRCLE_RADIUS = 6;
    static CONTROL_START = '_CONTROL_START';
    static CONTROL_END = '_CONTROL_END';
    static Z_LEVEL_SELECTED = 110;
    static Z_LEVEL_UNSELECTED = 103;

    // EVENTS
    static EVENT_CREATE = 'event-chart-graphic-control-create';
    static EVENT_CREATED = 'event-chart-graphic-control-created';
    static EVENT_PLOT = 'event-chart-graphic-control-plot';
    static EVENT_SELECTED = 'event-chart-graphic-control-selected';
    static EVENT_UNSELECTED = 'event-chart-graphic-control-unselected';
    

    // PROPERTIES
    
    // Identificator
    ID;

    // Template
    template = {
        type: 'ChartGraphic',
    }
    
    // Values
    values = {
        time_frame: 0,
        xstart: 0,
        xend: 0,
        ystart: 0,
        yend: 0,
        xdrag: 0,
        ydrag: 0,
    };
    
    // Settings
    settings = {
        draggable: true,
        z_level: ChartGraphic.Z_LEVEL_UNSELECTED
    }
    
    // Control status
    controlStatus = {
        blocked: false,
        selected: false,
        showControls: false,
    };

    // Render
    chart;
    graphic;
    children = [];
    data = [];
    // Chart values
    xstart_chart;
    xend_chart;
    ystart_chart;
    yend_chart;
    
    // Event callbacks
    mousedown_cb;
    mouseover_cb;
    mouseout_cb;
    last_update = 0;

    constructor({graphic, template, timeFrame, serialized}) {
        if(serialized) {
            this.ID = serialized.ID;
            this.values = serialized.values;
            this.template = serialized.template;
            this.settings = serialized.settings;
            this.controlStatus = serialized.controlStatus;
        }
        else {
            if(timeFrame) {
                this.values.time_frame = Time.convert_to_seconds(timeFrame)*Time.MS_IN_SECONDS;
                // this.values.time_frame = timeFrame;
            }

            this[Const.ID_ID] = (graphic[Const.ID_ID] != undefined) ?
                                        graphic[Const.ID_ID] :
                                        `${Const.CHART_GRAPHIC_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
            // this.name = template.name;
            this.values.xstart = graphic[Const.INIT_ID].time;
            // this.values.xend = graphic[Const.END_ID].time;
            this.values.xend = (graphic[Const.CORRECTION_ID] != undefined) ? graphic[Const.CORRECTION_ID].time : graphic[Const.END_ID].time;
            // if(this.values.xstart > this.values.xend) { [this.values.xstart, this.values.xend] = [this.values.xend, this.values.xstart]; }
            this.values.ystart = graphic[Const.INIT_ID].price;
            this.values.yend = graphic[Const.END_ID].price;
            // if(this.values.ystart > this.values.yend) { [this.values.ystart, this.values.yend] = [this.values.yend, this.values.ystart];}
            this.settings.draggable = (template.draggable != undefined) ? template.draggable : true;
            // this.that = this;
        }

        this.MOUSEDOWN_CONTROL = {
            [`${this[Const.ID_ID]}${ChartGraphic.CONTROL_START}`]: this.mousedown_control_start,
            [`${this[Const.ID_ID]}${ChartGraphic.CONTROL_END}`]: this.mousedown_control_end,
        };
        this.MOUSEDOWN_DEFAULT = this.mousedown_control;

        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_data();
        }
    }

    clone() { return Object.assign({}, this); }

    stringify() {
        let ret = JSON.stringify(
            {
                "ID": this.ID,
                template: this.template,
                values: this.values,
                settings: this.settings,
                controlStatus: this.controlStatus,
        });
        return ret;
    }

    serialize() {
        return {
            "ID": this.ID,
            template: this.template,
            values: this.values,
            settings: this.settings,
            controlStatus: this.controlStatus,
        };
    }

    static deserialize(serialized) {
        let res = {};
        try {
            let type = serialized.template.type;
            let classRef = eval(type);
            res = new classRef({serialized});
        }
        catch(error) { console.error(`Error deserializing: ${error}`);}
        return res;
    }
    
    render(param, api) {
        // if (param.context.rendered) {
        //     return;
        // }
        // param.context.rendered = true;

        let name = param.seriesName;
        let instant_start = api.value(ChartGraphic.XSTART);
        let xstart = api.coord([instant_start, 0])[0];
        instant_start = Math.round(instant_start - (instant_start % this.values.time_frame));
        // let xstart = api.coord([api.value(ChartGraphic.XSTART), 0])[0];
        let instant_end = api.value(ChartGraphic.XEND);
        let xend = api.coord([instant_end, 0])[0];
        instant_end = Math.round(instant_end - (instant_end % this.values.time_frame));
        // let xend = api.coord([api.value(ChartGraphic.XEND), 0])[0];
        let price_start = api.value(ChartGraphic.YSTART);
        let price_end = api.value(ChartGraphic.YEND);
        let ystart = api.coord([0, price_start])[1];
        let yend = api.coord([0, price_end])[1];
        let show_controls = api.value(ChartGraphic.SHOW_CONTROLS);
        let selected = api.value(ChartGraphic.SELECTED);

        this.children = [];
        this.children.push(...this.get_control_handler({ id: name,
            xstart: xstart,
            ystart: ystart,
            xend: xend,
            yend: yend,
            radius: ChartGraphic.CIRCLE_RADIUS,
            invisible: (show_controls) ? false : true,
            stroke: ChartGraphic.CONTROL_COLOR,
            lineWidth: (selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
           })
        );

        this.children.push(...[
            {
                type: 'rect',
                id: `${name}_YAXIS_BACK`,
                name: `${name}_YAXIS_BACK`,
                x: this.chart.getWidth() - 65,
                y: yend + 10,
                invisible: (selected) ? false : true,
                shape: {
                    width: 70,
                    height: (ystart - yend) - 20,
                },
                style: {
                    fill: ChartGraphic.CONTROL_AXIS_BACK_COLOR,
                },
            },
            this.get_axis_label({
                name: name+'_YSTART_',
                x: this.chart.getWidth() - 65,
                y: ystart,
                invisible: (selected) ? false : true,
                text: `${price_start}`.substring(0, 7)}),

            this.get_axis_label({
                name: name+'_YEND_',
                x: this.chart.getWidth() - 65,
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
                    fill: ChartGraphic.CONTROL_AXIS_BACK_COLOR,
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

        return this.graphic;
    }
    
    update_data() {
        // Width is fixed, so it's appended first once
        this.data = [];
        this.data = [this.controlStatus.selected, this.controlStatus.showControls, this.values.xstart, this.values.xend, this.values.ystart, this.values.yend];
        this.data = [this.data];
    }

    update_option() {
        let diff_time = (performance.now() - this.last_update)
        if(diff_time > 30) {
            this.last_update = performance.now();
            this.update_data();
            this.chart.setOption({ series:
                [{
                    id: this[Const.ID_ID],
                    data: this.data,
                    z: this.settings.z_level,
                }]
            });
        }
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

    get_control_handler({ id, name, xstart, ystart, xend, yend, radius, stroke, lineWidth, fill = 'rgba(0, 0, 0, 0)', z = ChartGraphic.Z_LEVEL_UNSELECTED, invisible = true, draggable = true }) {
        if(name == undefined) { name = id; }
        
        return [{
            type: 'circle',
            z: z,
            id: `${id}${ChartGraphic.CONTROL_START}`,
            name: `${id}${ChartGraphic.CONTROL_START}`,
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
            id: `${id}${ChartGraphic.CONTROL_END}`,
            name: `${id}${ChartGraphic.CONTROL_END}`,
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
                    fill: ChartGraphic.CONTROL_LABEL_COLOR,
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
                    fill: ChartGraphic.CONTROL_TEXT_COLOR,
                }
            },
        ];
    }

    set_time_frame(time_frame) {
        this.values.time_frame = Time.convert_to_seconds(time_frame)*Time.MS_IN_SECONDS;
        // this.values.time_frame = time_frame;
    }
    
    select() {
        if(this.controlStatus.selected == false) {
            this.controlStatus.selected = true;
            this.controlStatus.showControls = true;
            this.settings.z_level = ChartGraphic.Z_LEVEL_SELECTED
            this.update_option();
            $(document).trigger(ChartGraphic.EVENT_SELECTED, [this]);
        }
    }

    unselect() {
        if(this.controlStatus.selected == true) {
            this.controlStatus.selected = false;
            this.controlStatus.showControls = false;
            this.settings.z_level = ChartGraphic.Z_LEVEL_UNSELECTED
            this.update_option();
            $(document).trigger(ChartGraphic.EVENT_UNSELECTED, this);
        }
    }

    remove(chart) {
        // let gElements = chart.getOption().graphic;
        this.unselect();
        this.unbind_handler_events();
        // if(gElements && gElements[0].length) {
        //     let idx = gElements.findIndex(g => g.id == this[Const.ID_ID]);
        //     gElements.splice(idx, 1);
        //     chart.setOption({graphic: gElements});
        // }
    }

    // EVENTS -------------------------------------------------------
        
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

    bind_handler_events({ mousedown,
                          mouseover,
                          mouseout,
                        })
    {
        this.mousedown_cb = mousedown.bind(this);
        this.mouseover_cb = mouseover.bind(this);
        this.mouseout_cb = mouseout.bind(this);
        this.chart.on('mousedown', { seriesId: this[Const.ID_ID] }, this.mousedown_cb);
        this.chart.on('mouseover', { seriesId: this[Const.ID_ID] }, this.mouseover_cb);
        this.chart.on('mouseout', { seriesId: this[Const.ID_ID] }, this.mouseout_cb);
    }

    unbind_handler_events()
    {
        // TODO WORKAROUND: POR ALGUN MOTIVO, ECHARTS ELIMINA TODOS LOS HANDLERS DEL EVENTO MOUSEOVER, BUG ECHARTS??
        let filt = Object.assign({}, this.chart._$handlers);
        filt = filt.mouseover.filter(mo => mo.h != this.mouseover_cb);
        this.chart.off('mousedown', this.mousedown_cb);//, this.mousedown_control_management.bind(this));
        this.chart.off('mouseover'), this.mouseover_cb;
        this.chart.off('mouseout', this.mouseout_cb);
        
        // TODO WORKAROUND: POR ALGUN MOTIVO, ECHARTS ELIMINA TODOS LOS HANDLERS DEL EVENTO MOUSEOVER, BUG ECHARTS??
        this.chart._$handlers.mouseover = filt;
    }

    plot(chart) {
        this.chart = chart;

        this.set_option(chart);
        this.bind_handler_events({ mousedown: this.mousedown_control_management,
                                   mouseover: this.mouseover,
                                   mouseout: this.mouseout,
                                });
    }

    //CONTROL HANDLERS EVENTS ---------------------------------------------------------

    mouseover(c) {
        if(c.event.target.parent.name == this[Const.ID_ID]) {
            if(this.controlStatus.selected == false) {
                this.controlStatus.showControls = true;
                this.update_option(c);
            }
        }
    }

    mouseout(c) {
        if(c.event.target.parent.name == this[Const.ID_ID]) {
            if(this.controlStatus.selected == false) {
                this.controlStatus.showControls = false;
                this.update_option(c);
            }
        }
    }

    // Mousedown management
    mousedown_control_management(c) {
        if(c.event.target.parent.name == this[Const.ID_ID]) {
            let func = this.MOUSEDOWN_CONTROL[c.event.target.name] || this.MOUSEDOWN_DEFAULT;
            if(typeof func == 'function') {
                func.call(this, c);
            }
        }
    }
    
    // Control Area
    mousedown_control(c) {
        console.log(this[Const.ID_ID], ': control');
        [this.values.xdrag, this.values.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.controlStatus.selected == false) {
            this.select();
        }
        if(!this.controlStatus.blocked && this.settings.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control, this);
            this.chart.getZr().on('mouseup', this.mouseup_control, this);
        }
        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_option();
        }
    }
    
    mousemove_control(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        if(!isNaN(x) && !isNaN(this.values.xdrag)) {
            let deltaX = x - this.values.xdrag;
            this.values.xstart += deltaX;
            this.values.xend += deltaX;
            this.values.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.values.ydrag)) {
            let deltaY = y - this.values.ydrag;
            this.values.ystart += deltaY;
            this.values.yend += deltaY;
            this.values.ydrag = y;
        }
        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_option();
        }
    }

    mouseup_control(c) {
        console.log('control finished');
        this.chart.getZr().off('mousemove', this.mousemove_control);
        this.chart.getZr().off('mouseup', this.mouseup_control);
        this.enable_chart_move();
    }

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
        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_option();
        }
    }

    mousemove_control_start(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        if(!isNaN(x)) {
            this.values.xstart = x;
            this.values.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.values.ydrag)) {
            this.values.ystart = y;
            this.values.ydrag = y;
        }
        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_option();
        }
    }

    mouseup_control_start(c) {
        console.log('control start finished');
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
        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_option();
        }
    }

    mousemove_control_end(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        if(!isNaN(x)) {
            this.values.xend = x;
            this.values.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.values.ydrag)) {
            this.values.yend = y;
            this.values.ydrag = y;
        }
        if(this.constructor.name == ChartGraphic.NAME) {
            this.update_option();
        }
    }

    mouseup_control_end(c) {
        console.log('control end finished');
        this.chart.getZr().off('mousemove', this.mousemove_control_end, this);
        this.chart.getZr().off('mouseup', this.mouseup_control_end, this);
        this.enable_chart_move();
    }


    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------

    static building_graphic = false;
    static create({chart, template, timeFrame}) {
        if(ChartGraphic.building_graphic == false) {
            ChartGraphic.building_graphic = true;
            chart.getZr().on('mousedown', this.pick_start, [this, {chart, template, timeFrame}]);
        }
    }

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let timeFrame = params.timeFrame;
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        let graphic = {};
        graphic[Const.HASH_ID] = new Date().valueOf();
        graphic[Const.ID_ID] =  `${Const.CHART_GRAPHIC_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.INIT_ID] = new TimePrice(x, y);
        graphic[Const.END_ID] = new TimePrice(x, y);
        graphic[Const.DELTA_INIT_ID] = 0;
        graphic[Const.TIMESTAMP_ID] = graphic[Const.INIT_ID].time;

        let ref = new ChartGraphic({graphic, template, timeFrame});
        $(document).trigger(ChartGraphic.EVENT_PLOT, [ref]);
        ref.select();

        ref.disable_chart_move();
        ref.xdrag = x;
        ref.ydrag = y;
        chart.getZr().on('mousedown', ChartGraphic.pick_end, ref);
        chart.getZr().on('mousemove', ref.mousemove_control_end, ref);

        chart.getZr().off('mousedown', ChartGraphic.pick_start);
        ChartGraphic.building_graphic = false;
    }

    static pick_end(e) {
        $(document).trigger(ChartGraphic.EVENT_CREATED, [ChartGraphic.NAME]);
        this.chart.getZr().off('mousemove', this.mousemove_control_end);
        this.chart.getZr().off('mousedown', ChartGraphic.pick_end);
        this.enable_chart_move();
    }
}
