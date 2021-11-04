import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Tile, HitBox, StateMachine, CameraComponent, Enemy, HealthBar, Cells, Mouse } from "./components";
import { CameraPositionSystem, ControlEnemySystem, ControlPlayerSystem, FollowMouseSystem, TempHealthSystem, UpdateVectorsSystem } from "./systems";

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
        .registerComponent(HealthBar)
        .registerComponent(Cells)
        .registerComponent(Mouse)

    world
        .registerSystem(ControlPlayerSystem)
        .registerSystem(UpdateVectorsSystem)
        .registerSystem(CameraPositionSystem)
        .registerSystem(ControlEnemySystem)
        .registerSystem(TempHealthSystem)
        .registerSystem(FollowMouseSystem)

    return world;
}