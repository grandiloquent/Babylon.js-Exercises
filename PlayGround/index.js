var createScene = function () {

  var scene = new BABYLON.Scene(engine);
  //scene.clearColor = new BABYLON.Color3(.5, .5, .5);

  // https://doc.babylonjs.com/typedoc/classes/BABYLON.ArcRotateCamera#constructor
  const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI * 3, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 1), scene);

  // https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/sphere
  const sphere =
    //BABYLON.MeshBuilder.CreateGround("ground1", { width: 1, height: 1, subdivisions: 25 }, scene);

    BABYLON.MeshBuilder.CreateSphere("sphere", {
      segments: 25,
      diameter: 1
    }, scene);

  var material = createDynamicTexture(scene);
  sphere.material = material;

  // https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#registerBeforeRender
  scene.registerBeforeRender(() => {
    //camera.alpha += 0.1;
  });
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
  // https://doc.babylonjs.com/typedoc/classes/BABYLON.Engine#getRenderWidth
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
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});