/*

*/
function createDynamicTexture(scene) {

  var dynamicTexture = new BABYLON.DynamicTexture("dynamic texture", {
    width: 338,
    height: 338
  }, scene);
  var material = new BABYLON.StandardMaterial("Mat", scene);
  material.diffuseTexture = dynamicTexture;

  var font = "bold 32px monospace";
  var textureContext = dynamicTexture.getContext();
  textureContext.font = font;
  console.log(textureContext.measureText("+"));

  textureContext.textAlign = "center";

  // https://doc.babylonjs.com/typedoc/classes/BABYLON.DynamicTexture#drawText
  // drawText(text, x, y, font, color, canvas color, invertY, update)
  dynamicTexture.drawText("Grass", 338 / 2, 338 / 2, font, "green", "white", true, true);
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
  dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.EQUIRECTANGULAR_MODE;
  // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.FIXED_EQUIRECTANGULAR_MODE;
  // dynamicTexture.coordinatesMode = BABYLON.DynamicTexture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE;

  return material;
}
//