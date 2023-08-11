console.log(
    [...$0.querySelectorAll('li')]
        .map(x => {
            if (x.classList.contains('tsd-is-static')) {
                return `// ${x.textContent}`
            }
            return `// dynamicTexture.${x.textContent} = '';`
        }).join("\n")
)

console.log(
    [...$0.querySelectorAll('li')]
        .map(x => {
            if (x.classList.contains('tsd-is-static')) {
                return `// ${x.textContent}`
            }
            return `// dynamicTexture.${x.textContent}();`
        }).join("\n")
)
console.log(
    JSON.stringify([...$0.querySelectorAll('tr td:nth-child(2)')]
    .map(x => {
       
        return `${x.textContent}`
    }))
)
    (() => {
        const name = "coordinatesMode";
        const obj="dynamicTexture";
        const namespace="BABYLON.DynamicTexture";
        console.log(["EXPLICIT_MODE","SPHERICAL_MODE","PLANAR_MODE","CUBIC_MODE","PROJECTION_MODE","SKYBOX_MODE","INVCUBIC_MODE","EQUIRECTANGULAR_MODE","FIXED_EQUIRECTANGULAR_MODE","FIXED_EQUIRECTANGULAR_MIRRORED_MODE"]
        .map(x=>{
            return `// ${obj}.${name} = ${namespace}.${x};`
        }).join("\n"));
    })();