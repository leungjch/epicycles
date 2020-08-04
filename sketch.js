let x = [];
let fourierX;


let time = 0;
let nSliders = [];
let n = 0;
let radiusSliders = [] ;
let velocitySliders = [];
let resetButtons = [];
let radiusArr = [];
let velocityArr = [];
let phaseArr = [];

let origPoint = [0,0];

let radiusInputs = [];
let velocityInputs = [];

var radiusParagraph;
var velocityParagraph;

let HEIGHT = 1000;
let WIDTH  = 1920;
let PATHLIMIT = 2500;
let GRAPHLIMIT = 2500;
let scale = 100;
let speed = 0.01;

let path = [];
let graph = [];
let periods = [];
let lastTime = 0;
periods.push(0);
let periodSum = 0;
let showPath_points = false;
let showPath_lines = false;
let showGraph = false;
let showCircles = true; 
let C = 1;

function median(numbers) {
  // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
  var median = 0, numsLen = numbers.length;
  numbers.sort();

  if (
      numsLen % 2 === 0 // is even
  ) {
      // average of two middle numbers
      median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
  } else { // is odd
      // middle number only
      median = numbers[(numsLen - 1) / 2];
  }

  return median;
}

class Complex {
  constructor(a, b) {
    this.re = a;
    this.im = b;
  }

  add(c) {
    this.re += c.re;
    this.im += c.im;
  }

  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }
}

function dft(x) {
  const X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let sum = new Complex(0, 0);
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      const c = new Complex(cos(phi), -sin(phi));
      sum.add(x[n].mult(c));
    }
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    let freq = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let phase = atan2(sum.im, sum.re);
    X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
  }
  return X;
}

function setup() {
  frameRate(120)
  c = createCanvas(WIDTH, HEIGHT);
  print("hi")
  const skip = 1;
  print(drawing.length)
  for (let l = 0; l < drawing.length; l += skip) {
    const z = new Complex(drawing[l].x*0.01, drawing[l].y*0.01);
    point(drawing[l].x*0.01, drawing[l]*0.01);
    x.push(z);
    print(l)

  }

  xy = x
  // calculate fourier transform
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);

  // turn DFT into epicycles
  // comment out when you dont want to use FT
  // for (let h = 0; h < fourierX.length; h++)
  // {
  //   velocityArr.push(fourierX[h].freq) 
  //   radiusArr.push(fourierX[h].amp*100) 
  //   phaseArr.push(fourierX[h].phase)
  //   n+=1
  // }
function copyToClipboard(val){
    var dummy = document.createElement("input");
    dummy.style.display = 'none';
    document.body.appendChild(dummy);

    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value=val;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
  // save fourier transformed points
  console.log(JSON.stringify(fourierX))
  screenshotButton = createButton('save screenshot');
  screenshotButton.position(20, 45);
  screenshotButton.mousePressed(screenshot);


  buttonAdd = createButton('add epicycle');
  buttonAdd.position(20, 15);
  buttonAdd.mousePressed(addEpicycle);


  graphCheckbox = createCheckbox('graph', false);
  graphCheckbox.position(120, 20)
  graphCheckbox.changed(toggleGraph);

  pathCheckbox = createCheckbox('path_points', false);
  pathCheckbox.position(240, 20)
  pathCheckbox.changed(togglePath_points);

  pathCheckbox = createCheckbox('path_lines', false);
  pathCheckbox.position(360, 20)
  pathCheckbox.changed(togglePath_lines);



  circleCheckbox = createCheckbox('circles', true);
  circleCheckbox.position(480, 20)
  circleCheckbox.changed(toggleCircles);

  timeSlider = createSlider(-0.01, 0.1, 0.01, 0.0001);
  timeSlider.position(20, 60);
  timeSlider.changed(resetGraphPath);

  radiusParagraph = createP('Radii:');
  velocityParagraph = createP('Velocities:');

  screenshotName = createInput("myScreenshot");
  screenshotName.position(200, 45);

  buttonAddDup_1 = createButton('duplicate first');
  buttonAddDup_1.position(20, 80);
  buttonAddDup_1.mousePressed(function() { addEpicycle(true, 1);});

  buttonAddDup_50 = createButton('duplicate 50');
  buttonAddDup_50.position(150, 80);
  buttonAddDup_50.mousePressed(function() { addEpicycle(true, 100);});

  buttonAddDup_100 = createButton('duplicate 100');
  buttonAddDup_100.position(250, 80);
  buttonAddDup_100.mousePressed(function() { addEpicycle(true, 100);});


  function toggleGraph() {
  if (this.checked()) {
    console.log('turning graph on!');
    showGraph = true;
  } else {
    console.log('turning graph off!');
    showGraph = false;
  }
}
function togglePath_points() {
  if (this.checked()) {
    console.log('turning path points on!');
    showPath_points = true;
  } else {
    console.log('turning path points off!');
    showPath_points = false;
  }
}
function togglePath_lines() {
  if (this.checked()) {
    console.log('turning path lines on!');
    showPath_lines = true;
  } else {
    console.log('turning path lines off!');
    showPath_lines = false;
  }
}
function toggleCircles() {
  if (this.checked()) {
    console.log('turning circles on!');
    showCircles = true;
  } else {
    console.log('turning circles off!');
    showCircles = false;
  }
}
    // buttonRemove = createButton('remove epicycle');
    // buttonRemove.position(38*10, 19);
    // buttonRemove.mousePressed(removeEpicycle);
}
function resetGraphPath()
{
  path = [];
  graph = [];
  time = 0;
  periods = [0];
  periodSum = 0;
  periodAverage = 0;
updateText();

}

