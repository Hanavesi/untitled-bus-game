import { FiniteStateMachine } from "../FSM";
import { SkinInstance } from "../SkinInstance";
import { Object3D, Playable, Vectors, HitBox, StateMachine, Enemy, HealthBar, Bullet, Gun, TimeToLive, Tile } from "../ECS/components";
import * as THREE from 'three';

export class EntityGenerator {
  constructor(modelManager, world, scene) {
    this.modelManager = modelManager;
    this.world = world;
    this.scene = scene;
  }

  createPlayer(position) {
    const object = new SkinInstance(this.modelManager.models['knight2'], this.scene);
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
    const entity = this.world.createEntity();
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(1, 0), speed: 5, velocity: new THREE.Vector2() })
      .addComponent(Object3D, { object: object })
      .addComponent(Playable)
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 3), offset: new THREE.Vector2(0, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(HealthBar, { max: 100, current: 100, bar: health })
      .addComponent(Gun, { barrel: barrel });
  }

  createSoldier(position) {
    const object = new SkinInstance(this.modelManager.models['soldier1'], this.scene);
    const barrel = object.moveRoot.getObjectByName('barrel');
    object.moveRoot.position.x = position.x;
    object.moveRoot.position.y = position.y;

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
    const entity = this.world.createEntity();
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(0, 0), speed: 2, velocity: new THREE.Vector2() })
      .addComponent(Object3D, { object: object })
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 3), offset: new THREE.Vector2(0, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(Enemy)
      .addComponent(Gun, { barrel: barrel });
  }

  createBullet(position, direction, speed) {
    const bulletMaterial = new THREE.SpriteMaterial({ color: 0x000000 });
    const bullet = new THREE.Sprite(bulletMaterial);
    bullet.scale.set(0.8, 0.8, 0.8);
    bullet.position.set(position.x, position.y, 1);
    this.scene.add(bullet);
    const entity = this.world.createEntity();
    entity
      .addComponent(Object3D, { object: { moveRoot: bullet } })
      .addComponent(Vectors, { direction: direction, speed: speed, velocity: direction.clone().multiplyScalar(speed) })
      .addComponent(HitBox, { size: new THREE.Vector2(0.3, 0.3), offset: new THREE.Vector2() })
      .addComponent(Bullet)
      .addComponent(TimeToLive, { age: 0, max: 1 });
  }

  createTile(tile, size) {
    this.scene.add(tile);
    const entity = this.world.createEntity();
    entity
      .addComponent(Object3D, { object: { moveRoot: tile } })
      .addComponent(HitBox, { size: new THREE.Vector2(size, size), offset: new THREE.Vector2() })
      .addComponent(Tile);
  }
}