/**file: constants.js */

class Const {
    // static ROOT_URL = "http://tapsproject.net:8080/";
    static ROOT_URL = "http://tkride.com:8081/";
    static POST_ID = 'POST';

    // GENERALES
    static EMPTY_STR = '';
    static NEW_LINE_STR = "\n"; //os.linesep;

    static IMPULSO = 1;
    static RETROCESO = -1;
    static ALCISTA = 1;
    static BAJISTA = -1;
    static DESCONOCIDA = 0;
    static MINIMO = -1;
    static MAXIMO = 1;
    static CORRECCION = 2;
    static AMBOS = 3;
    static MOVIMIENTO = 1;
    static MAYOR_QUE = 1;
    static MENOR_QUE = -1;
    static OPERADORES_LOGICOS = ['<', '>'];

    static CMD_CLAUSE_OPEN = '(';
    static CMD_CLAUSE_CLOSE = ')';
    static PARAM_CLAUSE_OPEN = '[';
    static PARAM_CLAUSE_CLOSE = ']';
    static CMD_CLAUSES = [Const.CMD_CLAUSE_OPEN, Const.CMD_CLAUSE_CLOSE];
    static PARAM_CLAUSES = [Const.PARAM_CLAUSE_OPEN, Const.PARAM_CLAUSE_CLOSE];
    static PARAM_SEPARATOR = ',';


    // PARAMETROS
    static ID_ANALISIS_ID = 'ID_ANALISIS';

    static TIPO_PARAM_ID = 'TIPO_PARAM';

    // ACTIVO = VALORES
    static BROKER_ID = 'BROKER';
    // static TICKER_ID = 'TICKER'
    static ID_ID = 'ID';
    static JSON_ID = 'JSON';

    static ALCISTA_ID = 'ALCISTA';
    static BAJISTA_ID = 'BAJISTA';

    // MARCO_TEMPORAL_ID = 'MARCO_TEMPORAL'
    static MARCO_TEMPORAL_ID = 'MARCO';
    static INTERVALO_ID = 'INTERVALO';
    static DESDE_ID = 'DESDE';
    static SOLO_MAX_ID = 'SOLO_MAX';
    static STOP_DATOS_ID = 'STOP_DATOS';
    static STOP_MIN_ID = 'STOP_MIN';
    static STOP_MAX_ID = 'STOP_MAX';

    // TENDENCIA = VALORES

    // RETROCESO = VALORES
    static BUSCAR_EN_ID = 'BUSCAR_EN';
    static SENTIDO_ID = 'SENTIDO';
    static RETROCESO_MIN_ID = 'RETROCESO_MIN';
    static RETROCESO_MAX_ID = 'RETROCESO_MAX';
    static ITERA_EN_N_ID = 'ITERA_EN_N';
    static CURRENT_ID = 'CURRENT';

    // MAXIMOS = VALORES
    static NIVEL_ID = 'NIVEL';
    static UMBRAL_ID = 'UMBRAL';

    // MOVIMIENTOS = VALORES
    static UMBRAL_DELTA_ID = 'UMBRAL_DELTA';
    // RETROCESO_MIN_ID = 'RETROCESO_MIN';
    // RETROCESO_MAX_ID = 'RETROCESO_MAX';

    // RETROCESOS = VALORES
    // DESDE_ID = 'DESDE';
    static HASTA_ID = 'HASTA';
    static INICIO_ID = 'INICIO';
    static FIN_ID = 'FIN';
    static CORRECCION_DESDE_ID = 'CORRECCION';
    static RESULTADO_ID = 'RESULTADO';
    static HASTA_ID = 'HASTA';

    static ESTADISTICAS_ID = 'ESTADISTICAS';
    static SALIDA_ID = 'SALIDA';
    static FICHERO_ID = 'FICHERO';
    static FORMATO_ID = 'FORMATO';
    static FORMATO_CSV_ID = 'CSV';
    // static SEPARADOR_CAMPOS = f"    static     static     static     static     static  ";
    // static SEPARADOR_CAMPOS = f"    static     static   ";
    // static CSV_SEPARADOR_CAMPOS = f",";

