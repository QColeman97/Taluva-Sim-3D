
function getRandomInt(max) {
  	return Math.floor(Math.random() * Math.floor(max));
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

//Uses Durstenfeld shuffle algorithm
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
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