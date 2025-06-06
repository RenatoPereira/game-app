import { Accessor, batch, createEffect, Show } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { Timer } from "./timer.component";
import { Socket } from "socket.io-client";
import { definePlayer } from "~/libs/battle.service";
import { getPlayerUnitLeader } from "~/libs/unit.service";
import { AmbientSound } from "~/components/ambient-sound";
import { Character } from "~/components/character.component";
import { usePlayerContext } from "~/contexts/player.hook";
import { Title } from "@solidjs/meta";

type Props = {
  socket: Accessor<Socket | null>;
};

export const SearchingMatch = (props: Props) => {
  const { state: user } = usePlayerContext();
  const { state, cancel, start, setMap, update } = useMatchContext();

  createEffect(() => {
    props.socket()?.on("matchStart", (data) => {
      const playerLeader = getPlayerUnitLeader(data.player.id, data.units);

      const player = definePlayer(
        data.player.id,
        playerLeader.name,
        playerLeader.assets
      );

      const enemyLeader = getPlayerUnitLeader(data.enemy.id, data.units);
      const enemy = definePlayer(
        data.enemy.id,
        enemyLeader.name,
        enemyLeader.assets
      );

      batch(() => {
        setMap(data.map);
        update({
          isPlayer: data.isPlayer,
          activeTurn: data.activeTurn,
          player,
          enemy,
          gold: data.playerGold || 0,
          store: data.store || [],
          units: new Map(data.units || []),
        });
        start();
      });
    });

    props.socket()?.on("disconnect", () => {
      cancel();
    });
  });

  const onCancel = () => {
    props.socket()?.disconnect();
    cancel();
  };

  return (
    <Show when={state.searching && !state.started && !state.finished}>
      <Title>Searching a match - Game</Title>

      <AmbientSound sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749213750/match_htcrj6.ogg" />

      <div class="size-full relative flex flex-col items-center gap-y-8 p-8">
        <h1 class="text-4xl text-neutral-200 font-(family-name:--font-orbitron)">
          Searching an enemy
        </h1>

        <div class="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-y-8">
          <div class="w-72">
            <Character unit={user.hero!} />
          </div>
        </div>

        <p class="absolute top-8 left-8 text-4xl">
          <Timer />
        </p>

        <button
          class="absolute bottom-8 left-8 text-2xl text-indigo-100 rounded-full size-32 border border-neutral-200/50 cursor-pointer before:content-[''] before:block before:absolute before:inset-0 before:size-full before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300 before:bg-neutral-200/25 before:easy-in-out before:rounded-full"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </Show>
  );
};
