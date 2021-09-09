export interface Mesh {
    primitives: {
        VAO: WebGLVertexArrayObject;
        elementCount: number;
    } [];
    // materials
    // morph targets and weights if I want to implement them
}