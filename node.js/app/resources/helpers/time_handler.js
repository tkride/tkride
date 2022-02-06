
// IMPORTS

// CONSTANTS

MIN_SEC = 60;
HOUR_SEC = MIN_SEC * 60;
DAY_SEC = HOUR_SEC * 24;
// INTERVAL_TO_SECONDS = {
//     '1m': MIN_SEC,
//     '3m': (MIN_SEC*3),
//     '5m': (MIN_SEC*5),
//     '15m': (MIN_SEC*15),
//     '30m': (MIN_SEC*30),
//     '1h': HOUR_SEC,
//     '2h': (MIN_SEC*2),
//     '4h': (MIN_SEC*3),
//     '6h': (MIN_SEC*6),
//     '8h': (MIN_SEC*8),
//     '1d': DAY_SEC,
//     '3d': (DAY_SEC*3),
//     '1w': (DAY_SEC*7),
//     '1M': (DAY_SEC*30),
// }
const INTERVAL_TO_SECONDS = {
    'm': MIN_SEC,
    'h': HOUR_SEC,
    'd': DAY_SEC,
    'w': (DAY_SEC*7),
    'M': (DAY_SEC*30),
}

// PROPERTIES

// PRIVATE METHODS

// PUBLIC METHODS

const convert_to_seconds = (time_interval) => {
    let time = parseInt(time_interval.replace(/[a-zA-Z]/g, ''));
    let units = time_interval.replace(/[0-9]/g, '');
    let units_sec = INTERVAL_TO_SECONDS[units];
    if(units_sec) {
        time *= units_sec;
    }
    if(time == null) {
        throw('ERROR Unknown interval.')
    }
    return time;
}

const get_time_queries = (params, query_size) => {
    try {
        let time_queries = [];
        let start_time;
        let end_time;
        let interval_ms = convert_to_seconds(params.interval) * 1000;
        if(params.from) {
            // get start time form range
            let ms_query = convert_to_seconds(params.from) * 1000;
            start_time = Date.now() - ms_query;
            end_time = Date.now();
        }
        else {
            if(!params.starttime) start_time = new Date(new Date().getTime() - (1000*60*60*24*30*4));
            else start_time = Date.parse(params.starttime); //params.starttime;

            if(!params.endtime) end_time = Date.now();
            else end_time = Date.parse(params.endtime); //params.endtime;
        }

        if(start_time < 0) start_time = 0;

        // Get number of queries of given size
        let n_queries = ((end_time - start_time) / interval_ms) / query_size;
        if(n_queries - Math.floor(n_queries) > 0) {
            n_queries = parseInt(n_queries) + 1;
        }

        // Fill queries start and end time
        let current_start = start_time;
        let current_end = start_time;
        let time_added = (interval_ms * query_size);
        
        for(let i = 0; i < n_queries; i++) {
            current_end += time_added;
            if(current_end > end_time) current_end = end_time;
            time_queries.push({ starttime: current_start, endtime: current_end })
            current_start = current_end;
        }
        return time_queries;
    }
    catch(err) {
        console.error(err);
    }
}

// EXPORTS

module.exports = { get_time_queries };