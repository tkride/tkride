
/** chart_resources.js */

class ChartGraphic {
    // CONSTANTS
    static CIRCLE_COLOR = 'rgba(26, 119, 211, 1)';
    static CIRCLE_WIDTH_HOVER = 1;
    static CIRCLE_WIDTH_SELECTED = 2;
    static CIRCLE_RADIUS = 6;
    static CONTROL_START = '_CONTROL_START';
    static CONTROL_END = '_CONTROL_END';

    // PROPERTIES
    name;
    xstart;
    xend;
    xstart_chart;
    xend_chart;
    ystart;
    ystart_chart;
    yend;
    yend_chart;
    draggable = true;
    xdrag;
    ydrag;
    resizable = true;
    chart;
    children = [];
    selected = false;
    controls;
    show_controls = false;
    data = [];

    constructor(data) {
        this.name = data.name;
        this.xstart = data.xstart;
        this.xend = data.xend;
        if(this.xstart > this.xend) { [this.xstart, this.xend] = [this.xend, this.xstart]; }
        this.ystart = data.ystart;
        this.yend = data.yend;
        // if(this.ystart > this.yend) { [this.ystart, this.yend] = [this.yend, this.ystart];}
        this.draggable = (data.draggable != undefined) ? data.draggable : true;
        this.resizable = (data.resizabl != undefined) ? data.resizable : true;
        this.that = this;
    }

    plot(chart) {
        return false;
    }

    remove(chart) {
        return false;
    }

    // get_controls(chart) {
    //     var that = this;
    //     this.chart = chart;

    //     [this.xstart_chart, this.ystart_chart] = chart.convertToPixel({xAxisIndex: 0, yAxisIndex: 0}, [this.xstart, this.ystart]);
    //     [this.xend_chart, this.yend_chart] = chart.convertToPixel({xAxisIndex: 0, yAxisIndex: 0}, [this.xend, this.yend]);
    //     this.controls = {
    //         type: 'group',
    //         id: `${this.name}_CONTROLS`,
    //         // onclick(c) {
    //         //     that.selected = true;
    //         //     console.log(that.name);
    //         //     that.get_controls(chart);
    //         //     that.plot_controls(chart);
    //         // },
    //         children: [
    //             {
    //                 type: 'rect',
    //                 id: `${this.name}_CONTROL_AREA`,
    //                 z: 102,
    //                 invisible: true,
    //                 shape: {
    //                     x: this.xstart_chart,
    //                     y: this.ystart_chart,
    //                     width: this.xend_chart - this.xstart_chart,
    //                     height: this.yend_chart - this.ystart_chart,
    //                 },
    //                 // onclick(c) {
    //                 //     that.selected = true;
    //                 //     console.log(that.name);
    //                 //     that.get_controls(chart);
    //                 //     that.plot_controls(chart);
    //                 // },
    //                 // onmouseover(m) {
    //                 //     console.log(m);
    //                 //     let parent = m.target.parent;
    //                 //     let cs = parent.children().filter(c => c.id.includes('_CONTROL_AREA') == false);
    //                 //     cs.forEach(c => c.invisible = false);
    //                 //     chart.setOption({ graphic: cs});
    //                 // },
    //                 // onmouseout(m) {
    //                 //     console.log(m);
    //                 //     let parent = m.target.parent;
    //                 //     let cs = parent.children().filter(c => c.id.includes('_CONTROL_AREA') == false);
    //                 //     cs.forEach(c => c.invisible = true);
    //                 //     chart.setOption({ graphic: cs});
    //                 // },
    //                 // ondrag(d) {
    //                 //     console.log(d);
    //                 //     that.get_controls(chart);
    //                 //     that.plot_controls(chart);
    //                 // }
    //             },
    //             {
    //             type: 'circle',
    //             id: `${this.name}_CONTROL_START`,
    //             z: 102,
    //             invisible: (this.selected) ? false : true,
    //             draggable: true,
    //             shape: {
    //                 cx: this.xstart_chart,
    //                 cy: this.ystart_chart,
    //                 r: 6, 
    //             },
    //             style: {
    //                 stroke: ChartGraphic.CIRCLE_COLOR,
    //                 lineWidth: (this.selected) ? Fibonacci.CIRCLE_WIDTH_SELECTED : Fibonacci.CIRCLE_WIDTH_HOVER,
    //             },
    //             // ondrag(c) {
    //                 // [that.xstart, that.ystart] = that.chart.convertFromPixel({xAxisIndex:0, yAxisIndex:0}, [that.xstart_chart + this.x, that.ystart_chart + this.y]);
    //                 // that.get_controls(chart);
    //                 // that.plot_controls(chart);
    //                 // for(let i = 0; i < that.length; i++) {
    //                     // that.yvalues[i] = that.chart.convertFromPixel({yAxisIndex:0}, (that.yvalues_chart[i] + this.y));
    //                 // }
    //                 // that.plot(that.chart);
    //                 // let ctrl = that.get_plot(that.chart);
    //                 // that.chart.setOption({graphic: ctrl}, {replaceMerge: ['graphic']});
    //             // }
    //         },
    //         {
    //             type: 'circle',
    //             id: `${this.name}_CONTROL_END`,
    //             z: 102,
    //             invisible: (this.selected) ? false : true,
    //             draggable: true,
    //             shape: {
    //                 cx: this.xend_chart,
    //                 cy: this.yend_chart,
    //                 r: 6, 
    //             },
    //             style: {
    //                 stroke: Fibonacci.CIRCLE_COLOR_SELECTED,
    //                 lineWidth: (this.selected) ? Fibonacci.CIRCLE_WIDTH_SELECTED : Fibonacci.CIRCLE_WIDTH_HOVER,
    //             },
    //             // ondrag(c) {
    //             //     [that.xend, that.yend] = that.chart.convertFromPixel({xAxisIndex:0, yAxisIndex:0}, [that.xend_chart + this.x, that.yend_chart + this.y]);
    //             //     for(let i = 0; i < that.length; i++) {
    //             //         that.yvalues[i] = that.chart.convertFromPixel({yAxisIndex:0}, (that.yvalues_chart[i] + this.y));
    //             //     }
    //             // }
    //         }],
    //     };
    //     return this.controls;
    // }

