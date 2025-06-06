import { useContext } from "solid-js";
import { UnitContext } from "./unit.context";

export const useUnitContext = () => {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error("useMatchContext: cannot find a MatchContext");
  }

  return context;
};
