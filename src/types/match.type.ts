import { Player } from "~/entities/player.entity";
import { Unit } from "./unit.type";
import { AxialCoordinates } from "honeycomb-grid";

export type MapTable = {
  height: number;
  width: number;
};

export type Battle = {
  isPlayer: boolean;
  activeTurn: boolean;
  gold: number;
  player: Player | null;
  enemy: Player | null;
  units: Map<string, GameStateUnit>;
  store: Unit[];
};

export type BattleTurn = {
  moving: boolean;
};

export interface GameStateUnit {
  id: string;
  unit: Unit;
  state: GameStateUnitState;
}

export interface GameStateUnitState {
  playerId: string;
  health: number;
  experience: number;
  level: number;
  distanceCanMove: number;
  position: AxialCoordinates;
  canAttack: boolean;
}
