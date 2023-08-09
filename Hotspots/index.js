var createScene = async function() {
  var scene = new BABYLON.Scene(engine);
  BABYLON.SceneLoader.ShowLoadingScreen = false;

  const sceneParams = {
    clearColor: new BABYLON.Color4(0, 0, 0, 0),
    bgColor: new BABYLON.Color3.FromInts(111, 127, 133),
    gutterSize: 20
  };

  function setViewportSize() {
    if (engine.getRenderWidth() !== screen.width || engine.getRenderHeight() !== screen.height) {
      screen.width = engine.getRenderWidth();
      screen.height = engine.getRenderHeight();
      screen.ratio = screen.width / screen.height;
    }
    camera.viewWidth = ((screen.width - (sceneParams.gutterSize * 0.5)) * 0.5) / screen.width;
    camera.rightViewportPosition = 1.0 - camera.viewWidth;
    if (camera.splitScreen) {
      camera.leftCurrentWidth = camera.rightCurrentWidth = camera.viewWidth;
      camera.rightCurrentWidth = camera.rightViewportPosition;
      camera.left.viewport = new BABYLON.Viewport(0.0, 0.0, camera.viewWidth, 1.0);
      camera.right.viewport = new BABYLON.Viewport(camera.rightViewportPosition, 0.0, camera.viewWidth, 1.0);
    } else {
      camera.leftCurrentWidth = 1.0;
      camera.rightCurrentWidth = 0.0;
      camera.rightCurrentPosition = 1.0;
      camera.left.viewport = new BABYLON.Viewport(0.0, 0.0, 1.0, 1.0);
      camera.right.viewport = new BABYLON.Viewport(1.0, 0.0, 0.0, 1.0);
    }
  }
  const lights = {};
  const env = {};
  const camera = {
    aniamtingViews: false,
    splitScreen: false
  };
  const screen = {};
  const mask = {
    left: 0x01000000,
    right: 0x01000000,
    gui: 0x0100000,
    skybox: 0x11000000,
  };
  async function initScene() {
    camera.left = new BABYLON.ArcRotateCamera("cameraLeft", 2.683, 1.134, 36, new BABYLON.Vector3(0.0, 6.0, 0.0), scene);
    camera.left.minZ = 0.1;
    camera.left.wheelDeltaPercentage = 0.1;
    camera.left.upperRadiusLimit = 50;
    camera.left.lowerRadiusLimit = 20;
    camera.left.upperBetaLimit = 1.4;
    camera.left.lowerBetaLimit = 0;
    camera.left.attachControl(canvas, true);
    camera.left.layerMask = mask.left;

    screen.width = engine.getRenderWidth();
    screen.height = engine.getRenderHeight();
    screen.ratio = screen.width / screen.height;

    camera.right = camera.left.clone("cameraRight");
    camera.right.wheelDeltaPercentage = 0.1;
    camera.right.attachControl(canvas, true);
    camera.right.layerMask = mask.right;

    camera.gui = new BABYLON.UniversalCamera("guiCamera", new BABYLON.Vector3(0, 0, 0), scene);
    camera.gui.detachControl();
    camera.gui.layerMask = mask.gui;

    setViewportSize();
    engine.onResizeObservable.add(setViewportSize);

    scene.activeCameras.push(camera.left);
    scene.activeCameras.push(camera.right);
    scene.activeCameras.push(camera.gui);

    env.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
      size: 1000.0
    }, scene);
    env.skybox.layerMask = mask.skybox;
    env.skyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    env.skyboxMaterial.backFaceCulling = false;
    env.skyboxMaterial.albedoColor = sceneParams.bgColor.toLinearSpace();
    env.skyboxMaterial.unlit = true;
    env.skybox.material = env.skyboxMaterial;
    env.skybox.isPickable = false;

    env.lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("studio_512.env", scene);
    env.lighting.name = "runyonCanyon";
    env.lighting.gammaSpace = false;
    env.lighting.rotationY = 1.9;
    scene.environmentTexture = env.lighting;
    scene.environmentIntentsity = 1.0;

    lights.dirLightLeft = new BABYLON.DirectionalLight("dirLightLeft", new BABYLON.Vector3(0.51, -0.2, -0.83), scene);
    lights.dirLightLeft.position = new BABYLON.Vector3(-0.04, 0.057, 20);
    lights.dirLightLeft.shadowMinZ = 0.5;
    lights.dirLightLeft.shadowMaxZ = 140;
    lights.dirLightLeft.intensity = 3;

    lights.dirLightRight = lights.dirLightLeft.clone("dirLightRight");

  }

  function selectVariant(mesh, variant) {
    BABYLON.GLTF2.Loader.Extensions.KHR_materials_variants.SelectVariant(mesh, variant);
  }
  const meshes = {};
  const shoeVariant = {
    one: "midnight",
    two: "beach",
    three: "street"
  };
  const chairVariant = {
    one: "Mango Velvet",
    two: "Peacock Velvet"
  };
  const hotspotParams = {
    dotColor: new BABYLON.Color3.FromInts(0, 103, 184),
    dotSize: 0.5,
    antiAlias: 0.02,
    ghostValue: 0.5,
    ghostSize: 0.0,
    ghostMaxSize: 0.8,
    ringSize: 0.0,
    ringMaxSize: 0.8,
    ringThickness: 0.25,
    ringDotSize: 0.35,
    maxOpacity: 0.9
  }
  const hotspots = [{
    name: "hotspot_loop",
    position: new BABYLON.Vector3(12.0, 13.25, -0.4),
    forward: new BABYLON.Vector3(-1, 0, 0),
    angleMin: -0.75,
    angleMax: -0.6,
    selected: false,
    toastVersion: 0,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas finibus nisl at scelerisque viverra. Vestibulum blandit sodales ex, eu sollicitudin massa dapibus sit amet. Donec tincidunt a metus at porttitor. Suspendisse id turpis tempus, pellentesque ante sed, efficitur lectus. Sed viverra nec arcu non pretium. Mauris at odio leo. Proin facilisis neque sem. Mauris aliquet erat at neque suscipit, eu laoreet augue efficitur."
  }, {
    name: "hotspot_eyelet",
    position: new BABYLON.Vector3(-3.8, 7.0, -3.5),
    forward: new BABYLON.Vector3(0, 0, 1),
    angleMin: 0.3,
    angleMax: 0.45,
    selected: false,
    toastVersion: 1,
    description: "Ut hendrerit euismod nisi nec eleifend. Nunc pretium nibh malesuada lectus pharetra pulvinar. Maecenas mattis auctor faucibus. Mauris et feugiat est, ac malesuada dolor. Vivamus dignissim ornare luctus. Vivamus vestibulum sed eros id pharetra. Pellentesque blandit felis suscipit iaculis lacinia. Interdum et malesuada fames ac ante ipsum primis in faucibus."
  }]

  async function loadMeshes() {
    meshes.shoe = await BABYLON.SceneLoader.ImportMeshAsync("", "shoe_variants.glb").then(function(result) {
      meshes.shoeMesh = result.meshes[0];
      for (let child of result.meshes) {
        if (child.getClassName() === "Mesh") {
          child.layerMask = mask.left;
          child.isPickable = false;
        }
      }
    });
    meshes.shoeMesh.scaling = new BABYLON.Vector3(100, 100, -100);
    meshes.shoeMesh.position.rotationY = 0;
    selectVariant(meshes.shoeMesh, shoeVariant.one);

    meshes.chairSubmeshes = [];
    meshes.chair = await BABYLON.SceneLoader.ImportMeshAsync("", "SheenChair.glb").then(function(result) {
      meshes.chairMesh = result.meshes[0];
      for (let child of result.meshes) {
        if (child.getClassName() === "Mesh") {
          child.layerMask = mask.right;
          child.isPickable = false;
          meshes.chairSubmeshes.push(child);
        }
      }
    });
    meshes.chairMesh.scaling = new BABYLON.Vector3(23, 23, -23);
    meshes.chairMesh.position.y = -0.23;
    selectVariant(meshes.chairMesh, chairVariant.one);

    meshes.groundLeft = new BABYLON.MeshBuilder.CreateGround("groundLeft", {
      width: 150,
      height: 150
    }, scene);
    meshes.groundLeft.layerMask = mask.left;
    lights.dirLightLeft.includedOnlyMeshes.push(meshes.groundLeft);
    lights.dirLightLeft.includedOnlyMeshes.push(meshes.shoeMesh);
    meshes.groundLeft.position.y = -0.2;
    meshes.groundLeft.isPickable = false;

    meshes.groundRight = meshes.groundLeft.clone("groundRight");
    meshes.groundRight.layerMask = mask.right;
    lights.dirLightRight.includedOnlyMeshes.push(meshes.groundRight);

    for (let child of hotspots) {
      child.mesh = new BABYLON.MeshBuilder.CreatePlane(child.name, {
        size: 2
      }, scene);
      child.mesh.position = child.position;
      child.mesh.billboardMode=BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    }
  }

  await initScene();
  await loadMeshes();
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
  window.scene = await createScene();
};
initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});