### ECS
We are using ecsy to imlement an entity component system. It allows easier creation of components and systems and provides tools to query entities based on their components.

## Components
- playable
    - whether the entity is controlled bby user input or not
- playerState
    - keeps track of player character state
- npcState
    - keeps track of npc state
- object3D
    - threejs object data
- animated
    - whether the entity is animated or not
- animationsState
    - keeps track of the current animation state
- active
    - whether the current entity is active or not

## Systems
- Animator
    - in: [object3D, animated, animationState, active]
    - updates object3D based on animationState

- Renderer
    - in: [object3D, active] 
    - renders the entity based on object3D data

*in progress*