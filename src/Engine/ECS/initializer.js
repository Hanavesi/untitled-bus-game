import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Tile, HitBox } from "./components";
import { CollisionSystem, MoveSystem, UpdateVectorsSystem } from "./systems";

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
        .registerSystem(CollisionSystem)
        .registerSystem(UpdateVectorsSystem)

    return world;
}