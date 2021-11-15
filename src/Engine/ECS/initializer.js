import { Vectors, Object3D, Playable, Input, HitBox, StateMachine, CameraComponent, Enemy, HealthBar, Cells, Mouse, Bullet, Gun, TimeToLive, Grid, Tile, Dead } from "./components";
import { CameraPositionSystem, CleanUpSystem, CollisionSystem, ControlEnemySystem, ControlPlayerSystem, TempHealthSystem, UpdateBulletsSystem, UpdateGridSystem, UpdateVectorsSystem } from "./systems";

export const initWorld = (world, entityGenerator) => {
    world
        .registerComponent(Vectors)
        .registerComponent(Object3D)
        .registerComponent(Playable)
        .registerComponent(Input)
        .registerComponent(HitBox)
        .registerComponent(StateMachine)
        .registerComponent(CameraComponent)
        .registerComponent(Enemy)
        .registerComponent(HealthBar)
        .registerComponent(Cells)
        .registerComponent(Mouse)
        .registerComponent(Bullet)
        .registerComponent(Gun)
        .registerComponent(TimeToLive)
        .registerComponent(Grid)
        .registerComponent(Tile)
        .registerComponent(Dead)

    world
        .registerSystem(ControlPlayerSystem)
        .registerSystem(ControlEnemySystem)
        .registerSystem(TempHealthSystem)
        /* .registerSystem(UpdateBulletsSystem) */
        .registerSystem(UpdateGridSystem)
        .registerSystem(CollisionSystem)
        .registerSystem(UpdateVectorsSystem)
        .registerSystem(CameraPositionSystem)
        .registerSystem(CleanUpSystem)
}