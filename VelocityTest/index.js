var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Purple();

  var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(-25, 20, -70), scene);
  camera.attachControl(canvas, true);
  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.setTarget(new BABYLON.Vector3(0, 0, 0));

  // 光源
  // https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
  // https://doc.babylonjs.com/typedoc/classes/BABYLON.DirectionalLight#constructor
  var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0.2, -1, 0), scene);
  light.position = new BABYLON.Vector3(0, 80, 0);

  // 纹理
  // https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
  // https://doc.babylonjs.com/typedoc/classes/BABYLON.StandardMaterial#constructor
  var materialAmiga = new BABYLON.StandardMaterial("amiga", scene);
  materialAmiga.diffuseTexture = new BABYLON.Texture("textures/amiga.jpg", scene);
  materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  materialAmiga.diffuseTexture.uScale = 5;
  materialAmiga.diffuseTexture.vScale = 5;

  // https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows
  // https://doc.babylonjs.com/typedoc/classes/BABYLON.ShadowGenerator#constructor
  var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin());

  var pp = {
    mass: 1,
    friction: 0.5,
    restitution: 0.8
  }

  var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 16, 2, scene);
  sphere1.material = materialAmiga;
  sphere1.position = new BABYLON.Vector3(-20, -3.5, 0);
  shadowGenerator.addShadowCaster(sphere1);
  sphere1.physicsImpostor = new BABYLON.PhysicsImpostor(sphere1, BABYLON.PhysicsImpostor.SphereImpostor, pp, scene);

  var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 16, 2, scene);
  sphere2.material = materialAmiga;
  sphere2.position = new BABYLON.Vector3(5, -3.5, 0);
  shadowGenerator.addShadowCaster(sphere2);

  var damping = 0.2
  if (sphere1.physicsImpostor.physicsBody.setDamping) {
    sphere1.physicsImpostor.physicsBody.setDamping(damping, damping);
  }
  if (sphere1.physicsImpostor.physicsBody.linearDamping) {
    sphere1.physicsImpostor.physicsBody.linearDamping = 0.4;
  }

  var ground = BABYLON.Mesh.CreateBox("Ground", 1, scene);
  ground.scaling = new BABYLON.Vector3(100, 1, 100);
  ground.position.y = -5.0;
  ground.checkCollisions = true;

  var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
  groundMat.backFaceCulling = false;

  ground.material = groundMat;
  ground.receiveShadows = true;

  BABYLON.MeshBuilder.CreateLines("lines", {
    points: [new BABYLON.Vector3(-50, -4.5, 0),
      new BABYLON.Vector3(50, -4.5, 0)
    ]
  }, scene);

  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0,
    friction: 2,
    restitution: 0.7
  }, scene);

  sphere1.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(30, 0, -6));

  var spin = true;
  var i = 0;
  var points = []
  scene.registerBeforeRender(function() {
    if (!spin) return;
    i++;
    if (i < 300 && i % 5 == 0) {
      var v = sphere1.physicsImpostor.getLinearVelocity();
      sphere1.physicsImpostor.applyForce(
        new BABYLON.Vector3(0, 0, v.x * 0.8),
        sphere1.getAbsolutePosition().add(new BABYLON.Vector3(0, 0, -10))
      )
      points.push(new BABYLON.Vector3(
        sphere1.getAbsolutePosition().x, -4.5, sphere1.getAbsolutePosition().z
      ));
      BABYLON.MeshBuilder.CreateLines("lines", {
        points: points
      }, scene);
    }
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