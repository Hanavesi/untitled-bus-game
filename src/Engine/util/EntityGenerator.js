import { FiniteStateMachine } from "../FSM";
import { SkinInstance } from "../SkinInstance";
import { Object3D, Playable, Vectors, HitBox, StateMachine, Enemy, HealthBar } from "../ECS/components";
import * as THREE from 'three';
import { Vector3 } from "three";

export class EntityGenerator {
  constructor(modelManager, world, scene) {
    this.modelManager = modelManager;
    this.world = world;
    this.scene = scene;
  }

  createPlayer(position) {
    const skin = new SkinInstance(this.modelManager.models['knight2'], this.scene);
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

    const palm = skin.moveRoot.getObjectByName('Knight').children[0].skeleton.getBoneByName('PalmR');
    const uzi = this.modelManager.getModel('uzi');
    uzi.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI/-2);
    uzi.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 2);
    console.log(uzi.getObjectByName('barrel'))
    palm.add(uzi);

    const healthBaseMaterial = new THREE.SpriteMaterial({ color: 0xff0000 });
    const healthBase = new THREE.Sprite(healthBaseMaterial);
    healthBase.scale.set(5, 0.2, 1);
    healthBar.add(healthBase);

    skin.moveRoot.add(healthBar);

    const fsm = new FiniteStateMachine({
      idle: {
        enter: () => {
          skin.setAnimation('Idle_swordRight');
        }
      },
      run: {
        enter: () => {
          skin.setAnimation('Run_swordRight');
        }
      }
    }, 'idle');
    const entity = this.world.createEntity();
    entity
      .addComponent(Vectors, { direction: new THREE.Vector2(1, 0), speed: 8000, velocity: new THREE.Vector2(0, 0) })
      .addComponent(Object3D, { skin: skin })
      .addComponent(Playable)
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(HealthBar, { max: 100, current: 100, bar: health });
  }

  createSoldier(position) {
    const skin = new SkinInstance(this.modelManager.models['soldier1'], this.scene);
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
      .addComponent(Vectors, { direction: new THREE.Vector2(0, 0), speed: 3000, velocity: new THREE.Vector2(0, 0) })
      .addComponent(Object3D, { skin: skin })
      .addComponent(HitBox, { size: new THREE.Vector2(1.5, 1.5) })
      .addComponent(StateMachine, { fsm: fsm })
      .addComponent(Enemy);
  }
}