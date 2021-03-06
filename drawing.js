// TO CONVERT FROM PIXEL COORDS TO REAL-WORLD COORDS:
// x -= (BOARD_WIDTH/2)         (and switch operation signs)
// y = -(2Dy) + (BOARD_LENGTH/2) (and switch operation signs)

// THREE.JS INITIALIZATION

var fontLoaded = false;
var loader = new THREE.FontLoader();
var font = loader.load('./helvetiker_regular.typeface.json', 
	// onLoad callback
	function ( font ) {
		console.log('Font loaded!');
		self.font = font;
		fontLoaded = true;
	},

	// onProgress callback
	function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.log( 'An error happened loading font' );
	});

// DECLARE GLOBAL MESHES FOR ADDITION AND DELETION
var titleMesh, howManyPMesh, playersMesh, button1Mesh, button2Mesh, button3Mesh, button4Mesh,
	tileCountMesh, playerTurnMesh, hutsMesh, towersMesh, templesMesh, buildMesh,
	expandMesh, expandPromptMesh, boardMesh, hexMesh;

var zPlane = new THREE.Plane(new THREE.Vector3(0,0,1, 0));

var mouse = new THREE.Vector2();
var prevMouseX, prevMouseY;
// Get 3d board coords
var mouse3DVector = new THREE.Vector3();

var raycaster = new THREE.Raycaster();

var renderer = new THREE.WebGLRenderer( {
    canvas: document.getElementById('myCanvas'), 
    antialias: true} );
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Enable shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCShadowMap;


// Camera, FOV: 35, Aspect Ratio: window size, near and far clipping points: 0.1, 3000
var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 800);
camera.position.set(0, 50, 250);

var scene = new THREE.Scene();

var objLoader = new THREE.OBJLoader();

// Rotate camera 45 deg downwards
var camera_pivot = new THREE.Object3D()
scene.add(camera_pivot);
camera_pivot.add(camera);
camera.lookAt(camera_pivot.position);
camera_pivot.rotateOnAxis(X_AXIS, CAM_ANGLE);

// Default lighting, white, 0.5 intensity
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Spotlight for shadows
//var spotLight = new THREE.SpotLight(0xFFFFFF, 4.0, 1000);
var spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(0, 20, 150);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 652 * 2;
spotLight.shadow.mapSize.height = 652 * 2;
spotLight.shadow.camera.near = 80;
spotLight.shadow.camera.far = 100;
spotLight.shadow.camera.fov = 50;
scene.add(spotLight);

// Vignette - Post-Processing
var composer = new THREE.EffectComposer(renderer);
var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);
var pass1 = new THREE.ShaderPass(THREE.VignetteShader);
composer.addPass(pass1);
pass1.renderToScreen = true;

var textMaterial = new THREE.MeshPhongMaterial({color:0xFF0033});
var redTextMaterial = new THREE.MeshPhongMaterial({color: 'red'});
var yellowTextMaterial = new THREE.MeshPhongMaterial({color: 'yellow'});
var greenTextMaterial = new THREE.MeshPhongMaterial({color: 'green'});
var blueTextMaterial = new THREE.MeshPhongMaterial({color: 'blue'});
var blackTextMaterial = new THREE.MeshPhongMaterial({color:0x000000});
var whiteTextMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF});

var volcanoHexMaterial = new THREE.MeshLambertMaterial( {color: VOLCANOCOLOR} );
var jungleHexMaterial = new THREE.MeshLambertMaterial( {color: JUNGLECOLOR} );
var grassHexMaterial = new THREE.MeshLambertMaterial( {color: GRASSCOLOR} );
var desertHexMaterial = new THREE.MeshLambertMaterial( {color: DESERTCOLOR} );
var quarryHexMaterial = new THREE.MeshLambertMaterial( {color: QUARRYCOLOR} );
var lagoonHexMaterial = new THREE.MeshLambertMaterial( {color: LAGOONCOLOR} );

// CREATE HEXSHAPE VAR

var x = 0;
var y = 0;
var hexShape = new THREE.Shape();
hexShape.moveTo(x,y);
x -= WIDTH / 2;
y += SIZE / 2;
hexShape.lineTo(x, y);

