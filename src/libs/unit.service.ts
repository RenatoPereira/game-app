import { AxialCoordinates } from "honeycomb-grid";
import { Unit } from "~/types/unit.type";

export const unitKey = (point: AxialCoordinates) => {
  return `${point.q},${point.r}`;
};

export const getPlayerUnitLeader = (playerId: string, units: any[]) => {
  const leader = units.find((item) => {
    return item[1]?.state?.playerId === playerId;
  });

  if (leader) {
    return leader[1].unit;
  }
};
