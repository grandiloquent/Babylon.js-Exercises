// https://www.babylonjs.com/demos/Boom
var createScene = function() {
  //  Particle parameters
  var size = 10; // particle size
  var widthNb = 30; // width particle number
  var heightNb = 20; // height particle number
  var gravity = -0.07; // gravity
  var restitution = 0.9; // energy restitution on ground collision ex : 0.6 => 60 %
  var friction = 0.995; // ground friction once the particle has landed
  var radius = size * heightNb / 12; // explosion radius
  var speed = radius * 1.2; // particle max speed

  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(.4, .6, .8);

  const camera = createCamera();

  createHemisphericLight();

  var dirLight = createDirectionalLight();

  var pl = createPointLight();

  var tx = createDynamicTexture();

  var mat = createStandardMaterial(tx);

  var ground = createGround();
  createDisc(ground);
  var shadowGenerator = createShadowGenerator(dirLight);
  

  var sps = createSolidParticleSystem(scene,mat,shadowGenerator);


  // SPS tmp internal vars to avoid memory re-allocations
  sps.vars.target = BABYLON.Vector3.Zero(); // the target point where to set the explosion center
  sps.vars.tmp = BABYLON.Vector3.Zero(); // tmp vector3
  sps.vars.totalWidth = size * widthNb; // wall width
  sps.vars.totalHeight = size * heightNb; // wall height
  sps.vars.shiftx = -sps.vars.totalWidth / 2; // shift value to center the wall on X
  sps.vars.shifty = -sps.vars.totalHeight / 2; // shift value to center the wall on Y
  sps.vars.radius = radius; // explosion radius
  sps.vars.minY = 0.0 // current ground altitude
  sps.vars.norm = BABYLON.Vector3.Zero(); // current ground normal
  sps.vars.sym = 0.0; // tmp for symetry computation around the normal
  sps.vars.loss = 0.0; // tmp float for energy loss
  sps.vars.justClicked = false; // flag to compute or not the initial velocities



  // SPS behavior : this function is called by setParticles() for each particle
  sps.updateParticle = function(p) {

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
  };

  // If we want the shadows to fit the bounding box, we need to update it once per frame
  sps.afterUpdateParticles = function() {
    this.refreshVisibleSize();
  };


 initParticles(sps,widthNb, heightNb, size); // compute initial particle positions
  sps.setParticles(); // set them
  sps.computeParticleColor = false; // the colors won't change
  sps.computeParticleTexture = false; // nor the texture now

  // Boom trigger
  var boom = false;
  scene.onPointerDown = function(evt, pickResult) {
    var faceId = pickResult.faceId;
    if (faceId == -1) {
      return;
    }
    var idx = sps.pickedParticles[faceId].idx;
    var p = sps.particles[idx];
    boom = true;
    // set the target (explosion center) at the distance "radius" from the picked particle on the camera-particle axis
    camera.position.subtractToRef(p.position, sps.vars.target);
    sps.vars.target.normalize();
    sps.vars.target.scaleInPlace(radius);
    sps.vars.target.addInPlace(p.position);
    sps.vars.justClicked = true;
  }

  // Animation
  // scene.debugLayer.show();
  scene.registerBeforeRender(function() {
    sps.setParticles();
    pl.position = camera.position;
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