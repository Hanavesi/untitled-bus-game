import { Vector2 } from "three";

/*
	One-Size-Fits-All Rectangle Vs Rectangle Collisions
	"Stupid scanners... making me miss at archery..." - javidx9
	License (OLC-3)
	~~~~~~~~~~~~~~~
	Copyright 2018-2020 OneLoneCoder.com
	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions
	are met:
	1. Redistributions or derivations of source code must retain the above
	copyright notice, this list of conditions and the following disclaimer.
	2. Redistributions or derivative works in binary form must reproduce
	the above copyright notice. This list of conditions and the following
	disclaimer must be reproduced in the documentation and/or other
	materials provided with the distribution.
	3. Neither the name of the copyright holder nor the names of its
	contributors may be used to endorse or promote products derived
	from this software without specific prior written permission.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	Relevant Video: https://www.youtube.com/watch?v=8JJ-4JgR7Dg
	Links
	~~~~~
	YouTube:	https://www.youtube.com/javidx9
				https://www.youtube.com/javidx9extra
	Discord:	https://discord.gg/WhwHUMV
	Twitter:	https://www.twitter.com/javidx9
	Twitch:		https://www.twitch.tv/javidx9
	GitHub:		https://www.github.com/onelonecoder
	Patreon:	https://www.patreon.com/javidx9
	Homepage:	https://www.onelonecoder.com
	Community Blog: https://community.onelonecoder.com
	Author
	~~~~~~
	David Barr, aka javidx9, ©OneLoneCoder 2018, 2019, 2020
*/
// https://github.com/OneLoneCoder/olcPixelGameEngine/blob/master/Videos/OneLoneCoder_PGE_Rectangles.cpp

/**
 * Returns whether point p is inside rect r.
 * @param {Vector2} p 
 * @param {{pos: Vector2, size: Vector2}} r 
 * @returns boolean
 */
export const PointToRect = (p, r) => {
    return (p.x >= r.pos.x && p.y >= r.pos.y && p.x < r.pos.x + r.size.x && p.y < r.pos.y + r.size.y);
}

/**
 * 
 * @param {{pos: Vector2, size: Vector2}}} r1 
 * @param {{pos: Vector2, size: Vector2}}} r2 
 * @returns true if given rectangles overlap
 */
export const RectToRect = (r1, r2) => {
    return (r1.pos.x < r2.pos.x + r2.size.x && r1.pos.x +r1.size.x > r2.pos.x && r1.pos.y < r2.pos.y + r2.size.y && r1.pos.y + r1.size.y > r2.pos.y);
}

/**
 * 
 * @param {Vector2} rayOrigin 
 * @param {Vector2} rayDir 
 * @param {{pos: Vector2, size: Vector2}} target 
 * @param {{contactNormal: Vector2, contactPoint: Vector2, tHitNear: number}} contactInfo 
 * @returns If the specified ray intersects the target rectangle and modifies the contactInfo object.
 */
export const RayToRect = (rayOrigin, rayDir, target, contactInfo) => {
    const contactNormal = new Vector2();
    const contactPoint = new Vector2();
    let tHitNear;

    const invDir = new Vector2(1 / rayDir.x, 1 / rayDir.y);

    const tNear = new Vector2((target.pos.x - rayOrigin.x) * invDir.x, (target.pos.y - rayOrigin.y) * invDir.y);
    const tFar = new Vector2((target.pos.x + target.size.x - rayOrigin.x) * invDir.x, (target.pos.y + target.size.y - rayOrigin.y) * invDir.y);

    if (isNaN(tNear.x) || isNaN(tNear.y) || isNaN(tFar.x) || isNaN(tFar.y)) return false;

    if (tNear.x > tFar.x) [tNear.x, tFar.x] = [ tFar.x, tNear.x];
    if (tNear.y > tFar.y) [tNear.y, tFar.y] = [ tFar.y, tNear.y];

    if (tNear.x > tFar.y || tNear.y > tFar.x) return false;

    tHitNear = Math.max(tNear.x, tNear.y);

    const tHitFar = Math.min(tFar.x, tFar.y);

    if (tHitFar < 0) return false;

    contactPoint.add(rayOrigin).add(new Vector2().add(rayDir).multiplyScalar(tHitNear));

    if (tNear.x > tNear.y) {
        if (invDir.x < 0) {
            contactNormal.add(new Vector2(1, 0));
        } else {
            contactNormal.add(new Vector2(-1, 0));
        }
    } else if (tNear.x < tNear.y) {
        if (invDir.y < 0) {
            contactNormal.add(new Vector2(0, 1));
        } else {
            contactNormal.add(new Vector2(0, -1));
        }
    }

    contactInfo.contactNormal = contactNormal;
    contactInfo.contactPoint = contactPoint;
    contactInfo.tHitNear = tHitNear;
    return true;
}

/**
 * Checks whether a dynamic (moving) rectangle collides with a static rectangle and returns
 * collision data in contactInfo object. It contains the normal vector, the
 * contact point and the "time" of the collision.
 * @param {{pos: Vector2, size: Vector2}} dr dynamic rectangle that is moving
 * @param {Vector2} vel dynamic rectangle's velocity
 * @param {number} delta delta time
 * @param {{pos: Vector2, size: Vector2}} sr static rectangle
 * @param {{contactNormal: Vector2, contactPoint: Vector2, tHitNear: number}} contactInfo 
 * @returns true when colliding and modifies provided contactInfo object with collison data.
 */
export const DynamicRectToRect = (dr, vel, delta, sr, contactInfo) => {
    if (vel.x === 0 && vel.y === 0) {
        return false;
    }
    const expandedTarget = {
        pos: new Vector2().addVectors(sr.pos.clone(), dr.size.clone().multiplyScalar(-0.5)),
        size: new Vector2().addVectors(sr.size.clone().multiplyScalar(0.01), dr.size)
    };

    if (RayToRect(new Vector2().addVectors(dr.pos, dr.size.clone().multiplyScalar(0.5)), vel.clone().multiplyScalar(delta), expandedTarget, contactInfo))
        return (contactInfo.tHitNear >= 0 && contactInfo.tHitNear <= 1);
    else
        return false;
}

/**
 * Resolves collision of a dynamic rectangle on a static rectangle and modifies the velocity vector as nevessary.
 * @param {{pos: Vector2, size: Vector2}} dr dynamic rectangle that is moving
 * @param {Vector2} vel dynamic rectangle's velocity
 * @param {number} delta delta time
 * @param {{pos: Vector2, size: Vector2}} sr static rectangle
 * @returns boolean on whether collision happens or not
 */
export const ResolveDynamicRectToRect = (dr, vel, delta, sr) => {
    const contactInfo = {contactNormal: null, contactPoint: null, tHitNear: null};
    if (DynamicRectToRect(dr, vel, delta, sr, contactInfo)) {
        vel.addVectors(vel, new Vector2(Math.abs(vel.x), Math.abs(vel.y)).multiply(contactInfo.contactNormal).multiplyScalar(1 - contactInfo.tHitNear));
        return true;
    }
    return false;
}