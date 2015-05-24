var folder_games = "resources/"
var games_files = ["beliavsky_nunn_1985", "byrne_fischer_1956", "ivanchuk_yusupov_1991", "karpov_kasparov_1985", "rotlewi_rubinstein_1907"];
var chess = new Chess();
var title = '';
var boards = [];

function showMovesList()
{
	var new_chess = new Chess();
	for(var i=0; i<chess.history().length; i++){
		$("#moves-list").append($("<li class='list-group-item' id='board-" +i + "'><a href='#'>" + chess.history()[i] + "</li>"));
		
		new_chess.move(chess.history()[i]);
		boards.push(new_chess.ascii());
	}
}

$( document ).ready(function() {
  for(var i=0; i<games_files.length; i++){
  	$("#game-selection").append($("<li id=" + games_files[i] + "><a href='#'>" + games_files[i] + "</li>"));
  }


  $( "#game-selection > li" ).click(function() {
  	  	var file = folder_games + $(this).attr('id') + ".pgn";
  	  	$.get(file, function(data) {
			var pgn = data.split("\n");
			chess.load_pgn(pgn.join('\n'));
			showMovesList(chess.history());
			title = chess.header().Black + " vs " + chess.header().White;
			$("#game-title").append(title);
		}, 'text');
		$("#div-home").hide();
		$("#div-detail").show();
		$("#div-detail").addClass("show");
	}).bind(this);

$('body').on('click', '#moves-list li', function(){
		$("#canvas").html("");
  		var id = $(this).attr('id');
  		id = id.split("-")[1];
  		var board = boards[id].split("\n");
  		for(var i=0; i<board.length; i++)
  		{
  			$("#canvas").append(board[i]);
  			$("#canvas").append("<br>");
  		}
  }).bind(this);
});