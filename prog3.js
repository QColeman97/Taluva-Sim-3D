// Program #3
// Quinn Coleman
// CSC 378-1    3/6/18

// TO CONVERT FROM PIXEL COORDS TO REAL-WORLD COORDS:
// x -= (BOARD_WIDTH/2)         (and switch operation signs)
// y = -(2Dy) + (BOARD_LENGTH/2) (and switch operation signs)

console.log("size of board: (" + BOARD_WIDTH + "," + BOARD_LENGTH + "," + BOARD_HEIGHT + ")");

// Load audio and font
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

// Launch app
function bkgdMusicLoaded(e) {
	// Wait for type font to load
	while (fontLoaded === false) {
		console.log("Font loading");
	}
	canvasApp();
}
//var i = 0;
function canvasApp() {	
	// UNMUTE FOR BACKGROUND MUSIC
	//audioElement.muted = true;

	audioElement.play();
	audioElement.loop = true;
	audioElement.volume = 0.5;

	// Shuffle the tile deck
	shuffleArray(terrainDist);

	// Adding meshes to scene
	drawBackground();
	drawSidePanel();
	drawTitle();

	// TODO
	// SOLIDIFY ANIMATION FLOW
	drawPlayerNumPrompt();
	
	// GAMELOOP
	var render = function() {
		//i++;
		//console.log('inside render iter: ' + i);
		
		//Logic for correct display BASED ON STATES
		// AND THEN Graphics based on that logic
		if (idling) {
			// NO LOGIC
			// GRAPHICS
			// remove choose player meshes
			if (button1Mesh) {
				scene.remove(button1Mesh);
				button1Mesh = undefined;

				scene.remove(button2Mesh);
				button2Mesh = undefined;

				scene.remove(button3Mesh);
				button3Mesh = undefined;

				scene.remove(button4Mesh);
				button4Mesh.geometry.dispose();
				button4Mesh.material.dispose();
				button4Mesh = undefined;

				scene.remove(playersMesh);
				playersMesh.geometry.dispose();
				playersMesh.material.dispose();
				playersMesh = undefined;

				scene.remove(howManyPMesh);
				howManyPMesh.geometry.dispose();
				howManyPMesh.material.dispose();
				howManyPMesh = undefined;
				
				drawDeck();
				// add new player turn mesh
				drawPlayerTurn(currPlayer);
				// add new tile counter
				drawTileCounter();
			// On new player turn
			} else if (doneBuilding) {
				doneBuilding = false;
				// remove prev player turn
				scene.remove(playerTurnMesh);
				playerTurnMesh.geometry.dispose();
				playerTurnMesh.material.dispose();
				playerTurnMesh = undefined;

				// add new player turn mesh
				drawPlayerTurn(currPlayer);
			} else if (badTilePlacement) {
				badTilePlacement = false;
				
				// remove prev tile counter
				scene.remove(tileCountMesh);
				tileCountMesh.geometry.dispose();
				tileCountMesh.material.dispose();
				tileCountMesh = undefined;
				// add new tile counter
				drawTileCounter();

				// REMOVE new tile on deck
				scene.traverse (function (object) {
					if (object instanceof THREE.Mesh) {

						var topString = 'topDeckHex' + (remainingTiles+1).toString();
						var leftString = 'leftDeckHex' + (remainingTiles+1).toString();
						var rightString = 'rightDeckHex' + (remainingTiles+1).toString();
						if (object.name === topString) {
							console.log('deleting object.name = ' + object.name);
							
							scene.remove(object);
							object = undefined;

						} else if (object.name === leftString) {
							console.log('deleting object.name = ' + object.name);

							scene.remove(object);
							object = undefined;

						} else if (object.name === rightString) {
							console.log('deleting object.name = ' + object.name);
							
							scene.remove(object);
							object = undefined;
						}
					}
				});


				terrDistIndex--;
				remainingTiles = TILE_NUM - terrDistIndex;

				drawDeck();
			}
				
		} else if (holdingTile) {
			console.log("holding Tile in render");

			if (justGrabbedTile) {
				justGrabbedTile = false;

				// remove prev tile counter
				scene.remove(tileCountMesh);
				tileCountMesh.geometry.dispose();
				tileCountMesh.material.dispose();
				tileCountMesh = undefined;
				// add new tile counter
				drawTileCounter();
				// add new deck underneath
				drawDeck();	
				firstDraw = false;  // unused	
			}
			else if (tryingTilePlacement) {
				tryingTilePlacement = false;

				console.log("clicked board mouse3DVector: (" + 
				mouse3DVector.x + "," + mouse3DVector.y + "," + mouse3DVector.z + ")");
				
				//var raycaster = projector.pickingRay(mouse3DVector, camera);
				raycaster.setFromCamera(mouse3DVector, camera); 
				var pos = raycaster.ray.intersectPlane(zPlane);
				
				console.log("clicked board pos: (" + 
					pos.x + "," + pos.y + "," + pos.z + ")");

				// Draw a new tile at appropriate coordinates
				var tileRow = getTopRow(pos.x, pos.y);
				var tileCol = getLeftmostCol(pos.x, pos.y, tileRow);
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
					// USED TO BE FORR HOLDINGTILE
					//var newCenterHex = new HexState(tileRow+1, tileCol, 1, terrainDist[terrDistIndex][bottomIndex-1], tileAngle, currPlayer, 0, 0, 0, false);
					var newCenterHex = new HexState(tileRow+1, tileCol, 1, terrainDist[terrDistIndex][bottomIndex], tileAngle, currPlayer, 0, 0, 0, false);
					console.log("to add boardState[" + (tileRow+1) + "][" + (tileCol+Math.floor((ROWS-1)/2)) + "] = " + newCenterHex);
					
					var newLeftHex = new HexState(tileRow, tileCol, 1, terrainDist[terrDistIndex][leftIndex], tileAngle, currPlayer, 0, 0, 0, false);
					console.log("to add boardState[" + tileRow + "][" + (tileCol+Math.floor((ROWS-1)/2)) + "] = " + newLeftHex);
					
					var newRightHex = new HexState(tileRow, tileCol+1, 1, terrainDist[terrDistIndex][rightIndex], tileAngle, currPlayer, 0, 0, 0, false);
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
					var newCenterHex = new HexState(tileRow, tileCol+1, 1, terrainDist[terrDistIndex][topIndex], tileAngle, currPlayer, 0, 0, 0, false);
					console.log("to add boardState[" + tileRow + "][" + (tileCol+1+Math.floor((ROWS-1)/2)) + "] = " + newCenterHex);

					var newLeftHex = new HexState(tileRow+1, tileCol, 1, terrainDist[terrDistIndex][leftIndex], tileAngle, currPlayer, 0, 0, 0, false);
					console.log("to add boardState[" + (tileRow+1) + "][" + (tileCol+Math.floor((ROWS-1)/2)) + "] = " + newLeftHex);
					
					var newRightHex = new HexState(tileRow+1, tileCol+1, 1, terrainDist[terrDistIndex][rightIndex], tileAngle, currPlayer, 0, 0, 0, false);
					console.log("to add boardState[" + (tileRow+1) + "][" + (tileCol+1+Math.floor((ROWS-1)/2)) + "] = " + newRightHex);
				}

				if (isTileValid(tileRow, tileCol, newCenterHex, newLeftHex, newRightHex, boardState)) {
					drawableBoardHexagons.push(newCenterHex, newLeftHex, newRightHex);
					if (tileFlipped) {
						// Add boardstate offsets
						boardState[tileRow+1][tileCol+Math.floor((ROWS-1)/2)] = newCenterHex;
						boardState[tileRow][tileCol+Math.floor((ROWS-1)/2)] = newLeftHex;
						boardState[tileRow][tileCol+1+Math.floor((ROWS-1)/2)] = newRightHex;

						// GRAPHICS
						translateAndMoveHexMesh(tileRow+1, tileCol);
						translateAndMoveHexMesh(tileRow, tileCol);
						translateAndMoveHexMesh(tileRow, tileCol+1);

						tileFlipped = false;
					} else {
						boardState[tileRow][tileCol+1+Math.floor((ROWS-1)/2)] = newCenterHex;
						boardState[tileRow+1][tileCol+Math.floor((ROWS-1)/2)] = newLeftHex;
						boardState[tileRow+1][tileCol+1+Math.floor((ROWS-1)/2)] = newRightHex;

						console.log('moving meshes - successful placement');
						// GRAPHICS
						translateAndMoveHexMesh(tileRow, tileCol+1, 'topDeckHex' + (remainingTiles+1).toString());
						translateAndMoveHexMesh(tileRow+1, tileCol, 'leftDeckHex' + (remainingTiles+1).toString());
						translateAndMoveHexMesh(tileRow+1, tileCol+1, 'rightDeckHex' + (remainingTiles+1).toString());


					}
					// STATE CHANGE
					holdingTile = false;

					buildingTime = true;
					// substate
					startedBuilding = true;
					
					heldOverPlaced = false;

					//drawDeck();
			
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
					holdingTile = false;
					
					// STATE CHANGE
					idling = true;

					badTilePlacement = true;

					// Put tile back in deck
					//terrDistIndex--;
					//remainingTiles = TILE_NUM - terrDistIndex;
					//drawScreen();
				}
				//render();
				if (tileAngle !== 0) {
					tileAngle = 0;
				}
				//return;
			}

			//ANIMATE HOLDING TILE
			raycaster.setFromCamera(mouse3DVector, camera); 
			var pos = raycaster.ray.intersectPlane(zPlane);
			console.log("hovering board pos: (" + 
				pos.x + "," + pos.y + "," + pos.z + ")");		
			
			// If mouse position has changed
			//if (prevMouseX !== mouse.x || prevMouseY !== mouse.y) {
			console.log("about to traverse objects");
			scene.traverse (function (object) {
				if (object instanceof THREE.Mesh) {
					//console.log("Mesh detected. Object.name = " + object.name);
					
					var topString = 'topDeckHex' + (remainingTiles+1).toString();
					var leftString = 'leftDeckHex' + (remainingTiles+1).toString();
					var rightString = 'rightDeckHex' + (remainingTiles+1).toString();
					if (object.name === topString) {
						console.log('object.name = ' + object.name);
						object.position.z = 3*BOARD_HEIGHT;
						object.position.x = pos.x;
						object.position.y = pos.y + SIZE;
						//object.position.set(mouse.x, mouse.y + SIZE, 3*BOARD_HEIGHT);  
						console.log("topHex position: " + object.position.x + " " + object.position.y + " " + object.position.z);
					} else if (object.name === leftString) {
						console.log('object.name = ' + object.name);
						object.position.z = 3*BOARD_HEIGHT;
						object.position.x = pos.x - (WIDTH / 2);
						object.position.y = pos.y - (SIZE / 2);

						//object.position.set(mouse.x - (WIDTH / 2), mouse.y - (SIZE / 2), 3*BOARD_HEIGHT);  
						console.log("leftHex position: " + object.position.x + " " + object.position.y + " " + object.position.z);

					} else if (object.name === rightString) {
						console.log('object.name = ' + object.name);
						object.position.z = 3*BOARD_HEIGHT;
						object.position.x = pos.x + (WIDTH / 2);
						object.position.y = pos.y - (SIZE / 2);
						//object.position.set(mouse.x + (WIDTH / 2), mouse.y - (SIZE / 2), 3*BOARD_HEIGHT);

						/*console.log("rightHex position: " + object.position.x + " " + object.position.y + " " + object.position.z);
						console.log('');
						console.log("mouse.x: " + mouse.x + ", mouse.y: " + mouse.y);
						console.log('');*/

					}
				}
			});
		
		} else if (buildingTime) {
			console.log("In building logic");
			
			// todo
			if (startedBuilding) {
				startedBuilding = false;
				drawHutsTemplesAndTowers();
				if (hutsLeft() && buildingTime) {
					addExpandButtonMesh();
				}
			}
		} else if (holdingHut) {
			// todo
			drawHutsTemplesAndTowers();
			if (hutsLeft() && buildingTime) {
				addExpandButtonMesh();
			}
		} else if (holdingTower) {
			// todo
			drawHutsTemplesAndTowers();
			if (hutsLeft() && buildingTime) {
				addExpandButtonMesh();
			}
		} else if (holdingTemple) {
			// todo
			drawHutsTemplesAndTowers();
			if (hutsLeft() && buildingTime) {
				addExpandButtonMesh();
			}
		} else if (gameOver) {
			addGameOverMesh();
			composer.render();
			//renderer.render(scene, camera);
			return;
			// After players chosen
		} else {
			// code to remove meshes
			/*scene.remove(myMesh);
			myMesh.geometry.dispose();
			myMesh.material.dispose();
			myMesh = undefined;
			*/

		}
		prevMouseX = mouse.x;
		prevMouseY = mouse.y;
		//console.log('rendering scene');
		composer.render();
		//renderer.render(scene, camera);
		requestAnimationFrame(render);
		//requestAnimationFrame(animate);
	}
	render();
}

