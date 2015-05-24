var folder_games = "resources/"
var games_files = ["beliavsky_nunn_1985", "byrne_fischer_1956", "ivanchuk_yusupov_1991", "karpov_kasparov_1985", "rotlewi_rubinstein_1907"];
var chess = new Chess();
var title = '';

function showMovesList(moves)
{
	for(var i=0; i<moves.length; i++)
		$("#moves-list").append($("<li class='list-group-item' id=" + moves[i] + "><a href='#'>" + moves[i] + "</li>"));
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
});