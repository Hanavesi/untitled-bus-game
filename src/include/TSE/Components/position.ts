import { IComponent } from "../../util/ecs/component.h";
import { Entity } from "../../util/ecs/entity";
import { m4 } from "../../util/math";

export class PositionComponent implements IComponent {
    public Entity: Entity;
    public matrix: number[];

    Awake(): void {
        this.matrix = m4.identity();
    }

    Update(deltaTime: number): void {
        /**/
    }

}