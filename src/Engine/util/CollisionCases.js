import { Bullet, Dead, Health } from "../ECS/components";

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