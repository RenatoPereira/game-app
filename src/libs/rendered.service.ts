import { Point } from "honeycomb-grid";
import {
  Assets,
  Graphics,
  GraphicsContext,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";
import { Tile } from "~/entities/tile.entity";

export const renderUnit = async (tile: Tile) => {
  const texture = await Assets.load(
    tile.unit.unit.assets?.sprite || "/images/characters/claude/sprite.png"
  );

  const unitSprite = Sprite.from(texture);
  const position = {
    x: tile.x - tile.dimensions.xRadius / 2,
    y: tile.y - tile.dimensions.yRadius / 2,
  };
  unitSprite.eventMode = "static";
  unitSprite.position.set(position.x, position.y);
  unitSprite.width = tile.dimensions.xRadius;
  unitSprite.height = tile.dimensions.yRadius;

  const path = pointsToPath(tile.corners);

  const moveGraphContext = new GraphicsContext()
    .poly(path)
    .fill({ color: 0x00b4d8, alpha: 0.2 })
    .moveTo(position.x, position.y);

  const baseMoveGraph = new Graphics(moveGraphContext);

  const attackGraphContext = new GraphicsContext()
    .poly(path)
    .fill({ color: 0xf01e2c, alpha: 0.2 })
    .moveTo(position.x, position.y);

  const baseAttackGraph = new Graphics(attackGraphContext);

  return {
    sprite: unitSprite,
    baseMovement: baseMoveGraph,
    baseAttack: baseAttackGraph,
  };
};

export const renderDamage = async (defenderPosition: Point, damage: number) => {
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 18,
    fill: 0xf01e2c,
  });

  const text = new Text({ text: String(-damage), style });

  text.x = defenderPosition.x - text.width / 2;
  text.y = defenderPosition.y - text.height;
  text.style.fontSize = 19;

  return text;
};

export const pointsToPath = (points: Point[]) => {
  const path: number[] = [];

  points.forEach((p) => {
    path.push(p.x);
    path.push(p.y);
  });

  return path;
};
export const getTileColor = (tile: Tile, playerId: string) => {
  let color = 0xffffff;

  if (tile.unit) {
    if (playerId === tile.unit.state.playerId) {
      color = 0x00b4d8;
    } else {
      color = 0xf01e2c;
    }
  }

  return color;
};