    static INSTANTE_VALOR_PAR = 'INSTANTE_VALOR_PAR';
    static INSTANTE_VALOR_DATAFRAME = 'INSTANTE_VALOR_DATAFRAME';
    static INSTANTE = 'INSTANTE';
    static VALOR = 'VALOR';
    static PRECIOS_ID = 'PRECIOS';

    // ETIQUETAS DATOS
    static HISTORICO_ID = 'HISTORICO';
    static ANALISIS_ID = 'ANALISIS';
    static ACTIVO_ID = 'ACTIVO';
    static ACTIVOS_BROKER_ID = 'ACTIVOS_BROKER';
    static MAX_MIN_ID = 'MAXIMOS';
    static MAXIMOS_ID = 'MAXIMOS';
    static SENTIDO_MAX_MIN_ID = 'MAX_MIN';
    static SENTIDO_MIN_MAX_ID = 'MIN_MAX';
    static SENTIDO_AMBOS_ID = 'AMBOS';
    static MOVIMIENTOS_ID = 'MOVIMIENTOS';
    static RETROCESOS_ID = 'RETROCESOS';
    static SIGUIENTE_ID = 'SIGUIENTE';

    //static TIMESTAMP_ID = 'timestamp'; // Minúsculas; es una etiqueta utilizada por los datos descargados; y habría que convertilo contínuamente
    // LISTA DICCIONARIO
    // NIVEL_ID = 'nivel'
    static FECHA_INICIO_ID = 'FECHA_INICIO';
    static FECHA_FIN_ID = 'FECHA_FIN';
    static TENDENCIA_ID = 'TENDENCIA';
    // MARCO_TEMPORAL_ID = 'marco_temporal';
    static PUNTO_ORIGEN_ID = 'PUNTO_ORIGEN';
    static PUNTO_FINAL_ID = 'PUNTO_FINAL';
    static PENDIENTE_ID = 'pendiente'; // DESUSO
    static ANGULO_ID = 'angulo';
    static SENTIDO_MOV_ID = 'sentidomov';
    static INICIO_MOV_ID = 'inicio';
    static CORRECCION_ID = 'correccion';
    static FIN_MOV_ID = 'fin';
    static FIN_MOV_2_ID = 'fin2';
    static DELTA_ID = 'delta';
    static DELTA_INC_ID = 'deltainc';
    static DELTA_DEC_ID = 'deltadec';
    static DELTA_INI_ID = 'deltaini';
    static DELTA_FIN_ID = 'deltafin';
    static DELTA_SUMA_ID = 'deltasum';
    static DELTA_INI_2_ID = 'deltaini2';
    static DELTA_FIN_2_ID = 'deltafin2';
    static RETROCESO_ID = 'retroceso';
    static RETROCESO_2_ID = 'retroceso2';
    static MOVIMIENTO_ID = 'movimiento';
    static INC_PRECIO_ID = 'inc_precio'; // OBSOLETO
    static INC_TEMPORAL_ID = 'inc_temporal'; // OBSOLETO
    static INC_TEMPORAL_INFO_ID = 'inc_temporal_info'; // OBSOLETO
    // SUB_TENDENCIAS_ID = 'SUB_TENDENCIAS' // OBSOLETO

