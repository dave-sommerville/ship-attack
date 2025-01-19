'use strict';
'use strict';

class Ship {
	#orientation;
	#size;

	constructor(orientation, size){
		this.orientation = orientation;
		this.size = size;
	}

	set orientation(orientation){
		this.#orientation = orientation;
	}
	set size(size) {
		this.#size = size;
	}

	get orientation() {
		return this.#orientation;
	}
	get size() {
		return this.#size;
	}
}

