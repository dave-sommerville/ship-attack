'use strict';
import {Ship} from './Ship.js';
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

  for (const shipName in shipsByName) {
    const template = shipsByName[shipName];
    let placedSuccessfully = false;
    let attempts = 0;

    while (!placedSuccessfully && attempts < 100) {
      attempts++;

      const orientation = orientations[Math.floor(Math.random() * 2)];
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      const positions = [];

      for (let i = 0; i < template.size; i++) {
        let row = startRow;
        let col = startCol;
        if (orientation === 'horizontal') col += i;
        else row += i;

        const key = `${row},${col}`;
        if (row >= gridSize || col >= gridSize || occupied.has(key)) {
          break; // fail and retry
        }

        positions.push(key);
      }

      if (positions.length === template.size) {
        positions.forEach(key => occupied.add(key));
        placed[template.name] = positions;
        placedSuccessfully = true;
      }
    }

    if (!placedSuccessfully) {
      console.error(`Failed to place ship: ${template.name}`);
      throw new Error(`Failed to place ${template.name}`);
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