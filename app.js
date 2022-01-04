let vertexShaderSource =
    [
        "precision mediump float;",
        "",
        "attribute vec2 vertexPosition;",
        "attribute vec3 vertexColor;",
        "varying vec3 fragmentColor;",
        "",
        "void main() {",
        "    fragmentColor = vertexColor;",
        "    gl_Position = vec4(vertexPosition, 0.0, 1.0);",
        "}"
    ].join("\n")

let fragmentShaderSource =
    [
        "precision mediump float;",
        "",
        "varying vec3 fragmentColor;",
        "",
        "void main() {",
        "    gl_FragColor = vec4(fragmentColor, 1.0);",
        "}"
    ].join("\n");

let initDrawSurface = () => {
    console.log("Initializing draw surface")
    let canvas = document.getElementById("draw-surface")
    let gl = canvas.getContext("webgl")
    if (!gl) {
        console.log("Your browser does not support WebGL")
        return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    let vertexShader = gl.createShader(gl.VERTEX_SHADER)
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader", gl.getShaderInfoLog(vertexShader))
        return
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling fragment shader", gl.getShaderInfoLog(fragmentShader))
        return
    }

    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program", gl.getGetProgramInfoLog(program))
        return
    }

    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("Error validating program", gl.getGetProgramInfoLog(program))
        return
    }

    let triangleVertices =
        [ // X, Y, R, G, B
            0.0, 0.5, 1.0, 0.0, 0.0,
            -0.5, -0.5, 0.0, 1.0, 0.0,
            0.5, -0.5, 0.0, 0.0, 1.0
        ]

    let triangleVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

    let positionAttributeLocation = gl.getAttribLocation(program, "vertexPosition")
    let colorAttributeLocation = gl.getAttribLocation(program, "vertexColor")

    gl.vertexAttribPointer(
        positionAttributeLocation, // Attribute location,
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    )
    gl.vertexAttribPointer(
        colorAttributeLocation, // Attribute location,
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    )

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.enableVertexAttribArray(colorAttributeLocation)

    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}