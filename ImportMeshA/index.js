// https://www.babylonjs.com/demos/Boom
var createScene = async function () {

  var scene = new BABYLON.Scene(engine);


  var camera = new BABYLON.ArcRotateCamera("camera1", 0, Math.PI / 2, 16, new BABYLON.Vector3(0, -10, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0.5, 0), scene);
  light.intensity = 0.8;

  const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "", "BallRoll.babylon", scene);
  console.log(result);

  // https://doc.babylonjs.com/toolsAndResources/inspector
  scene.debugLayer.show();
  BABYLON.Inspector.Show(scene, {});
  return scene;

}
var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};

window.initFunction = async function () {



  var asyncEngineCreation = async function () {
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
  window.scene = await createScene();
};
initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});