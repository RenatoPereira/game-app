import { Polyline, SVG } from "@svgdotjs/svg.js";
import { ring } from "honeycomb-grid";
import { createEffect, onCleanup } from "solid-js";
import { Tile } from "~/entities/tile.entity";
import { renderGrid, tileCanAttack, tileCanMove } from "~/libs/map.service";
import { aStar } from "abstract-astar";
import { Socket } from "socket.io-client";

type Props = {
  activeTurn: boolean;
  playerId: string;
  movementTurn: boolean;
  map: {
    width: number;
    height: number;
  };
  units: any;
  socket: Socket | null;
};

export const MapComponent = (props: Props) => {
  createEffect(() => {
    let grid: any;
    let canMove = false;
    let tileStart: Tile | null = null;
    let tileOver: Tile | null = null;
    let polylineRender: Polyline | null = null;
    let shortestPath: Tile[] | undefined;
    let distance = 0;

    const mapElement = document.getElementById("map");

    if (mapElement) {
      mapElement.innerHTML = "";
    }

    const draw = SVG().addTo("#map").size("100%", "100%");

    if (props.map) {
      const units = new Map<string, any>(props.units);

      grid = renderGrid(
        props.playerId,
        draw,
        props.map.width,
        props.map.height,
        units
      );

      if (props.activeTurn) {
        const mouseDownCallback = ({ offsetX, offsetY }: MouseEvent) => {
          const tile = grid.pointToHex(
            { x: offsetX, y: offsetY },
            { allowOutside: false }
          );

          if (
            !tile ||
            (props.movementTurn && tile?.unit?.state.distanceCanMove <= 0) ||
            (!props.movementTurn && !tile?.unit?.state.canAttack)
          )
            return;

          if (tile.unit && tile.unit.state.playerId === props.playerId) {
            canMove = true;
            tileStart = tile;
          } else {
            console.log("Empty tile:", tile);
            canMove = false;
            tileStart = null;
          }
        };

        const mouseMoveCallback = ({ offsetX, offsetY }: MouseEvent) => {
          if (tileStart && canMove) {
            const tile = grid.pointToHex(
              { x: offsetX, y: offsetY },
              { allowOutside: false }
            );

            if (!tile) return;

            if (!tileOver) {
              tileOver = tile;
            }

            if (tileOver && !tileOver.equals(tile)) {
              tileOver = tile;

              shortestPath = aStar<Tile>({
                start: tileStart!,
                goal: tile,
                estimateFromNodeToGoal: (t) => grid.distance(t, tile),
                neighborsAdjacentToNode: (center) =>
                  grid.traverse(ring({ radius: 1, center })).toArray(),
                actualCostToMove: (_, __, tile) => {
                  return tile.isPassable || tile.equals(tileOver!)
                    ? 1
                    : Infinity;
                },
              })?.slice(
                0,
                props.movementTurn
                  ? tileStart?.unit.state.distanceCanMove
                  : tileStart?.unit.unit.range
              );

              const path: any[] = [];

              grid.traverse(shortestPath ?? []).forEach((t: Tile) => {
                path.push([t.x, t.y]);
              });

              if (polylineRender) {
                polylineRender.plot(path);
              } else {
                polylineRender = draw
                  .polyline(path)
                  .fill("none")
                  .stroke({ width: 3, color: "#FFF" });
              }

              distance = path.length - 1;
            }
          }
        };

        const mouseUpCallback = ({ offsetX, offsetY }: MouseEvent) => {
          if (!tileStart) {
            if (polylineRender) {
              polylineRender.plot([]);
            }

            return;
          }

          const toTile = grid.pointToHex(
            { x: offsetX, y: offsetY },
            { allowOutside: false }
          );

          if (props.movementTurn && tileCanMove(tileStart, distance)) {
            props.socket?.emit("moveUnit", {
              from: { q: tileStart?.q, r: tileStart?.r },
              to: { q: toTile.q, r: toTile.r },
            });
          } else if (
            !props.movementTurn &&
            tileCanAttack(tileStart, distance)
          ) {
            props.socket?.emit("attackUnit", {
              from: { q: tileStart?.q, r: tileStart?.r },
              to: { q: toTile.q, r: toTile.r },
            });
          } else {
            console.log("Empty tile:", toTile);
          }

          if (polylineRender) {
            polylineRender.plot([]);
          }

          canMove = false;
          tileStart = null;
          distance = 0;
          shortestPath = undefined;
        };

        document.addEventListener("mousedown", mouseDownCallback);
        document.addEventListener("mousemove", mouseMoveCallback);
        document.addEventListener("mouseup", mouseUpCallback);

        onCleanup(() => {
          document.removeEventListener("mousedown", mouseDownCallback);
          document.removeEventListener("mousemove", mouseMoveCallback);
          document.removeEventListener("mouseup", mouseUpCallback);
        });
      }
    }
  });

  return <div id="map" class="w-full h-[780px] [&_g]:select-none"></div>;
};
