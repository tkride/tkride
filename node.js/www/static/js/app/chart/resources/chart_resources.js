
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
    static CIRCLE_COLOR = '#2962ff'; //'rgba(20, 113, 205, 1)';
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
    ID;
    template;
    name;
    
    xstart;
    xend;
    xstart_chart;
    xend_chart;
    xdrag;

    ystart;
    ystart_chart;
    yend;
    yend_chart;
    ydrag;
    
    blocked = false;
    draggable = true;
    z_level = ChartGraphic.Z_LEVEL_UNSELECTED;
    
    chart;
    graphic;
    children = [];
    data = [];

    selected = false;
    show_controls = false;
    
    mousedown_cb;
    mouseover_cb;
    mouseout_cb;
    last_update = 0;

    constructor({graphic, template}) {
        this[Const.ID_ID] = (graphic[Const.ID_ID] != undefined) ?
                                    graphic[Const.ID_ID] :
                                    `${Const.FIBO_RET_ID}${(template.name) ? '_' + template.name:''}_${graphic[Const.HASH_ID]}`;
        this.name = template.name;
        this.xstart = graphic[Const.INIT_ID].time;
        // this.xend = graphic[Const.END_ID].time;
        this.xend = (graphic[Const.CORRECTION_ID] != undefined) ? graphic[Const.CORRECTION_ID].time : graphic[Const.END_ID].time;
        // if(this.xstart > this.xend) { [this.xstart, this.xend] = [this.xend, this.xstart]; }
        this.ystart = graphic[Const.INIT_ID].price;
        this.yend = graphic[Const.END_ID].price;
        // if(this.ystart > this.yend) { [this.ystart, this.yend] = [this.yend, this.ystart];}
        this.draggable = (template.draggable != undefined) ? template.draggable : true;
        this.that = this;

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

    data() { JSON.parse(JSON.stringify(this)); }

    
    render(param, api) {
        // if (param.context.rendered) {
        //     return;
        // }
        // param.context.rendered = true;

        let name = param.seriesName;
        let xstart = api.coord([api.value(ChartGraphic.XSTART), 0])[0];
        let xend = api.coord([api.value(ChartGraphic.XEND), 0])[0];
        let ystart = api.value(ChartGraphic.YSTART);
        let yend = api.value(ChartGraphic.YEND);
        ystart = api.coord([0, ystart])[1];
        yend = api.coord([0, yend])[1];
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
            stroke: ChartGraphic.CIRCLE_COLOR,
            lineWidth: (selected) ? ChartGraphic.CIRCLE_WIDTH_SELECTED : ChartGraphic.CIRCLE_WIDTH_HOVER,
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
        }

        return this.graphic;
    }
    
    update_data() {
        // Width is fixed, so it's appended first once
        this.data = [];
        this.data = [this.selected, this.show_controls, this.xstart, this.xend, this.ystart, this.yend];
        this.data = [this.data];
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

    update_option() {
        let diff_time = (performance.now() - this.last_update)
        if(diff_time > 30) {
            this.last_update = performance.now();
            this.update_data();
            this.chart.setOption({ series:
                [{
                    id: this[Const.ID_ID],
                    data: this.data,
                    z: this.z_level,
                }]
            });
        }
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


    select() {
        if(this.selected == false) {
            this.selected = true;
            this.show_controls = true;
            this.z_level = ChartGraphic.Z_LEVEL_SELECTED
            this.update_option();
            $(document).trigger(ChartGraphic.EVENT_SELECTED, [this]);
        }
    }

    unselect() {
        if(this.selected == true) {
            this.selected = false;
            this.show_controls = false;
            this.z_level = ChartGraphic.Z_LEVEL_UNSELECTED
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
            if(this.selected == false) {
                this.show_controls = true;
                this.update_option(c);
            }
        }
    }

    mouseout(c) {
        if(c.event.target.parent.name == this[Const.ID_ID]) {
            if(this.selected == false) {
                this.show_controls = false;
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
        [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.selected == false) {
            this.select();
        }
        if(!this.blocked && this.draggable) {
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
        if(!isNaN(x) && !isNaN(this.xdrag)) {
            let deltaX = x - this.xdrag;
            this.xstart += deltaX;
            this.xend += deltaX;
            this.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.ydrag)) {
            let deltaY = y - this.ydrag;
            this.ystart += deltaY;
            this.yend += deltaY;
            this.ydrag = y;
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
        [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.selected == false) {
            this.select();
        }
        
        if(!this.blocked && this.draggable) {
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
            this.xstart = x;
            this.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.ydrag)) {
            this.ystart = y;
            this.ydrag = y;
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
        [this.xdrag, this.ydrag] = this.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [c.event.offsetX, c.event.offsetY]);

        if(this.selected == false) {
            this.select();
        }
        
        if(!this.blocked && this.draggable) {
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
            this.xend = x;
            this.xdrag = x;
        }

        if(!isNaN(y) && !isNaN(this.ydrag)) {
            this.yend = y;
            this.ydrag = y;
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


    // CREATE GRAPHIC CONTROL -------------------------------------------------------------------------------

    static building_graphic = false;
    static create({chart, template}) {
        if(ChartGraphic.building_graphic == false) {
            ChartGraphic.building_graphic = true;
            chart.getZr().on('mousedown', this.pick_start, [this, {chart, template}]);
        }
    }

    static pick_start(e) {
        let params = this[1];
        let chart = params.chart;
        let template = params.template;
        let [x, y] = chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [e.event.offsetX, e.event.offsetY]);
        let graphic = {};
        graphic[Const.HASH_ID] = new Date().valueOf();
        graphic[Const.INIT_ID] = new TimePrice(x, y);
        graphic[Const.END_ID] = new TimePrice(x, y);
        graphic[Const.DELTA_INIT_ID] = 0;
        graphic[Const.TIMESTAMP_ID] = graphic[Const.INIT_ID].time;

        let ref = new ChartGraphic({graphic, template});

        $(document).trigger(ChartGraphic.EVENT_PLOT, [ref]);
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
