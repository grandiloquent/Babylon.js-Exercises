var createScene = function() {

  /*
    https://doc.babylonjs.com/typedoc/classes/BABYLON.Scene
  */
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  /*
  设置相机

  https://doc.babylonjs.com/typedoc/classes/BABYLON.ArcRotateCamera
  */
  var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 100, new BABYLON.Vector3(0, 0, 0), scene);
  camera.setPosition(new BABYLON.Vector3(20, 100, 100));
  camera.maxZ = 20000;
  camera.lowerRadiusLimit = 50;
  // Attach the input controls to a specific dom element to get the input from.
  camera.attachControl(canvas, true);


  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    diameter: 1,
    segments: 32
  }, scene);
  var materialBox = new BABYLON.StandardMaterial("texture1", scene);
  materialBox.diffuseColor = new BABYLON.Color3(0, 1, 0);

  sphere.material = materialBox;

  var points = [];
  var radius = 0.5;
  var angle = 0;
  for (var index = 0; index < 1000; index = index + 5) {
    /*
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
    */
    points.push(new BABYLON.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)));
    radius += 0.3;
    angle += 0.1;
  }

  const createDustDevil = function() {

    /*
    CreateBox(name: string, size: number, scene: Nullable<Scene>, updatable?: boolean, sideOrientation?: number): Mesh
    
    https://doc.babylonjs.com/typedoc/classes/BABYLON.Mesh
    */
    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);

    /*


    https://doc.babylonjs.com/typedoc/classes/BABYLON.ParticleSystem
    */
    var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

    particleSystem.particleTexture = new BABYLON.Texture("textures/fire.jpg", scene);
    particleSystem.emitter = fountain;
    particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);
    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.1, 0.1, 1.0, 1.0);

    // Color the particle will have at the end of its lifetime
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    particleSystem.minSize = 1.5;
    particleSystem.maxSize = 2.9;

    // Minimum life time of emitting particles.
    particleSystem.minLifeTime = 2.3;
    particleSystem.maxLifeTime = 8.5;

    // The maximum number of particles to emit per frame
    particleSystem.emitRate = 1150;

    // Source color is added to the destination color without alpha affecting the result
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new BABYLON.Vector3(0, -0.81, 0);
    particleSystem.direction1 = new BABYLON.Vector3(-2, 18, 2);
    particleSystem.direction2 = new BABYLON.Vector3(2, 18, 2);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = .4;
    particleSystem.updateSpeed = 0.009;
    particleSystem.start();

    var keys = [];
    /*

    new Animation(name: string, targetProperty: string, framePerSecond: number, dataType: number, loopMode?: number, enableBlending?: boolean): Animation

    https://doc.babylonjs.com/typedoc/classes/BABYLON.Animation
    https://doc.babylonjs.com/features/featuresDeepDive/animation
    */

    var animation = new BABYLON.Animation("animation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    keys.push({
      frame: 0,
      value: 0
    });
    keys.push({
      frame: 50,
      value: Math.PI * 40
    });
    keys.push({
      frame: 100,
      value: 0
    });
    animation.setKeys(keys);
    fountain.animations.push(animation);

    // Registers a function to be called after every frame render
    scene.registerAfterRender(function() {
      fountain.position = sphere.position;
    })
  }
  createDustDevil();

  var i = 199;

  scene.registerBeforeRender(function() {
    sphere.position.x = points[i].x;
    sphere.position.z = points[i].z;
    i = (i - 1)
    if (i < 1) {
      i = 199
    };
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