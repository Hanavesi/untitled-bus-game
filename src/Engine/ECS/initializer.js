import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Tile, HitBox, StateMachine, CameraComponent, Enemy, HealthBar, Bullet } from "./components";
import { CameraPositionSystem, ControlBulletSystem, ControlEnemySystem, ControlPlayerSystem, TempHealthSystem, UpdateVectorsSystem } from "./systems";

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
        .registerComponent(Bullet)

    world
        .registerSystem(ControlPlayerSystem)
        .registerSystem(UpdateVectorsSystem)
        .registerSystem(CameraPositionSystem)
        .registerSystem(ControlEnemySystem)
        .registerSystem(TempHealthSystem)
        .registerSystem(ControlBulletSystem)

    return world;
}