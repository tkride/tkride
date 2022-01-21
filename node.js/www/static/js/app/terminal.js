/**file: terminal.js */


class Terminal {
    
    //----------------------------- STATIC, CONSTANTS -----------------------------

    static TERMINAL_LEFT_MIN = "5vw";
    static TERMINAL_TOP_MIN = "95vh";
    static TERMINAL_HEIGHT_MIN = "30px";
    static TERMINAL_WIDTH_MIN = "50px";

    static TERMINAL_LEFT_MAX = "20vw"; //125px";
    static TERMINAL_TOP_MAX = "45vh"; //"139px";
    static TERMINAL_HEIGHT_MAX = "300px";
    static TERMINAL_WIDTH_MAX = "600px";
    static CHAR_SIZE = 7.65;

    static EVENT_DISPLAY_TERMINAL = 'term-display';
    static EVENT_CLOSED = 'term-closed';
    static EVENT_OPEN = 'term-open';
    static EVENT_FOCUS = 'term-focus';
    static EVENT_FOCUS_LOST = 'term-focus-lost';

    static TERMINAL = '#terminal';

    //----------------------------- PROPERTIES -----------------------------

    context;
    cmd_hist = [];
    dos_key = 0;
    last_data;
    that;

    //----------------------------- CONSTRUCTOR -----------------------------

    constructor(context) {
        this.context = context;
    }

    //----------------------------- PRIVATE METHODS -----------------------------

    focus_term() {
        $('#user').focus();
        $(Terminal.TERMINAL).css('opacity', '0.90');
    }

    close_term() {
        $(".blink").css("position","inherit");
        $(Terminal.TERMINAL).hide();
        $(document).trigger(Terminal.EVENT_CLOSED);
    }

    open_term() {
        var that = this;
        $(Terminal.TERMINAL).show();
        $(document).trigger(Terminal.EVENT_OPEN);
        this.focus_term();
        $(Terminal.TERMINAL).focusin( e => {
            e.data = that; that.bind_keys(that)
            $(document).trigger(Terminal.EVENT_FOCUS);
        });

        $('#user').focusout( function(e) {
            that.unbind_keys();
            $(document).trigger(Terminal.EVENT_FOCUS_LOST);
        });
    }

    bind_keys(that) {
        $('#user').keyup(function(e) {
            if(e.keyCode == KeyCode.ESC) { that.close_term(); }
            else if(e.keyCode === KeyCode.ENTER) {
                e.preventDefault();
                var value = $(this).val(); // Get value
                $(".blink").css("position","inherit");
                that.process_cmd(that, value);
            }
            else if (e.keyCode == KeyCode.UP_ARROW) {
                that.dos_key = (that.dos_key >= that.cmd_hist.length) ? 0 : (that.dos_key + 1);
                $("#user").val(that.cmd_hist[that.dos_key]);
                $('.clone').text($(this).val());
            }
            else if (e.keyCode == KeyCode.DOWN_ARROW) {
                that.dos_key = (that.dos_key <= 0) ? that.cmd_hist.length : (that.dos_key - 1);
                $("#user").val(that.cmd_hist[that.dos_key]);
                $('.clone').text($(this).val());
            }
            else if (e.keyCode == KeyCode.LEFT_ARROW) {
                var pos = $(".blink").position();
                // let pos_user = $("#user").position();
                pos.left -= Terminal.CHAR_SIZE;
                $(".blink").css("position","absolute");
                $(".blink").css({left:pos.left, top:pos.top});
            }
            else if (e.keyCode == KeyCode.RIGHT_ARROW) {
                var pos = $(".blink").position();
                // let pos_user = $("#user").position();
                pos.left += Terminal.CHAR_SIZE;
                $(".blink").css("position","absolute");
                $(".blink").css({left:pos.left, top:pos.top});
            }
            else if (e.keyCode == KeyCode.DELETE) { }
            else if (e.keyCode == KeyCode.BACKSPACE) {
                var pos = $(".blink").position();
                if($(".blink").css("position") == "absolute") {
                    pos.left -= Terminal.CHAR_SIZE;
                    $(".blink").css({left:pos.left, top:pos.top});
                }
            }
            else { //if (((e.keyCode >= 48) & (e.KeyCode <= 90)) | ((e.KeyCode >= 189) & (e.KeyCode <= 222))) {
                var pos = $(".blink").position();
                if($(".blink").css("position") == "absolute") {
                    pos.left += Terminal.CHAR_SIZE;
                    $(".blink").css({left:pos.left, top:pos.top});
                }
            }
        });
    }

