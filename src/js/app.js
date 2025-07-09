'use strict';
import {Cell} from"./Cell.js";
import {Player} from "./Player.js";
import {Ship} from "./Ship.js";
import {select, selectAll, listen, addClass, removeClass, create} from "./utilities.js";
/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/
const startButton = select('.start-btn');
const gameGrid = select('.game-grid'); 
const displayGrid = select('.display-grid');
const shipMenu = select('.ship-menu');
const textDisplay = select('h2');
/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/
/*  -- Game Grid --  */
const gridSize = 10;
const allGameGridCells = {}; 
const allDisplayGridCells = {};
/*  -- Ships --  */
const carrier = new Ship("Carrier", "vertical", 5);
const battleship = new Ship("Battleship", "vertical", 4);
const cruiser = new Ship("Cruiser", "vertical", 3);
const submarine = new Ship("Submarine", "vertical", 3);
const destroyer = new Ship("Destroyer", "vertical", 2);
const shipsByName = {
  carrier,
  battleship,
  cruiser,
  submarine,
  destroyer
};
/*  -- Selection Menu --  */
let placedShipCells = new Set();
const placedShipObjs = {};
let selectedShip = null;

/*  -- Game States --  */
let user = null;
let computer = null;
createGameGrid();
createDisplayGrid();
/*------------------------------------------------------------------------->
  Listeners
<-------------------------------------------------------------------------*/
listen('click', startButton, () =>{
  initializeGame();
});
listen('change', shipMenu, (e)=>{
  const selectedName = select('input[name="ship-select"]:checked')?.value;
  if(selectedName && shipsByName[selectedName]) {
    selectedShip = shipsByName[selectedName];
    console.log("Selected Ship: ", selectedShip.name);
  } else {
    selectedShip = null;
    alert("No ship selected");
  }
});
listen('keydown', document, (e) => {
  if (e.key === 'r' || e.key === 'R') {
    console.log("Key pressed");
    if (selectedShip) {
      console.log("ship present");
      if(selectedShip.orientation === 'horizontal') {
        selectedShip.orientation = 'vertical';
      } else if(selectedShip.orientation === 'vertical') {
        selectedShip.orientation = 'horizontal';
      }
    }
  }
});

/*------------------------------------------------------------------------->
  Functions
<-------------------------------------------------------------------------*/

function createGameGrid() {
  for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
      const div = create('div');
      addClass(div, 'grid-cell');
      div.dataset.row = row;
      div.dataset.col = col;

      const cell = new Cell(row, col, div);
      allGameGridCells[cell.key] = cell;

      gameGrid.appendChild(div);
      listen('click', div, () => {
        if (!user) {
          tryPlaceShip(row, col, selectedShip);
        } else {
          takeTurn(allGameGridCells[`${row},${col}`]);
        }
      });
    }
  }
}

function createDisplayGrid() {
  for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
      const div = create('div');
      addClass(div, 'grid-cell');
      div.dataset.row = row;
      div.dataset.col = col;

      const cell = new Cell(row, col, div);
      allDisplayGridCells[cell.key] = cell;

      displayGrid.appendChild(div);
    }
  }
}

function takeTurn(cell) {
  // User attacks computer
  if (!user || !computer) return;
  computer.attackResult(cell.key);
  computer.displayComputerGrid(allGameGridCells);

  // Computer randomly attacks user
  const compTarget = user.getRandomUntriedCell(gridSize, allDisplayGridCells);
  if (compTarget) {
    user.attackResult(compTarget.key);
    user.displayUserGrid(allDisplayGridCells);
  }
  if(computer.hasLost() && user.hasLost()) {
    textDisplay.innerText = "It's a tie";
  } else if (computer.hasLost()) {
    textDisplay.innerText = "You win!";
  } else if (user.hasLost()) {
        textDisplay.innerText = "You lose!";
  }
}

function initializeGame() {
  user = new Player("User", placedShipCells);
  computer = new Player('Computer', new Set());
  computer.randomlyPlaceShips(shipsByName, gridSize);
  computer.displayComputerGrid(allGameGridCells); // <- computer's perspective shown on gameGrid
  user.displayUserGrid(allDisplayGridCells);
  selectedShip = null;
}

function tryPlaceShip(startRow, startCol, shipChoice) {
  if(!shipChoice) {
    alert("You must choose a ship type."); 
    return;
  }
  const shipName = shipChoice.name;
  const positions = [];

  for(let i = 0; i < shipChoice.size; i++) {
    let row = startRow;
    let col = startCol;
    if(shipChoice.orientation === 'horizontal') col += i;
    if(shipChoice.orientation === 'vertical') row += i;
      const key = `${row},${col}`;
    if(row >= gridSize ||  col >= gridSize || placedShipCells.has(key)) {
      alert('Cannot place boat here!');
      return;
    }
    positions.push(key);
  }
  if(placedShipObjs[shipName]) {
    placedShipObjs[shipName].forEach(key => {
      placedShipCells.delete(key);
      const cell = allGameGridCells[key];
      if (cell) cell.removeClass('occupied');
    });
  }
  positions.forEach((key) => {
    placedShipCells.add(key);
  const cell = allGameGridCells[key];
  if (cell) cell.addClass('occupied');
    });
  placedShipObjs[shipName] = positions;
  if(Object.keys(placedShipObjs).length === Object.keys(shipsByName).length) {
  if(!startButton.classList.contains('visible')) {
    addClass(startButton, 'visible');
    }
  } else {
    if(startButton.classList.contains('visible') ) {
      removeClass(startButton, 'visible');
    }
  }
}