function resetEpicycle(j)
{
  radiusArr[j] = 0;
  velocityArr[j] = 0;
  radiusInputs[j].value(0);
  velocityInputs[j].value(0);
  resetGraphPath();

}

function inputRadius(i, j) // j is the element you want changed, i is the element that you want to copy from
{
  radiusArr[j] = eval(radiusInputs[i].value());
  resetGraphPath();
}

function inputVelocity(i, j)
{
  velocityArr[j] = eval(velocityInputs[i].value());
  resetGraphPath();
}

function updateText()
{
  radiusParagraph.html("Radii: " + radiusArr);
  velocityParagraph.html("Velocities: " + velocityArr);
}
function screenshot()
{
  saveCanvas(c, screenshotName.value(), 'png');
}

function draw() {
  background(255);
  let x = WIDTH/2;
  let y = HEIGHT/2;

  for (let i = 0; i < n; i++) {
    let prevx = x;
    let prevy = y;

    let velocity = velocityArr[i];
    let radius = radiusArr[i];
    let phase = phaseArr[i];
    // let velocity = velocityArr[i].value();
    // let radius = radiusArr[i].value();

    // print(radius);
    // print(velocity);
    x +=  radius * cos(velocity * time + phase);
    y +=  radius * sin(velocity * time + phase);


    if (showCircles)
    {
    noFill();
    stroke(100);
    strokeWeight(4);
    ellipse(prevx, prevy, radius*2);


    line(prevx, prevy, x, y);

    ellipse(x, y, radius/8);
    }

  }



  // for drawing path and graph
  path.unshift([x,y]);

  graph.unshift(y);


  if (showPath_points)
    {
    beginShape();
    strokeWeight(8);
    stroke(71,131,183);
    noFill();
    for (let i = 0; i < path.length; i++) {
      point(path[i][0], path[i][1]);
    }
    endShape();
    strokeWeight(2);
  }
  if (showPath_lines)
    {
    beginShape();
    strokeWeight(8);
    stroke(71,131,183);
    noFill();
    for (let i = 0; i < path.length; i++) {
      vertex(path[i][0], path[i][1]);
    }
    endShape();
    strokeWeight(2);
  }

  if (showGraph)
    {
    stroke(0);
    strokeWeight(6);
    translate(0.7*WIDTH, 0);
    line(x - 0.7*width, y, 0, graph[0]);
    beginShape();
    noFill();
    for (let i = 0; i < graph.length; i++) {
      vertex(i, graph[i]);
    }
    endShape();
  }
    // calculate original point for future reference (period)
    if (time == 0)
    {
      origPoint = [x,y];
    }

    // dt = 1 * TWO_PI / n; // comment out when not using FT
    dt = timeSlider.value()
    time += dt;
    // comment out when not using FT
    // if (time > TWO_PI) {
    //   time = 0;
    //   path = [];
    // }
  if (graph.length > GRAPHLIMIT) {
    graph.pop();
  }
  if (path.length > PATHLIMIT) {
    path.pop();
  }

  // calculate mse
  let mse = 0;
  for (let l = 0; l < drawing.length; l++) {
    mse_i = 0;
    x = WIDTH/2;
    y = HEIGHT/2;
    for (let i = 0; i < xy.length; i++) {
      // print(xy.length)
      let prevx = x;
      let prevy = y;
  
      let velocity = velocityArr[i];
      let radius = radiusArr[i];
      let phase = phaseArr[i];
      // let velocity = velocityArr[i].value();
      // let radius = radiusArr[i].value();
  
      // print(radius);
      // print(velocity);
      x +=  radius * cos(velocity * drawing[l].x*0.01 + phase);
      y +=  radius * sin(velocity * drawing[l].x*0.01 + phase);

    }
    mse_i += Math.pow(drawing[l].x*0.01-x, 2) + Math.pow(drawing[l].y*0.01-y,2);


  
  }
  mse = mse_i / drawing.length
  print(mse)
  // try to calculate the period
  if (abs(origPoint[0] - x) < C  && abs(origPoint[1] - y) < C)
  {
    if (periods.length == 0)
    {
      diff = time;
    }
    else
    {
      diff = time-lastTime;
      periodSum += diff;
      periodAverage = periodSum/periods.length;
  
    }

    // periods.push(diff);
    //print("periodAverage: " + math.median(periods) + " length = " + periods.length + " period: " + diff  + " periodPi" + math.median(periods)/math.pi);
    

    // print("xy: " + x + " , "  + y);
    lastTime = time;

  }


}

