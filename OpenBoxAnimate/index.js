var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  let meshs = [];
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
        depth: "height",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'left',
        },
      }, {
        width: "height",
        depth: "width",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'top',
        },
      },
      {
        width: "length",
        depth: "height",
        height: "thickness",
        parent: {
          id: 0,
          pos: 'right',
        },
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
        },
      }, {
        width: "length",
        depth: "width/2",
        height: "thickness",
        parent: {
          id: 3,
          pos: 'right',
        },
        isInteractive: true,
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
      last: true,
    }, {
      id: 1,
      axe: "x",
      rotation: Math.PI / 2,
      time: 1,
      last: false,
    }, {
      id: 3,
      axe: "x",
      rotation: -Math.PI / 2,
      time: 1,
      last: true,
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
    },]
  }]
  let frameRate = json[0].anim.length * 10;

  function initAnim() {
    let tab = [];
    let tabtemp = [];
    for (let n = 0; n < json[0].anim.length; n++) {
      if (json[0].anim[n].last === false) {
        tabtemp.push(json[0].anim[n]);
      } else {
        tabtemp.push(json[0].anim[n]);
        tab.push(tabtemp);
        tabtemp = [];
      }
    }
    return {
      tab: tab}
  }

  function stringToCalc(fn) {
    return new Function('return ' + fn)();
  }

  function lights() {
    let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, 0), scene);
    light.intensity = 0.6;
    light.specular = new BABYLON.Color3(0, 0, 0);

    let light1 = new BABYLON.SpotLight("spotLight1", new BABYLON.Vector3(-8, 8, 8), new BABYLON.Vector3(-6 * 1 / 7, -1, 6 * 1 / 7), Math.PI, 1, scene);
    light1.diffuse = new BABYLON.Color3(1, 1, 1);
    light1.specular = new BABYLON.Color3(0, 0, 0);
    light1.intensity = 0.5;

    let light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(1, 1, 0), scene);
    light2.diffuse = new BABYLON.Color3(1, 1, 1);
    light2.intensity = 0.6;
  }

  function camera() {
    camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 4, 100 - (json[0].camera.def * 100) + camdefpos, new BABYLON.Vector3(0, json[0].dimDef.Height / 2, 0), scene);
    camera.attachControl(canvas, true);
  }

  function replace(data) {
    data = data.replace(/thickness/g, json[0].thickness);
    data = data.replace(/height/g, json[0].dimDef.Height);
    data = data.replace(/length/g, json[0].dimDef.Length);
    data = data.replace(/width/g, json[0].dimDef.Width);
    return stringToCalc(data);

  }

  function constructionBox() {
    for (let i = 0; i < json[0].plate.length; i++) {
      json[0].plate[i].height = replace(json[0].plate[i].height);
      json[0].plate[i].width = replace(json[0].plate[i].width);
      json[0].plate[i].depth = replace(json[0].plate[i].depth);

      meshs.push(BABYLON.MeshBuilder.CreateBox("box", {
        width: json[0].plate[i].width,
        depth: json[0].plate[i].depth,
        height: json[0].plate[i].height,
      }, scene));
      pivot.push(BABYLON.MeshBuilder.CreateBox("box", {
        width: 1,
        depth: 1,
        height: 1}, scene));
      if (json[0].plate[i].parent != undefined) {
        let x = 0;
        let y = 0;
        let z = 0;
        if (json[0].plate[i].parent.pos === 'right') {
          z = (json[0].plate[i].depth) / 2;
          meshs[i].position = new BABYLON.Vector3(x, y, z);
          pivot[i].position = new BABYLON.Vector3(0, 0, json[0].plate[json[0].plate[i].parent.id].depth / 2 - json[0].thickness / 2 + 0.001)
        }
        if (json[0].plate[i].parent.pos ==='left') {
          z = -(json[0].plate[i].depth) / 2;
          meshs[i].position = new BABYLON.Vector3(x, y, z);
          pivot[i].position = new BABYLON.Vector3(0, 0, -json[0].plate[json[0].plate[i].parent.id].depth / 2 +json[0].thickness / 2 - 0.001)
        }
        if (json[0].plate[i].parent.pos === 'top') {
          x = -(json[0].plate[i].width) / 2;
          meshs[i].position = new BABYLON.Vector3(x, y, z);
          pivot[i].position = new BABYLON.Vector3(-json[0].plate[json[0].plate[i].parent.id].width / 2 + json[0].thickness / 2 - 0.001, 0, 0)
        }
        if (json[0].plate[i].parent.pos === 'bottom') {
          x = (json[0].plate[i].width) / 2;
          meshs[i].position = new BABYLON.Vector3(x, y, z);
          pivot[i].position = new BABYLON.Vector3(json[0].plate[json[0].plate[i].parent.id].width / 2 - json[0].thickness / 2 + 0.001, 0, 0)
        }
        meshs[i].parent = pivot[i];
        pivot[i].parent = meshs[json[0].plate[i].parent.id];
      }
      pivot[i].isVisible = false;
    }
  }
  var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, scene);
  sphere.position.z = -1.5
  sphere.position.x = 3;

  var sphere2 = BABYLON.Mesh.CreateSphere("sphere2", 16, 1, scene);
  sphere2.position.z = 1.5;
  sphere2.position.x = 3;

  sphere.parent = meshs[0];
  sphere2.parent = meshs[0];
  sphere.isVisible = false;
  sphere2.isVisible = false;

  function interactive() {
    for (let i = 0; i < json[0].plate.length; i++) {
      meshs[i].actionManager = new BABYLON.ActionManager(scene);
      if (json[0].plate[i].isInteractive) {
        let temp = json[0].anim[json[0].anim.findIndex(x => x.id == i)];
        meshs[i].actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, pivot[i], "rotation." + temp.axe, temp.rotationInteractive, temp.rotationSpeed)).then(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, pivot[i], "rotation." + temp.axe, temp.rotation, temp.rotationSpeed));
      }
    }
  }

  function animation() {
    let tab = initAnim().tab
    for (let t = 0; t < tab.length; t++) {
      for (let a = 0; a < tab[t].length; a++) {
        sweep = new BABYLON.Animation("sweep", "rotation." + tab[t][a].axe, frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        let sweep_keys = [];
        sweep_keys.push({
          frame: (t + 0.001) * frameRate,
          value: 0
        });
        sweep_keys.push({
          frame: (t + 1) * frameRate,
          value: tab[t][a].rotation
        });
        sweep.setKeys(sweep_keys);
        console.log(pivot[tab[t][a].id])
        scene.beginDirectAnimation(pivot[tab[t][a].id], [sweep], 0, 25 * frameRate, false, 1)
      }
    }
  }

  function boxBuild() {
    let frameRate = json[0].anim.length * 10;
    for (let n = 0; n < json[0].anim.length; n++) {
      let sweep = new BABYLON.Animation("sweep", "rotation." + json[0].anim[n].axe, frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      let animEnd = [];
      animEnd.push({
        frame: 1,
        value: json[0].anim[n].rotation
      });
      sweep.setKeys(animEnd);
      scene.beginDirectAnimation(pivot[json[0].anim[n].id], [sweep], 0, 100 * frameRate, false);
    }
    console.log('boxbuild');
  }

  function gui() {
    // https://doc.babylonjs.com/features/featuresDeepDive/gui/gui
    // https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/gui
    console.log(BABYLON.GUI.AdvancedDynamicTexture)
    let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
    var button = BABYLON.GUI.Button.CreateSimpleButton("but", "animation");
    button.width = "200px";
    button.height = "40px";
    button.color = "white";
    button.background = "red";
    button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(button);
    return {
      button: button
    }
  }

  function debug() {
    let boxMat = new BABYLON.StandardMaterial("boxMat", scene);
    boxMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    meshs[4].material = boxMat;
    let boxMat2 = new BABYLON.StandardMaterial("boxMat", scene);
    boxMat2.diffuseColor = new BABYLON.Color3(0, 1, 0);
    meshs[6].material = boxMat2;
  }
  gui().button.onPointerUpObservable.add(function() {
    animation()
  });
  lights();
  camera();
  constructionBox();
  interactive();
  boxBuild();
  debug();
  let advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
  var line = new BABYLON.GUI.Line();
  line.x1 = 10;
  line.y1 = 10;
  line.x2 = 1000;
  line.y2 = 500;
  line.lineWidth = 5;
  line.color = "black";
  advancedTexture2.addControl(line);

  scene.registerBeforeRender(() => {
    var p0 = advancedTexture2.getProjectedPosition(
      sphere.position, meshs[0].getWorldMatrix()
    );
    var p1 = advancedTexture2.getProjectedPosition(sphere2.position, meshs[0].getWorldMatrix());
    var distance = p0.subtract(p1).length();
    let width = advancedTexture2.getSize().width;
    line.x1 = (width - 50 - distance) + "px";
    line.y1 = (advancedTexture2.getSize().height - 50) + "px";
    line.x2 = (width - 50) + "px";
    line.y2 = line.y1;
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