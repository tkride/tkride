

function createModel() {
    let modelData = JSON.parse(modelStr);
    let model = Object.assign(new DataModel(), modelData);
    console.log(model.movs);
    return model;
}

function loadRequest() {
    let request = JSON.parse(requestStr);
    return request;
}

function loadPatterns() {
    let patterns = JSON.parse(patternsStr);
    return patterns;
}

QUnit.test( 'parseRequest Analysis_', (assert) => {
    let requestIn = JSON.parse('{"ID":"CC","TIPO_PARAM":"RETROCESOS","searchin":"CC_1","level":"0","from":"end","iterate":"20","levels":"0.09, 0.18","onlymax":"0","filtermode":"2","levelsDataSourceName":"CC_1","modelKey":"BTCUSDTbinance4h1_1656095425325","model":{"ohlc":{},"movs":{},"patternResults":{},"rets":{},"trend":{},"next":{}},"patterns":{"CC":{"ID":"CC","TIPO_PARAM":"RETROCESOS","searchin":"CC_1","level":"0","from":"end","iterate":"20","levels":"0.09, 0.18","onlymax":"0","filtermode":"2","levelsDataSourceName":"CC_1","user":"ruben"},"CC_1":{"ID":"CC_1","TIPO_PARAM":"RETROCESOS","searchin":"PHY","level":"0","from":"end","iterate":"20","levels":"0.395, 0.55, 0.6","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben","modelKey":"BTCUSDTbinance4h1_1656095425325"},"CC_TARGETS":{"ID":"CC_TARGETS","TIPO_PARAM":"RETROCESOS","searchin":"CC","level":"0","from":"end","iterate":"20","levels":">0.61","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben"},"PHY":{"ID":"PHY","TIPO_PARAM":"RETROCESOS","searchin":"","level":"0","from":"init","iterate":"20","levels":"1.272, 1.618, 1.88","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben"},"TARGETS":{"ID":"TARGETS","TIPO_PARAM":"RETROCESOS","searchin":"PHY","level":"0","from":"end","iterate":"20","levels":"0.38,0.618,0.786,1.272,>1.618","onlymax":"1","filtermode":"2","levelsDataSourceName":"","user":"ruben"},"ZR":{"ID":"ZR","TIPO_PARAM":"RETROCESOS","searchin":"PHY","level":"0","from":"end","iterate":"20","levels":"0.618, 0.686, 0.713, 0.786","onlymax":"0","filtermode":"1","levelsDataSourceName":"","user":"ruben"}}}')
    let level = 0;
    let analysis = new Analysis_();
    let request = analysis.parseRequest(requestIn);
    assert.equal(request != undefined, true, 'Creado "request"');
    assert.equal(request.level === level, true, `Nivel de movimiento ${level} parseado correctamente.`);
});


// STATIC METHODS TEST


QUnit.test( 'appendHash', (assert) => {
    let m = { hash: Date.now().toString() };
    assert.strictEqual(m.hash && m.hash.includes('-'), false, `No existe hash en la familia: ${m.hash}`);
    Analysis_.appendHash(m);
    assert.strictEqual(m.hash.includes('-0'), true, `Agregado hash familia: ${m.hash}`);
});

QUnit.test( 'incrementHash', (assert) => {
    let m = { hash: Date.now().toString() };
    Analysis_.appendHash(m);
    assert.strictEqual(m.hash && m.hash.includes('-0'), true, `Primer HASH inicializado: ${m.hash}`);
    let inc = 0;
    Analysis_.increment_hash(m);
    inc++;
    Analysis_.increment_hash(m);
    inc++;
    Analysis_.increment_hash(m);
    inc++;
    let check = m.hash.includes('-' + inc);
    assert.strictEqual(check,  true, `Incrementado HASH ${inc} veces: ${m.hash}`);
});

QUnit.test( 'getFamilyRequestTree', (assert) => {
    let model = createModel();
    let request = loadRequest();
    let patterns = loadPatterns();
    let analysis = new Analysis_();
    let fTree = Analysis_.getFamilyRequestTree({request, results: model, patterns: patterns});
    console.log(fTree);
    let phyRes = fTree.filter( r => r.ID == 'PHY');
    let phyPos = fTree.findIndex(r => r.ID == 'PHY');
    let targetsRes = fTree.filter( r=> r.ID == 'TARGETS');
    let targetsPos = fTree.findIndex(r => r.ID == 'TARGETS');
    assert.equal(phyRes != undefined, true, `Encontrado patrón PHY en árbol en posición ${phyPos}`);
    assert.equal(targetsRes != undefined, true, `Encontrado patrón TARGETS en árbol en posición ${targetsPos}`);
    assert.equal(phyPos < targetsPos, true, `Orden del árbol correcto.`);
});
