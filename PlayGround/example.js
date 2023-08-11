const createScene =  () => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));

    /* Gridded Sphere Construction
	Construct a box from 6 planes and map plane vertices onto a sphere that touches the box corners.
	
	Box construction
	
	face 0 normal x positive
	face 1 normal x negative
	face 2 normal y positive
	face 3 normal y negative
	face 4 normal z positive
	face 5 normal z   negative
	
	Create each face using shared vertices in the form of a grid of shared cells of gridSize,
	this way you will know which facet triangle belongs to which cell and vice-versa.
	Option to set color of each vertex so each face has a different color.
	
	Form a material with width:height = 6:1 split into a grid based on gridSize
	
	Set uvs for each face based on sixths
	
	For a sphere that touches the 8 corners of the box. 
	Map the box vertices and normals onto the sphere and create the sphere
	
	OPTIONS
	boxSize
	gridSize
	faceColors - array of color4s
*/
   
	
	const createPolySphere = (name, options) => {
		const boxSize = options.boxSize || 1;
		const gridSize = options.gridSize || 2;
		const faceColors = options.faceColors || [];
		
		const boxNormals = [
			BABYLON.Axis.X,
			BABYLON.Axis.X.scale(-1),
			BABYLON.Axis.Y,
			BABYLON.Axis.Y.scale(-1),
			BABYLON.Axis.Z,
			BABYLON.Axis.Z.scale(-1)
		]
		
		const nomX = [
			BABYLON.Axis.Z,
			BABYLON.Axis.Z.scale(-1),
			BABYLON.Axis.X,
			BABYLON.Axis.X,
			BABYLON.Axis.X.scale(-1),
			BABYLON.Axis.X
		];
		
		const nomY = [
			BABYLON.Axis.Y,
			BABYLON.Axis.Y,
			BABYLON.Axis.Z,
			BABYLON.Axis.Z.scale(-1),
			BABYLON.Axis.Y,
			BABYLON.Axis.Y,
		]
		
		if (faceColors.length < 6) {
			for (let i = 0; i < 6; i++) {
				if (faceColors[i] === undefined) {
					faceColors[i] = new BABYLON.Color4(1, 1, 1, 1);
                }
			}
		}
		
		const boxPositions = [];
		const colors = [];
		const uvs = [];
		const indices = [];
		
		let colStart = BABYLON.Vector3.Zero();
		let rowStart = BABYLON.Vector3.Zero();
		let indexStart = 0;
		//let uStart = 0;
		//const vStart = 0;
		const inc = boxSize / gridSize;
        let colInc = BABYLON.Vector3.Zero();
        let rowInc = BABYLON.Vector3.Zero();
		const uvInc = 1 / gridSize;
		//const vInc = 1 / gridSize;
		const gridInc = gridSize + 1;
		const indexInc = gridInc * gridInc; 
		
		
		for (let face = 0; face < 6; face++) {
			colStart = nomX[face].scale(-0.5 * boxSize);
			rowStart = nomY[face].scale(-0.5 * boxSize);
            colInc = nomX[face].scale(inc);
            rowInc = nomY[face].scale(inc);
			const planePosition = boxNormals[face];

			for (let row = 0; row < gridSize + 1; row++) {
				for (let col = 0; col < gridSize + 1; col++) {
					boxPositions.push(colStart.add(colInc.scale(col)).add(rowStart.add(rowInc.scale(row))).add(planePosition));
					colors.push(faceColors[face].r, faceColors[face].g, faceColors[face].b, faceColors[face].a);
					uvs.push(uvInc * col, uvInc * row)	
				}
			};
            for (let ridx = 0; ridx < gridSize; ridx++) {		
			    for (let cidx = 0; cidx < gridSize; cidx++) {
				    indices.push(ridx * gridInc + indexStart + cidx, ridx * gridInc + indexStart + cidx + 1, ridx * gridInc + indexStart + cidx + gridInc);
				    indices.push(ridx * gridInc + indexStart + cidx + 1, ridx * gridInc + indexStart + cidx + 1 + gridInc, ridx * gridInc + indexStart + cidx + gridInc);
			    }
            }
			indexStart += indexInc;
		}
		
		const sphereRadius = Math.sqrt(3) * 0.5 * boxSize;
			
		const vecPositions = boxPositions.map((el) => {
			return el.normalize().scale(sphereRadius);
		});
		
		const vecNormals = boxPositions.map((el) => {
			return el.normalize();
		});

        const quadCenters = [];
        const quadAxes = [];

        for (let idx = 0; idx < indices.length / 3; idx += 2) {
            const i0 = indices[3 * idx];
            const i1 = indices[3 * idx + 1];
            const i2 = indices[3 * idx + 2];
            const centerN = vecPositions[i1].add(vecPositions[i2]).scale(0.5).normalize();
            const centerP = centerN.scale(sphereRadius);
            quadCenters.push(centerP);
            quadAxes.push(vecPositions[i1].subtract(vecPositions[i0]).normalize(), centerN, vecPositions[i2].subtract(vecPositions[i0]))
        }

        /* Cylinder orientation and position test */
/*        for (let i = 0; i < quadCenters.length; i++) {
            const cyl = BABYLON.MeshBuilder.CreateCylinder("cyl", {diameter: 0.1, height: 0.25});
            cyl.position = quadCenters[i];
            const orientation = BABYLON.Vector3.RotationFromAxis(quadAxes[3 * i], quadAxes[3 * i + 1], quadAxes[3 * i + 2]);
            cyl.rotation = orientation;
        }
*/		
		const positions = [];
		const normals = [];
		
		for (let p = 0; p < vecPositions.length; p++) {
			positions.push(vecPositions[p].x, vecPositions[p].y, vecPositions[p].z);
			normals.push(vecNormals[p].x, vecNormals[p].y, vecNormals[p].z);
		}
	
		const customMesh = new BABYLON.Mesh("polySphere", scene);


		const vertexData = new BABYLON.VertexData();

		vertexData.positions = positions;
		vertexData.indices = indices;
		vertexData.normals = normals;
		vertexData.colors = colors;
		vertexData.uvs = uvs;	
		vertexData.applyToMesh(customMesh);
        console.log(uvs);
		
		customMesh.name = name;
        customMesh.quadCenters = quadCenters;
        customMesh.quadAxes = quadAxes;
	
		return customMesh

	}

    const faceColors = [];
	faceColors[0] = BABYLON.Color3.Blue();
	faceColors[1] = BABYLON.Color3.White()
	faceColors[2] = BABYLON.Color3.Red();
	faceColors[3] = BABYLON.Color3.Black();
	faceColors[4] = BABYLON.Color3.Green();
	faceColors[5] = BABYLON.Color3.Yellow();

    const boxSize = 2;
    const gridSize = 6;
	
	const poly = createPolySphere("poly", {boxSize: boxSize, gridSize: gridSize, faceColors: faceColors});
	
	const height = 256;
    const gridInc = height / gridSize;
	const textureGrid = new BABYLON.DynamicTexture("grid texture", height, scene);   
	const textureContext = textureGrid.getContext();

    textureContext.fillStyle = "white";
    textureContext.fillRect(0, 0, height, height);
    textureGrid.update();

    textureContext.stokeStyle = "black";
    textureContext.fillStyle = "black";

    for (x = 0; x < height + 1; x += gridInc) {
        textureContext.beginPath();
        textureContext.moveTo(x, 0);
        textureContext.lineTo(x, height);
        textureContext.stroke();
        textureContext.moveTo(0, x);
        textureContext.lineTo(height, x);
        textureContext.stroke();
    }

    textureGrid.update();

    

    const mat = new BABYLON.StandardMaterial("Mat", scene);    				
	mat.diffuseTexture = textureGrid;

    poly.material = mat;

    const pointerUp = function (faceId) {
        const quad = Math.floor(0.5 * faceId);
        const cyl = BABYLON.MeshBuilder.CreateCylinder("cyl", {diameter: 0.5 * boxSize / gridSize, height: 0.25});
        cyl.position = poly.quadCenters[quad];
        const orientation = BABYLON.Vector3.RotationFromAxis(poly.quadAxes[3 * quad], poly.quadAxes[3 * quad + 1], poly.quadAxes[3 * quad + 2]);
        cyl.rotation = orientation;

    }

    scene.onPointerObservable.add((pointerInfo) => {      		
        switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERUP:
                if(pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh === poly) {
                    pointerUp(pointerInfo.pickInfo.faceId);
                }
				break;
        }
    });

    return scene;
}