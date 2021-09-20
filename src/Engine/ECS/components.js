import { TagComponent, Component, Types } from "ecsy";

export class Playable extends TagComponent {}
export class Animated extends TagComponent {}

export class Object3D extends Component {}

Object3D.schema = {
    object: { type: Types.Ref }
};

export class Vectors extends Component {}

Vectors.schema = {
    direction: { type: Types.Ref },
    speed: { type: Types.Number }
};


export class Input extends Component {}

Input.schema = {
    state: { type: Types.Ref }
};