    static DUMP_RUTA = 'stored_data\\DUMP';
    static DATOS_ID = 'DATOS';
    static META_ID = 'META';
    static PETICION_ID = 'PETICION';
    static TIPO_DATO_ID = 'TIPO_DATO';
    static TOKEN_DESCONOCIDO_ID = 'DESCONOCIDO';
    static COMANDO_ID = 'COMANDO';
    static PARAMETRO_ID = 'PARAMETRO';
    static VALOR_ID = 'VALOR';
    static VALORES_ID = 'VALORES';
    static OPERADOR_ID = 'OPERADOR';
    static TIPO_PARAM_ID = 'TIPO_PARAM';
    static SELECCIONA_ID = 'SELECCIONA';
    static LEE_HISTORICO_ID = 'LEE_HISTORICO';
    static LEE_ACTIVOS_BROKER_ID = 'LEE_ACTIVOS_BROKER';
    static BUSCA_ID = 'BUSCA';
    static ENTONCES_ID = 'ENTONCES';
    static Y_ID = 'Y';
    static O_ID = 'O';
    static NEGADO_ID = 'NEGADO';

    // PATTERNS ELEMENTS DEFINITIONS
    static BUSCAR_EN_COMBO_ID = 'BUSCAR_EN_COMBO';

    // VIEW
    static BUTTON_CLICKED = 'button-general-clicked';
    static LOADING_ICON_ELEMENT = 'div[class="loader"]';
    static LOADING_ICON = '<div class="loader"></div>';

    // GENERAL EVENTS
    static EVENT_CHART_CTRL_CREATED = 'chart-ctrl-created';
    static EVENT_TERMINAL_CREATED = 'terminal-created';
    static EVENT_CLOSE = 'event-close';
    static EVENT_CANCELED = 'event-cancelled';

    // CLASS CONTROLS
    static CLASS_DISABLED = 'disabled';
    static CLASS_HOVERABLE_CLOSE = 'hoverable-close';
    static CLASS_HOVERABLE_ICON = 'hoverable-icon';
    static CLASS_HOVERABLE_ICON_SELECTED = 'selected';
    static CLASS_BUTTON_GENERAL = 'button-general';
    static CLASS_BUTTON_SLIM = 'button-general slim';
    static CLASS_HOVERABLE_TEXT = 'hoverable-text';
    static CLASS_HOVERABLE_TEXT_SELECTED = 'hoverable-text-selected';
    static CLASS_TEXT_INPUT = 'text-input';
    static CLASS_MENU_FIELD = 'menu-field';
    static CLASS_MENU_INPUT_SHORT = 'input-short';
    static CLASS_MENU_OPTIONS_RADIO = 'menu-options-radio';
    static CLASS_DROPDOWN_ARROW = 'dropdown-arrow';
    static CLASS_SCROLL_CUSTOM = 'scroll-custom';
    static CLASS_SCROLL_NONE = 'scroll-none';
    // CLASS ICONS
    static CLASS_ICON_ARROW_DOWN = 'lni lni-chevron-down';
    static CLASS_ICON_ADD = 'lni lni-circle-plus';
    static CLASS_ICON_DELETE = 'lni lni-cross-circle';
    static CLASS_ICON_SAVE = 'lni lni-save';
    static CLASS_ICON_CLEAR = 'lni lni-eraser';
    static CLASS_ICON_SETTINGS = 'lni lni-cog';
    static CLASS_ICON_MENU = 'lni lni-menu';
    static CLASS_ICON_HAND = 'lni lni-hand';
    static CLASS_ICON_FILTER = 'lni lni-funnel';
    static CLASS_ICON_EYE = 'lni lni-eye';
    static CLASS_ICON_REMOVE = 'lni lni-trash-can';
    static CLASS_ICON_LIST = 'lni lni-list';
    static CLASS_ICON_FIBO = 'lni lni-list';
    static CLASS_ICON_TELEGRAM = 'lni lni-telegram-original';
    static CLASS_ICON_WHATSAPP = 'lni lni-whatsapp';
    static CLASS_ICON_EMAIL = 'lni lni-envelope';
    static CLASS_ICON_ALARM = 'lni lni-alarm';
    // static CLASS_ICON_LOCK = 'lni lni-lock';
    // static CLASS_ICON_UNLOCK = 'lni lni-unlock';
    static CLASS_ICON_LOCK = 'bi bi-lock';
    static CLASS_ICON_UNLOCK = 'bi bi-unlock';
    static CLASS_ICON_RECTANGLE = 'bi bi-bounding-box-circles';
    static CLASS_ICON_MAGNET = 'bi bi-magnet';
    static CLASS_ICON_CAMERA = 'bi bi-camera';

