/** brokers.js */

class Brokers {

    //----------------------------- STATIC, CONSTANTS -----------------------------


    //----------------------------- PROPERTIES -----------------------------
    brokers = {};

    //----------------------------- CONSTRUCTORS -----------------------------
    constructor(brokers) {
        this.brokers = brokers;
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    get_brokers() {
        return this.brokers;
    }

    get_broker_tickers(broker) {
        return this.brokers[broker];
    }

    filter_tickers(filter) {
        var that = this;
        let tickers = {};
        // if(filter.length) {
            if(this.brokers) {
                $.each(this.brokers, function(broker) {
                    if(that.brokers[broker].length > 0) {
                        tickers[broker] = that.brokers[broker].filter(ticker => ticker.startsWith(filter)).sort();
                        let excess = tickers[broker].length - 100;
                        if(excess > 0) tickers[broker].splice(100, excess);
                    }
                });
            }
        // }
        return tickers;
    }

}