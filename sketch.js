let time = 0;
let nSliders = [];
let n = 0;
let radiusSliders = [] ;
let velocitySliders = [];
let resetButtons = [];
let radiusArr = [];
let velocityArr = [];

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

let showPath = false;
let showGraph = false;
let showCircles = false; 
function setup() {
  frameRate(120)
  c = createCanvas(WIDTH, HEIGHT);

  screenshotButton = createButton('save screenshot');
  screenshotButton.position(20, 45);
  screenshotButton.mousePressed(screenshot);


  buttonAdd = createButton('add epicycle');
  buttonAdd.position(20, 15);
  buttonAdd.mousePressed(addEpicycle);


  graphCheckbox = createCheckbox('graph', false);
  graphCheckbox.position(120, 20)
  graphCheckbox.changed(toggleGraph);

  pathCheckbox = createCheckbox('path', false);
  pathCheckbox.position(240, 20)
  pathCheckbox.changed(togglePath);



  circleCheckbox = createCheckbox('circles', false);
  circleCheckbox.position(360, 20)
  circleCheckbox.changed(toggleCircles);

  timeSlider = createSlider(0, 0.55, 0.01, 0.0001);
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
  buttonAddDup_50.position(100, 80);
  buttonAddDup_50.mousePressed(function() { addEpicycle(true, 100);});

  buttonAddDup_100 = createButton('duplicate 100');
  buttonAddDup_100.position(150, 80);
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
function togglePath() {
  if (this.checked()) {
    console.log('turning path on!');
    showPath = true;
  } else {
    console.log('turning path off!');
    showPath = false;
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
updateText();

t = 0;
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
    // let velocity = velocityArr[i].value();
    // let radius = radiusArr[i].value();

    // print(radius);
    // print(velocity);
    x +=  radius * cos(velocity * time);
    y +=  radius * sin(velocity * time);

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


  if (showPath)
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


  time += timeSlider.value();

  if (graph.length > GRAPHLIMIT) {
    graph.pop();
  }
  if (path.length > PATHLIMIT) {
    path.pop();
  }


  time += speed;
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
