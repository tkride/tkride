
console.log('-------------------------------------------------');
console.log('TEST INICIO');

var binance = new Binance();

binance.ping()
.then(ping => console.log(ping));

binance.getServerTime()
.then(time => console.log(time));

console.time('hist');
binance.getHistoric({id:'BTCUSDT', timeFrame:'15m', startTime: '2020/04/28'})
.then(hist => {
    console.timeEnd('hist');
    console.log(hist);
});


console.log('TEST FIN');
console.log('-------------------------------------------------');
