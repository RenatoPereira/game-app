import { useContext } from "solid-js";
import { PlayerContext } from "./player.context";

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayerContext: cannot find a MatchContext");
  }

  return context;
};
