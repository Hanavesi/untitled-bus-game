import { gltfStructure } from "../util/gltf";

/**
 * 
 * @param source - The model file location as a string
 * @returns An object containing the parsed gltf scene structure and the buffer containing the model data
 */
export const loadModel =  async (source: string): Promise<{gltf: gltfStructure, buffers: ArrayBuffer[]}> => {
    const scene = await readJson(source);
    const buffers = await loadBuffers(scene);

    return {gltf: scene, buffers};
}

const readJson = async(source: string): Promise<gltfStructure> => {
    const resp = await fetch(source);
    const gltf = resp.json();
    return gltf;
}

const loadBuffers = async (gltf: gltfStructure): Promise<ArrayBuffer[]> => {
    const buffers: ArrayBuffer[] = [];
    for (const buffer of gltf.buffers) {
        const newBuffer = new ArrayBuffer(buffer.byteLength);
        
        if (buffer.uri.includes('data:application/octet-stream;base64')) {
            decodeBase64(buffer.uri.split(',')[1], newBuffer);
            buffers.push(newBuffer);
            continue;
        }
        
        if (buffer.uri.includes('.bin')) {
            const newBuffer = await readBinary(buffer.uri);
            buffers.push(newBuffer);
        }
    }

    return buffers;
}

const decodeBase64 = (data: string, buffer: ArrayBuffer): void  =>{
    const binaryString = atob(data);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
}

const readBinary = async (uri: string): Promise<ArrayBuffer> => {
    const resp = await fetch('resources/' + uri);
    return await resp.arrayBuffer();
}
