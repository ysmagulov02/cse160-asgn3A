// Yernar Smagulov
// ysmagulo@ucsc.edu

// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);

    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1);
    }

  }`;

// Global variables 
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_whichTexture;
let u_Sampler1;
let camera = new Camera();

function initTextures() {
  
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image.onload = function() { sendImageToTEXTURE0(image); }
  image2.onload = function() { sendImageToTEXTURE2(image2); }

  // Tell the browser to load on image
  image.src = 'sky.jpg';
  image2.src = 'grass1.jpg';

  // Add more texture loading
  return true;
}

function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler0
  gl.uniform1i(u_Sampler0, 0);
  
  console.log('finished loading texture 0');
}

function sendImageToTEXTURE2(image) {
  debugger;
  var texture2 = gl.createTexture();
  if (!texture2) {
    console.log('Failed to create the texture object 2');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 1 to the sampler 1
  gl.uniform1i(u_Sampler1, 2);
  
  console.log('finished loading texture 2');
}



function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Set the initial value for this matrix to identity 
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
// const POINT = 0;
// const TRIANGLE = 1;
// const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
// let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

// Globals related to the bird
// let g_headAngle = 0;
// let g_scapularAngle = 0;
// let g_wingAngle = 0;
// let g_headAnimation = false;
// let g_scapularAnimation = false;
// let g_wingAnimation = false;

// Globals related to the camera 
let g_cameraX = 0;
let g_cameraY = 0;
let g_cameraZ = 0;

// Globals for mouse control
let isDragging = false;
let mouseLastX = 0;
let mouseLastY = 0;
let g_yAngle = 0; // Global angle for Y-axis rotation
let g_xAngle = 0; // Global angle for X-axis rotation

// Model rotation angles
let g_modelYAngle = 0; // Global angle for Y-axis rotation of the model
let g_modelXAngle = 0; // Global angle for X-axis rotation of the model

function handleMouseDown(event) {
  // Start dragging
  isDragging = true;
  mouseLastX = event.clientX;
  mouseLastY = event.clientY;
}

function handleMouseUp(event) {
  // Stop dragging
  isDragging = false;
}

function handleMouseMove(event) {
  if (isDragging) {
    var deltaX = event.clientX - mouseLastX;
    var deltaY = event.clientY - mouseLastY;
    g_modelYAngle = (g_modelYAngle + deltaX) % 360;
    g_modelXAngle = (g_modelXAngle + deltaY) % 360;
    renderAllShapes();
  }
  mouseLastX = event.clientX;
  mouseLastY = event.clientY;
}

function addMouseControl() {
  canvas.onmousedown = handleMouseDown;
  canvas.onmouseup = handleMouseUp;
  canvas.onmouseout = handleMouseUp; // Handle the mouse going out of the viewport
  canvas.onmousemove = handleMouseMove;
}


// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

  // Button Events 
  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false;};
  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true;};

  document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false;};
  document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true;};


  // Slider Events
  document.getElementById('yellowSlide').addEventListener('mousemove', function() {g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() {g_magentaAngle = this.value; renderAllShapes(); });
  

  // Camera Angle Slider Events
	document.getElementById("x_angle").addEventListener('mousemove', function() {g_cameraX = this.value; console.log(this.value); renderAllShapes();});
	document.getElementById("y_angle").addEventListener('mousemove', function() {g_cameraY = this.value; console.log(this.value); renderAllShapes();});
	document.getElementById("z_angle").addEventListener('mousemove', function() {g_cameraZ = this.value; console.log(this.value); renderAllShapes();});
}



function main() {

  // get the canvas and gl context
  setupWebGL();
  
  // compile the shader programs, attach the javascript variables to the GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();

  addMouseControl(); // Activate mouse controls

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// Called by browser repatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0-g_startTime;

  // Update Animation Angles
  // updateAnimationAngles();
  
  // Draw everything
  renderAllShapes();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (45*Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
    g_magentaAngle = (45*Math.sin(3*g_seconds));
  }
}


// function keydown(ev) {
//   if (ev.keyCode == 39) { // right arrow
//     g_eye[0] += 0.2;
//   } else if (ev.keyCode == 37) { // left arrow
//     g_eye[0] -= 0.2;
//   }

//   renderAllShapes();
//   console.log(ev.keyCode);
// }


function keydown(ev) {
  if (ev.keyCode == 87) {
    camera.forward();
  }
  if (ev.keyCode == 83) {
    camera.back();
  }
  if (ev.keyCode == 68) {
    camera.right();
  }
  if (ev.keyCode == 65) {
    camera.left();
  }

  renderAllShapes();
}



// var g_eye = [0, 0, 3];
// var g_at = [0, 0, -100];
// var g_up = [0, 1, 0];
// var g_camera = new Camera();

// var g_map = [
// [1, 1, 1, 1, 1, 1, 1, 1],
// [1, 0, 0, 0, 0, 0, 0, 1],
// [1, 0, 0, 0, 0, 0, 0, 1],
// [1, 0, 0, 1, 1, 0, 0, 1],
// [1, 0, 0, 0, 0, 0, 0, 1],
// [1, 0, 0, 0, 0, 0, 0, 1],
// [1, 0, 0, 0, 1, 0, 0, 1],
// [1, 0, 0, 0, 0, 0, 0, 1],
// ];

// function drawMap() {
//   for (i=0; i<2; i++) {
//     for (x=0; x<32; x++) {
//       for (y=0; y<32; y++) {
//         var body = new Cube();
//         body.color = [0.8, 1.0, 1.0, 1.0];
//         body.matrix.translate(0, -0.75, 0);
//         body.matrix.scale(0.4, 0.4, 0.4);
//         body.matrix.translate(x-16, 0, y-16);
//         body.renderfast();
//       }
//     }
//   }
// }

// Draw every shape that is supposed to be on the canvas
function renderAllShapes() {
  // Check the time at the start of this function 
  var startTime = performance.now();

  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(camera.fov, 1*canvas.width/canvas.height, 0.1, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2], 
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2], 
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  );

  // viewMat.setLookAt(
  //   camera.eye.x, camera.eye.y, camera.eye.z, 
  //   camera.at.x, camera.at.y, camera.at.z, 
  //   camera.up.x, camera.up.y, camera.up.z
  // ); // (eye, at, up)
  
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Model rotation matrix
  var modelRotateMatrix = new Matrix4().rotate(g_modelXAngle, 1, 0, 0); // Rotate model around x-axis
  modelRotateMatrix.rotate(g_modelYAngle, 0, 1, 0); // Rotate model around y-axis

  // Camera rotation matrix
  var cameraRotateMatrix = new Matrix4().rotate(g_cameraX, 1, 0, 0); // Rotate camera around x-axis
  cameraRotateMatrix.rotate(g_cameraY, 0, 1, 0); // Rotate camera around y-axis
  cameraRotateMatrix.rotate(g_cameraZ, 0, 0, 1); // Rotate camera around z-axis

  // Combine the rotations
  var globalRotateMatrix = cameraRotateMatrix.multiply(modelRotateMatrix);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotateMatrix.elements);

  // Draw the map
  // drawMap();


  // grass
  var grass = new Cube();
  grass.color = [1.0, 1.0, 1.0, 1.0];
  grass.textureNum = 1;
  grass.matrix.translate(0, -0.8, 0.0);
  grass.matrix.scale(10, -0.1, 10);
  grass.matrix.translate(-0.5, 0, -0.5);
  grass.render();

  // sky
  var sky = new Cube();
  sky.color = [0.6, 0.8, 0.9, 1.0];
  sky.textureNum = 0;
  sky.matrix.scale(40, 40, 40);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  // Draw the body cube
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.textureNum = -1;
  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, 0.3, 0.5);
  body.render();

  // Yellow box
  var yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.textureNum =0;
  yellow.matrix.setTranslate(0, -0.5, 0.0);
  yellow.matrix.rotate(-5, 1, 0, 0);
  yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, 0.7, 0.5);
  yellow.matrix.translate(-0.5, 0, 0);
  yellow.render();

  // Magenta box 
  var magenta = new Cube();
  magenta.color = [1, 0, 1, 1];
  magenta.textureNum = -1;
  magenta.matrix = yellowCoordinatesMat;
  magenta.matrix.translate(0, 0.65, 0);
  magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
  magenta.matrix.scale(0.3, 0.3, 0.3);
  magenta.matrix.translate(-0.5, 0, -0.001);
  magenta.render();


  // Check the time at the end of the function, and show on the web page
  var endTime = performance.now();
  var renderTime = endTime - startTime;
  var fps = 1000 / renderTime; // Calculate frames per second

  sendTextToHTML(`Render Time: ${renderTime.toFixed(2)} ms, FPS: ${fps.toFixed(1)}`, "performanceIndicator");

}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}


