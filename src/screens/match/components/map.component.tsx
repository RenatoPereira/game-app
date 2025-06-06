import { Accessor, createEffect, onCleanup } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { Socket } from "socket.io-client";
import { AxialCoordinates, Grid, rectangle } from "honeycomb-grid";
import { Tile } from "~/entities/tile.entity";
import {
  Application,
  Graphics,
  Container,
  FederatedPointerEvent,
  Sprite,
} from "pixi.js";
import {
  pointsToPath,
  renderDamage,
  renderUnit,
} from "~/libs/rendered.service";
import { cleanGrid, renderMovement } from "~/libs/map.service";
import { Unit } from "~/types/unit.type";
import { useUnitContext } from "../contexts/unit.hook";
import { GameStateUnit } from "~/types/match.type";
import { unitKey } from "~/libs/unit.service";

type Props = {
  socket: Accessor<Socket | null>;
};

export const MapMatch = (props: Props) => {
  let mapRef: HTMLDivElement | undefined;
  let grid: Grid<Tile> | undefined;

  const { state, setUnit } = useUnitContext();
  const { battle, map, turn, update } = useMatchContext();

  const app = new Application();
  const graphics = new Graphics();
  let unitsContainer: Container | undefined;

  let actionPath = new Graphics();
  let activeTile: Tile | undefined;
  let destTile: Tile | undefined;

  createEffect(() => {
    renderMap(battle.units, turn.moving);
  });

  const renderMap = async (
    units: Map<string, GameStateUnit>,
    turnMoving: boolean
  ) => {
    if (!mapRef || !battle.player || !battle.enemy) return;

    if (!app.ticker) {
      grid = new Grid(Tile, rectangle(map));

      mapRef.style.height = `${grid.pixelHeight}px`;
      mapRef.style.width = `${grid.pixelWidth}px`;

      await app.init({ backgroundAlpha: 0, resizeTo: mapRef });
      mapRef.appendChild(app.canvas);

      for await (const element of grid) {
        await renderHex(element);
      }

      app.stage.eventMode = "static";
      app.stage.hitArea = app.screen;

      app.stage.on("pointerup", onDragEnd);

      app.stage.addChild(graphics);
    } else {
      unitsContainer?.destroy({
        children: true,
      });
      app.stage.removeChild(unitsContainer!);
    }

    renderUnits(units, turnMoving);
  };

  const renderUnits = async (
    units: Map<string, GameStateUnit>,
    turnMoving: boolean
  ) => {
    unitsContainer = new Container();
    cleanGrid(grid!);

    for await (const key of units.keys()) {
      const position = key.split(",");

      const tile = grid?.getHex({
        q: Number(position[0]),
        r: Number(position[1]),
      });

      if (!tile) return;

      tile.unit = units.get(key);
      const { sprite, baseMovement, baseAttack } = await renderUnit(tile);

      const activePlayer = battle.isPlayer ? battle.player : battle.enemy;

      sprite.on("pointertap", onClick);

      if (
        battle.activeTurn &&
        activePlayer!.getId() === tile.unit.state.playerId
      ) {
        sprite.on("pointerdown", onDragStart);

        if (tile.unit.state.distanceCanMove > 0 && turnMoving) {
          unitsContainer.addChild(baseMovement);
        } else if (tile.unit.state.canAttack && !turnMoving) {
          unitsContainer.addChild(baseAttack);
        }
      }

      unitsContainer.addChild(sprite);
    }

    app.stage.addChildAt(unitsContainer, 1);
  };

  const renderHex = async (tile: Tile) => {
    const path = pointsToPath(tile.corners);

    graphics.poly(path);
    graphics.fill({ color: 0xffff00, alpha: 0.5 });
    graphics.stroke({
      width: 2,
      color: 0xffffff,
    });
  };

  function onDragStart(this: Sprite) {
    if (!grid) return;

    activeTile = grid.pointToHex(this.position, { allowOutside: false });

    if (turn.moving && activeTile?.unit?.state?.distanceCanMove > 0) {
      app.stage.on("pointermove", onDragMove);
    } else if (!turn.moving && activeTile?.unit?.state?.canAttack) {
      app.stage.on("pointermove", onDragAttack);
    }
  }

  const onDragMove = (e: FederatedPointerEvent) => {
    if (!grid || !activeTile) return;

    const destPosition = e.getLocalPosition(app.stage);
    const overTile = grid.pointToHex(destPosition, { allowOutside: false });

    if (!overTile || activeTile.equals(overTile)) {
      actionPath.clear();
      destTile = undefined;
      return;
    }

    const movementPath = renderMovement(grid, activeTile, overTile);

    if (movementPath.length > 1) {
      actionPath.clear();

      const firstHex = movementPath.shift();
      actionPath.moveTo(firstHex[0], firstHex[1]);

      movementPath.forEach((point: number[]) => {
        actionPath.lineTo(point[0], point[1]);
      });

      actionPath.stroke({ width: 2, color: 0x00b4d8, alpha: 0.7 });
      app.stage.addChild(actionPath);

      const lastPath = movementPath.pop();
      destTile = grid.pointToHex(
        { x: lastPath[0], y: lastPath[1] },
        { allowOutside: false }
      );
    }
  };

  const onDragAttack = (e: FederatedPointerEvent) => {
    if (!grid || !activeTile) return;

    const destPosition = e.getLocalPosition(app.stage);
    const overTile = grid.pointToHex(destPosition, { allowOutside: false });

    if (
      !overTile ||
      activeTile.equals(overTile) ||
      !activeTile.unit.state.canAttack
    ) {
      actionPath.clear();
      destTile = undefined;
      return;
    }

    const attackDistance = grid.distance(activeTile, overTile);

    if (activeTile.unit.unit.range >= attackDistance) {
      actionPath.clear();

      actionPath.moveTo(activeTile.x, activeTile.y);
      actionPath.lineTo(overTile.x, overTile.y);
      actionPath.stroke({ width: 2, color: 0xf01e2c, alpha: 0.7 });
      app.stage.addChild(actionPath);

      destTile = overTile;
    }
  };

  const onDragEnd = (e: FederatedPointerEvent) => {
    if (props.socket() && turn.moving && activeTile && destTile) {
      props.socket()?.emit("moveUnit", {
        from: { q: activeTile?.q, r: activeTile?.r },
        to: { q: destTile.q, r: destTile.r },
      });
    } else if (
      props.socket() &&
      !turn.moving &&
      activeTile &&
      activeTile.unit.state.canAttack &&
      destTile &&
      destTile.unit
    ) {
      props.socket()?.emit("attackUnit", {
        from: { q: activeTile?.q, r: activeTile?.r },
        to: { q: destTile.q, r: destTile.r },
      });
    }

    actionPath.clear();
    activeTile = undefined;
    destTile = undefined;
    app.stage.off("pointermove", onDragMove);
    app.stage.off("pointermove", onDragAttack);
  };

  function onClick(this: Sprite) {
    if (!grid) return;

    const tile = grid.pointToHex(this.position, { allowOutside: false });

    setUnit(tile!.unit);
  }

  const animateDamage = async (
    defenderPosition: AxialCoordinates,
    damage: number
  ) => {
    const hex = grid?.getHex(defenderPosition);

    if (!hex) return;

    const sprite = await renderDamage({ x: hex.x, y: hex.y }, damage);

    if (!sprite) return;

    app.stage.addChildAt(sprite, 2);

    let tick = 0;
    app.ticker.add(() => {
      app.stage.removeChild(sprite);

      if (tick > 20) {
        return;
      }

      sprite.style.fontSize = sprite.style.fontSize + tick / 20;
      sprite.x = sprite.x - tick / 80;
      sprite.y = sprite.y - tick / 10;
      sprite.alpha = 1 - tick * 0.05;

      app.stage.addChildAt(sprite, 2);
      tick++;
    });
  };

  createEffect(() => {
    props.socket()?.on("matchDamage", (data) => {
      animateDamage(data.defenderPosition, data.damage);
    });

    props.socket()?.on("matchUpdate", (data) => {
      const unitsMap = new Map<string, GameStateUnit>(data.units || []);

      update({
        activeTurn: data.activeTurn,
        gold: data.playerGold || 0,
        store: data.store || [],
        units: unitsMap,
      });

      if (state.unit) {
        setUnit(unitsMap.get(unitKey(state.unit?.state.position)) || null);
      }
    });

    onCleanup(() => {
      props.socket()?.off("matchUpdate");
    });
  });

  return <div ref={mapRef} />;
};
