(()=>{
const s=`
`
.split(/\n/g)
.map(x=>`[![](Screenshots/${x.split(' ')[0]})](${x.split(' ')[1]})`);

console.log(s.join('\n'))
})();