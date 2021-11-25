import { System } from "ecsy";
import { Object3D, Playable, Vectors, Input, HitBox, StateMachine, CameraComponent, Enemy, Health, Mouse, Bullet, Gun, Grid, Tile, Dead, Level, Sleeping, TimeToLive } from "./Components";
import { Vector3, Vector2 } from "three";
import { DynamicRectToRect, ResolveDynamicRectToRect, getGridPosition } from "../Util/Collisions";
import { checkCollisionCase } from "../Util/CollisionCases";

const CELLSIZE = 12.1;

export class ControlPlayerSystem extends System {
  execute(delta) {
    const player = this.queries.entities.results[0];
    if (!player || player.hasComponent(Sleeping)) return;
    const inputState = this.queries.inputState.results[0].getComponent(Input).state;
    const mousePos = this.queries.mouse.results[0].getComponent(Mouse).pos;

    const object = player.getComponent(Object3D).object;
    const animRoot = object.animRoot;
    const vectors = player.getMutableComponent(Vectors);
    let newDir = new Vector2(0, 0);
    if (inputState.left.down) newDir.x -= 1;
    if (inputState.right.down) newDir.x += 1;
    if (inputState.up.down) newDir.y += 1;
    if (inputState.down.down) newDir.y -= 1;
    vectors.direction = newDir.normalize();
    vectors.velocity.add(vectors.direction.clone().multiplyScalar(vectors.speed));
    vectors.velocity.multiplyScalar(0.8);

    const normMouse = mousePos.clone().normalize();
    const angle = Math.atan2(normMouse.y, normMouse.x);
    const newAngle = angle + Math.PI / 2;
    animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), newAngle);
    animRoot.rotateOnWorldAxis(new Vector3(1, 0, 0), 0.8);

    const { x, y } = vectors.direction;
    const fsm = player.getComponent(StateMachine).fsm;
    if (x === 0 && y === 0) { // If standing still, look "down"
      if (fsm && fsm.state !== 'idle') {
        fsm.transition('idle');
      }
    } else {
      if (fsm && fsm.state !== 'run') {
        fsm.transition('run');
      }
    }

    const gun = player.getMutableComponent(Gun);
    gun.lastShot -= delta;
    if (gun.lastShot < 0) gun.lastShot = 0;

    if (inputState.leftMouse.down) {
      if (gun.lastShot <= 0) {
        gun.lastShot += gun.cooldown;

        const { barrel } = gun;
        const pos = new Vector3();
        const speed = 60;
        barrel.getWorldPosition(pos);
        const bulletEntity = this.world.createEntity();
        this.world.generator.createBullet(bulletEntity, pos, mousePos, speed, vectors.velocity);
        this.world.sounds.playSound('piu');
      }
    }
    // anim
    object.update(delta);

  }
}

ControlPlayerSystem.queries = {
  entities: { components: [Object3D, Vectors, Playable] },
  inputState: { components: [Input] },
  mouse: { components: [Mouse] }
}

export class HealthSystem extends System {
  execute() {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      const healthBar = entity.getMutableComponent(Health);
      const current = healthBar.current;
      const max = healthBar.max;
      const scale = (current / max);
      healthBar.bar.scale.set(scale * 5, 0.2, 1);
      healthBar.bar.position.x = (scale * 5 - 5) / 2;
      if (healthBar.current < 0) {
        healthBar.current = 0;
        entity.addComponent(Dead);
      };
    }
  }
}

HealthSystem.queries = {
  entities: { components: [Health] }
}

export class SleepingSystem extends System {
  execute() {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      const sleep = entity.getMutableComponent(Sleeping);
      sleep.time += 1;
      if (sleep.time > sleep.tts) {
        entity.removeComponent(Sleeping);
      }
    }
  }
}

SleepingSystem.queries = {
  entities: { components: [Sleeping] }
}

export class TTLSystem extends System {
  execute(delta) {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      const ttl = entity.getMutableComponent(TimeToLive);
      ttl.age += delta;
      if (ttl.age >= ttl.max) {
        if (!entity.hasComponent(Dead))
          entity.addComponent(Dead);
      }
    }
  }
}

TTLSystem.queries = {
  entities: { components: [TimeToLive] }
}

