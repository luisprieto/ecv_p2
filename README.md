## TODO 2.0
- Rastro de movimiento
- Assets de verdad
- Fading
- Más partidas
- Posibilidad de subir partidas
- Opciones de fijar camara etc
- Slider velocidad en vez de botones
- Botones para centrar vista blanco/negro/cenital
- Camara siguiendo piezas

### P3
- Subir partidas pgn (añadirlas a un repositorio)
- Enlace descarga partida
- Anotar en movimientos
  - Posibilidad de votarlos (los usuarios lo hacen relevante o no)
- Full screen que muestra subtitulos con comentarios relevantes y hace zoom-in en movimientos
- barra de reproduccion (slider o algo así)
- Drag & Drop partidas pgn


{
	name_game: {
		file: http://...../name_Game.pgn,
		turns: [
			{
				author: string,
				comment: string,
				votes: int
			}
		]
	}
}

getGameList: devuelve lista de name_games
getGame: devuelve file y turns
sendComment
voteComment


LOCALSTORAGE
