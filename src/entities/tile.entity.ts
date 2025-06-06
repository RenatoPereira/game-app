import { G } from "@svgdotjs/svg.js";
import { defineHex } from "honeycomb-grid";

export const TILE_DIMENSIONS = 40;

export class Tile extends defineHex({
  dimensions: TILE_DIMENSIONS,
  origin: "topLeft",
}) {
  svg!: G;
  unit!: any;

  get isPassable() {
    return !this.unit;
  }
}
