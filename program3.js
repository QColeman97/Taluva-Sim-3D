// Program #2
// Quinn Coleman
// CSC 378-1    3/6/18

// Load audio and image assets first
var audioElement;
var hutImage = new Image();
hutImage.src = "hut.png";
var towerImage = new Image();
towerImage.src = "tower.png";
var templeImage = new Image();
templeImage.src = "temple.png";

window.addEventListener('load', eventWindowLoaded, false);	
function eventWindowLoaded() {
	// Set up background music
	audioElement = document.createElement("audio");
	document.body.appendChild(audioElement);
	audioElement.addEventListener("canplaythrough",bkgdMusicLoaded,false);
	audioElement.setAttribute("src","[N163] Hotline Bling (8-bit Bossa Remix).mp3");
}

// CONSTANTS
// colors // http://www.color-hex.com/
const JUNGLECOLOR  = 'rgba(0, 100, 0, 255)'; 
const GRASSCOLOR   = 'rgba(0, 225, 0, 255)'; 
const DESERTCOLOR  = 'rgba(255, 201, 102, 255)';
const QUARRYCOLOR  = 'rgba(123, 123, 139, 255)';
const LAGOONCOLOR  = 'rgba(0, 191, 255, 255)';
const VOLCANOCOLOR = 'rgba(255, 48, 48, 255)'; 

const SubtileTypeEnum = {
  JUNGLE: 0,
  GRASS:  1,
  DESERT: 2,
  QUARRY: 3,
  LAGOON: 4,
  VOLCANO: 5,
};

const PlayerEnum = {
	ONE: 1,
	TWO: 2,
	THREE: 3,
	FOUR: 4
};

const HUTS = 80;
const TOWERS = 8;
const TEMPLES = 12;

const TILE_NUM = 48;
const ROWS = 15;
const TILE_ROWS = ROWS - 1;
const COLS = 13;
const TILE_COLS = COLS - 1;
const STATE_COLS = COLS + Math.floor((ROWS-1)/2); // 20

// Hexagon constants
const SIZE = 50;
const WIDTH = Math.sqrt(3) * SIZE;
const HEIGHT = SIZE * 2;
// Board constants
const BOARD_X = 3.5 * WIDTH;
const BOARD_Y = SIZE;
const PANEL_WIDTH = 3*WIDTH;
const BOARD_WIDTH = PANEL_WIDTH + (COLS*WIDTH);
const BOARD_HEIGHT = (2*SIZE)+(Math.floor((ROWS-1)/2)*(3*SIZE));
// Tile Deck constants
const DECK_X = 1.5 * WIDTH;
const DECK_Y = 5 * SIZE;
// Building Hut, Temple, and Tower constants
const HUT_X = 0.25 * WIDTH;
const TEMPLE_X = 1.12 * WIDTH;
const TOWER_X = 2 * WIDTH;
const HTT_Y = 9 * SIZE;
const EXPAND_BTN_X = 0.5 * WIDTH;
const EXPAND_BTN_Y = 12 * SIZE;
const DONE_BTN_X = 0.5 * WIDTH;
const DONE_BTN_Y = 16 * SIZE;
// TALUVA Title constants
const TITLE_X = 0.1 * WIDTH;
const TITLE_Y = BOARD_HEIGHT - (3*SIZE);

// https://boardgamegeek.com/thread/184290/terrain-distribution
// [[top, left, right]...]
const terrainDist = [
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.JUNGLE], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.GRASS],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.GRASS],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.GRASS],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.GRASS], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.GRASS],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.GRASS], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.DESERT],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.DESERT], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.DESERT],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.DESERT], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.QUARRY],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.QUARRY], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.LAGOON],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.JUNGLE, SubtileTypeEnum.LAGOON], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.JUNGLE], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.JUNGLE], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.GRASS], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.DESERT],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.DESERT], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.QUARRY],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.QUARRY], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.GRASS, SubtileTypeEnum.LAGOON],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.JUNGLE], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.JUNGLE], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.GRASS], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.GRASS],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.DESERT], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.QUARRY],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.QUARRY], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.DESERT, SubtileTypeEnum.LAGOON],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.JUNGLE], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.GRASS], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.GRASS],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.DESERT], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.QUARRY],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.QUARRY, SubtileTypeEnum.LAGOON], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.LAGOON, SubtileTypeEnum.JUNGLE],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.LAGOON, SubtileTypeEnum.GRASS], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.LAGOON, SubtileTypeEnum.DESERT],
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.LAGOON, SubtileTypeEnum.QUARRY], 
	[SubtileTypeEnum.VOLCANO, SubtileTypeEnum.LAGOON, SubtileTypeEnum.LAGOON]
];

// Hexagon Class useful for board location info
class HexState {
  	constructor(row, col, level, type, rotation, player, huts, temples, towers, selected){//, orientation){
		this.row = row;
		this.col = col;
		this.level = level;
		this.type = type;
		this.rot = rotation; // for lava direction
		//this.orientation = orientation; // for lava direction
		this.player = player;
		this.huts = huts;
		this.temples = temples;
		this.towers = towers;
		this.selected = selected;
  	}
}

// Game global vars
var drawableBoardHexagons = []; // Full of HexStates - for drawing
var selectedSettlement = [];    // Full of HexStates of a single player's settlement

// For game logic (legal tile placement)
// Full of HexStates
var boardState = new Array(ROWS);
for (var i = 0; i < ROWS; i++) {
	boardState[i] = new Array(STATE_COLS);
	for (var j = 0; j < STATE_COLS; j++) {
		boardState[i][j] = null;
	}
}

//STATE
var choosingPlayerNum = true;
var players = [];
var playerIndex = 0;
var terrDistIndex = 0;
var remainingTiles = TILE_NUM - terrDistIndex;
var outOfTiles = false;
//STATE
var idling = false;
//STATE
var holdingTile = false;
var heldOverPlaced = false;
//STATE
var buildingTime = false;
//STATE
var holdingHut = false;
var buildingHuts = false;
//STATE
var holdingTower = false;
var buildingTowers = false;
//STATE
var holdingTemple = false;
var buildingTemples = false;
var placedAtLeastOneBuilding = false;
//STATE
var pickingSettlement = false;
var expanding = false;
//STATE
var pickingAdjacentTerrainType = false;
var tileAngle = 0;
var tileFlipped = false;
var firstDraw = true;
var currPlayer = PlayerEnum.ONE;

var gameOver = false;
var lastPlayerAlive = 0; 
var onePlayerLeft = false;

var RemainingHutsEnum = {
	ONE: HUTS/4,
	TWO: HUTS/4,
	THREE: HUTS/4,
	FOUR: HUTS/4
};
var RemainingTemplesEnum = {
	ONE: TEMPLES/4,
	TWO: TEMPLES/4,
	THREE: TEMPLES/4,
	FOUR: TEMPLES/4
};
var RemainingTowersEnum = {
	ONE: TOWERS/4,
	TWO: TOWERS/4,
	THREE: TOWERS/4,
	FOUR: TOWERS/4
};

var PlacedHutsEnum = {
	ONE: 0,
	TWO: 0,
	THREE: 0,
	FOUR: 0
};
var PlacedTemplesEnum = {
	ONE: 0,
	TWO: 0,
	THREE: 0,
	FOUR: 0
};
var PlacedTowersEnum = {
	ONE: 0,
	TWO: 0,
	THREE: 0,
	FOUR: 0
};

// Launch app
function bkgdMusicLoaded(e) {
	canvasApp();
}

