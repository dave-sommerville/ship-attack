'use strict';
import {Cell} from"./Cell.js";
import {Player} from "./Player.js";
import {Ship} from "./Ship.js";
import {select, selectAll, sleep, listen, addClass, removeClass, create} from "./utilities.js";
/*------------------------------------------------------------------------->
  Elements
<-------------------------------------------------------------------------*/
const startButton = select('.start-btn');
const gameGrid = select('.game-grid'); 
const displayGrid = select('.display-grid');
const startControls = select('.start-controls');
const shipMenu = select('.ship-menu');
const textDisplayOne = select('.descriptive-text');
const textDisplayTwo = select('.descriptive-text-two');
const resetButton = select('.reset-btn');
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
let placedShipObjs = {};
let selectedShip = null;
let addedShips = [];

/*  -- Game States --  */
let user = null;
let computer = null;
createGameGrid();
createDisplayGrid();
/*------------------------------------------------------------------------->
  Listeners
<-------------------------------------------------------------------------*/
function resetGame() {
  placedShipCells = new Set();
  placedShipObjs = {};
  selectedShip = null;
  addedShips = [];
  user = null;
  computer = null;
  displayGrid.innerHTML = '';
  gameGrid.innerHTML = '';
  textDisplayOne.innerText = "";
  removeClass(startControls, 'hidden');
  addClass(resetButton, 'hidden');
  createGameGrid();
  createDisplayGrid();
}

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
listen('click', resetButton, ()=> {
  resetGame();
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
  computer.attackResult(cell.key, textDisplayOne);
  computer.displayComputerGrid(allGameGridCells);
  // Computer randomly attacks user
  const compTarget = user.getRandomUntriedCell(gridSize, allDisplayGridCells);
  if (compTarget) {
    user.attackResult(compTarget.key, textDisplayTwo);
    user.displayUserGrid(allDisplayGridCells);
  }
  if(computer.hasLost() && user.hasLost()) {
    textDisplayOne.innerText = "It's a tie";
    textDisplayTwo.innerText = '';
    removeClass(resetButton, 'hidden');
  } else if (computer.hasLost()) {
    textDisplayOne.innerText = "You win!";
    textDisplayTwo.innerText = '';
    removeClass(resetButton, 'hidden');
  } else if (user.hasLost()) {
    textDisplayOne.innerText = "You lose!";
    textDisplayTwo.innerText = '';
    removeClass(resetButton, 'hidden');
  }
}

function initializeGame() {
  removeClass(displayGrid, 'hidden');
  addClass(startControls, 'hidden');
  user = new Player("User", placedShipCells);
  computer = new Player('Computer', new Set());
  addClass(gameGrid, 'in-play');
  computer.randomlyPlaceShips(shipsByName, gridSize);
  computer.displayComputerGrid(allGameGridCells); // <- computer's perspective shown on gameGrid
  user.displayUserGrid(allDisplayGridCells);
  selectedShip = null;
  addClass(resetButton, 'hidden');
}

function tryPlaceShip(startRow, startCol, shipChoice) {
  if (!shipChoice) {
    alert("You must choose a ship type.");
    return;
  }

  const shipName = shipChoice.name.toLowerCase();
  const positions = [];

  for (let i = 0; i < shipChoice.size; i++) {
    let row = startRow;
    let col = startCol;
    if (shipChoice.orientation === 'horizontal') col += i;
    if (shipChoice.orientation === 'vertical') row += i;

    const key = `${row},${col}`;
    if (row >= gridSize || col >= gridSize || placedShipCells.has(key)) {
      alert('Cannot place boat here!');
      return;
    }
    positions.push(key);
  }

  // Clear previous position for same ship
  if (placedShipObjs[shipName]) {
    placedShipObjs[shipName].forEach(key => {
      placedShipCells.delete(key);
      const cell = allGameGridCells[key];
      if (cell) cell.removeClass('occupied');
    });
  }

  // Add to grid
  positions.forEach((key) => {
    placedShipCells.add(key);
    const cell = allGameGridCells[key];
    if (cell) cell.addClass('occupied');
  });

  placedShipObjs[shipName] = positions;

  // === ✅ Add ship name to addedShips if not already there ===
  if (!addedShips.includes(shipName)) {
    addedShips.push(shipName);
  }

  // === ✅ Loop through radio buttons and update visual state ===
  const shipRadios = document.querySelectorAll('input[name="ship-select"]');
  shipRadios.forEach(input => {
    const label = document.querySelector(`label[data-ship="${input.value}"]`);
    if (label && addedShips.includes(input.value)) {
      label.classList.add('placed');
    }
  });
  // === ✅ Start button visibility ===
  if (Object.keys(placedShipObjs).length === Object.keys(shipsByName).length) {
    if (!startButton.classList.contains('visible')) {
      addClass(startButton, 'visible');
    }
  } else {
    if (startButton.classList.contains('visible')) {
      removeClass(startButton, 'visible');
    }
  }
}
