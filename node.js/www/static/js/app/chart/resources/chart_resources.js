
/** chart_resources.js */

class ChartGraphic {
    // CONSTANTS
    static CIRCLE_COLOR = 'rgba(26, 119, 211, 1)';
    static CIRCLE_WIDTH_HOVER = 1;
    static CIRCLE_WIDTH_SELECTED = 2;
    static CIRCLE_RADIUS = 6;
    static CONTROL_START = '_CONTROL_START';
    static CONTROL_END = '_CONTROL_END';
    static Z_LEVEL_SELECTED = 110;
    static Z_LEVEL_UNSELECTED = 103;

    // PROPERTIES
    name;
    template_name;
    xstart;
    xend;
    xstart_chart;
    xend_chart;
    ystart;
    ystart_chart;
    yend;
    yend_chart;
    blocked = false;
    draggable = true;
    xdrag;
    ydrag;
    chart;
    children = [];
    selected = false;
    controls;
    show_controls = false;
    data = [];
    mousedown_cb;
    mouseover_cb;
    mouseout_cb;
    z_level = ChartGraphic.Z_LEVEL_UNSELECTED;

    constructor(data) {
        this.name = data.name;
        this.template_name = data.template_name;
        this.xstart = data.xstart;
        this.xend = data.xend;
        if(this.xstart > this.xend) { [this.xstart, this.xend] = [this.xend, this.xstart]; }
        this.ystart = data.ystart;
        this.yend = data.yend;
        // if(this.ystart > this.yend) { [this.ystart, this.yend] = [this.yend, this.ystart];}
        this.draggable = (data.draggable != undefined) ? data.draggable : true;
        this.that = this;
    }

    clone() { return Object.assign({}, this); }

    data() { JSON.parse(JSON.stringify(this)); }

    update_data() {
    }

    update_option() {
        this.update_data();
        this.chart.setOption({ series: [{
                id: this.name,
                data: this.data,
                z: this.z_level,
            }] },
        );
    }

    get_control_handler({ id, name, xstart, ystart, xend, yend, radius, stroke, lineWidth, fill = 'rgba(0, 0, 0, 0)', z = ChartGraphic.Z_LEVEL_UNSELECTED, invisible = true, draggable = true }) {
        if(name == undefined) { name = id; }
        
        return [{
            type: 'circle',
            id: `${id}${ChartGraphic.CONTROL_START}`,
            name: `${name}${ChartGraphic.CONTROL_START}`,
            z: z,
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
            name: `${name}${ChartGraphic.CONTROL_END}`,
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

    unselect() {
        this.selected = false;
        this.show_controls = false;
        this.z_level = ChartGraphic.Z_LEVEL_UNSELECTED
    }

    select() {
        this.selected = true;
        this.show_controls = true;
        this.z_level = ChartGraphic.Z_LEVEL_SELECTED
    }

    bind_handler_events({ mousedown,
                          mouseover,
                          mouseout,
                        })
    {
        this.mousedown_cb = mousedown.bind(this);
        this.mouseover_cb = mouseover.bind(this);
        this.mouseout_cb = mouseout.bind(this);
        this.chart.on('mousedown', { seriesName: this.name }, this.mousedown_cb);
        this.chart.on('mouseover', { seriesName: this.name }, this.mouseover_cb);
        this.chart.on('mouseout', { seriesName: this.name }, this.mouseout_cb);
    }

    unbind_handler_events()
    {
        // TODO WORKAROUND: POR ALGUN MOTIVO, ECHARTS ELIMINA TODOS LOS HANDLERS DEL EVENTO MOUSEOVER, BUG ECHARTS??
        let filt = Object.assign({}, this.chart._$handlers);
        filt = filt.mouseover.filter(mo => mo.h != this.mouseover_cb);
        this.chart.off('mousedown', this.mousedown_cb);//, this.mousedown_control_management.bind(this));
        this.chart.off('mouseover'), this.mouseover_cb;//, this.mouseover.bind(this));
        this.chart.off('mouseout', this.mouseout_cb);//, this.mouseout.bind(this));
        
        // TODO WORKAROUND: POR ALGUN MOTIVO, ECHARTS ELIMINA TODOS LOS HANDLERS DEL EVENTO MOUSEOVER, BUG ECHARTS??
        this.chart._$handlers.mouseover = filt;
    }
}
