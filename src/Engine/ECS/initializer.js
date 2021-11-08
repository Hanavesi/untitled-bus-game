import { World } from "ecsy";
import { Vectors, Object3D, Playable, Input, Tile, HitBox, StateMachine, CameraComponent, Enemy, HealthBar, Cells, Mouse, Bullet, EntityGeneratorComp, Gun, TimeToLive } from "./components";
import { CameraPositionSystem, ControlEnemySystem, ControlPlayerSystem, FollowMouseSystem, TempHealthSystem, UpdateBulletsSystem, UpdateVectorsSystem } from "./systems";

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
        .registerComponent(Bullet)
        .registerComponent(EntityGeneratorComp)
        .registerComponent(Gun)
        .registerComponent(TimeToLive)

    world
        .registerSystem(ControlPlayerSystem)
        .registerSystem(ControlEnemySystem)
        .registerSystem(TempHealthSystem)
        .registerSystem(UpdateBulletsSystem)
        .registerSystem(UpdateVectorsSystem)
        .registerSystem(CameraPositionSystem)

    return world;
}