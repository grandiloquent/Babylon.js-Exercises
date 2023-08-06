var createScene = function() {
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 15, -30), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 19, 0), scene);
  light.intensity = 0.9;

  var groundWidth = 8;
  var groundHeight = 8;

  var ground = BABYLON.MeshBuilder.CreateGround("ground1", {
    width: groundWidth,
    height: groundHeight,
    subdivisions: 25
  }, scene);

  var textureResolution = 512;
  var textureGround = new BABYLON.DynamicTexture("dynamic texture", textureResolution, scene);
  var textureContext = textureGround.getContext();
  var x = 150;
  var y = 150;
  var materialGround = new BABYLON.StandardMaterial("Mat", scene);
  materialGround.diffuseTexture = textureGround;
  ground.material = materialGround;

  function loop() {
    time = new Date();
    h = time.getHours();
    m = time.getMinutes();
    s = time.getSeconds();

    textureContext.beginPath();
    textureContext.fillStyle = "ivory";
    textureContext.arc(x, y, 140, 0, Math.PI * 2, true);
    textureContext.fill();
    textureContext.strokeStyle = "crimson";
    textureContext.lineWidth = 10;
    textureContext.stroke();
    drawNumber();
    drawPointer(360 * (h / 12) + (m / 60) * 30 - 90, 70, "black", 10);
    drawPointer(360 * (m / 60) + (s / 60) * 6 - 90, 100, "darkslategrey", 10);
    drawPointer(360 * (s / 60) + x - 90, 120, "red", 2);
  }

  function drawNumber() {
    for (n = 0; n < 12; n++) {
      d = -60;
      num = new Number(n + 1);
      str = num.toString();
      dd = Math.PI / 180 * (d + n * 30);
      
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
      tx = Math.cos(dd) * 120 + 140;
      ty = Math.sin(dd) * 120 + 160;
      console.log(dd,n,d + n * 30,num,tx);
      textureContext.font = "30px Tahoma";
      textureContext.fillStyle = "indigo";
      textureContext.fillText(str, tx, ty);
    }
  }

  function drawPointer(deg, len, color, w) {
    rad = (Math.PI / 180 * deg);
    x1 = x + Math.cos(rad) * len;
    y1 = y + Math.sin(rad) * len;

    textureContext.beginPath();
    textureContext.strokeStyle = color;
    textureContext.lineWidth = w;
    textureContext.moveTo(x, y);
    textureContext.lineTo(x1, y1);
    textureContext.stroke();
    textureGround.update();
  }

  setInterval(loop, 500);

  materialGround.diffuseTexture.uOffset -= 0.2;
  materialGround.diffuseTexture.vOffset += 0.2;
  var box = BABYLON.Mesh.CreateBox("Box1", 10.0, scene);
  box.position.y = 3;
  box.material = materialGround;

  return scene;
}
var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function(engine, canvas) {
  engine.runRenderLoop(function() {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};

window.initFunction = async function() {



  var asyncEngineCreation = async function() {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  window.engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});