    plot_controls(chart) {
        this.chart = chart;
        chart.setOption({ graphic: this.controls }); //, { replaceMerge: ['graphic'] });
    }

    unselect() {
        if(this.chart) {
            this.selected = false;
            this.get_controls(this.chart);
            this.plot_controls(this.chart);
        }
    }

    clone() { return Object.assign({}, this); }
    data() { JSON.parse(JSON.stringify(this)); }

    get_control_handler({ id, name, xstart, ystart, xend, yend, radius, stroke, lineWidth, fill = 'rgba(0, 0, 0, 0)', z = 103, invisible = true, draggable = true }) {
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
                lineWidth: lineWidth,
            },
        }];
    } //get_control_handler

    // bind_handler_events({   chart,
    //                         mouseover,
    //                         mouseout,
    //                         mousedown,
    //                     })
    // {
    //     if(chart) { this.chart = chart; }

    //     // this.chart.on('mouseover', { seriesId: this.name }, this.mouse_cb.bind(this, { func:mouseover, show_controls: true }) );
    //     this.chart.on('mousedown', { seriesId: this.name }, mousedown.bind(this));
    //     this.chart.on('mouseover', { seriesId: this.name }, mouseover.bind(this));
    //     this.chart.on('mouseout', { seriesId: this.name }, mouseout.bind(this));
    // } //on_handler_events

    // unbind_handler_events({ mousedown,
    //                         mouseover,
    //                         mouseout,
    //                     })
    // {
    //     this.chart.off('mousedown', mousedown.bind(this));
    //     this.chart.off('mouseover', mouseover.bind(this));
    //     this.chart.off('mouseout', mouseout.bind(this));
    // }
}
