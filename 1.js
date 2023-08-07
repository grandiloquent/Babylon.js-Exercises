(()=>{
const s=`2023-08-07_223229.jpg https://playground.babylonjs.com/#0NK438#34
2023-08-07_223327.jpg https://playground.babylonjs.com/#FIKUCY#8
2023-08-07_223355.jpg https://www.babylonjs-playground.com/#ZIYEUM
2023-08-07_223418.jpg https://www.babylonjs-playground.com/#866PVL#2
2023-08-07_223452.jpg https://playground.babylonjs.com/#1Z71FW#145
2023-08-07_223528.jpg https://playground.babylonjs.com/#0IIB3N#81
2023-08-07_223627.jpg https://lo-th.github.io/phy/index.html?E=w_havok#keva
2023-08-07_223721.jpg https://playground.babylonjs.com/#0XUR8S#12
2023-08-07_223804.jpg https://playground.babylonjs.com/#K488R3#46
2023-08-07_223917.jpg https://playground.babylonjs.com/#Z6YF3L#2
2023-08-07_224003.jpg https://playground.babylonjs.com/#K488R3#38
2023-08-07_224104.jpg https://playground.babylonjs.com/#JB1TB3#1
2023-08-07_224124.jpg https://playground.babylonjs.com/#1Q2E1P#32`
.split(/\n/g)
.map(x=>`[![](Screenshots/${x.split(' ')[0]})](${x.split(' ')[1]})`);

console.log(s.join('\n'))
})();