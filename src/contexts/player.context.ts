import { createContext } from "solid-js";
import { Unit } from "~/types/unit.type";

export type PlayerState = {
  name: string;
  hero: Unit | null;
};

export const PLAYER_INITIAL_STATE: PlayerState = {
  name: "Undefined name",
  hero: null,
};

const INITIAL_STORE_SETTER = {
  setName: (value: string) => {},
  setHero: (unit: Unit) => {},
};

export const PlayerContext = createContext({
  state: PLAYER_INITIAL_STATE,
  ...INITIAL_STORE_SETTER,
});
