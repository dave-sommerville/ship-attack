'use strict';

class Ship {
  #name;
  #y; 
  #x;
  #boundary;
  #orientation;
  #size;
  #shipArr; // Array representing the ship's positions

  constructor(name, y, x, boundary, orientation, size) {
    this.name = name;
    this.y = y;
    this.x = x;
    this.boundary = boundary;
    this.orientation = orientation;
    this.size = size;
    this.#calculateShipArr(); 
  }
  set name(name) {
    this.#name = name;
  }

  set y(value) {
    if (Number.isInteger(value) && value >= 0 && value <= this.boundary) {
      this.#y = value;
      this.#calculateShipArr();
    } else {
      throw new Error(`y must be an integer between 0 and ${this.boundary}.`);
    }
  }

  set x(value) {
    if (Number.isInteger(value) && value >= 0 && value <= this.boundary) {
      this.#x = value;
      this.#calculateShipArr();
    } else {
      throw new Error(`x must be an integer between 0 and ${this.boundary}.`);
    }
  }
  
  set boundary(boundary) {
    this.#boundary = boundary;
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
  get boundary() {
    return this.#boundary;
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

