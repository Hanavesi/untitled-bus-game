import { Entity } from "./entity";
import { IAwake, IUpdate } from "../lifecycle/lifecycle.h";

export interface IComponent extends IAwake, IUpdate {
    Entity: Entity | null
}