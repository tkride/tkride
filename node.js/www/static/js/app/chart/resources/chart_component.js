
/** chart_custom.js */

class ChartComponent {

    // CONSTANTS
    static NAME = 'ChartComponent';

    static SELECTED = 0;
    static SHOW_CONTROLS = ChartComponent.SELECTED + 1;
    static XSTART = ChartComponent.SHOW_CONTROLS + 1;
    static XEND = ChartComponent.XSTART + 1;
    static YSTART = ChartComponent.XEND + 1;
    static YEND = ChartComponent.YSTART + 1; //5

    static REFRESH_RATE = 30;

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
    static Z_LEVEL_TOP = 120;
    static Z_LEVEL_SELECTED = 110;
    static Z_LEVEL_UNSELECTED = 103;

    // EVENTS
    static EVENT_CREATE = 'event-chart-component-control-create';
    static EVENT_CREATED = 'event-chart-component-control-created';
    static EVENT_PLOT = 'event-chart-component-control-plot';
    static EVENT_SELECTED = 'event-chart-component-control-selected';
    static EVENT_UNSELECTED = 'event-chart-component-control-unselected';
       
    static LINE_TYPE_PATTERN = {
        [Const.LINE_SOLID]: [1, 0],
        [Const.LINE_DASH]: [6, 6],
        [Const.LINE_DOT]: [2, 2],
    }


    // PROPERTIES
    
    // Identificator
    ID;

    // Template
    template = {
        type: 'ChartComponent',
        colors: [],
        opacity: 30,
        lineWidth: 1,
        lineType: Const.LINE_SOLID,
        textShow: true,
        textSide: 'right',
        textInfo: '%',
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
        z_level: ChartComponent.Z_LEVEL_UNSELECTED
    }
    
