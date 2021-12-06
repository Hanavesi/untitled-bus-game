import { AddHealth, Bullet, Dead, Health, Playable, Tile } from "../ECS/Components";

/**
 * updates entities' statuses according to entity types
 * @param {*} entity1 
 * @param {*} entity2 
 * @returns boolean value on whether the collision should be resolved.
 */
export const checkCollisionCase = (entity1, entity2, world) => {
  if (entity1.hasComponent(Bullet)) {
    entity1.addComponent(Dead);

    if (entity2.hasComponent(Health)) {
      if (entity2.hasComponent(Playable)) {
        world.sounds.playSound("hurt")
      }
      const health = entity2.getMutableComponent(Health);
      health.current -= 5;
    }

    return false;
  }

  if (entity2.hasComponent(Playable)) {
    if (entity1.hasComponent(AddHealth)) {
      console.log('pelaaja entity2, healtti entity1');
      const health = entity2.getMutableComponent(Health);
      health.current += 20;
      if (health.current > 200) {
        health.current = 200;
      }
      console.log((health.current));
      entity1.addComponent(Dead)
      return false;
    }
  }
  return true;
}