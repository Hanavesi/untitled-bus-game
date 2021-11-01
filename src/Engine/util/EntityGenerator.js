import { FiniteStateMachine } from "../FSM";
import { SkinInstance } from "../SkinInstance";
import { Input, Object3D, Playable, Vectors, HitBox, Tile, StateMachine, CameraComponent, Enemy, HealthBar } from "../ECS/components";
import * as THREE from 'three';

export class EntityGenerator {
  constructor(models, world, scene) {
    this.models = models;
    this.world = world;
    this.scene = scene;
  }

  createPlayer(position) {
    const skin = new SkinInstance(this.models['knight'], this.scene);
    skin.moveRoot.position.x = position.x;
    skin.moveRoot.position.y = position.y;

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

    skin.moveRoot.add(healthBar);

    const fsm = new FiniteStateMachine({
      idle: {
        enter: () => {
          skin.setAnimation('Idle');
        }
      },
      run: {
        enter: () => {
          skin.setAnimation('Run');
        }
      }
    }, 'idle');
    const entity = this.world.createEntity();
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(1, 0), speed: 20 })
      .addComponent(Object3D, { skin: skin })
      .addComponent(Playable)
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(HealthBar, { max: 100, current: 100, bar: health });
  }

  createSoldier(position) {
    const skin = new SkinInstance(this.models['soldier1'], this.scene);
    skin.moveRoot.position.x = position.x;
    skin.moveRoot.position.y = position.y;

    const fsm = new FiniteStateMachine({
      idle: {
        enter: () => {
          skin.setAnimation('ArmatureAction');
        }
      },
      run: {
        enter: () => {
          skin.setAnimation('ArmatureAction');
        }
      }
    }, 'idle');
    const entity = this.world.createEntity();
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(1, 0), speed: 3 })
      .addComponent(Object3D, { skin: skin })
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(Enemy);
  }
}