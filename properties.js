// TO CONVERT FROM PIXEL COORDS TO REAL-WORLD COORDS:
// x -= (BOARD_WIDTH/2)
// y = -(2Dy) + (BOARD_LENGTH/2)

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

// For graphical performance
const DOWN_GRADE = 10;

// Hexagon constants
const SIZE = 50 / DOWN_GRADE;
const WIDTH = Math.sqrt(3) * SIZE;
const HEIGHT = SIZE * 2;
const HEX_HEIGHT = SIZE/3;
// Board constants
const PANEL_WIDTH = 3*WIDTH;
const BOARD_WIDTH = PANEL_WIDTH + (COLS*WIDTH);
const BOARD_LENGTH = (2*SIZE)+(Math.floor((ROWS-1)/2)*(3*SIZE));
const BOARD_HEIGHT = SIZE/2;
// TRANSLATED to world coords
const BOARD_X = (3.5 * WIDTH) - (BOARD_WIDTH/2);
const BOARD_Y = -(SIZE) + (BOARD_LENGTH/2);

// Tile Deck constants
const DECK_X = 1.5 * WIDTH - (BOARD_WIDTH/2);
const DECK_Y = -(5 * SIZE) + (BOARD_LENGTH/2);
// Building Hut, Temple, and Tower constants
const HUT_X = 0.25 * WIDTH - (BOARD_WIDTH/2);
const TEMPLE_X = 1.12 * WIDTH - (BOARD_WIDTH/2);
const TOWER_X = 2 * WIDTH - (BOARD_WIDTH/2);
const HTT_Y = -(9 * SIZE) + (BOARD_LENGTH/2) - 30;
const EXPAND_BTN_X = WIDTH - (BOARD_WIDTH/2) + WIDTH/2;
const EXPAND_BTN_Y = -(12 * SIZE) + (BOARD_LENGTH/2) - 50;
const DONE_BTN_X = 0.5 * WIDTH - (BOARD_WIDTH/2);
const DONE_BTN_Y = -(16 * SIZE) + (BOARD_LENGTH/2);
// TALUVA Title constants
const TITLE_X = 0.1 * WIDTH - (BOARD_WIDTH/2);
const TITLE_Y = -(BOARD_HEIGHT - (3*SIZE)) + (BOARD_LENGTH/2);

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

const CAM_ANGLE = Math.PI/4;
const X_AXIS = new THREE.Vector3(1,0,0);


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
//substate
var doneBuilding = false;
var badTilePlacement = false;
var tryingTilePlacement = false;

//STATE
// REMOVED
var holdingTile = false;
var heldOverPlaced = false;

//STATE
var buildingTime = false;
//substate
var startedBuilding = false;

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
					UDLegalTileCoords[i][j][c] = (j*WIDTH) + (4*WIDTH) - (BOARD_WIDTH/2);
				} else {            // odd row
					UDLegalTileCoords[i][j][c] = (j*WIDTH) + (4.5*WIDTH) - (BOARD_WIDTH/2);
				}
			} else {        // y-coord
				UDLegalTileCoords[i][j][c] = -((i*1.5*SIZE) + (1.5*SIZE)) + (BOARD_LENGTH/2);
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
					RUlegalTileCoords[i][j][c] = (j*WIDTH) + (4.5*WIDTH) - (BOARD_WIDTH/2);
				} else {
					RUlegalTileCoords[i][j][c] = (j*WIDTH) + (4*WIDTH) - (BOARD_WIDTH/2);
				}
			} else {        // y-coord
				RUlegalTileCoords[i][j][c] = -((i*1.5*SIZE) + (2*SIZE)) + (BOARD_LENGTH/2);
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
			// x-coord
			if (c === 0) {
				if (i % 2 === 0) {
					legalHexCoords[i][j][c] = BOARD_X + (WIDTH * j) - (BOARD_WIDTH/2);
				} else if (j < (COLS-1)) {
					legalHexCoords[i][j][c] = BOARD_X + (WIDTH * j) + (WIDTH / 2) - (BOARD_WIDTH/2);
				}
			// else if c === 1, y-coord
			} else {
				legalHexCoords[i][j][c] = -(BOARD_Y + (SIZE * (3/2) * i)) + (BOARD_LENGTH/2);
			}
		}
	}
}