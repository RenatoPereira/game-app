import { Accessor, createEffect, createSignal, Show } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { Socket } from "socket.io-client";
import { A } from "@solidjs/router";
import { useUnitContext } from "../contexts/unit.hook";
import { AmbientSound } from "~/components/ambient-sound";

type Props = {
  socket: Accessor<Socket | null>;
};

export const EndSplash = (props: Props) => {
  let splashRef: HTMLElement | undefined;

  const [winner, setWinner] = createSignal<string | undefined>();
  const { state, battle, finish } = useMatchContext();
  const { setUnit } = useUnitContext();

  createEffect(() => {
    props.socket()?.on("endGame", (data) => {
      setWinner(data.winner);
      setUnit(null);
      finish();
    });
  });

  return (
    <section ref={splashRef}>
      <Show when={state.finished}>
        <AmbientSound sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749217088/075747_inception-horn-victory-82997_ajmlq5.ogg" />

        <div
          id="splash-end"
          class="fixed w-screen h-screen top-0 left-0 z-50 bg-slate-950 flex items-center justify-center animate-[fade-in_500ms_ease-out_1_forwards]"
        >
          <h1 class="absolute top-16 w-full text-8xl text-center text-neutral-200">
            {winner() ===
            (battle.isPlayer ? battle.player?.getId() : battle.enemy?.getId())
              ? "Victory"
              : "Defeat"}
          </h1>

          <div class="relative py-20 animate-[fade-in_500ms_ease-out_1_forwards] opacity-0 flex items-center justify-end opacity-0 -skew-x-12">
            <figure class="relative z-50 flex items-end justify-start border border-indigo-950 size-64 overflow-hidden bg-slate-950">
              <img
                src={
                  battle.isPlayer
                    ? battle.player?.getAsset("splash")
                    : battle.enemy?.getAsset("splash")
                }
                class="w-full skew-x-12"
              />
            </figure>

            <span class="block absolute top-20 right-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_5_0.45s]" />

            <span class="block absolute top-20 right-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_5_0.65s]" />

            <span class="block absolute top-20 right-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_5_0.55s]" />
          </div>

          <A
            class="flex items-center justify-center absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl text-indigo-100 rounded-full size-32 border border-neutral-200/50 cursor-pointer before:content-[''] before:block before:absolute before:inset-0 before:size-full before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300 before:bg-neutral-200/25 before:easy-in-out before:rounded-full"
            href="/title"
          >
            Finish
          </A>
        </div>
      </Show>
    </section>
  );
};
