  var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(.0, .1, .2);
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 2.0;
    const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, .1, new BABYLON.Vector3(0, 0, 0), scene);
    camera.wheelDeltaPercentage = .01;
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 10.7;
    const mat = new BABYLON.StandardMaterial('mat', scene);
    mat.disableLighting = true;
    const path = [
      new BABYLON.Vector3(-1.0, 0.0, 0.0),
      new BABYLON.Vector3(0.0, 1., 0.0),
      new BABYLON.Vector3(1.0, 0, 0.0),
      new BABYLON.Vector3(0.0, -1., 0.0),
      new BABYLON.Vector3(-1.0, 0.0, 0.0),
    ];
    const colors = new Array(path.length).fill(0).map(() => new BABYLON.Color4(1, 1, 1, 1))
    const squaresCount = 100;
    const step = 1.0;
    const maxZ = squaresCount * step;
    const squares = [];
    for (let i = 0; i < squaresCount; i += 1) {
      const square = BABYLON.MeshBuilder.CreateLines("tube", {points: path,colors}, scene);
      square.material.emissiveColor = new BABYLON.Color3(1, .5, 0);
      square.material.disableLighting = true;
      square.material.alpha = 1.
      square.idx = i;
      square.originalPosZ = -square.idx * step;
      square.position.z=square.originalPosZ;
      squares.push(square)
    }
    let time = 0;
    const rate = 0.01;
    scene.registerBeforeRender(function() {
      for (let i = 0; i < squaresCount; i += 1) {
        const square = squares[i];
        square.position.z = square.originalPosZ + time * 10.;
        square.rotation.z = Math.cos(time + square.idx * .1) * Math.PI / 2;
        
        BABYLON.Color3.HSVtoRGBToRef(square.idx * 10. % 360, 1, 1, square.material.emissiveColor)
        square.material.emissiveColor.scaleToRef(1. - Math.sqrt(Math.abs(square.position.z / maxZ)), square.material.emissiveColor)
        
        if (square.position.z > 0) {
          square.idx += squaresCount;
          square.originalPosZ = -square.idx * step
        }
      }
      camera.fov = (Math.sin(time * 3.) * .25 + .75) * .25 + .525
      time += scene.getAnimationRatio() * rate;

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