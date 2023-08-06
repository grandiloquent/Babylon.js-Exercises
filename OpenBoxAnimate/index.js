var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  let meshes = [];
  let pivot = [];
  let camdef = [10, 10, 10];
  let camdefpos = Math.sqrt(Math.pow((camdef[0]), 2) + Math.pow((camdef[1]), 2) + Math.pow((camdef[2]), 2));
  scene.clearColor = new BABYLON.Color4(255 / 255, 255 / 255, 255 / 255, 1);

  let json = [{
    id: 999,
    thickness: 0.1,
    dimDef: {
      Height: 4,
      Length: 6,
      Width: 3,
    },
    camera: {
      def: 1,
      min: -10,
      max: 10,
    },
    plate: [{
        width: "length",
        depth: "width",
        height: "thickness",
      }, {
        width: "length",
        depth: "width",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'left',
        }
      }, {
        width: "height",
        depth: "width",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'top'
        },
      },
      {
        width: "length",
        depth: "height",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'right'
        }
      }, {
        width: "length",
        depth: "width/2",
        height: "thickness",
        parent: {
          id: 1,
          pos: 'left',
        },
        isInteractive: true,
      }, {
        width: "height",
        depth: "width",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'bottom',
        }
      }, {
        width: "length",
        depth: "width/2",
        height: "thickness",
        parent: {
          id: 3,
          pos: 'right',

        },
        isInteractive: true
      },
    ],
    anim: [{
      id: 2,
      axe: "z",
      rotation: -Math.PI / 2,
      time: 1,
      last: true,
    }, {
      id: 5,
      axe: "z",
      rotation: Math.PI / 2,
      time: 1,
      last: true
    }, {
      id: 1,
      axe: "x",
      rotation: Math.PI / 2,
      time: 1,
      last: false
    }, {
      id: 3,
      axe: "x",
      rotation: -Math.PI / 2,
      time: 1,
      last: true
    }, {
      id: 6,
      axe: "x",
      rotation: -Math.PI / 2,
      time: 1,
      last: false,
      rotationInteractive: -Math.PI / 2 + 2,
      rotationSpeed: 500,
    }, {
      id: 4,
      axe: "x",
      rotation: Math.PI / 2,
      time: 1,
      last: true,
      rotationInteractive: -Math.PI / 2 + 1,
      rotationSpeed: 500,
    }]
  }]

  function camera() {
    camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 4, 100 - (json[0].camera.def * 100) + camdefpos, new BABYLON.Vector3(0, json[0].dimDef.Height / 2, 0), scene);
    camera.attachControl(canvas, true);
  }
  camera();
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