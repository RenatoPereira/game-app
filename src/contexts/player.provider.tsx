import { createStore } from "solid-js/store";
import { JSX } from "solid-js";
import {
  PlayerContext,
  PLAYER_INITIAL_STATE,
  PlayerState,
} from "./player.context";
import { Unit } from "~/types/unit.type";

type Props = {
  children: JSX.Element;
};

export const PlayerProvider = (props: Props) => {
  const [state, setState] = createStore<PlayerState>(PLAYER_INITIAL_STATE);

  const player = {
    state,
    setName: (value: string) => {
      setState(() => ({
        name: value,
      }));
    },
    setHero: (value: Unit) => {
      setState(() => ({
        hero: value,
      }));
    },
  };

  return (
    <PlayerContext.Provider value={player}>
      {props.children}
    </PlayerContext.Provider>
  );
};
