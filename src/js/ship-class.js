'use strict';

class Ship {
  #name;
  #y; 
  #x;
  #orientation;
  #size;
  #shipArr; // Array representing the ship's positions

  constructor(name, y, x, orientation, size) {
    this.name = name;
    this.y = y;
    this.x = x;
    this.orientation = orientation;
    this.size = size;
    this.#calculateShipArr(); 
  }
  set name(name) {
    this.#name = name;
  }
  set y(y) {
    this.#y = y;
    this.#calculateShipArr(); 
  }
  set x(x) {
    this.#x = x;
    this.#calculateShipArr(); 
  }
  set orientation(orientation) {
    this.#orientation = orientation;
    this.#calculateShipArr(); 
  }
  set size(size) {
    this.#size = size;
    this.#calculateShipArr(); 
  }
  get name() {
    return this.#name;
  }

  get y() {
    return this.#y;
  }
  get x() {
    return this.#x;
  }
  get orientation() {
    return this.#orientation;
  }
  get size() {
    return this.#size;
  }
  get shipArr() {
    return this.#shipArr; 
  }

  #calculateShipArr() {
    const shipArray = [];
    for (let i = 0; i < this.#size; i++) {
      if (this.#orientation === 'horizontal') {
        shipArray.push([this.#x + i, this.#y]); 
      } else if (this.#orientation === 'vertical') {
        shipArray.push([this.#x, this.#y + i]); 
      }
    }
    this.#shipArr = shipArray;
  }
}

const myShip = new Ship(2, 3, 'horizontal', 4);
console.log(myShip.shipArr); // Output: [[3, 2], [4, 2], [5, 2], [6, 2]]

myShip.orientation = 'vertical';
console.log(myShip.shipArr); // Output: [[3, 2], [3, 3], [3, 4], [3, 5]]

