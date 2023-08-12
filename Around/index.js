// https://www.babylonjs.com/demos/Boom
var createScene = function() {

  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(.5, .5, .5);

  var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(5, 3, 0), scene);
  camera.setPosition(new BABYLON.Vector3(14, 8, -12));
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
  light.intensity = 0.8;

  // https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/sphere
  var sphere1 = new BABYLON.MeshBuilder.CreateSphere("sphere");
  var sphere2 = new BABYLON.MeshBuilder.CreateSphere("sphere");
  sphere2.position = new BABYLON.Vector3(0, 3, 0);

  var pilot = BABYLON.Mesh.MergeMeshes([sphere1, sphere2], true);
  var pivot = new BABYLON.TransformNode("root");
  pivot.position = new BABYLON.Vector3(0, 0, 0);
  pilot.parent = pivot;
  pilot.position = new BABYLON.Vector3(0, 0, 0);

  var angle = 0.02;
  scene.registerAfterRender(function() {
    pivot.rotate(new BABYLON.Vector3(1, 0, 1), angle, BABYLON.Space.WORLD);
    
  });

  // https://doc.babylonjs.com/toolsAndResources/inspector
  scene.debugLayer.show();
  BABYLON.Inspector.Show(scene, {});
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