export class ControlEnemySystem extends System {
  execute(delta) {
    const player = this.queries.player.results[0];
    if (!player) return;

    const playerMoveRoot = player.getComponent(Object3D).object.moveRoot;
    const playerPos = new Vector2(playerMoveRoot.position.x, playerMoveRoot.position.y);
    const playerVectors = player.getComponent(Vectors);

    const enemies = this.queries.enemies.results;

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const enemyObject = enemy.getComponent(Object3D).object;
      const enemyMoveRoot = enemyObject.moveRoot;
      const enemyPos = new Vector2(enemyMoveRoot.position.x, enemyMoveRoot.position.y);
      const enemyToPlayer = new Vector2().addVectors(enemyPos.clone().negate(), playerPos);
      const distToPlayer = Math.sqrt(enemyToPlayer.x * enemyToPlayer.x + enemyToPlayer.y * enemyToPlayer.y);
      const dir = enemyToPlayer.clone().normalize();
      const vectors = enemy.getMutableComponent(Vectors);
      if (distToPlayer <= 2) {
        playerVectors.velocity.add(dir.multiplyScalar(30));
        vectors.velocity.add(dir.clone().negate().multiplyScalar(5));
      }
      vectors.direction = dir.clone();
      if (!enemy.hasComponent(Sleeping))
        vectors.velocity.add(vectors.direction.clone().multiplyScalar(vectors.speed));
      vectors.velocity.multiplyScalar(0.8);

      for (let j = 0; j < enemies.length; j++) {
        if (j === i) continue;
        const enemy2 = enemies[j];
        const enemy2Object = enemy2.getComponent(Object3D).object;
        const enemy2Vectors = enemy2.getMutableComponent(Vectors);
        const enemy2MoveRoot = enemy2Object.moveRoot;
        const enemy2Pos = new Vector2(enemy2MoveRoot.position.x, enemy2MoveRoot.position.y);
        const enemyToEnemy2 = new Vector2().addVectors(enemyPos.clone().negate(), enemy2Pos);
        const distToEnemy = Math.sqrt(enemyToEnemy2.x * enemyToEnemy2.x + enemyToEnemy2.y * enemyToEnemy2.y);
        enemyToEnemy2.normalize();
        if (distToEnemy <= 2) {
          enemy2Vectors.velocity.add(enemyToEnemy2.multiplyScalar(20));
        }
      }

      const { x, y } = vectors.direction;
      const animRoot = enemyObject.animRoot;
      const fsm = enemy.getComponent(StateMachine).fsm;
      if (x === 0 && y === 0) { // If standing still, look "down"
        if (fsm && fsm.state !== 'idle') {
          fsm.transition('idle');
        }
      } else {
        const angle = Math.atan2(x, -y);
        animRoot.setRotationFromAxisAngle(new Vector3(0, 1, 0), angle);
        animRoot.rotateOnWorldAxis(new Vector3(1, 0, 0), 0.8);
        if (fsm && fsm.state !== 'run') {
          fsm.transition('run');
        }
      }
      //console.log(timeToShoot);
      let waitTime;
      if (enemy.timeToShoot === undefined) {
        enemy.timeToShoot = 0;
      } else {
        enemy.timeToShoot += delta;
      }
      waitTime = 2;
      //console.log(enemy.timeToShoot);
      if (enemy.timeToShoot > waitTime) {
        const barrel = enemy.getComponent(Gun).barrel;
        const pos = new Vector3();
        barrel.getWorldPosition(pos);
        //console.log('2s menny');
        enemy.timeToShoot = 0;
        const speed = 15;
        //const pos = new Vector2(enemyMoveRoot.position.x, enemyMoveRoot.position.y);
        //barrel.getWorldPosition(pos);
        /* const dir = new Vector2(playerMoveRoot.position.x, playerMoveRoot.position.y);
        dir.normalize() */
        const bulletEntity = this.world.createEntity();
        this.world.generator.createBullet(bulletEntity, pos.add(new Vector3(0, -0.5, 0)), dir, speed, vectors.velocity);
      }
      // anim
      enemyObject.update(delta);
    }
  }
}

