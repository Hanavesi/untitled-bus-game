// Row major notation used for matrices
export const m4 = {
    identity: function (): number[] {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    // returns an orthographic projection matrix
    // with bounds within -1 <-> 1 and center at 0
    // and Z growing towards the front
    orthographic: function (aspectRatio: number, near: number, far: number): number[] {
        const sub = far - near;
        const sum = far + near;
        return [
            2 / aspectRatio, 0, 0, 0,
            0, 2, 0, 0,
            0, 0, 2 / (sub), 0,
            0, 0, -(sum) / (sub), 1
        ];
    },

    perspective: function(fov: number, aspectRatio: number, near: number, far: number): number[] {
        const rad = fov / 180 * Math.PI;
        const f = Math.tan(Math.PI * 0.5 - 0.5 * rad);
        const rangeInv = 1.0 / (near - far);

        return [
            f / aspectRatio, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    },

    lookAt: function(cameraPosition: number[], target: number[], up: number[]): number[] {
        const zAxis = v3.normalize(v3.subtract(cameraPosition, target));
        const xAxis = v3.normalize(v3.cross(up, zAxis));
        const yAxis = v3.normalize(v3.cross(zAxis, xAxis));

        return [
            xAxis[0], xAxis[1], xAxis[2], 0,
            yAxis[0], yAxis[1], yAxis[2], 0,
            zAxis[0], zAxis[1], zAxis[2], 0,
            cameraPosition[0],
            cameraPosition[1],
            cameraPosition[2],
            1
        ];
    },

    translate: function(mat4: number[], tx: number, ty: number, tz: number): number[] {
        return m4.multiply(mat4, m4.translation(tx, ty, tz));
    },

    rotateByAngle: function(mat4: number[], angleDeg: number, rotAxis: number[]): number[] {
        return m4.multiply(mat4, m4.quatRotationByAngle(rotAxis, angleDeg));
    },

    rotate: function(mat4: number[], quat:[number, number, number, number]): number[] {
        return m4.multiply(mat4, m4.quatRotation(quat));
    },

    scale: function(mat4: number[], sx: number, sy: number, sz: number): number[] {
        return m4.multiply(mat4, m4.scaling(sx, sy, sz));
    },

    translation: function (tx: number, ty: number, tz: number): number[] {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    },

    scaling: function(sx: number, sy: number, sz: number): number[] {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1
        ];
    },

    quatRotationByAngle: function(axis: number[], angle: number): number[] {
        const rad = angle / 180 * Math.PI;
        const halfSin = Math.sin(rad / 2);
        const halfCos = Math.cos(rad / 2);

        const w = halfCos;
        const x = axis[0] * halfSin;
        const y = axis[1] * halfSin;
        const z = axis[2] * halfSin;

        const n = 1.0 / Math.sqrt(x*x + y*y + z*z + w*w);

        const qx = x*n;
        const qy = y*n;
        const qz = z*n;
        const qw = w*n;

        return  m4.quatRotation([qx, qy, qz, qw]);
    },

    quatRotation: function(quat: [number, number, number, number]): number[] {

        const [qx, qy, qz, qw] = quat;

        return [
            1.0 - 2.0*qy*qy - 2.0*qz*qz, 2.0*qx*qy - 2.0*qz*qw, 2.0*qx*qz + 2.0*qy*qw, 0.0,
            2.0*qx*qy + 2.0*qz*qw, 1.0 - 2.0*qx*qx - 2.0*qz*qz, 1.0*qy*qz - 2.0*qx*qw, 0.0,
            2.0*qx*qz - 2.0*qy*qw, 2.0*qy*qz + 2.0*qx*qw, 1.0 - 2.0*qx*qx - 2.0*qy*qy, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];
    },

    multiply: function (mat4a: number[], mat4b: number[]): number[] {
        const b00 = mat4b[0 * 4 + 0];
        const b01 = mat4b[0 * 4 + 1];
        const b02 = mat4b[0 * 4 + 2];
        const b03 = mat4b[0 * 4 + 3];
        const b10 = mat4b[1 * 4 + 0];
        const b11 = mat4b[1 * 4 + 1];
        const b12 = mat4b[1 * 4 + 2];
        const b13 = mat4b[1 * 4 + 3];
        const b20 = mat4b[2 * 4 + 0];
        const b21 = mat4b[2 * 4 + 1];
        const b22 = mat4b[2 * 4 + 2];
        const b23 = mat4b[2 * 4 + 3];
        const b30 = mat4b[3 * 4 + 0];
        const b31 = mat4b[3 * 4 + 1];
        const b32 = mat4b[3 * 4 + 2];
        const b33 = mat4b[3 * 4 + 3];
        const a00 = mat4a[0 * 4 + 0];
        const a01 = mat4a[0 * 4 + 1];
        const a02 = mat4a[0 * 4 + 2];
        const a03 = mat4a[0 * 4 + 3];
        const a10 = mat4a[1 * 4 + 0];
        const a11 = mat4a[1 * 4 + 1];
        const a12 = mat4a[1 * 4 + 2];
        const a13 = mat4a[1 * 4 + 3];
        const a20 = mat4a[2 * 4 + 0];
        const a21 = mat4a[2 * 4 + 1];
        const a22 = mat4a[2 * 4 + 2];
        const a23 = mat4a[2 * 4 + 3];
        const a30 = mat4a[3 * 4 + 0];
        const a31 = mat4a[3 * 4 + 1];
        const a32 = mat4a[3 * 4 + 2];
        const a33 = mat4a[3 * 4 + 3];

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    inverse: function(matrix4: number[]): number[] {
        const m00 = matrix4[0 * 4 + 0];
        const m01 = matrix4[0 * 4 + 1];
        const m02 = matrix4[0 * 4 + 2];
        const m03 = matrix4[0 * 4 + 3];
        const m10 = matrix4[1 * 4 + 0];
        const m11 = matrix4[1 * 4 + 1];
        const m12 = matrix4[1 * 4 + 2];
        const m13 = matrix4[1 * 4 + 3];
        const m20 = matrix4[2 * 4 + 0];
        const m21 = matrix4[2 * 4 + 1];
        const m22 = matrix4[2 * 4 + 2];
        const m23 = matrix4[2 * 4 + 3];
        const m30 = matrix4[3 * 4 + 0];
        const m31 = matrix4[3 * 4 + 1];
        const m32 = matrix4[3 * 4 + 2];
        const m33 = matrix4[3 * 4 + 3];
        const tmp_0  = m22 * m33;
        const tmp_1  = m32 * m23;
        const tmp_2  = m12 * m33;
        const tmp_3  = m32 * m13;
        const tmp_4  = m12 * m23;
        const tmp_5  = m22 * m13;
        const tmp_6  = m02 * m33;
        const tmp_7  = m32 * m03;
        const tmp_8  = m02 * m23;
        const tmp_9  = m22 * m03;
        const tmp_10 = m02 * m13;
        const tmp_11 = m12 * m03;
        const tmp_12 = m20 * m31;
        const tmp_13 = m30 * m21;
        const tmp_14 = m10 * m31;
        const tmp_15 = m30 * m11;
        const tmp_16 = m10 * m21;
        const tmp_17 = m20 * m11;
        const tmp_18 = m00 * m31;
        const tmp_19 = m30 * m01;
        const tmp_20 = m00 * m21;
        const tmp_21 = m20 * m01;
        const tmp_22 = m00 * m11;
        const tmp_23 = m10 * m01;
    
        const t0 =  (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
                    (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        const t1 =  (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
                    (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        const t2 =  (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
                    (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        const t3 =  (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
                    (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
    
        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    
        return [
          d * t0,
          d * t1,
          d * t2,
          d * t3,
          d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
               (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
          d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
               (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
          d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
               (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
          d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
               (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
          d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
               (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
          d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
               (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
          d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
               (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
          d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
               (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
          d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
               (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
          d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
               (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
          d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
               (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
          d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
               (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
        ];
      }
}

export const v3 = {
    cross: function(v1: number[], v2: number[]): number[] {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    },

    subtract: function(v1: number[], v2: number[]): number[] {
        return [v1[0]-v2[0], v1[1]-v2[1], v1[2]-v2[2]];
    },

    add: function(v1: number[], v2: number[]): number[] {
        return [v1[0]+v2[0], v1[1]+v2[1], v1[2]+v2[2]];
    },

    normalize: function(v: number[]): number[] {
        const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);

        if (len > 0.000001) {
            return [v[0] / len, v[1] / len, v[2] / len];
        }
        return [0, 0, 0];
    }
}