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

function createDisc(ground) {
  var width = 1000;
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
  console.log("----------------------------------------------------------------", scene);
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
function createSolidParticleSystem(scene, mat, shadowGenerator) {
  var size = 10; // particle size
  var widthNb = 30; // width particle number
  var heightNb = 20; // height particle number
  var model = BABYLON.MeshBuilder.CreateBox("m", {
    size: size
  }, scene);
  var sps = new BABYLON.SolidParticleSystem("sps", scene, {
    isPickable: true
  });
  var nb = widthNb * heightNb;
  sps.addShape(model, nb);
  model.dispose();
  var s = sps.buildMesh();
  s.material = mat;
  s.freezeWorldMatrix();
  shadowGenerator.getShadowMap().renderList.push(s);
  return sps;
}
function initParticles(sps, widthNb, heightNb, size) {
  var p = 0;
  for (var j = 0; j < heightNb; j++) {
    for (var i = 0; i < widthNb; i++) {

      // let's position the quads on a grid
      sps.particles[p].position.x = i * size + sps.vars.shiftx;
      sps.particles[p].position.y = j * size + sps.vars.shifty;
      sps.particles[p].position.z = 0;

      // let's set the texture per quad
      sps.particles[p].uvs.x = i * size / sps.vars.totalWidth;
      sps.particles[p].uvs.y = j * size / sps.vars.totalHeight;
      sps.particles[p].uvs.z = (i + 1) * size / sps.vars.totalWidth;
      sps.particles[p].uvs.w = (j + 1) * size / sps.vars.totalHeight;

      // set a custom random value per particle
      sps.particles[p].rand = 1 / (1 + Math.random()) / 10;

      // increment the particle index
      p++;
    }
  }
}


function updateParticle(sps, boom) {
  var size = 10; // particle size
  var heightNb = 20; // height particle number
  var radius = size * heightNb / 12; // explosion radius
  var speed = radius * 1.2; // particle max speed
  return function (p) {
    // just after the click, set once the initial velocity
    if (sps.vars.justClicked) {
      // let's give them an initial velocity according to their distance from the explosion center
      p.position.subtractToRef(sps.vars.target, sps.vars.tmp);
      var len = sps.vars.tmp.length();
      var scl = (len < 0.001) ? 1.0 : sps.vars.radius / len;
      sps.vars.tmp.normalize();
      p.velocity.x += sps.vars.tmp.x * scl * speed * (1 + Math.random() * .3);
      p.velocity.y += sps.vars.tmp.y * scl * speed * (1 + Math.random() * .3);
      p.velocity.z += sps.vars.tmp.z * scl * speed * (1 + Math.random() * .3);
      if (p.idx == sps.nbParticles - 1) {
        sps.vars.justClicked = false; // last particle initialized
      }
    }

    // move the particle
    if (boom && !sps.vars.justClicked) {

      sps.vars.minY = ground.getHeightAtCoordinates(p.position.x, p.position.z) + size; // get the current ground altitude beneath the particle
      sps.vars.loss = -restitution * p.rand * 10; // negate and attenuation

      if (p.position.y < sps.vars.minY) {
        // we compute the vector V2 symetric to the velocity vector V1 by the ground normal axis N : V2 = (2 * (N.V1) / ||N||²) * N - V1
        ground.getNormalAtCoordinatesToRef(p.position.x, p.position.z, sps.vars.norm); // get the ground normal
        sps.vars.sym = 2 * (sps.vars.norm.x * p.velocity.x + sps.vars.norm.y * p.velocity.y + sps.vars.norm.z * p.velocity.z) / sps.vars.norm.lengthSquared(); // 2 * (N.V1) / ||N||²

        p.velocity.x = sps.vars.sym * sps.vars.norm.x - p.velocity.x;
        p.velocity.z = sps.vars.sym * sps.vars.norm.z - p.velocity.z;
        p.velocity.y = sps.vars.sym * sps.vars.norm.y - p.velocity.y;
        p.velocity.x *= sps.vars.loss;
        p.velocity.y *= sps.vars.loss;
        p.velocity.z *= sps.vars.loss;
      }

      // move
      p.velocity.y += gravity;
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y;
      p.position.z += p.velocity.z;

      // rotate
      p.rotation.x += (p.velocity.z) * p.rand;
      p.rotation.y += (p.velocity.x) * p.rand;
      p.rotation.z += (p.velocity.y) * p.rand;

      // don't fall forever : beneath a certain y velocity limit, prevent the particle from bouncing or falling and apply the ground friction
      if (p.position.y < sps.vars.minY && Math.abs(p.velocity.y) < 0.1 - gravity) {
        p.velocity.x *= friction;
        p.velocity.z *= friction;
        p.position.y = sps.vars.minY;
        p.velocity.y = 0;
      }
    }
  }
};