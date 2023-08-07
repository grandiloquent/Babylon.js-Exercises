(()=>{
const s=`2023-08-08_005151.jpg https://playground.babylonjs.com/#21FIRD
2023-08-08_005206.jpg https://playground.babylonjs.com/#J1LXF0
2023-08-08_005224.jpg https://playground.babylonjs.com/#ND4U2L
2023-08-08_005250.jpg https://playground.babylonjs.com/#A0YCX2#7
2023-08-08_005950.jpg https://playground.babylonjs.com/#ZD364L#16
2023-08-08_010017.jpg https://www.babylonjs-playground.com/#NA2WKW#3
2023-08-08_010118.jpg https://playground.babylonjs.com/#UZX1TR#12
2023-08-08_010156.jpg https://playground.babylonjs.com/#DGEP8N#25
2023-08-08_010225.jpg https://playground.babylonjs.com/#PFJIUA#11
2023-08-08_010256.jpg https://playground.babylonjs.com/#1SHP80#6
2023-08-08_010320.jpg https://playground.babylonjs.com/#PQJFCZ
2023-08-08_010445.jpg https://playground.babylonjs.com/#1WROZH#2
2023-08-08_010459.jpg https://playground.babylonjs.com/#2FPT1A#56
2023-08-08_010514.jpg https://playground.babylonjs.com/#11JINV#58
2023-08-08_010528.jpg https://playground.babylonjs.com/#KVRKS#6
2023-08-08_010601.jpg https://playground.babylonjs.com/#2KHPSP#14
2023-08-08_012312.jpg https://playground.babylonjs.com/#1VPUIR#1
2023-08-08_015946.jpg https://www.babylonjs-playground.com/#SVZL1I#34
`
.split(/\n/g)
.map(x=>`[![](Screenshots/${x.split(' ')[0]})](${x.split(' ')[1]})`);

console.log(s.join('\n'))
})();