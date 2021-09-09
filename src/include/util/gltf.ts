export interface gltfStructure {
    asset: {
        generator: string,
        version: string
    },

    scene: number,
    scenes: {
            name: string,
            nodes: number[]
    }[],

    nodes: {
        name?: string,
        children?: number[],
        mesh?: number,
        camera?: number,
        skin?: number,
        translation?: [number, number, number],
        rotation?: [number, number, number, number],
        scale?: [number, number, number],
        matrix?: number[]
    }[],

    cameras?: {
        name: string,
        type: string,
        perspective?: {
            aspectRatio: number,
            yfov: number,
            zfar: number,
            znear: number
        },
        orthographic?: {
            xmag: number,
            ymag: number,
            zfar: number,
            znear: number
        }
    }[],

    materials?: {
        name?: string,
        doubleSided?: boolean,
        pbrMetallicRoughness?: {
            baseColorFactor: number[],
            baseColorTexture?: {
                index: number,
                texCoord: number
            },
            metallicFactor: number,
            roughnessFactor: number,
            metallicRoughnessTexture?: {
                index: number,
                texcoord: number
            }
        },
        normalTexture?: {
            scale: number,
            index: number,
            texCoord: number
        },
        occlusionTexture?: {
            strength: number,
            index: number,
            texCoord: number
        },
        emissiveTexture?: {
            index: number,
            texCoord: number
        },
        emissiveFactor?: number[]
    }[],

    meshes?: {
        name?: string,
        primitives: {
            mode?: number,
            attributes: {
                POSITION: number,
                NORMAL: number,
                JOINTS_0?: number,
                WEIGHTS_0?: number,
                TEXCOORD_0?: number,
                TEXCOORD_1?: number,
                TEXCOORD_2?: number,
                TEXCOORD_3?: number
            },
            indices: number,
            material: number,
            VAO?: WebGLVertexArrayObject
        }[],
        targets?: {
            POSITION?: number,
            NORMAL?: number,
            TANGENT?: number
        }[],
        weights: number[]
    }[],

    buffers: {
        byteLength: number,
        uri: string
    }[],

    bufferViews: {
        buffer: number,
        byteOffset: number,
        byteLength: number,
        byteStride?: number,
        target?: number
    }[],

    accessors: {
        bufferView: number,
        byteOffset?: number,
        type: string,
        componentType: number,
        count: number,
        min?: number[],
        max?: number[],
        sparse?: {
            count: number,
            values: {
                bufferView: number,
                byteOffset?: number
            },
            indices: {
                bufferView: number,
                byteOffset?: number,
                componentType: number
            }
        }
    }[],

    textures?: {
        source: number,
        sampler: number
    }[],

    images?: {
        name?: string,
        uri?: string,
        bufferView?: number,
        mimeType?: string
    }[],

    samplers?: {
        magFilter: number,
        minFilter: number,
        wrapS?: number,
        wrapT?: number,
    }[],

    skins?: {
        name?: string,
        inverseBindMatrices: number,
        joints?: number[]
    }[],

    animations?: {
        name?: string,
        channels: {
            target: {
                node: number,
                path: string
            },
            sampler: number
        }[],
        samplers: {
            input: number,
            interpolation: string,
            output: number
        }[]
    }[]
}