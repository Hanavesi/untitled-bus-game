import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Position, Tile } from "./components";
import { CollisionSystem, MoveSystem, UpdateVectorsSystem } from "./systems";

export const initWorld = () => {
    const world = new World();

    world
        .registerComponent(Vectors)
        .registerComponent(Object3D)
        .registerComponent(Playable)
        .registerComponent(Input)
        .registerComponent(Position)
        .registerComponent(Tile)

    world
        .registerSystem(MoveSystem)
        .registerSystem(UpdateVectorsSystem)
        .registerSystem(CollisionSystem)

    return world;
}