// i = 2
y += SIZE;
hexShape.lineTo(x, y);

// i = 3
x += WIDTH / 2;
y += SIZE / 2;
hexShape.lineTo(x, y);

// i = 4
x += WIDTH / 2;
y -= SIZE / 2;
hexShape.lineTo(x, y);

// i = 5
y -= SIZE;
hexShape.lineTo(x, y);

// i = 6
x -= WIDTH / 2;
y -= SIZE / 2;
hexShape.lineTo(x, y);

var hexExtrudeSettings = {amount: HEX_HEIGHT, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1};
var hex = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);

// DRAW FUNCTIONS

function drawBackground() {
	// Game board
	var board = new THREE.BoxGeometry(BOARD_WIDTH, BOARD_LENGTH, BOARD_HEIGHT);
	var boardMaterial = new THREE.MeshLambertMaterial( {color: 0x3da3ff} );
	boardMesh = new THREE.Mesh(board, boardMaterial);
	// Shadow config
	spotLight.target = boardMesh;
	boardMesh.receiveShadow = true;
	boardMesh.name = 'board';
	scene.add(boardMesh);
}

// Fully updated for 3D
function drawSidePanel() {

	var panel = new THREE.BoxGeometry(PANEL_WIDTH, BOARD_LENGTH, BOARD_HEIGHT);
	var panelMaterial = new THREE.MeshLambertMaterial( {color: 'rgb(200, 175, 150)'} );
	var panelMesh = new THREE.Mesh(panel, panelMaterial);
	panelMesh.position.set(-BOARD_WIDTH/2 + PANEL_WIDTH/2, 0, 0);
	panelMesh.receiveShadow = true;
	panelMesh.name = 'panel';
	scene.add(panelMesh);
}
// Fully updated for 3D
function drawTitle() {
	

	if (gameOver) {
		var subtitleA = new THREE.TextGeometry( 'It\'s (no longer)', {font: font, size: 50 / DOWN_GRADE, height: BOARD_HEIGHT, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	} else {
		var subtitleA = new THREE.TextGeometry( 'It\'s', {font: font, size: 50 / DOWN_GRADE, height: BOARD_HEIGHT, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	}
	var title = new THREE.TextGeometry( 'TALUVA', {font: font, size: 200 / DOWN_GRADE, height: BOARD_HEIGHT, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	var subtitleB = new THREE.TextGeometry( 'Time', {font: font, size: 50 / DOWN_GRADE, height: BOARD_HEIGHT, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});

	var subtitleAMesh = new THREE.Mesh(subtitleA, textMaterial);
	var titleMesh = new THREE.Mesh(title, textMaterial);
	var subtitleBMesh = new THREE.Mesh(subtitleB, textMaterial);
	subtitleAMesh.position.set(-(BOARD_WIDTH/2.1), BOARD_LENGTH/2, BOARD_HEIGHT*3);
	subtitleAMesh.rotation.x += Math.PI/5;
	titleMesh.position.set(-(BOARD_WIDTH/2.5), BOARD_LENGTH/2, BOARD_HEIGHT*3);
	titleMesh.rotation.x += Math.PI/8;
	subtitleBMesh.position.set(BOARD_WIDTH/2.5, BOARD_LENGTH/2, BOARD_HEIGHT*3);
	subtitleBMesh.rotation.x += Math.PI/5;
	subtitleAMesh.name = 'subtitleA';
	titleMesh.name = 'title';
	subtitleBMesh.name = 'subtitleB';
	scene.add(subtitleAMesh); 
	scene.add(titleMesh);
	scene.add(subtitleBMesh); 
}
// Fully updated for 3D
function drawPlayerNumPrompt() {

	// 1 2 3 4 Buttons
	var title = new THREE.TextGeometry('How Many Players?', {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	howManyPMesh = new THREE.Mesh(title, textMaterial);
	howManyPMesh.position.set(-(BOARD_WIDTH/4), 0, 3*BOARD_HEIGHT);
	howManyPMesh.rotation.x += Math.PI/8;
	scene.add(howManyPMesh);

	var button = new THREE.BoxGeometry(WIDTH/3, SIZE, BOARD_HEIGHT);
	var buttonMaterial = new THREE.MeshLambertMaterial( {color: 'rgb(200, 175, 150)'} );
	button1Mesh = new THREE.Mesh(button, buttonMaterial);
	button2Mesh = new THREE.Mesh(button, buttonMaterial);
	button3Mesh = new THREE.Mesh(button, buttonMaterial);
	button4Mesh = new THREE.Mesh(button, buttonMaterial);
	button1Mesh.position.set(PANEL_WIDTH/9 - (BOARD_WIDTH/2), -(DECK_Y/2.5) + (BOARD_LENGTH/2), BOARD_HEIGHT);
	button2Mesh.position.set(PANEL_WIDTH/3 - (BOARD_WIDTH/2), -(DECK_Y/2.5) + (BOARD_LENGTH/2), BOARD_HEIGHT);
	button3Mesh.position.set(5*PANEL_WIDTH/9 - (BOARD_WIDTH/2), -(DECK_Y/2.5) + (BOARD_LENGTH/2), BOARD_HEIGHT);
	button4Mesh.position.set(7*PANEL_WIDTH/9 - (BOARD_WIDTH/2), -(DECK_Y/2.5) + (BOARD_LENGTH/2), BOARD_HEIGHT);


	button1Mesh.name = 'button1';
	button2Mesh.name = 'button2';
	button3Mesh.name = 'button3';
	button4Mesh.name = 'button4';
	scene.add(button1Mesh);
	scene.add(button2Mesh);
	scene.add(button3Mesh);
	scene.add(button4Mesh);
	
	var players = new THREE.TextGeometry('1   2   3   4', {font: font, size: 30 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	playersMesh = new THREE.Mesh(players, textMaterial);
	playersMesh.position.set(PANEL_WIDTH/9 - (BOARD_WIDTH/2), -(DECK_Y/2.4) + (BOARD_LENGTH/2), 2*BOARD_HEIGHT);
	playersMesh.rotation.x += Math.PI/4;
	scene.add(playersMesh);
}

// Fully updated for 3D
function drawPlayerTurn(player) {

	var playerTurn = new THREE.TextGeometry('Player ' + player + '\'s Turn', {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	switch(player) {
	case PlayerEnum.ONE:
		playerTurnMesh = new THREE.Mesh(playerTurn, redTextMaterial);
		break;
	case PlayerEnum.TWO:
		playerTurnMesh = new THREE.Mesh(playerTurn, yellowTextMaterial);
		break;
	case PlayerEnum.THREE:
		playerTurnMesh = new THREE.Mesh(playerTurn, greenTextMaterial);
		break;
	case PlayerEnum.FOUR:
		playerTurnMesh = new THREE.Mesh(playerTurn, blueTextMaterial);
		break;
	default:
	}

	playerTurnMesh.position.set((PANEL_WIDTH/9) - (BOARD_WIDTH/2) + (BOARD_WIDTH/1.8), -(DECK_Y/6) + (BOARD_LENGTH/2) - (BOARD_LENGTH + (3*SIZE/2)), BOARD_HEIGHT*3);
	playerTurnMesh.name = 'playerTurn';
	scene.add(playerTurnMesh);
}

// Fully updated for 3D
function drawPlayerWin(player) {
	
	var playerWin = new THREE.TextGeometry("Player " + player + " Wins!!", {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});

	switch(player) {
	case PlayerEnum.ONE:
		var playerWinMesh = new THREE.Mesh(playerWin, redTextMaterial);

		break;
	case PlayerEnum.TWO:
		var playerWinMesh = new THREE.Mesh(playerWin, yellowTextMaterial);

		break;
	case PlayerEnum.THREE:
		var playerWinMesh = new THREE.Mesh(playerWin, greenTextMaterial);

		break;
	case PlayerEnum.FOUR:
		var playerWinMesh = new THREE.Mesh(playerWin, blueTextMaterial);

		break;
	default:
	}

	playerWinMesh.position.set((PANEL_WIDTH/9) - (BOARD_WIDTH/2), -(DECK_Y/6) + (BOARD_LENGTH/2), BOARD_HEIGHT*3);
	scene.add(playerWinMesh);
}

// Fully updated for 3D
function drawPlayersWin(tied) {

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

	var playersWin = new THREE.TextGeometry("Players " + playerString + " Win!!", {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	var playersWinMesh = new THREE.Mesh(playersWin, whiteTextMaterial);
	playersWinMesh.position.set((PANEL_WIDTH/9) - (BOARD_WIDTH/2), -(DECK_Y/6) + (BOARD_LENGTH/2), BOARD_HEIGHT*3);
	scene.add(playersWinMesh);
}

// Fully updated for 3D
function drawTileCounter() {

	var tileCount = new THREE.TextGeometry("tiles remaining: " + remainingTiles, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	tileCountMesh = new THREE.Mesh(tileCount, blackTextMaterial);
	tileCountMesh.position.set((PANEL_WIDTH/9) - (BOARD_WIDTH/2), -(DECK_Y/2.5) + (BOARD_LENGTH/2) - BOARD_LENGTH, BOARD_HEIGHT*3);
	tileCountMesh.name = 'tileCounter';
	scene.add(tileCountMesh);
}

// Fully updated for 3D
function drawHutsTemplesAndTowers() {
	
	switch(currPlayer) {
	case PlayerEnum.ONE:
	

		var huts = new THREE.TextGeometry(RemainingHutsEnum.ONE, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		hutsMesh = new THREE.Mesh(huts, redTextMaterial);
		hutsMesh.position.set(HUT_X - 5, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(hutsMesh);
		
		var temples = new THREE.TextGeometry(RemainingTemplesEnum.ONE, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		templesMesh = new THREE.Mesh(temples, redTextMaterial);
		templesMesh.position.set(TEMPLE_X, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(templesMesh);
		
		var towers = new THREE.TextGeometry(RemainingTowersEnum.ONE, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		towersMesh = new THREE.Mesh(towers, redTextMaterial);
		towersMesh.position.set(TOWER_X + 2, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(towersMesh);

		break;
	case PlayerEnum.TWO:

		
		var huts = new THREE.TextGeometry(RemainingHutsEnum.TWO, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		hutsMesh = new THREE.Mesh(huts, yellowTextMaterial);
		hutsMesh.position.set(HUT_X - 5, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(hutsMesh);
		
		var temples = new THREE.TextGeometry(RemainingTemplesEnum.TWO, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		templesMesh = new THREE.Mesh(temples, yellowTextMaterial);
		templesMesh.position.set(TEMPLE_X, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(templesMesh);
		
		var towers = new THREE.TextGeometry(RemainingTowersEnum.TWO, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		towersMesh = new THREE.Mesh(towers, yellowTextMaterial);
		towersMesh.position.set(TOWER_X + 2, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(towersMesh);

		break;
	case PlayerEnum.THREE:


		var huts = new THREE.TextGeometry(RemainingHutsEnum.THREE, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		hutsMesh = new THREE.Mesh(huts, greenTextMaterial);
		hutsMesh.position.set(HUT_X - 5, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(hutsMesh);
		
		var temples = new THREE.TextGeometry(RemainingTemplesEnum.THREE, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		templesMesh = new THREE.Mesh(temples, greenTextMaterial);
		templesMesh.position.set(TEMPLE_X, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(templesMesh);
		
		var towers = new THREE.TextGeometry(RemainingTowersEnum.THREE, {font: font, size: 60 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		towersMesh = new THREE.Mesh(towers, greenTextMaterial);
		towersMesh.position.set(TOWER_X + 2, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(towersMesh);

		break;
	case PlayerEnum.FOUR:

		var huts = new THREE.TextGeometry(RemainingHutsEnum.FOUR, {font: font, size: 40 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		hutsMesh = new THREE.Mesh(huts, blueTextMaterial);
		hutsMesh.position.set(HUT_X - 5, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(hutsMesh);
		
		var temples = new THREE.TextGeometry(RemainingTemplesEnum.FOUR, {font: font, size: 40 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		templesMesh = new THREE.Mesh(temples, blueTextMaterial);
		templesMesh.position.set(TEMPLE_X, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(templesMesh);
		
		var towers = new THREE.TextGeometry(RemainingTowersEnum.FOUR, {font: font, size: 40 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
		towersMesh = new THREE.Mesh(towers, blueTextMaterial);
		towersMesh.position.set(TOWER_X + 2, HTT_Y + 15, BOARD_HEIGHT);
		scene.add(towersMesh);

		break;
	default:
	}

	var hutMaterial = new THREE.MeshBasicMaterial( { color: 'brown' } );
	var templeMaterial = new THREE.MeshBasicMaterial( { color: 'gold' } );
	var towerMaterial = new THREE.MeshBasicMaterial( { color: 'grey' } );

	// SPACESHIP
	objLoader.load('shack.obj', function (hut) {
	  hut.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
		  child.material = hutMaterial;
		}
	  });

	  hut.scale.x = 2; //2
	  hut.scale.y = 2;
	  hut.scale.z = 2;
	  hut.position.set(HUT_X, HTT_Y, BOARD_HEIGHT);
	  scene.add(hut);
	  hut.rotation.x += Math.PI/2;
	  console.log("Added hut");

	});
	
	objLoader.load('templo.obj', function (temple) {
	  temple.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
		  child.material = templeMaterial;
		}
	  });
	  temple.scale.x = 0.7;
	  temple.scale.y = 0.5;
	  temple.scale.z = 0.7;
	  temple.position.set(TEMPLE_X + 2, HTT_Y + 2, BOARD_HEIGHT/4);
	  temple.rotation.x += Math.PI/2;
	  scene.add(temple);
	  console.log("Added temple");


	});

	objLoader.load('tower.obj', function (tower) {
	  tower.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
		  child.material = towerMaterial;
		}
	  });
	  tower.scale.x = 2.5; //2
	  tower.scale.y = 2.5;
	  tower.scale.z = 2.5;
	  tower.position.set(TOWER_X + 3, HTT_Y - 5, BOARD_HEIGHT);
	  scene.add(tower);
	  console.log("Added tower");

	});


	/*context.fillStyle = 'black';
	context.fillText("build something", HUT_X+20, HTT_Y+90);
	if (buildingTime && hutsLeft())
		context.fillText("or", HUT_X+95, HTT_Y+115);*/

	var build = new THREE.TextGeometry("build something", {font: font, size: 40 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 12 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 5 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});
	buildMesh = new THREE.Mesh(build, blackTextMaterial);
	buildMesh.position.set(HUT_X - 15, HTT_Y-10, BOARD_HEIGHT);
	scene.add(buildMesh);
}

// Not fully updated for 3D
function addExpandButtonMesh() {



	var button = new THREE.BoxGeometry(2*WIDTH, SIZE, BOARD_HEIGHT);
	var buttonMaterial = new THREE.MeshLambertMaterial( {color: 'rgb(150, 125, 90)'} );
	expandMesh = new THREE.Mesh(button, buttonMaterial);
	expandMesh.position.set(EXPAND_BTN_X, EXPAND_BTN_Y, BOARD_HEIGHT);
	scene.add(expandMesh);

	
	var title = new THREE.TextGeometry("EXPAND\nSETTLEMENT", {font: font, size: 20 / DOWN_GRADE, height: 5 / DOWN_GRADE, curveSegments: 6 / DOWN_GRADE, bevelEnabled: true, bevelThickness: 2 / DOWN_GRADE, bevelSize: 2 / DOWN_GRADE, bevelSegments: 5 / DOWN_GRADE});

	switch(currPlayer) {
	case PlayerEnum.ONE:
		//context.fillStyle = 'red';
		var expandPromptMesh = new THREE.Mesh(title, redTextMaterial);
		break;
	case PlayerEnum.TWO:
		//context.fillStyle = 'yellow';
		var expandPromptMesh = new THREE.Mesh(title, yellowTextMaterial);
		break;
	case PlayerEnum.THREE:
		//context.fillStyle = 'green';
		var expandPromptMesh = new THREE.Mesh(title, greenTextMaterial);
		break;
	case PlayerEnum.FOUR:
		//context.fillStyle = 'blue';
		var expandPromptMesh = new THREE.Mesh(title, blueTextMaterial);
		break;
	default:
		//context.fillStyle = 'black';
	}


	expandPromptMesh.name = 'expander';
	expandPromptMesh.position.set(EXPAND_BTN_X - WIDTH, EXPAND_BTN_Y, BOARD_HEIGHT* 2);
	scene.add(expandPromptMesh);
}

// Updated for 3D - MAYBE NOT NEEDED nor drawHeldTile
//function translateAndMoveHexMesh(row,col,level,type,rotation,player,huts,towers,temples) {
function translateAndMoveHexMesh(row,col,hexName) {	
	// boardHexagons is an array of HexState
	// x and y are centers of hex's, yes they are
	// corripsonds HexState row and col to appropriate x and y
	var hexX;
	var hexY = -((1.5*SIZE*row) - SIZE) + (BOARD_LENGTH/2);

	var offset = Math.floor(row/2);
	if (row % 2 === 0) {
		hexX = WIDTH*(col+offset) - (3.5*WIDTH);// - (BOARD_WIDTH/2);
	} else {
		hexX = WIDTH*(col+offset) - (4*WIDTH);// - (BOARD_WIDTH/2);
	}
	//addHexMesh(hexX,hexY,type, true, rotation, false, level, huts, towers, temples, player, false);
	
	scene.traverse (function (object) {
		if (object instanceof THREE.Mesh) {
		
			
			if (object.name === hexName) {
				console.log('object.name = ' + object.name);
				object.position.z = BOARD_HEIGHT;
				
				// Enter method w/ exact row/col of hex
				object.position.x = hexX;
				object.position.y = hexY;
				//object.position.set(mouse.x, mouse.y + SIZE, 3*BOARD_HEIGHT);  
				console.log("hex position: " + object.position.x + " " + object.position.y + " " + object.position.z);
			
			}
		}
	});


}

// replaces drawHexagon
function addHexMesh(centerX, centerY, type, isPlaced, angle, isHeld, 
	level, huts, towers, temples, player, isDeck, deckPos) {
	

	switch (type) {
		case SubtileTypeEnum.VOLCANO:
			hexMesh = new THREE.Mesh(hex, volcanoHexMaterial);
			break;
		case SubtileTypeEnum.JUNGLE:
			hexMesh = new THREE.Mesh(hex, jungleHexMaterial);
			break;
		case SubtileTypeEnum.GRASS:
			hexMesh = new THREE.Mesh(hex, grassHexMaterial);
			break;
		case SubtileTypeEnum.DESERT:
			hexMesh = new THREE.Mesh(hex, desertHexMaterial);
			break;
		case SubtileTypeEnum.QUARRY:
			hexMesh = new THREE.Mesh(hex, quarryHexMaterial);
			break;
		case SubtileTypeEnum.LAGOON:
			hexMesh = new THREE.Mesh(hex, lagoonHexMaterial);
			break;
		default:
	}

	// Shadow config
	hexMesh.castShadow = true;

	hexMesh.position.set(centerX, centerY, HEX_HEIGHT);
	console.log("New hexMesh pos: (" + hexMesh.position.x + "," +
		hexMesh.position.y + "," + hexMesh.position.z + ")");
	if (isDeck) {
		var name = deckPos + remainingTiles;
		console.log("deckTileHex name: " + name);
		console.log(name === 'topDeckHex48');
		hexMesh.name = name;
	}
	scene.add(hexMesh);
}

function drawDeck() {
	if (terrDistIndex === TILE_NUM)
		return;
	
	console.log("terrainDist[terrDistIndex]: " + terrainDist[terrDistIndex]);
	// draw top
	addHexMesh(DECK_X, DECK_Y + SIZE,  
		terrainDist[terrDistIndex][0], false, 0, false, 0, 0, 0, 0, 1, true, "topDeckHex");

	// draw bottom left
	addHexMesh(DECK_X - (WIDTH / 2), DECK_Y - (SIZE / 2),   
		terrainDist[terrDistIndex][1], false, 0, false, 0, 0, 0, 0, 1, true, "leftDeckHex");

	// draw bottom right
	addHexMesh(DECK_X + (WIDTH / 2), DECK_Y - (SIZE / 2),   
		terrainDist[terrDistIndex][2], false, 0, false, 0, 0, 0, 0, 1, true, "rightDeckHex");
}

function addGameOverMesh() {
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
}
