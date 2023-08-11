var createScene = function() {

  var scene = new BABYLON.Scene(engine);
  //scene.clearColor = new BABYLON.Color3(.5, .5, .5);

  // https://doc.babylonjs.com/typedoc/classes/BABYLON.ArcRotateCamera#constructor
  const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

  // https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/sphere
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    segments: 25,
    diameter: 1
  }, scene);

  // https://doc.babylonjs.com/features/featuresDeepDive/materials/using/dynamicTexture
  function createDynamicTexture(scene) {
    // https://forum.babylonjs.com/t/creating-quad-sphere/31991/11
    var dynamicTexture = new BABYLON.DynamicTexture("dynamic texture", {
      width: 512,
      height: 256
    }, scene);
    var textureContext = dynamicTexture.getContext();
    var material = new BABYLON.StandardMaterial("Mat", scene);
    material.diffuseTexture = dynamicTexture;

    var font = "bold 56px monospace";
    // https://doc.babylonjs.com/typedoc/classes/BABYLON.DynamicTexture#drawText
    // drawText(text, x, y, font, color, canvas color, invertY, update)
    dynamicTexture.drawText("Grass", 306, 256 / 2, font, "green", "white", true, true);
    // dynamicTexture.animations = '';
    // dynamicTexture.anisotropicFilteringLevel = '';
    // dynamicTexture.delayLoadState = '';
    // dynamicTexture.homogeneousRotationInUVTransform = '';
    // dynamicTexture.inspectableCustomProperties = '';
    // dynamicTexture.invertZ = true;
    // dynamicTexture.isRenderTarget = '';
    // dynamicTexture.level = '';
    // dynamicTexture.metadata = '';
    // dynamicTexture.name = '';
    // dynamicTexture.onDisposeObservable = '';
    // dynamicTexture.onLoadObservable = '';
    // dynamicTexture.optimizeUVAllocation = '';
    // dynamicTexture.reservedDataStore = '';
    // dynamicTexture.sphericalPolynomial = '';
    // dynamicTexture.uAng =  Math.PI * 5;
    // dynamicTexture.uOffset = -.2;
    // dynamicTexture.uRotationCenter = '';
    // dynamicTexture.uScale = '';
    // dynamicTexture.uniqueId = '';
    // dynamicTexture.url = '';
    // dynamicTexture.vAng = Math.PI;
    // dynamicTexture.vOffset = '';
    // dynamicTexture.vRotationCenter = '';
    // dynamicTexture.vScale = '';
    // dynamicTexture.wAng = '';
    // dynamicTexture.wRotationCenter = 1;
    // CLAMP_ADDRESSMODE
    // MIRROR_ADDRESSMODE
    // WRAP_ADDRESSMODE
    // dynamicTexture.wrapR = BABYLON.DynamicTexture.WRAP_ADDRESSMODE;
    // BILINEAR_SAMPLINGMODE

    // CUBIC_MODE
    // EXPLICIT_MODE
    // PLANAR_MODE
    // PROJECTION_MODE
    // SKYBOX_MODE
    // SPHERICAL_MODE
    // EQUIRECTANGULAR_MODE
    // INVCUBIC_MODE
    // FIXED_EQUIRECTANGULAR_MIRRORED_MODE
    // FIXED_EQUIRECTANGULAR_MODE

    // DEFAULT_ANISOTROPIC_FILTERING_LEVEL



    // ForceSerializeBuffers

    // LINEAR_LINEAR
    // LINEAR_LINEAR_MIPLINEAR
    // LINEAR_LINEAR_MIPNEAREST
    // LINEAR_NEAREST
    // LINEAR_NEAREST_MIPLINEAR
    // LINEAR_NEAREST_MIPNEAREST

    // NEAREST_LINEAR
    // NEAREST_LINEAR_MIPLINEAR
    // NEAREST_LINEAR_MIPNEAREST
    // NEAREST_NEAREST
    // NEAREST_NEAREST_MIPLINEAR
    // NEAREST_NEAREST_MIPNEAREST
    // NEAREST_SAMPLINGMODE
    // OnTextureLoadErrorObservable

    // SerializeBuffers
    // TRILINEAR_SAMPLINGMODE
    // UseSerializedUrlIfAny

    // dynamicTexture.checkTransformsAreIdentical();
    // dynamicTexture.clear();
    // dynamicTexture.clone();
    // dynamicTexture.dispose();
    // dynamicTexture.drawText();
    // dynamicTexture.forceSphericalPolynomialsRecompute();
    // dynamicTexture.getBaseSize();
    // dynamicTexture.getClassName();
    // dynamicTexture.getContext();
    // dynamicTexture.getInternalTexture();
    // dynamicTexture.getReflectionTextureMatrix();
    // dynamicTexture.getRefractionTextureMatrix();
    // dynamicTexture.getScene();
    // dynamicTexture.getSize();
    // dynamicTexture.getTextureMatrix();
    // dynamicTexture.isReady();
    // dynamicTexture.isReadyOrNotBlocking();
    // dynamicTexture.readPixels();
    // dynamicTexture.releaseInternalTexture();
    // dynamicTexture.scale();
    // dynamicTexture.scaleTo();
    // dynamicTexture.serialize();
    // dynamicTexture.toString();
    // dynamicTexture.update();
    // dynamicTexture.updateSamplingMode();
    // dynamicTexture.updateURL();
    // CreateFromBase64String
    // LoadFromDataString
    // Parse
    // WhenAllReady

    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.EXPLICIT_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.SPHERICAL_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.PLANAR_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.CUBIC_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.PROJECTION_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.SKYBOX_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.INVCUBIC_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.EQUIRECTANGULAR_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.FIXED_EQUIRECTANGULAR_MODE;
    // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE;

    return material;
  }

  var material = createDynamicTexture(scene);
  sphere.material = material;

  // https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene#registerBeforeRender
  scene.registerBeforeRender(() => {
    //camera.alpha += 0.1;
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
  // https://doc.babylonjs.com/typedoc/classes/BABYLON.Engine#getRenderWidth
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