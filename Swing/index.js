class TTurtle {
  flDeg;
  px;
  py;
  flFactor;
  mesh;

  constructor(scene, width, height, depth) {

    this.mesh = BABYLON.MeshBuilder.CreateBox("turtle", {
      width: width,
      height: height,
      depth: depth
    }, scene);


    this.flFactor = 2 * Math.PI / 360.0;
    this.clear();
  }

  setMeshPos() {
    this.mesh.position.x = this.px;
    this.mesh.position.y = this.py;
  }

  // visible
  vi(v) {
    this.mesh.isVisible = v;
  }




  // Clear
  clear() {
    this.flDeg = 0;
    this.px = 0;
    this.py = 0;
    this.setMeshPos();
  }

  // Set
  set(t) {
    this.flDeg = t.flDeg;
    this.px = t.px;
    this.py = t.py;
    this.setMeshPos();
    return this;
  }

  // Degree   
  dg(_flDeg) {
    this.flDeg = _flDeg;
    return this;
  }

  dg() {
    return this.flDeg;
  }

  xy(_x, _y) {
    this.px = _x;
    this.py = _y;
    this.setMeshPos();
    return this;
  }

  x() {
    return this.px;
  }

  y() {
    return this.py;
  }

  // Left
  lt(_flDeg) {
    this.flDeg -= _flDeg;
    return this;
  }

  // Right
  rt(_flDeg) {
    this.flDeg += _flDeg;
    return this;
  }

  // Forward
  fw(flLen) {
    this.exec(flLen);
    return this;
  }

  // Backward
  bw(flLen) {
    var flTmp = this.flDeg;
    this.flDeg += 180;
    exec(flLen);
    this.flDeg = flTmp;
    return this;
  }

  // exec
  exec(flLen) {
    this.px = this.px + Math.sin(this.flFactor * this.flDeg) * flLen;
    this.py = this.py + Math.cos(this.flFactor * this.flDeg) * flLen;
    this.setMeshPos();
    return this;
  }

  // LookAt
  la(_px, _py) {
    var xDelta = _px - this.px;
    var yDelta = _py - this.py;
    var alpha = Math.atan(yDelta / xDelta) / this.flFactor;

    if (xDelta >= 0 && yDelta >= 0)
      this.flDeg = 90 - alpha;
    else if (xDelta >= 0 && yDelta < 0)
      this.flDeg = 90 - alpha;
    else if (xDelta < 0 && yDelta >= 0)
      this.flDeg = 270 - alpha;
    else if (xDelta < 0 && yDelta < 0)
      this.flDeg = 270 - alpha;

    return this;
  }

  // distanz zw. zwei punkten
  di(t) {
    var flxd = t.px - this.px;
    var flyd = t.py - this.py;
    var flHyp = Math.sqrt(flxd * flxd + flyd * flyd);

    return flHyp;
  }

  dg_rad() {
    return -2 * Math.PI * this.flDeg / 360;
  }
};





var hinge = null;


var fw = 10;
var fw2 = fw / 2;
var lt = 10;
var max_turtles = 360 / lt;
var hinges = [];

function update(create) {

  var txy = new TTurtle(scene, 1, 1, 1);
  txy.vi(false);
  txy.clear();
  txy.rt(0);

  if (create) {
    hinge = BABYLON.MeshBuilder.CreateBox("hinge", {
      width: 3,
      height: 3,
      depth: 3
    }, scene);
    hinge.position.x = txy.px;
    hinge.position.y = txy.py;
  }

  for (var i = 0; i < max_turtles; i++) {
    if (create) {
      txy.clear();
      txy.rt(i / max_turtles * 360);
      txy.fw(5 * fw);

      hinges[i] = BABYLON.MeshBuilder.CreateBox("hinge", {
        width: 3,
        height: 3,
        depth: 3
      }, scene);
      hinges[i].parent = hinge;
      hinges[i].position.x = txy.px;
      hinges[i].position.y = txy.py;
      hinges[i].rotation.z = txy.dg_rad(); // + 2 * Math.PI * 30/360;

      var box0 = BABYLON.MeshBuilder.CreateBox("box0", {
        width: 10,
        height: 100,
        depth: 1
      }, scene);
      box0.parent = hinges[i];
      box0.position.x = 0;
      box0.position.y = 50;
    }
  }
}


var createScene = function() {
  var scene = new BABYLON.Scene(engine);
  // scene.debugLayer.show();

  camera = new BABYLON.ArcRotateCamera("camera1", -2.50, 0.70, 270, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  var light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);

  update(true);

  scene.registerBeforeRender(function() {
    for (var i = 0; i < hinges.length; i++) {
      hinges[i].rotation.x += 0.02;
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