import { Vectors, Object3D, Playable, Input, HitBox, StateMachine, CameraComponent, Enemy, Health, Cells, Mouse, Bullet, Gun, TimeToLive, Grid, Tile, Dead, Sleeping } from "./Components";
import { CameraPositionSystem, CleanUpSystem, CollisionSystem, ControlEnemySystem, ControlPlayerSystem, EnemySpawnerSystem, HealthSystem, SleepingSystem, TTLSystem, UpdateGridSystem, UpdateVectorsSystem } from "./Systems";

export const initWorld = (world) => {
  world
    .registerComponent(Vectors)
    .registerComponent(Object3D)
    .registerComponent(Playable)
    .registerComponent(Input)
    .registerComponent(HitBox)
    .registerComponent(StateMachine)
    .registerComponent(CameraComponent)
    .registerComponent(Enemy)
    .registerComponent(Health)
    .registerComponent(Cells)
    .registerComponent(Mouse)
    .registerComponent(Bullet)
    .registerComponent(Gun)
    .registerComponent(TimeToLive)
    .registerComponent(Grid)
    .registerComponent(Tile)
    .registerComponent(Dead)
    .registerComponent(Sleeping)

  world
    .registerSystem(SleepingSystem)
    .registerSystem(TTLSystem)
    .registerSystem(ControlPlayerSystem)
    .registerSystem(ControlEnemySystem)
    .registerSystem(UpdateGridSystem)
    .registerSystem(CollisionSystem)
    .registerSystem(UpdateVectorsSystem)
    .registerSystem(CameraPositionSystem)
    .registerSystem(CleanUpSystem)
    .registerSystem(EnemySpawnerSystem)
    .registerSystem(HealthSystem)
}