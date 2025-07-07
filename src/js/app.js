'use strict';
import {Cell} from"./Cell.js";
import {Player} from "./Player.js";
import {Ship} from "./Ship.js";
import {select, selectAll, listen, addClass, removeClass, create} from "./utilities.js";
/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/
const startButton = select('.start-btn');
const grid = select('.game-grid'); 
const shipMenu = select('.ship-menu');

/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/
/*  -- Game Grid --  */
const gridSize = 10;
const allCells = {}; 
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
createGrid();

/*------------------------------------------------------------------------->
  Listeners
<-------------------------------------------------------------------------*/

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

function createGrid() {
  for(let row = 0; row < gridSize; row++) {
    for(let col = 0; col < gridSize; col++) {
      const div = create('div');
      addClass(div, 'grid-cell');
      div.dataset.row = row;
      div.dataset.col = col;

      const cell = new Cell(row, col, div);
      allCells[cell.key] = cell;

      grid.appendChild(div);
      listen('click', div, () => {
        if (!user) {
          tryPlaceShip(row, col, selectedShip);
        } else {
          takeTurn(allCells[`${row},${col}`]);
        }
      });
    }
  }
}

function interfaceSwitch(cell, row, col, selectedShip) {
  if(!user) {
    tryPlaceShip(row, col, selectedShip);
  } else {
    takeTurn(cell);
  }
}
function takeTurn(cell) {
  // User attacks computer
  computer.attackResult(cell.key);
  computer.displayComputerGrid(allCells);

  // Computer randomly attacks user
  const compTarget = user.getRandomUntriedCell(gridSize, allCells);
  if (compTarget) {
    user.attackResult(compTarget.key);
    user.displayUserGrid(allCells);
  }
}

function initializeGame() {
  user = new Player("User", placedShipCells);
  computer = new Player('Computer', new Set());
  computer.randomlyPlaceShips(allCells, shipsByName, gridSize);


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
      const cell = allCells[key];
      if (cell) cell.removeClass('occupied');
    });
  }
  positions.forEach((key) => {
    placedShipCells.add(key);
  const cell = allCells[key];
  if (cell) cell.addClass('occupied');
    });
  placedShipObjs[shipName] = positions;
  if(placedShipObjs.length === shipsByName.length) {
    if(!startButton.classList.contains('visible')) {
      addClass(startButton, 'visible');
    }
  } else {
    if(startButton.classList.contains('visible') ) {
      removeClass(startButton, 'visible');
    }
  }
}

