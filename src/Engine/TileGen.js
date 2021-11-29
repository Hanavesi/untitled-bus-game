import { TextureLoader, MeshLambertMaterial, Mesh, PlaneGeometry } from "three"

// size of one tile, 4 width, 4 height
const TILESIZE = 4;

/**
 * Generates a tilemap from the given map matrix.
 * @param {number[][]} map 
 * @returns an object containing a list of tile meshes
 * and the bounds of the generated map.
 */
export const mapToMeshes = (map) => {
    const loader = new TextureLoader();
    // map size, hight determined by how many objects in whole array
    const height = map.length;
    // width determined by how many variable in first array object
    const width = map[0].length;
    const meshes = [];

    let numSpawns = 0;

    // loops given map array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // fetches tile based on which case it is and loads it
            const tileSrc = idToSrc(map[y][x], 1 / (1 + numSpawns));
            const name = tileSrc.split('/')[1].split('.')[0];
            if (name === 'hole') {
                numSpawns++;
            }
            const material = new MeshLambertMaterial({
                map: loader.load(tileSrc)
            });
            const geometry = new PlaneGeometry(TILESIZE, TILESIZE);
            // Actual tile is made here with geometry and material as settings
            const mesh = new Mesh(geometry, material);

            // Give position for tile, each tile gets different cos of x and y
            mesh.position.set(-width * 2 + x * TILESIZE, height * 2 - y * TILESIZE, -1);
            // Naming the tile
            mesh.name = name;
            meshes.push(mesh);
        }
    }
    // returns meshes (created tilemap as array) and bounds for grid system
    return { meshes: meshes, bounds: { width: width * TILESIZE, height: height * TILESIZE, botLeft: { x: -width * 2, y: -height * 2 } } };
}

/**
 * returns the right image based on specific value in the map array
 * @param {number} id 
 * @returns image source file path.
 */
const idToSrc = (id, spawnRatio) => {
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
        // Case 0 is used for randomizing floor and bench tiles,
        // so every stage is different
        case 0:
            const rand = Math.random();
            if (rand < 0.8) {
                return "images/floor.png";
            };
            if (rand + spawnRatio > 1.24) {
                return "images/hole.png";
            }
            return "images/bench.png";

        default:
            return "images/floor.png";
    }
}