    unbind_keys() {
        $('#user').unbind('keyup');
    }

    execute(that, cmd, args) {
        // Comando es un objeto, accedemos al caso
        if (cmd in commands) {
            let retData = commands[cmd](that, args);
            if(retData != 0) {
                that.last_data = retData;
            }
        }
    }

    process_cmd(that, value) {
        $("#user").val(''); // Clears input
        $('.clone').text(''); // Clears clone
        $('#respuesta').append('<p class="comand">' + value + '</p>'); // Appends command into terminal container
        // Splits value into command and args
        let cmd_array = value.split(" ");
        let cmd = '';
        let args = [];
        if (cmd_array.length > 0) {
            cmd = cmd_array.splice(0,1)[0];
        }
        args = cmd_array;
        if (cmd.length == 0) {
            // $('#respuesta').append('<p class="comand"><br /></p>');
        }
        else {
            that.cmd_hist.push(value);
            if (!(cmd in commands)) {
                $('#respuesta').append('<p class="respuesta">Unknown "'+ cmd +'" command.<br />Type <span><strong>help</strong></span> for command list</p>');
            }
            else {
                that.execute(that, cmd, args);
            }
        }
        $(".terminal").scrollTop($(".terminal").get(0).scrollHeight);
    }

    //----------------------------- PUBLIC METHODS -----------------------------

