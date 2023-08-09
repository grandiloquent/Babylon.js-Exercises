var createScene = async function() {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);
  BABYLON.SceneLoader.ShowLoadingScreen = false;

  // common scene parameters
  const sceneParams = {
    clearColor: new BABYLON.Color4(0, 0, 0, 0),
    bgColor: new BABYLON.Color3.FromInts(111, 127, 133),
    gutterSize: 20
  };

  // determine the size of the viewport minus the gutter based on the current window width
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
      camera.rightCurrentPosition = camera.rightViewportPosition;
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

  // create animations for viewport motion
  const clipLength = 60;
  const keys = {};
  const anim = {};

  function animateViewports(splitScreen) {
    if (anim.group !== undefined) {
      anim.group.dispose();
    }

    // set up keys for all animations
    keys.leftCameraCompress = [{
        frame: 0,
        value: 1.0
      },
      {
        frame: clipLength,
        value: camera.viewWidth
      }
    ];
    keys.leftCameraExpand = [{
        frame: 0,
        value: camera.viewWidth
      },
      {
        frame: clipLength,
        value: 1.0
      }
    ];
    keys.rightCameraCompress = [{
        frame: 0,
        value: camera.viewWidth
      },
      {
        frame: clipLength,
        value: 0.0
      }
    ];
    keys.rightCameraExpand = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: clipLength,
        value: camera.viewWidth
      }
    ];
    keys.rightCameraCompressPosition = [{
        frame: 0,
        value: camera.rightViewportPosition
      },
      {
        frame: clipLength,
        value: 1.0
      }
    ];
    keys.rightCameraExpandPosition = [{
        frame: 0,
        value: 1.0
      },
      {
        frame: clipLength,
        value: camera.rightViewportPosition
      }
    ];
    keys.buttonsHydrate = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: clipLength * 0.5,
        value: 0.0
      },
      {
        frame: clipLength,
        value: 1.0
      }
    ];
    keys.buttonsDehydrate = [{
        frame: 0,
        value: 1.0
      },
      {
        frame: clipLength * 0.5,
        value: 0.0
      }
    ];

    // set up easing function and easing mode
    anim.easingFunction = new BABYLON.QuinticEase();
    anim.easingMode = BABYLON.EasingFunction.EASINGMODE_EASEINOUT;

    // create animation clips
    anim.leftCameraWidthAnim = new BABYLON.Animation("leftCameraWidthAnim", "leftCurrentWidth", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.easingFunction.setEasingMode(anim.easingMode);
    anim.leftCameraWidthAnim.setEasingFunction(anim.easingFunction);

    anim.rightCameraWidthAnim = new BABYLON.Animation("rightCameraWidthAnim", "rightCurrentWidth", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.easingFunction.setEasingMode(anim.easingMode);
    anim.rightCameraWidthAnim.setEasingFunction(anim.easingFunction);

    anim.rightViewportPositionAnim = new BABYLON.Animation("rightViewportPositionAnim", "rightCurrentPosition", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.easingFunction.setEasingMode(anim.easingMode);
    anim.rightViewportPositionAnim.setEasingFunction(anim.easingFunction);

    anim.buttonsAnim = new BABYLON.Animation("buttonsAnim", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    anim.easingFunction.setEasingMode(anim.easingMode);
    anim.buttonsAnim.setEasingFunction(anim.easingFunction);

    // append keys to animation
    if (splitScreen) {
      anim.leftCameraWidthAnim.setKeys(keys.leftCameraExpand);
      anim.rightCameraWidthAnim.setKeys(keys.rightCameraCompress);
      anim.rightViewportPositionAnim.setKeys(keys.rightCameraCompressPosition);
      anim.buttonsAnim.setKeys(keys.buttonsDehydrate);
    } else {
      anim.leftCameraWidthAnim.setKeys(keys.leftCameraCompress);
      anim.rightCameraWidthAnim.setKeys(keys.rightCameraExpand);
      anim.rightViewportPositionAnim.setKeys(keys.rightCameraExpandPosition);
      anim.buttonsAnim.setKeys(keys.buttonsHydrate);
    }

    // add animations to a group
    anim.group = new BABYLON.AnimationGroup("viewportMotion");
    anim.group.addTargetedAnimation(anim.leftCameraWidthAnim, camera);
    anim.group.addTargetedAnimation(anim.rightCameraWidthAnim, camera);
    anim.group.addTargetedAnimation(anim.rightViewportPositionAnim, camera);
    anim.group.addTargetedAnimation(anim.buttonsAnim, gui.buttonGridRight);
    anim.group.normalize(0, clipLength);
    anim.group.onAnimationEndObservable.add(() => {
      camera.animatingViews = false;
    });
    camera.animatingViews = true;
    anim.group.play(false);
  }

  // create camera and lights for scene
  const lights = {};
  const env = {};
  const camera = {
    animatingViews: false,
    splitScreen: false
  };
  const screen = {};
  const mask = {
    left: 0x01000000,
    right: 0x10000000,
    gui: 0x00100000,
    skybox: 0x11000000,
    // hotspot: 0x10100000
  };
  async function initScene() {
    scene.clearColor = sceneParams.clearColor;

    // create left camera with layer mask
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

    // create right camera with layer mask
    camera.right = camera.left.clone("cameraRight");
    camera.right.wheelDeltaPercentage = 0.1;
    camera.right.attachControl(canvas, true);
    camera.right.layerMask = mask.right;

    // create gui camera
    camera.gui = new BABYLON.UniversalCamera("guiCamera", new BABYLON.Vector3(0, 0, 0), scene);
    camera.gui.detachControl();
    camera.gui.layerMask = mask.gui;

    // calculate camera width minus gutter and set viewport size on scene creation and when canvas is resized
    setViewportSize();
    engine.onResizeObservable.add(setViewportSize);

    // set both cameras to active
    scene.activeCameras.push(camera.left);
    scene.activeCameras.push(camera.right);
    scene.activeCameras.push(camera.gui);

    // create skybox with unlit color to blend into ground mesh and set to visible in both cameras
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

    // load and create IBL from precalculated env file
    env.lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://patrickryanms.github.io/BabylonJStextures/ENV/studio_512.env", scene);
    env.lighting.name = "runyonCanyon";
    env.lighting.gammaSpace = false;
    env.lighting.rotationY = 1.9;
    scene.environmentTexture = env.lighting;
    scene.environmentIntensity = 1.0;

    // create two directional lights 
    lights.dirLightLeft = new BABYLON.DirectionalLight("dirLightLeft", new BABYLON.Vector3(0.51, -0.2, -0.83), scene);
    lights.dirLightLeft.position = new BABYLON.Vector3(-0.04, 0.057, 20);
    lights.dirLightLeft.shadowMinZ = 0.5;
    lights.dirLightLeft.shadowMaxZ = 140;
    lights.dirLightLeft.intensity = 3;

    lights.dirLightRight = lights.dirLightLeft.clone("dirLightRight");
  }

  // select the variant from the KHR_materials_variants extension
  function selectVariant(mesh, variant) {
    BABYLON.GLTF2.Loader.Extensions.KHR_materials_variants.SelectVariant(mesh, variant);
  }

  // load meshes
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
    },
    {
      name: "hotspot_eyelet",
      position: new BABYLON.Vector3(-3.8, 7.0, -3.5),
      forward: new BABYLON.Vector3(0, 0, 1),
      angleMin: 0.3,
      angleMax: 0.45,
      selected: false,
      toastVersion: 1,
      description: "Ut hendrerit euismod nisi nec eleifend. Nunc pretium nibh malesuada lectus pharetra pulvinar. Maecenas mattis auctor faucibus. Mauris et feugiat est, ac malesuada dolor. Vivamus dignissim ornare luctus. Vivamus vestibulum sed eros id pharetra. Pellentesque blandit felis suscipit iaculis lacinia. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    }
  ]

  async function loadMeshes() {
    // load shoe and assign layer mask to meshes
    meshes.shoe = await BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/shoe_variants.glb").then(function(result) {
      meshes.shoeMesh = result.meshes[0];
      for (let child of result.meshes) {
        if (child.getClassName() === "Mesh") {
          child.layerMask = mask.left;
          child.isPickable = false;
        }
      }
    });
    meshes.shoeMesh.scaling = new BABYLON.Vector3(100, 100, -100);
    meshes.shoeMesh.position.y = 0;
    selectVariant(meshes.shoeMesh, shoeVariant.one);

    // load chair and assign layer mask to meshes
    meshes.chairSubmeshes = [];
    meshes.chair = await BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/SheenChair.glb").then(function(result) {
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

    // create two grount planes, one for each cameara
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

    // create hotspots
    for (let child of hotspots) {
      child.mesh = new BABYLON.MeshBuilder.CreatePlane(child.name, {
        size: 2
      }, scene);
      child.mesh.position = child.position;
      child.mesh.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
    }

    // let loading page know meshes are ready
    readyCheck.meshesReady = true;
  }

  // load node material shader and create material for ground before assigning to two ground meshes
  BABYLON.NodeMaterial.IgnoreTexturesAtLoadTime = true;
  const meshesMats = {};
  const meshesParameters = {};
  async function createMaterials() {
    meshesMats.groundLeft = new BABYLON.NodeMaterial("groundLeftNodeMat", scene, {
      emitComments: false
    });
    await meshesMats.groundLeft.loadAsync("https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/shaders/groundShader.json");
    meshesMats.groundLeft.build(false);
    meshes.groundLeft.material = meshes.groundRight.material = meshesMats.groundLeft;
    meshesParameters.groundColor = meshesMats.groundLeft.getBlockByName("groundColor");
    meshesParameters.groundColor.value = sceneParams.bgColor;

    meshesMats.hotspot = new BABYLON.NodeMaterial("hotspot", scene, {
      emitComments: false
    });
    await meshesMats.hotspot.loadAsync("https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/shaders/hotspotShader.json");
    meshesMats.hotspot.build(false);
    meshesMats.hotspot.getBlockByName("dotColor").value = hotspotParams.dotColor;
    meshesMats.hotspot.getBlockByName("dotSize").value = hotspotParams.dotSize;
    meshesMats.hotspot.getBlockByName("antiAlias").value = hotspotParams.antiAlias;
    meshesMats.hotspot.getBlockByName("ghostValue").value = hotspotParams.ghostValue;
    meshesMats.hotspot.getBlockByName("ghostSize").value = hotspotParams.ghostSize;
    meshesMats.hotspot.getBlockByName("ringSize").value = hotspotParams.ringSize;
    meshesMats.hotspot.getBlockByName("ringThickness").value = hotspotParams.ringThickness;
    meshesMats.hotspot.getBlockByName("maxOpacity").value = hotspotParams.maxOpacity;

    for (let child of hotspots) {
      child.mesh.material = meshesMats.hotspot.clone("hotspot_" + child.name.split("_")[1]);
      child.mesh.material.getBlockByName("hotspotVector").value = child.forward;
      child.mesh.material.getBlockByName("angleMin").value = child.angleMin;
      child.mesh.material.getBlockByName("angleMax").value = child.angleMax;
    }

    // let loading page know materials are ready
    readyCheck.materialsReady = true;
  }

  // create two shadow generators, one for each camera, and add shadow casters to meshes
  const shadows = {};

  function generateShadows() {
    shadows.leftGenerator = new BABYLON.ShadowGenerator(512, lights.dirLightLeft);
    shadows.leftGenerator.useContactHardeningShadow = true;
    shadows.leftGenerator.contactHardeningLightSizeUVRatio = 0.07;
    shadows.leftGenerator.darkness = 0.65;
    shadows.leftGenerator.addShadowCaster(meshes.shoeMesh);
    shadows.leftGenerator.enableSoftTransparentShadow = true;
    shadows.leftGenerator.transparencyShadow = true;

    meshes.groundLeft.receiveShadows = true;
    meshes.groundLeft.material.environmentIntensity = 0.2;

    shadows.rightGenerator = new BABYLON.ShadowGenerator(512, lights.dirLightRight);
    shadows.rightGenerator.useContactHardeningShadow = true;
    shadows.rightGenerator.contactHardeningLightSizeUVRatio = 0.07;
    shadows.rightGenerator.darkness = 0.65;
    for (let submesh of meshes.chairSubmeshes) {
      shadows.rightGenerator.addShadowCaster(submesh);
    }
    shadows.rightGenerator.enableSoftTransparentShadow = true;
    shadows.rightGenerator.transparencyShadow = true;

    meshes.groundRight.receiveShadows = true;
    meshes.groundRight.material.environmentIntensity = 0.2;
  }

  // create gui layer that is assigned to the full screen gui camera layerMask
  const gui = {};
  const buttonColor = {
    idle: "#2f2f2f",
    highlight: "#ffffff"
  };
  const activeButton = {};
  const toastParams = {
    topHidden: -250,
    topShown: 150,
    topHide: 300
  }

  function createGUI() {
    gui.texture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("guiLayer", true, scene);
    gui.texture.layer.layerMask = mask.gui;

    // interaction hint icon
    gui.hintIcon = new BABYLON.GUI.Image("interactionHint", "https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/textures/tapIcon.png");
    gui.hintIcon.width = "60px";
    gui.hintIcon.height = "60px";
    gui.hintIcon.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    gui.hintIcon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    gui.hintIcon.alpha = 0;
    gui.texture.addControl(gui.hintIcon);

    // toast
    gui.toast1 = new BABYLON.GUI.Rectangle("toast1");
    gui.toast1.width = "30%";
    gui.toast1.height = "15%";
    gui.toast1.left = "-5%";
    gui.toast1.top = toastParams.topHidden;
    gui.toast1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.toast1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gui.toast1.paddingLeft = "15px";
    gui.toast1.paddingRight = "15px";
    gui.toast1.paddingTop = "15px";
    gui.toast1.paddingBottom = "15px";
    gui.toast1.descendentsOnlyPadding = true;
    gui.toast1.background = "#ffffff";
    gui.texture.addControl(gui.toast1);

    gui.toast1Text = new BABYLON.GUI.TextBlock("toast1Text", hotspots[0].description);
    gui.toast1Text.textWrapping = true;
    gui.toast1Text.fontSize = "14px";
    gui.toast1Text.top = "30px";
    gui.toast1Text.paddingLeft = "10px";
    gui.toast1Text.paddingRight = "10px";
    gui.toast1Text.paddingBottom = "10px";
    gui.toast1Text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.toast1Text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gui.toast1.addControl(gui.toast1Text);

    gui.toast1DismissButton = new BABYLON.GUI.Button("toast1DismissButton");
    gui.toast1DismissButton.width = "30px";
    gui.toast1DismissButton.height = "30px";
    gui.toast1DismissButton.thickness = 0;
    gui.toast1DismissButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.toast1DismissButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gui.toast1.addControl(gui.toast1DismissButton);
    gui.toast1DismissButton.onPointerDownObservable.add(() => {
      clearHotspots();
      playToastAnimation(null);
    });

    gui.toast1Dismiss = new BABYLON.GUI.Image("toast1Dismiss", "https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/textures/ic_fluent_dismiss_24_regular.svg");
    gui.toast1Dismiss.width = "24px";
    gui.toast1Dismiss.height = "24px";
    gui.toast1DismissButton.addControl(gui.toast1Dismiss);

    gui.toast2 = new BABYLON.GUI.Rectangle("toast2");
    gui.toast2.width = "30%";
    gui.toast2.height = "15%";
    gui.toast2.left = "-5%";
    gui.toast2.paddingLeft = "15px";
    gui.toast2.paddingRight = "15px";
    gui.toast2.paddingTop = "15px";
    gui.toast2.paddingBottom = "15px";
    gui.toast2.descendentsOnlyPadding = true;
    gui.toast2.top = toastParams.topHidden;
    gui.toast2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.toast2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gui.toast2.background = "#ffffff";
    gui.texture.addControl(gui.toast2);

    gui.toast2Text = new BABYLON.GUI.TextBlock("toast2Text", hotspots[1].description);
    gui.toast2Text.textWrapping = true;
    gui.toast2Text.fontSize = "14px";
    gui.toast2Text.top = "30px";
    gui.toast2Text.paddingLeft = "10px";
    gui.toast2Text.paddingRight = "10px";
    gui.toast2Text.paddingBottom = "10px";
    gui.toast2Text.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.toast2Text.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gui.toast2.addControl(gui.toast2Text);

    gui.toast2DismissButton = new BABYLON.GUI.Button("toast2DismissButton");
    gui.toast2DismissButton.width = "30px";
    gui.toast2DismissButton.height = "30px";
    gui.toast2DismissButton.thickness = 0;
    gui.toast2DismissButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    gui.toast2DismissButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    gui.toast2.addControl(gui.toast2DismissButton);
    gui.toast2DismissButton.onPointerDownObservable.add(() => {
      clearHotspots();
      playToastAnimation(null);
    });

    gui.toast2Dismiss = new BABYLON.GUI.Image("toast2Dismiss", "https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/textures/ic_fluent_dismiss_24_regular.svg");
    gui.toast2Dismiss.width = "24px";
    gui.toast2Dismiss.height = "24px";
    gui.toast2DismissButton.addControl(gui.toast2Dismiss);

    toastParams.objects = [gui.toast1, gui.toast2];

    // container grid to separate the screen in half, no matter the width
    gui.buttonContainer = new BABYLON.GUI.Grid("buttonContainer");
    gui.buttonContainer.addColumnDefinition(0.5);
    gui.buttonContainer.addColumnDefinition(0.5);
    gui.buttonContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    gui.buttonContainer.height = "100px";
    gui.buttonContainer.paddingBottom = "40px";
    gui.texture.addControl(gui.buttonContainer);

    // left camera button grid
    gui.buttonGridLeft = new BABYLON.GUI.Grid("buttonGridLeft");
    gui.buttonGridLeft.addColumnDefinition(0.25);
    gui.buttonGridLeft.addColumnDefinition(0.25);
    gui.buttonGridLeft.addColumnDefinition(0.25);
    gui.buttonGridLeft.addColumnDefinition(0.25);
    gui.buttonGridLeft.width = "280px";
    gui.buttonGridLeft.paddingLeft = "40px";
    gui.buttonGridLeft.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.buttonContainer.addControl(gui.buttonGridLeft, 0, 0);

    // right camera button grid
    gui.buttonGridRight = new BABYLON.GUI.Grid("buttonGridRight");
    gui.buttonGridRight.addColumnDefinition(0.25);
    gui.buttonGridRight.addColumnDefinition(0.25);
    gui.buttonGridRight.addColumnDefinition(0.25);
    gui.buttonGridRight.addColumnDefinition(0.25);
    gui.buttonGridRight.width = "280px";
    gui.buttonGridRight.paddingLeft = "40px";
    gui.buttonGridRight.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    gui.buttonGridRight.alpha = sceneParams.splitScreen ? 1.0 : 0.0;
    gui.buttonContainer.addControl(gui.buttonGridRight, 0, 1);

    // button to toggle full screen or split screen
    gui.viewportButton = new BABYLON.GUI.Button("viewportButton");
    gui.viewportButton.width = "42px";
    gui.viewportButton.height = "42px";
    gui.viewportButton.thickness = 0;
    gui.buttonGridLeft.addControl(gui.viewportButton, 0, 0);
    gui.viewportButton.onPointerDownObservable.add(() => {
      // change icon and start animation for camera viewports
      if (camera.splitScreen) {
        gui.maximizeIcon.alpha = 0.0;
        gui.minimizeIcon.alpha = 1.0;
        animateViewports(camera.splitScreen);
        camera.splitScreen = false;
      } else {
        gui.maximizeIcon.alpha = 1.0;
        gui.minimizeIcon.alpha = 0.0;
        animateViewports(camera.splitScreen);
        camera.splitScreen = true;
      }
    });

    gui.viewportButtonShape = new BABYLON.GUI.Ellipse("viewportButtonShape");
    gui.viewportButtonShape.width = "40px";
    gui.viewportButtonShape.height = "40px";
    gui.viewportButtonShape.thickness = 0;
    gui.viewportButtonShape.background = "#333333";
    gui.viewportButton.addControl(gui.viewportButtonShape);

    // load both icons, but hide the inactive icon with alpha
    gui.maximizeIcon = new BABYLON.GUI.Image("maximizeIcon", "https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/textures/maximizeIcon.svg");
    gui.maximizeIcon.width = "24px";
    gui.maximizeIcon.height = "24px";
    gui.viewportButton.addControl(gui.maximizeIcon);

    gui.minimizeIcon = new BABYLON.GUI.Image("minimizeIcon", "https://patrickryanms.github.io/BabylonJStextures/Demos/splitScreen/textures/minimizeIcon.svg");
    gui.minimizeIcon.width = "24px";
    gui.minimizeIcon.height = "24px";
    gui.minimizeIcon.alpha = 0.0;
    gui.viewportButton.addControl(gui.minimizeIcon);

    // left camera variant buttons and click action which both changes the active variant on both meshes and changes the highlight color to active button
    gui.leftVar1Btn = new BABYLON.GUI.Button("leftVar1Btn");
    gui.leftVar1Btn.width = "42px";
    gui.leftVar1Btn.height = "42px";
    gui.leftVar1Btn.thickness = 0;
    gui.buttonGridLeft.addControl(gui.leftVar1Btn, 0, 1);
    gui.leftVar1Btn.onPointerDownObservable.add(() => {
      // change active variant and change highlight color to current button
      selectVariant(meshes.shoeMesh, shoeVariant.one);
      for (let button of gui.leftButtons) {
        button.color = buttonColor.idle;
      }
      activeButton.left = gui.leftVar1BtnShape;
      activeButton.left.color = buttonColor.highlight;
    });

    gui.leftVar1BtnShape = new BABYLON.GUI.Ellipse("leftVar1BtnShape");
    gui.leftVar1BtnShape.width = "40px";
    gui.leftVar1BtnShape.height = "40px";
    gui.leftVar1BtnShape.thickness = 3;
    gui.leftVar1BtnShape.color = buttonColor.highlight;
    gui.leftVar1BtnShape.background = "#215778";
    gui.leftVar1Btn.addControl(gui.leftVar1BtnShape);
    activeButton.left = gui.leftVar1BtnShape;

    gui.leftVar2Btn = new BABYLON.GUI.Button("leftVar2Btn");
    gui.leftVar2Btn.width = "42px";
    gui.leftVar2Btn.height = "42px";
    gui.leftVar2Btn.thickness = 0;
    gui.buttonGridLeft.addControl(gui.leftVar2Btn, 0, 2);
    gui.leftVar2Btn.onPointerDownObservable.add(() => {
      // change active variant and change highlight color to current button
      selectVariant(meshes.shoeMesh, shoeVariant.two);
      for (let button of gui.leftButtons) {
        button.color = buttonColor.idle;
      }
      activeButton.left = gui.leftVar2BtnShape;
      activeButton.left.color = buttonColor.highlight;
    });

    gui.leftVar2BtnShape = new BABYLON.GUI.Ellipse("leftVar2BtnShape");
    gui.leftVar2BtnShape.width = "40px";
    gui.leftVar2BtnShape.height = "40px";
    gui.leftVar2BtnShape.thickness = 3;
    gui.leftVar2BtnShape.color = buttonColor.idle;
    gui.leftVar2BtnShape.background = "#947979";
    gui.leftVar2Btn.addControl(gui.leftVar2BtnShape);

    gui.leftVar3Btn = new BABYLON.GUI.Button("leftVar3Btn");
    gui.leftVar3Btn.width = "42px";
    gui.leftVar3Btn.height = "42px";
    gui.leftVar3Btn.thickness = 0;
    gui.buttonGridLeft.addControl(gui.leftVar3Btn, 0, 3);
    gui.leftVar3Btn.onPointerDownObservable.add(() => {
      // change active variant and change highlight color to current button
      selectVariant(meshes.shoeMesh, shoeVariant.three);
      for (let button of gui.leftButtons) {
        button.color = buttonColor.idle;
      }
      activeButton.left = gui.leftVar3BtnShape;
      activeButton.left.color = buttonColor.highlight;
    });

    gui.leftVar3BtnShape = new BABYLON.GUI.Ellipse("leftVar3BtnShape");
    gui.leftVar3BtnShape.width = "40px";
    gui.leftVar3BtnShape.height = "40px";
    gui.leftVar3BtnShape.thickness = 3;
    gui.leftVar3BtnShape.color = buttonColor.idle;
    gui.leftVar3BtnShape.background = "#3c3c3c";
    gui.leftVar3Btn.addControl(gui.leftVar3BtnShape);

    // right camera variant buttons and click action which both changes the active variant on both meshes and changes the highlight color to active button
    gui.rightVar1Btn = new BABYLON.GUI.Button("rightVar1Btn");
    gui.rightVar1Btn.width = "42px";
    gui.rightVar1Btn.height = "42px";
    gui.rightVar1Btn.thickness = 0;
    gui.buttonGridRight.addControl(gui.rightVar1Btn, 0, 0);
    gui.rightVar1Btn.onPointerDownObservable.add(() => {
      // change active variant and change highlight color to current button
      selectVariant(meshes.chairMesh, chairVariant.one);
      for (let button of gui.rightButtons) {
        button.color = buttonColor.idle;
      }
      activeButton.right = gui.rightVar1BtnShape;
      activeButton.right.color = buttonColor.highlight;
    });

    gui.rightVar1BtnShape = new BABYLON.GUI.Ellipse("rightVar1BtnShape");
    gui.rightVar1BtnShape.width = "40px";
    gui.rightVar1BtnShape.height = "40px";
    gui.rightVar1BtnShape.thickness = 3;
    gui.rightVar1BtnShape.color = buttonColor.highlight;
    gui.rightVar1BtnShape.background = "#bb472e";
    gui.rightVar1Btn.addControl(gui.rightVar1BtnShape);
    activeButton.right = gui.rightVar1BtnShape;

    gui.rightVar2Btn = new BABYLON.GUI.Button("rightVar2Btn");
    gui.rightVar2Btn.width = "42px";
    gui.rightVar2Btn.height = "42px";
    gui.rightVar2Btn.thickness = 0;
    gui.buttonGridRight.addControl(gui.rightVar2Btn, 0, 1);
    gui.rightVar2Btn.onPointerDownObservable.add(() => {
      // change active variant and change highlight color to current button
      selectVariant(meshes.chairMesh, chairVariant.two);
      for (let button of gui.rightButtons) {
        button.color = buttonColor.idle;
      }
      activeButton.right = gui.rightVar2BtnShape;
      activeButton.right.color = buttonColor.highlight;
    });

    gui.rightVar2BtnShape = new BABYLON.GUI.Ellipse("rightVar2BtnShape");
    gui.rightVar2BtnShape.width = "40px";
    gui.rightVar2BtnShape.height = "40px";
    gui.rightVar2BtnShape.thickness = 3;
    gui.rightVar2BtnShape.color = buttonColor.idle;
    gui.rightVar2BtnShape.background = "#225456";
    gui.rightVar2Btn.addControl(gui.rightVar2BtnShape);

    // list of buttons in scene for setting all back to idle color before assigning highlight color to active button
    gui.leftButtons = [
      gui.leftVar1BtnShape,
      gui.leftVar2BtnShape,
      gui.leftVar3BtnShape
    ];
    gui.rightButtons = [
      gui.rightVar1BtnShape,
      gui.rightVar2BtnShape
    ];
  }

  // check the status of meshes, textures, and materials and hide the loading UI when all lights are green
  const readyCheck = {
    meshesReady: false,
    materialsReady: false
  };

  function checkTrue(ready) {
    for (let value in ready) {
      if (ready[value] === false) {
        return false;
      }
    }
    return true;
  }

  function readyScene() {
    if (checkTrue(readyCheck)) {
      engine.hideLoadingUI();
    } else {
      setTimeout(() => {
        readyScene();
      }, 1000);
    }
  }

  // user hint to click and drag to turn camera
  const hint = {
    tick: 0,
    delay: 600,
    active: false,
    available: true
  };

  function interactionHint() {
    hint.active = true;
    playHintAnim();
  }

  // animations for interactivity hint
  const hintAnim = {};
  const hintKeys = {};
  const hintLength = 180;

  function prepHintAnimation() {
    // set up keys for all animations
    hintKeys.hintIconVisibility = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: 20,
        value: 1.0
      },
      {
        frame: hintLength - 20,
        value: 1.0
      },
      {
        frame: hintLength,
        value: 0.0
      }
    ];

    hintKeys.hintIconSwipe = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: Math.floor(hintLength * 0.30),
        value: -70.0
      },
      {
        frame: Math.floor(hintLength * 0.70),
        value: 70.0
      },
      {
        frame: hintLength,
        value: 0.0
      }
    ];

    // set up easing function and easing mode
    hintAnim.easingFunction = new BABYLON.CubicEase();
    hintAnim.easingMode = BABYLON.EasingFunction.EASINGMODE_EASEINOUT;
    hintAnim.easingFunction.setEasingMode(hintAnim.easingMode);

    // create animation clips
    hintAnim.hintIconVisibility = new BABYLON.Animation("hintIconVisibility", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hintAnim.hintIconSwipe = new BABYLON.Animation("hintIconSwipe", "left", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // set up easing
    hintAnim.hintIconVisibility.setEasingFunction(hintAnim.easingFunction);
    hintAnim.hintIconSwipe.setEasingFunction(hintAnim.easingFunction);

    // append keys to animation
    hintAnim.hintIconVisibility.setKeys(hintKeys.hintIconVisibility);
    hintAnim.hintIconSwipe.setKeys(hintKeys.hintIconSwipe);
  }

  function playHintAnim() {
    // set up keys for camera rotation starting at current camera.alpha
    hintKeys.cameraSwipe = [{
        frame: 0,
        value: camera.left.alpha
      },
      {
        frame: Math.floor(hintLength * 0.30),
        value: camera.left.alpha + 0.4
      },
      {
        frame: Math.floor(hintLength * 0.70),
        value: camera.left.alpha - 0.4
      },
      {
        frame: hintLength,
        value: camera.left.alpha
      }
    ];

    // set up animation and easing for camera swipe
    hintAnim.cameraSwipe = new BABYLON.Animation("cameraSwipe", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hintAnim.cameraSwipe.setEasingFunction(hintAnim.easingFunction);

    // append keys to animation
    hintAnim.cameraSwipe.setKeys(hintKeys.cameraSwipe);

    // play animations
    camera.left.animations.push(hintAnim.cameraSwipe);
    camera.right.animations.push(hintAnim.cameraSwipe);
    hintAnim.currentCamLeftSwipe = scene.beginAnimation(camera.left, 0, hintLength, false, 1);
    hintAnim.currentCamRightSwipe = scene.beginAnimation(camera.right, 0, hintLength, false, 1);
    hintAnim.currentAnim = scene.beginDirectAnimation(gui.hintIcon, [hintAnim.hintIconVisibility, hintAnim.hintIconSwipe], 0, hintLength, false, 1, () => {
      hint.active = false;
      hint.tick = 0;
    });
  }

  function cancelHint() {
    hint.tick = 0;
    if (hint.active === true) {
      //stop current animations
      hintAnim.currentAnim.stop();
      hintAnim.currentCamLeftSwipe.stop();
      hintAnim.currentCamRightSwipe.stop();

      // set up dehydrate keys
      hintKeys.hintIconSwipe = [{
          frame: 0,
          value: gui.hintIcon.alpha
        },
        {
          frame: 10,
          value: 0.0
        },
      ];

      // create dehydrate animation and add keys
      hintAnim.hintIconDehydrate = new BABYLON.Animation("hintIconDehydrate", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      hintAnim.hintIconDehydrate.setKeys(hintKeys.hintIconSwipe);

      // play animation
      scene.beginDirectAnimation(gui.hintIcon, [hintAnim.hintIconDehydrate], 0, hintKeys.hintIconSwipe[hintKeys.hintIconSwipe.length - 1].frame, false, 1, () => {
        hint.active = false;
        hint.tick = 0;
      });
    }
  }

  const hotSpotAnim = {};

  function prepHotspotAnimation() {
    // set up keys for all animations
    hotSpotAnim.hoverKeys = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: 15,
        value: hotspotParams.ghostMaxSize + 0.1
      },
      {
        frame: 25,
        value: hotspotParams.ghostMaxSize
      }
    ];

    hotSpotAnim.unhoverKeys = [{
        frame: 0,
        value: hotspotParams.ghostMaxSize
      },
      {
        frame: 10,
        value: hotspotParams.ghostMaxSize + 0.1
      },
      {
        frame: 25,
        value: 0.0
      }
    ];

    hotSpotAnim.clickRingKeys = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: 15,
        value: hotspotParams.ringMaxSize + 0.1
      },
      {
        frame: 25,
        value: hotspotParams.ringMaxSize
      }
    ];

    hotSpotAnim.clickDotKeys = [{
        frame: 0,
        value: hotspotParams.dotSize
      },
      {
        frame: 15,
        value: hotspotParams.ringDotSize - 0.1
      },
      {
        frame: 25,
        value: hotspotParams.ringDotSize
      }
    ];

    hotSpotAnim.clickGhostKeys = [{
        frame: 0,
        value: hotspotParams.ghostMaxSize
      },
      {
        frame: 10,
        value: 0.0
      }
    ];

    hotSpotAnim.releaseRingKeys = [{
        frame: 0,
        value: hotspotParams.ringMaxSize
      },
      {
        frame: 15,
        value: hotspotParams.ringMaxSize + 0.1
      },
      {
        frame: 35,
        value: 0.0
      }
    ];

    hotSpotAnim.releaseDotKeys = [{
        frame: 0,
        value: hotspotParams.ringDotSize
      },
      {
        frame: 10,
        value: hotspotParams.ringDotSize
      },
      {
        frame: 35,
        value: hotspotParams.dotSize
      }
    ];

    hotSpotAnim.releaseGhostKeys = [{
        frame: 0,
        value: 0.0
      },
      {
        frame: 10,
        value: 0.0
      },
      {
        frame: 25,
        value: hotspotParams.ghostMaxSize
      }
    ];

    // set up easing function and easing mode
    hotSpotAnim.easingFunction = new BABYLON.CubicEase();
    hotSpotAnim.easingMode = BABYLON.EasingFunction.EASINGMODE_EASEINOUT;
    hotSpotAnim.easingFunction.setEasingMode(hotSpotAnim.easingMode);

    // create animation clips
    hotSpotAnim.hover = new BABYLON.Animation("hover", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.unhover = new BABYLON.Animation("unhover", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.clickRing = new BABYLON.Animation("clickRing", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.clickDot = new BABYLON.Animation("clickDot", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.clickGhost = new BABYLON.Animation("clickGhost", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.releaseRing = new BABYLON.Animation("releaseRing", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.releaseDot = new BABYLON.Animation("releaseDot", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    hotSpotAnim.releaseGhost = new BABYLON.Animation("releaseGhost", "value", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // set up easing
    hotSpotAnim.hover.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.unhover.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.clickRing.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.clickDot.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.clickGhost.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.releaseRing.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.releaseDot.setEasingFunction(hotSpotAnim.easingFunction);
    hotSpotAnim.releaseGhost.setEasingFunction(hotSpotAnim.easingFunction);

    // append keys to animation
    hotSpotAnim.hover.setKeys(hotSpotAnim.hoverKeys);
    hotSpotAnim.unhover.setKeys(hotSpotAnim.unhoverKeys);
    hotSpotAnim.clickRing.setKeys(hotSpotAnim.clickRingKeys);
    hotSpotAnim.clickDot.setKeys(hotSpotAnim.clickDotKeys);
    hotSpotAnim.clickGhost.setKeys(hotSpotAnim.clickGhostKeys);
    hotSpotAnim.releaseRing.setKeys(hotSpotAnim.releaseRingKeys);
    hotSpotAnim.releaseDot.setKeys(hotSpotAnim.releaseDotKeys);
    hotSpotAnim.releaseGhost.setKeys(hotSpotAnim.releaseGhostKeys);
  }

  const toastAnim = {};

  function prepToastAnimation() {
    // set up keys for all animations
    toastAnim.hydrateMoveKeys = [{
        frame: 0,
        value: toastParams.topHidden
      },
      {
        frame: 55,
        value: toastParams.topShown
      }
    ];

    toastAnim.dehydrateMoveKeys = [{
        frame: 0,
        value: toastParams.topShown
      },
      {
        frame: 30,
        value: toastParams.topHide
      },
      {
        frame: 31,
        value: toastParams.topHidden
      }
    ];

    toastAnim.dehydrateAlphaKeys = [{
        frame: 0,
        value: 1.0
      },
      {
        frame: 30,
        value: 0.0
      },
      {
        frame: 31,
        value: 1.0
      }
    ];

    // set up easing function and easing mode
    toastAnim.easingFunction = new BABYLON.CubicEase();
    toastAnim.easingMode = BABYLON.EasingFunction.EASINGMODE_EASEINOUT;
    toastAnim.easingFunction.setEasingMode(toastAnim.easingMode);

    // create animation clips
    toastAnim.hydrateMove = new BABYLON.Animation("hydrateMove", "top", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    toastAnim.dehydrateMove = new BABYLON.Animation("dehydrateMove", "top", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    toastAnim.dehydrateAlpha = new BABYLON.Animation("dehydrateAlpha", "alpha", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    // set up easing
    toastAnim.hydrateMove.setEasingFunction(toastAnim.easingFunction);
    toastAnim.dehydrateMove.setEasingFunction(toastAnim.easingFunction);
    toastAnim.dehydrateAlpha.setEasingFunction(toastAnim.easingFunction);

    // append keys to animation
    toastAnim.hydrateMove.setKeys(toastAnim.hydrateMoveKeys);
    toastAnim.dehydrateMove.setKeys(toastAnim.dehydrateMoveKeys);
    toastAnim.dehydrateAlpha.setKeys(toastAnim.dehydrateAlphaKeys);
  }

  function playHotspotHover(material, hover) {
    let activeGhostSize = material.getBlockByName("ghostSize");
    if (hover) {
      scene.beginDirectAnimation(activeGhostSize, [hotSpotAnim.hover], 0, hotSpotAnim.hoverKeys[hotSpotAnim.hoverKeys.length - 1].frame, false, 1);
    } else {
      scene.beginDirectAnimation(activeGhostSize, [hotSpotAnim.unhover], 0, hotSpotAnim.hoverKeys[hotSpotAnim.hoverKeys.length - 1].frame, false, 1);
    }
  }

  function playHotspotClick(material, action) {
    let activeGhostSize = material.getBlockByName("ghostSize");
    let activeRingSize = material.getBlockByName("ringSize");
    let activeDotSize = material.getBlockByName("dotSize");
    if (action === "click") {
      scene.beginDirectAnimation(activeGhostSize, [hotSpotAnim.clickGhost], 0, hotSpotAnim.clickGhostKeys[hotSpotAnim.clickGhostKeys.length - 1].frame, false, 1);
      scene.beginDirectAnimation(activeRingSize, [hotSpotAnim.clickRing], 0, hotSpotAnim.clickRingKeys[hotSpotAnim.clickRingKeys.length - 1].frame, false, 1);
      scene.beginDirectAnimation(activeDotSize, [hotSpotAnim.clickDot], 0, hotSpotAnim.clickDotKeys[hotSpotAnim.clickDotKeys.length - 1].frame, false, 1);
    } else {
      scene.beginDirectAnimation(activeRingSize, [hotSpotAnim.releaseRing], 0, hotSpotAnim.releaseRingKeys[hotSpotAnim.releaseRingKeys.length - 1].frame, false, 1);
      scene.beginDirectAnimation(activeDotSize, [hotSpotAnim.releaseDot], 0, hotSpotAnim.releaseDotKeys[hotSpotAnim.releaseDotKeys.length - 1].frame, false, 1);
    }
  }

  function clearHotspots() {
    for (let child of hotspots) {
      if (child.selected === true) {
        playHotspotClick(child.mesh.material, "reset");
        child.selected = false;
      }
    }
  }

  function playToastAnimation(target) {
    for (let child of toastParams.objects) {
      if (child.top != toastParams.topHidden + "px") {

        scene.beginDirectAnimation(child, [toastAnim.dehydrateMove, toastAnim.dehydrateAlpha], 0, toastAnim.dehydrateMoveKeys[toastAnim.dehydrateMoveKeys.length - 1].frame, false, 1);
      }
    }
    if (target !== null) {
      scene.beginDirectAnimation(toastParams.objects[target], [toastAnim.hydrateMove], 0, toastAnim.hydrateMoveKeys[toastAnim.hydrateMoveKeys.length - 1].frame, false, 1);
    }
  }

  const ray = {};
  const hotspotStates = {};

  function raycast(action) {
    ray.pickingRay = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera.left);
    ray.hit = scene.pickWithRay(ray.pickingRay);
    if (ray.hit.pickedMesh) {
      if (hotspotStates.active === undefined || hotspotStates.active === null || action !== "hover") {
        for (let child of hotspots) {
          if (child.name === ray.hit.pickedMesh.name) {
            hotspotStates.active = child;
            if (action === "hover" && hotspotStates.active.selected === false) {
              playHotspotHover(hotspotStates.active.mesh.material, true);
            }
            if (action === "click") {
              if (hotspotStates.active.selected === false) {
                clearHotspots();
                playHotspotClick(hotspotStates.active.mesh.material, action);
                playToastAnimation(hotspotStates.active.toastVersion);
                hotspotStates.active.selected = true;
              }
            }
          }
        }
      }
    } else {
      if (hotspotStates.active && hotspotStates.active !== null) {
        if (action === "hover" && hotspotStates.active.selected === false) {
          playHotspotHover(hotspotStates.active.mesh.material, false);
        }
        hotspotStates.active = null;
      }
    }
  }

  scene.onPointerMove = () => {
    raycast("hover");
  };

  scene.onPointerUp = () => {
    raycast("click");
    hotspotStates.mouseDown = false;
  }

  scene.registerBeforeRender(() => {
    if (camera.animatingViews) {
      camera.left.viewport = new BABYLON.Viewport(0.0, 0.0, camera.leftCurrentWidth, 1.0);
      camera.right.viewport = new BABYLON.Viewport(camera.rightCurrentPosition, 0.0, camera.rightCurrentWidth, 1.0);
    }

    if (camera.splitScreen === false) {
      canvas.onpointerdown = () => {
        hint.tick = 0;
        hint.available = false;
        if (hint.active === true) {
          cancelHint();
        }
      };

      canvas.onpointerup = () => {
        hint.available = true;
      }

      if (hint.active === false && hint.available === true) {
        if (hint.tick < hint.delay) {
          hint.tick++;
        } else {
          hint.tick = 0;
          interactionHint();
        }
      }
    }
  });

  // scene creation sequence
  engine.displayLoadingUI();
  initScene();
  await loadMeshes();
  await createMaterials();
  generateShadows();
  createGUI();
  prepHintAnimation();
  prepHotspotAnimation();
  prepToastAnimation();
  readyScene();

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