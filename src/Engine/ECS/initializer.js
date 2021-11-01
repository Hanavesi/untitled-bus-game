import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Tile, HitBox, StateMachine, CameraComponent, Enemy } from "./components";
import { CameraPositionSystem, ControlEnemySystem, ControlPlayerSystem, UpdateVectorsSystem } from "./systems";

export const initWorld = () => {
    const world = new World();

    world
        .registerComponent(Vectors)
        .registerComponent(Object3D)
        .registerComponent(Playable)
        .registerComponent(Input)
        .registerComponent(HitBox)
        .registerComponent(Tile)
        .registerComponent(StateMachine)
        .registerComponent(CameraComponent)
        .registerComponent(Enemy)

    world
        .registerSystem(ControlPlayerSystem)
        .registerSystem(UpdateVectorsSystem)
        .registerSystem(CameraPositionSystem)
        .registerSystem(ControlEnemySystem)

    return world;
}