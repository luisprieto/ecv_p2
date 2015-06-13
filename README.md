
# Chess Viewer
Chess Viewer es una aplicación que carga partidas de ajedrez guardadas en formato PGN, y permite reproducirlas con un visor en 3D.

PGN (Portable Game Notation) es una notación que permite guardar partidas de ajedrez y tiene todo lo necesario para generar el flujo de una partida de ajedrez, movimientos, capturas, enroques, jaques, etc.

## Autores
- Ricardo Navarro Nieto  - NIA: 152887
- Luis Prieto Fernández - NIA: 146735

## Clases
El juego consta de 2 clases:
1. ChessViewer
2. Chess3d

Para cargar los ficheros pgn hemos utilizado una librería llamada [Chess.js](https://github.com/jhlywa/chess.js).

Para las animaciones de las piezas hemos utilizado una librería llamada [tween.js](https://github.com/tweenjs/tween.js).

### ChessViewer
Está compuesta por una instancia de Chess3d y otra de Chess.js.

Esta clase genera una serie de tableros para cada turno y permite moverse entre turnos. Actua como un reproductor permitiendo pausar y reproducir las partidas, saltar turno por turno, así como da información de lo que ocurre en cada turno.

Dispone de una lista de partidas, entre las cuales se puede ir cambiando para verlas.

Puede reproducir turnos hacia atrás así como saltar entre turnos.

### Chess3d
Esta clase creará un árbol de escena de Three.js con el tablero y las piezas de un ajedrez y proveerá de los métodos necesarios para que ChessViewer pueda mover las piezas a cada casilla del tablero. ChessViewer le pasará unas coordenadas de ajedrez (b1 a c3) y Chess3d las traducirá a coordenadas de mundo.

Chess3d cargará assets en obj y mtl.

La librería controla qué piezas están fuera o dentro de la escena mostrándolas u ocultándolas, de forma que se pueda ir hacia delante y hacia atrás fácilmente. 
