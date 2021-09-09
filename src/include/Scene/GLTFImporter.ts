import { Mesh } from "./Mesh";
import { gltfStructure } from "../util/gltf";
import { AiNode } from "./AiNode";
import { loadModel } from "./GLTFLoader";
import { AssetData, Asset } from "./Asset";
import { gl } from "../util/GL";

export class GLTFImporter {
    private gltf: gltfStructure;
    private buffers: ArrayBuffer[];

    /**
     * 
     * @param asset 
     * @param URI 
     * @returns - a promise with the value true when the asset is loaded and added to the scene object
     */
    public async importModel(asset: Asset, URI: string): Promise<boolean> {
        const data = await loadModel(URI);
        this.gltf = data.gltf;
        this.buffers = data.buffers;

        // Expecting only a single scene per file for now
        const root = this.gltf.scenes[0].nodes[0];

        const assetData: AssetData = {
            root: this.parseNode(root),
            buffers: this.buffers
        };

        asset.addAsset(assetData);

        return true;
    }

    private parseNode(nodeID: number): AiNode {
        const currentNode = this.gltf.nodes[nodeID];
        const name = currentNode.name;
        const childIDs = currentNode.children;
        const meshID = currentNode.mesh;
        const skinID = currentNode.skin;
        const matrix = currentNode.matrix;
        const translation = currentNode.translation;
        const rotation = currentNode.rotation;
        const scale = currentNode.scale;

        let children: AiNode[] | undefined = undefined;

        if (childIDs !== undefined) {
            children = childIDs.map(id => this.parseNode(id));
        }

        // do stuff if node properties are not undefined
        const aiNode: AiNode = {
            ...(name !== undefined) && { name: name },
            ...(children !== undefined) && { children: children },
            ...(matrix !== undefined) && { matrix: matrix },
            ...(translation !== undefined) && { translation: translation },
            ...(rotation !== undefined) && { rotation: rotation },
            ...(scale !== undefined) && { scale: scale },
            ...(meshID !== undefined) && { mesh: this.parseMesh(meshID) },
            //...(skinID !== undefined) && { name: this.parseSkin(skinID) }
        }
        return aiNode;
    }

    private parseMesh(meshID: number): Mesh {
        const primitives = this.gltf.meshes[meshID].primitives.map(primitive => {
            const positionAccessorID = primitive.attributes.POSITION;
            const normalAccessorID = primitive.attributes.NORMAL;
            const texCoordAccessorID = primitive.attributes.TEXCOORD_0;
            const jointsAccessorID = primitive.attributes.JOINTS_0;
            const weightsAccessorID = primitive.attributes.WEIGHTS_0;

            const attributeAccessors = [
                this.gltf.accessors[positionAccessorID],
                this.gltf.accessors[normalAccessorID],
                ...(texCoordAccessorID !== undefined ? [this.gltf.accessors[texCoordAccessorID]] : []),
                ...(jointsAccessorID !== undefined ? [this.gltf.accessors[jointsAccessorID]] : []),
                ...(weightsAccessorID !== undefined ? [this.gltf.accessors[weightsAccessorID]] : [])
            ];

            // get buffers, byteOffsets and byteStrides
            const vertexData = attributeAccessors.map(accessor => {
                if (!accessor) return undefined;
                const bufferView = this.gltf.bufferViews[accessor.bufferView];
                const index = bufferView.buffer;
                const buffer = this.buffers[index];
                const byteOffset = bufferView.byteOffset + (accessor.byteOffset || 0);
                const byteStride = bufferView.byteStride || 0;
                const componentType = accessor.componentType;
                const type = accessor.type;

                return {
                    index,
                    buffer,
                    byteOffset,
                    byteStride,
                    componentType,
                    type
                };
            });

            const indexAccessor = this.gltf.accessors[primitive.indices];
            const indexBufferView = this.gltf.bufferViews[indexAccessor.bufferView];
            const indexByteOffset = indexBufferView.byteOffset + (indexAccessor.byteOffset || 0);
            // for now parsing as if index won't have byte stride
            const indexBuffer = this.buffers[indexBufferView.buffer].slice(indexByteOffset, indexByteOffset + indexBufferView.byteLength);

            const VAO = generateVAO(vertexData, indexBuffer);

            return { VAO, elementCount: indexAccessor.count };
        });

        return { primitives };
    }

    /*  private parseSkin(skinID: number): Skin {
 
     } */
}

const generateVAO = (
    vertexData: {
        index: number,
        buffer: ArrayBuffer,
        byteOffset: number,
        byteStride: number,
        componentType: number,
        type: string
    }[],
    indexBuffer: ArrayBuffer
): WebGLVertexArrayObject => {
    const VAO = gl.createVertexArray();
    const EBO = gl.createBuffer();

    // janky solution for preventing binding the same buffer multiple times
    const previousBuffers: number[] = [];
    gl.bindVertexArray(VAO);

    let VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

    vertexData.forEach((data, i) => {
        if (!previousBuffers.includes(data.index)) {
            VBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
            previousBuffers.push(data.index);
        }
        gl.enableVertexAttribArray(i);
        gl.bufferData(gl.ARRAY_BUFFER, data.buffer, gl.STATIC_DRAW);
        if (data.componentType === gl.UNSIGNED_BYTE) {
            gl.vertexAttribIPointer(i, typeToCount[data.type], data.componentType, data.byteStride, data.byteOffset);
        } else {
            gl.vertexAttribPointer(i, typeToCount[data.type], data.componentType, false, data.byteStride, data.byteOffset);
        }
    });

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer, gl.STATIC_DRAW);

    gl.bindVertexArray(undefined);

    return VAO;
}

const typeToCount: { [key: string]: number } = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT4: 16
}