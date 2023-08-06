var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(-45), BABYLON.Tools.ToRadians(80), 20, new BABYLON.Vector3(0, 3.5, 0), scene);
  camera.attachControl(canvas, false);
  // https://doc.babylonjs.com/typedoc/classes/BABYLON.AmmoJSPlugin
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin());
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  var ground = BABYLON.Mesh.CreateBox("ground1", 20, scene);
  ground.scaling.y = 0.05;
  ground.translate(BABYLON.Vector3.Down(), 1);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
    mass: 0
  }, scene);
  var cards = [];
  for (var i = 0; i < 52; i++) {
    var card = BABYLON.Mesh.CreateBox("", 1, scene)
    card.position.y = 1 + (i / 8)
    card.scaling.y = 0.01;
    card.physicsImpostor = new BABYLON.PhysicsImpostor(card, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 0.1,
      friction: 300,
      restitution: 0.001
    })
    cards.push(card);
  }
  var stopped = false;
  scene.onBeforeRenderObservable.add(() => {
    if (!stopped) {
      if (cards[51].position.y < 0.7) {
        cards.forEach((card) => {
          card.physicsImpostor.dispose();
          card.physicsImpostor = null;
        })
        stopped = true;
      }
    }
  })
  document.onkeydown = () => {
    cards.forEach((card) => {
      if (!card.physicsImpostor) {
        card.physicsImpostor = new BABYLON.PhysicsImpostor(card, BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 0.1,
          friction: 0.7,
          restitution: 0.1
        })
      }
      card.physicsImpostor.setLinearVelocity(new BABYLON.Vector3((Math.random() - 0.5) * 10, 10, (Math.random() - 0.5) * 10))
    })
  }

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
  await Ammo();


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