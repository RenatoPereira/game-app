import { useContext } from "solid-js";
import { MatchContext } from "./match.context";

export const useMatchContext = () => {
  const context = useContext(MatchContext);

  if (!context) {
    throw new Error("useMatchContext: cannot find a MatchContext");
  }

  return context;
};