    init() {
        var that = this;
        try {
            $(Terminal.TERMINAL).on('click', function() { that.focus_term(); });

            $(document).on(Terminal.EVENT_DISPLAY_TERMINAL, e => {
                if(that.is_visible()) that.close_term();
                else that.open_term();
            });

            // // Opens terminal
            // $('#terminal-open').on('click', function() {
            //     that.open_term();
            // });

            // Closes terminal
            $('#terminal-handle-close').on('click', function() {
                that.close_term();
            });

            // Minimize terminal
            $('#terminal-handle-min').on('click', function() {
                $(".terminal").hide();
                $(Terminal.TERMINAL)
                    .css("height", Terminal.TERMINAL_HEIGHT_MIN);
                    // .css("width", Terminal.TERMINAL_WIDTH_MIN)
                    // .css("left", Terminal.TERMINAL_LEFT_MIN)
                    // .css("top", Terminal.TERMINAL_TOP_MIN);
            });
            
            // Maximize terminal
            $('#terminal-handle-max').on('click', function() {
                $(Terminal.TERMINAL)
                    .css("height", Terminal.TERMINAL_HEIGHT_MAX);
                    // .css("width", Terminal.TERMINAL_WIDTH_MAX)
                    // .css("left", Terminal.TERMINAL_LEFT_MAX)
                    // .css("top", Terminal.TERMINAL_TOP_MAX);
                $(".terminal").show();
                that.focus_term();
            });

            $('#user').on('input',function(e){
            $('.clone').text($(this).val());
            });

            // // If user press any key
            // $('#user').keyup(function(e) {
            //     // If user press Enter
            //     if(e.keyCode === KeyCode.ENTER) {
            //         e.preventDefault();
            //         var value = $(this).val(); // Get value
            //         that.process_cmd(that, value);
            //         $(".blink").css("position","inherit");
            //     }
            //     else if (e.keyCode == KeyCode.ESC) {
            //         that.closeTerm();
            //     }
            //     else if (e.keyCode == KeyCode.UP_ARROW) {
            //         that.dos_key = (that.dos_key >= that.cmd_hist.length) ? 0 : (that.dos_key + 1);
            //         $("#user").val(that.cmd_hist[that.dos_key]);
            //         $('.clone').text($(this).val());
            //     }
            //     else if (e.keyCode == KeyCode.DOWN_ARROW) {
            //         that.dos_key = (that.dos_key <= 0) ? that.cmd_hist.length : (that.dos_key - 1);
            //         $("#user").val(that.cmd_hist[that.dos_key]);
            //         $('.clone').text($(this).val());
            //     }
            //     //TODO MOVER CARET DEL CURSOR
            //     else if (e.keyCode == KeyCode.LEFT_ARROW) {
            //         var pos = $(".blink").position();
            //         pos.left -= Terminal.CHAR_SIZE;
            //         $(".blink").css("position","absolute");
            //         $(".blink").css({left:pos.left, top:pos.top});
            //     }
            //     else if (e.keyCode == KeyCode.RIGHT_ARROW) {
            //         var pos = $(".blink").position();
            //         pos.left += Terminal.CHAR_SIZE;
            //         $(".blink").css("position","absolute");
            //         $(".blink").css({left:pos.left, top:pos.top});
            //     }
            //     else if (e.keyCode == KeyCode.DELETE) {
            //         // var pos = $(".blink").position();
            //         // if($(".blink").css("position") == "absolute") {
            //         //     pos.left -= Terminal.CHAR_SIZE;
            //         //     $(".blink").css({left:pos.left, top:pos.top});
            //         // }
            //     }
            //     else if (e.keyCode == KeyCode.BACKSPACE) {
            //         var pos = $(".blink").position();
            //         if($(".blink").css("position") == "absolute") {
            //             pos.left -= Terminal.CHAR_SIZE;
            //             $(".blink").css({left:pos.left, top:pos.top});
            //         }
            //     }
            //     else { //if (((e.keyCode >= 48) & (e.KeyCode <= 90)) | ((e.KeyCode >= 189) & (e.KeyCode <= 222))) {
            //         var pos = $(".blink").position();
            //         if($(".blink").css("position") == "absolute") {
            //             pos.left += Terminal.CHAR_SIZE;
            //             $(".blink").css({left:pos.left, top:pos.top});
            //         }
            //     }
            // });

            // Funcionn para hacer blink al cursor
            // http://stackoverflow.com/questions/12903594/set-css-with-jquery-after-ajax
            $('.blink').each(function() {
                var elem = $(this);
                setInterval(function() {
                    if (elem.css('visibility') == 'hidden') {
                        elem.css('visibility', 'visible');
                    }
                    else {
                        elem.css('visibility', 'hidden');
                    }
                }, 500);
            });

            $(Terminal.TERMINAL).focusout(function() {
                $(Terminal.TERMINAL).css('opacity', '0.35');
                $('.blink').css('visibility', 'hidden');
            });


            // Para tomar la barra superior, simulamos drag en mouse
            $("#terminal-handle").on("mousedown", function () { // Click!
                $("#terminal-handle").css('cursor','move');
            })
            .on("mouseup", function () { // Click-off...
                $("#terminal-handle").css('cursor','default'); // Default
            });

            // Handler con dom-drag.js
            // DYNAMIC DRIVE FUCK YEAH!
            // http://www.dynamicdrive.com/dynamicindex11/domdrag/
            var theHandle = document.getElementById("terminal-handle");
            var theRoot = document.getElementById("terminal");
            Drag.init(theHandle, theRoot);

            // Closed terminal by default
            this.close_term();
            console.log('Terminal Initialized OK.');
        }
        catch(error) {
            console.error("Terminal NOT Initialized: ", error);
        }
    }

    is_visible() {
        return $(Terminal.TERMINAL).is(':visible');
    }

    is_terminal_focused() {
        let res = ($(Terminal.TERMINAL).is(":focus")
                || $("#user").is(":focus"));
        return res;
    }
}