function canvasApp(){

	var theCanvas = document.getElementById('canvas');  
  	var context = theCanvas.getContext('2d');

	var mouseX;
	var mouseY;

	// UNMUTE FOR BACKGROUND MUSIC
	audioElement.muted = true;

	audioElement.play();
	audioElement.loop = true;
	audioElement.volume = 0.5;

	// Shuffle the tile deck
	shuffleArray(terrainDist);

	// Create 3D arrays to hold legal tile and hexagon board coordinates
    var UDLegalTileCoords = new Array(TILE_ROWS);
	for (var i = 0; i < TILE_ROWS; i++) {
		UDLegalTileCoords[i] = new Array(TILE_COLS);
		for (var j = 0; j < TILE_COLS; j++) {
			UDLegalTileCoords[i][j] = new Array(2);
			for (var c = 0; c < 2; c++) {
				// Odd tile rows only have 13 cols (trash 13 index) - fill w/ trash
				if (j === (TILE_COLS-1) && (i % 2) !== 0) {
					UDLegalTileCoords[i][j][c] = -100;
				} else if (c === 0) {  // x-coord
					if (i % 2 === 0) {  // even row
						UDLegalTileCoords[i][j][c] = (j*WIDTH) + (4*WIDTH);
					} else {            // odd row
						UDLegalTileCoords[i][j][c] = (j*WIDTH) + (4.5*WIDTH);
					}
				} else {        // y-coord
					UDLegalTileCoords[i][j][c] = (i*1.5*SIZE) + (1.5*SIZE);
				}
			}
		}
	}

	var RUlegalTileCoords = new Array(TILE_ROWS);
	for (var i = 0; i < TILE_ROWS; i++) {
		RUlegalTileCoords[i] = new Array(TILE_COLS);
		for (var j = 0; j < TILE_COLS; j++) {
			RUlegalTileCoords[i][j] = new Array(2);
			for (var c = 0; c < 2; c++) {
				// Even rows only have 13 cols - fill w/ trash
				if (j === (TILE_COLS-1) && i % 2 === 0) {
					RUlegalTileCoords[i][j][c] = -100;
				} else if (c === 0) {  // x-coord
					if (i % 2 === 0) {
						RUlegalTileCoords[i][j][c] = (j*WIDTH) + (4.5*WIDTH);
					} else {
						RUlegalTileCoords[i][j][c] = (j*WIDTH) + (4*WIDTH);
					}
				} else {        // y-coord
					RUlegalTileCoords[i][j][c] = (i*1.5*SIZE) + (2*SIZE);
				}
			}
		}
	}

	var legalHexCoords = new Array(ROWS);
	for (var i = 0; i < ROWS; i++) {
		legalHexCoords[i] = new Array(COLS);
		for (var j = 0; j < COLS; j++) {
			legalHexCoords[i][j] = new Array(2);
			for (var c = 0; c < 2; c++) {
				if (c === 0) {
					if (i % 2 === 0) {
						legalHexCoords[i][j][c] = BOARD_X + (WIDTH * j);
					} else if (j < (COLS-1)) {
						legalHexCoords[i][j][c] = BOARD_X + (WIDTH * j) + (WIDTH / 2);
					}
				// else if c === 1
				} else {
					legalHexCoords[i][j][c] = BOARD_Y + (SIZE * (3/2) * i);
				}
			}
		}
	}

	drawScreen(); 

	// Draw in order from back to front
	function drawScreen() {
		
		drawBackground();
		drawSidePanel();
		drawTitle();
		
		// Optional - draw gameboard's hexgrid
		/*for (row = 0; row < ROWS; row++) {
		    for (col = 0; col < COLS; col++) {
                if (row % 2 === 0) {
                    // even row
                    drawHexagon(
                        BOARD_X + (WIDTH * col), 
                        BOARD_Y + (SIZE * (3/2) * row), 
                        -1, true, 0, false, 0, 0, 0, 0);
                } else if (col < COLS-1) {
                    // odd row - do not draw 7th column
                    drawHexagon(
                        BOARD_X + (WIDTH * col) + (WIDTH / 2), 
                        BOARD_Y + (SIZE * (3/2) * row), 
                        -1, true, 0, false, 0, 0, 0, 0);
                }
		    }
		}*/

 		// Draw game board's placed hexagons
		for (var i = 0; i < drawableBoardHexagons.length; i++) {
			translateAndDrawHexState(
				drawableBoardHexagons[i].row, drawableBoardHexagons[i].col, 
				drawableBoardHexagons[i].level, drawableBoardHexagons[i].type, 
				drawableBoardHexagons[i].rot, drawableBoardHexagons[i].player,
				drawableBoardHexagons[i].huts, drawableBoardHexagons[i].towers,
				drawableBoardHexagons[i].temples);
		}

		if (choosingPlayerNum) {
			drawPlayerNumPrompt();
			return;
		} else if (gameOver) {
			if (builtTwoOfThreeTypes()) {
				// Early Victory!
				drawPlayerWin(currPlayer);
				alert("Player " + currPlayer + " Wins! 2 of the 3 types of their buildings have all been built! Gnarly :)");
			} else if (onePlayerLeft) {
				var lastPlayer = 0;
				switch(lastPlayerAlive) {
				case 1:
					lastPlayer = PlayerEnum.ONE;
					break;
				case 2:
					lastPlayer = PlayerEnum.TWO;
					break;
				case 3:
					lastPlayer = PlayerEnum.THREE;
					break;
				case 4:
					lastPlayer = PlayerEnum.FOUR;
					break;
				}
				drawPlayerWin(lastPlayer);
				alert("Player " + lastPlayer + " Wins! They're the last player who can actually build anything. Woah, sweet!");
			} else if (outOfTiles) {
				// Find who has max temples -> towers -> huts
				var mostPlayer = 0;
				var maxTemples = maxTowers = maxHuts = 0;
				var maxes = [0,0,0,0];
				var tied = [];

				// Who has max temples
				maxTemples = Math.max(PlacedTemplesEnum.ONE, Math.max(PlacedTemplesEnum.TWO, Math.max(PlacedTemplesEnum.THREE, PlacedTemplesEnum.FOUR)));
				if (PlacedTemplesEnum.ONE === maxTemples) {
					maxes[0] = 1;
				}
				if (PlacedTemplesEnum.TWO === maxTemples) {
					maxes[1] = 1;
				}
				if (PlacedTemplesEnum.THREE === maxTemples) {
					maxes[2] = 1;
				}
				if (PlacedTemplesEnum.FOUR === maxTemples) {
					maxes[3] = 1;
				}
				for (var i = 0; i < 4; i++) {
					if (maxes[i] === 1) {
						tied.push(i+1);
					}
				}
				console.log("(temples) Maxes: " + maxes);
				console.log("(temples) Tied: " + tied);

				if (tied.length > 1) {
					// Who of tied has max towers
					switch (tied.length) {
					case 2:
						var val1, val2;
						for (var i = 0; i < tied.length; i++) {
							if (i === 0) {
								switch(tied[i]) {
								case 1:
									val1 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val1 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val1 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val1 = PlacedTowersEnum.FOUR;
									break;
								}
							} else {
								switch(tied[i]) {
								case 1:
									val2 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val2 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val2 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val2 = PlacedTowersEnum.FOUR;
									break;
								}
							}
						}
						maxTowers = Math.max(val1, val2);
						break;
					case 3:
						var val1, val2, val3;
						for (var i = 0; i < tied.length; i++) {
							if (i === 0) {
								switch(tied[i]) {
								case 1:
									val1 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val1 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val1 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val1 = PlacedTowersEnum.FOUR;
									break;
								}
							} else if (i === 1) {
								switch(tied[i]) {
								case 1:
									val2 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val2 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val2 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val2 = PlacedTowersEnum.FOUR;
									break;
								}
							} else {
								switch(tied[i]) {
								case 1:
									val3 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val3 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val3 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val3 = PlacedTowersEnum.FOUR;
									break;
								}
							}
						}
						maxTowers = Math.max(val1, Math.max(val2, val3));
						break;
					case 4:
						var val1, val2, val3, val4;
						for (var i = 0; i < tied.length; i++) {
							if (i === 0) {
								switch(tied[i]) {
								case 1:
									val1 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val1 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val1 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val1 = PlacedTowersEnum.FOUR;
									break;
								}
							} else if (i === 1) {
								switch(tied[i]) {
								case 1:
									val2 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val2 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val2 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val2 = PlacedTowersEnum.FOUR;
									break;
								}
							} else if (i === 2) {
								switch(tied[i]) {
								case 1:
									val3 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val3 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val3 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val3 = PlacedTowersEnum.FOUR;
									break;
								}
							} else {
								switch(tied[i]) {
								case 1:
									val4 = PlacedTowersEnum.ONE;
									break;
								case 2:
									val4 = PlacedTowersEnum.TWO;
									break;
								case 3:
									val4 = PlacedTowersEnum.THREE;
									break;
								case 4:
									val4 = PlacedTowersEnum.FOUR;
									break;
								}
							}
						}
						maxTowers = Math.max(val1, Math.max(val2, Math.max(val3, val4)));
						break;
					}
					
					maxes = [0,0,0,0];
					tied = [];
					if (PlacedTowersEnum.ONE === maxTowers) {
						maxes[0] = 1;
					}
					if (PlacedTowersEnum.TWO === maxTowers) {
						maxes[1] = 1;
					}
					if (PlacedTowersEnum.THREE === maxTowers) {
						maxes[2] = 1;
					}
					if (PlacedTowersEnum.FOUR === maxTowers) {
						maxes[3] = 1;
					}
					for (var i = 0; i < 4; i++) {
						if (maxes[i] === 1) {
							tied.push(i+1);
						}
					}

					console.log("(towers) Maxes: " + maxes);
					console.log("(towers) Tied: " + tied);

					if (tied.length > 1) {
						// Who of tied has max huts
						switch (tied.length) {
						case 2:
							var val1, val2;
							for (var i = 0; i < tied.length; i++) {
								if (i === 0) {
									switch(tied[i]) {
									case 1:
										val1 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val1 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val1 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val1 = PlacedHutsEnum.FOUR;
										break;
									}
								} else {
									switch(tied[i]) {
									case 1:
										val2 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val2 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val2 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val2 = PlacedHutsEnum.FOUR;
										break;
									}
								}
							}
							maxHuts = Math.max(val1, val2);
							break;
						case 3:
							var val1, val2, val3;
							for (var i = 0; i < tied.length; i++) {
								if (i === 0) {
									switch(tied[i]) {
									case 1:
										val1 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val1 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val1 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val1 = PlacedHutsEnum.FOUR;
										break;
									}
								} else if (i === 1) {
									switch(tied[i]) {
									case 1:
										val2 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val2 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val2 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val2 = PlacedHutsEnum.FOUR;
										break;
									}
								} else {
									switch(tied[i]) {
									case 1:
										val3 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val3 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val3 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val3 = PlacedHutsEnum.FOUR;
										break;
									}
								}
							}
							maxHuts = Math.max(val1, Math.max(val2, val3));
							break;
						case 4:
							var val1, val2, val3, val4;
							for (var i = 0; i < tied.length; i++) {
								if (i === 0) {
									switch(tied[i]) {
									case 1:
										val1 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val1 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val1 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val1 = PlacedHutsEnum.FOUR;
										break;
									}
								} else if (i === 1) {
									switch(tied[i]) {
									case 1:
										val2 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val2 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val2 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val2 = PlacedHutsEnum.FOUR;
										break;
									}
								} else if (i === 2) {
									switch(tied[i]) {
									case 1:
										val3 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val3 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val3 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val3 = PlacedHutsEnum.FOUR;
										break;
									}
								} else {
									switch(tied[i]) {
									case 1:
										val4 = PlacedHutsEnum.ONE;
										break;
									case 2:
										val4 = PlacedHutsEnum.TWO;
										break;
									case 3:
										val4 = PlacedHutsEnum.THREE;
										break;
									case 4:
										val4 = PlacedHutsEnum.FOUR;
										break;
									}
								}
							}
							maxHuts = Math.max(val1, Math.max(val2, Math.max(val3, val4)));
							break;
						}

						maxes = [0,0,0,0];
						tied = [];
						if (PlacedHutsEnum.ONE === maxHuts) {
							maxes[0] = 1;
						}
						if (PlacedHutsEnum.TWO === maxHuts) {
							maxes[1] = 1;
						}
						if (PlacedHutsEnum.THREE === maxHuts) {
							maxes[2] = 1;
						}
						if (PlacedHutsEnum.FOUR === maxHuts) {
							maxes[3] = 1;
						}
						for (var i = 0; i < 4; i++) {
							if (maxes[i] === 1) {
								tied.push(i+1);
							}
						}
						
						console.log("(huts) Maxes: " + maxes);
						console.log("(huts) Tied: " + tied);

						// One player of tied max temples and towers with max huts
						if (tied.length === 1) {
							mostPlayer = maxes.indexOf(1) + 1;
						}

					// One player of tied max temples with max towers
					} else {
						mostPlayer = maxes.indexOf(1) + 1;
					}

				// One player with max temples
				} else {
					mostPlayer = maxes.indexOf(1) + 1;
				}

				if (mostPlayer > 0) {
					drawPlayerWin(mostPlayer);
					alert("Player " + mostPlayer + " Wins! They built the most buildings. All hail!");
				} else {
					drawPlayersWin(tied);
					var alertString = "Players ";
					for (var i = 0; i < tied.length - 1; i++) {
						if (i === tied.length - 2) {
							alertString += (tied[i] + " ");
						} else {
							alertString += (tied[i] + ", ");
						}
					}
					alertString += ("and " + tied[tied.length-1] + " Win!! \nThey all built equal buildings. Woah, chyah my fellow legions!");
					alert(alertString);
				}
			}
			return;
		}
		drawPlayerTurn(currPlayer);
		drawTileCounter();
		firstDraw = false;

        // Draw the tri-hexagon tile deck
        drawDeck(DECK_X, DECK_Y, SIZE);

		// Draw the hut, temple & tower deck if buildingTime
		if (buildingTime || holdingHut || holdingTemple || holdingTower) {
			drawHutsTemplesAndTowers();
			if (hutsLeft() && buildingTime) {
				drawExpandButton();
			}
		}
		if (placedAtLeastOneBuilding) {
			drawDoneButton();
		}

		// Draw the held tile if held
        if (holdingTile) {
			if (tileAngle !== 0) {
				context.save();
				// do canvas rotations
				context.setTransform(1,0,0,1,0,0);
				context.translate(mouseX, mouseY);
				context.rotate(tileAngle);
				drawHeldTile(0, 0, SIZE, tileAngle);
				context.restore();
			} else {
				drawHeldTile(mouseX, mouseY, SIZE, tileAngle);
			}
        }	
        // Draw the held buildings if either held
        else if (holdingHut) {
			context.drawImage(hutImage, mouseX-32, mouseY-32);
        } else if (holdingTower) {
        	context.drawImage(towerImage, mouseX-32, mouseY-32);
        } else if (holdingTemple) {
        	context.drawImage(templeImage, mouseX-32, mouseY-32);
        }
	}

	function drawBackground() {
        if (firstDraw) {
        	context.shadowOffsetX=6;
			context.shadowOffsetY=6;
			context.shadowColor='black';
			context.shadowBlur=20;
        } else {
        	context.shadowOffsetX=0;
			context.shadowOffsetY=0;
        }
        context.fillStyle = 'rgb(37, 80, 110)';
		context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
	}

	function drawSidePanel() {
        context.shadowOffsetX=6;
		context.shadowOffsetY=6;
		context.shadowColor='black';
		context.shadowBlur=20;
       
        context.fillStyle = 'rgb(200, 175, 150)';
		context.fillRect(0, 0, PANEL_WIDTH, BOARD_HEIGHT);
	}

	function drawTitle() {
		context.shadowOffsetX=6;
		context.shadowOffsetY=6;
		context.shadowColor='rgb(75, 25, 25)';
		context.shadowBlur=20;
		context.fillStyle = 'brown';

		context.font = '25px sans-serif';
		context.textBaseline = 'top';
		if (gameOver) {
			context.fillText ("It's (no longer)", TITLE_X + (WIDTH/2), TITLE_Y - (2*SIZE/3));
		} else {
			context.fillText ("It's", TITLE_X + WIDTH + 20, TITLE_Y - (2*SIZE/3));
		}
		context.font = '65px sans-serif';
		context.fillText ("TALUVA", TITLE_X, TITLE_Y);
		context.font = '25px sans-serif';
		context.fillText ("Time", TITLE_X + WIDTH + 7, TITLE_Y + (3*SIZE/2));
	}

	function drawPlayerNumPrompt() {
		context.shadowOffsetX=2;
		context.shadowOffsetY=2;
		context.shadowColor='gray';
		context.shadowBlur=5;
		context.fillStyle = 'black';

		// "How many players?"
		context.font = '25px sans-serif';
		context.textBaseline = 'top';
		context.fillText ("How Many Players?", 22, DECK_Y/6);

		// 1 2 3 4 Buttons
		context.fillStyle = 'rgb(150, 125, 90)';
		context.lineWidth=1;
		context.fillRect(PANEL_WIDTH/9, DECK_Y/2.5, WIDTH/3, SIZE);
		context.fillRect(PANEL_WIDTH/3, DECK_Y/2.5, WIDTH/3, SIZE);
		context.fillRect(5*PANEL_WIDTH/9, DECK_Y/2.5, WIDTH/3, SIZE);
		context.fillRect(7*PANEL_WIDTH/9, DECK_Y/2.5, WIDTH/3, SIZE);

		context.shadowOffsetX=0;
		context.shadowOffsetY=0;
		context.font = '33px sans-serif';
		context.fillStyle = 'black';
		context.fillText(" 1    2    3    4 ", PANEL_WIDTH/9, DECK_Y/2.4);
	}

	function drawPlayerTurn(player) {
		context.shadowOffsetX=2;
		context.shadowOffsetY=2;
		context.shadowColor='gray';
		context.shadowBlur=5;
		
		switch(player) {
		case PlayerEnum.ONE:
			context.fillStyle = 'red';
			break;
		case PlayerEnum.TWO:
			context.fillStyle = 'yellow';
			break;
		case PlayerEnum.THREE:
			context.fillStyle = 'green';
			break;
		case PlayerEnum.FOUR:
			context.fillStyle = 'blue';
			break;
		default:
			context.fillStyle = '#000000';
		}

		context.font = '30px sans-serif';
		context.textBaseline = 'top';
		context.fillText ("Player " + player + "\'s Turn", 35, DECK_Y/6);
	}

	function drawPlayerWin(player) {
		context.shadowOffsetX=2;
		context.shadowOffsetY=2;
		context.shadowColor='gray';
		context.shadowBlur=5;
		
		switch(player) {
		case PlayerEnum.ONE:
			context.fillStyle = 'red';
			break;
		case PlayerEnum.TWO:
			context.fillStyle = 'yellow';
			break;
		case PlayerEnum.THREE:
			context.fillStyle = 'green';
			break;
		case PlayerEnum.FOUR:
			context.fillStyle = 'blue';
			break;
		default:
			context.fillStyle = '#000000';
		}

		context.font = '30px sans-serif';
		context.textBaseline = 'top';
		context.fillText ("Player " + player + " Wins!!", 34, DECK_Y/6);
	}

	function drawPlayersWin(tied) {
		context.shadowOffsetX=2;
		context.shadowOffsetY=2;
		context.shadowColor='gray';
		context.shadowBlur=5;
		
		console.log("tied.length: " + tied.length);
		var playerString = "";
		for (var i = 0; i < (tied.length - 1); i++) {
			if (i === tied.length - 2) {
				playerString += (tied[i] + " ");
				console.log("Playerstring at tied[0]: " + tied[i]);
			} else {
				playerString += (tied[i] + ", ");
			}
		}
		playerString += ("and " + tied[tied.length-1]);
		console.log("Playerstring at tied[1]: " + tied[i]);

		context.fillStyle = '#FFFFFF';
		context.font = '30px sans-serif';
		context.textBaseline = 'top';
		context.fillText ("Players " + playerString + " Win!!", 35, DECK_Y/6);
	}

	function drawTileCounter() {
		context.shadowOffsetX=2;
		context.shadowOffsetY=2;
		context.shadowColor='gray';
		context.shadowBlur=5;

		context.fillStyle = '#000000';
		context.font = '25px sans-serif';
		context.textBaseline = 'top';
		//remainingTiles = TILE_NUM - terrDistIndex;
		context.fillText ("remaining: " + remainingTiles, 58, DECK_Y/2.5);
	}

	function drawHutsTemplesAndTowers() {
		context.shadowOffsetX=7;
		context.shadowOffsetY=7;
		context.shadowColor='black';
		context.shadowBlur=50;
		
		context.font = '25px sans-serif';
		context.textBaseline = 'top';
		switch(currPlayer) {
		case PlayerEnum.ONE:
			context.fillStyle = 'red';
			context.fillText (RemainingHutsEnum.ONE, HUT_X + 16, HTT_Y - 30);
			context.fillText (RemainingTemplesEnum.ONE, TEMPLE_X + 24, HTT_Y - 30);
			context.fillText (RemainingTowersEnum.ONE, TOWER_X + 24, HTT_Y - 30);
			break;
		case PlayerEnum.TWO:
			context.fillStyle = 'yellow';
			context.fillText (RemainingHutsEnum.TWO, HUT_X + 16, HTT_Y - 30);
			context.fillText (RemainingTemplesEnum.TWO, TEMPLE_X + 24, HTT_Y - 30);
			context.fillText (RemainingTowersEnum.TWO, TOWER_X + 24, HTT_Y - 30);
			break;
		case PlayerEnum.THREE:
			context.fillStyle = 'green';
			context.fillText (RemainingHutsEnum.THREE, HUT_X + 16, HTT_Y - 30);
			context.fillText (RemainingTemplesEnum.THREE, TEMPLE_X + 24, HTT_Y - 30);
			context.fillText (RemainingTowersEnum.THREE, TOWER_X + 24, HTT_Y - 30);
			break;
		case PlayerEnum.FOUR:
			context.fillStyle = 'blue';
			context.fillText (RemainingHutsEnum.FOUR, HUT_X + 16, HTT_Y - 30);
			context.fillText (RemainingTemplesEnum.FOUR, TEMPLE_X + 24, HTT_Y - 30);
			context.fillText (RemainingTowersEnum.FOUR, TOWER_X + 24, HTT_Y - 30);
			break;
		default:
		}
		context.drawImage(hutImage, HUT_X, HTT_Y);
		context.drawImage(templeImage, TEMPLE_X, HTT_Y);
		context.drawImage(towerImage, TOWER_X, HTT_Y);

		context.fillStyle = 'black';
		context.fillText("build something", HUT_X+20, HTT_Y+90);
		if (buildingTime && hutsLeft())
			context.fillText("or", HUT_X+95, HTT_Y+115);
	}

	function drawDoneButton() {		
		context.shadowOffsetX=6;
		context.shadowOffsetY=6;
		context.shadowColor='black';
		context.shadowBlur=20;

		context.fillStyle = 'rgb(150, 125, 90)';
		context.lineWidth=1;
		context.fillRect(DONE_BTN_X, DONE_BTN_Y, 2*WIDTH, SIZE);

		context.shadowOffsetX=0;
		context.shadowOffsetY=0;
		context.font = '25px sans-serif';
		context.fillStyle = 'black';
		context.fillText("FINISH TURN", DONE_BTN_X+10, DONE_BTN_Y+15);
	}

	function drawExpandButton() {
		context.shadowOffsetX=6;
		context.shadowOffsetY=6;
		context.shadowColor='black';
		context.shadowBlur=20;

		context.fillStyle = 'rgb(150, 125, 90)';
		context.lineWidth=1;
		context.fillRect(EXPAND_BTN_X, EXPAND_BTN_Y, 2*WIDTH, SIZE);

		context.shadowOffsetX=0;
		context.shadowOffsetY=0;
		context.font = '20px sans-serif';
		switch(currPlayer) {
		case PlayerEnum.ONE:
			context.fillStyle = 'red';
			break;
		case PlayerEnum.TWO:
			context.fillStyle = 'yellow';
			break;
		case PlayerEnum.THREE:
			context.fillStyle = 'green';
			break;
		case PlayerEnum.FOUR:
			context.fillStyle = 'blue';
			break;
		default:
			context.fillStyle = 'black';
		}
		context.fillText("EXPAND", EXPAND_BTN_X+45, EXPAND_BTN_Y+5);
		context.fillText("SETTLEMENT", EXPAND_BTN_X+20, EXPAND_BTN_Y+27);
	}

	function drawHeldTile(centerX, centerY, SIZE, angle) {
		// draw top
		drawHexagon(centerX, centerY - SIZE,  
			terrainDist[terrDistIndex-1][0], false, angle, true, 0, 0, 0, 0);

		// draw bottom left
		drawHexagon(centerX - (WIDTH / 2), centerY + (SIZE / 2),   
			terrainDist[terrDistIndex-1][1], false, angle, true, 0, 0, 0, 0);

		// draw bottom right
		drawHexagon(centerX + (WIDTH / 2), centerY + (SIZE / 2),   
			terrainDist[terrDistIndex-1][2], false, angle, true, 0, 0, 0, 0);
	}

	function drawDeck(centerX, centerY, SIZE) {
		if (terrDistIndex === TILE_NUM)
			return;

		// draw top
		drawHexagon(centerX, centerY - SIZE,  
			terrainDist[terrDistIndex][0], false, 0, false, 0, 0, 0, 0);

		// draw bottom left
		drawHexagon(centerX - (WIDTH / 2), centerY + (SIZE / 2),   
			terrainDist[terrDistIndex][1], false, 0, false, 0, 0, 0, 0);

		// draw bottom right
		drawHexagon(centerX + (WIDTH / 2), centerY + (SIZE / 2),   
			terrainDist[terrDistIndex][2], false, 0, false, 0, 0, 0, 0);
	}

	//function drawBoardTiles(boardHexagons) {
	function translateAndDrawHexState(row,col,level,type,rotation,player,huts,towers,temples) {
		// boardHexagons is an array of HexState
		// x and y are centers of hex's
		// corripsonds HexState row and col to appropriate x and y
		var hexX;
		var hexY = (1.5*SIZE*row) + SIZE;
		//console.log("row: " + row, " col: " + col);

		var offset = Math.floor(row/2);
		if (row % 2 === 0) {
			hexX = WIDTH*(col+offset) + (3.5*WIDTH);
		} else {
			hexX = WIDTH*(col+offset) + (4*WIDTH);
		}
		drawHexagon(hexX,hexY,type, true, rotation, false, level, huts, towers, temples, player);
	}

	// Draw hexagon function
	//function drawHexagon(centerX, centerY, SIZE, type, context, isPlaced, angle, isHeld, level) {
	function drawHexagon(centerX, centerY, type, isPlaced, angle, isHeld, 
		level, huts, towers, temples, player) {

		var x = centerX;	
		var y = centerY - SIZE;
		var startY = y;

		if (isPlaced) {
			context.shadowOffsetX=0;
			context.shadowOffsetY=0;
		} else {
			context.shadowOffsetX=7;
			context.shadowOffsetY=7;
			context.shadowColor='black';
			context.shadowBlur=50;
		}

		if (isHeld && heldOverPlaced) {
			context.globalAlpha = 0.5;
		}

		context.beginPath();
		switch (type) {
			case SubtileTypeEnum.VOLCANO:
				context.fillStyle = VOLCANOCOLOR;
				break;
			case SubtileTypeEnum.JUNGLE:
				context.fillStyle = JUNGLECOLOR;
				break;
			case SubtileTypeEnum.GRASS:
				context.fillStyle = GRASSCOLOR;
				break;
			case SubtileTypeEnum.DESERT:
				context.fillStyle = DESERTCOLOR;
				break;
			case SubtileTypeEnum.QUARRY:
				context.fillStyle = QUARRYCOLOR;
				break;
			case SubtileTypeEnum.LAGOON:
				context.fillStyle = LAGOONCOLOR;
				break;
			default:
				context.fillStyle = "rgb(37, 90, 100)";
		}
		if (isHeld) {
			context.strokeStyle = "rgb(200,255,255)"; 
			context.lineWidth=10;
		} else {
			context.strokeStyle = "white"; 
			context.lineWidth=2;
		}
		context.moveTo(x, y);

		// i = 1
		x -= WIDTH / 2;
		y += SIZE / 2;
		context.lineTo(x, y);

		// i = 2
		y += SIZE;
		context.lineTo(x, y);

		// i = 3
		x += WIDTH / 2;
		y += SIZE / 2;
		context.lineTo(x, y);

		// i = 4
		x += WIDTH / 2;
		y -= SIZE / 2;
		context.lineTo(x, y);

		// i = 5
		y -= SIZE;
		context.lineTo(x, y);

		// i = 6
		x -= WIDTH / 2;
		y -= SIZE / 2;
		context.lineTo(x, y);

		context.closePath();
		context.fill();

		context.shadowOffsetX=0;
		context.shadowOffsetY=0;
		context.shadowBlur=0;
		context.stroke();

		if (type === SubtileTypeEnum.VOLCANO) {
			if (angle !== 0 && isPlaced) {
				context.save();
				context.setTransform(1,0,0,1,0,0);
				context.translate(centerX, centerY)
				context.rotate(angle)
				x = 0;
				y = 0;
			} else {
				x = centerX;
				y = centerY;
			}
			// draw arrow of lava flow
			context.beginPath();
			context.strokeStyle = "rgba(0,0,0,0.5)"; 
			context.lineWidth=5;
			//moved^
			//x = centerX;
			//y = centerY;
			context.moveTo(x, y);
			x += WIDTH / 8;
			y += SIZE*3 / 8;
			context.lineTo(x, y);
			context.closePath();
			context.stroke();

			// Draw arrow tip
			context.beginPath();
			context.strokeStyle = "black"; 
			context.fillStyle = "black";
			context.lineWidth=1;
			if (angle !== 0 && isPlaced) {
				x = 0 + (WIDTH / 6);
				y = 0 + (SIZE*3 / 6);
			} else {
				x = centerX + (WIDTH / 6);
				y = centerY + (SIZE*3 / 6);
			}
			context.moveTo(x,y);
			y -= (SIZE/2) - (SIZE/6);
			context.lineTo(x,y);
			x -= WIDTH / 6;
			y += (SIZE/6);
			context.lineTo(x,y);
			context.closePath();
			context.fill();
			context.stroke();
			if (angle !== 0 && isPlaced) {
				context.restore();	
			}
		}
		context.fillStyle = '#000000';
		context.font = '25px sans-serif';
		context.textBaseline = 'top';
		if (level > 0) {
			context.font = '25px sans-serif';
			context.fillText ("L" + level, centerX-(WIDTH/7), centerY-(SIZE/1.2));	
		}
		if (huts > 0) {
			context.font = '20px sans-serif';
			switch(player) {
			case PlayerEnum.ONE:
				context.fillStyle = 'red';
				break;
			case PlayerEnum.TWO:
				context.fillStyle = 'yellow';
				break;
			case PlayerEnum.THREE:
				context.fillStyle = 'green';
				break;
			case PlayerEnum.FOUR:
				context.fillStyle = 'blue';
				break;
			default:
				context.fillStyle = 'black';
			}
			context.fillText ("Hu: " + huts, centerX-(WIDTH/4), centerY-(SIZE/3));
		}
		if (towers > 0) {
			context.font = '20px sans-serif';
			switch(player) {
			case PlayerEnum.ONE:
				context.fillStyle = 'red';
				break;
			case PlayerEnum.TWO:
				context.fillStyle = 'yellow';
				break;
			case PlayerEnum.THREE:
				context.fillStyle = 'green';
				break;
			case PlayerEnum.FOUR:
				context.fillStyle = 'blue';
				break;
			default:
				context.fillStyle = 'black';
			}
			context.fillText ("Tow: " + towers, centerX-(WIDTH/3), centerY);
		}
		if (temples > 0) {
			context.font = '20px sans-serif';
			switch(player) {
			case PlayerEnum.ONE:
				context.fillStyle = 'red';
				break;
			case PlayerEnum.TWO:
				context.fillStyle = 'yellow';
				break;
			case PlayerEnum.THREE:
				context.fillStyle = 'green';
				break;
			case PlayerEnum.FOUR:
				context.fillStyle = 'blue';
				break;
			default:
				context.fillStyle = 'black';
			}
			context.fillText ("Tem: " + temples, centerX-(WIDTH/3), centerY+(SIZE/3));
		}

		context.globalAlpha = 1.0; 
	}

	function getRandomInt(max) {
  		return Math.floor(Math.random() * Math.floor(max));
	}

	//Uses Durstenfeld shuffle algorithm
	function shuffleArray(array) {
    	for (let i = array.length - 1; i > 0; i--) {
        	let j = Math.floor(Math.random() * (i + 1));
        	[array[i], array[j]] = [array[j], array[i]];
    	}
	}

	function onMouseMove(e) {
		mouseX = e.clientX-50;
		mouseY = e.clientY-50;
		// Check for holdingTile over placed tile
		heldOverPlaced = false;
		if (holdingTile && (PANEL_WIDTH+WIDTH) < mouseX && mouseX < (BOARD_WIDTH-WIDTH) && 
			(3*SIZE/2) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/2))) {
			var topTileRow = getTopRow(mouseX, mouseY);
			var leftTileCol = getLeftmostCol(mouseX, mouseY, topTileRow);
			if (tileFlipped && boardState[topTileRow][leftTileCol+Math.floor((ROWS-1)/2)] !== null ||
				boardState[topTileRow][leftTileCol+1+Math.floor((ROWS-1)/2)] !== null ||
				boardState[topTileRow+1][leftTileCol+Math.floor((ROWS-1)/2)] !== null) {
	
				heldOverPlaced = true;
			} else if (!tileFlipped && boardState[topTileRow][leftTileCol+1+Math.floor((ROWS-1)/2)] !== null ||
				boardState[topTileRow+1][leftTileCol+Math.floor((ROWS-1)/2)] !== null ||
				boardState[topTileRow+1][leftTileCol+1+Math.floor((ROWS-1)/2)] !== null) {
				
				heldOverPlaced = true;
			}
		}
		if (holdingTile || holdingHut || holdingTower || holdingTemple) {
			drawScreen();
		}
	}

	function onMouseClick(e) {
		// Choosing number of players: 1
		if (choosingPlayerNum && PANEL_WIDTH/9 < mouseX && mouseX < ((PANEL_WIDTH/9) + (WIDTH/3)) &&
			DECK_Y/2.5 < mouseY && mouseY < (DECK_Y/2.5 + SIZE)) {
			// STATE CHANGE
			choosingPlayerNum = false;
			
			console.log("Clicked P1");
			alert("Psyche! Starting a 2 player Taluva game... (1 player functionality is yet to be implemented)");
			players = new Array(2);
			for (var i = 0; i < 2; i++) {
				players[i] = 1;
			}
			// STATE CHANGE
			idling = true;
			drawScreen();
		}
		// Choosing number of players: 2
		else if (choosingPlayerNum && PANEL_WIDTH/3 < mouseX && mouseX < ((PANEL_WIDTH/3) + (WIDTH/3)) &&
			DECK_Y/2.5 < mouseY && mouseY < (DECK_Y/2.5 + SIZE)) {
			// STATE CHANGE
			choosingPlayerNum = false;
			
			console.log("Clicked P2");
			players = new Array(2);
			for (var i = 0; i < 2; i++) {
				players[i] = 1;
			}
			// STATE CHANGE
			idling = true;
			drawScreen();
		}
		// Choosing number of players: 3
		else if (choosingPlayerNum && (5*PANEL_WIDTH/9) < mouseX && mouseX < ((5*PANEL_WIDTH/9) + (WIDTH/3)) &&
			DECK_Y/2.5 < mouseY && mouseY < (DECK_Y/2.5 + SIZE)) {
			// STATE CHANGE
			choosingPlayerNum = false;
			
			console.log("Clicked P3");
			players = new Array(3);
			for (var i = 0; i < 3; i++) {
				players[i] = 1;
			}
			// STATE CHANGE
			idling = true;
			drawScreen();
		}
		// Choosing number of players: 4
		else if (choosingPlayerNum && (7*PANEL_WIDTH/9) < mouseX && mouseX < ((7*PANEL_WIDTH/9) + (WIDTH/3)) &&
			DECK_Y/2.5 < mouseY && mouseY < (DECK_Y/2.5 + SIZE)) {
			// STATE CHANGE
			choosingPlayerNum = false;
			
			console.log("Clicked P4");
			players = new Array(4);
			for (var i = 0; i < 4; i++) {
				players[i] = 1;
			}
			// STATE CHANGE
			idling = true;
			drawScreen();
		}
		// If mouse is over draw deck
		else if (idling && (DECK_X-WIDTH) < mouseX && mouseX < (DECK_X+WIDTH) && 
			DECK_Y-(2*SIZE) < mouseY && mouseY < DECK_Y+(1.5*SIZE)) {
			console.log("Clicked on deck");
			// STATE CHANGE
			idling = false;
			
			terrDistIndex++;
			remainingTiles = TILE_NUM - terrDistIndex;

			// STATE CHANGE
			holdingTile = true;
			console.log("Holding tile: " + holdingTile);
			
			drawScreen();
		// Else if mouse is over board && holdingTile	
		} else if (holdingTile && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
			(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
			// STATE CHANGE
			holdingTile = false;

			// Draw a new tile at appropriate coordinates
			var tileRow = getTopRow(mouseX, mouseY);
			var tileCol = getLeftmostCol(mouseX, mouseY, tileRow);
			console.log("top tile row clicked: " + tileRow + ", leftmost tile col clicked: " + tileCol);
			if (tileFlipped) {
				var bottomIndex, leftIndex, rightIndex;
				console.log("tile angle: " + tileAngle);
				// Change to access terrainDist Array
				if (tileAngle < 100 * (Math.PI/180)) { // 60
					bottomIndex = 2;
					leftIndex = 1;
					rightIndex = 0;
				} else if (tileAngle < 200 * (Math.PI/180)) { // 180
					bottomIndex = 0;
					leftIndex = 2;
					rightIndex = 1;
				} else { // 300
					bottomIndex = 1;
					leftIndex = 0;
					rightIndex = 2;
				}
				var newCenterHex = new HexState(tileRow+1, tileCol, 1, terrainDist[terrDistIndex-1][bottomIndex], tileAngle, currPlayer, 0, 0, 0, false);
				console.log("to add boardState[" + (tileRow+1) + "][" + (tileCol+Math.floor((ROWS-1)/2)) + "] = " + newCenterHex);
				
				var newLeftHex = new HexState(tileRow, tileCol, 1, terrainDist[terrDistIndex-1][leftIndex], tileAngle, currPlayer, 0, 0, 0, false);
				console.log("to add boardState[" + tileRow + "][" + (tileCol+Math.floor((ROWS-1)/2)) + "] = " + newLeftHex);
				
				var newRightHex = new HexState(tileRow, tileCol+1, 1, terrainDist[terrDistIndex-1][rightIndex], tileAngle, currPlayer, 0, 0, 0, false);
				console.log("to add boardState[" + tileRow + "][" + (tileCol+1+Math.floor((ROWS-1)/2)) + "] = " + newRightHex);
				
			} else {
				var topIndex, leftIndex, rightIndex;
				console.log("tile angle: " + tileAngle);
				if (tileAngle < 100 * (Math.PI/180)) { // 0
					topIndex = 0;
					leftIndex = 1;
					rightIndex = 2;
				} else if (tileAngle < 200 * (Math.PI/180)) { // 120
					topIndex = 1;
					leftIndex = 2;
					rightIndex = 0;
				} else { // 240
					topIndex = 2;
					leftIndex = 0;
					rightIndex = 1;
				}
				var newCenterHex = new HexState(tileRow, tileCol+1, 1, terrainDist[terrDistIndex-1][topIndex], tileAngle, currPlayer, 0, 0, 0, false);
				console.log("to add boardState[" + tileRow + "][" + (tileCol+1+Math.floor((ROWS-1)/2)) + "] = " + newCenterHex);

				var newLeftHex = new HexState(tileRow+1, tileCol, 1, terrainDist[terrDistIndex-1][leftIndex], tileAngle, currPlayer, 0, 0, 0, false);
				console.log("to add boardState[" + (tileRow+1) + "][" + (tileCol+Math.floor((ROWS-1)/2)) + "] = " + newLeftHex);
				
				var newRightHex = new HexState(tileRow+1, tileCol+1, 1, terrainDist[terrDistIndex-1][rightIndex], tileAngle, currPlayer, 0, 0, 0, false);
				console.log("to add boardState[" + (tileRow+1) + "][" + (tileCol+1+Math.floor((ROWS-1)/2)) + "] = " + newRightHex);
			}

			if (isTileValid(tileRow, tileCol, newCenterHex, newLeftHex, newRightHex, boardState)) {
				drawableBoardHexagons.push(newCenterHex, newLeftHex, newRightHex);
				if (tileFlipped) {
					// Add boardstate offsets
					boardState[tileRow+1][tileCol+Math.floor((ROWS-1)/2)] = newCenterHex;
					boardState[tileRow][tileCol+Math.floor((ROWS-1)/2)] = newLeftHex;
					boardState[tileRow][tileCol+1+Math.floor((ROWS-1)/2)] = newRightHex;
					tileFlipped = false;
				} else {
					boardState[tileRow][tileCol+1+Math.floor((ROWS-1)/2)] = newCenterHex;
					boardState[tileRow+1][tileCol+Math.floor((ROWS-1)/2)] = newLeftHex;
					boardState[tileRow+1][tileCol+1+Math.floor((ROWS-1)/2)] = newRightHex;
				}
				// STATE CHANGE
				buildingTime = true;
				heldOverPlaced = false;
	
				// Player elimination if no building options left
				if (remainingTiles < (TILE_NUM-1) && noBuildingOptionsLeft()) {
					// Eliminate player
					switch(currPlayer) {
					case PlayerEnum.ONE:
						playerIndex = 0;
						break;
					case PlayerEnum.TWO:
						playerIndex = 1;
						break;
					case PlayerEnum.THREE:
						playerIndex = 2;
						break;
					case PlayerEnum.FOUR:
						playerIndex = 3;
						break;
					}
					players[playerIndex] = 0;
					
					// For elimination
					var playerCount= 0;
					for (var i = 0; i < players.length; i++) {
						if (players[i] === 1) {
							playerCount++;
							lastPlayerAlive = i + 1;
						}
					}
					if (playerCount === 1) {
						onePlayerLeft = true;
						gameOver = true;
					}
				}

				//drawScreen();
				/*if (tileAngle !== 0) {
					tileAngle = 0;
				}*/
			} else {
				console.log("ILLEGAL PLACEMENT");
				if (tileFlipped) { tileFlipped = false; }
				// STATE CHANGE
				idling = true;
				// Put tile back in deck
				terrDistIndex--;
				remainingTiles = TILE_NUM - terrDistIndex;
				//drawScreen();
			}
			drawScreen();
			if (tileAngle !== 0) {
				tileAngle = 0;
			}
		// Clicked on huts
		} else if (buildingTime && HUT_X < mouseX && mouseX < (HUT_X+64)
			&& HTT_Y < mouseY && mouseY < (HTT_Y+64)) {
			// STATE CHANGE - new
			buildingTime = false;

			switch(currPlayer) {
			case PlayerEnum.ONE:
				if (RemainingHutsEnum.ONE == 0) {
					holdingHut = false;
				} else {
					RemainingHutsEnum.ONE--;
				}
				break;
			case PlayerEnum.TWO:
				if (RemainingHutsEnum.TWO == 0) {
					holdingHut = false;
				} else {
					RemainingHutsEnum.TWO--;
				}
				break;
			case PlayerEnum.THREE:
				if (RemainingHutsEnum.THREE == 0) {
					holdingHut = false;
				} else {
					RemainingHutsEnum.THREE--;
				}
				break;
			case PlayerEnum.FOUR:
				if (RemainingHutsEnum.FOUR == 0) {
					holdingHut = false;
				} else {
					RemainingHutsEnum.FOUR--;
				}
				break;
			}
			// STATE CHANGE
			holdingHut = true;
			drawScreen();
		// Else if mouse is over board && holding Hut
		} else if (holdingHut && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
			(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
			// STATE CHANGE
			holdingHut = false;
			
			// Draw a new hut at appropriate coordinates
			var hexRow = getHexRow(mouseX, mouseY);
			var hexCol = getHexCol(mouseX, mouseY, hexRow);
			console.log("hex row clicked: " + hexRow + ", hex col clicked: " + hexCol);
			
			var clickedHex = boardState[hexRow][hexCol + Math.floor((ROWS-1)/2)];
			//Check if valid hex at rows and cols chosen
			if (clickedHex !== null && clickedHex.type !== SubtileTypeEnum.VOLCANO && clickedHex.level === 1 &&
				(clickedHex.player === currPlayer || (clickedHex.huts === 0 && clickedHex.towers === 0 && clickedHex.temples === 0))) {
				clickedHex.huts++;
				clickedHex.player = currPlayer;

				switch(currPlayer) {
				case PlayerEnum.ONE:
					PlacedHutsEnum.ONE++;
					break;
				case PlayerEnum.TWO:
					PlacedHutsEnum.TWO++;
					break;
				case PlayerEnum.THREE:
					PlacedHutsEnum.THREE++;
					break;
				case PlayerEnum.FOUR:
					PlacedHutsEnum.FOUR++;
					break;
				}
				placedAtLeastOneBuilding = true;

				if (builtTwoOfThreeTypes()) {
					// Early Victory!
					gameOver = true;
				}
			}
			else {
				alert("You cannot build a hut on a volcano, nor on the ocean, nor on your opponent's settlements. If building a hut, you must be on level 1.");
				//holdingHut = true;
				switch(currPlayer) {
				case PlayerEnum.ONE:
					RemainingHutsEnum.ONE++;
					break;
				case PlayerEnum.TWO:
					RemainingHutsEnum.TWO++;
					break;
				case PlayerEnum.THREE:
					RemainingHutsEnum.THREE++;
					break;
				case PlayerEnum.FOUR:
					RemainingHutsEnum.FOUR++;
					break;
				}
			}
			// STATE CHANGE
			buildingTime = true;
			drawScreen();
		// Clicked on towers
		} else if (buildingTime && TOWER_X < mouseX && mouseX < (TOWER_X+64)
			&& HTT_Y < mouseY && mouseY < (HTT_Y+64)) {
			// STATE CHANGE
			buildingTime = false;

			switch(currPlayer) {
			case PlayerEnum.ONE:
				if (RemainingTowersEnum.ONE == 0) {
					holdingTower = false;
				} else {
					RemainingTowersEnum.ONE--;
				}
				break;
			case PlayerEnum.TWO:
				if (RemainingTowersEnum.TWO == 0) {
					holdingTower = false;
				} else {
					RemainingTowersEnum.TWO--;
				}
				break;
			case PlayerEnum.THREE:
				if (RemainingTowersEnum.THREE == 0) {
					holdingTower = false;
				} else {
					RemainingTowersEnum.THREE--;
				}
				break;
			case PlayerEnum.FOUR:
				if (RemainingTowersEnum.FOUR == 0) {
					holdingTower = false;
				} else {
					RemainingTowersEnum.FOUR--;
				}
				break;
			}
			// STATE CHANGE
			holdingTower = true;
			drawScreen();
		// Else if mouse is over board && holding Tower
		} else if (holdingTower && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
			(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
			// STATE CHANGE
			holdingTower = false;
			
			// Draw a new tower at appropriate coordinates
			var hexRow = getHexRow(mouseX, mouseY);
			var hexCol = getHexCol(mouseX, mouseY, hexRow);
			console.log("hex row clicked: " + hexRow + ", hex col clicked: " + hexCol);
			
			var clickedHex = boardState[hexRow][hexCol + Math.floor((ROWS-1)/2)];
			selectedSettlement = [];
			fillSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2), false);
			//Check if valid hex at rows and cols chosen
			if (clickedHex !== null && clickedHex.type !== SubtileTypeEnum.VOLCANO &&
				(clickedHex.player === currPlayer || (clickedHex.huts === 0 && clickedHex.towers === 0 && 
				clickedHex.temples === 0)) && clickedHex.level >= 3 && 
				isAdjacentToSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2)) && noTowerInSettlement()) {

				clickedHex.towers++;
				clickedHex.player = currPlayer;
				
				switch(currPlayer) {
				case PlayerEnum.ONE:
					PlacedTowersEnum.ONE++;
					break;
				case PlayerEnum.TWO:
					PlacedTowersEnum.TWO++;
					break;
				case PlayerEnum.THREE:
					PlacedTowersEnum.THREE++;
					break;
				case PlayerEnum.FOUR:
					PlacedTowersEnum.FOUR++;
					break;
				}
				placedAtLeastOneBuilding = true;

				if (builtTwoOfThreeTypes()) {
					// Early Victory!
					gameOver = true;
				}
			}
			else {
				alert("You cannot build a tower on a volcano, nor on the ocean, nor on your opponent's settlements. You also must build a tower on a level 3 space or higher, adjacent to a settlement containing no other towers.");
				//holdingTower = true;
				switch(currPlayer) {
				case PlayerEnum.ONE:
					RemainingTowersEnum.ONE++;
					break;
				case PlayerEnum.TWO:
					RemainingTowersEnum.TWO++;
					break;
				case PlayerEnum.THREE:
					RemainingTowersEnum.THREE++;
					break;
				case PlayerEnum.FOUR:
					RemainingTowersEnum.FOUR++;
					break;
				}
			}
			// STATE CHANGE
			buildingTime = true;
			drawScreen();
		// Clicked on temples
		} else if (buildingTime && TEMPLE_X < mouseX && mouseX < (TEMPLE_X+64)
			&& HTT_Y < mouseY && mouseY < (HTT_Y+64)) {
			// STATE CHANGE
			buildingTime = false;

			switch(currPlayer) {
			case PlayerEnum.ONE:
				if (RemainingTemplesEnum.ONE == 0) {
					holdingTemple = false;
				} else {
					RemainingTemplesEnum.ONE--;
				}
				break;
			case PlayerEnum.TWO:
				if (RemainingTemplesEnum.TWO == 0) {
					holdingTemple = false;
				} else {
					RemainingTemplesEnum.TWO--;
				}
				break;
			case PlayerEnum.THREE:
				if (RemainingTemplesEnum.THREE == 0) {
					holdingTemple = false;
				} else {
					RemainingTemplesEnum.THREE--;
				}
				break;
			case PlayerEnum.FOUR:
				if (RemainingTemplesEnum.FOUR == 0) {
					holdingTemple = false;
				} else {
					RemainingTemplesEnum.FOUR--;
				}
				break;
			}
			// STATE CHANGE
			holdingTemple = true;
			drawScreen();
		// Else if mouse is over board && holding Temple
		} else if (holdingTemple && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
			(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
			//STATE CHANGE
			holdingTemple = false;
			
			// Draw a new tower at appropriate coordinates
			var hexRow = getHexRow(mouseX, mouseY);
			var hexCol = getHexCol(mouseX, mouseY, hexRow);
			console.log("hex row clicked: " + hexRow + ", hex col clicked: " + hexCol);
			
			var clickedHex = boardState[hexRow][hexCol + Math.floor((ROWS-1)/2)];
			selectedSettlement = [];
			fillSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2), false);
			//Check if valid hex at rows and cols chosen
			if (clickedHex !== null && clickedHex.type !== SubtileTypeEnum.VOLCANO &&
				(clickedHex.player === currPlayer || (clickedHex.huts === 0 && clickedHex.towers === 0 && 
				clickedHex.temples === 0)) && selectedSettlement.length >= 3 && // settlement has atleast 3 fields
				isAdjacentToSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2)) && noTempleInSettlement()) {

				clickedHex.temples++;
				clickedHex.player = currPlayer;

				switch(currPlayer) {
				case PlayerEnum.ONE:
					PlacedTemplesEnum.ONE++;
					break;
				case PlayerEnum.TWO:
					PlacedTemplesEnum.TWO++;
					break;
				case PlayerEnum.THREE:
					PlacedTemplesEnum.THREE++;
					break;
				case PlayerEnum.FOUR:
					PlacedTemplesEnum.FOUR++;
					break;
				}
				placedAtLeastOneBuilding = true;

				if (builtTwoOfThreeTypes()) {
					// Early Victory!
					gameOver = true;
				}
			}
			else {
				alert("You cannot build a temple on a volcano, nor on the ocean, nor on your opponent's settlements. You also must build a temple adjacent to a settlement atleast 3 fields large, containing no other temples.");
				//holdingTemple = true;
				switch(currPlayer) {
				case PlayerEnum.ONE:
					RemainingTemplesEnum.ONE++;
					break;
				case PlayerEnum.TWO:
					RemainingTemplesEnum.TWO++;
					break;
				case PlayerEnum.THREE:
					RemainingTemplesEnum.THREE++;
					break;
				case PlayerEnum.FOUR:
					RemainingTemplesEnum.FOUR++;
					break;
				}
			}
			// STATE CHANGE
			buildingTime = true;
			drawScreen();
		// Else if mouse is over expand settlement button
		} else if (hutsLeft() && buildingTime && 
			EXPAND_BTN_X < mouseX && mouseX < (EXPAND_BTN_X + (2*WIDTH)) && 
			EXPAND_BTN_Y < mouseY && mouseY < (EXPAND_BTN_Y + SIZE)) {
			// STATE CHANGE
			buildingTime = false;

			// STATE CHANGE
			pickingSettlement = true;
			drawScreen();
		// Else if mouse is over board and choosing settlement (expanding)
		} else if (pickingSettlement && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
			(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
			// STATE CHANGE
			pickingSettlement = false;
			
			var hexRow = getHexRow(mouseX, mouseY);
			var hexCol = getHexCol(mouseX, mouseY, hexRow);
			selectedSettlement = []; // filled w/ HexState
			// Fill selectedSettlement[]
			fillSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2), true);
			if (selectedSettlement.length === 0) {
				alert("You must select a valid settlement of yours to expand upon.");
				// STATE CHANGE
				buildingTime = true;
			} else {
				// STATE CHANGE
				pickingAdjacentTerrainType = true;
			}
			console.log("Selected settlement: " + selectedSettlement);
			drawScreen();
		// Else if mouse is over board and choosing adjacent terrain (expanding)
		} else if (pickingAdjacentTerrainType && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
			(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
			// STATE CHANGE
			pickingAdjacentTerrainType = false;

			var hexRow = getHexRow(mouseX, mouseY);
			var hexCol = getHexCol(mouseX, mouseY, hexRow);
			console.log("First selected settlement row: " + selectedSettlement[0].row + " col: " + selectedSettlement[0].col);
			if (isAdjacentToSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2))) {
				// expand settlement
				expandSettlementV2(hexRow, hexCol + Math.floor((ROWS-1)/2));
				placedAtLeastOneBuilding = true;

				if (builtTwoOfThreeTypes()) {
					// Early Victory!
					gameOver = true;
				}
			} else {
				alert("You must only expand settlements on hexagons adjacent to your established settlement.");
			}

			// STATE CHANGE
			buildingTime = true;
			drawScreen();
		// Else if mouse is over DONE button
		} else if (placedAtLeastOneBuilding  && buildingTime && DONE_BTN_X < mouseX && mouseX < (DONE_BTN_X + (2*WIDTH)) && 
			DONE_BTN_Y < mouseY && mouseY < (DONE_BTN_Y + SIZE)) {
			// STATE CHANGE
			buildingTime = false;
			placedAtLeastOneBuilding = false;

			if (terrDistIndex === TILE_NUM) {
				outOfTiles = true;
				gameOver = true;
			}

			// SWITCH PLAYERS: (2-4 player game)
			do {
				playerIndex++;
				if (playerIndex === players.length) {
					playerIndex = 0;
				}
			} while (players[playerIndex] === 0);

			switch(playerIndex) {
			case 0:
				currPlayer = PlayerEnum.ONE;
				break;
			case 1:
				currPlayer = PlayerEnum.TWO;
				break;
			case 2:
				currPlayer = PlayerEnum.THREE;
				break;
			case 3:
				currPlayer = PlayerEnum.FOUR;
				break;
			}

			// STATE CHANGE
			idling = true;
			drawScreen();
		}
	}

	function hutsLeft() {
		switch(currPlayer) {
		case PlayerEnum.ONE:
			if (RemainingHutsEnum.ONE === 0) {
				return false;
			}
			break;
		case PlayerEnum.TWO:
			if (RemainingHutsEnum.TWO === 0) {
				return false;
			}
			break;
		case PlayerEnum.THREE:
			if (RemainingHutsEnum.THREE === 0) {
				return false;
			}
			break;
		case PlayerEnum.FOUR:
			if (RemainingHutsEnum.FOUR === 0) {
				return false;
			}
			break;
		}
		return true;
	}

	function noBuildingOptionsLeft() {
		// See if currPlayer has no places to build their buildings
		var numHexagons = drawableBoardHexagons.length;
		var cantBuildCounter = 0;
		
		//case: Huts
		var cantBuildHutCounter = 0;
		for (var i = 0; i < numHexagons; i++) {
			// Not level 1, or other persons settlement (not free)
			if (drawableBoardHexagons[i].level !== 1 || 
				(drawableBoardHexagons[i].player !== currPlayer && 
				(drawableBoardHexagons[i].huts > 0 || drawableBoardHexagons[i].towers > 0 ||
				drawableBoardHexagons[i].temples > 0))) {
				
				cantBuildHutCounter++;
			}
		}
		// If no huts left, automatically can't build
		switch(currPlayer) {
		case 1:
			if (RemainingHutsEnum.ONE == 0)
				cantBuildHutCounter = numHexagons;
			break;
		case 2:
			if (RemainingHutsEnum.TWO == 0)
				cantBuildHutCounter = numHexagons;
			break;
		case 3:
			if (RemainingHutsEnum.THREE == 0)
				cantBuildHutCounter = numHexagons;
			break;
		case 4:
			if (RemainingHutsEnum.FOUR == 0)
				cantBuildHutCounter = numHexagons;
			break;
		}
		if (cantBuildHutCounter === numHexagons)
			cantBuildCounter++;

		//case: Towers
		var cantBuildTowerCounter = 0;
		for (var i = 0; i < numHexagons; i++) {
			// Not level >= 3, adjacent to settlement, no towers, or other persons settlement (not free)
			if (drawableBoardHexagons[i].level < 3 || 
				!isAdjacentToOwnSettlementWithNoTowers(drawableBoardHexagons[i]) ||
				(drawableBoardHexagons[i].player !== currPlayer && 
				(drawableBoardHexagons[i].huts > 0 || drawableBoardHexagons[i].towers > 0 ||
				drawableBoardHexagons[i].temples > 0))) {
				
				cantBuildTowerCounter++;	
			}
		}
		// If has no towers, automatically can't build
		switch(currPlayer) {
		case 1:
			if (RemainingTowersEnum.ONE == 0)
				cantBuildTowerCounter = numHexagons;
			break;
		case 2:
			if (RemainingTowersEnum.TWO == 0)
				cantBuildTowerCounter = numHexagons;
			break;
		case 3:
			if (RemainingTowersEnum.THREE == 0)
				cantBuildTowerCounter = numHexagons;
			break;
		case 4:
			if (RemainingTowersEnum.FOUR == 0)
				cantBuildTowerCounter = numHexagons;
			break;
		}
		if (cantBuildTowerCounter === numHexagons)
			cantBuildCounter++;
		
		//case: Temples
		var cantBuildTempleCounter = 0;
		for (var i = 0; i < numHexagons; i++) {
			// Not adjacent to settlement of >= 3, no temples, or other persons settlement (not free)
			if (!isAdjacentToOwnThreeSizeSettlementWithNoTemples(drawableBoardHexagons[i]) ||
				(drawableBoardHexagons[i].player !== currPlayer && 
				(drawableBoardHexagons[i].huts > 0 || drawableBoardHexagons[i].towers > 0 ||
				drawableBoardHexagons[i].temples > 0))) {
				
				cantBuildTempleCounter++;	
			}
		}
		// If has no temples, automatically can't build
		switch(currPlayer) {
		case 1:
			if (RemainingTemplesEnum.ONE == 0)
				cantBuildTempleCounter = numHexagons;
			break;
		case 2:
			if (RemainingTemplesEnum.TWO == 0)
				cantBuildTempleCounter = numHexagons;
			break;
		case 3:
			if (RemainingTemplesEnum.THREE == 0)
				cantBuildTempleCounter = numHexagons;
			break;
		case 4:
			if (RemainingTemplesEnum.FOUR == 0)
				cantBuildTempleCounter = numHexagons;
			break;
		}
		if (cantBuildTempleCounter === numHexagons)
			cantBuildCounter++;

		//case: Expansion
		var cantExpandCounter = 0;
		for (var i = 0; i < numHexagons; i++) {
			// Not free space, or free space but not adjacent to own settlement OR other free spaces
			if ((drawableBoardHexagons[i].player !== currPlayer && 
				(drawableBoardHexagons[i].huts > 0 || drawableBoardHexagons[i].towers > 0 ||
				drawableBoardHexagons[i].temples > 0)) ||
				// Now assume is a free space
				!isAdjacentToOwnSettlementOrFreeSpaces(drawableBoardHexagons[i])) {
				
				cantExpandCounter++;	
			}
		}
		// If no huts left, automatically can't expand
		switch(currPlayer) {
		case 1:
			if (RemainingHutsEnum.ONE == 0)
				cantExpandCounter = numHexagons;
			break;
		case 2:
			if (RemainingHutsEnum.TWO == 0)
				cantExpandCounter = numHexagons;
			break;
		case 3:
			if (RemainingHutsEnum.THREE == 0)
				cantExpandCounter = numHexagons;
			break;
		case 4:
			if (RemainingHutsEnum.FOUR == 0)
				cantExpandCounter = numHexagons;
			break;
		}
		if (cantExpandCounter === numHexagons)
			cantBuildCounter++;
		
		if (cantBuildCounter === 4)
			return true;

		return false;
	}

	function isAdjacentToOwnSettlementWithNoTowers(hexState) {
		// Check if adjacent hex's are occupied by your builings (settlement)
		var stateRow = hexState.row;
		var stateCol = hexState.col + Math.floor((ROWS-1)/2);
		var settlementCounter = 0;
		var noTowerCounter = 0;

		try {
		if (boardState[stateRow-1][stateCol].player === currPlayer && 
			(boardState[stateRow-1][stateCol].huts > 0 || 
			boardState[stateRow-1][stateCol].towers > 0 ||
			boardState[stateRow-1][stateCol].temples > 0)) {
			
			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow-1, stateCol, false);
			if (noTowerInSettlement())
				noTowerCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow-1][stateCol+1].player === currPlayer && 
			(boardState[stateRow-1][stateCol+1].huts > 0 || 
			boardState[stateRow-1][stateCol+1].towers > 0 ||
			boardState[stateRow-1][stateCol+1].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow-1, stateCol+1, false);
			if (noTowerInSettlement())
				noTowerCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow][stateCol+1].player === currPlayer && 
			(boardState[stateRow][stateCol+1].huts > 0 || 
			boardState[stateRow][stateCol+1].towers > 0 ||
			boardState[stateRow][stateCol+1].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow1, stateCol+1, false);
			if (noTowerInSettlement())
				noTowerCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow+1][stateCol].player === currPlayer && 
			(boardState[stateRow+1][stateCol].huts > 0 || 
			boardState[stateRow+1][stateCol].towers > 0 ||
			boardState[stateRow+1][stateCol].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow+1, stateCol, false);
			if (noTowerInSettlement())
				noTowerCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow+1][stateCol-1].player === currPlayer && 
			(boardState[stateRow+1][stateCol-1].huts > 0 || 
			boardState[stateRow+1][stateCol-1].towers > 0 ||
			boardState[stateRow+1][stateCol-1].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow+1, stateCol-1, false);
			if (noTowerInSettlement())
				noTowerCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow][stateCol-1].player === currPlayer && 
			(boardState[stateRow][stateCol-1].huts > 0 || 
			boardState[stateRow][stateCol-1].towers > 0 ||
			boardState[stateRow][stateCol-1].temples > 0)) {
			
			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow, stateCol-1, false);
			if (noTowerInSettlement())
				noTowerCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		if (settlementCounter === 0 || (settlementCounter !== noTowerCounter))
			return false;
		return true;
	}

	function isAdjacentToOwnThreeSizeSettlementWithNoTemples(hexState) {
		// Check if adjacent hex's are occupied by your buildings (settlement)
		var stateRow = hexState.row;
		var stateCol = hexState.col + Math.floor((ROWS-1)/2);
		var settlementCounter = 0;
		var noTempleAndBigEnoughCounter = 0;

		try {
		if (boardState[stateRow-1][stateCol].player === currPlayer && 
			(boardState[stateRow-1][stateCol].huts > 0 || 
			boardState[stateRow-1][stateCol].towers > 0 ||
			boardState[stateRow-1][stateCol].temples > 0)) {
			
			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow-1, stateCol, false);
			if (noTempleInSettlement() && selectedSettlement.length >= 3)
				noTempleAndBigEnoughCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow-1][stateCol+1].player === currPlayer && 
			(boardState[stateRow-1][stateCol+1].huts > 0 || 
			boardState[stateRow-1][stateCol+1].towers > 0 ||
			boardState[stateRow-1][stateCol+1].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow-1, stateCol+1, false);
			if (noTempleInSettlement() && selectedSettlement.length >= 3)
				noTempleAndBigEnoughCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow][stateCol+1].player === currPlayer && 
			(boardState[stateRow][stateCol+1].huts > 0 || 
			boardState[stateRow][stateCol+1].towers > 0 ||
			boardState[stateRow][stateCol+1].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow1, stateCol+1, false);
			if (noTempleInSettlement() && selectedSettlement.length >= 3)
				noTempleAndBigEnoughCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow+1][stateCol].player === currPlayer && 
			(boardState[stateRow+1][stateCol].huts > 0 || 
			boardState[stateRow+1][stateCol].towers > 0 ||
			boardState[stateRow+1][stateCol].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow+1, stateCol, false);
			if (noTempleInSettlement() && selectedSettlement.length >= 3)
				noTempleAndBigEnoughCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow+1][stateCol-1].player === currPlayer && 
			(boardState[stateRow+1][stateCol-1].huts > 0 || 
			boardState[stateRow+1][stateCol-1].towers > 0 ||
			boardState[stateRow+1][stateCol-1].temples > 0)) {

			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow+1, stateCol-1, false);
			if (noTempleInSettlement() && selectedSettlement.length >= 3)
				noTempleAndBigEnoughCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		try {
		if (boardState[stateRow][stateCol-1].player === currPlayer && 
			(boardState[stateRow][stateCol-1].huts > 0 || 
			boardState[stateRow][stateCol-1].towers > 0 ||
			boardState[stateRow][stateCol-1].temples > 0)) {
			
			settlementCounter++;
			selectedSettlement = [];
			fillSelectedSettlement(stateRow, stateCol-1, false);
			if (noTempleInSettlement() && selectedSettlement.length >= 3)
				noTempleAndBigEnoughCounter++;
		}
		} catch (e) {
			console.log(e);
		}

		if (settlementCounter === 0 || (settlementCounter !== noTempleAndBigEnoughCounter))
			return false;
		return true;
	}

	function isAdjacentToOwnSettlementOrFreeSpaces(hexState) {
		// Check if any adjacent hex's are my settlement or a free space
		var stateRow = hexState.row;
		var stateCol = hexState.col + Math.floor((ROWS-1)/2);

		try {
		if ((boardState[stateRow-1][stateCol].player === currPlayer && 
			(boardState[stateRow-1][stateCol].huts > 0 || 
			boardState[stateRow-1][stateCol].towers > 0 ||
			boardState[stateRow-1][stateCol].temples > 0)) ||
			(boardState[stateRow-1][stateCol].huts === 0 && 
			boardState[stateRow-1][stateCol].towers === 0 &&
			boardState[stateRow-1][stateCol].temples === 0 &&
			boardState[stateRow-1][stateCol].type !== SubtileTypeEnum.VOLCANO)) {
			
			return true;
		}
		} catch(e) {
			console.log(e);
		}

		try {
		if ((boardState[stateRow-1][stateCol+1].player === currPlayer && 
			(boardState[stateRow-1][stateCol+1].huts > 0 || 
			boardState[stateRow-1][stateCol+1].towers > 0 ||
			boardState[stateRow-1][stateCol+1].temples > 0)) ||
			(boardState[stateRow-1][stateCol+1].huts === 0 && 
			boardState[stateRow-1][stateCol+1].towers === 0 &&
			boardState[stateRow-1][stateCol+1].temples === 0 &&
			boardState[stateRow-1][stateCol+1].type !== SubtileTypeEnum.VOLCANO)) {

			return true;
		}
		} catch(e) {
			console.log(e);
		}

		try {
		if ((boardState[stateRow][stateCol+1].player === currPlayer && 
			(boardState[stateRow][stateCol+1].huts > 0 || 
			boardState[stateRow][stateCol+1].towers > 0 ||
			boardState[stateRow][stateCol+1].temples > 0)) ||
			(boardState[stateRow][stateCol+1].huts === 0 && 
			boardState[stateRow][stateCol+1].towers === 0 &&
			boardState[stateRow][stateCol+1].temples === 0 &&
			boardState[stateRow][stateCol+1].type !== SubtileTypeEnum.VOLCANO)) {
			
			return true;		
		}
		} catch(e) {
			console.log(e);
		}

		try {
		if ((boardState[stateRow+1][stateCol].player === currPlayer && 
			(boardState[stateRow+1][stateCol].huts > 0 || 
			boardState[stateRow+1][stateCol].towers > 0 ||
			boardState[stateRow+1][stateCol].temples > 0)) ||
			(boardState[stateRow+1][stateCol].huts === 0 && 
			boardState[stateRow+1][stateCol].towers === 0 &&
			boardState[stateRow+1][stateCol].temples === 0 &&
			boardState[stateRow+1][stateCol].type !== SubtileTypeEnum.VOLCANO)) {
			
			return true;	
		}
		} catch(e) {
			console.log(e);
		}

		try {
		if ((boardState[stateRow+1][stateCol-1].player === currPlayer && 
			(boardState[stateRow+1][stateCol-1].huts > 0 || 
			boardState[stateRow+1][stateCol-1].towers > 0 ||
			boardState[stateRow+1][stateCol-1].temples > 0)) ||
			(boardState[stateRow+1][stateCol-1].huts === 0 && 
			boardState[stateRow+1][stateCol-1].towers === 0 &&
			boardState[stateRow+1][stateCol-1].temples === 0 &&
			boardState[stateRow+1][stateCol-1].type !== SubtileTypeEnum.VOLCANO)) {
			
			return true;		
		}
		} catch(e) {
			console.log(e);
		}
		
		try {
		if ((boardState[stateRow][stateCol-1].player === currPlayer && 
			(boardState[stateRow][stateCol-1].huts > 0 || 
			boardState[stateRow][stateCol-1].towers > 0 ||
			boardState[stateRow][stateCol-1].temples > 0)) ||
			(boardState[stateRow][stateCol-1].huts === 0 && 
			boardState[stateRow][stateCol-1].towers === 0 &&
			boardState[stateRow][stateCol-1].temples === 0 &&
			boardState[stateRow][stateCol-1].type !== SubtileTypeEnum.VOLCANO)) {

			return true;
		}
		} catch(e) {
			console.log(e);
		}
		return false;
	}

	function builtTwoOfThreeTypes() {
		switch(currPlayer) {
		case PlayerEnum.ONE:
			if ((RemainingHutsEnum.ONE === 0 && RemainingTowersEnum.ONE === 0) ||
				(RemainingTowersEnum.ONE === 0 && RemainingTemplesEnum.ONE === 0) ||
				(RemainingTemplesEnum.ONE === 0 && RemainingHutsEnum.ONE === 0)) {
					return true;
				}
			break;
		case PlayerEnum.TWO:
			if ((RemainingHutsEnum.TWO === 0 && RemainingTowersEnum.TWO === 0) ||
				(RemainingTowersEnum.TWO === 0 && RemainingTemplesEnum.TWO === 0) ||
				(RemainingTemplesEnum.TWO === 0 && RemainingHutsEnum.TWO === 0)) {
					return true;
				}
			break;
		case PlayerEnum.THREE:
			if ((RemainingHutsEnum.THREE === 0 && RemainingTowersEnum.THREE === 0) ||
				(RemainingTowersEnum.THREE === 0 && RemainingTemplesEnum.THREE === 0) ||
				(RemainingTemplesEnum.THREE === 0 && RemainingHutsEnum.THREE === 0)) {
					return true;
				}
			break;
		case PlayerEnum.FOUR:
			if ((RemainingHutsEnum.FOUR === 0 && RemainingTowersEnum.FOUR === 0) ||
				(RemainingTowersEnum.FOUR === 0 && RemainingTemplesEnum.FOUR === 0) ||
				(RemainingTemplesEnum.FOUR === 0 && RemainingHutsEnum.FOUR === 0)) {
					return true;
				}
			break;
		default:
		}
		return false;
	}

	// Record # of huts being built, and update/account for huts left also
	// Fills huts into hexagons adjacent to all settlement Hexagons
	// stateRow and stateCol are the boardState rows/cols of the clicked hex adj to settlement
	function expandSettlementV2(stateRow, stateCol) {
		var terrain = boardState[stateRow][stateCol].type;
		console.log("Terrain type to expand to: " + terrain);
		var builtHuts, rowOffset, colOffset = 0;
		for (var i = 0; i < selectedSettlement.length; i++) {
			console.log("Selected settlement hex row to check adjacencies of: " + selectedSettlement[i].row + " col: " + selectedSettlement[i].col);
			for (var j = 0; j < 6; j++) {
				switch(j) {
				case 0:
					rowOffset = -1;
					colOffset = 0 + Math.floor((ROWS-1)/2); // for boardState
					break;
				case 1:
					rowOffset = -1; 
					colOffset = 1 + Math.floor((ROWS-1)/2);
					break;
				case 2:
					rowOffset = 0;
					colOffset = 1 + Math.floor((ROWS-1)/2);
					break;
				case 3:
					rowOffset = 1; 
					colOffset = 0 + Math.floor((ROWS-1)/2);
					break;
				case 4:
					rowOffset = 1;
					colOffset = -1 + Math.floor((ROWS-1)/2);
					break;
				case 5:
					rowOffset = 0;
					colOffset = -1 + Math.floor((ROWS-1)/2);
					break;
				}
				console.log("Try expanding to hex row: " + (selectedSettlement[i].row+rowOffset) + " col: " + (selectedSettlement[i].col + colOffset - Math.floor((ROWS-1)/2)));
				if (boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset] !== null &&
					boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts === 0 &&
					boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].towers === 0 &&
					boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].temples === 0 &&
					boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].type === terrain) {

					console.log("Expanding to hex row: " + (selectedSettlement[i].row+rowOffset) + " col: " + (selectedSettlement[i].col+colOffset - Math.floor((ROWS-1)/2)));

					switch(currPlayer) {
					case PlayerEnum.ONE:
						if (RemainingHutsEnum.ONE > 0) {
							// If player has huts left to build:
							boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].player = currPlayer;
							if (RemainingHutsEnum.ONE >= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level) {
								// If player has enough huts, levels, else rest:
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								PlacedHutsEnum.ONE += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								builtHuts += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								RemainingHutsEnum.ONE -= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
							} else {
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									RemainingHutsEnum.ONE;
								PlacedHutsEnum.ONE += RemainingHutsEnum.ONE;
								builtHuts += RemainingHutsEnum.ONE;
								RemainingHutsEnum.ONE = 0;
							}
						}
						break;
					case PlayerEnum.TWO:
						if (RemainingHutsEnum.TWO > 0) {
							// If player has huts left to build:
							boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].player = currPlayer;
							if (RemainingHutsEnum.TWO >= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level) {
								// If player has enough huts, levels, else rest:
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								PlacedHutsEnum.TWO += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								builtHuts += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								RemainingHutsEnum.TWO -= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
							} else {
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									RemainingHutsEnum.TWO;
								PlacedHutsEnum.TWO += RemainingHutsEnum.TWO;
								builtHuts += RemainingHutsEnum.TWO;
								RemainingHutsEnum.TWO = 0;
							}
						}
						break;
					case PlayerEnum.THREE:
						if (RemainingHutsEnum.THREE > 0) {
							// If player has huts left to build:
							boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].player = currPlayer;
							if (RemainingHutsEnum.THREE >= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level) {
								// If player has enough huts, levels, else rest:
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								PlacedHutsEnum.THREE += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								builtHuts += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								RemainingHutsEnum.THREE -= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
							} else {
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									RemainingHutsEnum.THREE;
								PlacedHutsEnum.THREE += RemainingHutsEnum.THREE;
								builtHuts += RemainingHutsEnum.THREE;
								RemainingHutsEnum.THREE = 0;
							}
						}
						break;
					case PlayerEnum.FOUR:
						if (RemainingHutsEnum.FOUR > 0) {
							// If player has huts left to build:
							boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].player = currPlayer;
							if (RemainingHutsEnum.FOUR >= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level) {
								// If player has enough huts, levels, else rest:
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								PlacedHutsEnum.FOUR += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								builtHuts += boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
								RemainingHutsEnum.FOUR -= boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].level;
							} else {
								boardState[selectedSettlement[i].row+rowOffset][selectedSettlement[i].col+colOffset].huts = 
									RemainingHutsEnum.FOUR;
								PlacedHutsEnum.FOUR += RemainingHutsEnum.FOUR;
								builtHuts += RemainingHutsEnum.FOUR;
								RemainingHutsEnum.FOUR = 0;
							}
						}
						break;
					default:
					}
				}
			}
		}
	}

	// Fills the settlement that includes the player's chosen HexState
	function fillSelectedSettlement(stateRow, stateCol, isVisible) {
		// is boardState[stateRow-1][stateCol] part of settlement?
		try {
			if (boardState[stateRow][stateCol].player === currPlayer &&
				(boardState[stateRow][stateCol].huts > 0 ||
				boardState[stateRow][stateCol].towers > 0 ||
				boardState[stateRow][stateCol].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow][stateCol])) {
						selectedSettlement.push(boardState[stateRow][stateCol]);
					}
			}
		} catch(e) {
			console.log(e);
		}
		try {
			if (boardState[stateRow-1][stateCol].player === currPlayer &&
				(boardState[stateRow-1][stateCol].huts > 0 ||
				boardState[stateRow-1][stateCol].towers > 0 ||
				boardState[stateRow-1][stateCol].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow-1][stateCol])) {
						selectedSettlement.push(boardState[stateRow-1][stateCol]);
						fillSelectedSettlement(stateRow-1, stateCol, isVisible);
					}
			}
		} catch(e) {
			console.log(e);
		}
		try {
			if (boardState[stateRow-1][stateCol+1].player === currPlayer &&
				(boardState[stateRow-1][stateCol+1].huts > 0 ||
				boardState[stateRow-1][stateCol+1].towers > 0 ||
				boardState[stateRow-1][stateCol+1].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow-1][stateCol+1])) {
						selectedSettlement.push(boardState[stateRow-1][stateCol+1]);
						fillSelectedSettlement(stateRow-1, stateCol+1, isVisible);
					}
			}
		} catch(e) {
			console.log(e);
		}
		try {
			if (boardState[stateRow][stateCol+1].player === currPlayer &&
				(boardState[stateRow][stateCol+1].huts > 0 ||
				boardState[stateRow][stateCol+1].towers > 0 ||
				boardState[stateRow][stateCol+1].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow][stateCol+1])) {
						selectedSettlement.push(boardState[stateRow][stateCol+1]);
						fillSelectedSettlement(stateRow, stateCol+1, isVisible);
					}
			} 
		} catch(e) {
			console.log(e);
		}
		try {
			if (boardState[stateRow+1][stateCol].player === currPlayer &&
				(boardState[stateRow+1][stateCol].huts > 0 ||
				boardState[stateRow+1][stateCol].towers > 0 ||
				boardState[stateRow+1][stateCol].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow+1][stateCol])) {
						selectedSettlement.push(boardState[stateRow+1][stateCol]);
						fillSelectedSettlement(stateRow+1, stateCol, isVisible);	
					}
			}
		} catch(e) {
			console.log(e);
		}
		try { 
			if (boardState[stateRow+1][stateCol-1].player === currPlayer &&
				(boardState[stateRow+1][stateCol-1].huts > 0 ||
				boardState[stateRow+1][stateCol-1].towers > 0 ||
				boardState[stateRow+1][stateCol-1].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow+1][stateCol-1])) {
						selectedSettlement.push(boardState[stateRow+1][stateCol-1]);
						fillSelectedSettlement(stateRow+1, stateCol-1, isVisible);
					}
			}
		} catch(e) {
			console.log(e);
		}
		try { 
			if (boardState[stateRow][stateCol-1].player === currPlayer &&
				(boardState[stateRow][stateCol-1].huts > 0 ||
				boardState[stateRow][stateCol-1].towers > 0 ||
				boardState[stateRow][stateCol-1].temples > 0)) {
					if (!selectedSettlement.includes(boardState[stateRow][stateCol-1])) {
						selectedSettlement.push(boardState[stateRow][stateCol-1]);
						fillSelectedSettlement(stateRow, stateCol-1, isVisible);
					}
			}
		} catch(e) {
			console.log(e);
		}
		console.log("Selected settlement after filling: " + selectedSettlement);
	}

	// Check if adjacent hex's are occupied by your builings (settlement)
	function isAdjacentToSelectedSettlement(stateRow, stateCol) {
		
		if (selectedSettlement.includes(boardState[stateRow-1][stateCol]) ||
			selectedSettlement.includes(boardState[stateRow-1][stateCol+1]) ||
			selectedSettlement.includes(boardState[stateRow][stateCol+1]) ||
			selectedSettlement.includes(boardState[stateRow+1][stateCol]) ||
			selectedSettlement.includes(boardState[stateRow+1][stateCol-1]) ||
			selectedSettlement.includes(boardState[stateRow][stateCol-1])) {
			return true;
		}
		return false;
	}

	function noTowerInSettlement() {
		for (var i = 0; i < selectedSettlement.length; i++) {
			if (selectedSettlement[i].towers > 0) {
				return false;
			}
		}
		return true;
	}

	function noTempleInSettlement() {
		for (var i = 0; i < selectedSettlement.length; i++) {
			if (selectedSettlement[i].temples > 0) {
				return false;
			}
		}
		return true;
	}

	function isTileValid(tileRow, tileCol, centerHex, leftHex, rightHex, boardState) {
		if (remainingTiles >= (TILE_NUM-1)) { return true; }

		var colMin, colMax, i, j, volcanoIndex;
		var eruption = false;
		var hexRowCols = new Array(3);
		for (var i = 0; i < 3; i++) {
			// CONVERT to boardState coordinates
			if (tileFlipped) {
				console.log("Tile UD in Valid");
				switch(i) {
				case 0: // bottom hex
					hexRowCols[i] = [tileRow+1, tileCol+Math.floor((ROWS-1)/2)];
					if (centerHex.type === SubtileTypeEnum.VOLCANO) {
						volcanoIndex = i;
					}
					break;
				case 1: // left hex
					hexRowCols[i] = [tileRow, tileCol+Math.floor((ROWS-1)/2)];
					if (leftHex.type === SubtileTypeEnum.VOLCANO) {
						volcanoIndex = i;
					}
					break;
				case 2: // right hex
					hexRowCols[i] = [tileRow, tileCol+1+Math.floor((ROWS-1)/2)];
					if (rightHex.type === SubtileTypeEnum.VOLCANO) {
						volcanoIndex = i;
					}
					break;
				default:
				}
			// Rightside up tile
			} else {
				console.log("Tile RU in Valid");
				switch(i) {
				case 0: // top hex
					hexRowCols[i] = [tileRow, tileCol+1+Math.floor((ROWS-1)/2)];
					if (centerHex.type === SubtileTypeEnum.VOLCANO) {
						volcanoIndex = i;
					}
					break;
				case 1: // left hex
					hexRowCols[i] = [tileRow+1, tileCol+Math.floor((ROWS-1)/2)];
					if (leftHex.type === SubtileTypeEnum.VOLCANO) {
						volcanoIndex = i;
					}
					break;
				case 2: // right hex
					hexRowCols[i] = [tileRow+1, tileCol+1+Math.floor((ROWS-1)/2)];
					if (rightHex.type === SubtileTypeEnum.VOLCANO) {
						volcanoIndex = i;
					}
					break;
				default:
				}
			}
		}
		// Decide: eruption or expansion?
		var eruptionCounter = 0;
		var expansionCounter = 0;
		var underneathLevel = 0;
		for (var hex = 0; hex < 3; hex++) {
			i = hexRowCols[hex][0];
			j = hexRowCols[hex][1];
			if (boardState[i][j] === null) {
				expansionCounter++;
			// Else if boardState[i][j] !== null
			} else {
				if (underneathLevel === 0) {
					eruptionCounter++;
					underneathLevel = boardState[i][j].level;
				} else if (boardState[i][j].level === underneathLevel) {
					eruptionCounter++;
				}
			}
		}

		if (eruptionCounter === 3) {
			eruption = true;
		} else if (expansionCounter === 3) {
			eruption = false;
		} else {
			alert("Eruptions must take place on filled spaces of the all same level under the tile. Eruptions also cannot destroy towers, temples, nor entire settlements.");
			return false;
		}
		console.log("Eruption = " + eruption);

		// CASE: ERUPTION
		if (eruption) {
			
			var settlementOutsideCounter = 0;
			var hexPlayer = -1;
			// holds boolean values = if settlement continues outside
			var hasOutsideSettlementsPerPlayer = [false, false, false, false];
			var playersEffected = [0, 0, 0, 0];
			for (var hex = 0; hex < 3; hex++) {
				i = hexRowCols[hex][0];
				j = hexRowCols[hex][1];

				if (boardState[i][j].towers > 0 || boardState[i][j].temples > 0 || 
					boardState[i][j].huts > 0) {
					//check if there are neighboring buildings of same player based on position on tile

					hexPlayer = boardState[i][j].player;
					playersEffected[hexPlayer - 1] = 1;

					//Probably put in own function
					//func is tile covering whole settlement
					//selectedSettlement = [];
					//fillSelectedSettlement(i,j);
					if (tileFlipped) {
						switch(hex) {
						case 0: // bottom hex
							if ((boardState[i][j+1] !== null && (boardState[i][j+1].huts > 0 || boardState[i][j+1].temples > 0 || boardState[i][j+1].towers > 0)) ||
								(boardState[i+1][j] !== null && (boardState[i+1][j].huts > 0 || boardState[i+1][j].temples > 0 || boardState[i+1][j].towers > 0)) ||
								(boardState[i+1][j-1] !== null && (boardState[i+1][j-1].huts > 0 || boardState[i+1][j-1].temples > 0 || boardState[i+1][j-1].towers > 0)) ||
								(boardState[i][j-1] !== null && (boardState[i][j-1].huts > 0 || boardState[i][j-1].temples > 0 || boardState[i][j-1].towers > 0))) {

								hasOutsideSettlementsPerPlayer[hexPlayer-1] = true;		
							}
							break;
						case 1: // top left hex
							if ((boardState[i+1][j-1] !== null && (boardState[i+1][j-1].huts > 0 || boardState[i+1][j-1].temples > 0 || boardState[i+1][j-1].towers > 0)) ||
								(boardState[i][j-1] !== null && (boardState[i][j-1].huts > 0 || boardState[i][j-1].temples > 0 || boardState[i][j-1].towers > 0)) ||
								(boardState[i-1][j] !== null && (boardState[i-1][j].huts > 0 || boardState[i-1][j].temples > 0 || boardState[i-1][j].towers > 0)) ||
								(boardState[i-1][j+1] !== null && (boardState[i-1][j+1].huts > 0 || boardState[i-1][j+1].temples > 0 || boardState[i-1][j+1].towers > 0))) {

								hasOutsideSettlementsPerPlayer[hexPlayer-1] = true;		
							}
							break;
						case 2: // top right hex
							if ((boardState[i-1][j] !== null && (boardState[i-1][j].huts > 0 || boardState[i-1][j].temples > 0 || boardState[i-1][j].towers > 0)) ||
								(boardState[i-1][j+1] !== null && (boardState[i-1][j+1].huts > 0 || boardState[i-1][j+1].temples > 0 || boardState[i-1][j+1].towers > 0)) ||
								(boardState[i][j+1] !== null && (boardState[i][j+1].huts > 0 || boardState[i][j+1].temples > 0 || boardState[i][j+1].towers > 0)) || 
								(boardState[i+1][j] !== null && (boardState[i+1][j].huts > 0 || boardState[i+1][j].temples > 0 || boardState[i+1][j].towers > 0))) {

								hasOutsideSettlementsPerPlayer[hexPlayer-1] = true;		
							}
							break;
						}
					} else {
						switch(hex) {
						case 0: // top hex
							if ((boardState[i][j-1] !== null && (boardState[i][j-1].huts > 0 || boardState[i][j-1].temples > 0 || boardState[i][j-1].towers > 0)) ||
								(boardState[i-1][j] !== null && (boardState[i-1][j].huts > 0 || boardState[i-1][j].temples > 0 || boardState[i-1][j].towers > 0)) ||
								(boardState[i-1][j+1] !== null && (boardState[i-1][j+1].huts > 0 || boardState[i-1][j+1].temples > 0 || boardState[i-1][j+1].towers > 0)) ||
								(boardState[i][j+1] !== null && (boardState[i][j+1].huts > 0 || boardState[i][j+1].temples > 0 || boardState[i][j+1].towers > 0))) {

								hasOutsideSettlementsPerPlayer[hexPlayer-1] = true;		
							}
							break;
						case 1: // bottom left hex
							if ((boardState[i-1][j] !== null && (boardState[i-1][j].huts > 0 || boardState[i-1][j].temples > 0 || boardState[i-1][j].towers > 0)) ||
								(boardState[i][j-1] !== null && (boardState[i][j-1].huts > 0 || boardState[i][j-1].temples > 0 || boardState[i][j-1].towers > 0)) ||
								(boardState[i+1][j-1] !== null && (boardState[i+1][j-1].huts > 0 || boardState[i+1][j-1].temples > 0 || boardState[i+1][j-1].towers)) > 0 ||
								(boardState[i+1][j] !== null && (boardState[i+1][j].huts > 0 || boardState[i+1][j].temples > 0 || boardState[i+1][j].towers > 0))) {

								hasOutsideSettlementsPerPlayer[hexPlayer-1] = true;		
							}
							break;
						case 2: // bottom right hex
							if ((boardState[i+1][j-1] !== null && (boardState[i+1][j-1].huts > 0 || boardState[i+1][j-1].temples > 0 || boardState[i+1][j-1].towers > 0)) ||
								(boardState[i+1][j] !== null && (boardState[i+1][j].huts > 0 || boardState[i+1][j].temples > 0 || boardState[i+1][j].towers > 0)) ||
								(boardState[i][j+1] !== null && (boardState[i][j+1].huts > 0 || boardState[i][j+1].temples > 0 || boardState[i][j+1].towers > 0)) ||
								(boardState[i-1][j+1] !== null && (boardState[i-1][j+1].huts > 0 || boardState[i-1][j+1].temples > 0 || boardState[i-1][j+1].towers > 0))) {

								hasOutsideSettlementsPerPlayer[hexPlayer-1] = true;		
							}
							break;
						}
					}
				}
			}
			// case: covering entire settlement?
			console.log("playersEffected = " + playersEffected);
			console.log("hasOutsideSettlementsPerPlayer = " + hasOutsideSettlementsPerPlayer);
			for (var i = 0; i < 4; i++) {
				console.log("playersEffected[i] = " + playersEffected[i]);
				console.log("hasOutsideSettlementsPerPlayer[i] = " + hasOutsideSettlementsPerPlayer[i]);
				if (playersEffected[i] === 1 && hasOutsideSettlementsPerPlayer[i] === false) {
					// Volcano covers whole player's settlement
					alert("Eruption must not destroy an entire settlement.");
					return false;
				}
			}

			var angle = centerHex.rot;
			for (var hex = 0; hex < 3; hex++) {
				i = hexRowCols[hex][0];
				j = hexRowCols[hex][1];

				// case: new volcano not on volcano
				if (boardState[i][j].type !== SubtileTypeEnum.VOLCANO &&
					hex === volcanoIndex) {
					console.log("Case: not on volcano");
					alert("Tile's volcano must be placed on a present volcano.");
					return false;
				}
				// case: volcano same direction as covered volcano
				else if (boardState[i][j].type === SubtileTypeEnum.VOLCANO &&
					hex === volcanoIndex && boardState[i][j].rot === angle) {
					console.log("Case: same angle");
					alert("Tile's volcano must face a different direction from the volcano underneath it.");
					return false;		
				}
				// case: covering hex with a tower or temple
				else if (boardState[i][j].towers > 0 || boardState[i][j].temples > 0) {
					console.log("Case: covering temples or towers");
					alert("Tile must not cover an already placed tower or temple.");
					return false;
				} 
				else {
					switch(hex) {
					case 0:
						centerHex.level = boardState[i][j].level + 1;
						break;	
					case 1:
						leftHex.level = boardState[i][j].level + 1;
						break;
					case 2:
						rightHex.level = boardState[i][j].level + 1;
						break;
					default:
					}
				}
			}
			return true;
		// CASE: EXPANSION
		} else {
			for (var hex = 0; hex < 3; hex++) {
				console.log("hexRowCols[" + hex + "]: " + hexRowCols[hex]);
				i = hexRowCols[hex][0];
				j = hexRowCols[hex][1];
				colMin = Math.floor((ROWS-1)/2) - Math.floor(i/2);
				if (i%2 === 0) {
					colMax = (STATE_COLS-1) - Math.floor(i/2);
				} else {
					colMax = (STATE_COLS-1) - (Math.floor(i/2) + 1);
				} 
				console.log("boardState[" + i + "][" + j + "] and colMin: " + colMin + " colMax: " + colMax);

				// case: top left corner");
				if (i === 0 && j === colMin) { 
					if (boardState[i][j+2] === null && boardState[i+1][j+1] === null &&
					boardState[i+2][j] === null && boardState[i+2][j-1] === null) {
						console.log("// case: top left corner");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top left corner + j
				else if (i === 0 && j === (colMin+1)) {
					if (boardState[i][j+2] === null && boardState[i+1][j+1] === null &&
					boardState[i+2][j] === null && boardState[i+2][j-1] === null &&
					boardState[i+2][j-2] === null) {
						console.log("// case: top left corner + j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				} 
				// case: top left corner + i
				else if (i === 1 && j === colMin) {
					if (boardState[i-1][j+2] === null &&
					boardState[i][j+2] === null && boardState[i+1][j+1] === null &&
					boardState[i+2][j] === null && boardState[i+2][j-1] === null) {
						console.log("// case: top left corner + i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top left corner + i + j
				else if (i === 1 && j === (colMin+1)) {
					if (boardState[i-1][j+2] === null &&
					boardState[i][j+2] === null && boardState[i+1][j+1] === null &&
					boardState[i+2][j] === null && boardState[i+2][j-1] === null &&
					boardState[i+2][j-2] === null && boardState[i-1][j-1] === null) {
						console.log("// case: top left corner + i + j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top right corner");
				else if (i === 0 && j === colMax) {
					if (boardState[i][j-2] === null && boardState[i+1][j-2] === null &&
					boardState[i+2][j-2] === null && boardState[i+2][j-1] === null) {
						console.log("// case: top right corner");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top right corner - j
				else if (i === 0 && j === (colMax-1)) {
					if (boardState[i][j-2] === null && boardState[i+1][j-2] === null &&
					boardState[i+2][j-2] === null && boardState[i+2][j-1] === null &&
					boardState[i+2][j] === null) {
						console.log("// case: top right corner - j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top right corner + i
				else if (i === 1 && j === colMax) {
					if (boardState[i-1][j-1] === null &&
					boardState[i][j-2] === null && boardState[i+1][j-2] === null &&
					boardState[i+2][j-2] === null && boardState[i+2][j-1] === null) {
						console.log("// case: top right corner + i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top right corner + i - j
				else if (i === 1 && j === (colMax-1)) {
					if (boardState[i-1][j-1] === null &&
					boardState[i][j-2] === null && boardState[i+1][j-2] === null &&
					boardState[i+2][j-2] === null && boardState[i+2][j-1] === null &&
					boardState[i+2][j] === null && boardState[i-1][j+2] === null) {
						console.log("// case: top right corner + i - j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// case: bottom right corner");
				else if (i === (ROWS-1) && j === colMax) {
					if (boardState[i-2][j+1] === null && boardState[i-2][j] === null &&
					boardState[i-1][j-1] === null && boardState[i][j-2] === null) {
						console.log("// case: bottom right corner");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: bottom right corner" - j
				else if (i === (ROWS-1) && j === (colMax-1)) { 
					if (boardState[i-2][j+2] === null &&
					boardState[i-2][j+1] === null && boardState[i-2][j] === null &&
					boardState[i-1][j-1] === null && boardState[i][j-2] === null) {
						console.log("// case: bottom right corner - j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}	
				// case: bottom right corner - i
				else if (i === (ROWS-2) && j === colMax) {
					if (boardState[i-2][j+1] === null && boardState[i-2][j] === null &&
					boardState[i-1][j-1] === null && boardState[i][j-2] === null &&
					boardState[i+1][j-2] === null) {
						console.log("// case: bottom right corner - i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: bottom right corner - i - j
				else if (i === (ROWS-2) && j === (colMax-1)) { 
					if (boardState[i-2][j+2] === null &&
					boardState[i-2][j+1] === null && boardState[i-2][j] === null &&
					boardState[i-1][j-1] === null && boardState[i][j-2] === null &&
					boardState[i+1][j-2] === null && boardState[i+1][j+1] === null) {
						console.log("// case: bottom right corner - i - j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// case: bottom left corner");
				else if (i === (ROWS-1) && j === colMin) {
					if (boardState[i-2][j+1] === null && boardState[i-2][j+2] === null &&
					boardState[i-1][j+2] === null && boardState[i][j+2] === null) {
						console.log("// case: bottom left corner");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: bottom left corner + j
				else if (i === (ROWS-1) && j === (colMin+1)) { 
					if (boardState[i-2][j] === null &&
					boardState[i-2][j+1] === null && boardState[i-2][j+2] === null &&
					boardState[i-1][j+2] === null && boardState[i][j+2] === null) {
						console.log("// case: bottom left corner + j");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: bottom left corner - i
				else if (i === (ROWS-2) && j === colMin) {
					if (boardState[i-2][j+1] === null && boardState[i-2][j+2] === null &&
					boardState[i-1][j+2] === null && boardState[i][j+2] === null &&
					boardState[i+1][j+1] === null) {
						console.log("// case: bottom left corner - i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: bottom left corner + j - i
				else if (i === (ROWS-2) && j === (colMin+1)) { 
					if (boardState[i-2][j] === null &&
					boardState[i-2][j+1] === null && boardState[i-2][j+2] === null &&
					boardState[i-1][j+2] === null && boardState[i][j+2] === null &&
					boardState[i+1][j+1] === null && boardState[i+1][j-2] === null) {
						console.log("// case: bottom left corner + j - i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// case: top border");
				else if (i === 0) { 
					if (boardState[i][j-2] === null && boardState[i+1][j-2] === null && 
					boardState[i+2][j-2] === null && boardState[i+2][j-1] === null && 
					boardState[i+2][j] === null && boardState[i+1][j+1] === null && 
					boardState[i][j+2] === null) {
						console.log("// case: top border");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: top border + i
				else if (i === 1) { 
					if (boardState[i][j-2] === null && boardState[i-1][j-1] === null && 
					boardState[i+1][j-2] === null && boardState[i+2][j-2] === null && 
					boardState[i+2][j-1] === null && boardState[i+2][j] === null && 
					boardState[i+1][j+1] === null && boardState[i][j+2] === null && 
					boardState[i-1][j+2] === null) {
						console.log("// case: top border + i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// case: right border
				else if (j === colMax) {
					if (boardState[i-2][j+1] === null && boardState[i-2][j] === null && 
					boardState[i-1][j-1] === null && boardState[i][j-2] === null && 
					boardState[i+1][j-2] === null && boardState[i+2][j-2] === null && 
					boardState[i+2][j-1] === null) {
						console.log("// case: right border");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: right border - j even row
				else if (i%2 === 0 && j === (colMax-1)) {
					if (boardState[i-2][j+2] === null && 
					boardState[i-2][j+1] === null && boardState[i-2][j] === null && 
					boardState[i-1][j-1] === null && boardState[i][j-2] === null && 
					boardState[i+1][j-2] === null && boardState[i+2][j-2] === null && 
					boardState[i+2][j-1] === null && boardState[i+2][j] === null) {
						console.log("// case: right border - j && even row");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: right border - j odd row
				else if (j === (colMax-1)) {
					if (boardState[i-1][j+2] === null && boardState[i-2][j+2] === null && 
					boardState[i-2][j+1] === null && boardState[i-2][j] === null && 
					boardState[i-1][j-1] === null && boardState[i][j-2] === null && 
					boardState[i+1][j-2] === null && boardState[i+2][j-2] === null && 
					boardState[i+2][j-1] === null && boardState[i+2][j] === null &&
					boardState[i+1][j+1] === null) {
						console.log("// case: right border - j && odd row");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// case: bottom border
				else if (i === (ROWS-1)) {
					if (boardState[i][j+2] === null && 
					boardState[i-1][j+2] === null && boardState[i-2][j+2] === null && 
					boardState[i-2][j+1] === null && boardState[i-2][j] === null &&
					boardState[i-1][j-1] === null && boardState[i][j-2] === null) {
						console.log("// case: bottom border");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: bottom border - i
				else if (i === (ROWS-2)) {
					if (boardState[i+1][j+1] === null && 
					boardState[i][j+2] === null && boardState[i-1][j+2] === null && 
					boardState[i-2][j+2] === null && boardState[i-2][j+1] === null && 
					boardState[i-2][j] === null && boardState[i-1][j-1] === null && 
					boardState[i][j-2] === null && boardState[i+1][j-2] === null) {
						console.log("// case: bottom border - i");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// case: left border  -- CHECK colMin
				else if (j === colMin) {
					if (boardState[i-2][j+1] === null &&
					boardState[i-2][j+2] === null && boardState[i-1][j+2] === null &&
					boardState[i][j+2] === null && boardState[i+1][j+1] === null &&
					boardState[i+2][j] === null && boardState[i+2][j-1] === null) {
						console.log("// case: left border");
						//console.log("j: " + j);
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: left border + j even row
				else if (i%2 === 0 && j === (colMin+1)) {
					if (boardState[i-2][j] === null && 
					boardState[i-2][j+1] === null && boardState[i-2][j+2] === null && 
					boardState[i-1][j+2] === null && boardState[i][j+2] === null && 
					boardState[i+1][j+1] === null && boardState[i+2][j] === null && 
					boardState[i+2][j-1] === null && boardState[i+2][j-2] === null) {
						console.log("// case: left border + j && even row");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// case: left border + j odd row EDIT
				else if (j === (colMin+1)) {
					if (boardState[i-1][j-1] === null && boardState[i-2][j] === null && 
					boardState[i-2][j+1] === null && boardState[i-2][j+2] === null && 
					boardState[i-1][j+2] === null && boardState[i][j+2] === null && 
					boardState[i+1][j+1] === null && boardState[i+2][j] === null && 
					boardState[i+2][j-1] === null && boardState[i+2][j-2] === null &&
					boardState[i+1][j-2] === null) {
						console.log("// case: left border + j && odd row");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}

				// general case: in middle - even row NOT ADJUSTED
				else if (i%2 === 0 && 1 < i && i < (ROWS-2) && (colMin+1) < j && j < (colMax-1)) { 
					if (boardState[i-2][(j)] === null && boardState[i-2][(j+1)] === null &&
					boardState[i-2][(j+2)] === null && boardState[i-1][(j+2)] === null &&
					boardState[i][j+2] === null && boardState[i+1][j+1] === null &&
					boardState[i+2][(j)] === null && boardState[i+2][(j-1)] === null &&
					boardState[i+2][(j-2)] === null && boardState[i+1][j-2] === null &&
					boardState[i][j-2] === null && boardState[i-1][(j-1)] === null) {
						console.log("// general case: in middle - even row");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				// general case: in middle - odd row NOT ADJUSTED
				else if (1 < i && i < (ROWS-2) && (colMin+1) < j && j < (colMax-1)) { 
					if (boardState[i-2][(j)] === null && boardState[i-2][(j+1)] === null &&
					boardState[i-2][(j+2)] === null && boardState[i-1][j+2] === null &&
					boardState[i][j+2] === null && boardState[i+1][(j+1)] === null &&
					boardState[i+2][(j)] === null && boardState[i+2][(j-1)] === null &&
					boardState[i+2][(j-2)] === null && boardState[i+1][(j-2)] === null &&
					boardState[i][j-2] === null && boardState[i-1][j-1] === null) {
						console.log("// general case: in middle - odd row");
						alert("Tile must be connected with tiles already placed.");
						return false;
					}
				}
				try {
					// Print out surrounding hex's from current hex
					console.log("i: " + i + " j: " + j + " Surroundings: " + 
					boardState[i-2][(j)] + " " + boardState[i-2][(j+1)] + " " + 
					boardState[i-2][(j+2)] + " " + boardState[i-1][j+2] + " " + 
					boardState[i][j+2] + " " + boardState[i+1][(j+1)] + " " + 
					boardState[i+2][(j)] + " " + boardState[i+2][(j-1)] + " " + 
					boardState[i+2][(j-2)] + " " + boardState[i+1][(j-2)] + " " + 
					boardState[i][j-2] + " " + boardState[i-1][j-1]);
				} catch (e) {
					console.log(e);
				}
			}
			return true;	
		}
	}

	// Returns the top row your tile occupies from a clicked
	// Used to: Returns actual row clicked for tileflipped
	function getTopRow(x, y) {
		if (tileFlipped) {
			for (var i = 0; i < UDLegalTileCoords.length; i++) {
				for (var j = 0; j < UDLegalTileCoords[0].length; j++) {
					// TODO Edge case
					/*if (i%2 !== 0 && ((WIDTH/2) < x && x < WIDTH || (BOARD_WIDTH-WIDTH) < x && x < (BOARD_WIDTH-(WIDTH/2)))) {
						return i; // Edge Case
					}*/
					if (Math.abs(x - UDLegalTileCoords[i][j][0]) <= (WIDTH/2)) {
						if (Math.abs(y - UDLegalTileCoords[i][j][1]) <= (3*SIZE/4)) {
							console.log("x: " + x + ", i: " + i + ", j: " + j + ", width/2: " + (WIDTH/2));
							//console.log("mouseX: " + mouseX + "mouseY: " + mouseY);
							return i;
						}
					}
				}
			}
		} else {
			for (var i = 0; i < RUlegalTileCoords.length; i++) {
				for (var j = 0; j < RUlegalTileCoords[0].length; j++) {
					// TO FINISH Edge case: tile on left/right boundary
					/*if (i%2 === 0 && ((WIDTH/2) < x && x < WIDTH || (BOARD_WIDTH-WIDTH) < x && x < (BOARD_WIDTH-(WIDTH/2)))) {
						if (Math.abs(x - RUlegalTileCoords[i][j][0]) <= WIDTH) {
							if (Math.abs(y - RUlegalTileCoords[i][j][1]) <= (3*SIZE/2)) {
								return i;
							}
						}
					}*/
					if (Math.abs(x - RUlegalTileCoords[i][j][0]) <= (WIDTH/2)) {
						if (Math.abs(y - RUlegalTileCoords[i][j][1]) <= (3*SIZE/4)) {
							//console.log("x: " + x + ", i: " + i + ", j: " + j + ", width/2: " + (WIDTH/2));
							return i;
						}
					}
				}
			}
		}
	}

	// Used to: Returns actual leftmost column clicked on hex grid (including negative j)
	function getLeftmostCol(x, y, row) {
		var offset = 0;
		if (tileFlipped) {
			for (var i = 0; i < UDLegalTileCoords.length; i++) {
				for (var j = 0; j < UDLegalTileCoords[0].length; j++) {
					// TODO Edge case
					if (Math.abs(y - UDLegalTileCoords[i][j][1]) <= (3*SIZE/4)) {
						if (Math.abs(x - UDLegalTileCoords[i][j][0]) <= (WIDTH/2)) {
							offset = Math.floor(row/2);
							return j - offset;
						}
					}
				}
			}
		} else {
			for (var i = 0; i < RUlegalTileCoords.length; i++) {
				for (var j = 0; j < RUlegalTileCoords[0].length; j++) {
					// TODO Edge case
					if (Math.abs(y - RUlegalTileCoords[i][j][1]) <= (3*SIZE/4)) {
						if (Math.abs(x - RUlegalTileCoords[i][j][0]) <= (WIDTH/2)) {
							if (row % 2 === 0) {
								offset = Math.floor(row/2);
							} else {
								offset = Math.floor(row/2) + 1;
							} 
							console.log("j: " + j + " offset: " + offset);
							return j - offset;
						}
					}
				}
			}
		}
	}

	function getHexRow(x, y) {
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLS; j++) {
				// TO FINISH Edge case: tile on left/right boundary
				/*if (i%2 === 0 && ((WIDTH/2) < x && x < WIDTH || (BOARD_WIDTH-WIDTH) < x && x < (BOARD_WIDTH-(WIDTH/2)))) {
					if (Math.abs(x - RUlegalTileCoords[i][j][0]) <= WIDTH) {
						if (Math.abs(y - RUlegalTileCoords[i][j][1]) <= (3*SIZE/2)) {
							return i;
						}
					}
				}*/
				if (Math.abs(x - legalHexCoords[i][j][0]) <= (WIDTH/2) &&
					Math.abs(y - legalHexCoords[i][j][1]) <= SIZE) {
					//console.log("x: " + x + ", i: " + i + ", j: " + j + ", width/2: " + (WIDTH/2));
					return i;
				}
			}
		}
	}

	function getHexCol(x, y, row) {
		// ALWAYS
		var offset = Math.floor(row/2);
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLS; j++) {
				// TODO Edge case
				if (Math.abs(x - legalHexCoords[i][j][0]) <= (WIDTH/2) && 
					Math.abs(y - legalHexCoords[i][j][1]) <= SIZE) {
					console.log("j: " + j + " offset: " + offset);
					return j - offset;
				}
			}
		}
	}

	function onKeyPress(e) {
		if (holdingTile) {
			switch (e.key) {
			case 'r': // r = rotate
				tileAngle += 120 * (Math.PI/180);
				if (tileAngle >= (2*Math.PI - 0.1) && tileFlipped) {
					tileAngle = 60 * (Math.PI/180);
				} else if (tileAngle >= (2*Math.PI - 0.1)) {
					tileAngle = 0;
				}
				drawScreen();
				break;
			case 'f': // f = flip
				if (tileFlipped === true) {
					tileFlipped = false;
				} else if (tileFlipped === false) {
					tileFlipped = true;
				}
				console.log("tileFlipped: " + tileFlipped);
				tileAngle += Math.PI;
				if (tileAngle >= (2*Math.PI - 0.1)) {
					tileAngle -= 2*Math.PI;
				}
				drawScreen();
				break;
			default:
				break;
			}
			console.log("Tile Angle: " + tileAngle * (180/Math.PI));
		}
	}

	theCanvas.addEventListener("mousemove", onMouseMove, false);
	theCanvas.addEventListener("click", onMouseClick, false);
	theCanvas.addEventListener("keypress", onKeyPress, false);
}
