import { Shader } from "../TSE/Shader";
import { gl } from "../util/GL";
import { m4 } from "../util/math";
import { AiNode } from "./AiNode";
import { Mesh } from "./Mesh";

export interface AssetData {
    root: AiNode;
    // Maybe don't need these buffers after implementing skinning and animations
    buffers: ArrayBuffer[];
    animations?: Animation[];
}

export class Asset {
    private assets: AssetData[] = [];
    private isLoaded = false;
    // Add shaders to scene or to engine?

    public setLoaded = (): void => {
        this.isLoaded = true;
    }

    public checkLoaded = (): boolean => {
        return this.isLoaded;
    }

    public addAsset = (asset: AssetData): void => {
        this.assets.push(asset);
    }

    public draw = (shader: Shader): void => {
        for (const asset of this.assets) {
            this.drawNode(shader, asset.root, m4.identity());
        }
    }

    private drawNode = (shader: Shader, node: AiNode, parentTransform: number[]): void => {
        const mesh = node.mesh || undefined;
        let localTransform = node.matrix || m4.identity();

        const translation = node.translation || [0, 0, 0];
        const rotation= node.rotation || [0, 0, 0, 0];
        const scale = node.scale || [1, 1, 1];
        localTransform = m4.translate(localTransform, ...translation);
        localTransform = m4.rotate(localTransform, rotation);
        localTransform = m4.scale(localTransform, ...scale);

        const transform = m4.multiply(parentTransform, localTransform);

        if (mesh !== undefined) {
            this.drawMesh(shader, mesh, transform);
        }

        const children = node.children;
        if (children !== undefined) {
            children.forEach(child => this.drawNode(shader, child, transform));
        }
    }

    private drawMesh = (shader: Shader, mesh: Mesh, transform: number[]): void => {
        gl.uniformMatrix4fv(gl.getUniformLocation(shader.getProgram(), 'local'), false, transform);
        mesh.primitives.forEach(primitive => {
            gl.bindVertexArray(primitive.VAO);
            gl.drawElements(gl.TRIANGLES, primitive.elementCount, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(undefined);
        });
    }
}
