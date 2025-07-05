'use strict';

/*------------------------------------------------------------------------->
  Utility Functions 
<-------------------------------------------------------------------------*/

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

function isImageFile(file) {
  return file && file.type.startsWith('image');
}

function generateUniqueId() {
  return '#:' + Date.now();
}

function addClass(element, customClass) {
  element.classList.add(customClass);
  return element;
}

function removeClass(element, customClass) {
  element.classList.remove(customClass);
  return element;
}

function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

function assignId(element) {
  element.id = generateUniqueId();
  return element;
}

function createImage(imageSrc) {
  const img = document.createElement('img');
  img.src = imageSrc;  
  img.alt = imageSrc; // Because the photo could be anything 
  return img;
}

function create(element) {
  const newElement = document.createElement(element); 
  return newElement;
}

function addText(element, text) {
  element.textContent = text; 
}

//Gives Random Boolean
let yesOrNo = Math.random() >= 0.5;

//Random Hex color (needs fixing)
let randColor = Math.floor(Math.random() * 0xffffff).toString(16);
function getRandomNum(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDate() {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  };

  return new Date().toLocaleDateString('en-ca', options);
}

'use strict';

class Ship {
  #name;
  #orientation;
  #size;

  constructor(name, orientation, size) {
    this.name = name;
    this.orientation = orientation;
    this.size = size;
  }
  set name(name) {
    this.#name = name;
  }

  set orientation(orientation) {
    this.#orientation = orientation;
  }
  set size(size) {
    this.#size = size;
  }
  get name() {
    return this.#name;
  }

  get orientation() {
    return this.#orientation;
  }
  get size() {
    return this.#size;
  }
}

class Cell {
  #row;
  #col;
  #key;
  #element;

  constructor(row, col, element) {
    this.row = row;
    this.col = col;
    this.element = element;
  }
  set row(row) {
    this.#row = row;
  }
  set col(col) {
    this.#col = col;
  }
  set element(element) {
    this.#element = element;
  }

  get row() {
    return this.#row;
  }
  get col() {
    return this.#col;
  }
  get element() {
    return this.#element;
  }
get key() {
  return `${this.#row},${this.#col}`;
}

  addClass(cls) {
    this.#element.classList.add(cls);
  }
  removeClass(cls) {
    this.#element.classList.remove(cls);
  }
}


class Player {
  #name;
  #placedAllShips = false;
  #occupiedCells = new Set();
  #damagedShipCells = new Set();
  constructor(name) {
    this.name = name;
  }
  addCell(cell) {
    this.#occupiedCells.add(cell);
    if(this.#occupiedCells.length === 17) placedShips = true;
  }
  deleteCell(cell) {
    this.#occupiedCells.delete(cell);
    if(this.#occupiedCells.length < 17) placedShips = false;
  }
  hasCell(cell) {
    return this.#occupiedCells.has(cell);
  }
  checkForHit(cell) {
    if(this.#occupiedCells.has(cell)) this.#damagedShipCells.add(cell);
    // Could check for win condition at this point
  }
  get name() {
    return this.#name;
  }
  get placedAllShips() {
    return this.#placedAllShips;
  }
  get occupiedCells() {
    return this.#occupiedCells;
  }
  get damagedShipCells() {
    return this.#damagedShipCells;
  }
}


/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/

const gridSize = 10;
const grid = select('.game-grid'); // This will shink and become a secondary screen for player. It will also have to show where the computer has hit during game play.
// Gamplay grid will have to check players choice (the dataset of the grid) vs the computer player's occupiedCells
let occupiedCells = new Set();
const placedShips = {};
let selectedShip = null;
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
let isRunning = false; // Need to make a wrapper for all actions within this




const shipMenu = select('.ship-menu');

// for(let row = 0; row < gridSize; row++) {
//   for(let col = 0; col < gridSize; col++){
//     const cell = create('div');
//     addClass(cell, 'grid-cell');
//     cell.dataset.row = row;
//     cell.dataset.col = col;
//     grid.appendChild(cell);
//     listen('click', cell, () => {
//       tryPlaceShip(row, col, selectedShip);
//     });
//   }
// }


const allCells = {}; // Map from key ("row,col") to Cell instance

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
        // Create switch function for intialization vs gameplay
      });
    }
  }
}

function computerShipPlacement() {
  for (let i = 0; i < shipsByName.length; i++) {
    let row = getRandomNum(0, gridSize);
    let col = getRandomNum(0, gridSize);
    tryPlaceShip(row, col, shipsByName[i]);
  }
}

function tryPlaceShip(startRow, startCol, shipChoice) {
  if(!shipChoice) {
    alert("You must choose a ship type."); // The alerts need to become error catches, especially because computer will use this function too
    return;
  }
  const shipName = shipChoice.name;
  const positions = [];

  for(let i = 0; i < shipChoice.size; i++) {
    let row = startRow;
    let col = startCol;
    if(shipChoice.orientation === 'horizontal') col += i;
    if(shipChoice.orientation === 'vertical') row += i;
    const key = `${row}, ${col}`;
    if(row >= gridSize ||  col >= gridSize || occupiedCells.has(key)) {
      alert('Cannot place boat here!');
      return;
    }
    positions.push(key);
  }
  if(placedShips[shipName]) {
    placedShips[shipName].forEach(key => {
      occupiedCells.delete(key);
      const key = `${row},${col}`;
      const cell = allCells[key];
      if (cell) cell.addClass('occupied');
    });
  }
  positions.forEach((key) => {
    occupiedCells.add(key);
  const key = `${row},${col}`;
  const cell = allCells[key];
  if (cell) cell.addClass('occupied');
    });
  placedShips[shipName] = positions;
}

function highlightPlayerCells(player) {
  for (const key in allCells) {
    const cell = allCells[key];
    cell.removeClass('occupied');
    cell.removeClass('damaged');

    if (player.occupiedCells.has(key)) {
      cell.addClass('occupied');
    }
    if (player.damagedCells.has(key)) {
      cell.addClass('damaged');
    }
  }
}


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
listen('keydown', this, (e) => {
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