    // Control status
    controlStatus = {
        blocked: false,
        selected: false,
        showControls: false,
        magnetMode: false,
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

    constructor({graphic, template, timeFrame, serialized, magnetMode}) {
        if(serialized) {
            this.ID = serialized.ID;
            this.values = serialized.values;
            this.template = serialized.template;
            this.settings = serialized.settings;
            this.controlStatus = serialized.controlStatus;
        }
        else {
            if(timeFrame) {
                this.values.time_frame = Time.convertToSeconds(timeFrame)*Time.MS_IN_SECONDS;
            }

            if(magnetMode) {
                this.controlStatus.magnetMode = magnetMode;
            }

            this[Const.ID_ID] = (graphic[Const.ID_ID] != undefined) ?
                                        graphic[Const.ID_ID] :
                                        `${Const.CHART_GRAPHIC_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
            this.values.xstart = graphic[Const.INIT_ID].time;
            // this.values.xend = graphic[Const.END_ID].time;
            this.values.xend = (graphic[Const.CORRECTION_ID] != undefined) ? graphic[Const.CORRECTION_ID].time : graphic[Const.END_ID].time;
            this.values.ystart = graphic[Const.INIT_ID].price;
            this.values.yend = graphic[Const.END_ID].price;
            this.settings.draggable = (template.draggable != undefined) ? template.draggable : true;
        }

        this.MOUSEDOWN_CONTROL = {
            // [`${this[Const.ID_ID]}${ChartComponent.CONTROL_START}`]: this.mousedown_control_start,
            // [`${this[Const.ID_ID]}${ChartComponent.CONTROL_END}`]: this.mousedown_control_end,
        };
        this.MOUSEDOWN_DEFAULT = this.mousedown_control;

        if(this.constructor.name == ChartComponent.NAME) {
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
        
    update_data() {
        // Width is fixed, so it's appended first once
        this.data = [];
        this.data = [this.controlStatus.selected, this.controlStatus.showControls, this.values.xstart, this.values.xend, this.values.ystart, this.values.yend];
        this.data = [this.data];
    }

    update_option() {
        let diff_time = (performance.now() - this.last_update)
        if(diff_time > 10) {
            this.last_update = performance.now();
            this.update_data();
            this.chart.setOption({ series:
                {
                    id: this[Const.ID_ID],
                    data: this.data,
                    z: this.settings.z_level,
                }
            });
        }
    }

    // set_option(chart) {
        // chart.setOption({ 
        //     series: [{
        //         id: this[Const.ID_ID],
        //         name: this[Const.ID_ID],
        //         type: 'custom',
        //         renderItem: this.render.bind(this),
        //         encode: {
        //             x: [ChartComponent.XSTART, ChartComponent.XEND],
        //             y: [ChartComponent.YSTART, ChartComponent.YEND],
        //         },
        //         data: this.data,
        //         // clip: true,
        //         z: this.settings.z_level,
        //     }],
        // });
    // }

    render(param, api) {
        if (param.context.rendered) {
            return;
        }

        let name = param.seriesName;
        let instant_start = api.value(ChartComponent.XSTART);
        let xstart = api.coord([instant_start, 0])[0];
        instant_start = Math.round(instant_start - (instant_start % this.values.time_frame));
        // let xstart = api.coord([api.value(ChartComponent.XSTART), 0])[0];
        let instant_end = api.value(ChartComponent.XEND);
        let xend = api.coord([instant_end, 0])[0];
        instant_end = Math.round(instant_end - (instant_end % this.values.time_frame));
        // let xend = api.coord([api.value(ChartComponent.XEND), 0])[0];
        let price_start = api.value(ChartComponent.YSTART);
        let price_end = api.value(ChartComponent.YEND);
        let ystart = api.coord([0, price_start])[1];
        let yend = api.coord([0, price_end])[1];
        let show_controls = api.value(ChartComponent.SHOW_CONTROLS);
        let selected = api.value(ChartComponent.SELECTED);

        this.children = [];

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

        return this.graphic;
    }

    setMagnetMode(magnetMode) {
        this.controlStatus.magnetMode = magnetMode;
    }

    setTimeFrame(time_frame) {
        this.values.time_frame = Time.convertToSeconds(time_frame)*Time.MS_IN_SECONDS;
        // this.values.time_frame = time_frame;
    }

    setTemplate(template) {
        if(template) {
            // TODO WORKAROUND HASTA DEFINIR CONTROLES PARA COLORES
            // let colors = this.template.colors;
            this.template = { ...this.template, ...template };
            // this.template.colors = colors;
        }
    }
    
    select() {
        if(this.controlStatus.selected == false) {
            this.controlStatus.selected = true;
            this.controlStatus.showControls = true;
            this.settings.z_level = ChartComponent.Z_LEVEL_SELECTED
            this.update_option();
            $(document).trigger(ChartComponent.EVENT_SELECTED, [this]);
        }
    }

    unselect() {
        if(this.controlStatus.selected == true) {
            this.controlStatus.selected = false;
            this.controlStatus.showControls = false;
            this.settings.z_level = ChartComponent.Z_LEVEL_UNSELECTED
            this.update_option();
            $(document).trigger(ChartComponent.EVENT_UNSELECTED, [this]);
        }
    }

    remove() {
        this.unbind_handler_events();
        this.unselect();
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
            this.chart.getZr().setCursorStyle('pointer');
            if(this.controlStatus.selected == false) {
                this.controlStatus.showControls = true;
                this.update_option(c);
            }
        }
    }

    mouseout(c) {
        if(c.event.target.parent.name == this[Const.ID_ID]) {
            this.chart.getZr().setCursorStyle('crosshair');
            if(this.controlStatus.selected == false) {
                this.controlStatus.showControls = false;
                this.last_update = 0;
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
        this.chart.getZr().setCursorStyle('all-scroll');

        if(this.controlStatus.selected == false) {
            this.select();
        }
        if(!this.controlStatus.blocked && this.settings.draggable) {
            this.disable_chart_move();
            this.chart.getZr().on('mousemove', this.mousemove_control, this);
            this.chart.getZr().on('mouseup', this.mouseup_control, this);
        }
        if(this.constructor.name == ChartComponent.NAME) {
            this.update_option();
        }
    }
    
    mousemove_control(c) {
        let [x, y] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);
        this.chart.getZr().setCursorStyle('all-scroll');
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
        if(this.constructor.name == ChartComponent.NAME) {
            this.update_option();
        }
    }

    mouseup_control(c) {
        console.log('control finished');
        this.chart.getZr().setCursorStyle('crosshair');
        this.chart.getZr().off('mousemove', this.mousemove_control);
        this.chart.getZr().off('mouseup', this.mouseup_control);
        this.enable_chart_move();
    }


    // BUILD GRAPHIC CONTROL -------------------------------------------------------------------------------

    static building_graphic = false;

    static cancelCreate(chart) {
        chart.getZr().off('mouseup', this.pick_start);
        ChartComponent.building_graphic = false;
        $(document).trigger(ChartComponent.EVENT_CREATED, [this.NAME, Const.EVENT_CANCELED]);
    }

    static create({chart, template, timeFrame, magnetMode}) {
        $(document).on(Const.EVENT_CLOSE, (e) => this.cancelCreate(chart));
        if(ChartComponent.building_graphic == false) {
            ChartComponent.building_graphic = true;
            chart.getZr().on('mouseup', this.pick_start, [this, {chart, template, timeFrame, magnetMode}]);
        }
    }

    static pickClosestPoint({data, x, y}) {
        try {
            let d = data.filter( v => v[ChartView.ECHARTS_TIMESTAMP] <= x).reduce( (a,b) => a > b ? a : b);
            let time = d[ChartView.ECHARTS_TIMESTAMP];
            let price = (y > d[ChartView.ECHARTS_HIGHT]) ? d[ChartView.ECHARTS_HIGHT] : d[ChartView.ECHARTS_LOW];
            return {time, price};
        }
        catch(error) {
            console.error(error);
        }
        return { time: x, price: y};
    }

    static grabData({graphic, template, x, y}) {
        graphic[Const.HASH_ID] = new Date().valueOf();
        graphic[Const.ID_ID] =  `${Const.CHART_COMPONENT_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        graphic[Const.INIT_ID] = new TimePrice(x, y);
        graphic[Const.END_ID] = new TimePrice(x, y);
        graphic[Const.TIMESTAMP_ID] = graphic[Const.INIT_ID].time;
        graphic[Const.DELTA_INIT_ID] = 0;
        graphic[Const.TREND_ID] = Const.BULL;
    }

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let timeFrame = params.timeFrame;
        let magnetMode = params.magnetMode;
        let graphic = {};
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        
        if(magnetMode) {
            // let data = chart.getOption().series[0].data;
            let series = chart.getOption().series.filter( s => s.id.includes('_CURSOR'))[0];
            let active = series.id.replace('_CURSOR', '');
            let data = chart.getOption().series.filter( s => s.id == active)[0].data;
            let {time, price} = ChartComponent.pickClosestPoint({data, x, y});
            [x, y] = [(time) ? time : x, (price) ? price : y];
        }

        this[0].grabData({graphic, template, x, y});

        let ref = new this[0]({graphic, template, timeFrame});
        $(document).trigger(ChartComponent.EVENT_PLOT, [ref]);
        ref.select();

        ref.values.xdrag = x;
        ref.values.ydrag = y;

        chart.getZr().off('mouseup', ChartComponent.pick_start);
        ChartComponent.building_graphic = false;
        $(document).off(Const.EVENT_CLOSE);
        $(document).trigger(ChartComponent.EVENT_CREATED, [this[0].NAME]);
    }
}
