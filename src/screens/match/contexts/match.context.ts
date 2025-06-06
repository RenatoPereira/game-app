import { createContext } from "solid-js";
import {
  Battle,
  BattleTurn,
  GameStateUnit,
  MapTable,
} from "~/types/match.type";
import { Unit } from "~/types/unit.type";

export const MATCH_INITIAL_STATE = {
  searching: false,
  started: false,
  finished: false,
};

export const BATTLE_INITIAL_STATE: Battle = {
  isPlayer: true,
  activeTurn: false,
  gold: 0,
  player: null,
  enemy: null,
  units: new Map<string, GameStateUnit>(),
  store: new Array<Unit>(),
};

export const TURN_INITIAL_STATE: BattleTurn = {
  moving: false,
};

export const MAP_INITIAL_STATE: MapTable = {
  height: 12,
  width: 20,
};

const INITIAL_STORE_SETTER = {
  search: () => {},
  start: () => {},
  finish: () => {},
  cancel: () => {},

  update: (value: Partial<Battle>) => {},
  setMap: (value: MapTable) => {},
  updateTurn: (value: Partial<BattleTurn>) => {},
};

export const MatchContext = createContext({
  state: MATCH_INITIAL_STATE,
  battle: BATTLE_INITIAL_STATE,
  map: MAP_INITIAL_STATE,
  turn: TURN_INITIAL_STATE,
  ...INITIAL_STORE_SETTER,
});
