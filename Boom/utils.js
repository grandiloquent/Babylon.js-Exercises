function createShadowGenerator(dirLight) {
  var shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
  shadowGenerator.setDarkness(0.2);
  shadowGenerator.usePoissonSampling = true;
  return shadowGenerator;
}

function createCamera() {
  var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
  camera.setPosition(new BABYLON.Vector3(0, 0, -800));
  camera.attachControl(canvas, true);
  return camera;
}

function createDirectionalLight() {
  var dir = new BABYLON.Vector3(0, -1, 1);
  var dirLight = new BABYLON.DirectionalLight("dl", dir, scene);
  dirLight.position = new BABYLON.Vector3(0, 200, -1000);
  dirLight.diffuse = BABYLON.Color3.White();
  dirLight.intensity = 0.8;
  dirLight.specular = new BABYLON.Color3(0.5, 0.5, 0.2);
  return dirLight;
}

function createDisc() {
  var disc = BABYLON.MeshBuilder.CreateDisc("d", {
    radius: width * 4
  }, scene);
  disc.position = ground.position;
  disc.position.y -= 0.1;
  disc.rotation.x = Math.PI / 2;
  var groundMaterial2 = new BABYLON.StandardMaterial("ground", scene);
  groundMaterial2.diffuseTexture = new BABYLON.Texture("ground.jpg", scene);
  groundMaterial2.diffuseTexture.uScale = 50;
  groundMaterial2.diffuseTexture.vScale = 50;
  groundMaterial2.specularColor = new BABYLON.Color3(0, 0, 0);
  groundMaterial2.zOffset = 1;
  groundMaterial2.freeze();
  disc.material = groundMaterial2;
  disc.isPickable = false;
  disc.freezeWorldMatrix();
  disc.receiveShadows = true;
}

function createDynamicTexture() {
  var text = "BabylonJS Roxxx";
  var font = "bold 56px Arial";
  var tx = new BABYLON.DynamicTexture("dt", {
    width: 500,
    height: 65
  }, scene);
  tx.hasAlpha = true;
  //var clearColor = "transparent";
  var clearColor = "red";
  tx.drawText(text, null, 45, font, "blue", clearColor, true, false);
  tx.drawText("CLICK = BOOM", null, 60, "bold 20px Arial", "yellow", null, true, true);
  return tx;
}

function createGround() {
  var quadsReady = false;
  // callback function to call when the ground is ready
  var setQuads = function (mesh) {
    quadsReady = true;
    mesh.getHeightAtCoordinates(mesh.position.x, mesh.position.z); // forces the underlying altitude array initialization
  };
  var subdivisions = 50;
  var width = 1000;
  var height = 1000;
  var groungHeight = width / 6;
  var size = 10;
  var heightNb = 20;
  var options = {
    width: width,
    height: height,
    subdivisions: subdivisions,
    minHeight: 0,
    maxHeight: groungHeight,
    onReady: setQuads
  };
  var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground", "heightMap.png", options, scene);
  var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("ground.jpg", scene);
  groundMaterial.diffuseTexture.uScale = 6;
  groundMaterial.diffuseTexture.vScale = 6;
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material = groundMaterial;
  ground.isPickable = false;
  ground.position.y = -heightNb * size;
  ground.position.z = heightNb * size;
  groundMaterial.freeze();
  ground.freezeWorldMatrix();
  ground.receiveShadows = true;
  return ground;
}

function createHemisphericLight() {
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  light.intensity = 0.2;
  return light;
}

function createPointLight() {
  var pl = new BABYLON.PointLight("pl", new BABYLON.Vector3(0, 0, 0), scene);
  pl.diffuse = new BABYLON.Color3(1, 1, 1);
  pl.specular = BABYLON.Color3.Black();
  pl.intensity = 0.4;
  return pl;
}

function createStandardMaterial(tx) {
  var mat = new BABYLON.StandardMaterial("mat1", scene);
  mat.diffuseTexture = tx;
  mat.freeze();
  return mat;
}