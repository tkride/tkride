/**file: ticker_filter.js */

class TickerFilter {

    //----------------------------- STATIC, CONSTANTS -----------------------------

    static ELEMENTS_FILTER_TICKER = '#chart-filter, #chart-filter-input, #chart-filter-stock-icon, #chart-filter-title, #chart-filter-results, .chart-filter-result, .chart-filter-result-ticker, .chart-filter-result-broker';
    static CLASSES_FILTER_TICKER_RESULT = '.chart-filter-result, .chart-filter-result-ticker, .chart-filter-result-broker';
    static FILTER_TICKER_RESULT = '.chart-filter-result';
    static FILTER_TICKER_RESULT_TICKER = '.chart-filter-result-ticker';
    static FILTER_TICKER_RESULT_BROKER = '.chart-filter-result-broker';
    static FILTER_TICKER_TITLE = "Selecciona activo";
    static EVENT_ENABLE = 'ticker-filter-enable-filter';
    static EVENT_DISABLE = 'ticker-filter-disable-filter';
    static EVENT_LOAD_HISTORIC = 'load-historic';
    static FILTER = '#chart-filter';
    static INPUT = '#chart-filter-input';
    
    //----------------------------- PROPERTIES -----------------------------

    #brokers;
    #currFilter;
    newActive;
    currActive;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor() {
        this.init();
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    #update_view() {
        var that = this;
        that.first = {};
        that.entries = [];
        $('#chart-filter-results').empty();
        $.each(this.#brokers.filter_tickers(this.#currFilter), function(broker, tickers) {
            $.each(tickers, function() {
                    if(Object.keys(that.first).length == 0) {
                        that.first = { [Const.BROKER_ID]:broker, [Const.ID_ID]:this } //, [Const.MARCO_ID]: that.currentTimeFrame };
                    }
                    var li_ticker = $("<li />", { class: 'chart-filter-result-ticker', text: this });
                    var li_broker = $("<li />", { class: 'chart-filter-result-broker', text: broker });
                    var div_res = $('<div />', { class: 'chart-filter-result'});
                    div_res.append(li_ticker).append(li_broker);
                    that.entries.push(div_res);
                });
            $('#chart-filter-results').append(that.entries);
            if(Object.keys(that.first).length == 0) { that.newActive = null; }
            else { that.newActive = that.first; }
        });
        
        // $("#chart-filter-stock-icon").css('display', 'inline-block');
        // $("#chart-filter-interval-icon").css('display', 'none');
    }

    #store_info() {
        this.#disable();
        let diff_active = true;
        if(this.currActive && this.newActive) {
            let diff_broker = (this.currActive[Const.BROKER_ID] != this.newActive[Const.BROKER_ID]);
            let diff_ticker = (this.currActive[Const.ID_ID] != this.newActive[Const.ID_ID]);
            diff_active = (diff_broker || diff_ticker);
        }
        if(this.newActive && diff_active) {
            this.currActive = this.newActive;
            $(document).trigger(TickerFilter.EVENT_LOAD_HISTORIC, this.currActive);
        }
    }

    #enable(e) {
        $(TickerFilter.FILTER).show();
        $(TickerFilter.INPUT).focus();
        this.#bind_events(e);
    }

    #disable() {
        $(TickerFilter.INPUT).val('');
        $(TickerFilter.FILTER).hide();
        $(TickerFilter.INPUT).off('keyup');
    }

    //----------------------------- EVENTS -----------------------------
    
    #event_key(e) {
        if((e != null) && (e.keyCode === KeyCode.ENTER)) {
            this.#store_info();
            $(TickerFilter.INPUT).val('');
        }
        // else if (e.keyCode === KeyCode.ESC) {
        //     this.#disable();
        // }
        else {
            this.#currFilter = $(TickerFilter.INPUT).val().toUpperCase();
            this.#currFilter = this.#currFilter.replace(/[^0-9A-Z]/gi, '');
            $(TickerFilter.INPUT).val(this.#currFilter);
        }
        this.#update_view();
    }

    #bind_events(e) {
        var that = this;
        $(TickerFilter.INPUT).keyup(function(e) {
            that.#event_key(e);
            if(e) e.preventDefault();
        });

        //Copies first char detected in main, lost otherwise
        if(e) $(TickerFilter.INPUT).val(e.key);
        this.#event_key(e);
    }

    #click_ticker(e) {
        let res = $(e.currentTarget);
        if(res.is(TickerFilter.FILTER_TICKER_RESULT) == false) {
            res = res.closest(TickerFilter.FILTER_TICKER_RESULT);
        }
        let ticker = res.find(TickerFilter.FILTER_TICKER_RESULT_TICKER).text();
        let broker = res.find(TickerFilter.FILTER_TICKER_RESULT_BROKER).text();
        this.newActive = { [Const.BROKER_ID]:broker, [Const.ID_ID]:ticker };
        console.log(res);
        console.log(ticker);
        console.log(broker);
        console.log(this.newActive);
        this.#store_info();
    }

    //----------------------------- GETTERS & SETTERS -----------------------------

    set brokers(brokers) {
        this.#brokers = brokers;
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        var that = this;
        try {
            $(document).on(TickerFilter.EVENT_ENABLE, (e, key) => that.#enable(key));
            $(document).on(Const.EVENT_CLOSE, e => that.#disable());
            $(TickerFilter.FILTER).on(Const.EVENT_CLOSE, e => that.#disable());
            
            // Click over Ticker
            $(TickerFilter.FILTER).on('click', TickerFilter.CLASSES_FILTER_TICKER_RESULT, e => {
                that.#click_ticker(e);
                e.stopPropagation();
            });
            this.#disable();
            console.log('Ticker Filter Initialized OK.');
        }
        catch(error) {
            console.error("Event Controller NOT Initialized: ", error);
        }
    }

    // TODO ?BORRAR?
    is_visible() { return ($(TickerFilter.FILTER).is(":visible")); }

    is_focused() { return $(TickerFilter.INPUT).is(":focus"); }
}