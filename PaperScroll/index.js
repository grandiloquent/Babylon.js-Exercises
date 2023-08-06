'use strict';
var THETA = 0x2 * Math['PI'];
var _beta=0, _step=0;
var _offset = 18;

const lines = [
    "去去复去去，凄恻门前路",
    "行行重行行，辗转犹含情",
    "含情一回首，见我窗前柳",
    "柳北是高楼，珠帘半上钩",
    "昨为楼上女，帘下调鹦鹉",
    "今为墙外人，红泪沾罗巾",
    "墙外与楼上，相去无十丈",
    "云何咫尺间，如隔千重山",
    "悲哉两决绝，从此终天别",
    "别鹤空徘徊，谁念鸣声哀",
    "徘徊日欲晚，决意投身返",
    "手裂湘裙裾，泣寄稿砧书",
    "可怜帛一尺，字字血痕赤",
    "一字一酸吟，旧爱牵人心",
    "君如收覆水，妾罪甘鞭箠",
    "不然死君前，终胜生弃捐",
    "死亦无别语，愿葬君家土",
    "傥化断肠花，犹得生君家",
]
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(
    canvas, true
);
const scene = new BABYLON.Scene(engine);
const assetsManager = new BABYLON.AssetsManager(scene);
const camera = createCamera()
const light = createLight();
const wood = createWood();
const gold = createGold();
const obj = createScroll();
let parchment = new Image();

createScrollHandles();
scene['clearColor'] = BABYLON['Color3']['Black']();
scene['ambientColor'] = BABYLON['Color3']['Black']();
scene.registerBeforeRender(updateScene);

assetsManager.addTextureTask('albedo', 'textures/wood.jpg').onSuccess = task => {
    wood.albedoTexture = task.texture
}
assetsManager.addTextureTask('reflectivity', 'textures/woodReflectivity.png').onSuccess = task => {
    wood.reflectivityTexture = task.texture
}
assetsManager.addTextureTask('albedo', 'textures/gold.jpg').onSuccess = task => {
    gold.albedoTexture = task.texture
}

assetsManager.addImageTask('parchment', 'textures/parchment.jpg').onSuccess = task => {
    parchment = task.image
}

assetsManager.load();
assetsManager.onFinish = () => {
    for (let i = 0; i < 18; i++) {
        updateScroll(
            obj[i].material.diffuseTexture, i, (0x2 * i + 18 / 0x2) % (0x2 * 18) - 18
        )
    }
    record()
    engine.runRenderLoop(()=>{
        scene.render();
    })
}

