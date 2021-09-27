import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Tile, HitBox } from "./components";
import { MoveSystem, UpdateVectorsSystem } from "./systems";

export const initWorld = () => {
    const world = new World();

    world
        .registerComponent(Vectors)
        .registerComponent(Object3D)
        .registerComponent(Playable)
        .registerComponent(Input)
        .registerComponent(HitBox)
        .registerComponent(Tile)

    world
        .registerSystem(MoveSystem)
        .registerSystem(UpdateVectorsSystem)

    return world;
}