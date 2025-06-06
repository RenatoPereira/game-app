import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useMatchContext } from "../contexts/match.hook";
import { AmbientSound } from "~/components/ambient-sound";

export const StartSplash = () => {
  let splashRef: HTMLElement | undefined;

  const { battle } = useMatchContext();

  const [hidden, setHidden] = createSignal(false);

  const onAnimationEnd = (event: AnimationEvent) => {
    if ((event.target as HTMLElement)?.id === "splash") {
      setHidden(true);
    }
  };

  onMount(() => {
    splashRef?.addEventListener("animationend", onAnimationEnd);

    onCleanup(() => {
      splashRef?.removeEventListener("animationend", onAnimationEnd);
    });
  });

  return (
    <section ref={splashRef}>
      <Show when={hidden()}>
        <AmbientSound
          sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749215856/battle-station-155353_wns0tp.ogg"
          loop={true}
          volume={0.4}
        />
      </Show>

      <Show when={!hidden()}>
        <AmbientSound sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749213741/battle-start_sfnrgq.ogg" />

        <div
          id="splash"
          class="fixed w-screen h-screen top-0 left-0 z-50 bg-slate-950 flex items-center justify-center animate-[fade-out_500ms_ease-out_1_1.9s_forwards]"
        >
          <h1 class="absolute top-1/2 -translate-y-1/2 w-full text-8xl text-center text-neutral-200 animate-[fade-out_500ms_ease-out_1_300ms_forwards]">
            Match founded
          </h1>

          <div class="relative overflow-hidden py-20 -skew-x-12 w-1/2 animate-[match-start-from-left_500ms_ease-out_1_500ms_forwards] opacity-0 flex items-center justify-end">
            <figure class="relative z-50 flex items-end justify-start border border-indigo-950 size-64 overflow-hidden bg-slate-950">
              <img
                src={battle.player?.getAsset("splash")}
                class="w-11/12 skew-x-12"
              />
            </figure>

            <span class="block absolute top-20 right-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_2_0.95s]" />

            <span class="block absolute top-20 right-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_2_1.15s]" />
          </div>

          <div class="relative overflow-hidden py-20 -skew-x-12 w-1/2 animate-[match-start-from-right_500ms_ease-out_1_500ms_forwards] opacity-0 flex items-center justify-start">
            <figure class="relative z-50 flex items-end justify-end justify-center border border-indigo-950 size-64 overflow-hidden bg-slate-950">
              <img
                src={battle.enemy?.getAsset("splash")}
                class="w-11/12 skew-x-12"
              />
            </figure>

            <span class="block absolute top-20 left-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_2_0.95s]" />

            <span class="block absolute top-20 left-0 size-64 bg-indigo-950/70 animate-[ping_400ms_ease-out_2_1.15s]" />
          </div>
        </div>
      </Show>
    </section>
  );
};
