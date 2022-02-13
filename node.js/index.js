
require('dotenv').config();
const express = require('express');
const conf = require('./serverSettings.json');
const cors = require('cors');
const app = express()
const path = require('path');
const cookieParser = require('cookie-parser');


// // const interface_binance = require('./app/resources/interfaces/brokers/binance');
// const TSQL = require('./app/resources/interfaces/TSQL/TSQL');

// const bInterface = require('./app/resources/interfaces/broker_interface');
// bInterface.init();

// // query = 'LOAD_HISTORIC(BROKER[BINANCE] SYMBOL[BTCUSDT] INTERVAL[1h] STARTTIME[2021-01-16 15:10:00])';
// query = 'GET_TICKERS(BROKER[BINANCE])';
// var request = TSQL.parse(query);

// var d1;
// console.time('query');
// // interface_binance.init();
// bInterface.process(request)
// .then(data => {
//     d1 = data;
//     console.timeEnd('query');
//     d1.forEach( (h, i) => {
//         // console.log("H(", i, ', ', d1[i].length, "): [", d1[i][0], '\n', d1[i][ d1[i].length-1 ], "]");
//     });
// })
// .catch(err => console.error(err));


const app_dir = path.dirname(require.main.filename);

app.use(cors())
app.use(express.json())
app.use(cookieParser());

// Routes the only pages available Login / Chart
app.use(conf.root_path, require('./app/router'))
app.use('/', express.static(conf.www_path));


app.listen(conf.port, () => {
    console.log(conf.init_msg);
})
