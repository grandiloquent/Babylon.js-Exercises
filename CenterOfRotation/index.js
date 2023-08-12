var createScene = function() {

  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(.5, .5, .5);

  var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(5, 3, 0), scene);
  camera.setPosition(new BABYLON.Vector3(14, 8, -12));
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
  light.intensity = 0.8;

  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.alpha = 1.0;
  mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
  mat.backFaceCulling = false;

  var body = BABYLON.MeshBuilder.CreateCylinder("body", {
    height: 0.75,
    diameterTop: 0.2,
    diameterBottom: 0.5,
    tessellation: 6,
    subdivisions: 1
  }, scene);
  var arm = BABYLON.MeshBuilder.CreateBox("arm", {
    height: 0.75,
    width: 0.3,
    depth: 0.1875
  }, scene);
  arm.position.x = 0.125;
  var pilot = BABYLON.Mesh.MergeMeshes([body, arm],true);
  var CoR_At = new BABYLON.Vector3(1, 3, 2);
  var axis = new BABYLON.Vector3(2, 6, 4);
  var pilotStart = new BABYLON.Vector3(2, 3, 4);
  
  var axisLine = BABYLON.MeshBuilder.CreateLines("axisLine", {points: [CoR_At.add(axis.scale(-50)), CoR_At.add(axis.scale(50))]}, scene);

  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    diameter: 0.25
  }, scene);
  sphere.position = CoR_At;

  var pivot = new BABYLON.TransformNode("root");
  pivot.position = CoR_At;
  pilot.parent = pivot;
  pilot.position = pilotStart;

  var angle = 0.02;
  scene.registerAfterRender(function() {
    pivot.rotate(axis, angle, BABYLON.Space.WORLD);
  });

  var showAxis = function(size) {
    var makeTextPlane = function(text, color, size) {
      var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
      var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
      plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
      plane.material.backFaceCulling = false;
      plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
      plane.material.diffuseTexture = dynamicTexture;
      return plane;
    };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    var axisY = BABYLON.Mesh.CreateLines("axisY", [
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  };

  showAxis(8);

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