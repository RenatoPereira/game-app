import { Accessor, Show } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { ActionsMatch } from "./actions.component";
import { MapMatch } from "./map.component";
import { PlayersMatch } from "./players.component";
import { StartSplash } from "./start-splash.component";
import { Socket } from "socket.io-client";
import { UnitProvider } from "../contexts/unit.provider";
import { UnitDetail } from "./unit.component";
import { Title } from "@solidjs/meta";

type Props = {
  socket: Accessor<Socket | null>;
};

export const BattleMatch = (props: Props) => {
  const { state, battle } = useMatchContext();

  return (
    <section class="pt-32">
      <Show
        when={
          !state.searching &&
          state.started &&
          !state.finished &&
          battle.player &&
          battle.enemy &&
          props.socket()
        }
      >
        <Title>Battle - Game</Title>

        <UnitProvider>
          <PlayersMatch />
          <MapMatch socket={props.socket} />
          <ActionsMatch socket={props.socket} />
          <UnitDetail />
          <StartSplash />
        </UnitProvider>
      </Show>
    </section>
  );
};