    static ELEMENT_ID_PERSIST_MODE = '#persist-mode';

    static CLASS_BACK_POINTS = 'points';

    // LABEL POSITION
    static LABEL_POSITION_INSIDE = 'inside';
    static LABEL_POSITION_BEFORE = 'before';
    static LABEL_POSITION_AFTER = 'after';

    // ----------------------------------------------------------- NODE ----------------------------------------------------------------------
    // TREND LABELS
    static BULL = 1;
    static BEAR = -1;
    static BOTH = [-1, 1];
    static BULL_ID = 'bull';
    static BEAR_ID = 'bear';
    static BOTH_ID = 'both';
    static TREND_STR = {
        [-1]: Const.BEAR_ID,
        1: Const.BULL_ID,
        [[-1,1]]: Const.BOTH_ID
    }
    static TREND_VAL = {
        [Const.BULL_ID] : [Const.BULL],
        [Const.BEAR_ID] : [Const.BEAR],
        [Const.BOTH_ID] : Const.BOTH,
    }

    static ACTIVE_ID = 'active';
    // static TIME_FRAME_ID = 'timeFrame';
    static TIME_FRAME_ID = 'timeFrame';
    static START_TIME_ID = 'startTime';
    static END_TIME_ID = 'endTime';

    // STATISTICS
    static STATS_ID = 'stats';
    static OK_ID = 'ok';
    static NOK_ID = 'nok';
    static NOK_PARENT_ID = 'nok_parent';
    static TOTAL_ID = 'total';
    static NUM_ID = 'num';
    static PERCENT_ID = '%';

    // CANDLES PRICE INFORMATION
    static OPEN_ID = 'open';
    static HIGH_ID = 'high';
    static LOW_ID = 'low';
    static CLOSE_ID = 'close';
    static SYMBOL_ID = 'symbol';
    static VOLUME_ID = 'volume';
    static TRADES_ID = 'trades';

    // GENERIC DEFINITIONS
    static MODEL_KEY_ID = 'model_key';
    static MODEL_ID = 'model';
    static QUERY_ID = 'query';
    static DATA_ID = 'data';
    static DATA_PARENT_ID = 'data_parent';
    static DATA_TYPE_ID = 'datatype';
    static FROM_ID = 'from';
    static FROM_STOP_ID = 'from_stop';
    static UNTIL_ID = 'until';
    static LOGICAL_LOWER_THAN = '<';
    static LOGICAL_HIGHER_THAN = '>';
    static LOGICAL_OPERATORS = ['<', '>'];
    static RET_LOGICAL_VALUES = { '<':Number.MIN_SAFE_INTEGER, '>': Number.MAX_SAFE_INTEGER };
    static RESULTS_ID = 'results';
    static NAME_ID = 'name';

    static MOVS_ID = 'movs';
    static RETRACEMENTS_ID = 'retracements';
    static NEXT_ID = 'next';
    static TRENDS_ID = 'trends';
    // MOVEMENTS/RETRACEMENTS COLUMN HEADERS
    static TIMESTAMP_ID = 'timestamp';
    static HASH_ID = 'hash';
    static INIT_ID = 'init';
    static END_ID = 'end';
    static CORRECTION_ID = 'correction';
    static TREND_ID = 'trend';
    static DELTA_INIT_ID = 'deltainit';
    static DELTA_END_ID = 'deltaend';
    static RET_ID = 'retracement';
    static LEVEL_ID = 'level';
    static RET_LEVELS_ID = 'levels';
    static SEARCH_IN_ID = 'searchin';
    static SEARCH_IN_DATA_ID = 'searchindata';
    static ITERATE_ID = 'iterate';
    static ONLY_MAX_ID = 'onlymax';
    static FILTER_MODE_ID = 'filtermode';
    static PATTERN_RESULTS_ID = 'patternresults';
    static PATTERNS_ID = 'patterns';
    static RET_LEVELS_DATA_SOURCE_ID = 'levelsdatasource';
    static RET_LEVELS_FROM_ID = 'levelsfrom';
    
