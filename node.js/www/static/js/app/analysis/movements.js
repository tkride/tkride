/**file: movements.js */

/** 'MaxRelative' */

class MaxRelative {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "max-relative";

    //----------------------------- PROPERTIES -----------------------------
    #level = 1;
    #raw_data = [];
    #rel_max = [];

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(data, level = 1) {
        this.#level = level;
        this.#format_data(data);
        this.#process({ data: this.#raw_data, level: this.#level});
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    #format_data(data) {
        if((data.data_y != undefined) && (data.data_x != undefined)) {
            data.data_y.map( (v, i) => {
                this.#raw_data.push([data.data_x[i], v[Const.IDX_CANDLE_HIGH], v[Const.IDX_CANDLE_LOW]]);
            });
        }
        else {
            let msg = String(MaxRelative.prototype.constructor.name + ': no valid data provided.');
            console.error(msg);
            throw(msg);
        }
    }

    #process(params) {
        let data = params.data;
        let level = params.level;
        let max_data = params.max;
        let min_data = params.min;

        if((data == undefined) && (max_data == undefined) && (min_data == undefined)) {
            let msg = String(MaxRelative.prototype.constructor.name + ': process ERROR: no valid data provided.');
            console.error(msg);
            throw(msg);
        }

        // Extract relative maximum
        let max = [];
        if(data != undefined) {
            max_data = data.filter( v => v[Const.IDX_MAX_MAX] != undefined);
        }
        max_data.map( (curr, i, arr) => {
            let max_curr = curr[Const.IDX_MAX_MAX];
            if(max_curr != undefined) {
                let prev_max = ((arr[i-1] != undefined) && (arr[i-1][Const.IDX_MAX_MAX] > max_curr)) ? false : true;
                let next_max = ((arr[i+1] != undefined) && (arr[i+1][Const.IDX_MAX_MAX] > max_curr)) ? false : true;
                if(prev_max && next_max) {
                    max.push([curr[Const.IDX_MAX_TIMESTAMP], max_curr, null]);
                }
            }
        });

        let min = [];
        if(data != undefined) {
            min_data = data.filter( v => v[Const.IDX_MAX_MIN] != undefined);
        }
        min_data.map( (curr, i, arr) => {
            let min_curr = curr[Const.IDX_MAX_MIN];
            if(min_curr != undefined) {
                let prev_min = ((arr[i-1] != undefined) && (arr[i-1][Const.IDX_MAX_MIN] < min_curr)) ? false : true;
                let next_min = ((arr[i+1] != undefined) && (arr[i+1][Const.IDX_MAX_MIN] < min_curr)) ? false : true;
                if(prev_min && next_min) {
                    min.push([curr[Const.IDX_MAX_TIMESTAMP], null, min_curr]);
                }
            }
        });

        // // Merges max and min information by timestamp (need ordered vectors)
        // let max_min = JSON.parse(JSON.stringify(max.sort()));
        // min = min.sort();
        // for(let i = 0; i < max.length; i++) {
        //     for(let j = 0; j < min.length; j++) {
        //         // console.log(max[i][Const.IDX_MAX_TIMESTAMP], min[j][Const.IDX_MAX_TIMESTAMP]);
        //         if(max[i][Const.IDX_MAX_TIMESTAMP] == min[j][Const.IDX_MAX_TIMESTAMP]) {
        //             max_min[i][Const.IDX_MAX_MIN] = min[j][Const.IDX_MAX_MIN];
        //         }
        //         else if(min[j][Const.IDX_MAX_TIMESTAMP] > max_min[i][Const.IDX_MAX_TIMESTAMP]) {
        //             break;
        //         }
        //     }
        // }

        // Stores sorted and merged data
        // this.#rel_max.push(max_min.sort());
        this.#rel_max.push(max.concat(min).sort());

        if(level > 1) {
            if(this.#rel_max[this.#rel_max.length-1].length < 3) {
                this.#rel_max.push(this.#rel_max);
            }
            else {
                // this.#process(this.#rel_max[this.#rel_max.length-1], (level - 1));
                this.#process({max: max, min: min, level: (level - 1)});
            }
        }

        let movs = new Movements(this.#rel_max[0]);
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    //----------------------------- GETTERS & SETTERS -----------------------------

    /** Return maximum relative maximum available level */
    get levels() { return this.#rel_max.length; }

    /** Return maximum relative length for level = 1 */
    get length() {
        if(this.#rel_max.length > 0) {
            return this.#rel_max[0].length;
        }
        return 0;
    }

    /** Return maximum relative length for a given level */
    get_length(level = 1) {
        if(level <= this.#level) {
            if(level == 0) level = 1;
            return this.#rel_max[level-1].length;
        }
        return null;
    }

    /** Return maximum relative data for level = 1 */
    get data() { return this.#rel_max[0]; }

    /** Return maximum relative data for a given level */
    get_data(level) {
        if(level <= this.#level) {
            if(level == 0) level = 1;
            return this.#rel_max[level-1];
        }
        return null;
    }

    /** Return maximum relative input raw data */
    get raw_data() { return this.#raw_data; }
}


/** 'Movements' */

class Movements {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    static NAME = "movements";

    //----------------------------- PROPERTIES -----------------------------

    #max_filtered = [];

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(data) {
        if(data == undefined) {
            let msg = String(Movements.prototype.constructor.name + ': No valid data provided');
            console.error(msg);
            throw(msg);
        }
        let filtered = this.#consecutive_max_filter(data);
        this.#process(filtered);
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #process(data) {

    }

    #consecutive_max_filter(data) {
        // // Get all instants with max and min in one candle
        // let data_filtered = JSON.parse(JSON.stringify(data));
        // let hl = [];
        // let idx_del = [];
        // data_filtered.forEach((r, i) => {
        //     if((r[Const.IDX_MAX_MAX] != null) && (r[Const.IDX_MAX_MIN] != null)) {
        //         hl.push(r);
        //         idx_del.push(r[0]);
        //     }
        // });
        
        // // Delete all candles with max and min
        // idx_del.forEach(t => {
        //     let idx = data_filtered.indexOf(t);
        //     data_filtered.splice(idx, 1);
        // });

        // // // Duplicate each element with min set to null and viceversa
        // let hlmax = [];
        // let hlmin = [];
        // hl.forEach( (r, i) => {
        //     let rmax = JSON.parse(JSON.stringify(r));
        //     rmax[Const.IDX_MAX_MIN] = null;
        //     let rmin = JSON.parse(JSON.stringify(r));
        //     rmin[Const.IDX_MAX_MAX] = null;
        //     hlmax.splice(i, 1, rmax);
        //     hlmax.splice(i, 0, rmin);
        // });

        // Delete from source data those elements

        // Copy to filtered data high and low (hl) elements

        // ELIMINAR DUPLICADOS
        // LA FUNCIÓN NO SELECCIONA EL MÁXIMO O MÍNIMO, SOLO SI ESTÁ DUPLICADO!!!!! !!!!
        this.#max_filtered = data.filter( (v, i, arr) => {
            if(i < (data.length - 1)) {
                if( ((v[1] != null) && (arr[i+1][1] == null))
                    || ((v[2] != null) && (arr[i+1][2] == null))
                    || ((v[1] != null) && (v[2] != null))
                    || ((arr[i+1][1] != null) && (arr[i+1][2] != null)) ) {
                        return v;
                }
            }
        });

    }

    //----------------------------- PUBLIC METHODS -----------------------------

    //----------------------------- GETTERS & SETTERS -----------------------------
}