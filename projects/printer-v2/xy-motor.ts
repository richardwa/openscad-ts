import { union, difference, intersection, Vec3 } from "../../src/csg/base";
import { getCircularPoints, getDiamondPoints, getRectPoints, polyRound } from "../../src/csg/polyround";
import { circle, square, polygon, } from "../../src/csg/primitives";
import { cube, cylinder, sphere, ployhedron } from "../../src/csg/primitives";
import { ring } from "../utils";

const inf = 1000;

export const thickness: Vec3 = [3, 3, 4];
export const base_size: Vec3 = [43, 43, 43]; // inclusive of thickness
export const motor_size = 43;
const m5_sunken = cylinder({ d: 5, h: inf, center: true })
  .union(cylinder({ d: 10, h: inf }));

const smooth_rod = 8;

const side =
  polyRound({
    points: getRectPoints({ size: [base_size[1] - 10, base_size[2]] }),
    radii: [0, 0, 40, 0],
  }).extrude({ height: thickness[1], $fn: 30 })
    .difference(
      m5_sunken.translate([20, 10, 1]),
      cylinder({ d: smooth_rod, h: inf, center: true })
        .translate([motor_size / 2 - 10, 20 + smooth_rod / 2 + 4, 0]))
    .rotate([90, 0, 90]);

const mount = {
  hole: 22 + 1,
  screw_spacing: 31,
  screw_depth: 2,
  center: [motor_size / 2, motor_size / 2, 0] as Vec3
}

const m3_sunken = cylinder({ d: 3, h: inf, center: true })
  .union(cylinder({ d: 6, h: inf }));

const base = polyRound({
  points: getRectPoints({ size: [base_size[0], base_size[1]] }),
  radii: [10, 10, 10, 10],
}).extrude({ height: thickness[2], $fn: 30 })
  .difference(
    // center hole
    cylinder({ d: mount.hole, h: inf, center: true, $fn: 100 })
      .translate(mount.center),

    // mounting screws
    ...getRectPoints({ size: [mount.screw_spacing, mount.screw_spacing], center: true })
      .map(c => m3_sunken.translate([c[0] + mount.center[0], c[1] + mount.center[1], mount.screw_depth]))

  )
  .translate([-10, -10, 0]);

const rounding_box = polyRound({
  points: getRectPoints({ size: [inf, inf] }),
  radii: [3, 3, 3, 3],
}).extrude({ height: inf, $fn: 10 });

const res = base.union(
  rounding_box.intersection(
    side.union(
      side.mirror([-1, 1, 0])
    ).translate([0, 0, thickness[2]])
  )
).set({ $fn: 60 });

export const main = res;