function addEpicycle(isDuplicating, numEpicycles)
{
    if (isDuplicating)
    {
      for (i = 0; i < numEpicycles; i++)
      {
        radSlider = createSlider(-300, 300, 0, 2);
        radSlider.position(200*n, HEIGHT-100);
        let tempInd = n;
        radSlider.input(function() { updateRadius(tempInd, radSlider.value())})
  
        radSlider.changed(resetGraphPath); // clear the path and graph whenever we change the slider
  
        velSlider = createSlider(-2, 2, 0, 0.01);
        velSlider.position(200*n, HEIGHT-80);
        velSlider.input(function() { updateVelocity(tempInd, velSlider.value())})
        velSlider.changed(resetGraphPath);
  
        radiusSliders.push(radSlider);
        velocitySliders.push(velSlider);
        radiusArr.push(inputRadius(0, tempInd));
        velocityArr.push(inputVelocity(0, tempInd));
        phaseArr.push(0)

        button = createButton('reset');
        button.position(200*n, HEIGHT-20);
        button.mousePressed(function() { resetEpicycle(tempInd);});
  
  
        radInput = createInput('');
        radInput.position(200*n, HEIGHT-60)
        radInput.input(function() { inputRadius(0, tempInd)});
  
        velInput = createInput('');
        velInput.position(200*n, HEIGHT-40);
        velInput.input(function() { inputVelocity(0, tempInd)});
  
        radiusInputs.push(radInput)
        velocityInputs.push(velInput)
  
        resetButtons.push(button);
  
        n += 1;
      }
    }
    else
    {
      numEpicycles = 1;
      
      radSlider = createSlider(-300, 300, 0, 2);
      radSlider.position(200*n, HEIGHT-100);
      let tempInd = n;
      radSlider.input(function() { updateRadius(tempInd, radSlider.value())})

      radSlider.changed(resetGraphPath); // clear the path and graph whenever we change the slider

      velSlider = createSlider(-2, 2, 0, 0.01);
      velSlider.position(200*n, HEIGHT-80);
      velSlider.input(function() { updateVelocity(tempInd, velSlider.value())})
      velSlider.changed(resetGraphPath);
 

      radiusSliders.push(radSlider);
      velocitySliders.push(velSlider);
      radiusArr.push(0);
      velocityArr.push(0);
      phaseArr.push(0)

      button = createButton('reset');
      button.position(200*n, HEIGHT-20);
      button.mousePressed(function() { resetEpicycle(tempInd);});


      radInput = createInput('');
      radInput.position(200*n, HEIGHT-60)
      radInput.input(function() { inputRadius(tempInd, tempInd)});

      velInput = createInput('');
      velInput.position(200*n, HEIGHT-40);
      velInput.input(function() { inputVelocity(tempInd, tempInd)});

      radiusInputs.push(radInput)
      velocityInputs.push(velInput)

      resetButtons.push(button);

      n += 1;
    }
}

function updateVelocity(ind, value)
{
  velocityArr[ind] = velocitySliders[ind].value();
  print("changed velocity to " + value + " at " + ind);
}
function updateRadius(ind, value)
{
  radiusArr[ind] = radiusSliders[ind].value();
  print("changed radius to " + value + " at " + ind);
  print(radiusArr)
}
