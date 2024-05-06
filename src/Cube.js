class Cube {
    // Constructor
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = 0;
    }

    // Render this shape
    // render() {
    //     // var xy = this.position;
    //     var rgba = this.color;
    //     // var size = this.size;

    //     // Pass the texture number
    //     gl.uniform1i(u_whichTexture, this.textureNum);
        
    //     // Pass the color of a point to u_FragColor variable
    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //     // Pass the matrix to u_ModelMatrix attribute
    //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
    //     // Front of the cube
    //     drawTriangle3DUV([0,0,0,  1,1,0,  1,0,0], [0,0, 1,1, 1,0]);
    //     drawTriangle3DUV([0,0,0,  0,1,0,  1,1,0], [0,0, 0,1, 1,1]);

    //     gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    //     // drawTriangle3D([0, 0, 0,  1, 1, 0,  1, 0, 0]);
    //     // drawTriangle3D([0, 0, 0,  0, 1, 0,  1, 1, 0]);

    //     // Top of the cube
    //     drawTriangle3DUV([0,1,0,  0,1,1,  1,1,1], [0,0, 0,1, 1,0]);
    //     drawTriangle3DUV([0,1,0,  1,1,1,  1,1,0], [0,0, 1,1, 1,0]);

    //     gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);


    //     // drawTriangle3D([0, 1, 0,  0, 1, 1,  1, 1, 1]);
    //     // drawTriangle3D([0, 1, 0,  1, 1, 1,  1, 1, 0]);

    //     // Right of the cube
    //     drawTriangle3D([1, 1, 0,  1, 1, 1,  1, 0, 1]);
    //     drawTriangle3D([1, 1, 0,  1, 0, 1,  1, 0, 0]);

    //     // Left of the cube
    //     drawTriangle3D([0, 1, 0,  0, 0, 1,  0, 1, 1]);
    //     drawTriangle3D([0, 1, 0,  0, 0, 0,  0, 0, 1]);

    //     // Bottom of the cube
    //     drawTriangle3D([0, 0, 0,  1, 0, 1,  1, 0, 0]);
    //     drawTriangle3D([0, 0, 0,  0, 0, 1,  1, 0, 1]);

    //     // Back of the cube
    //     drawTriangle3D([0, 0, 1,  1, 0, 1,  1, 1, 1]);
    //     drawTriangle3D([0, 0, 1,  1, 1, 1,  0, 1, 1]);
    // }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;
    
        // Set the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
    
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
        // Create a buffer for the vertex coordinates
        var vertBuff = gl.createBuffer();
        if (!vertBuff) {
            console.error('Failed to create the buffer object');
            return false;
        }
    
        // Bind the buffer to the ARRAY_BUFFER target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuff);
    
        // Front of the cube
        drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], vertBuff);
        drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], vertBuff);
    
        // Back of the cube
        drawTriangle3DUV([1,0,1, 1,1,1, 0,1,1], [1,0, 1,1, 0,1], vertBuff);
        drawTriangle3DUV([1,0,1, 0,1,1, 0,0,1], [1,0, 0,1, 0,0], vertBuff);
    
        // Right side of the cube
        drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [1,0, 1,1, 0,1], vertBuff);
        drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [1,0, 0,1, 0,0], vertBuff);
    
        // Left side of the cube
        drawTriangle3DUV([0,0,1, 0,1,1, 0,1,0], [1,0, 1,1, 0,1], vertBuff);
        drawTriangle3DUV([0,0,1, 0,1,0, 0,0,0], [1,0, 0,1, 0,0], vertBuff);
    
        // Bottom of the cube
        drawTriangle3DUV([1,0,0, 1,0,1, 0,0,1], [1,0, 1,1, 0,1], vertBuff);
        drawTriangle3DUV([1,0,0, 0,0,1, 0,0,0], [1,0, 0,1, 0,0], vertBuff);
    
        // Top of the cube
        drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [1,0, 1,1, 0,1], vertBuff);
        drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [1,0, 0,1, 0,0], vertBuff);
    }
    


    // renderfast() {
    //     var rgba = this.color;

    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //     var allverts = [];

    //     // Front of the cube
    //     allverts = allverts.concat( [0,0,0, 1,1,0, 1,0,0]);
    //     allverts = allverts.concat( [0,0,0, 0,1,0, 1,1,0]);

    //     // Top of the cube
    //     allverts = allverts.concat( [0,1,0, 0,1,1, 1,1,1]);
    //     allverts = allverts.concat( [0,1,0, 1,1,1, 1,1,0]);

    //     // Right of the cube
    //     allverts = allverts.concat( [1,1,0, 1,1,1, 1,0,0]);
    //     allverts = allverts.concat( [1,0,0, 1,1,1, 1,0,1]);

    //     // Left of the cube
    //     allverts = allverts.concat( [0,1,0, 0,1,1, 0,0,0]);
    //     allverts = allverts.concat( [0,0,0, 0,1,1, 0,0,1]);

    //     // Bottom of the cube
    //     allverts = allverts.concat( [0,0,0, 0,0,1, 1,0,1]);
    //     allverts = allverts.concat( [0,0,0, 1,0,1, 1,0,0]);

    //     // Back of the cube
    //     allverts = allverts.concat( [0,0,1, 1,1,1, 1,0,1]);
    //     allverts = allverts.concat( [0,0,1, 0,1,1, 1,1,1]);

    //     drawTriangle3D(allverts);
    // }

}
