import { createContext } from "solid-js";
import { GameStateUnit } from "~/types/match.type";

export type UnitState = {
  unit: GameStateUnit | null;
};

export const UNIT_INITIAL_STATE: UnitState = {
  unit: null,
};

const INITIAL_STORE_SETTER = {
  setUnit: (value: GameStateUnit | null) => {},
};

export const UnitContext = createContext({
  state: { ...UNIT_INITIAL_STATE },
  ...INITIAL_STORE_SETTER,
});
