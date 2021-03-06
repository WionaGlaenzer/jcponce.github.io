// Adapted by Juan Carlos Ponce Campuznao
// 03 Jul 2019
// From the Coding Challenge 130.3: 
// Drawing with Fourier Transform and Epicycles
// by Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU


const USER = 0;
const FOURIER = 1;

let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;

let button;
let orbits; //slider
let starting = false;
let canDraw = true;
let size = 1;

function setup() {
  let canvas = createCanvas(600, 600);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');

  colorMode(HSB, 1, 1, 1, 1);

  if (state == FOURIER) {
    resetSize();
  }

}

function draw() {
  background(0, 0, 1);

  //Initial message
  if (starting == false) {
    fill(0);
    stroke(0);
    textAlign(CENTER);
    textSize(32);
    text("Draw Something!", width / 2, height / 2);
  }

  cursor(HAND);

  stroke(0, 0, 0.6);
  strokeWeight(1.2);
  noFill();
  strokeJoin(ROUND);
  beginShape();
  for (let v of drawing) {
    vertex(v.x + width / 2, v.y + height / 2);
  }
  endShape(CLOSE);

  if (state == FOURIER && !canDraw) {
    let v = epicycles(width / 2, height / 2, 0, fourierX, orbits.value());

    path.unshift(v);

    stroke(0, 1, 0);
    strokeWeight(2.8);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierX.length;
    time += dt;

    fill(0);
    stroke(0);
    strokeWeight(0.5);
    textAlign(CENTER);
    textSize(16);
    text("Num. Orbits = " + orbits.value(), width / 2, 20);

    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }

}

// Other functions

function mouseDragged() {
  if (canDraw) {
    if (
      mouseX < width - 5 &&
      mouseY < height - 5 &&
      mouseX > 5 &&
      mouseY > 5
    ) {
      let point = createVector(mouseX - width / 2, mouseY - height / 2);
      drawing.push(point);
    }
  }
}


function epicycles(x, y, rotation, fourier, size_f) {
  for (let i = 0; i < size_f; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(0.6, 1, 1, 0.9);
    strokeWeight(1);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(0, 0, 0.6);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function mousePressed() {
  starting = true;
}

function resetSize() {
  orbits = createSlider(1, size, size, 1);
  orbits.position(30, 610);
  orbits.style('width', '530px');
  orbits.changed(emptyFourier);
}

function emptyFourier() {
  path = [];
  time = 0;
}

function mouseReleased() {

  if (canDraw) {
    const skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(new Complex(drawing[i].x, drawing[i].y));
    }
    fourierX = dft(x);

    fourierX.sort((a, b) => b.amp - a.amp);
    size = fourierX.length;
    resetSize();
  }
  if (
    mouseX < width - 10 &&
    mouseY < height - 10 &&
    mouseX > 10 &&
    mouseY > 10
  ) {
    canDraw = false;
    state = FOURIER;
  }

}

/*function remakeDrawing() {
  state = -1;
  drawing = [];
  x = [];
  time = 0;
  path = [];

  canDraw = true;
  size = 1;
  resetSize();
}*/