ControlEnemySystem.queries = {
  player: { components: [Playable] },
  enemies: { components: [Enemy, Object3D, Vectors] },
}

export class EnemySpawnerSystem extends System {

  execute() {
    const enemies = this.queries.enemies.results;
    const x = Math.ceil(Math.random() * 20) * (Math.round(Math.random()) ? 1 : -1);
    const y = Math.ceil(Math.random() * 10) * (Math.round(Math.random()) ? 1 : -1);

    /* if (enemies.length === 0) {
      let entity = this.world.createEntity();
      this.world.generator.createSoldier(entity, new Vector2(x, y));
    } */
  }
}

EnemySpawnerSystem.queries = {
  enemies: { components: [Enemy] },
}

export class CameraPositionSystem extends System {
  execute() {
    const player = this.queries.entities.results[0];
    if (!player) return;
    const camera = this.queries.camera.results[0].getMutableComponent(CameraComponent).camera;
    const moveRoot = player.getComponent(Object3D).object.moveRoot;
    camera.position.set(moveRoot.position.x, moveRoot.position.y, 20);
  }
}

CameraPositionSystem.queries = {
  entities: { components: [Playable] },
  camera: { components: [CameraComponent] }
}


export class UpdateGridSystem extends System {
  execute(delta) {
    const entities = this.queries.entities.results;
    const grid = this.queries.grid.results[0].getMutableComponent(Grid);

    const { cells, bounds } = grid;
    // empty the grid
    for (const colKey of Object.keys(cells)) {
      for (const cellKey of Object.keys(cells[colKey])) {
        cells[colKey][cellKey] = [];
      }
    }

    for (const entity of entities) {
      const object = entity.getComponent(Object3D).object;
      const moveRoot = object.moveRoot;

      // Entity HITBOX
      const hitbox = entity.getComponent(HitBox);

      let start, moveDelta, botLeft, topRight;

      start = new Vector2(moveRoot.position.x, moveRoot.position.y);
      const hitBoxVector = new Vector2(hitbox.size.x / 2, hitbox.size.y / 2);
      topRight = start.clone().add(hitBoxVector);
      botLeft = start.clone().sub(hitBoxVector);

      if (entity.hasComponent(Vectors)) {
        const vectors = entity.getComponent(Vectors);
        const vel = vectors.velocity;
        moveDelta = vel.clone().multiplyScalar(delta);

        if (moveDelta.x < 0) {
          botLeft.add(new Vector2(moveDelta.x, 0));
        } else {
          topRight.add(new Vector2(moveDelta.x, 0));
        }
        if (moveDelta.y < 0) {
          botLeft.add(new Vector2(0, moveDelta.y));
        } else {
          topRight.add(new Vector2(0, moveDelta.y));
        }
      }

      const botRight = new Vector2(topRight.x, botLeft.y);
      const topLeft = new Vector2(botLeft.x, topRight.y);
      const points = [botLeft, botRight, topLeft, topRight];

      const gridPositions = points.map(point => getGridPosition(bounds, point, CELLSIZE));

      gridPositions.forEach(pos => {
        if (!(pos.x in cells)) return;
        if (!(pos.y in cells[pos.x])) return;
        if (cells[pos.x][pos.y].indexOf(entity) < 0) {
          cells[pos.x][pos.y].push(entity);
        }
      });
    }
  }
}

UpdateGridSystem.queries = {
  entities: { components: [Object3D, HitBox] },
  grid: { components: [Grid] }
}

