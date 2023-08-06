var createScene = function() {
  var createPolyhedron = function() {
    var positions = [0.9952, 0.0135, 0.098, 1, 0.034, 0, 1, 0, 0, 0.9952, 0.0135, -0.098, 0.8819, 0.0135, 0.4714, 0.9239, 0.034, 0.3827, 0.9239, 0, 0.3827, 0.9569, 0.0135, 0.2903, 0.6344, 0.0135, 0.773, 0.7071, 0.034, 0.7071, 0.7071, 0, 0.7071, 0.773, 0.0135, 0.6344, 0.2903, 0.0135, 0.9569, 0.3827, 0.034, 0.9239, 0.3827, 0, 0.9239, 0.4714, 0.0135, 0.8819, -0.098, 0.0135, 0.9952, 0, 0.034, 1, 0, 0, 1, 0.098, 0.0135, 0.9952, -0.4714, 0.0135, 0.8819, -0.3827, 0.034, 0.9239, -0.3827, 0, 0.9239, -0.2903, 0.0135, 0.9569, -0.773, 0.0135, 0.6344, -0.7071, 0.034, 0.7071, -0.7071, 0, 0.7071, -0.6344, 0.0135, 0.773, -0.9569, 0.0135, 0.2903, -0.9239, 0.034, 0.3827, -0.9239, 0, 0.3827, -0.8819, 0.0135, 0.4714, -0.9952, 0.0135, -0.098, -1, 0.034, 0, -1, 0, 0, -0.9952, 0.0135, 0.098, -0.8819, 0.0135, -0.4714, -0.9239, 0.034, -0.3827, -0.9239, 0, -0.3827, -0.9569, 0.0135, -0.2903, -0.6344, 0.0135, -0.773, -0.7071, 0.034, -0.7071, -0.7071, 0, -0.7071, -0.773, 0.0135, -0.6344, -0.2903, 0.0135, -0.9569, -0.3827, 0.034, -0.9239, -0.3827, 0, -0.9239, -0.4714, 0.0135, -0.8819, 0.098, 0.0135, -0.9952, 0, 0.034, -1, 0, 0, -1, -0.098, 0.0135, -0.9952, 0.4714, 0.0135, -0.8819, 0.3827, 0.034, -0.9239, 0.3827, 0, -0.9239, 0.2903, 0.0135, -0.9569, 0.773, 0.0135, -0.6344, 0.7071, 0.034, -0.7071, 0.7071, 0, -0.7071, 0.6344, 0.0135, -0.773, 0.9569, 0.0135, -0.2903, 0.9239, 0.034, -0.3827, 0.9239, 0, -0.3827, 0.8819, 0.0135, -0.4714, 0.9808, 0.0179, 0.1951, 0.9952, 0.022, 0.098, 0.9569, 0.022, 0.2903, 0.9808, 0.0181, 0.1951, 0.8315, 0.0179, 0.5556, 0.8819, 0.022, 0.4714, 0.773, 0.022, 0.6344, 0.8315, 0.0181, 0.5556, 0.5556, 0.0179, 0.8315, 0.6344, 0.022, 0.773, 0.4714, 0.022, 0.8819, 0.5556, 0.0181, 0.8315, 0.1951, 0.0179, 0.9808, 0.2903, 0.022, 0.9569, 0.098, 0.022, 0.9952, 0.1951, 0.0181, 0.9808, -0.1951, 0.0179, 0.9808, -0.098, 0.022, 0.9952, -0.2903, 0.022, 0.9569, -0.1951, 0.0181, 0.9808, -0.5556, 0.0179, 0.8315, -0.4714, 0.022, 0.8819, -0.6344, 0.022, 0.773, -0.5556, 0.0181, 0.8315, -0.8315, 0.0179, 0.5556, -0.773, 0.022, 0.6344, -0.8819, 0.022, 0.4714, -0.8315, 0.0181, 0.5556, -0.9808, 0.0179, 0.1951, -0.9569, 0.022, 0.2903, -0.9952, 0.022, 0.098, -0.9808, 0.0181, 0.1951, -0.9808, 0.0179, -0.1951, -0.9952, 0.022, -0.098, -0.9569, 0.022, -0.2903, -0.9808, 0.0181, -0.1951, -0.8315, 0.0179, -0.5556, -0.8819, 0.022, -0.4714, -0.773, 0.022, -0.6344, -0.8315, 0.0181, -0.5556, -0.5556, 0.0179, -0.8315, -0.6344, 0.022, -0.773, -0.4714, 0.022, -0.8819, -0.5556, 0.0181, -0.8315, -0.1951, 0.0179, -0.9808, -0.2903, 0.022, -0.9569, -0.098, 0.022, -0.9952, -0.1951, 0.0181, -0.9808, 0.1951, 0.0179, -0.9808, 0.098, 0.022, -0.9952, 0.2903, 0.022, -0.9569, 0.1951, 0.0181, -0.9808, 0.5556, 0.0179, -0.8315, 0.4714, 0.022, -0.8819, 0.6344, 0.022, -0.773, 0.5556, 0.0181, -0.8315, 0.8315, 0.0179, -0.5556, 0.773, 0.022, -0.6344, 0.8819, 0.022, -0.4714, 0.8315, 0.0181, -0.5556, 0.9808, 0.0179, -0.1951, 0.9569, 0.022, -0.2903, 0.9952, 0.022, -0.098, 0.9808, 0.0181, -0.1951, 0.6475, 0.277, -0.2682, 0.6475, 0.277, 0.2682, 0.2682, 0.277, 0.6475, -0.2682, 0.277, 0.6475, -0.6475, 0.277, 0.2682, -0.6475, 0.277, -0.2682, -0.2682, 0.277, -0.6475, 0.2682, 0.277, -0.6475, 0.53, 0.358, 0, 0.3748, 0.358, 0.3748, 0, 0.358, 0.53, -0.3748, 0.358, 0.3748, -0.53, 0.358, 0, -0.3748, 0.358, -0.3748, 0, 0.358, -0.53, 0.3748, 0.358, -0.3748, 0.4, -0.5172, 0.1657, 0.4, -0.5172, -0.1657, 0.1657, -0.5172, 0.4, -0.1657, -0.5172, 0.4, -0.4, -0.5172, 0.1657, -0.4, -0.5172, -0.1657, -0.1657, -0.5172, -0.4, 0.1657, -0.5172, -0.4, 0, -0.862, 0];
    var normals = [0.9143, -0.3855, 0.1238, 0.8861, 0.4635, 0, 0.9033, -0.4291, 0, 0.9143, -0.3855, -0.1238, 0.7974, -0.3855, 0.4642, 0.8247, 0.4508, 0.3416, 0.8352, -0.4274, 0.346, 0.8921, -0.3855, 0.2355, 0.559, -0.3855, 0.7341, 0.6265, 0.4635, 0.6266, 0.6387, -0.4291, 0.6387, 0.7341, -0.3855, 0.559, 0.2355, -0.3855, 0.8921, 0.3416, 0.4508, 0.8247, 0.346, -0.4274, 0.8352, 0.4642, -0.3855, 0.7974, -0.1238, -0.3855, 0.9143, 0, 0.4635, 0.8861, 0, -0.4291, 0.9033, 0.1238, -0.3855, 0.9143, -0.4642, -0.3855, 0.7974, -0.3416, 0.4508, 0.8247, -0.346, -0.4274, 0.8352, -0.2355, -0.3855, 0.8921, -0.7341, -0.3855, 0.559, -0.6265, 0.4635, 0.6265, -0.6387, -0.4291, 0.6387, -0.559, -0.3855, 0.7341, -0.8921, -0.3855, 0.2355, -0.8247, 0.4508, 0.3416, -0.8352, -0.4274, 0.346, -0.7974, -0.3855, 0.4642, -0.9143, -0.3855, -0.1238, -0.8861, 0.4635, 0, -0.9033, -0.4291, 0, -0.9143, -0.3855, 0.1238, -0.7974, -0.3855, -0.4642, -0.8247, 0.4508, -0.3416, -0.8352, -0.4274, -0.346, -0.8921, -0.3855, -0.2355, -0.559, -0.3855, -0.7341, -0.6265, 0.4635, -0.6265, -0.6387, -0.4291, -0.6387, -0.7341, -0.3855, -0.559, -0.2355, -0.3855, -0.8921, -0.3416, 0.4508, -0.8247, -0.346, -0.4274, -0.8352, -0.4642, -0.3855, -0.7974, 0.1238, -0.3855, -0.9143, 0, 0.4635, -0.8861, 0, -0.4291, -0.9033, -0.1238, -0.3855, -0.9143, 0.4642, -0.3855, -0.7974, 0.3416, 0.4508, -0.8247, 0.346, -0.4274, -0.8352, 0.2355, -0.3855, -0.8921, 0.7341, -0.3855, -0.559, 0.6265, 0.4635, -0.6265, 0.6387, -0.4291, -0.6387, 0.559, -0.3855, -0.7341, 0.8921, -0.3855, -0.2355, 0.8247, 0.4508, -0.3416, 0.8352, -0.4274, -0.346, 0.7974, -0.3855, -0.4642, 0.9051, -0.3853, 0.18, 0.9032, 0.4118, 0.1212, 0.8808, 0.4118, 0.2337, 0.8938, 0.4116, 0.1777, 0.7672, -0.3853, 0.5127, 0.788, 0.4118, 0.4575, 0.7243, 0.4118, 0.5529, 0.7577, 0.4116, 0.5063, 0.5127, -0.3853, 0.7672, 0.5529, 0.4118, 0.7243, 0.4575, 0.4118, 0.7881, 0.5063, 0.4116, 0.7577, 0.18, -0.3853, 0.9051, 0.2337, 0.4118, 0.8808, 0.1212, 0.4118, 0.9032, 0.1777, 0.4116, 0.8938, -0.18, -0.3853, 0.9051, -0.1212, 0.4118, 0.9032, 0.2337, 0.4118, 0.8808, -0.1777, 0.4116, 0.8938, -0.5127, -0.3853, 0.7672, -0.4575, 0.4118, 0.788, -0.5529, 0.4118, 0.7243, -0.5063, 0.4116, 0.7577, -0.7672, -0.3853, 0.5127, -0.7243, 0.4118, 0.5529, -0.788, 0.4118, 0.4575, -0.7577, 0.4116, 0.5063, -0.9051, -0.3853, 0.18, -0.8808, 0.4118, 0.2337, -0.9032, 0.4118, 0.1212, -0.8938, 0.4116, 0.1777, -0.9051, -0.3853, -0.18, -0.9032, 0.4118, -0.1212, -0.8808, 0.4118, -0.2337, -0.8938, 0.4116, -0.1777, -0.7672, -0.3853, -0.5127, -0.788, 0.4118, -0.4575, -0.7243, 0.4118, -0.5529, -0.7577, 0.4116, -0.5063, -0.5127, -0.3853, -0.7672, -0.5529, 0.4118, -0.7243, -0.4575, 0.4118, -0.788, -0.5063, 0.4116, -0.7577, -0.18, -0.3853, -0.9051, -0.2337, 0.4118, -0.8808, -0.1212, 0.4118, -0.9032, -0.1777, 0.4116, -0.8938, 0.18, -0.3853, -0.9051, 0.1212, 0.4118, -0.9032, 0.2337, 0.4118, -0.8808, 0.1777, 0.4116, -0.8938, 0.5127, -0.3853, -0.7672, 0.4575, 0.4118, -0.788, 0.5529, 0.4118, -0.7243, 0.5063, 0.4116, -0.7577, 0.7672, -0.3853, -0.5127, 0.7243, 0.4118, -0.5529, 0.788, 0.4118, -0.4575, 0.7577, 0.4116, -0.5063, 0.9051, -0.3853, -0.18, 0.8808, 0.4118, -0.2337, 0.9032, 0.4118, -0.1212, 0.8938, 0.4116, -0.1777, 0.4842, 0.8516, -0.2006, 0.4842, 0.8516, 0.2006, 0.2006, 0.8516, 0.4842, -0.2006, 0.8516, 0.4842, -0.4842, 0.8516, 0.2006, -0.4842, 0.8516, -0.2006, -0.2006, 0.8516, -0.4842, 0.2006, 0.8516, -0.4842, 0.2983, 0.9544, 0, 0.211, 0.9544, 0.211, 0, 0.9544, 0.2983, -0.211, 0.9544, 0.211, -0.2983, 0.9544, 0, -0.211, 0.9544, -0.211, 0, 0.9544, -0.2983, 0.211, 0.9544, -0.211, 0.5833, -0.7754, 0.2416, 0.5833, -0.7754, -0.2416, 0.2416, -0.7754, 0.5833, -0.2416, -0.7754, 0.5833, -0.5833, -0.7754, 0.2416, -0.5833, -0.7754, -0.2416, -0.2416, -0.7754, -0.5833, 0.2416, -0.7754, -0.5833, 0, -1, 0];
    var indices = [0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13, 14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22, 24, 25, 26, 25, 27, 26, 28, 29, 30, 29, 31, 30, 32, 33, 34, 33, 35, 34, 36, 37, 38, 37, 39, 38, 40, 41, 42, 41, 43, 42, 44, 45, 46, 45, 47, 46, 48, 49, 50, 49, 51, 50, 52, 53, 54, 53, 55, 54, 56, 57, 58, 57, 59, 58, 60, 61, 62, 61, 63, 62, 64, 65, 0, 64, 66, 67, 68, 69, 4, 68, 70, 71, 72, 73, 8, 72, 74, 75, 76, 77, 12, 76, 78, 79, 80, 81, 16, 80, 82, 83, 84, 85, 20, 84, 86, 87, 88, 89, 24, 88, 90, 91, 92, 93, 28, 92, 94, 95, 96, 97, 32, 96, 98, 99, 100, 101, 36, 100, 102, 103, 104, 105, 40, 104, 106, 107, 108, 109, 44, 108, 110, 111, 112, 113, 48, 112, 114, 115, 116, 117, 52, 116, 118, 119, 120, 121, 56, 120, 122, 123, 124, 125, 60, 124, 126, 127, 128, 127, 126, 123, 122, 128, 71, 70, 129, 129, 67, 66, 79, 78, 130, 130, 75, 74, 87, 86, 131, 131, 83, 82, 95, 94, 132, 132, 91, 90, 103, 102, 133, 133, 99, 98, 111, 110, 134, 134, 107, 106, 119, 118, 135, 135, 115, 114, 136, 129, 137, 137, 9, 130, 137, 130, 138, 138, 17, 131, 138, 131, 139, 139, 25, 132, 139, 132, 140, 140, 33, 133, 140, 133, 141, 141, 41, 134, 141, 134, 142, 142, 49, 135, 142, 135, 143, 143, 57, 128, 143, 128, 136, 1, 136, 128, 139, 141, 143, 144, 64, 0, 124, 60, 145, 146, 72, 8, 68, 4, 144, 147, 80, 16, 76, 12, 146, 148, 88, 24, 84, 20, 147, 149, 96, 32, 92, 28, 148, 150, 104, 40, 100, 36, 149, 151, 112, 48, 108, 44, 150, 145, 120, 56, 116, 52, 151, 145, 144, 2, 144, 146, 10, 146, 147, 18, 147, 148, 26, 148, 149, 34, 149, 150, 42, 150, 151, 50, 151, 145, 58, 0, 65, 1, 1, 126, 3, 4, 69, 5, 5, 66, 7, 8, 73, 9, 9, 70, 11, 12, 77, 13, 13, 74, 15, 16, 81, 17, 17, 78, 19, 20, 85, 21, 21, 82, 23, 24, 89, 25, 25, 86, 27, 28, 93, 29, 29, 90, 31, 32, 97, 33, 33, 94, 35, 36, 101, 37, 37, 98, 39, 40, 105, 41, 41, 102, 43, 44, 109, 45, 45, 106, 47, 48, 113, 49, 49, 110, 51, 52, 117, 53, 53, 114, 55, 56, 121, 57, 57, 118, 59, 60, 125, 61, 61, 122, 63, 64, 67, 65, 64, 7, 66, 68, 71, 69, 68, 11, 70, 72, 75, 73, 72, 15, 74, 76, 79, 77, 76, 19, 78, 80, 83, 81, 80, 23, 82, 84, 87, 85, 84, 27, 86, 88, 91, 89, 88, 31, 90, 92, 95, 93, 92, 35, 94, 96, 99, 97, 96, 39, 98, 100, 103, 101, 100, 43, 102, 104, 107, 105, 104, 47, 106, 108, 111, 109, 108, 51, 110, 112, 115, 113, 112, 55, 114, 116, 119, 117, 116, 59, 118, 120, 123, 121, 120, 63, 122, 124, 127, 125, 124, 3, 126, 126, 1, 128, 128, 61, 125, 125, 127, 128, 128, 57, 121, 121, 123, 128, 122, 61, 128, 129, 5, 69, 69, 71, 129, 70, 9, 129, 66, 5, 129, 129, 1, 65, 65, 67, 129, 130, 13, 77, 77, 79, 130, 78, 17, 130, 74, 13, 130, 130, 9, 73, 73, 75, 130, 131, 21, 85, 85, 87, 131, 86, 25, 131, 82, 21, 131, 131, 17, 81, 81, 83, 131, 132, 29, 93, 93, 95, 132, 94, 33, 132, 90, 29, 132, 132, 25, 89, 89, 91, 132, 133, 37, 101, 101, 103, 133, 102, 41, 133, 98, 37, 133, 133, 33, 97, 97, 99, 133, 134, 45, 109, 109, 111, 134, 110, 49, 134, 106, 45, 134, 134, 41, 105, 105, 107, 134, 135, 53, 117, 117, 119, 135, 118, 57, 135, 114, 53, 135, 135, 49, 113, 113, 115, 135, 137, 129, 9, 138, 130, 17, 139, 131, 25, 140, 132, 33, 141, 133, 41, 142, 134, 49, 143, 135, 57, 1, 129, 136, 143, 136, 137, 137, 138, 139, 139, 140, 141, 141, 142, 143, 143, 137, 139, 0, 2, 144, 144, 6, 7, 7, 64, 144, 145, 2, 3, 3, 124, 145, 60, 62, 145, 8, 10, 146, 146, 14, 15, 15, 72, 146, 144, 10, 11, 11, 68, 144, 4, 6, 144, 16, 18, 147, 147, 22, 23, 23, 80, 147, 146, 18, 19, 19, 76, 146, 12, 14, 146, 24, 26, 148, 148, 30, 31, 31, 88, 148, 147, 26, 27, 27, 84, 147, 20, 22, 147, 32, 34, 149, 149, 38, 39, 39, 96, 149, 148, 34, 35, 35, 92, 148, 28, 30, 148, 40, 42, 150, 150, 46, 47, 47, 104, 150, 149, 42, 43, 43, 100, 149, 36, 38, 149, 48, 50, 151, 151, 54, 55, 55, 112, 151, 150, 50, 51, 51, 108, 150, 44, 46, 150, 56, 58, 145, 145, 62, 63, 63, 120, 145, 151, 58, 59, 59, 116, 151, 52, 54, 151, 145, 152, 144, 144, 152, 146, 146, 152, 147, 147, 152, 148, 148, 152, 149, 149, 152, 150, 150, 152, 151, 151, 152, 145];

    BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;

    var polygon = new BABYLON.Mesh(name, scene);
    vertexData.applyToMesh(polygon);
    polygon.convertToFlatShadedMesh();

    return polygon;
  };


  engine.loadingUIText = "Please be patient,textures are around 12 Mb...";
  engine.displayLoadingUI();

  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();

  var cameraAlpha = -Math.PI / 2;
  var cameraBeta = 1.3;
  var camera = new BABYLON.ArcRotateCamera("camera1", cameraAlpha, cameraBeta, 5, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  var exposure = 0.6;
  var contrast = 1.6;

  var hdrTexture = new BABYLON.HDRCubeTexture("textures/room.hdr", scene, 512);
  var hdrTextureSkyBox = hdrTexture.clone();
  hdrTextureSkyBox.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

  var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 100.0, scene);
  var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
  hdrSkyboxMaterial.backFaceCulling = false;
  hdrSkyboxMaterial.reflectionTexture = hdrTextureSkyBox
  hdrSkyboxMaterial.microSurface = 1.0;
  hdrSkyboxMaterial.cameraExposure = exposure;
  hdrSkyboxMaterial.cameraContrast = contrast;
  hdrSkyboxMaterial.disableLighting = true;
  hdrSkybox.material = hdrSkyboxMaterial;
  hdrSkybox.infiniteDistance = true;

  var insideGlassNoBounce = new BABYLON.PBRMaterial("insideGlass", scene);
  insideGlassNoBounce.reflectionTexture = hdrTexture;
  insideGlassNoBounce.refractionTexture = hdrTexture;
  insideGlassNoBounce.linkRefractionWithTransparency = true;
  insideGlassNoBounce.indexOfRefraction = 0.92;
  insideGlassNoBounce.alpha = 0.05;
  insideGlassNoBounce.microSurface = 1;
  insideGlassNoBounce.reflectivityColor = new BABYLON.Color3(0.3, 0.3, 0.3);
  insideGlassNoBounce.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
  insideGlassNoBounce.backFaceCulling = false;

  var diamondForProbes = createPolyhedron();
  diamondForProbes.scaling = new BABYLON.Vector3(500, 500, 500);
  var normals = diamondForProbes.getVerticesData(BABYLON.VertexBuffer.NormalKind);
  for (var i = 0; i < normals.length; i++) {
    normals[i] *= -1;
  }
  diamondForProbes.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  diamondForProbes.material = insideGlassNoBounce;

  var probeReversed = new BABYLON.ReflectionProbe("probeReversed", 1024, scene);
  probeReversed.renderList.push(diamondForProbes);
  probeReversed.position = BABYLON.Vector3.Zero();
  probeReversed.invertYAxis = true;

  var probe = new BABYLON.ReflectionProbe("probe", 1024, scene);
  probe.renderList.push(diamondForProbes);
  probe.position = BABYLON.Vector3.Zero();

  var glassOutside = new BABYLON.PBRMaterial("glassOutside", scene);
  glassOutside.environmentIntensity = 1.4;
  glassOutside.reflectionTexture = hdrTexture;
  glassOutside.refractionTexture = probeReversed.cubeTexture;
  glassOutside.linkRefractionWithTransparency = false;
  glassOutside.indexOfRefraction = 0.52;
  glassOutside.alpha = 0;
  glassOutside.alphaMode = BABYLON.Engine.ALPHA_ADD;
  glassOutside.cameraExposure = exposure;
  glassOutside.cameraContrast = contrast;
  glassOutside.microSurface = 1;
  glassOutside.useRadianceOverAlpha = true;
  glassOutside.reflectivityColor = new BABYLON.Color3(0.6, 0.6, 0.6);
  glassOutside.albedoColor = new BABYLON.Color3(0.35, 0.35, 0.35);

  var diamondOutside = createPolyhedron();
  diamondOutside.material = glassOutside;

  var glassInside = glassOutside.clone();
  glassInside.environmentIntensity = 0.7;
  glassInside.reflectionTexture = probe.cubeTexture;
  glassInside.refractionTexture = hdrTexture;
  glassInside.reflectivityColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  glassInside.albedoColor = new BABYLON.Color3(1, 1, 1);
  glassInside.indexOfRefraction = 0.92;
  glassInside.linkRefractionWithTransparency = true;


  var diamondInside = createPolyhedron();
  normals = diamondInside.getVerticesData(BABYLON.VertexBuffer.NormalKind);
  for (var i = 0; i < normals.length; i++) {
    normals[i] *= -1;
  }
  diamondInside.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
  diamondInside.material = glassInside;

  diamondInside.onBeforeDraw = function() {
    engine.setState(true, 0, false, true);
  };
  diamondInside.onAfterDraw = function() {
    engine.setState(true, 0, false, false);
  };

  var setEnabled = function(enabled) {
    diamondInside.setEnabled(enabled);
    diamondOutside.setEnabled(enabled);
    diamondForProbes.setEnabled(enabled);
    hdrSkybox.setEnabled(enabled);
  }

  var initialized = false;
  setEnabled(initialized);

  scene.beforeRender = function() {
    if (!initialized && hdrTextureSkyBox.isReady() && hdrTexture.isReady()) {
      initialized = true;
      setEnabled(initialized);
      setTimeout(function() {
        probeReversed.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        probe.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
        setTimeout(function() {
          diamondForProbes.setEnabled(false);
          diamondInside.freezeWorldMatrix();
          diamondOutside.freezeWorldMatrix();
          hdrSkybox.freezeWorldMatrix();
          glassInside.freeze();
          glassOutside.freeze();
          hdrSkyboxMaterial.freeze();
          engine.hideLoadingUI();
        }, 500);
      }, 1000);
    }
  };

  var bgCamera = new BABYLON.ArcRotateCamera("camera1", cameraAlpha, cameraBeta, 5, new BABYLON.Vector3(0, 0, 0), scene);
  bgCamera.attachControl(canvas, false);
  scene.onAfterRenderObservable.add(function() {
    bgCamera.update();
  });

  var postProcess1 = new BABYLON.BlurPostProcess("Horizontal blur", new BABYLON.Vector2(1.0, 0), 1, 1 / 2, bgCamera);
  var postProcess2 = new BABYLON.BlurPostProcess("Vertical blur", new BABYLON.Vector2(0, 1.0), 1, 1, bgCamera);

  var renderTargetTexture = new BABYLON.RenderTargetTexture("background", 64, scene);
  renderTargetTexture.renderList.push(diamondOutside);
  renderTargetTexture.activeCamera = bgCamera;
  scene.customRenderTargets.push(renderTargetTexture);

  var vertices = [];
  vertices.push(1, 1);
  vertices.push(-1, 1);
  vertices.push(-1, -1);
  vertices.push(1, -1);
  var positionKind = BABYLON.VertexBuffer.PositionKind;
  var vertexBuffer = new BABYLON.VertexBuffer(engine, vertices, positionKind, false, false, 2);
  var vertexBuffers = {
    "position": vertexBuffer
  };

  var indices = [];
  indices.push(0);
  indices.push(1);
  indices.push(2);
  indices.push(0);
  indices.push(2);
  indices.push(3);

  var indexBuffer = engine.createIndexBuffer(indices);
  var glowMapMergeEffect = engine.createEffect("glowMapMerge", [positionKind],
    ["offset"], ["textureSampler"], "");

  scene.afterRender = function() {
    if (!glowMapMergeEffect.isReady() || !renderTargetTexture.isReady()) {
      return;
    }
    engine.enableEffect(glowMapMergeEffect);
    engine.setState(false);

    var previousAlphaMode = engine.getAlphaMode();

    glowMapMergeEffect.setTexture("textureSampler", renderTargetTexture);
    glowMapMergeEffect.setFloat("offset", 0);

    engine.bindBuffers(vertexBuffers, indexBuffer, glowMapMergeEffect);
    engine.setAlphaMode(BABYLON.Engine.ALPHA_ADD);
    engine.draw(true, 0, 6);
    engine.setAlphaMode(previousAlphaMode);
  }



  return scene;
};
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