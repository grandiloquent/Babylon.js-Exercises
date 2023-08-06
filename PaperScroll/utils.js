function addLoadTextTask() {
    const textFileTask = assetsManager.addTextFileTask('books', 'pi_dec_1m.txt');
    textFileTask.onSuccess = function (task) {
        console.log(task);
    }
}
function createCamera() {
    const camera = new BABYLON['ArcRotateCamera']('ArcRotateCamera', 0x0, Math['PI'] / 0x2, 0x5, new BABYLON[('Vector3')](0x0, 0x0, 0x0), scene);
    camera.lowerAlphaLimit = -Math['PI'] / 0x2 + 0.01;
    camera.upperAlphaLimit = +Math['PI'] / 0x2 - 0.01;
    camera.lowerBetaLimit = null;
    camera.upperBetaLimit = null;
    camera.lowerRadiusLimit = 0x2;
    camera.moveSensibility = 0x3c;
    camera.wheelPrecision = 0x28;
    camera.pinchPrecision = 0x20;
    camera.checkCollisions = !0x1;
    camera.inertia = 0x0;
    camera.angularSensibilityX = 0xf0;
    camera.angularSensibilityY = 0xf0;
    camera.panningSensibility = 0xc8;
    camera.attachControl(canvas, !0x0);
    return camera;
}
function createGold() {
    const gold = new BABYLON[('PBRMaterial')]('metal', scene);
    gold.microSurface = 0.76;
    gold.reflectivityColor = new BABYLON[('Color3')](0.9, 0.7, 0.1);
    gold.cameraExposure = 1.6;
    gold.cameraContrast = 1.3;
    gold.freeze();
    return gold;
}
function createHandle(data) {

    const tube = BABYLON['Mesh']['CreateTube']('tube', data['slice'](0xe, 0x32), 0x2, 0x30, radiusFunction['bind'](null, 0xe), 0x0, scene, !0x1, BABYLON['Mesh']['FRONTSIDE']);
    tube.material = wood;
    tube.freezeWorldMatrix();
    return tube;
}
function createLight() {
    const light = new BABYLON[('DirectionalLight')]('light', new BABYLON[('Vector3')](0x0, 0x0, 0x1), scene);
    light.diffuse = BABYLON['Color3']['White']();
    light.intensity = 0.8;
    light.parent = camera;
    return light;
}
function createWood() {
    const wood = new BABYLON[('PBRMaterial')]('wood', scene);
    wood.microSurface = 0.5;
    wood.cameraExposure = 0x2;
    wood.cameraContrast = 1.06;
    wood.freeze();
    return wood;
}
function radiusFunction(i, j) {
    var value = 0x4 * (j + i) / Math['PI'] * 0x2 / 0x8;
    return 0.1217 * (Math['sin'](value) + 0x4 * (j + i) / 24.84);
}
function createTip(data) {
    var tube = BABYLON['Mesh']['CreateTube']('tube',
        data['slice'](0x0, 0xf), 0x2, 0x30,
        radiusFunction['bind'](null, 0x0), 0x0,
        scene,
        !0x1,
        BABYLON['Mesh']['FRONTSIDE']);
    return tube['material'] = gold,
        tube['freezeWorldMatrix'](),
        tube;
}
function createScrollHandles() {
    var data = function (results, value) {
        for (var array = [], k = results / value, i = -results / 0x2; results / 0x2 >= i; i += k) {
            value = i / Math['PI'] * 0x2;
            var j = Math['sin'](value) + i;
            array['push'](new BABYLON[('Vector3')](0x0, 0x0, j / 24.84 - 2.28));
        }
        return array;
    }(0x28, 0x32);
    createHandle(data);
    createTip(data);
    for (var i = 0x0; i < data['length']; i++)
        data[i]['z'] = -data[i]['z'];
    this['createHandle'](data),
        this['createTip'](data);
}
function createScroll() {
    var vec = [new BABYLON.Vector3(0x0, 0x0, -Math.PI / 0x2), new BABYLON.Vector3(0x0, 0x0, Math.PI / 0x2)];

    let obj = [];
    for (var i = 0x0; i < 18; i++) {
        for (var array = [], j = 0x0; 0x9 > j; j++) {
            array.push(new BABYLON.Vector3(Math.sin((i + 0x1 - 0.125 * j) * THETA / 18), Math.cos((i + 0x1 - 0.125 * j) * THETA / 18), 0x0));
        }
        let material = new BABYLON.StandardMaterial('mat', scene);
        material.specularColor = new BABYLON.Color3(0.12, 0.12, 0.15)
        material.backFaceCulling = !0x0;
        material.diffuseTexture = new BABYLON.DynamicTexture('dynamic texture', {
            'width': 0x400,
            'height': 0x40
        }, scene, !0x0);
        obj[i] = BABYLON.MeshBuilder.ExtrudeShape('ext', {
            'shape': array,
            'path': vec,
            'invertUV': !0x0
        }, scene);
        obj[i].material = material;
        obj[i].freezeWorldMatrix();
    }
    return obj;

}

function getContext(obj) {
    const context = obj[0x0]['material']['diffuseTexture']['getContext']();
    context['font'] = '32px Cambria'
    return context;
}

function updateScroll(diffuseTexture, i, j) {
    const context = diffuseTexture.getContext();
    dx = 0x0;
    dy = 0x40 * i % 0x600;
    dWidth = 0x200;
    dHeight = 0x40;
    sx = 0x0;
    sy = 0x0;
    sWidth = 0x400;
    sHeight = 0x40;

    context.drawImage(parchment, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    diffuseTexture.drawText(lines[i], 300, 25, '32px Cambria', 'black')
}
function updateScene() {

    camera.beta += 0.001;

}
function fraction(a, b) {
    return (a % b + b) % b;
}

function record() {
    var recordedChunks = [];

    var time = 0;
    var canvas = document.getElementById("renderCanvas");

    var stream = canvas.captureStream(30);

    mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9"
    });

    mediaRecorder.start(time);

    mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(event.data);
        // for demo, removed stop() call to capture more than one frame
    }

    mediaRecorder.onstop = function (event) {
        var blob = new Blob(recordedChunks, {
            "type": "video/webm"
        });
        var url = URL.createObjectURL(blob);
        const video = document.createElement("video");
        video.src = url;
        document.body.appendChild(video);
    }

    setTimeout(() => {
        mediaRecorder.stop();
    }, 70000);
}