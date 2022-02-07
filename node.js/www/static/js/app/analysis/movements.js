/**file: movements.js */

/** 'MaxRelative' 
 * @data: [ [ timestamp, high, low ] ]
 * 
 * NOT USED --->
 * @data: [ { timestamp, high, low} ]
 * timestamp: EPOCH UNIX (ms)
 * high: float
 * low: float
*/

class MaxRelative {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    #dataType = "max-relative";
    get dataType() { return this.#dataType; }

    //----------------------------- PROPERTIES -----------------------------
    #level = 1;
    #raw_data = [];
    #rel_max = [];

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(data, level = 1) {
        console.time('MaxRelative');
        this.#level = level;
        this.#format_data(data);
        this.#process({ data: this.#raw_data, level: this.#level});
        console.timeEnd('MaxRelative');
    }

    //----------------------------- PRIVATE METHODS -----------------------------
    
    #format_data(data) {
        // if((data.data_y != undefined) && (data.data_x != undefined)) {
        if(data.data_y != undefined) {
            data.data_y.map( (v, i) => {
                // this.#raw_data.push([data.data_x[i], v[Const.IDX_CANDLE_HIGH], v[Const.IDX_CANDLE_LOW]]);
                this.#raw_data.push([v[Const.IDX_CANDLE_TIME], v[Const.IDX_CANDLE_HIGH], v[Const.IDX_CANDLE_LOW]]);
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
        console.time('new');

        //First value
        if(max_data[0][Const.IDX_MAX_MAX] > max_data[1][Const.IDX_MAX_MAX])
        max.push([max_data[0][Const.IDX_MAX_TIMESTAMP], max_data[0][Const.IDX_MAX_MAX], null]);

        // Iterate over all values
        max_data.slice(1,-1).map( (curr, i) => {
            let max_curr = curr[Const.IDX_MAX_MAX];
            let prev_max = (max_data[i][Const.IDX_MAX_MAX] > max_curr) ? false : true;
            let next_max = (max_data[i+2][Const.IDX_MAX_MAX] > max_curr) ? false : true;
            if(prev_max && next_max) {
                max.push([curr[Const.IDX_MAX_TIMESTAMP], max_curr, null]);
            }
        });

        //Last value
        if(max_data[max_data.length-1][Const.IDX_MAX_MAX] > max_data[max_data.length-2][Const.IDX_MAX_MAX])
        max.push([max_data[max_data.length-1][Const.IDX_MAX_TIMESTAMP], max_data[max_data.length-1][Const.IDX_MAX_MAX], null]);
        
        // Extract relative minimum
        let min = [];
        if(data != undefined) {
            min_data = data.filter( v => v[Const.IDX_MAX_MIN] != undefined);
        }

        //First values
        if(min_data[0][Const.IDX_MAX_MIN] < min_data[1][Const.IDX_MAX_MIN])
            min.push([min_data[0][Const.IDX_MAX_TIMESTAMP], min_data[0][Const.IDX_MAX_MIN], null]);

        // Iterate over all values
        min_data.slice(1,-1).map( (curr, i) => {
            let min_curr = curr[Const.IDX_MAX_MIN];
            let prev_min = (min_data[i][Const.IDX_MAX_MIN] < min_curr) ? false : true;
            let next_min = (min_data[i+2][Const.IDX_MAX_MIN] < min_curr) ? false : true;
            if(prev_min && next_min) {
                min.push([curr[Const.IDX_MAX_TIMESTAMP], null, min_curr]);
            }
        });
        //Last value
        if(min_data[min_data.length-1][Const.IDX_MAX_MIN] < min_data[min_data.length-2][Const.IDX_MAX_MIN])
        min.push([min_data[min_data.length-1][Const.IDX_MAX_TIMESTAMP], min_data[min_data.length-1][Const.IDX_MAX_MIN], null]);

        console.timeEnd('new');

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
        this.#rel_max.push(max.concat(min).sort());

        if(level > 1) {
            // if(this.#rel_max[this.#rel_max.length-1].length < 3) {
            if((max.length < 3) || (min.length < 3)) {
                this.#rel_max.push(this.#rel_max);
            }
            else {
                this.#process({max: max, min: min, level: (level - 1)});
            }
        }

        // let movs = new Movements(this.#rel_max);
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
    get data() { return this.#rel_max; }

    /** Return maximum relative data for a given level */
    get_data(level) {
        if(level <= this.#level) {
            if(level <= 0) level = 1;
            return this.#rel_max[level-1];
        }
        return null;
    }

    /** Return maximum relative input raw data */
    get raw_data() { return this.#raw_data; }
}



/** 'timePrice' */

class TimePrice {
    //----------------------------- PROPERTIES -----------------------------

    time;
    price;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(time, price) {
        this.time = time;
        this.price = price;
    }

    //----------------------------- PUBLIC METHODS -----------------------------
    toString() {
        return `${this.time}, ${this.price}`;
    }

    get data() {
        return [this.time, this.price];
    }
}


class Movement {
    id = '';
    level = 0;
    rel_max = [];
    max_filtered = [];
    movs = [];
}

/** 'Movements' */
/**
 * @data: [ { timestamp, inicio, fin, correccion, sentidomov, deltaini, deltafin, retroceso } ]
 * timestamp: EPOCH UNIX (ms)
 * init: timePrice
 * end: timePrice
 * correction: timePrice
 * sense: (int)
 * deltaini: float
 * deltaend: float
 * retracement: float
 * 
 */
class Movements {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------
    
    #dataType = "movements";
    get dataType() { return this.#dataType; }

    //----------------------------- PROPERTIES -----------------------------

    #id = '';
    #level = 0;
    #rel_max = [];
    #max_filtered = [];
    #movs = [];

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(data, level = 1, id) {
        if(data == undefined) {
            let msg = String(Movements.prototype.constructor.name + ': No valid data provided');
            console.error(msg);
            throw(msg);
        }

        this.#id = id;
        this.#level = level;
        let max = new MaxRelative(data, this.level);
        this.#rel_max = max.data;
        console.time('Filter consecutive max');
        this.#max_filtered = this.#filter_consecutive_max(this.#rel_max);
        console.timeEnd('Filter consecutive max');
        console.time('Movements');
        this.#process(this.#max_filtered);
        console.timeEnd('Movements');
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #process(dataLevels) {
        dataLevels.forEach( (data, level) => {
            let level_movs = [];
            data.slice(2).map( (v, i) => {
                let first;
                let sec;
                let sense;
                if(data[i][Const.IDX_MAX_MIN] == null) {
                    first = Const.IDX_MAX_MAX;
                    sec = Const.IDX_MAX_MIN;
                    sense = -1;
                }
                else {
                    first = Const.IDX_MAX_MIN;
                    sec = Const.IDX_MAX_MAX;
                    sense = 1;
                }
                
                let dinit = data[i+1][sec] - data[i][first];
                let dend = v[first] - data[i+1][sec];
                let ret = Math.abs(dend / dinit);

                let mov = {
                    [Const.TIMESTAMP_ID]: data[i][Const.IDX_MAX_TIMESTAMP],
                    [Const.INIT_ID]: new TimePrice(data[i][Const.IDX_MAX_TIMESTAMP], data[i][first]),
                    [Const.END_ID]: new TimePrice(data[i+1][Const.IDX_MAX_TIMESTAMP], data[i+1][sec]),
                    [Const.CORRECTION_ID]: new TimePrice(v[Const.IDX_MAX_TIMESTAMP], v[first]),
                    [Const.TREND_ID]: sense,
                    [Const.DELTA_INIT_ID]: dinit,
                    [Const.DELTA_END_ID]: dend,
                    [Const.RET_ID]: ret,
                }
                level_movs.push(mov);
            });
            this.#movs.push(level_movs);
        });
    }

    #filter_consecutive_max(dataLevels) {
        let filtered = [];

        dataLevels.forEach(data => {
            let max = data.map(v => v.slice(0, 2));
            let min = data.map(v => [v[Const.IDX_MAX_TIMESTAMP], (v[Const.IDX_MAX_MIN] == null) ? Infinity : v[Const.IDX_MAX_MIN] ]);

            let pre_len;
            do {
                // Filters consecutive null values
                max = max.filter( (v, i) => (v[1] != null) || (max[i+1] == undefined) || ( (max[i+1] != undefined) && (max[i+1][1] != null) ));
                
                pre_len = max.length;

                // Build max vector (current, prev, next)
                let max_prev = max.slice(0, -1).map(v => v[1]);
                max_prev.splice(0, 0, null);
                let max_next = max.slice(1).map(v => v[1]);
                max_next.splice(max_next.length, 0, null);
                max = max.map( (v, i) => [ v[0], v[1], max_prev[i], max_next[i]] );

                max = max.filter( v => ( (v[1] == null) || ( (v[1] >= v[2]) && (v[1] > v[3]) ) ) );
            } while(pre_len != max.length);

            do {
                // Filters consecutive Infinity values
                min = min.filter( (v, i) => (v[1] != Infinity) || (min[i+1] == undefined) || ( (min[i+1] != undefined) && (min[i+1][1] != Infinity) ));
                
                pre_len = min.length;

                // Build min vector
                let min_prev = min.slice(0, -1).map(v => v[1]);
                min_prev.splice(0, 0, Infinity);
                let min_next = min.slice(1).map(v => v[1]);
                min_next.splice(min_next.length, 0, Infinity);
                min = min.map( (v, i) => [ v[0], v[1], min_prev[i], min_next[i]] );

                min = min.filter( v => ( (v[1] == Infinity) || ( (v[1] < v[2]) && (v[1] <= v[3]) ) ) );
            } while(pre_len != min.length);

            // Merge max and min results
            max = max.map(v => [ v[0], v[1], null ]).filter(v => v[Const.IDX_MAX_MAX] != null);
            min = min.map(v => [ v[0], null, (v[1] == Infinity) ? null : v[1] ]).filter(v => v[Const.IDX_MAX_MIN] != null);
            filtered.push(max.concat(min).sort());

            // Merge same timestamps
            for(let i = 0; i < filtered[filtered.length-1].length - 1; i++) {
                if( filtered[filtered.length-1][i][Const.IDX_MAX_TIMESTAMP] == filtered[filtered.length-1][i+1][Const.IDX_MAX_TIMESTAMP] ) {
                    let v1;
                    let v2;
                    if(filtered[filtered.length-1][i][Const.IDX_MAX_MAX] != null)
                        v1 = filtered[filtered.length-1][i][Const.IDX_MAX_MAX];
                    else
                        v1 = filtered[filtered.length-1][i+1][Const.IDX_MAX_MAX];

                    if(filtered[filtered.length-1][i][Const.IDX_MAX_MIN] != null)
                        v2 = filtered[filtered.length-1][i][Const.IDX_MAX_MIN];
                    else
                        v2 = filtered[filtered.length-1][i+1][Const.IDX_MAX_MIN];

                    filtered[filtered.length-1][i+1] = [ filtered[filtered.length-1][i][Const.IDX_MAX_TIMESTAMP], v1, v2 ];
                    filtered[filtered.length-1].splice(i, 1)
                }
            }
        });

        return filtered;

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
        // this.#max_filtered = data.filter( (v, i, arr) => {
        //     if(i < (data.length - 1)) {
        //         if( ((v[1] != null) && (arr[i+1][Const.IDX_MAX_MAX] == null))
        //             || ((v[2] != null) && (arr[i+1][Const.IDX_MAX_MIN] == null))
        //             || ((v[1] != null) && (v[2] != null))
        //             || ((arr[i+1][Const.IDX_MAX_MAX] != null) && (arr[i+1][Const.IDX_MAX_MIN] != null)) ) {
        //                 return v;
        //         }
        //     }
        // });

    }

    //----------------------------- PUBLIC METHODS -----------------------------

    //----------------------------- GETTERS & SETTERS -----------------------------
    get id() { return this.#id; }

    get level() { return this.#level };

    get max() { return this.#rel_max; }

    get max_filtered() { return this.#max_filtered; }

    get data() { return this.#movs; }

    get_data(level=1) {
        if(level <= this.#level) {
            if(level <= 0) level = 1;
            return this.#movs[level-1];
        }
        return null;
    }
}