import { TagComponent, Component, Types } from "ecsy";

export class Playable extends TagComponent { }
export class Animated extends TagComponent { }
export class Enemy extends TagComponent { }
export class Bullet extends TagComponent { }
export class Tile extends TagComponent { }
export class Dead extends TagComponent { }

export class Object3D extends Component { }

Object3D.schema = {
    object: { type: Types.Ref }
};

export class CameraComponent extends Component { }

CameraComponent.schema = {
    camera: { type: Types.Ref }
}

export class Vectors extends Component { }

Vectors.schema = {
    direction: { type: Types.Ref },
    velocity: { type: Types.Ref },
    speed: { type: Types.Number },
    object: { type: Types.Ref }
};

export class Cells extends Component { }

Cells.schema = {
    cells: { type: Types.Ref }
}

export class Input extends Component { }

Input.schema = {
    state: { type: Types.Ref }
};

export class HitBox extends Component { }

HitBox.schema = {
    size: { type: Types.Ref },
    offset: { type: Types.Ref }
};

export class StateMachine extends Component { }

StateMachine.schema = {
    fsm: { type: Types.Ref }
};

export class HealthBar extends Component {}

HealthBar.schema = {
    bar: { type: Types.Ref },
    max: { type: Types.Number },
    current: { type: Types.Number }
}

export class Mouse extends Component { }

Mouse.schema = {
    pos: { type: Types.Ref }
}

export class Gun extends Component { }

Gun.schema = {
    barrel: { type: Types.Ref }
}

export class TimeToLive extends Component { }

TimeToLive.schema = {
    age: { type: Types.Number },
    max: { type: Types.Number }
}

export class Grid extends Component { }

Grid.schema = {
    cells: { type: Types.Ref },
    bounds: { type: Types.Ref }
}