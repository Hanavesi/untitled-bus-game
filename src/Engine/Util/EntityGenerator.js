import { FiniteStateMachine } from "../FSM";
import { SkinInstance } from "../SkinInstance";
import { Object3D, Playable, Vectors, HitBox, StateMachine, Enemy, Health, Bullet, Gun, TimeToLive, Tile, Sleeping, SpawnPoint, AddHealth } from "../ECS/Components";
import * as THREE from 'three';

export class EntityGenerator {
  constructor(modelManager, scene) {
    this.modelManager = modelManager;
    this.scene = scene;
  }

  createPlayer(entity, position, currentHealth = 100) {
    const object = new SkinInstance(this.modelManager.models['knight'], this.scene);
    object.moveRoot.position.x = position.x;
    object.moveRoot.position.y = position.y;

    const healthBar = new THREE.Group();
    healthBar.position.y = 5;
    healthBar.position.z = 10;
    const healthMaterial = new THREE.SpriteMaterial({ color: 0x00ff00 });
    const health = new THREE.Sprite(healthMaterial);
    health.scale.set(5, 0.2, 1);
    health.position.z = 1;
    healthBar.add(health);

    const healthBaseMaterial = new THREE.SpriteMaterial({ color: 0xff0000 });
    const healthBase = new THREE.Sprite(healthBaseMaterial);
    healthBase.scale.set(5, 0.2, 1);
    healthBar.add(healthBase);

    object.moveRoot.add(healthBar);

    const palm = object.moveRoot.getObjectByName('Knight').children[0].skeleton.getBoneByName('PalmR');
    const uzi = this.modelManager.getModel('uzi');
    uzi.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / -2);
    uzi.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const barrel = uzi.getObjectByName('barrel');
    palm.add(uzi);

    const fsm = new FiniteStateMachine({
      idle: {
        enter: () => {
          object.setAnimation('Idle_swordRight');
        }
      },
      run: {
        enter: () => {
          object.setAnimation('Run_swordRight');
        }
      }
    }, 'idle');
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(1, 0), speed: 5, velocity: new THREE.Vector2() })
      .addComponent(Object3D, { object: object })
      .addComponent(Playable)
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 3), offset: new THREE.Vector2(0, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(Health, { max: 100, current: currentHealth, bar: health })
      .addComponent(Gun, { barrel: barrel, cooldown: 0.1, lastShot: 0 })
      .addComponent(Sleeping, { tts: 0.1, time: 0 });
  }

  createSoldier(entity, position, sleep = 0.3) {
    const object = new SkinInstance(this.modelManager.models['soldier'], this.scene);
    const barrel = object.moveRoot.getObjectByName('barrel');
    object.moveRoot.position.x = position.x;
    object.moveRoot.position.y = position.y;

    const healthBar = new THREE.Group();
    healthBar.position.y = 5;
    healthBar.position.z = 10;
    const healthMaterial = new THREE.SpriteMaterial({ color: 0x00ff00 });
    const health = new THREE.Sprite(healthMaterial);
    health.scale.set(5, 0.2, 1);
    health.position.z = 1;
    healthBar.add(health);

    const healthBaseMaterial = new THREE.SpriteMaterial({ color: 0xff0000 });
    const healthBase = new THREE.Sprite(healthBaseMaterial);
    healthBase.scale.set(5, 0.2, 1);
    healthBar.add(healthBase);

    object.moveRoot.add(healthBar);

    const fsm = new FiniteStateMachine({
      idle: {
        enter: () => {
          object.setAnimation('ArmatureAction');
        }
      },
      run: {
        enter: () => {
          object.setAnimation('ArmatureAction');
        }
      }
    }, 'idle');
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(0, 0), speed: 2, velocity: new THREE.Vector2() })
      .addComponent(Object3D, { object: object })
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 3), offset: new THREE.Vector2(0, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(Enemy)
      .addComponent(Health, { max: 100, current: 100, bar: health })
      .addComponent(Gun, { barrel: barrel, cooldown: 0.2, lastShot: 0 })
      .addComponent(Sleeping, { tts: sleep, time: 0 });
  }

  createBullet(entity, position, direction, speed, launchVelocity) {
    const dir = direction.clone().normalize();
    const vel = dir.clone().multiplyScalar(speed).add(launchVelocity);
    const angle = Math.atan2(dir.y, dir.x);
    const bulletMaterial = new THREE.SpriteMaterial({ color: 0xffaaaa, rotation: angle });
    const bullet = new THREE.Sprite(bulletMaterial);
    bullet.scale.set(0.8, 0.4, 1);
    bullet.position.set(position.x, position.y, 1);
    this.scene.add(bullet);
    entity
      .addComponent(Object3D, { object: { moveRoot: bullet } })
      .addComponent(Vectors, { direction: dir, speed: speed, velocity: vel })
      .addComponent(HitBox, { size: new THREE.Vector2(0.3, 0.3), offset: new THREE.Vector2() })
      .addComponent(Bullet)
      .addComponent(TimeToLive, { age: 0, max: 1.2 });
  }

  createTile(entity, tile, size, spawnPoint = false) {
    this.scene.add(tile);
    entity
      .addComponent(Object3D, { object: { moveRoot: tile } })
      .addComponent(HitBox, { size: new THREE.Vector2(size, size), offset: new THREE.Vector2() })
      .addComponent(Tile);
    if (spawnPoint) {
      entity.addComponent(SpawnPoint);
    };
    return entity;
  }

  createHealth(entity, position) {
    const healthMaterial = new THREE.SpriteMaterial({ color: 0xff0000 });
    const health = new THREE.Sprite(healthMaterial);
    health.scale.set(1.5, 1.5, 1);
    health.position.set(position.x, position.y, 1);
    this.scene.add(health);
    entity
      .addComponent(Object3D, { object: { moveRoot: health } })
      .addComponent(HitBox, { size: new THREE.Vector2(0.5, 0.5), offset: new THREE.Vector2() })
      .addComponent(AddHealth)
  }
}
