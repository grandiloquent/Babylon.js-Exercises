var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 50, new BABYLON.Vector3(0, 30, 0), scene);
    camera.attachControl(canvas, false);
    camera.setPosition(new BABYLON.Vector3(30, 80, 220));
    light.position = new BABYLON.Vector3(150, 50, 0);
    light.shadowOrthoScale = 12.0;
    camera.minZ = 1.0;
    scene.ambientColor = new BABYLON.Color3(0.8, 0.6, 0.7);
    var spotLight = new BABYLON.SpotLight("spot02", new BABYLON.Vector3(230, 230, 30),
        new BABYLON.Vector3(-1, -2, -1), 5.1, 6, scene);
    spotLight.projectionTexture = new BABYLON.Texture("textures/co.png", scene);
    spotLight.setDirectionToTarget(BABYLON.Vector3.Zero());
    spotLight.intensity = 0.3;

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 300, 300, 50, 0, 30, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 16;
    groundMaterial.diffuseTexture.vScale = 16;
    groundMaterial.specularColor = new BABYLON.Color3(50, 10, 0);
    ground.position.y = -2.05;
    ground.material = groundMaterial;

    var shadowGenerator = new BABYLON.ShadowGenerator(524, light);
    shadowGenerator.useBlurExponentialShadowMap = true;

    BABYLON.SceneLoader.ImportMesh("him", "scenes/Dude/", "Dude.babylon", scene, function (newMeshes2, particleSystems2, skeletons2) {
        var dude = newMeshes2[0];
        for (var index = 1; index < newMeshes2.length; index++) {
            shadowGenerator.getShadowMap().renderList.push(newMeshes2[index]);
        }
        for (var count = 0; count < 6; count++) {
            var offsetX = 100 * Math.random() - 10;
            var offsetZ = 100 * Math.random() - 70;
            for (index = 1; index < newMeshes2.length; index++) {
                var instance = newMeshes2[index].createInstance("instance" + count);
                shadowGenerator.getShadowMap().renderList.push(instance);
                instance.parent = newMeshes2[index].parent;
                instance.position = newMeshes2[index].position.clone();
                if (!instance.parent.subMeshes) {
                    instance.position.x += offsetX;
                    instance.position.z -= offsetZ;
                }
            }
        }
        dude.rotation.y = Math.PI;
        dude.position = new BABYLON.Vector3(60, 0, -20);
        scene.beginAnimation(skeletons2[0], 0, 100, true, 1.0);
    });
    var alpha = 0;
    scene.registerBeforeRender(function () {
        spotLight.position = new BABYLON.Vector3(Math.cos(alpha) * 160, 50, Math.sin(alpha) * 90);
        spotLight.setDirectionToTarget(BABYLON.Vector3.Zero());
        alpha += 0.03;
    });

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1200.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(20, 20, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(10, 10, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    var fountain = BABYLON.Mesh.CreateBox("foutain", 1.01, scene);
    fountain.visibility = 0;

    var particleSystem;
    var useGPUVersion = true;

    var fogTexture = new BABYLON.Texture("textures/smoke_15.png", scene);

    var createNewSystem = function () {
        if (particleSystem) {
            particleSystem.dispose();
        }
        if (useGPUVersion && BABYLON.GPUParticleSystem.IsSupported) {
            particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, scene);
            particleSystem.activeParticleCount = 15000;
            particleSystem.manualEmitCount = particleSystem.activeParticleCount;
            particleSystem.minEmitBox = new BABYLON.Vector3(-50, 2, -50);
            particleSystem.maxEmitBox = new BABYLON.Vector3(150, 52, 50);
        } else {
            particleSystem = new BABYLON.ParticleSystem("particles", 1500, scene);
            particleSystem.manualEmitCount = particleSystem.getCapacity();
            particleSystem.minEmitBox = new BABYLON.Vector3(-5, 2, -25);
            particleSystem.maxEmitBox = new BABYLON.Vector3(125, 92, 295);
        }
        particleSystem.particleTexture = fogTexture.clone();
        particleSystem.emitter = fountain;
        particleSystem.color1 = new BABYLON.Color4(0.5, 0.6, 0.6, 0.7);
        particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.35);
        particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.6);
        particleSystem.minSize = 6.5;
        particleSystem.maxSize = 22.0;
        particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
        particleSystem.emitRate = 5000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction1 = new BABYLON.Vector3(.1, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(.1, .4, 0);
        particleSystem.minAngularSpeed = -2;
        particleSystem.maxAngularSpeed = 1;
        particleSystem.minEmitPower = .5;
        particleSystem.maxEmitPower = 2;
        particleSystem.updateSpeed = 0.035;

        particleSystem.start();

    }
    createNewSystem();
    return scene;
};


var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
};

window.initFunction = async function () {


    var asyncEngineCreation = async function () {
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
window.addEventListener("resize", function () {
    engine.resize();
});