export class CollisionSystem extends System {
  execute(delta) {
    const cells = this.queries.grid.results[0].getComponent(Grid).cells;
    const collisionCache = [];
    const collisions = [];
    column: for (const colKey of Object.keys(cells)) {
      cell: for (const cellKey of Object.keys(cells[colKey])) {
        const cell = cells[colKey][cellKey];
        if (cell.length < 2) continue cell;
        cellEntities: for (let i = 0; i < cell.length; i++) {
          const entity1 = cell[i];
          const id1 = entity1.id;

          // skip when entity1 is a tile or is dead
          // so that only moving entities are checked
          if (entity1.hasComponent(Tile) || entity1.hasComponent(Dead)) continue cellEntities;

          collision: for (let j = 0; j < cell.length; j++) {
            if (i === j) continue collision;

            const entity2 = cell[j];
            const id2 = entity2.id;

            // if both are bullets, skip
            if (entity1.hasComponent(Bullet) && entity2.hasComponent(Bullet)) continue collision;
            if (entity2.hasComponent(Dead)) continue collision;

            // temp skip when target is not tile
            //if (!entity2.hasComponent(Tile)) continue collision;

            // check if this collision is already checked
            if (collisionCache.includes(`${id1}-${id2}`)) {
              //console.log('skipped');
            } else {

              collisionCache.push(`${id1}-${id2}`);
              collisionCache.push(`${id2}-${id1}`);
              // check collisions
              /* --- entity1 --- */
              const object1 = entity1.getComponent(Object3D).object;
              const moveRoot1 = object1.moveRoot;
              const hitbox1 = entity1.getComponent(HitBox);
              const vectors1 = entity1.getMutableComponent(Vectors);
              const vel1 = vectors1.velocity;
              const entity1X = moveRoot1.position.x - hitbox1.size.x / 2;
              const entity1Y = moveRoot1.position.y - hitbox1.size.y / 2;
              const r1 = { pos: new Vector2(entity1X, entity1Y).add(hitbox1.offset), size: hitbox1.size };

              /* --- entity2 --- */
              const object2 = entity2.getComponent(Object3D).object;
              const moveRoot2 = object2.moveRoot;
              const hitbox2 = entity2.getComponent(HitBox);
              // maybe do something in the future with this
              let vel2 = new Vector2();
              if (entity2.hasComponent(Vectors)) {
                const vectors2 = entity2.getMutableComponent(Vectors);
                vel2 = vectors2.velocity;
              }

              const entity2X = moveRoot2.position.x - hitbox2.size.x / 2;
              const entity2Y = moveRoot2.position.y - hitbox2.size.y / 2;
              const r2 = { pos: new Vector2(entity2X, entity2Y).add(hitbox2.offset), size: hitbox2.size };

              const contactInfo = { contactNormal: null, contactPoint: null, tHitNear: 0 };

              let collisionVelocity = vel1.clone().sub(vel2);
              if (DynamicRectToRect(r1, collisionVelocity, delta, r2, contactInfo)) {
                // always check collision case with bullet as entity1 to make checking easier
                let needsResolution;
                if (entity1.hasComponent(Bullet)) {
                  needsResolution = checkCollisionCase(entity1, entity2);
                } else {
                  needsResolution = checkCollisionCase(entity2, entity1);
                }
                if (!needsResolution) continue collision;
                collisions.push({ time: contactInfo.tHitNear, r1: r1, r2: r2, vel: vel1, vectors: vectors1 });
              }
            }
          }
        }
      }
    }

    // sort the collisions based on collision time
    collisions.sort((a, b) => a.time - b.time);
    // resolve the collisions in order
    for (const collision of collisions) {
      const { r1, r2, vel, vectors } = collision;
      ResolveDynamicRectToRect(r1, vel, delta, r2);
      vectors.velocity = vel.clone();
    }

  }
}

CollisionSystem.queries = {
  grid: { components: [Grid] }
}

export class UpdateVectorsSystem extends System {
  execute(delta) {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      const object = entity.getComponent(Object3D).object;
      const vectors = entity.getMutableComponent(Vectors);
      const moveRoot = object.moveRoot;
      const vel = vectors.velocity;
      moveRoot.translateX(vel.x * delta);
      moveRoot.translateY(vel.y * delta);
    }
  }
}


UpdateVectorsSystem.queries = {
  entities: { components: [Object3D, Vectors] }
}

export class CleanUpSystem extends System {
  execute() {
    const entities = this.queries.entities.results;
    for (const entity of entities) {
      if (entity.hasComponent(Object3D)) {
        const objectComponent = entity.getComponent(Object3D);
        const moveRoot = objectComponent.object.moveRoot
        if (entity.hasComponent(Bullet)) {
          moveRoot.geometry.dispose();
          moveRoot.material.dispose();
        }
        moveRoot.removeFromParent();
      }
      entity.removeAllComponents();
      entity.remove();
    }
  }
}

CleanUpSystem.queries = {
  entities: { components: [Dead] }
}