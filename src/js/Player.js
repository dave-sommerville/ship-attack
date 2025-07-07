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
  attackResult(cell) {
    if(this.#occupiedCells.has(cell)) {
      this.#damagedShipCells.add(cell); // Print message either way
    } else {
      this.#missedShots.add(cell);
    }
  }
}