    static RET_DATA_SOURCE_ID = 'datasource';

    static LOGICAL_ID = 'logical';
    static RET_MIN_ID = 'ret_min';
    static RET_MAX_ID = 'ret_max';
    
    static HASH_SEP_STR = '-';

    static NO = 0;
    static ONLY_MAX_MOVEMENT = 1;
    static ONLY_MAX_RETRACEMENT = -1;
    static FILTER_FAMILY = 1;
    static FILTER_INTERVAL = 2;

    // NAMES
    static CHART_COMPONENT_ID = 'CHART_COMPONENT';
    static ALERT_COMPONENT_ID = 'ALERT_COMPONENT';
    static CHART_GRAPHIC_ID = 'CHART_GRAPH';
    static FIBO_RET_ID = 'FIBO_RET';
    static TREND_LINE_ID = 'TREND_LINE';
    static RECTANGLE_ID = 'RECTANGLE';

    // TREND LINE
    static DELTA_X_ID = 'deltax';
    static DELTA_Y_ID = 'deltay';
    static SLOPE_ID = 'slope';
    static ANGLE_ID = 'angle';

    // RECTANGLE GRAPHIC
    static TEXT_ID = 'text';

    // CANDLES INDEX
    static IDX_CANDLE_TIME = 0;
    static IDX_CANDLE_OPEN = Const.IDX_CANDLE_TIME + 1;
    static IDX_CANDLE_CLOSE = Const.IDX_CANDLE_OPEN + 1;
    static IDX_CANDLE_HIGH = Const.IDX_CANDLE_CLOSE + 1;
    static IDX_CANDLE_LOW = Const.IDX_CANDLE_HIGH + 1;

    // RELATIVE MAX INDEX
    static IDX_MAX_TIMESTAMP = 0;
    static IDX_MAX_MAX = 1;
    static IDX_MAX_MIN = 2;

    // MOVEMENTS INDEX
    static IDX_MOV_TIMESTAMP = 0;
    static IDX_MOV_INIT = 1;
    static IDX_MOV_END = 2;
    static IDX_MOV_CORR = 3;
    static IDX_MOV_SENSE = 4;
    static IDX_MOV_DELTA_INIT = 5;
    static IDX_MOV_DELTA_END = 6;
    static IDX_MOV_RET = 7;

    // RETRACEMENTS INDEX
    static IDX_RET_TIMESTAMP = 0;
    static IDX_RET_INIT = 1;
    static IDX_RET_END = 2;
    static IDX_RET_CORR = 3;
    static IDX_RET_SENSE = 4;
    static IDX_RET_DELTA_INIT = 5;
    static IDX_RET_DELTA_END = 6;
    static IDX_RET_RET = 7;
    static IDX_RET_LEVELS = 8;

    static DEFAULT_LOAD_HISTORIC_TIMEOUT = 20 * 1000;

    // SESSION
    static AUTOSAVE_SESSION_TIME = (0.5 * 60 * 1000); //30 seconds 

    static CHART_ID = 'chart';
    static CHART_INFO_ID = 'chart_info';
    static GRAPHICS_ID = 'graphic';

    //GRAPHICS
    static OPACIDAD_STR = 'Opacidad';
    static LINE_SOLID = 'solid';
    static LINE_DASH = 'dash';
    static LINE_DOT = 'dot';

