import { Bullet, Dead, Health } from "../ECS/Components";

/**
 * updates entities' statuses according to entity types
 * @param {*} entity1 
 * @param {*} entity2 
 * @returns boolean value on whether the collision should be resolved.
 */
export const checkCollisionCase = (entity1, entity2) => {
  if (entity1.hasComponent(Bullet)) {
    entity1.addComponent(Dead);

    if (entity2.hasComponent(Health)) {
      const health = entity2.getMutableComponent(Health);
      health.current -= 5;
    }

    return false;
  }



  return true;
}