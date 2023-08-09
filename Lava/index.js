var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  var assetPath = "textures/";

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.8;
  light.specular = new BABYLON.Color3(0.9, 0.4, 0.9);

  var gl = new BABYLON.GlowLayer("glow", scene);
  gl.intensity = 0.1;

  var sphere =   BABYLON.Mesh.CreateSphere("sphere1", 8, 2, scene);
  sphere.position.y = 2;


  var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", assetPath +
  "Lava_005_DISP.png", 
  10, 10, 400, 0, 0.4, scene, false);

  var material = new BABYLON.PBRMaterial("mat", scene);
  material.albedoTexture = new BABYLON.Texture(assetPath + "Lava_005_COLOR.jpg", scene);
  material.bumpTexture = new BABYLON.Texture(assetPath + "Lava_005_NORM.jpg", scene);
  material.bumpTexture.level = 0.5;
  material.emissiveTexture = new BABYLON.Texture(assetPath + "spider_webs_compressed.jpg", scene);
  material.emissiveColor = new BABYLON.Color3(245 / 255, 20 / 255, 20 / 255);
  material.ambientTexture = new BABYLON.Texture(assetPath + "Lava_005_OCC.jpg", scene);
  
  material.metallicTexture = new BABYLON.Texture(assetPath + "Lava_005_ROUGH.jpg", scene);
  
  material.roughness = 1;
  material.metallic = 0.1;
  material.useRoughnessFromMetallicTextureAlpha = true;
  material.useRoughnessFromMetallicTextureGreen = false;
  material.useMetallnessFromMetallicTextureBlue = false;
  ground.material = material;
  sphere.material = material;
    
  material.clearCoat.isEnabled = true;
  material.clearCoat.bumpTexture = new BABYLON.Texture(assetPath + "Lava_005_NORM.jpg", scene);
  material.clearCoat.bumpTexture.level = 0.0;

  var alpha = 0;
  scene.registerBeforeRender(function() {
    material.albedoTexture.uOffset += 0.001;
    material.bumpTexture.uOffset += 0.001;
    material.ambientTexture.uOffset += 0.001;
    material.metallicTexture.uOffset += 0.001;
    material.emissiveTexture.uOffset += 0.01;
    material.emissiveTexture.vOffset -= 0.005;
    ground.scaling.y += Math.sin(alpha) / 300;
    gl.intensity += Math.sin(alpha * 2) / 100;
    alpha += 0.01;
    material.clearCoat.bumpTexture.level += Math.sin(alpha) / 100;
  });
  scene.createDefaultEnvironment({
    createGround: false,
    createSkybox: false,
  });

  var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
  var physicsPlugin = new BABYLON.CannonJSPlugin();
  scene.enablePhysics(gravityVector, physicsPlugin);
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0,restitution: 0.9}, scene);
  var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene);
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
scene.imageProcessingConfiguration.exposure=1;

  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.8;
  pipeline.bloomWeight = 0.3;
  pipeline.bloomKernel = 64;
  pipeline.bloomScale = 0.5;

  var noiseTexture1 = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
  noiseTexture1.animationSpeedFactor = 5;
  noiseTexture1.persistence = 0.2;
  noiseTexture1.brightness = .5;
  noiseTexture1.octaves = 4;

  document.addEventListener('keydown', LaunchBarrel);

  scene.onDisposeObservable.add(function() 
  {
    document.removeEventListener('keydown', LaunchBarrel);
  });

  var setupAnimationSheet = function(system, texture, width, height, numSpritesWidth, numSpritesHeight, animationSpeed, isRandom, loop) 
  {
    system.isAnimationSheetEnabled = true;
    system.particleTexture = new BABYLON.Texture(texture, scene, false, false);
    system.spriteCellWidth = width / numSpritesWidth;
    system.spriteCellHeight = height / numSpritesHeight;
    var numberCells = numSpritesWidth * numSpritesHeight;
    system.startSpriteCellID = 0;
    system.endSpriteCellID = numberCells - 1;
    system.spriteCellChangeSpeed = animationSpeed;
    system.spriteRandomStartCell = isRandom;
    system.updateSpeed = 1 / 60;
    system.spriteCellLoop = loop;
  }
  var launchBarrel = false;

  function LaunchBarrel() {
    if (event.keyCode == 32) {
      if (launchBarrel)
       {
        var min = -10.0;
        var max = 10.0;
        var randPosX = Math.random() * (max - min) + min;
        var randPosZ = Math.random() * (max - min) + min;
        var randAngX = Math.random() * (max / 2 - min / 3) + min / 3;
        var randAngY = Math.random() * (max * 2 - max * 1.25) + max * 1.25;
        var randAngz = Math.random() * (max / 2 - min / 3) + min / 3;
        var randRotX = Math.random() * (max / 5 - min / 5) + min / 5;
        var randRotY = Math.random() * (max / 5 - min / 5) + min / 5;
        var randRotZ = Math.random() * (max / 5 - min / 5) + min / 5;
        var randBounce = Math.floor(Math.random() * (4));
        var bounces = 0;
        var exploded = false;
        var explodingBarrel = BABYLON.MeshBuilder.CreateCylinder("Barrel", {height: 1.33,diameter: 1}, scene);
        explodingBarrel.position = new BABYLON.Vector3(randPosX, 3, randPosZ);
        var barrelMat = new BABYLON.PBRMetallicRoughnessMaterial("barrelMat", scene);
        barrelMat.baseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
        barrelMat.metallic = 0.0;
        barrelMat.roughness = 0.5;
        explodingBarrel.material = barrelMat;
        explodingBarrel.physicsImpostor = new BABYLON.PhysicsImpostor(explodingBarrel, BABYLON.PhysicsImpostor.CylinderImpostor, {mass: 1,restitution: 0.9}, scene);
        explodingBarrel.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(randAngX, randAngY, randAngz));
        explodingBarrel.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(randRotX, randRotY, randRotZ, 0));
        explodingBarrel.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function(main, collided) 
        {
          bounces++;
          if (bounces > randBounce && !exploded) 
          {
            Explode(explodingBarrel.position);
            exploded = true;
            setTimeout(() => {
              explodingBarrel.physicsImpostor.dispose();
              explodingBarrel.dispose(false, true);
            }, 0);
          } 
        });
      }
      else 
          {
            var min = -10.0;
            var max = 10.0;
            var randPosX = Math.random() * (max - min) + min;
            var randPosZ = Math.random() * (max - min) + min;
            Explode(new BABYLON.Vector3(randPosX, 0, randPosZ));
          }
    }
  }

  function Explode(impact) {
    var emitterParent = new BABYLON.AbstractMesh("", scene);
    emitterParent.position = impact.clone();
    var plumeAnimation = new BABYLON.Animation("plumeAnimation", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONMODE_CONSTANT);
    var keys = [];
    keys.push({
      frame: 0,
      value: 0
    });
    keys.push({
      frame: 10,
      value: 2
    });
    keys.push({
      frame: 40,
      value: 8
    });
    keys.push({
      frame: 50,
      value: 9
    });
    keys.push({
      frame: 55,
      value: 9.5
    });
    keys.push({
      frame: 60,
      value: 10
    });
    plumeAnimation.setKeys(keys);
    emitterParent.animations.push(plumeAnimation);
    var fireBlast = BABYLON.ParticleHelper.CreateDefault(impact, 1000);
    var blastSmoke = BABYLON.ParticleHelper.CreateDefault(impact, 250);
    var debris = BABYLON.ParticleHelper.CreateDefault(impact, 10);
    var smokePillar = BABYLON.ParticleHelper.CreateDefault(impact, 1000);
    var secondaryBlast = BABYLON.ParticleHelper.CreateDefault(emitterParent, 1000);
    var secondarySmoke = BABYLON.ParticleHelper.CreateDefault(emitterParent, 500);

    var flash = BABYLON.ParticleHelper.CreateDefault(impact, 40);
    flash.particleTexture = new BABYLON.Texture("textures/FlashParticle.png", scene);
    flash.emitRate = 400;
    flash.minScaleX = 10;
    flash.minScaleY = 70;
    flash.maxScaleX = 20;
    flash.maxScaleY = 100;
    flash.minLifeTime = 0.2;
    flash.maxLifeTime = 0.4;
    flash.minEmitPower = 0;
    flash.maxEmitPower = 0;
    flash.addColorGradient(0, new BABYLON.Color4(1.0, .8960, 0.0, 1.0));
    flash.addColorGradient(0.4, new BABYLON.Color4(0.7547, 0.1219, 0.0391, 1.0));
    flash.addColorGradient(0.8, new BABYLON.Color4(0.3679, 0.0721, 0.0295, 0.0));
    flash.minInitialRotation = -0.78539816;
    flash.maxInitialRotation = 0.78539816;
    flash.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    flash.targetStopDuration = .2;

    var fireball = BABYLON.ParticleHelper.CreateDefault(emitterParent, 1000);
    setupAnimationSheet(fireball, "textures/Smoke_SpriteSheet_8x8.png", 1024, 1024, 8, 8, 1, true, true);
    var fireballHemisphere = fireball.createHemisphericEmitter(0.2);
    fireballHemisphere.radiusRange = 1;
    fireball.emitRate = 400;
    fireball.minSize = 1;
    fireball.maxSize = 3;
    fireball.addStartSizeGradient(0.0, 2, 4);
    fireball.addStartSizeGradient(0.3, 0.5, 1);
    fireball.addStartSizeGradient(0.6, 1, 3);
    fireball.addStartSizeGradient(1.0, 1.7, 3.7);
    fireball.minLifeTime = 6;
    fireball.maxLifeTime = 8;
    fireball.addLifeTimeGradient(0, 3);
    fireball.addLifeTimeGradient(1, 1.75);
    fireball.minEmitPower = 30;
    fireball.maxEmitPower = 60;
    fireball.addLimitVelocityGradient(0.0, 5);
    fireball.addLimitVelocityGradient(0.15, 3);
    fireball.addLimitVelocityGradient(0.25, 2);
    fireball.addLimitVelocityGradient(1.0, 1);
    fireball.limitVelocityDamping = 0.7;
    fireball.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.8));
    fireball.addColorGradient(0.4, new BABYLON.Color4(1, 1, 1, 0.6));
    fireball.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
    fireball.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
    fireball.addRampGradient(0.09, new BABYLON.Color3(209 / 255, 204 / 255, 15 / 255));
    fireball.addRampGradient(0.18, new BABYLON.Color3(221 / 255, 120 / 255, 14 / 255));
    fireball.addRampGradient(0.28, new BABYLON.Color3(200 / 255, 43 / 255, 18 / 255));
    fireball.addRampGradient(0.47, new BABYLON.Color3(115 / 255, 22 / 255, 15 / 255));
    fireball.addRampGradient(0.88, new BABYLON.Color3(14 / 255, 14 / 255, 14 / 255));
    fireball.addRampGradient(1.0, new BABYLON.Color3(14 / 255, 14 / 255, 14 / 255));
    fireball.useRampGradients = true;
    fireball.addColorRemapGradient(0, 0, 0.8);
    fireball.addColorRemapGradient(0.2, 0.1, 0.8);
    fireball.addColorRemapGradient(0.3, 0.2, 0.85);
    fireball.addColorRemapGradient(0.35, 0.4, 0.85);
    fireball.addColorRemapGradient(0.4, 0.5, 0.9);
    fireball.addColorRemapGradient(0.5, 0.95, 1.0);
    fireball.addColorRemapGradient(1.0, 0.95, 1.0);
    fireball.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
    fireball.targetStopDuration = 1;

    var shockwave = BABYLON.ParticleHelper.CreateDefault(new BABYLON.Vector3(impact.x, 2, impact.z), 500);
    setupAnimationSheet(shockwave, "textures/Smoke_SpriteSheet_8x8.png", 1024, 1024, 8, 8, 1, true, true);
    var shockwaveCylinder = shockwave.createCylinderEmitter(1, .5, 0, 0);
    shockwave.emitRate = 3000;
    shockwave.minSize = 0.2;
    shockwave.maxSize = 2;
    shockwave.addSizeGradient(0.0, 2.0, 3.0);
    shockwave.addSizeGradient(1.0, 5.0, 8.0);
    shockwave.minLifeTime = 3;
    shockwave.maxLifeTime = 3;
    shockwave.minInitialRotation = -Math.PI / 2;
    shockwave.maxInitialRotation = Math.PI / 2;
    shockwave.addAngularSpeedGradient(0, 0);
    shockwave.addAngularSpeedGradient(1.0, -0.4, 0.4);
    shockwave.minEmitPower = 40;
    shockwave.maxEmitPower = 90;
    shockwave.addLimitVelocityGradient(0.0, 70);
    shockwave.addLimitVelocityGradient(0.15, 10);
    shockwave.addLimitVelocityGradient(0.25, 2);
    shockwave.addLimitVelocityGradient(1.0, 1.5);
    shockwave.limitVelocityDamping = 0.9;
    shockwave.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.15));
    shockwave.addColorGradient(0.6, new BABYLON.Color4(1, 1, 1, 0.15));
    shockwave.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
    shockwave.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
    shockwave.addRampGradient(0.09, new BABYLON.Color3(209 / 255, 204 / 255, 190 / 255));
    shockwave.addRampGradient(0.18, new BABYLON.Color3(221 / 255, 200 / 255, 190 / 255));
    shockwave.addRampGradient(0.28, new BABYLON.Color3(200 / 255, 190 / 255, 180 / 255));
    shockwave.addRampGradient(0.47, new BABYLON.Color3(115 / 255, 90 / 255, 80 / 255));
    shockwave.addRampGradient(0.88, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
    shockwave.addRampGradient(1.0, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
    shockwave.useRampGradients = true;
    shockwave.addColorRemapGradient(0, 0, 0.8);
    shockwave.addColorRemapGradient(0.2, 0.1, 0.8);
    shockwave.addColorRemapGradient(0.3, 0.2, 0.85);
    shockwave.addColorRemapGradient(0.35, 0.4, 0.85);
    shockwave.addColorRemapGradient(0.4, 0.5, 0.9);
    shockwave.addColorRemapGradient(0.5, 0.95, 1.0);
    shockwave.addColorRemapGradient(1.0, 0.95, 1.0);
    shockwave.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
    shockwave.targetStopDuration = 0.5;

    var fireSubEmitter = new BABYLON.SubEmitter(new BABYLON.ParticleHelper.CreateDefault(impact, 200));
    setupAnimationSheet(fireSubEmitter.particleSystem, "textures/FlameBlastSpriteSheet.png", 1024, 1024, 4, 4, 1, false, true);
    fireSubEmitter.particleSystem.emitter = new BABYLON.AbstractMesh("", scene);
    fireSubEmitter.particleSystem.minLifeTime = 0.5;
    fireSubEmitter.particleSystem.maxLifeTime = 0.8;
    fireSubEmitter.particleSystem.minEmitPower = 0;
    fireSubEmitter.particleSystem.maxEmitPower = 0;
    fireSubEmitter.particleSystem.emitRate = 130;
    fireSubEmitter.particleSystem.minSize = 0.8;
    fireSubEmitter.particleSystem.maxSize = 1.2;
    fireSubEmitter.particleSystem.addStartSizeGradient(0, 1);
    fireSubEmitter.particleSystem.addStartSizeGradient(0.7, 1);
    fireSubEmitter.particleSystem.addStartSizeGradient(1, 0.2);
    fireSubEmitter.particleSystem.minInitialRotation = -(Math.PI / 2);
    fireSubEmitter.particleSystem.maxInitialRotation = Math.PI / 2;
    fireSubEmitter.particleSystem.addColorGradient(0.0, new BABYLON.Color4(0.9245, 0.6540, 0.0915, 1));
    fireSubEmitter.particleSystem.addColorGradient(0.04, new BABYLON.Color4(0.9062, 0.6132, 0.0942, 1));
    fireSubEmitter.particleSystem.addColorGradient(0.29, new BABYLON.Color4(0.7968, 0.3685, 0.1105, 1));
    fireSubEmitter.particleSystem.addColorGradient(0.53, new BABYLON.Color4(0.6886, 0.1266, 0.1266, 1));
    fireSubEmitter.particleSystem.addColorGradient(0.9, new BABYLON.Color4(0.3113, 0.0367, 0.0367, 1));
    fireSubEmitter.particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.3113, 0.0367, 0.0367, 1));
    fireSubEmitter.type = BABYLON.SubEmitterType.ATTACHED;
    fireSubEmitter.inheritDirection = true;
    fireSubEmitter.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    fireSubEmitter.particleSystem.targetStopDuration = 1.2;

    var smokeSubEmitter = new BABYLON.SubEmitter(new BABYLON.ParticleHelper.CreateDefault(impact, 600));
    setupAnimationSheet(smokeSubEmitter.particleSystem, "textures/Smoke_SpriteSheet_8x8.png", 1024, 1024, 8, 8, 1, true, true);
    smokeSubEmitter.particleSystem.emitter = new BABYLON.AbstractMesh("", scene);
    smokeSubEmitter.particleSystem.minLifeTime = 1;
    smokeSubEmitter.particleSystem.maxLifeTime = 3;
    smokeSubEmitter.particleSystem.addLifeTimeGradient(0, 3);
    smokeSubEmitter.particleSystem.addLifeTimeGradient(1, 1.75);
    smokeSubEmitter.particleSystem.minEmitPower = 0;
    smokeSubEmitter.particleSystem.maxEmitPower = 0;
    smokeSubEmitter.particleSystem.emitRate = 100;
    smokeSubEmitter.particleSystem.minSize = 2;
    smokeSubEmitter.particleSystem.maxSize = 5;
    smokeSubEmitter.particleSystem.addStartSizeGradient(0, 1);
    smokeSubEmitter.particleSystem.addStartSizeGradient(0.6, 1);
    smokeSubEmitter.particleSystem.addStartSizeGradient(1, 0.05);
    smokeSubEmitter.particleSystem.addSizeGradient(0, 1);
    smokeSubEmitter.particleSystem.addSizeGradient(1, 3);
    smokeSubEmitter.particleSystem.addLifeTimeGradient(0, 3);
    smokeSubEmitter.particleSystem.addLifeTimeGradient(1, 2);
    smokeSubEmitter.particleSystem.minInitialRotation = -(Math.PI / 2);
    smokeSubEmitter.particleSystem.maxInitialRotation = Math.PI / 2;
    smokeSubEmitter.particleSystem.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.0));
    smokeSubEmitter.particleSystem.addColorGradient(0.05, new BABYLON.Color4(1, 1, 1, 0.0));
    smokeSubEmitter.particleSystem.addColorGradient(0.1, new BABYLON.Color4(1, 1, 1, 0.2));
    smokeSubEmitter.particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
    smokeSubEmitter.particleSystem.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
    smokeSubEmitter.particleSystem.addRampGradient(0.09, new BABYLON.Color3(209 / 255, 204 / 255, 190 / 255));
    smokeSubEmitter.particleSystem.addRampGradient(0.18, new BABYLON.Color3(221 / 255, 200 / 255, 190 / 255));
    smokeSubEmitter.particleSystem.addRampGradient(0.28, new BABYLON.Color3(200 / 255, 190 / 255, 180 / 255));
    smokeSubEmitter.particleSystem.addRampGradient(0.47, new BABYLON.Color3(115 / 255, 90 / 255, 80 / 255));
    smokeSubEmitter.particleSystem.addRampGradient(0.88, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
    smokeSubEmitter.particleSystem.addRampGradient(1.0, new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255));
    smokeSubEmitter.particleSystem.useRampGradients = true;
    smokeSubEmitter.particleSystem.addColorRemapGradient(0, 0, 0.8);
    smokeSubEmitter.particleSystem.addColorRemapGradient(0.2, 0.1, 0.8);
    smokeSubEmitter.particleSystem.addColorRemapGradient(0.3, 0.2, 0.85);
    smokeSubEmitter.particleSystem.addColorRemapGradient(0.35, 0.4, 0.85);
    smokeSubEmitter.particleSystem.addColorRemapGradient(0.4, 0.5, 0.9);
    smokeSubEmitter.particleSystem.addColorRemapGradient(0.5, 0.95, 1.0);
    smokeSubEmitter.particleSystem.addColorRemapGradient(1.0, 0.95, 1.0);
    smokeSubEmitter.type = BABYLON.SubEmitterType.ATTACHED;
    smokeSubEmitter.inheritDirection = true;
    smokeSubEmitter.particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
    smokeSubEmitter.particleSystem.targetStopDuration = 1.2;

    var debrisCone = debris.createConeEmitter(.2, 2);
    debris.emitRate = 50;
    debris.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
    debris.addColorGradient(1, new BABYLON.Color4(1, 1, 1, 0));
    debris.minLifeTime = 2;
    debris.maxLifeTime = 2;
    debris.minEmitPower = 16;
    debris.maxEmitPower = 30;
    debris.gravity = new BABYLON.Vector3(0, -20, 0);
    debris.subEmitters = [
      [fireSubEmitter, smokeSubEmitter]
    ];
    debris.targetStopDuration = 0.2;

    var movingEmitters = [secondaryBlast, secondarySmoke, fireball];
    scene.beginAnimation(emitterParent, 0, 60, false, 1, function() {
      DestroyEmitter(emitterParent, movingEmitters)
    });

    flash.start();
    shockwave.start(60);
    fireball.start(60);
    debris.start(90);

    shockwave.renderingGroupId = 0;
    smokeSubEmitter.particleSystem.renderingGroupId = 0;
    fireSubEmitter.particleSystem.renderingGroupId = 1;
    fireball.renderingGroupId = 1;
    flash.renderingGroupId = 2;
  }

  function DestroyEmitter(meshToDestoy, movingEmitters) 
  {
    for (i = 0; i < movingEmitters.length; i++) 
    {
      movingEmitters[i].emitter = meshToDestoy.position.clone();
    }
    meshToDestoy.dispose();
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