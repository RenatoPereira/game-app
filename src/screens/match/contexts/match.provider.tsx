import { createStore } from "solid-js/store";
import {
  BATTLE_INITIAL_STATE,
  MAP_INITIAL_STATE,
  MATCH_INITIAL_STATE,
  MatchContext,
} from "./match.context";
import { JSX } from "solid-js";
import { Battle, BattleTurn, MapTable } from "~/types/match.type";

type Props = {
  initialValue?: typeof MATCH_INITIAL_STATE;
  children: JSX.Element;
};

export const MatchProvider = (props: Props) => {
  const [state, setState] = createStore(
    props.initialValue || {
      ...MATCH_INITIAL_STATE,
    }
  );

  const [battle, setBattle] = createStore<Battle>({
    ...BATTLE_INITIAL_STATE,
  });

  const [map, setMap] = createStore<MapTable>({
    ...MAP_INITIAL_STATE,
  });

  const [turn, setTurn] = createStore<BattleTurn>({
    moving: true,
  });

  const match = {
    state,
    battle,
    map,
    turn,
    search: () => {
      setState(() => ({
        ...MATCH_INITIAL_STATE,
        searching: true,
      }));
    },
    start: () => {
      setState(() => ({
        ...MATCH_INITIAL_STATE,
        started: true,
      }));
    },
    finish: () => {
      setState(() => ({
        ...MATCH_INITIAL_STATE,
        finished: true,
      }));
    },
    cancel: () => {
      setState(() => ({ ...MATCH_INITIAL_STATE }));
    },
    update: (state: Partial<Battle>) => {
      setBattle((value) => ({
        ...value,
        ...state,
      }));
    },
    setMap: (map: MapTable) => {
      setMap(() => ({
        ...map,
      }));
    },
    updateTurn: (state: Partial<BattleTurn>) => {
      setTurn((value) => ({
        ...value,
        ...state,
      }));
    },
  };

  return (
    <MatchContext.Provider value={match}>
      {props.children}
    </MatchContext.Provider>
  );
};
