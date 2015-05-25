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
        this.boards = [];
        this.bakedBoard = [];

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
        this._canvas = $("#canvas");

        //init chess
        this.chess = new Chess();

        //fill select
        for (var i = 0; i < this.games_files.length; i++) {
            $(this._select).append($("<li id=" + this.games_files[i] + "><a href='#'>" + this.games_files[i] + "</li>"));
        }

        $(this._select).find("> li").click(on_gameSelection.bind(this));
        $('body').on('click', '#moves-list li', on_listClick.bind(this));
    };

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     */
    ChessViewer.prototype.showMovesList = function() {
        var new_chess = new Chess();
        for (var i = 0; i < this.chess.history().length; i++) {
            $("#moves-list").append($("<li class='list-group-item' id='board-" + i + "'><a href='#'>" + this.chess.history()[i] + "</li>"));

            new_chess.move(this.chess.history()[i]);
            this.boards.push(new_chess.ascii());
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

                bb.push(t);
            }
        }
    };

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
        this.title = header.Black + " vs " + header.White;
        $("#game-title").append(this.title);
    }

    /**
     * @this ChessViewer
     * @memberof ChessViewer
     * @param event
     */
    function on_gameSelection(event) {
        var t = event.currentTarget;
        console.log(t.id);
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
    function on_listClick(event) {
        var t = event.currentTarget;
        $(this._canvas).html("");
        var id = $(t).attr('id');
        id = id.split("-")[1];
        var board = this.boards[id].split("\n");
        for (var i = 0; i < board.length; i++) {
            $(this._canvas).append(board[i]).append("<br>");
        }
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