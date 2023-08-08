var createScene = async function() {
  var scene = new BABYLON.Scene(engine);
  BABYLON.SceneLoader.ShowLoadingScreen = false;
  /*
  创建相机、光线
  */
  const lights = {};
  const env = {};
  const camera = {};
  async function initScene() {

    // changes the 'background' color.
    scene.clearColor = new BABYLON.Color3.FromInts(178, 178, 178);

    // https://doc.babylonjs.com/typedoc/classes/BABYLON.ArcRotateCamera#constructor
    camera.main = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(70), BABYLON.Tools.ToRadians(60), 0.09, new BABYLON.Vector3(0.0, 0.0, 0.0), scene);
    camera.main.minZ = 0.0001;

    /* 
    Gets or Set the mouse wheel delta percentage or how fast is the camera zooming.
    It will be used instead of pinchDeltaPrecision if different from 0.
    It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
     */
    camera.main.wheelDeltaPercentage = 0.05;
    camera.main.upperRadiusLimit = 0.2;
    camera.main.lowerRadiusLimit = 0.05;
    camera.main.upperBetaLimit = 1.4;
    camera.main.lowerBetaLimit = 0;

    // Defines the allowed panning axis.
    camera.main.panningAxis = new BABYLON.Vector3(1, 0, 1);
    camera.main.attachControl(canvas, true);

    // https://doc.babylonjs.com/typedoc/classes/BABYLON.CubeTexture#CreateFromPrefilteredData
    // https://forum.babylonjs.com/t/how-to-create-env-texture-file/9073
    env.lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("runyonCanyon.env", scene);
    env.lighting.name = "runyonCanyon";
    env.lighting.gammaSpace = false;
    env.lighting.rotationY = 1.9;
    scene.environmentTexture = env.lighting;
    scene.environmentIntensity = 2.0;

    env.skybox = scene.createDefaultSkybox(env.lighting, true, 10000);

    lights.dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0.51, -0.2, -0.83), scene);
    lights.dirLight.position = new BABYLON.Vector3(-0.04, 0.057, 0.01);
    lights.dirLight.shadowMinZ = 0.01;
    lights.dirLight.shadowMaxZ = 0.15;
    lights.dirLight.intensity = 3;
  }

  const lightHelper = {
    active: false
  }

  function enableLightHelper(active) {
    if (active) {
      lights.gizmo = new BABYLON.LightGizmo();
      lights.gizmo.light = lights.dirLight;

      var dlh = new DirectionalLightHelper(lights.dirLight, camera.main);
      window.setTimeout(() => {
        scene.onAfterRenderObservable.add(() => dlh.buildLightHelper());
      }, 500);
    }
  }

  const dice = {};
  async function loadMeshes() {
    dice.file = await BABYLON.SceneLoader.AppendAsync("d20_scene.gltf");
    dice.d20_left = scene.getMeshByName("d20_basePBR_left_low");
    dice.d20_center = scene.getMeshByName("d20_basePBR_middle_low");
    dice.d20_right = scene.getMeshByName("d20_basePBR_right_low");
    dice.ground = scene.getMeshByName("groundPlane_low");
    lights.dirLight.includedOnlyMeshes.push(dice.ground);
    dice.ground.position.y = -0.00001;
    readyCheck.meshesReady = true;
  }

  let loadTexturesAsync = async function() {
    let textures = [];
    return new Promise((resolve, reject) => {
      let textureUrls = [
        "textures/d20_steelMat_brm.png",
        "textures/d20_blur_normal.png"
      ];

      for (let url of textureUrls) {
        textures.push(new BABYLON.Texture(url, scene, false, false));
      }

      whenAllReady(textures, () => resolve(textures));
    }).then(() => {
      readyCheck.texturesReady = true;
      assignTextures(textures);
    });
  };

  let whenAllReady = function(textures, resolve) {
    let numRemaining = textures.length;
    if (numRemaining == 0) {
      resolve();
      return;
    }

    for (let i = 0; i < textures.length; i++) {
      let texture = textures[i];
      if (texture.isReady()) {
        if (--numRemaining === 0) {
          resolve();
          return;
        }
      } else {
        let onLoadObservable = texture.onLoadObservable;
        if (onLoadObservable) {
          onLoadObservable.addOnce(() => {
            if (--numRemaining === 0) {
              resolve();
            }
          });
        }
      }
    }
  };

  let retrieveTexture = function(meshMat, channel, textures) {
    let texture;
    for (let file of textures) {
      let segment = file.name.split("/");
      if (segment[segment.length - 1].split("_")[1] === meshMat) {
        if (segment[segment.length - 1].split("_")[2] === channel + ".png") {
          texture = file;
          return texture;
        }
      }
    }
  };

  const d20Tex = {};

  function assignTextures(textures) {
    d20Tex.normal = dice.d20_left.material.bumpTexture;
    d20Tex.mask = dice.d20_left.material.metallicTexture;
    d20Tex.blurNormal = retrieveTexture("blur", "normal", textures);
    d20Tex.metalBrm = retrieveTexture("steelMat", "brm", textures);
  }

  BABYLON.NodeMaterial.IgnoreTexturesAtLoadTime = true;
  const diceMats = {};
  const diceParameters = {};
  async function createMaterials() {
    diceMats.d20_left = new BABYLON.NodeMaterial("d20LeftNodeMat", scene, {
      emitComments: false
    });
    await diceMats.d20_left.loadAsync("d20_sheen.json");
    diceMats.d20_left.build(false);

    diceMats.d20_center = new BABYLON.NodeMaterial("d20CenterNodeMat", scene, {
      emitComments: false
    });
    await diceMats.d20_center.loadAsync("d20_metalCoat.json");
    diceMats.d20_center.build(false);

    diceMats.d20_right = new BABYLON.NodeMaterial("d20RightNodeMat", scene, {
      emitComments: false
    });
    await diceMats.d20_right.loadAsync("d20_acrylic.json");
    diceMats.d20_right.build(false);
    diceMats.d20_right.backFaceCulling = false;
    diceMats.d20_right.separateCullingPass = true;

    diceMats.ground = new BABYLON.NodeMaterial("groundNodeMat", scene, {
      emitComments: false
    });
    await diceMats.ground.loadAsync("groundShader.json");
    diceMats.ground.build(false);

    dice.d20_left.material = diceMats.d20_left;
    dice.d20_center.material = diceMats.d20_center;
    dice.d20_right.material = diceMats.d20_right;

    dice.ground.material.dispose();
    dice.ground.material = diceMats.ground;

    diceParameters.leftNormal = diceMats.d20_left.getBlockByName("normalTex");
    diceParameters.leftMask = diceMats.d20_left.getBlockByName("numberMaskTex");

    diceParameters.centerNormal = diceMats.d20_center.getBlockByName("normalTex");
    diceParameters.centerMask = diceMats.d20_center.getBlockByName("numberMaskTex");
    diceParameters.centerBrm = diceMats.d20_center.getBlockByName("brmTex");
    diceParameters.centerCoatNormal = diceMats.d20_center.getBlockByName("metalNormal");
    diceParameters.centerReflection = diceMats.d20_center.getBlockByName("Reflection");

    diceParameters.rightNormal = diceMats.d20_right.getBlockByName("normalTex");
    diceParameters.rightBlurNormal = diceMats.d20_right.getBlockByName("normalBlurTex");
    diceParameters.rightMask = diceMats.d20_right.getBlockByName("numberMaskTex");
    diceParameters.rightReflection = diceMats.d20_right.getBlockByName("Reflection");
    diceParameters.rightRefraction = diceMats.d20_right.getBlockByName("Refraction");
    diceParameters.rightOpacity = diceMats.d20_right.getBlockByName("opacity");
    diceParameters.rightFrontFace = diceMats.d20_right.getBlockByName("frontFace");
    diceParameters.rightOpacity.value = 0.96;

    diceParameters.leftNormal.texture = diceParameters.centerNormal.texture = diceParameters.rightNormal.texture = d20Tex.normal;
    diceParameters.leftMask.texture = diceParameters.centerMask.texture = diceParameters.rightMask.texture = d20Tex.mask;
    diceParameters.centerBrm.texture = d20Tex.metalBrm;
    diceParameters.rightBlurNormal.texture = d20Tex.blurNormal;

    diceParameters.groundColor = diceMats.ground.getBlockByName("groundColor");
    diceParameters.groundColor.value = scene.clearColor;

    dice.d20_right.onBeforeRenderObservable.add(() => {
      diceParameters.rightFrontFace.value = 0.0;
    });

    dice.d20_right.onBetweenPassObservable.add(() => {
      diceParameters.rightFrontFace.value = 1.0;
      let mesh = scene.getMeshByName("d20_basePBR_right_low");
      let subMesh = mesh.subMeshes[0];
      diceMats.d20_right.bindForSubMesh(mesh.getWorldMatrix(), mesh, subMesh);
    });

    readyCheck.materialsReady = true;
  }

  const shadows = {};

  function generateShadows() {
    shadows.shadowGenerator = new BABYLON.ShadowGenerator(512, lights.dirLight);
    shadows.shadowGenerator.useContactHardeningShadow = true;
    shadows.shadowGenerator.contactHardeningLightSizeUVRatio = 0.07;
    shadows.shadowGenerator.darkness = 0.65;
    shadows.shadowGenerator.addShadowCaster(dice.d20_left);
    shadows.shadowGenerator.addShadowCaster(dice.d20_center);
    shadows.shadowGenerator.addShadowCaster(dice.d20_right);
    shadows.shadowGenerator.enableSoftTransparentShadow = true;
    shadows.shadowGenerator.transparencyShadow = true;
    dice.ground.receiveShadows = true;
    dice.ground.material.environmentIntensity = 0.2;
  }

  const glowPass = {};

  function glowLayer() {
    if (diceMats.d20_center.getBlockByName("glowMask") !== null) {
      glowPass.glowMask = diceMats.d20_center.getBlockByName("glowMask");
      glowPass.glow = new BABYLON.GlowLayer("glow", scene);
      glowPass.glow.intensity = 0.6;

      // set up material to use glow layer
      glowPass.glow.referenceMeshToUseItsOwnMaterial(dice.d20_center);

      // enable glow mask to render only emissive into glow layer, and then disable glow mask
      glowPass.glow.onBeforeRenderMeshToEffect.add(() => {
        glowPass.glowMask.value = 1.0;
      });
      glowPass.glow.onAfterRenderMeshToEffect.add(() => {
        glowPass.glowMask.value = 0.0;
      });
    }
  }

  const readyCheck = {
    meshesReady: false,
    texturesReady: false,
    materialsReady: false
  };

  function checkTrue(ready) {
    for (let value in ready) {
      if (value === false) {
        return false;
      }
    }
    return true;
  }

  function readyScene() {
    if (checkTrue(readyCheck)) {
      env.skybox.setEnabled(false);
      engine.hideLoadingUI();
    } else {
      console.log("looping");
      setTimeout(() => {
        readyScene();
      }, 1000);
    }
  }

  engine.displayLoadingUI();
  initScene();
  await loadMeshes();
  await loadTexturesAsync();
  await createMaterials();
  generateShadows();
  glowLayer();
  enableLightHelper(lightHelper.active);
  readyScene();

  scene.debugLayer.show({
    embedMode: true
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
  window.scene = await createScene();
};
initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});