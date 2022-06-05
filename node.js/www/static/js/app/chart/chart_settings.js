

class ChartSettings {
    //----------------------------- STATIC, CONSTANTS -----------------------------
    static COLOR_UP_DEFAULT = "#2096f2";
    static COLOR_DOWN_DEFAULT = "#d0d5dc";
    static COLOR_BORDER_UP_DEFAULT = "#1b568c";
    static COLOR_BORDER_DOWN_DEFAULT = "#737680";
    static COLOR_TITLE_TEXT_DEFAULT = '#d7d7d7'; //"#aeb1ba";
    // static COLOR_BACKGROUND_DEFAULT = "#121723";
    // static COLOR_BACKGROUND_DEFAULT = "#1d1c1c";
    // static COLOR_BACKGROUND_DEFAULT = "#101010";
    static COLOR_BACKGROUND_DEFAULT = "#151515";
    static COLOR_CROSS_DEFAULT = '#525560';
    static COLOR_TIP_TEXT_DEFAULT ="#f8f8fa";
    static COLOR_SELECTED_BACK ="#2862fe";
    static COLOR_TEXT_AXIS_DEFAULT = 'rgba(173,175,185,255)';
    static COLOR_LINE_AXIS_DEFAULT = '#393d4b';


    //----------------------------- PROPERTIES -----------------------------
    colorUp = ChartSettings.COLOR_UP_DEFAULT;
    colorDown = ChartSettings.COLOR_DOWN_DEFAULT;
    colorBorderUp = ChartSettings.COLOR_UP_DEFAULT; //COLOR_BORDER_UP_DEFAULT;
    colorBorderDownd = ChartSettings.COLOR_DOWN_DEFAULT; //COLOR_BORDER_DOWN_DEFAULT;
    colorTitleText = ChartSettings.COLOR_TITLE_TEXT_DEFAULT;
    colorBackground = ChartSettings.COLOR_BACKGROUND_DEFAULT;
    colorCross = ChartSettings.COLOR_CROSS_DEFAULT;
    colorTipText = ChartSettings.COLOR_TIP_TEXT_DEFAULT;
    colorTextAxis = ChartSettings.COLOR_TEXT_AXIS_DEFAULT;
    colorLineAxis = ChartSettings.COLOR_LINE_AXIS_DEFAULT;

    //----------------------------- CONSTRUCTOR -----------------------------
        
    constructor(chartSettings) {
        if(chartSettings) {
            this.upColor = chartSettings.upColor;
            this.colorDown = chartSettings.colorDown;
            this.colorBorderUp = chartSettings.colorBorderUp;
            this.colorBorderDownd = chartSettings.colorBorderDownd;
            this.colorTitleText = chartSettings.colorTitleText;
            this.colorBackground = chartSettings.colorBackground;
            this.colorCross = chartSettings.colorCross;
            this.colorTipText = chartSettings.colorTipText;
            this.colorTextAxis = chartSettings.colorTextAxis;
            this.colorLineAxis = chartSettings.colorLineAxis;
        }
    }

    //----------------------------- PUBLIC METHODS -----------------------------

}