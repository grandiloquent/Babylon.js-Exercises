var createScene = function() {
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4,30, new BABYLON.Vector3(0, 4, 0), scene);


  var light = new BABYLON.SpotLight("light", new BABYLON.Vector3(8, 16, 8), new BABYLON.Vector3(-1, -2, -1), 3, 1, scene);
  var shadowGenerator = new BABYLON.ShadowGenerator(512, light);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurBoxOffset = 1;
  shadowGenerator.blurScale = 1.0;
  shadowGenerator.setDarkness(0.0);

  var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 10, 0), scene);
  light2.diffuse = new BABYLON.Color3(1.0, 0.5, 0.0);
  light2.parent = rootMesh;

  var keys = [];
  var previous = null;
  for (var i = 0; i < 20; i++) {
    var rand = BABYLON.Scalar.Clamp(Math.random(), 0.5, 1.0);

    if (previous) {
      if (Math.abs(rand - previous) < 0.1) {
        continue;
      }
    }

    previous = rand;

    keys.push({
      frame: i,
      value: rand
    });
  }

  var anim = new BABYLON.Animation("anim", "intensity", 1, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  anim.setKeys(keys);

  light2.animations.push(anim);
  scene.beginAnimation(light2, 0, keys.length, true, 8);

  var skybox = BABYLON.Mesh.CreateBox("skyBox", 300.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://www.babylonjs.com/assets/skybox/santa", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;

  var fireMaterial = new BABYLON.FireMaterial("fire", scene);
  fireMaterial.diffuseTexture = new BABYLON.Texture("diffuse.png", scene);
  fireMaterial.distortionTexture = new BABYLON.Texture("distortion.png", scene);
  fireMaterial.opacityTexture = new BABYLON.Texture("opacity.png", scene);
  fireMaterial.opacityTexture.level = 0.5;
  fireMaterial.speed = 5.0;

  var rootMesh = new BABYLON.Mesh("root", scene);
  rootMesh.scaling = new BABYLON.Vector3(4, 4, 4);

  BABYLON.SceneLoader.ImportMesh("", "", "candle.babylon", scene, function(meshes) {
    var plane = scene.getMeshByName("Plane");
    plane.receiveShadows = true;

    for (var i = 0; i < meshes.length; i++) {
      if (meshes[i] !== plane) {
        shadowGenerator.getShadowMap().renderList.push(meshes[i]);
        meshes[i].receiveShadows = false;
      }
      if (!meshes[i].parent) {
        meshes[i].parent = rootMesh;
      }
    }
    var torus = scene.getMeshByName("Torus");
    torus.receiveShadows = true;

    plane = BABYLON.Mesh.CreatePlane("firePlane", 1.5, scene);
    plane.position = new BABYLON.Vector3(0, 8.3, 0);
    plane.scaling.x = 0.45;
    plane.scaling.y = 1.5;
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
    plane.material = fireMaterial;

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