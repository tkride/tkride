
var ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_5m');
// var ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
ws.onmessage = e => {
    console.log(e.data);
}