    //DDBB EVENTS
    static EVENT_DDBB_LOAD_USER_MODEL = 'event-ddbb-load-user-model';
    static EVENT_DDBB_DELETE_MODEL = 'event-ddbb-delete-model';
    static EVENT_DDBB_SAVE_MODEL = 'event-ddbb-save-model';
    static EVENT_UPDATE_MODEL = 'event-update-model';
}

class Conf {
    static GRAPHIC_CONTROLS = {};
    //  = {
    //     [Fibonacci.NAME]: MenuFibonacci,
    //     [TrendLine.NAME]: MenuTrendLine,
    //     [RectangleGraphic.NAME]: MenuRectangleGraphic,
    // }

    static getGraphicControlsNames() {
        return Object.keys(Conf.GRAPHIC_CONTROLS);
    }

    static getGraphicControlsMenu(g) {
        return Conf.GRAPHIC_CONTROLS[g] || {};
    }
}


class ToolsCustom {

    /**
     * stringify: execute JSON stringify over any complex object, event with circular references.
     * @param obj Object to stringify.
     * @returns Objeect JSON string.
     */
    static stringify(obj) {
        let setCheck = new WeakSet();
        return JSON.stringify(obj, (key, value) => {
            if((typeof value == "object") && (value !== null)) {
                if(setCheck.has(value)) { return; }
                setCheck.add(value);
            }
            return value;
        });
    };
}
    

class KeyCode {
    static BACKSPACE = 8;
    static TAB = 9;
    static ENTER = 13;
    static SHIFT = 16;
    static CTRL = 17;
    static ALT = 18;
    static PAUSE_BREAK = 19;
    static ESC = 27;
    static SPACE = 32;
    static END = 35;
    static HOME = 36;
    static LEFT_ARROW = 37;
    static UP_ARROW = 38;
    static RIGHT_ARROW = 39;
    static DOWN_ARROW = 40;
    static INSERT = 45;
    static DELETE = 46;
    static F1 = 112;

    static ALPHA_NUM = [48, 90];
    static ALPHA = [65, 90];
    static NUM = [48, 64];
    static NUM_PAD = [96, 105];

    static alpha_code(key) {
        return key.charCodeAt();
    }

    static is_num(code) {
        let res = (code >= KeyCode.NUM[0]) && (code <= KeyCode.NUM[1]);
        res |= (code >= KeyCode.NUM_PAD[0]) && (code <= KeyCode.NUM_PAD[1]);
        return res;
    }

    static is_alpha(code) {
        let res = (code >= KeyCode.ALPHA[0]) && (code <= KeyCode.ALPHA[1]);
        return res;
    }

    static is_alpha_num(code) {
        let res = KeyCode.is_alpha() | KeyCode.is_num();
        return res;
    }
}
class Time {
    static MS_IN_SECONDS = 1000;
    static S_IN_MINUTE = 60;
    static S_IN_HOUR = Time.S_IN_MINUTE*60;
    static S_IN_DAY = Time.S_IN_HOUR*24;
    static MINUTES_IN_HOUR = 60;
    static MINUTES_IN_DAY = 1440;
    static MINUTES_IN_MONTH = 43200;
    static USE_UTC_MS = 0;
    static USE_STR = 0;

    static INTERVAL_TO_SECONDS = {
        "m": Time.S_IN_MINUTE,
        "h": Time.S_IN_HOUR,
        "d": Time.S_IN_DAY,
        "w": Time.S_IN_DAY*7,
        "M": Time.S_IN_DAY*30,
    };

    static TIME_FRAMES = [
        "1m",
        "3m",
        "5m",
        "15m",
        "30m",
        "1h",
        "2h",
        "4h",
        "6h",
        "8h",
        "12h",
        "1d",
        "3d",
        "1w",
        "1M"
    ];

    static TIME_UNITS_CONVERSION = {
        's':'seconds',
        'm':'minutes',
        'h':'hours',
        'd':'days',
        'w':'weeks',
        'M':'months',
        'y':'years',
    };

