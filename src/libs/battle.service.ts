import { Player } from "~/entities/player.entity";
import { Generic } from "~/types/generic.type";

export const definePlayer = (id: string, name: string, assets: Generic) => {
  const player = new Player(id, name);

  Object.keys(assets).forEach((key) => {
    player.addAsset(key, assets[key]);
  });

  return player;
};
