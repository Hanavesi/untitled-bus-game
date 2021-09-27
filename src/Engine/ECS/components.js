import { TagComponent, Component, Types } from "ecsy";

export class Playable extends TagComponent { }
export class Animated extends TagComponent { }

export class Object3D extends Component { }

Object3D.schema = {
    skin: { type: Types.Ref }
};

// TILE
export class Tile extends Component { }

Tile.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number },
    size: { type: Types.Number }
};

// Position component
export class Position extends Component { }

Position.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number }
}

export class Vectors extends Component { }

Vectors.schema = {
    direction: { type: Types.Ref },
    speed: { type: Types.Number },
    object: { type: Types.Ref }
};


export class Input extends Component { }

Input.schema = {
    state: { type: Types.Ref }
};