import { Vec2 } from "../types";




export const manhattanDist = (a: Vec2, b: Vec2) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export const euclideanDist = (a: Vec2, b: Vec2) => {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}