    static TIME_FRAME_CONVERSION = {
        'seconds': 's',
        'minutes': 'm',
        'hours': 'h',
        'days': 'd',
        'weeks': 'w',
        'months': 'M',
        'years': 'y',
    };

    static FORMAT_STR = 'YYYY-MM-DD HH:mm:ss';
    static FORMAT_FILE = 'YYYY_MM_DD_HHmmss';

    static convertToSeconds(units) {
        let units_in = units.replace(/[0-9]/g, '');
        let value = units.replace(/[a-zA-Z]/g, '');
        let seconds_unit = Time.INTERVAL_TO_SECONDS[units_in];
        seconds_unit = (seconds_unit != undefined) ? seconds_unit : 60; //Default seconds minute
        let ret = value*seconds_unit;
        return ret;
    }
    
    static getTimeQueries = ({timeFrame, from, startTime, endTime, querySize}) => {
        try {
            let timeQueries = [];
            let timeFrameMs = Time.convertToSeconds(timeFrame) * 1000;
            if(from) {
                // get start time form range
                let msQuery = Time.convertToSeconds(from) * 1000;
                startTime = Date.now() - msQuery;
                endTime = Date.now();
            }
            else {
                // 4 Months by default, y no start time provided
                if(!startTime) { startTime = new Date(new Date().getTime() - Time.convertToSeconds('4M')); }
                else { startTime = Date.parse(startTime); }

                if(!endTime) endTime = Date.now();
                else endTime = Date.parse(endTime);
            }

            if(startTime < 0) startTime = 0;

            // Get number of queries of given size
            let numQueries = ((endTime - startTime) / timeFrameMs) / querySize;
            if(numQueries - Math.floor(numQueries) > 0) {
                numQueries = parseInt(numQueries) + 1;
            }

            // Fill queries start and end time
            let currentStart = startTime;
            let currentEnd = startTime;
            let timeAdded = (timeFrameMs * querySize);
            
            for(let i = 0; i < numQueries; i++) {
                currentEnd += timeAdded;
                if(currentEnd > endTime) currentEnd = endTime;
                timeQueries.push({ startTime: currentStart, endTime: currentEnd })
                currentStart = currentEnd;
            }
            return timeQueries;
        }
        catch(err) {
            console.error(err);
        }
    }

    static getCountdown({ finalTime, initTime = Date.now()}) {
        let d2 = new Date(finalTime);
        let d1 = new Date(initTime);
        
        let secondsRemain = (d2 - d1);
        let m = secondsRemain / (Time.MS_IN_SECONDS * Time.S_IN_MINUTE);
        let msInHour = Time.S_IN_HOUR * Time.MS_IN_SECONDS;
        let timeRemain  = '';
        if(m < Time.MINUTES_IN_HOUR) {
            timeRemain = moment(secondsRemain).format('mm:ss');
        }
        else if(m < Time.MINUTES_IN_DAY) {
            timeRemain = moment(secondsRemain - msInHour).format('HH:mm:ss');
        }
        else {
            if(m < Time.MINUTES_IN_MONTH) {
                timeRemain = moment(secondsRemain - msInHour).format('DD-HH:mm').replace('-', 'd ');
                timeRemain = timeRemain.replace(/^[0]/, '');
            }
            else {
                timeRemain = moment(secondsRemain - msInHour).format('MM/DD-HH')
                .replace('/', 'M ')
                .replace('-', 'd ');
                timeRemain = timeRemain.replace(/^[0]/, '');
            }
        }

        return timeRemain;
    }

    static convert_units(units) {
        let units_in = units.replace(/[0-9]/g, '');
        units_in = Time.TIME_UNITS_CONVERSION[units_in];
        units_in = (units_in == undefined) ? '' : units_in;
        let value = units.replace(/[a-zA-Z]/g, '');
        value = parseFloat(value);
        return { value:value, units:units_in, str:(value+units_in) };
    }

