'use strict';

export class Player {
  #name;
  #occupiedCells = new Set();
  #damagedShipCells = new Set();
  #missedShots = new Set();
  constructor(name, occupiedCells) {
    this.#name = name;
    this.#occupiedCells = occupiedCells
  }

  get name() {
    return this.#name;
  }

  randomlyPlaceShips(shipsByName, gridSize) {
  const placed = {};
  const occupied = new Set();
  const orientations = ['horizontal', 'vertical'];

  const shipArray = Object.values(shipsByName); // 🔑 FIX

  for (let i = 0; i < shipArray.length; i++) {
    const ship = shipArray[i];
    let placedSuccessfully = false;

    while (!placedSuccessfully) {
      const orientation = orientations[Math.floor(Math.random() * 2)];
      ship.orientation = orientation;

      let startRow = Math.floor(Math.random() * gridSize);
      let startCol = Math.floor(Math.random() * gridSize);

      const positions = [];

      for (let j = 0; j < ship.size; j++) { // Changed inner loop `i` to `j`
        let row = startRow;
        let col = startCol;

        if (orientation === 'horizontal') col += j;
        if (orientation === 'vertical') row += j;

        const key = `${row},${col}`;

        if (
          row >= gridSize ||
          col >= gridSize ||
          occupied.has(key)
        ) {
          break;
        }

        positions.push(key);
      }

      if (positions.length === ship.size) {
        for (const key of positions) {
          occupied.add(key);
        }
        placed[ship.name] = positions;
        placedSuccessfully = true;
      }
    }
  }

  this.#occupiedCells = occupied;
}


  displayUserGrid(fullGrid) {
    for(const key in fullGrid) {
      const cell = fullGrid[key];
      cell.removeClass('occupied');
      cell.removeClass('damaged');
      cell.removeClass('miss');
      if(this.#occupiedCells.has(key)) {
        cell.addClass('occupied');
      }
      if(this.#damagedShipCells.has(key)) {
        cell.addClass('damaged');
      }
      if(this.#missedShots.has(key)) {
        cell.addClass('miss');
      }
    }
  }
    displayComputerGrid(fullGrid) {
    for(const key in fullGrid) {
      const cell = fullGrid[key];
      cell.removeClass('damaged');
      cell.removeClass('miss');
      if(this.#damagedShipCells.has(key)) {
        cell.addClass('damaged');
      }
      if(this.#missedShots.has(key)) {
        cell.addClass('miss');
      }
    }
  }
  attackResult(cellKey) {
    if (this.#occupiedCells.has(cellKey)) {
      this.#damagedShipCells.add(cellKey); 
      console.log(`Attack hits ${this.#name}'s ship.`);
    } else {
      this.#missedShots.add(cellKey);
      console.log(`Attack misses ${this.#name}'s ship.`);
    }
  }
  getRandomUntriedCell(gridSize, allCells) {
  const tried = new Set([...this.#damagedShipCells, ...this.#missedShots]);
  const options = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const key = `${row},${col}`;
      if (!tried.has(key)) {
        options.push(key);
      }
    }
  }

  if (options.length === 0) return null;

  const key = options[Math.floor(Math.random() * options.length)];
  return allCells[key]; // return the actual Cell instance
}

}