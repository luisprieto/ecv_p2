$(document).ready(function () {
    window.chessViewer = new ChessViewer();
    chessViewer.init();
});

(function(_global) {
    "use strict";

    /**
     * @class
     * @this ChessViewer
     * @global
     * @return ChessViewer
     */
    function ChessViewer() {
        this.folder_games = "resources/";
        this.games_files = ["beliavsky_nunn_1985", "byrne_fischer_1956", "ivanchuk_yusupov_1991", "karpov_kasparov_1985", "rotlewi_rubinstein_1907"];
        this.title = '';
        this.bakedBoard = [];
        this.currentTurn = 0;
        this.speed = 1000;
        this.timer = null;
        this.result = '';

        this.chess = undefined;

        //html elems
        this._select = undefined;
        this._canvas = undefined;
    }

    _global.ChessViewer = ChessViewer;

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     */
    ChessViewer.prototype.init = function () {
        //Get html elements
        this._select =  $("#game-selection");
        this._canvas = $("#canvas")[0];

        //init chess
        this.chess = new Chess();

        //fill select
        for (var i = 0; i < this.games_files.length; i++) {
            $(this._select).append($("<li id=" + this.games_files[i] + "><a href='#'>" + this.games_files[i] + "</li>"));
        }

        $(this._select).find("> li").click(on_gameSelection.bind(this));
        $('body').on('click', '#moves-list li', on_listClick.bind(this));

        $('body')
            .on('click', '#btn-play',     on_btnPlayClick.bind(this))
            .on('click', '#btn-pause',    on_btnPauseClick.bind(this))
            .on('click', '#btn-incSpeed', on_btnIncreaseSpeed.bind(this))
            .on('click', '#btn-decSpeed', on_btnDecreaseSpeed.bind(this))
            .on('click', '#btn-next',     on_btnNext.bind(this))
            .on('click', '#btn-previous', on_btnPrevious.bind(this));

        this.chess3d = new Chess3d(this._canvas);
        this.chess3d.on_ready = chess3d_ready.bind(this);
        this.chess3d.speed_anim = this.speed - 300;
        this.chess3d.init();
    };

    ChessViewer.prototype.startChess = function () {
        this.chess3d.start();
        this.setChess(0);
        //this.resumeChess();

    };

    ChessViewer.prototype.reset = function () {
        this.pauseChess();
        this.title = '';
        this.bakedBoard = [];
        this.currentTurn = 0;
        this.setSpeed(1000);
        this.chess3d.clearBoard();
    };

    ChessViewer.prototype.resumeChess = function () {
        this.pauseChess();
        this.timer = setInterval(this.nextMove.bind(this), this.speed);
    };

    ChessViewer.prototype.pauseChess = function () {
        if(this.timer != null) clearInterval(this.timer);
        this.timer = null;
    };

    ChessViewer.prototype.setSpeed = function (speed) {
        this.speed = speed;
        this.chess3d.speed_anim = this.speed - 300;
        if(this.timer) {
            this.pauseChess();
            this.timer = setInterval(this.nextMove.bind(this), this.speed);
        }
    };

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     */
    ChessViewer.prototype.showMovesList = function() {
        $("#moves-list").append($("<li class='list-group-item' id='board-0'><a href='#'>Init</li>"));
        for (var i = 0; i < this.chess.history().length; i++) {
            var next = i+1;
            var history = this.chess.history({verbose:true})[i];
            var history_data = getPieceName(history.piece) + " [" + history.from + " > " + history.to + "]";
            $("#moves-list").append($("<li class='list-group-item " + history.color + "' id='board-" + next + "'><a href='#'>" + history_data + "</li>"));
        }
    };

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     */
    ChessViewer.prototype.bakeChess = function () {
        var history = this.chess.history({verbose: true});
        var bb = this.bakedBoard;
        bb.push(clone(initial_state));

        for(var i in history) {
            if(history.hasOwnProperty(i)) {
                var h = history[i];
                var last = bb.length - 1;

                //clone last turn state
                var t = clone(bb[last]);

                //fill current turn data
                t.data = {
                    from: h.from,
                    to: h.to,
                    color: h.color,
                    flags: h.flags,
                    moves: t[h.from],
                    captured: t[h.to],
                    promotion: h.promotion
                };

                //move piece
                t[h.to] = t[h.from];
                t[h.from] = null;

                //Castling
                if(h.flags == "k") {
                    if(h.color == "w") {
                        t.data.castling_from = "h1";
                        t.data.castling_to = "f1";
                        t.data.castling_moves = t["h1"];
                        t["f1"] = t["h1"];
                        t["h1"] = null;
                    }
                    else {
                        t.data.castling_from = "h8";
                        t.data.castling_to = "f8";
                        t.data.castling_moves = t["h8"];
                        t["f8"] = t["h8"];
                        t["h8"] = null;
                    }
                }
                else if (h.flags == "q") {
                    if(h.color == "w") {
                        t.data.castling_from = "aq";
                        t.data.castling_to = "d1";
                        t.data.castling_moves = t["a1"];
                        t["d1"] = t["a1"];
                        t["a1"] = null;
                    }
                    else {
                        t.data.castling_from = "a8";
                        t.data.castling_to = "d8";
                        t.data.castling_moves = t["a8"];
                        t["d8"] = t["a8"];
                        t["a8"] = null;
                    }
                }

                bb.push(t);
            }
        }
    };

    ChessViewer.prototype.setChess = function (turn) {
        this.chess3d.clearBoard();
        this.currentTurn = turn;
        this.markActiveMove();
        var board = this.bakedBoard[turn];
        for(var i in board) {
            if(i != "data" && board.hasOwnProperty(i)) {
                var id = board[i];
                if(id != null) this.chess3d.setPiece(id, i);
            }
        }
    };

    ChessViewer.prototype.nextMove = function () {
        var length = this.bakedBoard.length - 1;
        if(this.currentTurn >= length) clearTimeout(this.timer);
        else {
            this.currentTurn++;
            this.markActiveMove();
            var board = this.bakedBoard[this.currentTurn];
            var data = board.data;
            if (data.moves && data.from && data.to) {
                this.chess3d.movePiece(data.moves, data.from, data.to, data.captured);
                if(data.castling_from && data.castling_to)
                    this.chess3d.movePiece(data.castling_moves, data.castling_from, data.castling_to);
            }
        }
    };

    ChessViewer.prototype.previousMove = function () {
        console.log("turn: " + this.currentTurn);
        if(this.currentTurn > 0) {
            var board = this.bakedBoard[this.currentTurn];
            var data = board.data;
            if (data.moves && data.from && data.to) {
                this.chess3d.movePiece(data.moves, data.to, data.from, data.captured, true);
                if(data.castling_from && data.castling_to)
                    this.chess3d.movePiece(data.castling_moves, data.castling_to, data.castling_from);
            }

            this.currentTurn--;
            this.markActiveMove();
        }
    };

    ChessViewer.prototype.markActiveMove = function(){
        var id = "#board-" + this.currentTurn;

        $(".list-group-item").removeClass("active");

        if(!$(id).hasClass("active"))
            $(id).addClass("active");

        if(this.currentTurn > 3){
            var turn_top = this.currentTurn-3;
            var id_top = "#board-" + turn_top;
            $("#div-moves").scrollTop($(id_top).offset().top - $("#board-0").offset().top);
        } 
 
        if(this.currentTurn == this.chess.history().length) 
            {
                var winner = '';
                var label_result = '';
                switch(this.result){
                    case '1-0':
                        winner = 'White wins';
                        label_result = 'label-white';
                    break;

                    case '0-1':
                        winner = 'Black wins';
                        label_result = 'label-black';
                    break;

                    case '1/2-1/2':
                        winner = 'Draw';
                        label_result = 'label-default';
                    break;

                    case '*':
                        winner = 'Other';
                        label_result = 'label-default';
                    break;
                }
                $("#result").html("<button class='btn btn-lg " + label_result + "' type='button'>" + winner + "</button>");
            }
        else  $("#result").html("");      
    };

    function getPieceName(letter){
        var name = '';
        switch(letter){
            case 'k':
                name = "King";
            break;
            case 'q':
                name = "Queen";
            break;
            case 'b':
                name = "Bishop";
            break;
            case 'n':
                name = "Knight";
            break;
            case 'r':
                name = "Rook";
            break;
            case 'p':
                name = "Pawn";
            break;
        }
        return name;
    }

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     * @param data
     */
    function get_pgn(data) {
        var pgn = data.split("\n");
        this.chess.load_pgn(pgn.join('\n'));
        this.showMovesList();
        this.bakeChess();
        var header = this.chess.header();
        var year = header.Date.split(".")[0];
        this.title = header.White + " vs " + header.Black + " (" + year + ")";
        $("#game-title").append(this.title);
        this.result = header.Result;

        this.startChess();
    }

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     * @param event
     */
    function on_gameSelection(event) {
        this.reset();
        var t = event.currentTarget;
        var file = this.folder_games + $(t).attr('id') + ".pgn";
        $.get(file, get_pgn.bind(this), 'text');
        $("#div-home").hide();
        $("#div-detail").show().addClass("show");
    }

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     * @param event
     */
    function on_listClick (event) {
        var t = event.currentTarget;
        var id = $(t).attr('id');
        id = id.split("-")[1];
        this.setChess(id);
    }

    function chess3d_ready () {
        $("#btn-loading").fadeOut();
        $("#btn-dropdown").delay(400).fadeIn();
        //this.startChess();
    }

    function on_btnPlayClick () {
        $('#btn-play').hide();
        $('#btn-pause').show();
        $('#btn-next').prop('disabled', true);
        $('#btn-previous').prop('disabled', true);
        this.resumeChess();
    }

    function on_btnPauseClick () {
        $('#btn-play').show();
        $('#btn-pause').hide();
        $('#btn-next').prop('disabled', false);
        $('#btn-previous').prop('disabled', false);
        this.pauseChess();
    }

    function on_btnIncreaseSpeed () {
        if(this.speed <= 5500){
            this.setSpeed(this.speed + 500);
            $('#btn-incSpeed').prop('disabled', false);
            $('#btn-decSpeed').prop('disabled', false);
        }
        else $('#btn-incSpeed').prop('disabled', true);
        console.log("speed: " + this.speed);
    }

    function on_btnDecreaseSpeed () {
        if(this.speed >= 1500){
            this.setSpeed(this.speed - 500);
            $('#btn-decSpeed').prop('disabled', false);
            $('#btn-incSpeed').prop('disabled', false);
        }
        else $('#btn-decSpeed').prop('disabled', true);
        console.log("speed: " + this.speed);
    }

    function on_btnPrevious () {
        this.previousMove();
    }

    function on_btnNext () {
        this.nextMove();
    }

    var initial_state = {
        data: {
            from: undefined,
            to: undefined,
            color: undefined,
            flags: undefined,
            moves: undefined,
            captured: undefined,
            promotion: undefined
        },

        a1: "white_rook1",
        a2: "white_pawn1",
        a3: null,
        a4: null,
        a5: null,
        a6: null,
        a7: "black_pawn1",
        a8: "black_rook1",

        b1: "white_knight1",
        b2: "white_pawn2",
        b3: null,
        b4: null,
        b5: null,
        b6: null,
        b7: "black_pawn2",
        b8: "black_knight1",

        c1: "white_bishop1",
        c2: "white_pawn3",
        c3: null,
        c4: null,
        c5: null,
        c6: null,
        c7: "black_pawn3",
        c8: "black_bishop1",

        d1: "white_queen",
        d2: "white_pawn4",
        d3: null,
        d4: null,
        d5: null,
        d6: null,
        d7: "black_pawn4",
        d8: "black_queen",

        e1: "white_king",
        e2: "white_pawn5",
        e3: null,
        e4: null,
        e5: null,
        e6: null,
        e7: "black_pawn5",
        e8: "black_king",

        f1: "white_bishop2",
        f2: "white_pawn6",
        f3: null,
        f4: null,
        f5: null,
        f6: null,
        f7: "black_pawn6",
        f8: "black_bishop2",

        g1: "white_knight2",
        g2: "white_pawn7",
        g3: null,
        g4: null,
        g5: null,
        g6: null,
        g7: "black_pawn7",
        g8: "black_knight2",

        h1: "white_rook2",
        h2: "white_pawn8",
        h3: null,
        h4: null,
        h5: null,
        h6: null,
        h7: "black_pawn8",
        h8: "black_rook2"
    };


    function clone(object) {
        return jQuery.extend({}, object);
    }

})(window);