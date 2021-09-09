import { gltfStructure } from "./gltf";

export class GLTFImporter {

    /**
     * 
     * @param source - The model file location as a string
     * @returns An object containing the parsed gltf scene structure and the buffer containing the model data
     */
    public static async loadModel(source: string): Promise<{scene: gltfStructure, buffer: ArrayBuffer}> {
        const scene = await GLTFImporter.readJson(source);
        const buffer = await this.loadBuffers(scene);

        return {scene, buffer};
    }

    private static async readJson(source: string): Promise<gltfStructure>{
        const resp = await fetch(source);
        const scene = resp.json();
        return scene;
    }

    private static async loadBuffers(scene: gltfStructure): Promise<ArrayBuffer> {
        const buffers: ArrayBuffer[] = [];
        for (const buffer of scene.buffers) {
            const newBuffer = new ArrayBuffer(buffer.byteLength);
            
            if (buffer.uri.includes('data:application/octet-stream;base64')) {
                this.decodeBase64(buffer.uri.split(',')[1], newBuffer);
                buffers.push(newBuffer);
                continue;
            }
            
            if (buffer.uri.includes('.bin')) {
                const newBuffer = await this.readBinary(buffer.uri);
                buffers.push(newBuffer);
            }
        }
        // For now assuming only a single buffer is used per file
        // maybe concatenate them if multiple in the future?
        return buffers[0];
    }

    private static decodeBase64(data: string, buffer: ArrayBuffer): void {
        const binaryString = atob(data);
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    }

    private static async readBinary(uri: string): Promise<ArrayBuffer> {
        const resp = await fetch('resources/' + uri);
        return await resp.arrayBuffer();
    }
}