let grid;
let cols, rows;

let radius = 4;
let cellsize = 10;

let mode = 1;

function setup() {
	createCanvas(900, 750);
	background(50);
	cols = round(width / cellsize);
	rows = round(height / cellsize);
	grid = new Grid(cols, rows, cellsize);
}

function draw() {
	if (mouseIsPressed) {
		let x = floor(mouseX / cellsize);
		let y = floor(mouseY / cellsize);
		x = clamp(x, 0, cols - 1);
		y = clamp(y, 0, rows - 1);
		for (let yOff = -radius; yOff <= radius; yOff++) {
			for (let xOff = -radius; xOff <= radius; xOff++) {
				if (
					xOff * xOff + yOff * yOff <= radius * radius &&
					round(random(1, 2)) < 2
				) {
					grid.set(x + xOff, y + yOff, mode);
				}
			}
		}
	}
	grid.update();
	grid.show();
}

function mouseReleased() {
	mode = 1;
}

function mousePressed() {
	let x = floor(mouseX / cellsize);
	let y = floor(mouseY / cellsize);
	x = clamp(x, 0, cols - 1);
	y = clamp(y, 0, rows - 1);
	if (grid.cells[y][x] === 1) {
		mode = 0;
	}
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

class Grid {
	constructor(cols, rows, cellsize) {
		this.cols = cols;
		this.rows = rows;
		this.cellsize = cellsize;
		this.cells = [];

		for (let y = 0; y < this.rows; y++) {
			this.cells[y] = [];
			for (let x = 0; x < this.cols; x++) {
				this.cells[y][x] = 0;
			}
		}
	}

	show() {
		noStroke();
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				if (this.cells[y][x] === 1) {
					let n = noise(x * 0.4, y * 0.4, frameCount * 0.01);
					let c = map(n, 0, 1, 150, 255);
					fill(c, c * 0.7, c * 0.5);
					rect(
						x * this.cellsize,
						y * this.cellsize,
						this.cellsize,
						this.cellsize
					);
				} else {
					fill(50);
					rect(
						x * this.cellsize,
						y * this.cellsize,
						this.cellsize,
						this.cellsize
					);
				}
			}
		}
	}

	update() {
		for (let x = this.cols; x >= 0; x--) {
			for (let y = this.rows - 1; y >= 0; y--) {
				let state = this.cells[y][x];
				if (state === 1) {
					if (y + 1 < this.rows) {
						let cellBelow = this.cells[y + 1][x];
						if (cellBelow === 0) {
							this.swap(x, y, x, y + 1);
						} else {
							let cellRight = this.inBounds(x + 1, y + 1)
								? this.cells[y + 1][x + 1]
								: 1;
							let cellLeft = this.inBounds(x - 1, y + 1)
								? this.cells[y + 1][x - 1]
								: 1;
							if (cellRight === 0 && random(1) < 0.5) {
								this.swap(x, y, x + 1, y + 1);
							} else if (cellLeft === 0) {
								this.swap(x, y, x - 1, y + 1);
							}
						}
					}
				}
			}
		}
	}

	set(x, y, state) {
		if (this.inBounds(x, y)) {
			this.cells[y][x] = state;
		}
	}

	swap(x1, y1, x2, y2) {
		if (this.inBounds(x1, y1) && this.inBounds(x2, y2)) {
			let temp = this.cells[y1][x1];
			this.cells[y1][x1] = this.cells[y2][x2];
			this.cells[y2][x2] = temp;
		} else {
			return;
		}
	}

	inBounds(x, y) {
		return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
	}

	isEmpty(x, y) {
		return this.cells[y][x] === 0;
	}
}
