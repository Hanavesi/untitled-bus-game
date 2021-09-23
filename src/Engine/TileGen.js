import { TextureLoader, MeshLambertMaterial, Mesh, PlaneGeometry } from "three"

export const mapToMeshes = (map) => {
    const loader = new TextureLoader();
    const height = map.length;
    const width = map[0].length;
    const meshes = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tileSrc = idToSrc(map[y][x]);
            const material = new MeshLambertMaterial({
                map: loader.load(tileSrc)
            });
            const geometry = new PlaneGeometry(4, 4);
            const mesh = new Mesh(geometry, material);
            mesh.position.set(-width * 2 + x*4, height*2 - y*4, -1);
            meshes.push(mesh);
        }
    }
    return meshes;
}

const idToSrc = (id) => {
    switch (id) {
        case 1:
            return "images/floor.png";
        case 2:
            return "images/wall.png";
        case 3:
            return "images/window.png";
        case 4:
            return "images/bench.png";
        case 5:
            return "images/door.png";
        case 6:
            return "images/back_window.png"
        case 7:
            return "images/rear_window.png"

        default:
            return "images/floor.png";
    }
}