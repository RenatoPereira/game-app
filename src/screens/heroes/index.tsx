import { For, Show } from "solid-js";
import { BackgroundAnimated } from "~/components/background-animated";
import { AmbientSound } from "~/components/ambient-sound";
import { A } from "@solidjs/router";
import { IoExitOutline } from "solid-icons/io";
import { usePlayerContext } from "~/contexts/player.hook";
import { Character } from "~/components/character.component";

type Props = {
  units: any;
};

export const HeroesScreen = (props: Props) => {
  const { state, setHero } = usePlayerContext();

  return (
    <main class="w-screen h-screen overflow-x-hidden flex flex-col items-center">
      <AmbientSound
        sound="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749213749/title_f7outf.ogg"
        loop={true}
        volume={0.7}
      />
      <BackgroundAnimated video="https://res.cloudinary.com/dyfphd7ir/video/upload/v1749211392/title_zpb4bz.webm" />

      <h1 class="text-4xl text-neutral-200 font-(family-name:--font-orbitron) pt-8">
        Choose my hero
      </h1>

      <div class="text-lg text-neutral-2 absolute left-8 top-8">
        <A
          href="/title"
          class="flex gap-2 items-center hover:-translate-x-2 transition ease-in-out duration-300"
        >
          <IoExitOutline size={24} class="rotate-180" /> Leave
        </A>
      </div>

      <Show when={props.units}>
        <section class="size-full flex items-center justify-center gap-4 p-8">
          <For each={Object.keys(props.units || {})}>
            {(item, index) => {
              const unit = props.units[item];
              return (
                <div class="w-64">
                  <Character unit={unit} />
                </div>
              );
            }}
          </For>
        </section>
      </Show>

      <Show when={state.hero}>
        <A
          class="flex items-center justify-center absolute bottom-8 right-8 text-2xl text-indigo-100 font-(family-name:--font-orbitron) text-center rounded-full size-32 border border-neutral-200/50 cursor-pointer before:content-[''] before:block before:absolute before:inset-0 before:size-full before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300 before:bg-neutral-200/25 before:easy-in-out before:rounded-full"
          href="/match"
        >
          Find match
        </A>
      </Show>
    </main>
  );
};
