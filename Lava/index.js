var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  var assetPath = "textures/";

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intentsity = 0.8;
  light.specular = new BABYLON.Color3(0.9, 0.4, 0.9);

  var gl = new BABYLON.GlowLayer("glow", scene);
  gl.intensity = 0.1;

  var sphere = new BABYLON.Mesh.CreateSphere("sphere1", 8, 2, scene);
  sphere.position.y = 2;
  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", assetPath + "Lava_005_DISP.png", 10, 10, 400, 0, 0.4, scene, false);
  var material = new BABYLON.PBRMaterial("mat", scene);
  material.albedoTexture = new BABYLON.Texture(assetPath + "Lava_005_COLOR.jpg", scene);
  material.bumpTexture = new BABYLON.Texture(assetPath + "Lava_005_NORM.jpg", scene);
  material.bumpTexture.level = 0.5;
  material.emissiveTexture = new BABYLON.Texture(assetPath + "spider_webs_compressed.jpg", scene);
  material.emissiveColor = new BABYLON.Color3(245 / 255, 20 / 255, 20 / 255);
  material.ambientTexture = new BABYLON.Texture(assetPath + "Lava_005_OCC.jpg", scene);
  material.metallicTexture = new BABYLON.Texture(assetPath + "Lava_005_ROUGH.jgp", scene);
  material.roughness = 1;
  material.metallic = 0.1;
  material.useRoughnessFromMetallicTextureAlpha = true;
  material.useRoughnessFromMetallicTextureGreen = false;
  material.useMetallnessFromMetallicTextureBlue = false;
  sphere.material = material;
  ground.material = material;
  material.clearCoat.isEnabled = true;
  material.clearCoat.bumpTexture = new BABYLON.Texture(assetPath + "Lava_005_NORM.jpg", scene);
  material.clearCoat.bumpTexture.level = 0.0;

  var alpha = 0;
  scene.registerBeforeRender(function() {
    material.albedoTexture.uOffset += 0.001;
    material.bumpTexture.uOffset += 0.001;
    material.ambientTexture.uOffset += 0.001;
    material.metallicTexture.uOffset += 0.001;
    material.emissiveTexture.uOffset += 0.01;
    material.emissiveTexture.vOffset -= 0.005;
    ground.scaling.y += Math.sin(alpha) / 300;
    gl.intensity += Math.sin(alpha * 2) / 100;
    alpha += 0.01;
    material.clearCoat.bumpTexture.level += Math.sin(alpha) / 100;
  });
  scene.createDefaultEnvironment({
    createGround: false,
    createSkybox: false
  });

  var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9
  }, scene);
  var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene);
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;

  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.8;
  pipeline.bloomWeight = 0.3;
  pipeline.bloomKernel = 64;
  pipeline.bloomScale = 0.5;

  var noiseTexture1 = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
  noiseTexture1.animationSpeedFactor = 5;
  noiseTexture1.persistence = 0.2;
  noiseTexture1.brightness = .5;
  noiseTexture1.octaves = 4;


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