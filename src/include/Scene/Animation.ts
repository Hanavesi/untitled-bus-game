interface Sampler {
    // check min/max from accessor?
    input: number;
    output: number;
    interpolation: "LINEAR" | "STEP" | "CUBICSPLINE";
}

interface AnimChannel {
    target: number;
    property: string;
    sampler: number;
}

export interface Animation {
    channels: AnimChannel[];
    samplers: Sampler[];
}