// Mouse move
function onDocumentMouseMove(e) {
	e.preventDefault();
		
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	//console.log("mouse.x: " + mouse.x + ", mouse.y: " + mouse.y);
	
	mouse3DVector.set(
		(e.clientX / window.innerWidth) * 2 - 1,
		- (e.clientY / window.innerHeight) * 2 + 1,
		0.5);
	//console.log("mouse3dVector.x: " + mouse3DVector.x + ", mouse3dVector.y: " + mouse3DVector.y);

}

// FINISH CONVERSION TO THREEJS
// ONLY SET THE STATES (MINIMIZE LOGIC)
function onDocumentMouseClick(e) {
	raycaster.setFromCamera(mouse, camera);
		
	var intersects = raycaster.intersectObjects(scene.children);
	console.log("intersects[0].object.name = " + intersects[0].object.name);

	// Choosing number of players: 1
	if (choosingPlayerNum && intersects[0].object.name === "button1") {
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
	}
	// Choosing number of players: 2
	else if (choosingPlayerNum && intersects[0].object.name === "button2") {
		// STATE CHANGE
		choosingPlayerNum = false;
		
		console.log("Clicked P2");
		players = new Array(2);
		for (var i = 0; i < 2; i++) {
			players[i] = 1;
		}
		// STATE CHANGE
		idling = true;
	}
	// Choosing number of players: 3
	else if (choosingPlayerNum && intersects[0].object.name === "button3") {
		// STATE CHANGE
		choosingPlayerNum = false;
		
		console.log("Clicked P3");
		players = new Array(3);
		for (var i = 0; i < 3; i++) {
			players[i] = 1;
		}
		// STATE CHANGE
		idling = true;
	}
	// Choosing number of players: 4
	else if (choosingPlayerNum && intersects[0].object.name === "button4") {
		// STATE CHANGE
		choosingPlayerNum = false;
		
		console.log("Clicked P4");
		players = new Array(4);
		for (var i = 0; i < 4; i++) {
			players[i] = 1;
		}
		// STATE CHANGE
		idling = true;
	}
	// If mouse is over draw deck
	else if (idling && 
		(intersects[0].object.name.startsWith("topDeckHex") ||
		intersects[0].object.name.startsWith("leftDeckHex") ||
		intersects[0].object.name.startsWith("rightDeckHex"))) {

		console.log("Clicked on deck");
		// STATE CHANGE
		idling = false;
		
		// moved to placedvalidtile
		justGrabbedTile = true;

		terrDistIndex++;
		remainingTiles = TILE_NUM - terrDistIndex;

		// STATE CHANGE
		holdingTile = true;
		console.log("Holding tile: " + holdingTile);

	// Else if mouse is over board && holdingTile	
	}  else if (holdingTile && intersects[0].object.name === "board") {
	//}  else if (idling && intersects[0].object.name === "board") {
		// STATE CHANGE
		//holdingTile = false;
		//idling = false;
		
		// Simple substate change
		tryingTilePlacement = true;
		
	// Clicked on huts
	} else if (buildingTime && intersects[0].object.name === "hut") {
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
	// Else if mouse is over board && holding Hut
	} else if (holdingHut && intersects[0].object.name === "board") {
		// STATE CHANGE
		holdingHut = false;

		// Draw a new hut at appropriate coordinates
		var hexRow = getHexRow(mouse.x, mouse.y);
		var hexCol = getHexCol(mouse.x, mouse.y, hexRow);
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
			// STATE CHANGE
			buildingTime = true;
		}
	// Clicked on towers
	} else if (buildingTime && intersects[0].object.name === "tower") {
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
	// Else if mouse is over board && holding Tower
	} else if (holdingTower && intersects[0].object.name === "board") {
		// STATE CHANGE
		holdingTower = false;

		// Draw a new tower at appropriate coordinates
		var hexRow = getHexRow(mouse.x, mouse.y);
		var hexCol = getHexCol(mouse.x, mouse.y, hexRow);
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
			// STATE CHANGE
			buildingTime = true;
		}
	// Clicked on temples
	} else if (buildingTime && intersects[0].object.name === "temple") {
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
	// Else if mouse is over board && holding Temple
	} else if (holdingTemple && intersects[0].object.name === "board") {
		//STATE CHANGE
		holdingTemple = false;

		// Draw a new tower at appropriate coordinates
		var hexRow = getHexRow(mouse.x, mouse.y);
		var hexCol = getHexCol(mouse.x, mouse.y, hexRow);
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
			// STATE CHANGE
			buildingTime = true;
		}
	// Else if mouse is over expand settlement button
	} else if (hutsLeft() && buildingTime && intersects[0].object.name === "expand") {
		// STATE CHANGE
		buildingTime = false;

		// STATE CHANGE
		pickingSettlement = true;
	// Else if mouse is over board and choosing settlement (expanding)
	//} else if (pickingSettlement && (PANEL_WIDTH+(WIDTH/2)) < mouseX && mouseX < (BOARD_WIDTH-(WIDTH/2)) && 
	//(3*SIZE/4) < mouseY && mouseY < (BOARD_HEIGHT-(3*SIZE/4))) {
	} else if (pickingSettlement && intersects[0].object.name === "board") {
		// STATE CHANGE
		pickingSettlement = false;

		var hexRow = getHexRow(mouse.x, mouse.y);
		var hexCol = getHexCol(mouse.x, mouse.y, hexRow);
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
	// Else if mouse is over board and choosing adjacent terrain (expanding)
	} else if (pickingAdjacentTerrainType && intersects[0].object.name === "board") {
		// STATE CHANGE
		pickingAdjacentTerrainType = false;

		var hexRow = getHexRow(mouse.x, mouse.y);
		var hexCol = getHexCol(mouse.x, mouse.y, hexRow);
		console.log("First selected settlement row: " + selectedSettlement[0].row + " col: " + selectedSettlement[0].col);
		if (isAdjacentToSelectedSettlement(hexRow, hexCol + Math.floor((ROWS-1)/2))) {
			// expand settlement
			expandSettlementV2(hexRow, hexCol + Math.floor((ROWS-1)/2));
			placedAtLeastOneBuilding = true;

			if (builtTwoOfThreeTypes()) {
				// Early Victory!
				gameOver = true;
			}

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

			doneBuilding = true;

		} else {
			alert("You must only expand settlements on hexagons adjacent to your established settlement.");
			// STATE CHANGE
			buildingTime = true;
		}
	}
}

// ONLY MANIPULATE STATE - BRING LOGIC INTO GAME LOOP
function onDocumentKeyPress(e) {
	if (holdingTile) {
		switch (e.key) {
		case 'r': // r = rotate
			tileAngle += 120 * (Math.PI/180);
			if (tileAngle >= (2*Math.PI - 0.1) && tileFlipped) {
				tileAngle = 60 * (Math.PI/180);
			} else if (tileAngle >= (2*Math.PI - 0.1)) {
				tileAngle = 0;
			}
			//drawScreen();
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
			//drawScreen();
			break;
		default:
			break;
		}
		console.log("Tile Angle: " + tileAngle * (180/Math.PI));
	}
}

document.addEventListener('keypress', onDocumentKeyPress, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('click', onDocumentMouseClick, false);
