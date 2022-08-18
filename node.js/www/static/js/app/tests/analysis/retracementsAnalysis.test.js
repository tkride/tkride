

QUnit.test( 'parseRequest', (assert) => {
    let requestIn = JSON.parse('{"ID":"CC","TIPO_PARAM":"RETROCESOS","searchin":"CC_1","level":"0","from":"end","iterate":"20","levels":"0.09, 0.18, >0.27","onlymax":"0","filtermode":"2","levelsDataSourceName":"CC_1","modelKey":"BTCUSDTbinance4h1_1656095425325","model":{"ohlc":{},"movs":{},"patternResults":{},"rets":{},"trend":{},"next":{}},"patterns":{"CC":{"ID":"CC","TIPO_PARAM":"RETROCESOS","searchin":"CC_1","level":"0","from":"end","iterate":"20","levels":"0.09, 0.18","onlymax":"0","filtermode":"2","levelsDataSourceName":"CC_1","user":"ruben"},"CC_1":{"ID":"CC_1","TIPO_PARAM":"RETROCESOS","searchin":"PHY","level":"0","from":"end","iterate":"20","levels":"0.395, 0.55, 0.6","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben","modelKey":"BTCUSDTbinance4h1_1656095425325"},"CC_TARGETS":{"ID":"CC_TARGETS","TIPO_PARAM":"RETROCESOS","searchin":"CC","level":"0","from":"end","iterate":"20","levels":">0.61","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben"},"PHY":{"ID":"PHY","TIPO_PARAM":"RETROCESOS","searchin":"","level":"0","from":"init","iterate":"20","levels":"1.272, 1.618, 1.88","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben"},"TARGETS":{"ID":"TARGETS","TIPO_PARAM":"RETROCESOS","searchin":"PHY","level":"0","from":"end","iterate":"20","levels":"0.38,0.618,0.786,1.272,>1.618","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben"},"ZR":{"ID":"ZR","TIPO_PARAM":"RETROCESOS","searchin":"PHY","level":"0","from":"end","iterate":"20","levels":"0.618, 0.686, 0.713, 0.786","onlymax":"0","filtermode":"1","levelsDataSourceName":"","user":"ruben"}}}')
    
    let from = Const.END_ID;
    let until = Const.CORRECTION_ID;
    let fromSearch = Const.INIT_ID;
    let untilSearch = Const.END_ID;
    let iterate = 20;
    let filterType = '0';
    let filterMode = '2';
    let level = 0;
    let levels = '0.09, 0.18, 0.27'.split(',').map(l => l.trim());
    let logical = '>';
    let query = '';

    let ret = new RetracementsAnalysis();
    let request = ret.parseRequest(requestIn);

    assert.equal(request != undefined, true, 'Creado "request"');
    assert.equal(request.level === level, true, `Nivel de movimiento parseado correctamente: ${request.level}`);
    assert.equal(request.iterate === iterate, true, `Itera en resultados parseado correctamente: ${request.iterate}`);
    levels.forEach( (l,i) => {
        assert.equal(request.levels[i] == l, true, `Nivel ${i} incluido: ${l}`);
    });
    assert.equal(request.logical === logical, true, `Logica de niveles parseada correctamente: ${request.logicals}`);
    assert.equal(request.onlymax === filterType, true, `Tipo de filtro parseado correctamente: ${request.onlymax}`);
    assert.equal(request.filtermode === filterMode, true, `Modo del filtro parseado correctamente: ${request.filtermode}`);
    assert.equal(request.from === from, true, `Inicio de analisis "desde": ${request.from}.`);
    assert.equal(request.until === until, true, `Inicio de analisis "hasta": ${request.until}.`);
    assert.equal(request.fromSearch === fromSearch, true, `Inicio de "buscar en" "desde": ${request.fromSearch}.`);
    assert.equal(request.untilSearch === untilSearch, true, `Inicio de "buscar en" "hasta": ${request.untilSearch}.`);
    assert.equal(request.query === query, false, `Query incluído en el objeto "request" correctamente: ${request.query}.`);
});


// STATIC METHODS TESTS

Qunit.test( 'calcProjectedRetracementLevels', (assert) => {
    let baseTime = new Date('16 Aug 2022 10:00:00').getTime();
    let tinit = baseTime / 1000;
    let tend = tinit + (3600 * 4);
    let tcorrection = tend + (3600 * 3);
    let levelMovement = {
        timestamp: tinit,
        init: new TimePrice(tinit, 100),
        end: new TimePrice(tend, 200),
        correction: new TimePrice(tcorrection, 50),
    }
    baseTime = tinit + (3600*7);
    tinit = baseTime;
    tend = tinit + (3600*2);
    tcorrection = tend + (3600*5);
    let movement = {
        timestamp: baseTime,
        init: new TimePrice(tinit, 50),
        end: new TimePrice(tend, 25),
        correction: new TimePrice(tcorrection, 100),
    }
    let levels = [0.5, 0.618, 1];
    let levelsTrend = -1;
    let [limitMax, limitMin] = RetracementsAnalysis.calcProjectedRetracementLevels({
        levelMovement,
        movement,
        levels,
        levelsTrend,
    });

    assert.equal(limitMax, 200, `Nivel proyectado máximo ${limitMax} sobre 200 correcto.`);
});
