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




/*------------------------------------------------------------------------->
  Main code 
<-------------------------------------------------------------------------*/

const gridSize = 10;
const grid = select('.game-grid');
const occupiedCells = new Set();
let boatLength;
let orientation;
let isPlacingShips = true;
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
const placedShips = {};

const shipMenu = select('.ship-menu');

for(let row = 0; row < gridSize; row++) {
  for(let col = 0; col < gridSize; col++){
    const cell = create('div');
    addClass(cell, 'grid-cell');
    cell.dataset.row = row;
    cell.dataset.col = col;
    grid.appendChild(cell);
    listen('click', cell, () => {
      tryPlaceShip(row, col, selectedShip);
    });
  }
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
      const [r,c] = key.split(',').map(Number);
      const cell = select(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
      if(cell) removeClass(cell,'occupied');
    });
  }
  positions.forEach((key) => {
    occupiedCells.add(key);
    const [r, c] = key.split(',').map(Number);
    const cell = select(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
    if(cell) {
      addClass(cell, 'occupied');
    }
  });
  placedShips[shipName] = positions;
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