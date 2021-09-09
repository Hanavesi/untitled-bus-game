import { GLTFImporter } from "../Scene/GLTFImporter";
import { Scene } from "../Scene/Scene";
import { gl, GLUtilities } from "../util/GL";
import { m4 } from "../util/math";
import { Camera } from "./Camera";
import { Shader } from "./Shader";

interface Props  {
    width: number;
    height: number;
}

export class Engine {
    private canvas: HTMLCanvasElement | null;
    private shader: Shader;
    private camera: Camera;
    private uniformLocations: WebGLUniformLocation[] = [];
    private scene: Scene;
    private size: {width: number, height: number};

    private lastFrame = 0;

    public constructor(props: Props) {
        this.canvas = null;
        this.size = {
            width: props.width,
            height: props.height
        };
    }

    public resize(): void {
        if ( this.canvas !== undefined ) {
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;

            gl.viewport(0, 0, this.size.width, this.size.height);
        }
    }

    public start(): void {
        this.canvas = GLUtilities.initialize();
        this.scene = new Scene();
        const importer = new GLTFImporter();
        importer.importModel(this.scene, 'resources/dude.gltf').then(this.scene.setLoaded);
        this.camera = new Camera([0, 5, 5]);
        this.camera.setTarget([0, 0, 0]);
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0,0,0,1);
        this.loadShaders();
        this.uniformLocations.push(gl.getUniformLocation(this.shader.getProgram(), 'model'));
        this.uniformLocations.push(gl.getUniformLocation(this.shader.getProgram(), 'view'));
        this.uniformLocations.push(gl.getUniformLocation(this.shader.getProgram(), 'projection'));
        this.resize();
        this.loop(0);
    }

    private loop(now: number): void {
        gl.clear(gl.COLOR_BUFFER_BIT);

        const deltaTime = now - this.lastFrame;
        this.lastFrame = now;
        //console.log(deltaTime);

        this.shader.use();
        const projection = m4.perspective(this.camera.Zoom, this.canvas.width / this.canvas.height, 0.1, 100.0);
        const view = this.camera.getViewMatrix();
        const model = m4.identity();
        gl.uniformMatrix4fv(this.uniformLocations[0], false, model);
        gl.uniformMatrix4fv(this.uniformLocations[1], false, view);
        gl.uniformMatrix4fv(this.uniformLocations[2], false, projection);
        if (this.scene.checkLoaded()) {
            this.scene.draw(this.shader);
        }
        requestAnimationFrame(this.loop.bind( this ));
    }

    private loadShaders(): void {
        const vertexShaderSource = 
        `#version 300 es
        layout (location = 0) in vec3 aPos;
        layout (location = 1) in vec3 aNormal;
        layout (location = 2) in vec3 aTexCoord;

        uniform mat4 model;
        uniform mat4 local;
        uniform mat4 view;
        uniform mat4 projection;

        void main() {
            gl_Position = projection * view * model * local * vec4(aPos, 1.0);
        }`;

        const fragmentShaderSource = 
        `#version 300 es
        precision highp float;
        out vec4 fragColor;


        void main() {
            fragColor = vec4(1.0);    
        }`;

        this.shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
    }
}