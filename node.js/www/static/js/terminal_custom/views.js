/**file: views.js */


var commands = {
  clear: clear,
  exit: exit_term,
  help: help,
  '.': rpc,
  hist: show_history,
  data: show_stored_data,
  candles: plot_candles,
  tickers: list_broker_tickers,
  max: plot_max,
  movs: plot_movs,
}

function clear(that, args) {
  console.log(clear.name);
  $('#respuesta, .info').empty();
}

function exit_term(that, args) {
  that.close_term();
}

function help(that, args) {
  console.log(help.name);
  $('#respuesta').append("<p>Command list:<br /></p>");
  for (const [key, value] of Object.entries(commands)) {
    $('#respuesta').append("<p>" + key + "</p>");
  }
  return 0;
}

function rpc(that, args) {
  var retData;
  console.log(rpc.name);
  console.log(args)
  args_str = args.join('');
  queryTQS = { query: args_str };
  // Ajax.post(Const.ROOT_URL, that.context.headers, queryTQS,
  that.context.chart_ctrl.send_query(queryTQS,
  // Ajax.post(Const.ROOT_URL, this.headers, queryTQS,
    function(rawData) {
    //  main.commandsTQS.plot_candles(rawData, main.chartFrame.get_active_frame());
      $('#respuesta').append("<p>" + rawData + "</p>");
      console.log(rawData);
      that.last_data  = rawData;
      retData = rawData;
    },
    null, false, 10000);
  console.log('SALIENDO DE RPC');
  console.log(that.last_data);
  return that.last_data;
}

function show_history(that, args) {
  console.log(show_history.name);
  let hist = that.cmd_hist;
  console.log(hist);
  console.log(args.length);
  if (args.length == 0) {
    $('#respuesta').append("<p>Commands history(" + hist.length + "):</p>");
    for(let i=0; i<hist.length; i++) {
      $('#respuesta').append("<p>[" + i + "]: " + hist[i] + "</p>");
    }
  }
  else {
    num_hist = parseInt(args[0]);
    if(num_hist < hist.length) {
      that.process_cmd(that, hist[num_hist]);
    }
    else {
      $('#respuesta').append("<p>Command history current length is " + hist.length + ".</p>");
    }
  }
  return 0;
}

function show_stored_data(that, args) {
  data = that.last_data;
  if('' + data == '[object Object]') {
    data = JSON.stringify(data);
  }
  $('#respuesta').append("<p>" + data + "</p>");
  return 0;
}

function plot_candles(that, args) {
  let ret = that.context.chart_ctrl.plot_candles(that.last_data, that.context.chart_ctrl.active_chart);
  return ret;
}

function list_broker_tickers(that, args) {
  let dataJson;
  if (that.last_data) {
    dataJson = JSON.parse(that.last_data[Const.JSON_ID]);
    if(args) {
      dataJson = dataJson.filter(ticker => ticker.includes(args));
    }
    for(let i=0; i < dataJson.length; i++) {
      $('#respuesta').append("<p>" + dataJson[i] + "</p>");
    }
    $('#respuesta').append("<p> Total: " + dataJson.length + ".</p>");
  }
  return 0;
}

function plot_max(that, args) {
  let query = 'SELECCIONA(ID[M1] NIVEL[2])';
  console.log('plot_max query: ', query);
  let resp = rpc(that, query);
  console.log('plot_max resp: ', resp);
  let ret = that.context.chart_ctrl.plot_max(resp, that.context.chart_ctrl.active_chart);
  // let ret = that.context.chart_ctrl.plot_max(that.last_data, that.context.chart_ctrl.active_chart);
  return ret;
}

function plot_movs(that, args) {
  let ret = that.context.chart_ctrl.plot_movements(that.last_data, that.context.chart_ctrl.active_chart);
  return ret;
}