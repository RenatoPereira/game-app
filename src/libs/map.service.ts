import { Polyline, Svg } from "@svgdotjs/svg.js";
import { Grid, Point, rectangle, ring } from "honeycomb-grid";
import { unitKey } from "./unit.service";
import { Tile } from "~/entities/tile.entity";
import { aStar } from "abstract-astar";

export const render = (draw: any, tile: Tile, playerId: string) => {
  let isMyUnit = tile.unit?.state.playerId === playerId;
  let fill = tile.isPassable ? "#333" : isMyUnit ? "#00B4D8" : "#C9184A";

  const polygon = draw
    .polygon(tile.corners.map(({ x, y }: Point) => `${x},${y}`).join(" "))
    .fill(fill)
    .stroke({ width: 1, color: "#999" });

  const text = draw
    .text(function (add: any) {
      if (tile.unit) {
        add.tspan(tile.unit?.unit.name).newLine();
        add
          .tspan(`${tile.unit?.unit.health}/${tile.unit?.state.health}`)
          .newLine();
      } else {
        add.tspan(`${tile.col},${tile.row}`);
      }
    })
    .font({
      size: tile.width * 0.2,
      anchor: "middle",
      "dominant-baseline": "top",
      color: tile.isPassable ? "#000" : "#fff",
    })
    .translate(tile.x, tile.y);

  return draw.group().add(polygon).add(text);
};

export const renderGrid = (
  playerId: string,
  draw: Svg,
  width: number,
  height: number,
  units: Map<string, any>
) => {
  const grid = new Grid(Tile, rectangle({ width, height }));

  grid.forEach((tile: Tile) => {
    tile.unit = units.get(unitKey(tile));
    // tile.svg = render(draw, tile, playerId)
  });

  return grid;
};

export const cleanGrid = (grid: Grid<Tile>) => {
  grid.forEach((tile: Tile) => {
    tile.unit = null;
  });
};

export const renderMovement = (grid: Grid<Tile>, from: Tile, to: Tile) => {
  const path: any[] = [];

  grid.traverse(getShortestPath(grid, from, to) ?? []).forEach((t: Tile) => {
    path.push([t.x, t.y]);
  });

  return path;
};

export const getShortestPath = (grid: Grid<Tile>, from: Tile, to: Tile) => {
  let path = aStar<Tile>({
    start: from!,
    goal: to,
    estimateFromNodeToGoal: (t) => grid.distance(t, to),
    neighborsAdjacentToNode: (center) =>
      grid.traverse(ring({ radius: 1, center })).toArray(),
    actualCostToMove: (_, __, tile) => {
      return tile.isPassable ? 1 : Infinity;
    },
  });

  if (from.unit) {
    path = path?.slice(0, from.unit.state.distanceCanMove + 1);
  }

  return path;
};

export const tileCanMove = (from: Tile, distance: number) => {
  return (
    distance > 0 && from?.unit && from?.unit.state.distanceCanMove >= distance
  );
};

export const tileCanAttack = (from: Tile, distance: number) => {
  return distance > 0 && from?.unit && from?.unit.unit.range >= distance;
};
