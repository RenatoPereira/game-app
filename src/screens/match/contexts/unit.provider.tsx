import { createStore } from "solid-js/store";
import { JSX } from "solid-js";
import { UNIT_INITIAL_STATE, UnitContext, UnitState } from "./unit.context";
import { GameStateUnit } from "~/types/match.type";

type Props = {
  children: JSX.Element;
};

export const UnitProvider = (props: Props) => {
  const [state, setState] = createStore<UnitState>(UNIT_INITIAL_STATE);

  const unit = {
    state,
    setUnit: (value: GameStateUnit | null) => {
      setState(() => ({
        unit: value,
      }));
    },
  };

  return (
    <UnitContext.Provider value={unit}>{props.children}</UnitContext.Provider>
  );
};