    static convert_to_time_frame(time_units) {
        let time = time_units.replace(/[a-zA-Z]/g, '');
        let units = time_units.replace(/[0-9]/g, '');
        units = Time.TIME_FRAME_CONVERSION[units];
        if(!units) units = 'm';
        time = time + units;
        return time;
    }

    static now(formatter='') {
        let datetime = moment($.now());
        // if((typeof formatter == 'string') && (formatter != '')) {
        if(formatter != '') {
            datetime = datetime.format(formatter);
        }
        return datetime;
    }

    static subtract_value(time, delta, units='') {
        let units_in = (units != '') ? units : delta;
        let value_units_in = 1;
        if(typeof units_in == 'string') {
            value_units_in = parseInt(units_in.replace(/[a-zA-Z]/g, ''));
            units_in = units_in.replace(/[0-9]/g, '');
        }
        // XXX MEJOR QUE LANCE EXCEPCIÓN
        // units = (units_in in Time.TIME_UNITS_CONVERSION) ? Time.TIME_UNITS_CONVERSION[units_in] : 'm';
        units = Time.TIME_UNITS_CONVERSION[units_in];
        let value = delta;
        if (typeof value == 'string') {
            value = parseInt(value.replace(/[a-zA-Z]/g, ''));
        }
        value = value * value_units_in;
        let ret = moment(time).subtract(value, units);
        if(ret.valueOf() < 0) {
            ret = moment(0);
        }

        return ret;
    }

    static subtract_dates(final, start, timeFrame='') {
        let diff = 0;
        start = moment(start);

        let units = 'minutes'; //Default units to return result
        //If time frame is given, return result in same units
        if(timeFrame != '') {
            units = timeFrame.replace(/[0-9]/g, '');
            units = Time.TIME_UNITS_CONVERSION[units];
        }
        diff = moment(final).diff(start, units);
        return diff;
    }

    static add_value(time, delta, units='') {
        let units_in = (units != '') ? units : delta;
        let value_units_in = 1;
        if (typeof units_in == 'string') {
            value_units_in = parseInt(units_in.replace(/[a-zA-Z]/g, ''));
            units_in = units_in.replace(/[0-9]/g, '');
        }
        units = Time.TIME_UNITS_CONVERSION[units_in];
        let value = delta;
        if (typeof value == 'string') {
            value = value.replace(/[a-zA-Z]/g, '');
        }
        value = value * value_units_in;
        let ret = moment(time).add(value, units);
        return ret;
    }

    static generate_dates(start, end, delta, format = Time.USE_UTC_MS) {
        let res = [];
        let start_m = moment(start);
        let end_m = moment(end);
        if(end_m < start_m) {
            let tmp = end_m;
            end_m = start_m;
            start_m = tmp;
        }
        delta = Time.convert_units(delta);
        while(start_m < end_m)
        {
            if(format == Time.USE_UTC_MS) {
                res.push(start_m.valueOf());
            }
            else {
                res.push(start_m.format(Time.FORMAT_STR));
            }
            start_m = start_m.add(delta.value, delta.units);
        }
        return res;
    }
}

class DDBB {
    static LOAD_SESSION = 'load_session';
    static SAVE_SESSION = 'save_session';
    static CHECK_USER_LOGGED = 'check_user_logged';
    static AUTHENTICATE_USER = 'authenticate_user';
    static DELETE_PATTERN = 'delete_pattern';
    static DELETE_TEMPLATE = 'delete_template';
    static SAVE_PATTERN = 'save_pattern';
    static SAVE_TEMPLATE = 'save_template';
    static LOAD_USER_PATTERNS = 'load_user_patterns';
    static LOAD_USER_TEMPLATES = 'load_user_templates';
    static DDBB_ERROR = 'Error en base de datos';
    static DUPLICATE_KEY = 1062;
    static DUPLICATE_KEY_MSG = 'Identificador duplicado';
    static TABLE_NOT_FOUND = 1146;
    static TABLE_NOT_FOUND_MSG = 'Tabla no encontrada';
}