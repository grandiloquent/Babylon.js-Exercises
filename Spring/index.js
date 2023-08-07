var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 3, Math.PI / 3, 100, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 25;
  camera.upperRadiusLimit = 250;
  var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

  var x_axis = BABYLON.Mesh.CreateCylinder('x_axis', 1000, 0.3, 0.3, 5, 3, scene);
  var redMat = new BABYLON.StandardMaterial("ground", scene);
  redMat.diffuseColor = BABYLON.Color3.Red()
  x_axis.material = redMat;
  x_axis.rotation.z = Math.PI / 2;

  var y_axis = BABYLON.Mesh.CreateCylinder('y_axis', 1000, 0.3, 0.3, 5, 3, scene);
  var blueMat = new BABYLON.StandardMaterial("ground", scene);
  blueMat.diffuseColor = BABYLON.Color3.Blue()
  y_axis.material = blueMat;

  var z_axis = BABYLON.Mesh.CreateCylinder('x_axis', 1000, 0.3, 0.3, 5, 3, scene);
  var GreenMat = new BABYLON.StandardMaterial("ground", scene);
  GreenMat.diffuseColor = BABYLON.Color3.Green()
  z_axis.material = GreenMat;
  z_axis.rotation.x = Math.PI / 2;

  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.wireframe = true;

  var roof = BABYLON.Mesh.CreateBox("roof", 1, scene);
  roof.scaling.z = 20;
  roof.scaling.x = 20;
  roof.position.y = 30;

  var weight = BABYLON.Mesh.CreateSphere("weight", 25, 8, scene)
  var path1 = [];
  for (var i = 0; i <= 120; i++) {
    var v = 2.0 * Math.PI * i / 20;
    path1.push(new BABYLON.Vector3(3 * Math.cos(v), i / 4, 3 * Math.sin(v)));
  }

  var lines = BABYLON.Mesh.CreateLines("helixLines", path1, scene);
  lines.position.y = 30;
  lines.rotation.z = Math.PI;
  var alpha = 3 * Math.PI / 2;
  var positions = lines.getVerticesData(BABYLON.VertexBuffer.PositionKind);
  var numPos = positions.length;
  scene.registerBeforeRender(function() {
    var pos = positions[numPos - 2];
    var scale = Math.sin(alpha) + 1;
    lines.scaling.y = scale;
    weight.position.y = -pos * (scale) + roof.position.y - 3;
    alpha+=.01;
  });
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